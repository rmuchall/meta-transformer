import {ClassType} from "./ClassType.js";
import {DecoratorType} from "../enums/DecoratorType.js";

export interface TransformContext {
    // Metadata
    target: Object;
    propertyKey: string;
    // Context
    decoratorType: DecoratorType;
    className: string;
    transformType?: ClassType;
    isNullable?: boolean;
}
