(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.reactTo = factory();
	}
}(this, function () {
	return angular.module('reactTo', [])
			.value('reactTo', reactTo);

	function getProxy(obj, field) {
		var isObject = typeof obj !== 'string';
		var isField = typeof field === 'string';

		var proxy;
		// make watcher function
		if (isObject) {
			if (isField) {
				proxy = function () {
					return obj[field];
				};
			} else {
				proxy = function () {
					return obj;
				};
			}
		} else {
			if (isField) {
				proxy = obj + '.' + field;
			} else {
				proxy = obj;
			}
		}
		return proxy;
	}

	/**
	 * A helper for watching a value in the scope.
	 *
	 * Usage:
	 *
	 *  react(scope)('scopeValue', fn)      - call fn on each $watch trigger when scope.scopeValue changes
	 *  react(scope)('prefix','value', fn)  - call fn on each $watch trigger when scope.prefix.value changes
	 *  react(scope)(object, field, fn)     - call fn on each $watch trigger when object.field value changes
	 *
	 * @param scope - a scope containing the watcher function
	 * @param once - react on change only once
	 * @param deep - a flag which determines whether a deep object equality will be used
	 * @returns {Function}
	 * @private
	 */
	function reactTo(scope, once, deep) {
		return function (service, field, fn) {
			var proxy = getProxy(service, field);

			// if field is not a string - it is a fn
			if (typeof field !== 'string') {
				fn = field;
			}

			var unwatch = scope.$watch(proxy, function (n, o) {
				if (o !== n) {
					fn(n, o, service);
					if (once) {
						unwatch();
					}
				}
			}, deep);
		}
	}

}));