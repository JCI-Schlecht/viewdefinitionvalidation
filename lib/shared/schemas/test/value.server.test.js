/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schemaObjectFactory = require('../../schemaobjectfactory/schemaobjectfactory.js').createSchemaObjectFactory(),
    schema = jsvAndSchemas.schemas['value.json'];

suite('#json.schemas.value', function () {
    var createValidValueObject = function () {
            return schemaObjectFactory.createValueNoneWithBACnetObjectReference(3, 2);
        };

    test('valid', function () {
        var result = env.validate(createValidValueObject(), schema);
        expect(result.errors).to.be.empty(result);
    });

    test('identifier missing', function () {
        var invalid = createValidValueObject();
        invalid.identifier = undefined;
        helper.assertSinglePropertyFailure(env, invalid, schema, "identifier", "required");
    });

    test('identifier invalid data type', function () {
        var invalid = createValidValueObject();
        invalid.identifier = { "ZZZ": 1 };
        helper.assertSinglePropertyFailure(env, invalid, schema, "identifier", "type");
    });

    test('value missing', function () {
        var invalid = createValidValueObject();
        invalid.value = undefined;
        helper.assertSinglePropertyFailure(env, invalid, schema, "value", "required");
    });

    test('status missing', function () {
        var invalid = createValidValueObject();
        invalid.status = undefined;
        helper.assertSinglePropertyFailure(env, invalid, schema, "status", "required");
    });

    test('status invalid data type', function () {
        var invalid = createValidValueObject();
        invalid.status = "Blah";
        helper.assertSinglePropertyFailure(env, invalid, schema, "status", "type");
    });

    test('value invalid data type', function () {
        var invalid = createValidValueObject();
        invalid.value = {};
        helper.assertSinglePropertyFailure(env, invalid, schema, "value", "type");
    });

    test('writable missing', function () {
        var invalid = createValidValueObject();
        invalid.writable = undefined;
        helper.assertSinglePropertyFailure(env, invalid, schema, "writable", "required");
    });

    test('writable invalid data type', function () {
        var invalid = createValidValueObject();
        invalid.writable = "5";
        helper.assertSinglePropertyFailure(env, invalid, schema, "writable", "type");
    });

    test('reliability missing', function () {
        var invalid = createValidValueObject();
        invalid.reliability = undefined;
        helper.assertPropertyRequired(env, invalid, schema, "reliability");
    });

});
