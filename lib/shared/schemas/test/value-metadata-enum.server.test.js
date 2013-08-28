/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['value-metadata-enum.json'];

suite('#json.schemas.value-metadata-enum', function () {

    test('valid', function () {
        var result = env.validate({ "setSize": 10 }, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('setSize missing', function () {
        helper.assertPropertyRequired(env, { }, schema, "setSize");
    });

});
