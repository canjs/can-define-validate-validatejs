var defineValidate = require("can-define-validate-validatejs");
var QUnit = require("steal-qunit");
var DefineMap = require("can-define/map/map");
var compute = require("can-compute");

var NoConstraints = DefineMap.extend({ name: "string" });
var Locator = DefineMap.extend({
	city: {
		validate: {
			presence: true
		}
	},
	state: {
		validate: {
			presence: true,
			format: /\w\w/
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
defineValidate(NoConstraints);

QUnit.module("can-define-validate-validatejs");

QUnit.test("when constraints missing", function(assert) {
	var locator = new NoConstraints();
	assert.notOk(locator.errors(), "runs but returns no errors");
});

QUnit.test("errors is readable when wrapped as compute", function(assert) {
	var locator = new Locator({ city: "angier", state: "NC" });
	var errors = compute(function() {
		return locator.errors();
	});
	var expectedErrors = [
		{
			message: "is invalid",
			related: ["state"]
		},
		{
			message: "can't be blank",
			related: ["zipCode"]
		}
	];
	errors.on("change", function(ev, errors) {
		assert.deepEqual(
			errors,
			expectedErrors,
			"Errors are set based on constraints"
		);
	});

	locator.state = "Juan";
});

QUnit.test("errors is readable when wrapped as compute", function(assert) {
	var locator = new Locator({ city: "angier", state: "NC", zipCode: 27501 });
	var errors = compute(function() {
		return locator.errors();
	});
	var counter = 0;
	errors.on("change", function(ev, errors) {
		if (counter > 0) {
			assert.notOk(errors, "Errors update when values change");
		}
		counter++;
	});

	locator.state = "Juan";
	locator.state = "CA";
});

QUnit.test("calling errors returns object", function(assert) {
	var locator = new Locator({ city: "angier" });
	var expectedErrors = [
		{
			message: "can't be blank",
			related: ["state"]
		},
		{
			message: "can't be blank",
			related: ["zipCode"]
		}
	];
	assert.deepEqual(locator.errors(), expectedErrors, "Returns error type array");
});

QUnit.test("calling errors with string returns error for that key", function(assert) {
	var locator = new Locator({ city: "angier" });
	var errors = locator.errors("state");
	assert.deepEqual(errors, [
		{
			message: "can't be blank",
			related: ["state"]
		}
	]);
});

QUnit.test(
	"calling errors with string returns undefined when no errors are set",
	function(assert) {
		var locator = new Locator({ city: "angier", state: "NC", zipCode: 27501 });
		var errors = locator.errors("state");
		assert.notOk(errors, "Errors is undefined");
	}
);

QUnit.test("errors with object returns errors for requested keys", function(assert) {
	var locator = new Locator({ city: "angier" });
	var expectedErrors = [
		{
			message: "can't be blank",
			related: ["state"]
		},
		{
			message: "can't be blank",
			related: ["zipCode"]
		}
	];
	assert.deepEqual(locator.errors("state", "zipCode"), expectedErrors);
});

QUnit.test("testSet a single value", function(assert) {
	var locator = new Locator({ city: "angier", state: "nc", zipCode: 27501 });
	var expectedErrors = [
		{
			message: "can't be blank",
			related: ["state"]
		},
		{
			message: "is invalid",
			related: ["state"]
		}
	];
	var errors = locator.testSet("state", "");
	assert.deepEqual(errors, expectedErrors, "returns correct error");
	assert.notOk(locator.errors(), "Does not set errors on map");
});

QUnit.test("testSet many values", function(assert) {
	var locator = new Locator({ city: "angier", state: "nc", zipCode: 27501 });
	var errors = locator.testSet({ state: "", zipCode: "" });
	var expectedErrors = [
		{
			message: "can't be blank",
			related: ["state"]
		},
		{
			message: "is invalid",
			related: ["state"]
		},
		{
			message: "can't be blank",
			related: ["zipCode"]
		},
		{
			message: "is not a number",
			related: ["zipCode"]
		}
	];
	assert.deepEqual(errors, expectedErrors, "returns correct error");
	assert.notOk(locator.errors(), "Does not set errors on map");
});

QUnit.test("testSet many values, with clean map", function(assert) {
	var locator = new Locator({ city: "angier", state: "nc", zipCode: 27501 });
	var errors = locator.testSet({ state: "" }, true);
	var expectedErrors = [
		{
			message: "can't be blank",
			related: ["city"]
		},
		{
			message: "can't be blank",
			related: ["state"]
		},
		{
			message: "is invalid",
			related: ["state"]
		},
		{
			message: "can't be blank",
			related: ["zipCode"]
		}
	];
	assert.deepEqual(errors, expectedErrors, "returns correct error");
	assert.notOk(locator.errors(), "Does not set errors on map");
});
