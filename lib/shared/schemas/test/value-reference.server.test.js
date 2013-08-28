/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['value-reference.json'];

suite('#json.schemas.value-reference', function () {

    test('valid', function () {
        helper.assertNoFailure(env, { "objectReference": "3", "attributeId": 2 }, schema);
    });

    test('wrong data type (number)', function () {
        helper.assertSingleNonPropertyFailure(env, 3.1415926535, schema, "#", "type");
    });

    test('missing', function () {
        helper.assertSingleNonPropertyFailure(env, "", schema, "#", "type");
    });

});
