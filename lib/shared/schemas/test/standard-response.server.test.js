/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['standard-response.json'],
    schemaObjFactory = require('../../schemaobjectfactory').createSchemaObjectFactory();

suite('#json.schemas.standard-response', function () {
    var dummySet = 1213;
    function createResultCode(id) {
        return {set: dummySet, id: id};
    }

    test('valid', function () {
        var result = env.validate(schemaObjFactory.createStandardResponseObjectFromResultCode(12, 'test message'), schema);
        expect(result.errors).to.be.empty(result);
    });

    test('valid with optional message', function () {
        var result = env.validate({ "resultCode": createResultCode(12), "message": "Whoops! We lost track of time." }, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('resultCode missing', function () {
        helper.assertPropertyRequired(env, { }, schema, "resultCode", "required");
    });

    test('resultCode invalid with missing enum.set', function () {
        var enumValue = createResultCode(12);
        delete enumValue.set;
        helper.assertSinglePropertyFailure(env, { "resultCode": enumValue }, schema, "resultCode", "type");
    });

    test('resultCode invalid with missing enum.id', function () {
        var enumValue = createResultCode(12);
        delete enumValue.id;
        helper.assertSinglePropertyFailure(env, { "resultCode": enumValue }, schema, "resultCode", "type");
    });

    test('resultCode invalid data type', function () {
        // failure 1: invalid type, failure 2: not a valid enum choice
        helper.assertAnyFailure(env, { "resultCode": 4 }, schema);
    });

});
