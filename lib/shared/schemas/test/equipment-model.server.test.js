/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['equipment-model.json'];

suite('#json.schemas.equipment-model', function () {

    test('valid', function () {
        helper.assertNoFailure(env, { "reference": "3" }, schema);
    });

    test('reference missing', function () {
        helper.assertPropertyRequired(env, { }, schema, "reference");
    });

});