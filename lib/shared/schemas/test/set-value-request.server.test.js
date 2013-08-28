/*global suite, test, setup */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['set-value-request.json'];

suite('#json.schemas.set-value-request', function () {

    var validWithFQR,
        validWithBacNetPropertyReference,
        stringToWrite;

    setup(function () {
        stringToWrite = {"value": "string", "datatype": 7};
        validWithFQR = { "valueReference": {"objectReference": "something.like.this", "attributeId": 10}, "write": stringToWrite};
        validWithBacNetPropertyReference = { "valueReference": { "bacoid": 3, "attributeId": 2 }, "write": stringToWrite};
    });

    test('valid with FQR value reference', function () {
        helper.assertNoFailure(env, validWithFQR, schema);
    });

    test('valid with BacNet value reference', function () {
        helper.assertNoFailure(env, validWithBacNetPropertyReference, schema);
    });

    test('valueReference missing', function () {
        var invalid = validWithFQR;
        invalid.valueReference = undefined;
        helper.assertPropertyRequired(env, invalid, schema, "valueReference");
    });

    test('valueReference invalid data type', function () {
        var invalid = validWithFQR;
        invalid.valueReference = true;
        helper.assertSinglePropertyFailure(env, invalid, schema, "valueReference", "type");
    });

    test('write property missing', function () {
        var invalid = validWithFQR;
        invalid.write = undefined;
        helper.assertPropertyRequired(env, invalid, schema, "write");
    });

    test('missing write data type', function () {
        var invalid = validWithFQR;
        invalid.write.datatype = undefined;
        helper.assertPropertyRequired(env, invalid, schema, "write/properties/datatype");
    });

    test('write data type not a valid number', function () {
        var invalid = validWithFQR;
        invalid.write.datatype = 2000;
        helper.assertSinglePropertyFailure(env, invalid, schema, "write/properties/datatype", "enum");
    });

});
