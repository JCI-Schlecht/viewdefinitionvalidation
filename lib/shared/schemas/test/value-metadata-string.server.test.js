/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['value-metadata-string.json'];

suite('#json.schemas.value-metadata-string', function () {

    test('valid', function () {
        var result = env.validate({ "maxLength": 21 }, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('maxLength missing', function () {
        helper.assertPropertyRequired(env, { }, schema, "maxLength");
    });

});
