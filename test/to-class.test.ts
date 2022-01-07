import {MetaTransformer} from "../src/MetaTransformer";
import {Transform} from "../src/decorators/property/Transform";

beforeEach(MetaTransformer.clearMetadata);

test("primitive types", () => {
    class Widget {
        name: string;
        model: number;
        created: Date;
    }

    const classInstance: Widget = MetaTransformer.toClass<Widget>(Widget, {
        name: "Doodad",
        model: 1234,
        created: new Date()
    });

    expect.assertions(5);
    expect(classInstance.name).toEqual("Doodad");
    expect(classInstance.model).toEqual(1234);
    expect(classInstance.created).toBeInstanceOf(Date);
    expect(isNaN(classInstance.created.valueOf())).toBeFalsy();
    expect(classInstance).toBeInstanceOf(Widget);
});

test("arrays", () => {
    class Widget {
        name: string;
        color: string;
        model: number;
    }

    const classArray: Widget[] = MetaTransformer.toClass<Widget>(Widget, [
            {
                name: "Doodad",
                color: "Blue",
                model: 1234
            },
            {
                name: "Thing",
                color: "Red",
                model: 9876
            }
        ]
    );

    expect.assertions(8);
    expect(classArray[0]).toBeInstanceOf(Widget);
    expect(classArray[0].name).toEqual("Doodad");
    expect(classArray[0].color).toEqual("Blue");
    expect(classArray[0].model).toEqual(1234);

    expect(classArray[1]).toBeInstanceOf(Widget);
    expect(classArray[1].name).toEqual("Thing");
    expect(classArray[1].color).toEqual("Red");
    expect(classArray[1].model).toEqual(9876);
});

test("nested complex types", () => {
    class WidgetDetail {
        material: string;
        shape: string;
    }

    class Widget {
        name: string;
        color: string;
        model: number;

        @Transform(WidgetDetail)
        detail: WidgetDetail;

        @Transform(WidgetDetail, {isNullable: true})
        nullDetail?: WidgetDetail;

        @Transform(WidgetDetail, {isNullable: true})
        undefinedDetail?: WidgetDetail;
    }

    const classInstance: Widget = MetaTransformer.toClass<Widget>(Widget, {
        name: "Doodad",
        color: "Blue",
        model: 1234,
        detail: {
            material: "Plastic",
            shape: "Square"
        },
        nullDetail: null
    });

    expect.assertions(9);
    expect(classInstance).toBeInstanceOf(Widget);
    expect(classInstance.name).toEqual("Doodad");
    expect(classInstance.color).toEqual("Blue");
    expect(classInstance.model).toEqual(1234);
    expect(classInstance.detail).toBeInstanceOf(WidgetDetail);
    expect(classInstance.detail.material).toEqual("Plastic");
    expect(classInstance.detail.shape).toEqual("Square");
    expect(classInstance.nullDetail).toBeNull();
    expect(classInstance.undefinedDetail).toBeUndefined();
});

test("nested arrays", () => {
    class WidgetDetail {
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
    expect(classInstance.detail[0].material).toEqual("Plastic");
    expect(classInstance.detail[0].shape).toEqual("Square");

    expect(classInstance.detail[1]).toBeInstanceOf(WidgetDetail);
    expect(classInstance.detail[1].material).toEqual("Metal");
    expect(classInstance.detail[1].shape).toEqual("Circle");
});

test("allow extraneous properties", () => {
    class Widget {
        name: string;
        color: string;
        model: number;
    }

    const classInstance = MetaTransformer.toClass<Widget>(Widget, {
        name: "Doodad",
        color: "Blue",
        model: 1234,
        extraneous: "allowed"
    });

    expect.assertions(1);
    expect((classInstance as any).extraneous).toEqual("allowed");
});
