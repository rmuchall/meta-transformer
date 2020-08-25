import {MetaTransformer} from "../src/MetaTransformer";
import {TransformType} from "../src/decorators/property/TransformType";

beforeEach(MetaTransformer.clearMetadata);

test("primitive types", () => {
    class Widget {
        name: string;
        color: string;
        model: number;
    }

    const classInstance: Widget = MetaTransformer.plain2Class<Widget>(Widget, {
        name: "Doodad",
        color: "Blue",
        model: 1234
    });

    expect(classInstance.name).toEqual("Doodad");
    expect(classInstance.color).toEqual("Blue");
    expect(classInstance.model).toEqual(1234);
    expect(classInstance).toBeInstanceOf(Widget);
});

test("arrays", () => {
    class Widget {
        name: string;
        color: string;
        model: number;
    }

    const classArray: Widget[] = MetaTransformer.plain2Class<Widget>(Widget, [
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

    expect(classArray[0].name).toEqual("Doodad");
    expect(classArray[0].color).toEqual("Blue");
    expect(classArray[0].model).toEqual(1234);
    expect(classArray[0]).toBeInstanceOf(Widget);

    expect(classArray[1].name).toEqual("Thing");
    expect(classArray[1].color).toEqual("Red");
    expect(classArray[1].model).toEqual(9876);
    expect(classArray[1]).toBeInstanceOf(Widget);
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

        @TransformType(WidgetDetail)
        detail: WidgetDetail = new WidgetDetail();
    }

    const classInstance: Widget = MetaTransformer.plain2Class<Widget>(Widget, {
        name: "Doodad",
        color: "Blue",
        model: 1234,
        detail: {
            material: "Plastic",
            shape: "Square"
        }
    });

    expect(classInstance).toBeInstanceOf(Widget);
    expect(classInstance.name).toEqual("Doodad");
    expect(classInstance.color).toEqual("Blue");
    expect(classInstance.model).toEqual(1234);
    expect(classInstance.detail).toBeInstanceOf(WidgetDetail);
    expect(classInstance.detail.material).toEqual("Plastic");
    expect(classInstance.detail.shape).toEqual("Square");
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

        @TransformType(WidgetDetail)
        detail: WidgetDetail[];
    }

    const classInstance: Widget = MetaTransformer.plain2Class<Widget>(Widget, {
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

    const classInstance = MetaTransformer.plain2Class<Widget>(Widget, {
        name: "Doodad",
        color: "Blue",
        model: 1234,
        extraneous: "allowed"
    });

    expect((classInstance as any).extraneous).toEqual("allowed");
});
