/*global suite, setup, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['alarm.json'];

suite('#json.schemas.alarm', function () {
    var validAlarm,
        validAlarmWithJustCreatedTimeStamp,
        validAlarmWithJustClearedTimeStamp,
        validAlarmWithBothTimeStamp;

    setup(function () {
        validAlarm = {"sequence": 10, "code": { "set": 1, "id": 2 }, "severity": { "set": 1, "id": 2 }, "active": false, "created": {"timestamp": 81078969669, "reliability": true}, "cleared": {"timestamp": 81078969670, "reliability": true}};
        validAlarmWithBothTimeStamp = {"sequence": 10, "code": { "set": 1, "id": 2 }, "severity": { "set": 1, "id": 2 }, "active": false, "created": {"timestamp": 81078969669, "reliability": true}, "cleared": {"timestamp": 81078969670, "reliability": true}};
    });

    test('valid alarm with both timestamps', function () {
        var result = env.validate(validAlarmWithBothTimeStamp, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('missing sequence', function () {
        var invalidAlarm = validAlarm;
        invalidAlarm.sequence = undefined;
        helper.assertPropertyRequired(env, invalidAlarm, schema, "sequence");
    });

    test('missing code', function () {
        var invalidAlarm = validAlarm;
        invalidAlarm.code = undefined;
        helper.assertPropertyRequired(env, invalidAlarm, schema, "code");
    });

    test('missing severity', function () {
        var invalidAlarm = validAlarm;
        invalidAlarm.severity = undefined;
        helper.assertPropertyRequired(env, invalidAlarm, schema, "severity");
    });

    test('missing active', function () {
        var invalidAlarm = validAlarm;
        invalidAlarm.active = undefined;
        helper.assertPropertyRequired(env, invalidAlarm, schema, "active");
    });

    test('active is the wrong type', function () {
        var invalidAlarm = validAlarm;
        invalidAlarm.active = "hello world";
        helper.assertSinglePropertyFailure(env, invalidAlarm, schema, "active", "type");
    });

    test('missing created time', function () {
        var invalidAlarm = validAlarm;
        invalidAlarm.created = undefined;
        helper.assertPropertyRequired(env, invalidAlarm, schema, "created");
    });

    test('missing cleared time', function () {
        var invalidAlarm = validAlarm;
        invalidAlarm.cleared = undefined;
        helper.assertPropertyRequired(env, invalidAlarm, schema, "cleared");
    });

});