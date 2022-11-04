import {test, beforeEach} from "tap";
import {Transform} from "../src/decorators/property/Transform.js";
import {MetaTransformer} from "../src/MetaTransformer.js";
import {Exclude} from "../src/decorators/property/Exclude.js";

beforeEach(MetaTransformer.clearMetadata);

void test("circular dependencies", t => {
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
    t.throws(t => MetaTransformer.toClass<Widget>(Widget, widget));
    t.end();
});

void test("multiple transform contexts", t => {
    t.throws(() => {
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

        new Widget();
    }, new Error("Conflicting transform contexts"));
    t.end();
});
