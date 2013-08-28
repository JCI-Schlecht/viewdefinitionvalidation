/*global suite, setup, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['reliability-timestamp.json'];

suite('#json.schemas.reliability-timestamp', function () {
    var validTime;

    setup(function () {
        validTime = {"timestamp": 10, "reliability": true};
    });

    test('valid', function () {
        var result = env.validate(validTime, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('missing timestamp', function () {
        var invalidTime = validTime;
        invalidTime.timestamp = undefined;
        helper.assertPropertyRequired(env, invalidTime, schema, "timestamp");
    });

    test('missing reliability', function () {
        var invalidTime = validTime;
        invalidTime.reliability = undefined;
        helper.assertPropertyRequired(env, invalidTime, schema, "reliability");
    });


});