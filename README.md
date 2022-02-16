![GitHub](https://img.shields.io/github/license/rmuchall/meta-transformer)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/meta-transformer)
![npm](https://img.shields.io/npm/v/meta-transformer)

## What is meta-transformer?
meta-transformer is a light-weight ([1k gzipped](https://bundlephobia.com/package/meta-transformer)), [tree-shakable](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking), zero dependency library for transforming plain JavaScript objects to class instances. It is isomorphic and can be used in NodeJs or in a browser.<br/>

## Installation
Install the [meta-transformer package](https://www.npmjs.com/package/meta-transformer) from npm. <br/>
`npm install meta-transformer`

## Usage
```
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
```
You can also transform arrays in the same way.<br/>
```
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
```

## Transforming Nested Objects
You can use the `@Transform(<class type>)` to transform nested complex objects.<br/>
```
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
}

const classInstance: Widget = MetaTransformer.toClass<Widget>(Widget, {
    name: "Doodad",
    color: "Blue",
    model: 1234,
    detail: {
        material: "Plastic",
        shape: "Square"
    }
);
```

## Exclude Properties
You can use the `@Exclude()` decorator to mark properties that should not be included in the transformed class instance.<br/>
```
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

// The transformed classInstance is {"name":"Doodad","color":"Blue"}
```

## Circular Dependencies
meta-transformer will throw an error if you try to transform objects that have circular dependencies.<br/>
