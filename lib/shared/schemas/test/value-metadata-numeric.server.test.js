/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['value-metadata-numeric.json'];

suite('#json.schemas.value-metadata-numeric', function () {

    test('valid', function () {
        var result = env.validate({ "highLimit": 10, "lowLimit": 0, "precision": "PT_01" }, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('highLimit missing', function () {
        helper.assertPropertyRequired(env, { "lowLimit": 0, "precision": "PT_0001" }, schema, "highLimit");
    });

    test('lowLimit missing', function () {
        helper.assertPropertyRequired(env, { "highLimit": 10, "precision": "10" }, schema, "lowLimit");
    });

    test('precision missing', function () {
        helper.assertPropertyRequired(env, { "lowLimit": 0, "highLimit": 10 }, schema, "precision");
    });

});
