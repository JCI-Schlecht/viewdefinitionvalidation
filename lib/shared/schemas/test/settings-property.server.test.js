/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['settings-property.json'];

suite('#json.schemas.settings-property', function () {

    test('valid value with string', function () {
        var result = env.validate({ "settingId": "ssid", "value": "cfgvalue" }, schema);
        expect(result.errors).to.be.empty();
    });

    test('valid value with number', function () {
        var result = env.validate({ "settingId": "ssid", "value": 27 }, schema);
        expect(result.errors).to.be.empty();
    });

    test('settingId is not a string', function () {
        helper.assertAnyFailure(env, { "settingId": 25, "value": "cfgvalue" }, schema);
    });

    test('settingId missing', function () {
        helper.assertSinglePropertyFailure(env, { "value": "cfgvalue" }, schema, "settingId", "required");
    });

    test('settingId is not a valid enum', function () {
        helper.assertSinglePropertyFailure(env, { "settingId": "NotDefined", "value": "cfgvalue" }, schema, "settingId", "enum");
    });

    test('value missing', function () {
        helper.assertSinglePropertyFailure(env, { "settingId": "ssid" }, schema, "value", "required");
    });

});
