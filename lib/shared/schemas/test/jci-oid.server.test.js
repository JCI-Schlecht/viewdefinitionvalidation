/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['jci-oid.json'];

suite('#json.schemas.jci-oid', function () {

    test('valid', function () {
        var result = env.validate(5334343, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('wrong data type (string)', function () {
        helper.assertSingleNonPropertyFailure(env, "should be an integer, not a string!", schema, "#", "type");
    });

});