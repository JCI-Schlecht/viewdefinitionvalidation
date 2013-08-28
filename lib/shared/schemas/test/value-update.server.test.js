/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['value-update.json'];

suite('#json.schemas.value-update', function () {

    test('valid', function () {
        var result = env.validate(
            {
                "values": [
                    { "identifier": { "objectReference": "3", "attributeId": 2 }, "value": { "dataType": 0 }, "status": {set: 516, id: 0}, "writable": true, "reliability": {set: 503, id: 3} },
                    { "identifier": { "objectReference": "3", "attributeId": 3 }, "value": helper.createStringValue(), "status": {set: 516, id: 0}, "writable": true, "reliability": {set: 503, id: 3} }
                ]
            },
            schema
        );
        expect(result.errors).to.be.empty(result);
    });

    test('values empty', function () {
        var result = env.validate(
            {
                "values": []
            },
            schema
        );
        expect(result.errors).to.be.empty(result);
    });

    test('values missing', function () {
        helper.assertSinglePropertyFailure(env, { }, schema, "values", "required");
    });

    test('values undefined', function () {
        helper.assertSinglePropertyFailure(env, { "values": undefined }, schema, "values", "required");
    });

    test('values null', function () {
        helper.assertSinglePropertyFailure(env, { "values": null }, schema, "values", "type");
    });

    test('values - item in list fails validation for a valid type', function () {
        // todo: there is more information available that a specific index in the array is invalid
        helper.assertSinglePropertyFailure(env,
            {
                "values": [
                    { "identifier": { "objectReference" : 3000011, "attributeId": 2 }, "value": { "dataType": 30 } },
                ]
            }, schema, "values/items", "type");
    });

    test('values - item in list is not a valid type', function () {
        helper.assertSinglePropertyFailure(env,
            {
                "values": [
                    { "what": "am i?" }
                ]
            }, schema, "values/items", "type");
    });

});
