/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['settings-property-error.json'];

suite('#json.schemas.settings-property-error', function () {

    var validConfigurationProperty = { "settingId": "ssid", "value": "too short" };

    test('valid', function () {
        var result = env.validate({ "settingProperty": validConfigurationProperty,
                                    "errorDescription": 'too short' }, schema);
        expect(result.errors).to.be.empty();
    });

    test('errorDesc with number', function () {
        helper.assertAnyFailure(env, {
            "settingProperty": validConfigurationProperty,
            "errorDescription": 45
        }, schema);
    });

    test('settingProperty missing', function () {
        helper.assertAnyFailure(env, {
            "errorDescription": 45
        }, schema);
    });

    test('errorDescription missing', function () {
        helper.assertPropertyRequired(env, {
            "settingProperty": validConfigurationProperty,
        }, schema, "errorDescription");
    });

});
