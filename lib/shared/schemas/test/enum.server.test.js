/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['enum.json'];

suite('#json.schemas.enum', function () {

    test('valid', function () {
        var result = env.validate({ "set": 1, "id": 2 }, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('valid with optional text', function () {
        var result = env.validate({ "set": 1, "id": 2, "text": "Super Cool Point" }, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('text invalid data type', function () {
        helper.assertSinglePropertyFailure(env, { "set": 1, "id": 2, "text": 3 }, schema, "text", "type");
    });

    test('set missing', function () {
        helper.assertAnyFailure(env, { "id": 2 }, schema, "set");
    });

    test('id missing', function () {
        helper.assertAnyFailure(env, { "set": 1 }, schema, "id");
    });

});
