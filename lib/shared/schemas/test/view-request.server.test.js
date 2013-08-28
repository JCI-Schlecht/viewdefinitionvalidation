/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['view-request.json'];

suite('#json.schemas.view-request', function () {
    test('valid', function () {
        var result = env.validate({"equipmentModelReference": "1", "viewId": 0}, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('missing equipmentModelReference', function () {
        helper.assertPropertyRequired(env, { "viewId": 2 }, schema, "equipmentModelReference");
    });

    test('missing viewId', function () {
        helper.assertPropertyRequired(env, { "equipmentModelReference": "33330" }, schema, "viewId");
    });

});