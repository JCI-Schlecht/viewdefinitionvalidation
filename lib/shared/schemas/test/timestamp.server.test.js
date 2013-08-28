/*global suite, setup, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['timestamp.json'];

suite('#json.schemas.timestamp', function () {
    var validTime;

    setup(function () {
        validTime = 500000;
    });

    test('valid', function () {
        var result = env.validate(validTime, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('wrong data type (string)', function () {
        helper.assertSingleNonPropertyFailure(env, "should be an integer, not a string!", schema, "#", "type");
    });

    test('wrong data type (non-integer number)', function () {
        helper.assertSingleNonPropertyFailure(env, 3.1415926535, schema, "#", "type");
    });

    test('missing', function () {
        helper.assertSingleNonPropertyFailure(env, "", schema, "#", "type");
    });

    test('below min', function () {
        helper.assertSingleNonPropertyFailure(env, -1, schema, "#", "minimum");
    });


});