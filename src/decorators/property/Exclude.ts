import {MetaTransformer} from "../../MetaTransformer.js";
import {DecoratorType} from "../../enums/DecoratorType.js";

export function Exclude(): PropertyDecorator {
    return (target, propertyKey) => {
        MetaTransformer.addMetadata({
            // Metadata
            target: target,
            propertyKey: propertyKey.toString(),
            // Context
            decoratorType: DecoratorType.Exclude,
            className: target.constructor.name,
            transformType: undefined
        });
    };
}
