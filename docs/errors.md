@module {function} can-define-validate-validatejs/DefineMap.prototype/errors errors
@parent can-define-validate-validatejs/DefineMap.prototype

The `errors` method retrieves errors from validator.

@signature `errors()`

  Returns all errors for the current map instance.

  @return {[can-validate/types/errors]} Will return `undefined` if map is valid.
  Otherwise, will return an array of [can-validate/types/errors].

  ```javascript
    var Person = new DefineMap({
        name: {
            validate: {
                presence: true
            }
        }
    });
    var person = new Person();
    person.errors();
    // returns: [{message: "is required", related: "name"}]
  ```

@signature `map.errors(keyName[keyName])`

  Returns errors for the specified keys from current map instance.

  @return {[can-validate/types/errors]} Will return `undefined` if map is valid.
  Otherwise, will return an array of [can-validate/types/errors].

  ```javascript
    var Person = new DefineMap({
        name: {
            validate: {
                presence: true
            }
        }
        age: {
            validate: {
                presence: true,
                numericality: true
            }
        }
    });
    var person = new Person();
    person.errors('name');
    // returns: [{message: "is required", related: "name"}]
  ```
