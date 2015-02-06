angular-react-to
================

A helper for watching a value in the scope.
Planned to use instead of `scope.$watch`

## Usage

  * `reactTo(scope)('scopeValue', fn)`      - call fn on each $watch trigger when `scope.scopeValue` changes
  * `reactTo(scope)('prefix','value', fn)`  - call fn on each $watch trigger when `scope.prefix.value` changes
  * `reactTo(scope)(object, 'field', fn)    - call fn on each $watch trigger when `object.field` value changes
