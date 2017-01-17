var formatErrors = require("can-validate/format-errors");
var getMapConstraints = require("can-validate/get-map-constraints");
var validate = require("can-validate-validatejs");
var validateMap = require("can-define-validate-validatejs/validate-map");

module.export = function(Map) {

    var constraints = getMapConstraints(Map);
    var validator = validate.many(constraints);

    validateMap(Map, function (map) {
        var errors = validator(map);

        return formatErrors("object", errors);
    });

};
