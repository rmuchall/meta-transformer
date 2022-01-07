import {MetaTransformer} from "../../MetaTransformer";
import {ClassType} from "../../interfaces/ClassType";
import {DecoratorType} from "../../enums/DecoratorType";
import {TransformOptions} from "../../interfaces/TransformOptions";

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
