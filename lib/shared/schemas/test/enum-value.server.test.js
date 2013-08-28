/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['enum-value.json'];

suite('#json.schemas.enum-value', function () {

    test('valid', function () {
        var result = env.validate(helper.createEnumValue(), schema);
        expect(result.errors).to.be.empty(result);
    });

    test('valid with dataType 9', function () {
        var result,
            subject = helper.createEnumValue();
        subject.dataType = 9;
        result = env.validate(subject, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('invalid with missing dataType', function () {
        var subject = helper.createEnumValue();
        delete subject.dataType;
        helper.assertPropertyRequired(env, subject, schema, "dataType");
    });

    test('invalid with wrong dataType', function () {
        var subject = helper.createEnumValue();
        subject.dataType = 2;
        helper.assertSinglePropertyFailure(env, subject, schema, "dataType", "enum");
    });

    test('invalid with missing value', function () {
        var subject = helper.createEnumValue();
        delete subject.value;
        helper.assertPropertyRequired(env, subject, schema, "value");
    });

    test('invalid with missing enum set', function () {
        var subject = helper.createEnumValue();
        delete subject.value.set;
        helper.assertSinglePropertyFailure(env, subject, schema, "value", "type");
    });

    test('invalid with missing enum id', function () {
        var subject = helper.createEnumValue();
        delete subject.value.id;
        helper.assertSinglePropertyFailure(env, subject, schema, "value", "type");
    });

    test('invalid with bad enum set', function () {
        var subject = helper.createEnumValue();
        subject.value.set = "I'm a string";
        helper.assertSinglePropertyFailure(env, subject, schema, "value", "type");
    });

    test('invalid with bad enum id', function () {
        var subject = helper.createEnumValue();
        subject.value.id = "I'm a string";
        helper.assertSinglePropertyFailure(env, subject, schema, "value", "type");
    });
});