import {TransformContext} from "./interfaces/TransformContext";
import {Metadata} from "./interfaces/Metadata";
import {ClassType} from "./interfaces/ClassType";
import {DecoratorType} from "./enums/DecoratorType";

export abstract class MetaTransformer {
    private static metadata: Record<string, Metadata> = {};
    private static circularCheck: Set<Record<string, any>> = new Set<Record<string, any>>();

    static toClass<T>(classType: ClassType, obj: Record<string, any>[]): T[]
    static toClass<T>(classType: ClassType, obj: Record<string, any>): T
    static toClass<T>(classType: ClassType, obj: Record<string, any> | Record<string, any>[]): T | T[] {
        MetaTransformer.circularCheck.clear();

        if (Array.isArray(obj)) {
            return MetaTransformer.transformArray(classType, obj);
        }

        return MetaTransformer.transformObject(classType, obj);
    }

    private static transformObject<T>(classType: ClassType, obj: Record<string, any>): T {
        const classInstance = new classType();
        const className = classInstance.constructor.name;

        // Check for circular dependencies
        if (MetaTransformer.circularCheck.has(obj)) {
            throw new Error("Object has a circular dependency");
        }
        MetaTransformer.circularCheck.add(obj);

        // No class metadata
        if (!MetaTransformer.metadata[className]) {
            // All primitive types
            return Object.assign(new classType(), obj) as T;
        }

        for (const propertyKey of Object.keys(obj)) {
            // No property metadata
            if (!MetaTransformer.metadata[className][propertyKey]) {
                // Primitive type
                classInstance[propertyKey] = obj[propertyKey];
                continue;
            }

            const transformContext: TransformContext = MetaTransformer.metadata[className][propertyKey];
            if (transformContext.decoratorType === DecoratorType.Exclude) {
                // Exclude
                continue;
            }

            if (!transformContext.transformType) {
                throw new Error("Missing transformType from transformContext");
            }

            // Transform
            if (Array.isArray(obj[transformContext.propertyKey])) {
                // Array
                classInstance[transformContext.propertyKey] = MetaTransformer.transformArray(transformContext.transformType, obj[transformContext.propertyKey]);
            } else {
                // Nested complex type
                classInstance[transformContext.propertyKey] = MetaTransformer.transformObject(transformContext.transformType, obj[transformContext.propertyKey]);
            }
        }

        return classInstance as T;
    }

    private static transformArray<T>(classType: ClassType, plainArray: Record<string, any>[]): T[] {
        const transformedArray: T[] = [];
        for (const obj of plainArray) {
            transformedArray.push(MetaTransformer.transformObject(classType, obj));
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
