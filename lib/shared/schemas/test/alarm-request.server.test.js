/*global suite, setup, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['alarm-request.json'];

suite('#json.schemas.alarm-request', function () {
    var validAlarmRequest;

    setup(function () {
        validAlarmRequest = {deviceIdentifier: {objectReference: "device.fqr"}};
    });

    test('valid', function () {
        var result = env.validate(validAlarmRequest, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('missing deviceIdentifier', function () {
        var invalidAlarmRequest = validAlarmRequest;
        invalidAlarmRequest.deviceIdentifier = undefined;
        helper.assertPropertyRequired(env, invalidAlarmRequest, schema, "deviceIdentifier");
    });
});