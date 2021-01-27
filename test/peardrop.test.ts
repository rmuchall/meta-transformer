import {MetaTransformer} from "../src/MetaTransformer";
import {Exclude} from "../src/decorators/property/Exclude";
import {Transform} from "../src/decorators/property/Transform";

beforeEach(MetaTransformer.clearMetadata);

test("exclude abstract complex arrays", () => {
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

    expect.assertions(26);
    expect(classArray[0]).toBeInstanceOf(VpnServerDto);
    expect(classArray[0].id).toBeUndefined();
    expect(classArray[0].created).toBeUndefined();
    expect(classArray[0].updated).toBeUndefined();
    expect(classArray[0].name).toEqual("lu001");
    expect(classArray[0].ipAddress).toEqual("104.244.77.222");
    expect(classArray[0].port).toEqual("51820");

    expect(classArray[0].country).toBeInstanceOf(CountryDto);
    expect(classArray[0].country.id).toBeUndefined();
    expect(classArray[0].country.created).toBeUndefined();
    expect(classArray[0].country.updated).toBeUndefined();
    expect(classArray[0].country.code).toEqual("LU");
    expect(classArray[0].country.name).toEqual("Luxembourg");

    expect(classArray[1]).toBeInstanceOf(VpnServerDto);
    expect(classArray[1].id).toBeUndefined();
    expect(classArray[1].created).toBeUndefined();
    expect(classArray[1].updated).toBeUndefined();
    expect(classArray[1].name).toEqual("us001");
    expect(classArray[1].ipAddress).toEqual("209.141.58.182");
    expect(classArray[1].port).toEqual("51820");

    expect(classArray[1].country).toBeInstanceOf(CountryDto);
    expect(classArray[1].country.id).toBeUndefined();
    expect(classArray[1].country.created).toBeUndefined();
    expect(classArray[1].country.updated).toBeUndefined();
    expect(classArray[1].country.code).toEqual("US");
    expect(classArray[1].country.name).toEqual("United States");
});
