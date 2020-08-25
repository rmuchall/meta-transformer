import {ClassType} from "./ClassType";

export interface TransformContext {
    // Metadata
    target: Object;
    propertyKey: string;
    // Context
    className: string;
    transformType: ClassType
}
