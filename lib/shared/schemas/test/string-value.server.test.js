/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['string-value.json'];

suite('#json.schemas.string-value', function () {

    test('valid', function () {
        var result = env.validate(helper.createStringValue(), schema);
        expect(result.errors).to.be.empty(result);
    });

    test('invalid with missing value', function () {
        var subject = helper.createStringValue();
        delete subject.value;
        helper.assertPropertyRequired(env, subject, schema, "value");
    });

    // NEW - Missing value.value string
    test('invalid with missing value.value', function () {
        var subject = helper.createStringValue();
        delete subject.value.value;
        helper.assertPropertyRequired(env, subject, schema, "value/properties/value");
    });

    // Missing dataType enum
    test('invalid with missing dataType', function () {
        var subject = helper.createStringValue();
        delete subject.dataType;
        helper.assertPropertyRequired(env, subject, schema, "dataType");
    });

    // Wrong dataType enum value
    test('invalid with wrong dataType', function () {
        var subject = helper.createStringValue();
        subject.dataType = 0;
        helper.assertSinglePropertyFailure(env, subject, schema, "dataType", "enum");
    });

    // Wrong value object type
    test('invalid with wrong value type', function () {
        var subject = helper.createStringValue();
        subject.value = "String";
        helper.assertSinglePropertyFailure(env, subject, schema, "value", "type");
    });

    // NEW - Wrong value.value type
    test('invalid with wrong value.value', function () {
        var subject = helper.createStringValue();
        subject.value.value = 1;
        helper.assertSinglePropertyFailure(env, subject, schema, "value/properties/value", "type");
    });

    // NEW - Missing maxLength
    test('invalid with missing value.maxLength', function () {
        var subject = helper.createStringValue(),
            result;
        delete subject.value.maxLength;
        result = env.validate(subject, schema);
        helper.assertPropertyRequired(env, subject, schema, "value/properties/maxLength");
    });

    // NEW - Wrong value.maxLength type
    test('invalid with wrong type value.maxLength', function () {
        var subject = helper.createStringValue();
        subject.value.maxLength = "Strings are invalid for this property";
        helper.assertSinglePropertyFailure(env, subject, schema, "value/properties/maxLength", "type");
    });
});