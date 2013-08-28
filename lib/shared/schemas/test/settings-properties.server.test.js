/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['settings-properties.json'];

suite('#json.schemas.settings-properties.json', function () {

    test('valid', function () {
        var result = env.validate([{ "settingId": "ssid", "value": "cfgvalue" }]);
        expect(result.errors).to.be.empty();
    });

    test('configuration-properties to be empty', function () {
        var result = env.validate([], schema);
        expect(result.errors).to.be.empty(result);
    });

});
