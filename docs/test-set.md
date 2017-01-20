@module {function} can-define-validate-validatejs/DefineMap.prototype/testSet testSet
@parent can-define-validate-validatejs/DefineMap.prototype

Tests value changes against constraints. The map is serialized then updated based
on test values, then validated. The original map instance does not manipulate the
existing instance's values.

@signature `testSet()`

  Calls validator on the current values of a [can-define/map/map]. This is essentially the same as
  calling `errors()`.

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
    person.testSet();
    // returns: [{message: "is required", related: "name"}]
  ```

@signature `map.testSet(keyName, value)`

  Changes `keyName`'s value in the map instance clone. Then checks if the object is valid.

  @param {string} keyName The property key to test
  @param {*} value The new value to test for `keyName`.

  @return {[can-validate/types/errors]} Will return `undefined` if test map is valid.
  Otherwise, will return an array of [can-validate/types/errors].

  ```javascript
    var Person = new DefineMap({
        name: {
            validate: {
                presence: true
            }
        }
    });
    var person = new Person({name: 'Juan'});
    person.testSet('name', '');
    // returns: [{message: "is required", related: "name"}]
  ```

@signature `map.testSet(props, useNewInstance)`

  Replaces many values on the map instance clone. Making `useNewInstance` set to
  `true` will create a new instance of the map and test changes on the clean instance.

  @param {object} props An object of key/value pairs, where `key` is a property in
  the map instance that will update to the new `value`.

  @param {boolean} [useNewInstance=false] If `true`, will use a new instance of the
  map constructor, then test changes against that new map instance.

  @return {[can-validate/types/errors]} Will return `undefined` if test map is valid.
  Otherwise, will return an array of [can-validate/types/errors].

  ```javascript
    var Person = new DefineMap({
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
    });
    var person = new Person({name: 'Juan', age: 35});

    // this returns [{message: "is required", related: "name"}]
    person.testSet({name: ''});

    //this returns [{message: "is required", related: "name"}]
    person.testSet({age: 35}, true);
  ```
