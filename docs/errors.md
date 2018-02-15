@function can-define-validate-validatejs.errors errors
@parent can-define-validate-validatejs.defineMap

The `errors` method retrieves errors from validator.

@signature `errors()`

  Returns all errors for the current map instance.

  ```js
const Person = new DefineMap( {
	name: {
		validate: {
			presence: true
		}
	}
} );
const person = new Person();
person.errors();

//-> [{message: "is required", related: "name"}]
```

  @return {can-validate.errors} Will return `undefined` if map is valid.
  Otherwise, will return an array of [can-validate/types/errors].

@signature `map.errors(...propName)`

  Returns errors for the specified keys from current map instance.

  ```js
const Person = new DefineMap( {
	name: {
		validate: {
			presence: true
		}
	},
	age: {
		validate: {
			presence: true,
			numericality: true
		}
	}
} );
const person = new Person();
person.errors( "name" );

//-> [{message: "is required", related: "name"}]
```

  @param {Array<string>} [propName] The property key to retrieve errors for.

  @return {can-validate.errors} Will return `undefined` if map is valid.
  Otherwise, will return an array of [can-validate/types/errors].
