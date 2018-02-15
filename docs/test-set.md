@function can-define-validate-validatejs.testSet testSet
@parent can-define-validate-validatejs.defineMap

Tests value changes against constraints. Does not set errors on map instance.

@signature `testSet()`

  Calls validator on the current values of a [can-define/map/map]. This is essentially the same as
  calling `errors()`.

  @return {can-validate.errors} Will return `undefined` if map is valid.
  Otherwise, will return an array of [can-validate/types/errors].

  ```js
const Person = new DefineMap( {
	name: {
		validate: {
			presence: true
		}
	}
} );
const person = new Person();
person.testSet();

// returns: [{message: "is required", related: "name"}]
```

@signature `map.testSet(keyName, value)`

  Changes `keyName`'s value in the map instance clone. Then checks if the object is valid.
  ```js
const Person = new DefineMap( {
	name: {
		validate: {
			presence: true
		}
	}
} );
const person = new Person( { name: "Juan" } );
person.testSet( "name", "" );

//=> [{message: "is required", related: "name"}]
```

  @param {string} keyName The property key to test
  @param {*} value The new value to test for `keyName`.

  @return {can-validate.errors} Will return `undefined` if test map is valid.
  Otherwise, will return an array of [can-validate.errors].

@signature `map.testSet(props, useNewInstance)`

  Replaces many values on the map instance clone. Making `useNewInstance` set to
  `true` will create a new instance of the map and test changes on the clean instance.

  ```js
const Person = new DefineMap( {
	name: {
		validate: {
			presence: true
		}
	},
	age: {
		validate: {
			numericality: true
		}
	}
} );
const person = new Person( { name: "Juan", age: 35 } );

// this returns [{message: "is required", related: "name"}]
person.testSet( { name: "" } );

//this returns [{message: "is required", related: "name"}]
person.testSet( { age: 35 }, true );
```

  @param {object} props An object of key/value pairs, where `key` is a property in
  the map instance that will update to the new `value`.

  @param {boolean} [useNewInstance=false] If `true`, will use a new instance of the
  map constructor, then test changes against that new map instance.

  @return {can-validate.errors} Will return `undefined` if test map is valid.
  Otherwise, will return an array of [can-validate.errors].

@body

## Usage

With the exception of calling `testSet` with no arguments, `testSet` is called on a copy of the map instance, this is to prevent errors from
being set on the map instance when using `testSet`. This means that errors returned are a result of the values provided through arguments being merged with the existing values.

This behavior can be controlled when testing multiple values by passing `true` for `useNewInstance`. This will test values with a new instance of the map constructor, allowing better control of what values are tested.

```js
map.testSet( { name: "", age: 100 }, true );
```
