/*global suite, setup, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['settings-apply-response.json'];

suite('#json.schemas.settings-apply-response', function () {

    var validConfigurationProperty = { "settingId": "ssid", "value": "cfgvalue" },
        validConfigurationPropertyError = { "settingProperty": validConfigurationProperty,
                                            "errorDescription": 'too long' },
        validConfigurationApplyResponse;

    setup(function () {
        validConfigurationApplyResponse = { "status": true,
                                            "settingErrors": [validConfigurationPropertyError],
                                            "isDisconnectRequired": false
                                          };
    });

    test('valid value with string', function () {
        var result = env.validate(validConfigurationApplyResponse, schema);
        expect(result.errors).to.be.empty();
    });

    test('status is not boolean', function () {
        validConfigurationApplyResponse.status = "I ain't no boolean";

        helper.assertSinglePropertyFailure(env, validConfigurationApplyResponse, schema, "status", "type");
    });

    test('status is missing', function () {
        validConfigurationApplyResponse.status = undefined;

        helper.assertPropertyRequired(env, validConfigurationApplyResponse, schema, "status");
    });

    test('settingErrors is empty', function () {
        var result;

        validConfigurationApplyResponse.settingErrors = [];
        result = env.validate(validConfigurationApplyResponse, schema);
        expect(result.errors).to.be.empty();
    });

    test('settingErrors is missing', function () {
        validConfigurationApplyResponse.settingErrors = undefined;

        helper.assertPropertyRequired(env, validConfigurationApplyResponse, schema, "settingErrors");
    });

    test('isDisconnectRequired is not boolean', function () {
        validConfigurationApplyResponse.isDisconnectRequired = "I ain't no boolean";

        helper.assertSinglePropertyFailure(env, validConfigurationApplyResponse, schema, "isDisconnectRequired", "type");
    });

    test('status is missing', function () {
        validConfigurationApplyResponse.isDisconnectRequired = undefined;

        helper.assertPropertyRequired(env, validConfigurationApplyResponse, schema, "isDisconnectRequired", "required");
    });

});
