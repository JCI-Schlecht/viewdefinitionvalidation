/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['view-list-definition.json'];

suite('#json.schemas.view-list-definition', function () {
    var getValidViewList = function () {
        var viewList = { "equipmentType": {"set": 512, "id": 52},
                         "templateId" : "Test Template",
                         "views" : [helper.randomViewDefinition()]
                        };
        return viewList;
    };
    test('valid', function () {
        var result = env.validate(
            getValidViewList(),
            schema
        );
        expect(result.errors).to.be.empty(result);
    });

    test('missing equipmentType', function () {
        var def = getValidViewList();
        delete def.equipmentType;
        helper.assertPropertyRequired(env, def, schema, "equipmentType");
    });

    test('missing templateId', function () {
        var def = getValidViewList();
        delete def.templateId;
        helper.assertPropertyRequired(env, def, schema, "templateId");
    });

    test('missing views', function () {
        var def = getValidViewList();
        delete def.views;
        helper.assertPropertyRequired(env, def, schema, "views");
    });

    test('views needs 1', function () {
        var def = getValidViewList();
        def.views.length = 0;
        helper.assertSinglePropertyFailure(env, def, schema, "views", "minItems");
    });

});