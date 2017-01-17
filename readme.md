# `can-define-validate-validatejs`

Create validator functions using [validate.js](https://validatejs.org/).

Usage and API info can be found on [CanJS.com](http://canjs.com/doc/can-validate-validatejs.html).

## Install

```sh
git clone git@github.com:canjs/can-define-validate-validatejs.git
cd ./can-define-validate-validatejs
npm install

# Start web server to play with demo
npm run develop
```

### Build

Run `npm run build`

### Test

Run `npm run test`

This will run the jshint script before actually running tests.

To run just the tests, run `npm run testee`.

To run tests in the browser, run `npm run develop` and browse to `http://127.0.0.1:8080/test.html`


## Usage

`npm install can-define-validate-validatejs --save`

```javascript
var ValidateDefine = require('can-define-validate-validatejs');
var Map = require('can-define/map/map');

Map = ValidateDefine(Map);
var map = new Map({name: 'juan'});

map.attr('name', ''); // setting value checks validity
map.errors();// one error
```
