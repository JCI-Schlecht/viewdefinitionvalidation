/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['float-value.json'];

suite('#json.schemas.float-value', function () {

    test('valid', function () {
        var result = env.validate(helper.createFloatValue(), schema);
        expect(result.errors).to.be.empty(result);
    });

    test('valid with optional units', function () {
        var subject = helper.createFloatValue(),
            result;
        subject.value.units = {set: 1, id: 1};
        result = env.validate(subject, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('valid with double datatype', function () {
        var subject = helper.createFloatValue(),
            result;
        subject.dataType = 5;
        result = env.validate(subject, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('wrong value (string)', function () {
        var subject = helper.createFloatValue();
        subject.value = "string";
        helper.assertSinglePropertyFailure(env, subject, schema, "value", "type");
    });

    test('wrong dataType', function () {
        var subject = helper.createFloatValue();
        subject.dataType = 1;
        helper.assertSinglePropertyFailure(env, subject, schema, "dataType", "enum");
    });

    test('missing value', function () {
        var subject = helper.createFloatValue();
        delete subject.value;
        helper.assertPropertyRequired(env, subject, schema, "value");
    });

    test('missing value.value', function () {
        var subject = helper.createFloatValue();
        delete subject.value.value;
        helper.assertPropertyRequired(env, subject, schema, "value/properties/value");
    });

    test('missing precision', function () {
        var subject = helper.createFloatValue();
        delete subject.value.precision;
        helper.assertPropertyRequired(env, subject, schema, "value/properties/precision");
    });

    test('missing dataType', function () {
        var subject = helper.createFloatValue();
        delete subject.dataType;
        helper.assertPropertyRequired(env, subject, schema, "dataType");
    });

    test('invalid precision dataType', function () {
        var subject = helper.createFloatValue();
        subject.value.precision = "Whoaaa";
        helper.assertSinglePropertyFailure(env, subject, schema, "value/properties/precision", "enum");
    });
});