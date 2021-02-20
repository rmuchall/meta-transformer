import {MetaTransformer} from "../../MetaTransformer";
import {ClassType} from "../../interfaces/ClassType";
import {DecoratorType} from "../../enums/DecoratorType";

export function Transform(transformType: ClassType): PropertyDecorator {
    return (target, propertyKey) => {
        MetaTransformer.addMetadata({
            // Metadata
            target: target,
            propertyKey: propertyKey.toString(),
            // Context
            decoratorType: DecoratorType.Transform,
            className: target.constructor.name,
            transformType: transformType
        });
    };
}
