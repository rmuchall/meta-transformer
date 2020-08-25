import {MetaTransformer} from "../../MetaTransformer";
import {ClassType} from "../../interfaces/ClassType";

export function TransformType(transformType: ClassType): Function {
    return function (target: Object, propertyKey: string | symbol): void {
        MetaTransformer.addMetadata({
            target: target,
            className: target.constructor.name,
            propertyKey: propertyKey.toString(),
            transformType: transformType
        });
    };
}
