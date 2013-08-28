/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['view-definition.json'];

suite('#json.schemas.view-definition', function () {
    test('valid', function () {
        var result = env.validate(
            helper.randomViewDefinition(),
            schema
        );
        expect(result.errors).to.be.empty(result);
    });

    test('missing viewId', function () {
        var def = helper.randomViewDefinition();
        delete def.viewId;
        helper.assertPropertyRequired(env, def, schema, "viewId");
    });

    test('missing elements', function () {
        var def = helper.randomViewDefinition();
        delete def.elements;
        helper.assertPropertyRequired(env, def, schema, "elements");
    });

    test('elements needs 1', function () {
        var def = helper.randomViewDefinition();
        def.elements.length = 0;
        helper.assertSinglePropertyFailure(env, def, schema, "elements", "minItems");
    });

});