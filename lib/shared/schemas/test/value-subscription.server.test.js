/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['value-subscription.json'];

suite('#json.schemas.value-subscription', function () {

    test('valid', function () {
        var result = env.validate(
            {
                "identifiers": [
                    {
                        "objectReference": "3",
                        "attributeId": 2
                    }
                ]
            },
            schema
        );
        expect(result.errors).to.be.empty(result);
    });

    test('identifiers empty', function () {
        var result = env.validate(
            {
                "identifiers": []
            },
            schema
        );
        expect(result.errors).to.be.empty(result);
    });

    test('identifiers missing', function () {
        helper.assertSinglePropertyFailure(env, { }, schema, "identifiers", "required");
    });

    test('identifiers undefined', function () {
        helper.assertSinglePropertyFailure(env, { "identifiers": undefined }, schema, "identifiers", "required");
    });

    test('identifiers null', function () {
        helper.assertSinglePropertyFailure(env, { "identifiers": null }, schema, "identifiers", "type");
    });

    test('item in list is not a valid type', function () {
        // todo: there is more information available that a specific index in the array is invalid
        helper.assertSinglePropertyFailure(env, { "identifiers": [ { "whatThe": 0 }] }, schema, "identifiers/items", "type");
    });

});
