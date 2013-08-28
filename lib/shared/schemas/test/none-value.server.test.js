/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['none-value.json'];

suite('#json.schemas.none-value', function () {

    test('valid', function () {
        var result = env.validate(helper.createNoneValue(), schema);
        expect(result.errors).to.be.empty(result);
    });

    test('invalid with missing dataType', function () {
        var subject = helper.createNoneValue();
        delete subject.dataType;
        helper.assertSinglePropertyFailure(env, subject, schema, "dataType", "required");
    });

    test('invalid with wrong dataType', function () {
        var subject = helper.createNoneValue();
        subject.dataType = 1;
        helper.assertSinglePropertyFailure(env, subject, schema, "dataType", "enum");
    });
});