var defineValidate = require('can-define-validate-validatejs');
var QUnit = require('steal-qunit');

var Locator = DefineMap.extend({
  state: {
    validate: {
      presence: true,
      pattern: /\w\w/
    }
  },
  zipCode: {
     validate: {
      presence: true,
      numericality: true
    }
  }
});

defineValidate(Locator);

QUnit.module('can-define-validate-validatejs');

QUnit.test('get errors', function () {
    var locator = new Locator();
    QUnit.ok(locator.errors());
    QUnit.ok(locator.errors('state'));
    QUnit.equal(locator.errors('state')[0], 'is required');
});

QUnit.test('testSet a single value', function () {
    var locator = new Locator({state: 'nc'});
    var errors = locator.testSet('state', '');
    QUnit.ok(errors);
    QUnit.equal(errors[0], 'is required');
});

QUnit.test('testSet a many values', function () {
    var locator = new Locator({state: 'nc', zipCode: 27501});
    var errors = locator.testSet({state:'hello', zipCode: 'world'});
    QUnit.ok(errors);
    QUnit.ok(errors.zipCode);
    QUnit.equal(errors.zipCode[0], 'must be a number');
});
