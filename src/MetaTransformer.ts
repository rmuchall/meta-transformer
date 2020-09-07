import {TransformContext} from "./interfaces/TransformContext";
import {Metadata} from "./interfaces/Metadata";
import {ClassType} from "./interfaces/ClassType";

export abstract class MetaTransformer {
    private static metadata: Record<string, Metadata> = {};
    private static circularCheck: Set<Record<string, any>> = new Set<Record<string, any>>();

    static plain2Class<T>(classType: ClassType, plainObj: Record<string, any>[]): T[]
    static plain2Class<T>(classType: ClassType, plainObj: Record<string, any>): T
    static plain2Class<T>(classType: ClassType, plainObj: Record<string, any> | Record<string, any>[]): T | T[] {
        MetaTransformer.circularCheck.clear();

        if (Array.isArray(plainObj)) {
            return MetaTransformer.transformArray(classType, plainObj);
        }

        return MetaTransformer.transformObject(classType, plainObj);
    }

    private static transformObject<T>(classType: ClassType, plainObj: Record<string, any>): T {
        const classInstance = new classType();
        const className = classInstance.constructor.name;

        // Check for circular dependencies
        if (MetaTransformer.circularCheck.has(plainObj)) {
            throw new Error("Plain object has a circular dependency");
        }
        MetaTransformer.circularCheck.add(plainObj);

        // No class metadata
        if (!MetaTransformer.metadata[className]) {
            // All primitive types
            return Object.assign(new classType(), plainObj) as T;
        }

        for (const propertyKey of Object.keys(plainObj)) {
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

        return classInstance as T;
    }

    private static transformArray<T>(classType: ClassType, plainArray: Record<string, any>[]): T[] {
        const transformedArray: T[] = [];
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
