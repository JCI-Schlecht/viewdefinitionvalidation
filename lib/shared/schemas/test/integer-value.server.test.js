/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['integer-value.json'];

suite('#json.schemas.integer-value', function () {

    test('valid', function () {
        var result = env.validate(helper.createIntegerValue(), schema);
        expect(result.errors).to.be.empty(result);
    });

    test('valid with dataType 3', function () {
        var result,
            subject = helper.createIntegerValue();
        subject.dataType = 3;
        result = env.validate(subject, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('valid with dataType 16', function () {
        var result,
            subject = helper.createIntegerValue();
        subject.dataType = 16;
        result = env.validate(subject, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('valid with dataType 17', function () {
        var result,
            subject = helper.createIntegerValue();
        subject.dataType = 17;
        result = env.validate(subject, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('valid with dataType 18', function () {
        var result,
            subject = helper.createIntegerValue();
        subject.dataType = 18;
        result = env.validate(subject, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('valid with optional units', function () {
        var result,
            subject = helper.createIntegerValue();
        subject.value.units = {set: 1, id: 1};
        result = env.validate(subject, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('invalid with wrong units', function () {
        var subject = helper.createIntegerValue();
        subject.value.units = 7;
        helper.assertSinglePropertyFailure(env, subject, schema, "value/properties/units", "type");
    });

    test('invalid with wrong dataType', function () {
        var subject = helper.createIntegerValue();
        subject.dataType = 7;
        helper.assertSinglePropertyFailure(env, subject, schema, "dataType", "enum");
    });

    test('invalid with missing dataType', function () {
        var subject = helper.createIntegerValue();
        delete subject.dataType;
        helper.assertPropertyRequired(env, subject, schema, "dataType");
    });

    test('invalid with missing value', function () {
        var subject = helper.createIntegerValue();
        delete subject.value;
        helper.assertPropertyRequired(env, subject, schema, "value");
    });

    test('invalid with missing value.value', function () {
        var subject = helper.createIntegerValue();
        delete subject.value.value;
        helper.assertPropertyRequired(env, subject, schema, "value/properties/value");
    });

    test('invalid with wrong value.value', function () {
        var subject = helper.createIntegerValue();
        subject.value.value = "I'm a string";
        helper.assertSinglePropertyFailure(env, subject, schema, "value/properties/value", "type");
    });
});