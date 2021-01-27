import {Transform} from "../src/decorators/property/Transform";
import {MetaTransformer} from "../src/MetaTransformer";
import {Exclude} from "../src/decorators/property/Exclude";

beforeEach(MetaTransformer.clearMetadata);

test("circular dependencies", () => {
    class WidgetDetail {
        material: string;
        shape: string;

        @Transform(WidgetDetail)
        circular: WidgetDetail;
    }

    class Widget {
        name: string;
        color: string;
        model: number;

        @Transform(WidgetDetail)
        detail: WidgetDetail;
    }

    const widget = Object.assign(new Widget(), {
        name: "Doodad",
        color: "Blue",
        model: 1234
    });
    const widgetDetail = Object.assign(new WidgetDetail(), {
        material: "Plastic",
        shape: "Square"
    });
    widget.detail = widgetDetail;
    widget.detail.circular = widgetDetail;

    expect.assertions(1);
    expect(() => {
        MetaTransformer.toClass<Widget>(Widget, widget);
    }).toThrow();
});

test("multiple transform contexts", () => {
    expect.assertions(1);
    expect(() => {
        class WidgetDetail {
            material: string;
            shape: string;
        }

        class Widget {
            name: string;
            color: string;
            model: number;

            @Exclude()
            @Transform(WidgetDetail)
            detail: WidgetDetail;
        }
    }).toThrow();
});
