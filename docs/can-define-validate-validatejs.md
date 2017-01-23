@module {function} can-define-validate-validatejs
@parent can-ecosystem
@group can-define-validate-validatejs.defineMap DefineMap.prototype
@package ../package.json

@description Adds validation methods and observables to a [can-define/map/map]
using [validate.js](https://validatejs.org/).

@signature `defineValidate(Map)`

  Checks for ValidateJS constraints and attaches useful methods.

  ```js
  var defineValidate = require('can-define-validate-validatejs');
  var User = DefineMap.extend({
      name: {
          validate: {
              presence: true
          }
      }
  });
  // Attach methods to any instance created of `User`
  defineValidate(User);
  var user = new User();
  user.errors();//-> [{name: ['is required']}]
  ```

  @param {Object} Map The [can-define/map/map] constructor. Adds [can-define-validate-validatejs.errors] and [can-define-validate-validatejs.test-set] methods to the prototype of this map.

@body

## Usage

Any validation properties must match the structure used by Validate.JS [constraints](https://validatejs.org/#validators).

For example...
```js
var User = DefineMap.extend({
    name: {
        validate: {
            presence: true
        }
    }
});
```

Initialize the validators on the Define Map by calling the `defineValidate` function.

```js
defineValidate(User);
```

When an instance is created, the instance will have validation properties that can be used in other modules or in templates

In a module...
```js
var user = new User();

var onSubmit = function () {
    if (user.errors()) {
        alert('Cannot continue, please check form for errors');
    }
}
```

In a template...
```html
<input type="submit" {$disabled}="user.errors()"/>
```

## Demo

@demo demos/can-validate/credit-card.html
