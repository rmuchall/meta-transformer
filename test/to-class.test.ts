import {test, beforeEach} from "tap";
import {MetaTransformer} from "../src/MetaTransformer.js";
import {Transform} from "../src/decorators/property/Transform.js";

beforeEach(MetaTransformer.clearMetadata);

void test("primitive types", t => {
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

    t.type(classInstance, Widget);
    t.equal(classInstance.name, "Doodad");
    t.equal(classInstance.model, 1234);
    t.type(classInstance.created, Date);
    t.notOk(isNaN(classInstance.created.valueOf()));
    t.end();
});

void test("arrays", t => {
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

    t.type(classArray[0], Widget);
    t.equal(classArray[0].name, "Doodad");
    t.equal(classArray[0].color, "Blue");
    t.equal(classArray[0].model, 1234);

    t.type(classArray[1], Widget);
    t.equal(classArray[1].name, "Thing");
    t.equal(classArray[1].color, "Red");
    t.equal(classArray[1].model, 9876);
    t.end();
});

void test("nested complex types", t => {
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
        nullDetailWithValue?: WidgetDetail;

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
        nullDetailWithValue: {
            material: "Plastic",
            shape: "Square"
        },
        nullDetail: null
    });

    t.type(classInstance, Widget);
    t.equal(classInstance.name, "Doodad");
    t.equal(classInstance.color, "Blue");
    t.equal(classInstance.model, 1234);
    t.type(classInstance.detail, WidgetDetail);
    t.equal(classInstance.detail.material, "Plastic");
    t.equal(classInstance.detail.shape, "Square");
    t.type(classInstance.nullDetailWithValue, WidgetDetail);
    t.equal(classInstance.nullDetailWithValue!.material, "Plastic");
    t.equal(classInstance.nullDetailWithValue!.shape, "Square");
    t.equal(classInstance.nullDetail, null);
    t.equal(classInstance.undefinedDetail, undefined);
    t.end();
});

void test("nested arrays", t => {
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

    t.type(classInstance, Widget);
    t.equal(classInstance.name, "Doodad");
    t.equal(classInstance.color, "Blue");
    t.equal(classInstance.model, 1234);

    t.type(classInstance.detail[0], WidgetDetail);
    t.equal(classInstance.detail[0].material, "Plastic");
    t.equal(classInstance.detail[0].shape, "Square");

    t.type(classInstance.detail[1], WidgetDetail);
    t.equal(classInstance.detail[1].material, "Metal");
    t.equal(classInstance.detail[1].shape, "Circle");
    t.end();
});

void test("allow extraneous properties", t => {
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

    t.equal((classInstance as any).extraneous, "allowed");
    t.end();
});
