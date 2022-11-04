import {test, beforeEach} from "tap";
import {Exclude} from "../src/decorators/property/Exclude.js";
import {MetaTransformer} from "../src/MetaTransformer.js";
import {Transform} from "../src/decorators/property/Transform.js";

beforeEach(MetaTransformer.clearMetadata);

void test("exclude properties", t => {
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

    t.equal(classInstance.name, "Doodad");
    t.equal(classInstance.color, "Blue");
    t.equal(classInstance.model, undefined);
    t.end();
});

void test("exclude abstract properties", t => {
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

    t.equal(classInstance.id, undefined);
    t.equal(classInstance.created, "01/01/00");
    t.equal(classInstance.name, "Doodad");
    t.equal(classInstance.color, "Blue");
    t.equal(classInstance.model, 1234);
    t.end();
});

void test("exclude arrays", t => {
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

    t.type(classArray[0], Widget);
    t.equal(classArray[0].name, "Doodad");
    t.equal(classArray[0].color, "Blue");
    t.equal(classArray[0].model, 1234);

    t.type(classArray[0].detail, WidgetDetail);
    t.equal(classArray[0].detail.material, undefined);
    t.equal(classArray[0].detail.shape, "Square");

    t.type(classArray[1], Widget);
    t.equal(classArray[1].name, "Thing");
    t.equal(classArray[1].color, "Red");
    t.equal(classArray[1].model, 9876);

    t.type(classArray[1].detail, WidgetDetail);
    t.equal(classArray[1].detail.material, undefined);
    t.equal(classArray[1].detail.shape, "Circle");
    t.end();
});

void test("exclude nested arrays", t => {
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

    t.type(classInstance, Widget);
    t.equal(classInstance.name, "Doodad");
    t.equal(classInstance.color, "Blue");
    t.equal(classInstance.model, 1234);

    t.type(classInstance.detail[0], WidgetDetail);
    t.equal(classInstance.detail[0].material, undefined);
    t.equal(classInstance.detail[0].shape, "Square");

    t.type(classInstance.detail[1], WidgetDetail);
    t.equal(classInstance.detail[1].material, undefined);
    t.equal(classInstance.detail[1].shape, "Circle");
    t.end();
});

void test("exclude abstract complex arrays", t => {
    abstract class PeardropDto {
        @Exclude()
        id: string;

        @Exclude()
        created: Date;

        @Exclude()
        updated: Date;
    }

    class CountryDto extends PeardropDto {
        code: string;
        name: string;
    }

    class VpnServerDto extends PeardropDto {
        name: string;
        ipAddress: string;
        port: string;

        @Transform(CountryDto)
        country: CountryDto;
    }

    const plainServerArray = [
        {
            "id": "a61f6e5d-56b8-445f-8c21-2e7cde449b17",
            "created": "2021-01-27T07:18:52.000Z",
            "updated": "2021-01-27T07:18:52.000Z",
            "name": "lu001",
            "ipAddress": "104.244.77.222",
            "port": "51820",
            "country": {
                "id": "e19063bc-345e-47ad-b02e-1d807a37626f",
                "created": "2021-01-27T07:18:52.000Z",
                "updated": "2021-01-27T07:18:52.000Z",
                "code": "LU",
                "name": "Luxembourg"
            }
        },
        {
            "id": "9428cc0b-f440-44f4-9f81-3f8ec504bd1d",
            "created": "2021-01-27T07:18:52.000Z",
            "updated": "2021-01-27T07:18:52.000Z",
            "name": "us001",
            "ipAddress": "209.141.58.182",
            "port": "51820",
            "country": {
                "id": "fe48eb58-3607-41b2-b9f5-d156547efa01",
                "created": "2021-01-27T07:18:52.000Z",
                "updated": "2021-01-27T07:18:52.000Z",
                "code": "US",
                "name": "United States"
            }
        }
    ];

    const classArray = MetaTransformer.toClass<VpnServerDto>(VpnServerDto, plainServerArray);

    t.type(classArray[0], VpnServerDto);
    t.equal(classArray[0].id, undefined);
    t.equal(classArray[0].created, undefined);
    t.equal(classArray[0].updated, undefined);
    t.equal(classArray[0].name, "lu001");
    t.equal(classArray[0].ipAddress, "104.244.77.222");
    t.equal(classArray[0].port, "51820");

    t.type(classArray[0].country, CountryDto);
    t.equal(classArray[0].country.id, undefined);
    t.equal(classArray[0].country.created, undefined);
    t.equal(classArray[0].country.updated, undefined);
    t.equal(classArray[0].country.code, "LU");
    t.equal(classArray[0].country.name, "Luxembourg");

    t.type(classArray[1], VpnServerDto);
    t.equal(classArray[1].id, undefined);
    t.equal(classArray[1].created, undefined);
    t.equal(classArray[1].updated, undefined);
    t.equal(classArray[1].name, "us001");
    t.equal(classArray[1].ipAddress, "209.141.58.182");
    t.equal(classArray[1].port, "51820");

    t.type(classArray[1].country, CountryDto);
    t.equal(classArray[1].country.id, undefined);
    t.equal(classArray[1].country.created, undefined);
    t.equal(classArray[1].country.updated, undefined);
    t.equal(classArray[1].country.code, "US");
    t.equal(classArray[1].country.name, "United States");
    t.end();
});
