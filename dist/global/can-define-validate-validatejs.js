/*[global-shim-start]*/
(function(exports, global, doEval){ // jshint ignore:line
	var origDefine = global.define;

	var get = function(name){
		var parts = name.split("."),
			cur = global,
			i;
		for(i = 0 ; i < parts.length; i++){
			if(!cur) {
				break;
			}
			cur = cur[parts[i]];
		}
		return cur;
	};
	var set = function(name, val){
		var parts = name.split("."),
			cur = global,
			i, part, next;
		for(i = 0; i < parts.length - 1; i++) {
			part = parts[i];
			next = cur[part];
			if(!next) {
				next = cur[part] = {};
			}
			cur = next;
		}
		part = parts[parts.length - 1];
		cur[part] = val;
	};
	var useDefault = function(mod){
		if(!mod || !mod.__esModule) return false;
		var esProps = { __esModule: true, "default": true };
		for(var p in mod) {
			if(!esProps[p]) return false;
		}
		return true;
	};
	var modules = (global.define && global.define.modules) ||
		(global._define && global._define.modules) || {};
	var ourDefine = global.define = function(moduleName, deps, callback){
		var module;
		if(typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for(i =0; i < deps.length; i++) {
			args.push( exports[deps[i]] ? get(exports[deps[i]]) : ( modules[deps[i]] || get(deps[i]) )  );
		}
		// CJS has no dependencies but 3 callback arguments
		if(!deps.length && callback.length) {
			module = { exports: {} };
			var require = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args.push(require, module.exports, module);
		}
		// Babel uses the exports and module object.
		else if(!args[0] && deps[0] === "exports") {
			module = { exports: {} };
			args[0] = module.exports;
			if(deps[1] === "module") {
				args[1] = module;
			}
		} else if(!args[0] && deps[0] === "module") {
			args[0] = { id: moduleName };
		}

		global.define = origDefine;
		var result = callback ? callback.apply(null, args) : undefined;
		global.define = ourDefine;

		// Favor CJS module.exports over the return value
		result = module && module.exports ? module.exports : result;
		modules[moduleName] = result;

		// Set global exports
		var globalExport = exports[moduleName];
		if(globalExport && !get(globalExport)) {
			if(useDefault(result)) {
				result = result["default"];
			}
			set(globalExport, result);
		}
	};
	global.define.orig = origDefine;
	global.define.modules = modules;
	global.define.amd = true;
	ourDefine("@loader", [], function(){
		// shim for @@global-helpers
		var noop = function(){};
		return {
			get: function(){
				return { prepareGlobal: noop, retrieveGlobal: noop };
			},
			global: global,
			__exec: function(__load){
				doEval(__load.source, global);
			}
		};
	});
}
)({},window,function(__$source__, __$global__) { // jshint ignore:line
	eval("(function() { " + __$source__ + " \n }).call(__$global__);");
}
)
/*can-define-validate-validatejs@0.1.0-pre.0#can-define-validate-validatejs*/
define('can-define-validate-validatejs', function (require, exports, module) {
    var formatErrors = require('can-validate').formatErrors;
    var validate = require('can-validate-validatejs');
    var define = require('can-define');
    var each = require('can-util/js/each/each');
    var assign = require('can-util/js/assign/assign');
    var isEmptyObject = require('can-util/js/is-empty-object/is-empty-object');
    var getMapConstraints = function (Map) {
        var constraints = {};
        each(Map.prototype._define.definitions, function (prop, key) {
            if (prop.validate && !isEmptyObject(prop.validate)) {
                constraints[key] = prop.validate;
            }
        });
        return constraints;
    };
    var validateMap = function (Map, validator) {
        var mapDefinition = Map.prototype._define;
        Map.prototype.testSet = function () {
            var values = {};
            var useNewObject = false;
            if (arguments.length) {
                if (typeof arguments[0] === 'object' && Boolean(arguments[0])) {
                    values = arguments[0];
                    useNewObject = Boolean(arguments[1]);
                }
                if (typeof arguments[0] === 'string') {
                    values[arguments[0]] = arguments[1];
                }
                if (useNewObject) {
                    values = new Map(values);
                } else {
                    var mapClone = this.serialize();
                    assign(mapClone, values);
                    values = mapClone;
                }
                return validator(values);
            } else {
                return this.errors();
            }
        };
        Map.prototype.errors = function () {
            var _errors = this._errors;
            var errors;
            if (arguments.length) {
                var errorsObj = formatErrors(_errors, 'errors-object');
                errors = [];
                each(arguments, function (key) {
                    [].push.apply(errors, errorsObj ? errorsObj[key] : []);
                });
                errors = errors.length > 0 ? errors : undefined;
            } else {
                errors = _errors;
            }
            return errors;
        };
        define.property(Map.prototype, '_errors', {
            get: function () {
                var errors = validator(this);
                return errors;
            }
        }, mapDefinition.dataInitializers, mapDefinition.computedInitializers);
    };
    var decorator = function (Map) {
        var constraints = getMapConstraints(Map);
        var validator = validate.many(constraints);
        validateMap(Map, function (map) {
            var errors = validator(map);
            return formatErrors(errors, 'errors');
        });
    };
    decorator.validatejs = validate.validatejs;
    module.exports = decorator;
});
/*[global-shim-end]*/
(function(){ // jshint ignore:line
	window._define = window.define;
	window.define = window.define.orig;
}
)();
//# sourceMappingURL=can-define-validate-validatejs.js.map