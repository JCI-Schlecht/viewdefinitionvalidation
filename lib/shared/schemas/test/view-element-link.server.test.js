/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['view-element-link.json'];

suite('#json.schemas.view-element-link', function () {
    test('valid', function () {
        var result = env.validate(
            helper.randomViewElementLink(),
            schema
        );
        expect(result.errors).to.be.empty(result);
    });

    test('missing viewElementType', function () {
        var def = helper.randomViewElementLink();
        delete def.viewElementType;
        helper.assertPropertyRequired(env, def, schema, "viewElementType");
    });

    test('missing label', function () {
        var def = helper.randomViewElementLink();
        delete def.label;
        helper.assertPropertyRequired(env, def, schema, "label");
    });

    test('missing linkViewId', function () {
        var def = helper.randomViewElementLink();
        delete def.linkViewId;
        helper.assertPropertyRequired(env, def, schema, "linkViewId");
    });

    test('missing linkGroupId', function () {
        var def = helper.randomViewElementLink();
        delete def.linkGroupId;
        helper.assertPropertyRequired(env, def, schema, "linkGroupId");
    });

});