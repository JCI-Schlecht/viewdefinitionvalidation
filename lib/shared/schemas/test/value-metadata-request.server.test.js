/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['value-metadata-request.json'];

suite('#json.schemas.value-metadata-request', function () {

    test('valid', function () {
        var result = env.validate({ "valueReference": { "objectReference": "3", "attributeId": 2 } }, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('valueReference missing', function () {
        helper.assertPropertyRequired(env, { }, schema, "valueReference", "required");
    });

    test('valueReference invalid data type', function () {
        helper.assertSinglePropertyFailure(env, { "valueReference": { "ZZZ": 1 } }, schema, "valueReference", "type");
    });

});
