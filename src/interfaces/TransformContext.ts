import {ClassType} from "./ClassType";
import {DecoratorType} from "../enums/DecoratorType";

export interface TransformContext {
    // Metadata
    target: Object;
    propertyKey: string;
    // Context
    decoratorType: DecoratorType;
    className: string;
    transformType?: ClassType
}
