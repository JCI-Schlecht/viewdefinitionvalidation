/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['view-element-value.json'];

suite('#json.schemas.view-element-value', function () {
    test('valid', function () {
        var result = env.validate(
            helper.randomViewElementValue(),
            schema
        );
        expect(result.errors).to.be.empty(result);
    });

    test('viewElementType invalid', function () {
        var def = helper.randomViewElementValue();
        def.viewElementType = "woot!";
        helper.assertSinglePropertyFailure(env, def, schema, "viewElementType", "enum");
    });

    test('missing viewElementType', function () {
        var def = helper.randomViewElementValue();
        delete def.viewElementType;
        helper.assertPropertyRequired(env, def, schema, "viewElementType");
    });

    test('missing valueReference', function () {
        var def = helper.randomViewElementValue();
        delete def.valueReference;
        helper.assertPropertyRequired(env, def, schema, "valueReference");
    });

    test('missing label', function () {
        var def = helper.randomViewElementValue();
        delete def.label;
        helper.assertPropertyRequired(env, def, schema, "label");
    });

    test('missing shortLabel', function () {
        var def = helper.randomViewElementValue();
        delete def.shortLabel;
        helper.assertPropertyRequired(env, def, schema, "shortLabel");
    });

});