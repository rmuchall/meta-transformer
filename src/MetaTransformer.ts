import {TransformContext} from "./interfaces/TransformContext.js";
import {Metadata} from "./interfaces/Metadata.js";
import {ClassType} from "./interfaces/ClassType.js";
import {DecoratorType} from "./enums/DecoratorType.js";

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
        const classTypeNames = MetaTransformer.getClassTypeNames(classInstance);
        const metadataKeys = Object.keys(MetaTransformer.metadata);
        const metadataIntersection = classTypeNames.filter(element => metadataKeys.includes(element));

        // Check for circular dependencies
        if (MetaTransformer.circularCheck.has(obj)) {
            throw new Error("Object has a circular dependency");
        }
        MetaTransformer.circularCheck.add(obj);

        // No class metadata
        if (metadataIntersection.length === 0) {
            // All primitive types
            return Object.assign(new classType(), obj) as T;
        }

        for (const propertyKey of Object.keys(obj)) {
            // search for transform context
            const foundMetadataKeys = metadataIntersection.filter(value => Object.prototype.hasOwnProperty.call(MetaTransformer.metadata[value], propertyKey));
            if (foundMetadataKeys.length > 1) {
                throw new Error("Multiple conflicting transformer contexts found");
            }

            if (foundMetadataKeys.length === 1) {
                const transformContext = MetaTransformer.metadata[foundMetadataKeys[0]][propertyKey];
                switch (transformContext.decoratorType) {
                    case DecoratorType.Exclude:
                        continue;
                    case DecoratorType.Transform:
                        if (!transformContext.transformType) {
                            throw new Error("Missing transformType from transformContext");
                        }

                        // Skip if isNullable and property is undefined or null
                        if (transformContext.isNullable) {
                            // Property is defined and null
                            if (obj[transformContext.propertyKey] === null) {
                                classInstance[propertyKey] = null;
                                continue;
                            }

                            // Property is undefined
                            if (obj[transformContext.propertyKey] === undefined) {
                                continue;
                            }
                        }

                        // Transform
                        if (Array.isArray(obj[transformContext.propertyKey])) {
                            // Array
                            classInstance[transformContext.propertyKey] = MetaTransformer.transformArray(transformContext.transformType, obj[transformContext.propertyKey]);
                        } else {
                            // Nested complex type
                            classInstance[transformContext.propertyKey] = MetaTransformer.transformObject(transformContext.transformType, obj[transformContext.propertyKey]);
                        }
                        break;
                    default:
                        throw new Error("Invalid decoratorType");
                }
            } else {
                // No metadata - primitive type
                classInstance[propertyKey] = obj[propertyKey];
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
            throw new Error("Conflicting transform contexts");
        }
    }

    static clearMetadata(): void {
        MetaTransformer.metadata = {};
    }

    static getClassTypeNames(classInstance: Record<string, any>): string[] {
        const classTypeNames: string[] = [];
        classTypeNames.push(classInstance.constructor.name);

        let proto: any = classInstance["__proto__"].constructor;
        do {
            proto = proto.__proto__;
            if (proto.name !== "") {
                classTypeNames.push(proto.name);
            }
        } while (proto.name !== "");

        return classTypeNames;
    }
}
