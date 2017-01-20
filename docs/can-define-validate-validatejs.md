@module {function} can-define-validate-validatejs
@parent can-ecosystem
@group can-define-validate-validatejs/DefineMap.prototype DefineMap.prototype
@package ../package.json

@description Adds helpful validation methods and observables to a [can-define/map/map]
using [validate.js](https://validatejs.org/).

@signature `defineValidator(Map)`

  Checks for ValidateJS constraints and attaches useful methods.

  @param {Object} Map The [can-define/map/map] constructor. Methods will be attached
  to the prototype of this map.

  ```javascript
  var defineValidator = require('can-define-validate-validatejs');
  var User = DefineMap.extend({
      name: {
          validate: {
              presence: true
          }
      }
  });
  // Attach methods to any instance created of `User`
  defineValidator(User);
  ```

@body

## Usage

The target Define Map must have constraints on at least one property. The validate
property must match the structure used by Validate.JS [constraints](https://validatejs.org/#validators).

```javascript
var User = DefineMap.extend({
    name: {
        validate: {
            presence: true
        }
    }
});
```

Initialize the validators on the Define Map by calling the function

```javascript
defineValidator(User);
```

When an instance is created, the instance will have validation properties that can be used in other modules or in templates

In a module...
```javascript
if (user.errors()) {
    alert('Cannot continue, please check form for errors');
}
```

In a template...
```html
<input type="submit" {{#if user.errors()}}disabled{{/if}}>
```
