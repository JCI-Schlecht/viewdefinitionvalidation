/*global suite, setup, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['alarm-response.json'];

suite('#json.schemas.alarm-response', function () {
    var validAlarmResponse;

    setup(function () {
        validAlarmResponse = {"deviceIdentifier": {"objectReference": "device.fqr"}, "alarms": [{"sequence": 10, "created": {"timestamp": 50003, "reliability": true}, "cleared": {"timestamp": 50003, "reliability": true}, "code": { "set": 1, "id": 2 }, "severity": { "set": 1, "id": 2 }, "active": false}]};
    });

    test('valid', function () {
        var result = env.validate(validAlarmResponse, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('missing deviceIdentifier', function () {
        var invalidAlarmResponse = validAlarmResponse;
        invalidAlarmResponse.deviceIdentifier = undefined;
        helper.assertPropertyRequired(env, invalidAlarmResponse, schema, "deviceIdentifier");
    });

    test('missing alarms', function () {
        var invalidAlarmResponse = validAlarmResponse;
        invalidAlarmResponse.alarms = undefined;
        helper.assertPropertyRequired(env, invalidAlarmResponse, schema, "alarms");
    });

    test('alarms is empty', function () {
        var noAlarmResponse = validAlarmResponse,
            result;
        noAlarmResponse.alarms = [];
        result = env.validate(noAlarmResponse, schema);
        expect(result.errors).to.be.empty(result);
    });

});