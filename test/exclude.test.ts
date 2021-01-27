import {Exclude} from "../src/decorators/property/Exclude";
import {MetaTransformer} from "../src/MetaTransformer";
import {Transform} from "../src/decorators/property/Transform";

beforeEach(MetaTransformer.clearMetadata);

test("exclude properties", () => {
    class Widget {
        name: string;
        color: string;

        @Exclude()
        model: number;
    }

    const classInstance = MetaTransformer.toClass<Widget>(Widget, {
        name: "Doodad",
        color: "Blue",
        model: 1234
    });

    expect.assertions(3);
    expect(classInstance.name).toEqual("Doodad");
    expect(classInstance.color).toEqual("Blue");
    expect(classInstance.model).toBeUndefined();
});

test("exclude abstract properties", () => {
    abstract class CoreWidget {
        test: string;
    }

    abstract class BaseWidget extends CoreWidget {
        @Exclude()
        id: string;

        created: string;
    }

    class Widget extends BaseWidget {
        name: string;
        color: string;
        model: number;
    }

    const classInstance = MetaTransformer.toClass<Widget>(Widget, {
        id: "xxx-1234-yyy",
        created: "01/01/00",
        name: "Doodad",
        color: "Blue",
        model: 1234
    });

    expect.assertions(5);
    expect(classInstance.id).toBeUndefined();
    expect(classInstance.created).toEqual("01/01/00");
    expect(classInstance.name).toEqual("Doodad");
    expect(classInstance.color).toEqual("Blue");
    expect(classInstance.model).toEqual(1234);
});

test("exclude arrays", () => {
    class WidgetDetail {
        @Exclude()
        material: string;

        shape: string;
    }

    class Widget {
        name: string;
        color: string;
        model: number;

        @Transform(WidgetDetail)
        detail: WidgetDetail;
    }

    const classArray: Widget[] = MetaTransformer.toClass<Widget>(Widget, [
            {
                name: "Doodad",
                color: "Blue",
                model: 1234,
                detail: {
                    material: "Plastic",
                    shape: "Square"
                }
            },
            {
                name: "Thing",
                color: "Red",
                model: 9876,
                detail: {
                    material: "Plastic",
                    shape: "Circle"
                }
            }
        ]
    );

    expect.assertions(14);
    expect(classArray[0]).toBeInstanceOf(Widget);
    expect(classArray[0].name).toEqual("Doodad");
    expect(classArray[0].color).toEqual("Blue");
    expect(classArray[0].model).toEqual(1234);

    expect(classArray[0].detail).toBeInstanceOf(WidgetDetail);
    expect(classArray[0].detail.material).toBeUndefined();
    expect(classArray[0].detail.shape).toEqual("Square");

    expect(classArray[1]).toBeInstanceOf(Widget);
    expect(classArray[1].name).toEqual("Thing");
    expect(classArray[1].color).toEqual("Red");
    expect(classArray[1].model).toEqual(9876);

    expect(classArray[1].detail).toBeInstanceOf(WidgetDetail);
    expect(classArray[1].detail.material).toBeUndefined();
    expect(classArray[1].detail.shape).toEqual("Circle");
});

test("exclude nested arrays", () => {
    class WidgetDetail {
        @Exclude()
        material: string;

        shape: string;
    }

    class Widget {
        name: string;
        color: string;
        model: number;

        @Transform(WidgetDetail)
        detail: WidgetDetail[];
    }

    const classInstance: Widget = MetaTransformer.toClass<Widget>(Widget, {
        name: "Doodad",
        color: "Blue",
        model: 1234,
        detail: [
            {
                material: "Plastic",
                shape: "Square"
            },
            {
                material: "Metal",
                shape: "Circle"
            },
        ]
    });

    expect.assertions(10);
    expect(classInstance).toBeInstanceOf(Widget);
    expect(classInstance.name).toEqual("Doodad");
    expect(classInstance.color).toEqual("Blue");
    expect(classInstance.model).toEqual(1234);

    expect(classInstance.detail[0]).toBeInstanceOf(WidgetDetail);
    expect(classInstance.detail[0].material).toBeUndefined();
    expect(classInstance.detail[0].shape).toEqual("Square");

    expect(classInstance.detail[1]).toBeInstanceOf(WidgetDetail);
    expect(classInstance.detail[1].material).toBeUndefined();
    expect(classInstance.detail[1].shape).toEqual("Circle");
});

