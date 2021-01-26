import {MetaTransformer} from "../../MetaTransformer";
import {DecoratorType} from "../../enums/DecoratorType";

export function Exclude(): Function {
    return function (target: Object, propertyKey: string | symbol): void {
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
