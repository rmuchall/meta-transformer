import {TransformContext} from "./interfaces/TransformContext";
import {Metadata} from "./interfaces/Metadata";
import {ClassType} from "./interfaces/ClassType";

export class MetaTransformer {
    private static metadata: Record<string, Metadata> = {};

    static plain2Class<V>(classType: ClassType, plainObj: Record<string, any>[]): V[]
    static plain2Class<V>(classType: ClassType, plainObj: Record<string, any>): V
    static plain2Class<V>(classType: ClassType, plainObj: Record<string, any> | Record<string, any>[]): V | V[] {
        const classInstance = new classType();
        const className = classInstance.constructor.name;

        if (Array.isArray(plainObj)) {
            return MetaTransformer.transformArray(classType, plainObj);
        }

        return MetaTransformer.transformObject(classType, plainObj);
    }

    private static transformObject<V extends Record<string, any>>(classType: ClassType, plainObj: Record<string, any>): V {
        const classInstance = new (classType as any)();
        const className = classInstance.constructor.name;

        /*
        // Check for extraneous properties
        for (const propertyKey of Object.keys(plainObj)) {
            if (!Object.prototype.hasOwnProperty.call(classInstance, propertyKey)) {
                throw new Error(`Extraneous property [${propertyKey}] found in plain object`);
            }
        }
        */

        for (const propertyKey of Object.keys(plainObj)) {
            // No class metadata
            if (!MetaTransformer.metadata[className]) {
                // Primitive type
                classInstance[propertyKey] = plainObj[propertyKey];
                continue;
            }

            // No property metadata
            if (!MetaTransformer.metadata[className][propertyKey]) {
                // Primitive type
                classInstance[propertyKey] = plainObj[propertyKey];
                continue;
            }

            const transformContext: TransformContext = MetaTransformer.metadata[className][propertyKey];
            if (Array.isArray(plainObj[transformContext.propertyKey])) {
                // Array
                classInstance[transformContext.propertyKey] = MetaTransformer.transformArray(transformContext.transformType, plainObj[transformContext.propertyKey]);
            } else {
                // Nested complex type
                classInstance[transformContext.propertyKey] = MetaTransformer.transformObject(transformContext.transformType, plainObj[transformContext.propertyKey]);
            }
        }

        return classInstance;
    }

    private static transformArray<V>(classType: ClassType, plainArray: Record<string, any>[]): V[] {
        const transformedArray: V[] = [];
        for (const plainObj of plainArray) {
            transformedArray.push(MetaTransformer.transformObject(classType, plainObj));
        }

        return transformedArray;
    }

    static addMetadata(context: TransformContext): void {
        if (!MetaTransformer.metadata[context.className]) {
            MetaTransformer.metadata[context.className] = {};
        }

        if (!MetaTransformer.metadata[context.className][context.propertyKey]) {
            MetaTransformer.metadata[context.className][context.propertyKey] = context;
        } else {
            throw new Error("Multiple transform contexts");
        }
    }

    static clearMetadata(): void {
        MetaTransformer.metadata = {};
    }
}
