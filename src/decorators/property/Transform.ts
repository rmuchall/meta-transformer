import {MetaTransformer} from "../../MetaTransformer.js";
import {ClassType} from "../../interfaces/ClassType.js";
import {DecoratorType} from "../../enums/DecoratorType.js";
import {TransformOptions} from "../../interfaces/TransformOptions.js";

export function Transform(transformType: ClassType, transformOptions: TransformOptions = {}): PropertyDecorator {
    return (target, propertyKey) => {
        MetaTransformer.addMetadata({
            // Metadata
            target: target,
            propertyKey: propertyKey.toString(),
            // Context
            decoratorType: DecoratorType.Transform,
            className: target.constructor.name,
            transformType: transformType,
            isNullable: transformOptions.isNullable
        });
    };
}
