/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['view-element-group.json'];

suite('#json.schemas.view-element-group', function () {
    test('valid', function () {
        var result = env.validate(
            helper.randomViewElementGroup(),
            schema
        );
        expect(result.errors).to.be.empty(result);
    });

    test('valid with optional presenceIndicator', function () {
        var result = env.validate(
            helper.randomViewElementGroupWithPresenceIndicator(),
            schema
        );
        expect(result.errors).to.be.empty(result);
    });

    test('viewElementType invalid', function () {
        var def = helper.randomViewElementGroup();
        def.viewElementType = "woot!";
        helper.assertSinglePropertyFailure(env, def, schema, "viewElementType", "enum");
    });

    test('missing viewElementType', function () {
        var def = helper.randomViewElementGroup();
        delete def.viewElementType;
        helper.assertPropertyRequired(env, def, schema, "viewElementType");
    });

    test('missing label', function () {
        var def = helper.randomViewElementGroup();
        delete def.label;
        helper.assertPropertyRequired(env, def, schema, "label");
    });

    test('missing elements', function () {
        var def = helper.randomViewElementGroup();
        delete def.elements;
        helper.assertPropertyRequired(env, def, schema, "elements");
    });

    test('elements needs 1', function () {
        var def = helper.randomViewElementGroup();
        def.elements.length = 0;
        helper.assertSinglePropertyFailure(env, def, schema, "elements", "minItems");
    });

});