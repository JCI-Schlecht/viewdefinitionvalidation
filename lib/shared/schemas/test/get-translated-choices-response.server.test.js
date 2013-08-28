/*global suite, setup, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['get-translated-choices-response.json'];

suite('#json.schemas.get-translated-choices-response', function () {
    var validSuccessResponse,
        validSuccessEmptyValuesResponse;

    setup(function () {
        validSuccessResponse = { set: 100, status: "success", enumvalues: [{id: 1, text: "eins"}, {id: 2, text: "zwei"}],
                                 locale: "de-de" };
        validSuccessEmptyValuesResponse = { set: 100, status: "success", enumvalues: [], locale: "de-de" };
    });

    test('valid success response', function () {
        var result = env.validate(validSuccessResponse, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('valid success response with empty enumvalues', function () {
        var result = env.validate(validSuccessEmptyValuesResponse, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('valid success response with undefined enumvalues', function () {
        var validSuccessUndefinedEnumValues = validSuccessEmptyValuesResponse,
            result;
        validSuccessUndefinedEnumValues.enumvalues = undefined;
        result = env.validate(validSuccessEmptyValuesResponse, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('missing set', function () {
        var invalidRequest = validSuccessResponse;
        invalidRequest.set = undefined;

        helper.assertAnyFailure(env, invalidRequest, schema);
    });

    test('invalid set', function () {
        var invalidRequest = validSuccessResponse;
        invalidRequest.set = "breaking change";

        helper.assertSinglePropertyFailure(env, invalidRequest, schema, "set", "type");
    });

    test('missing status', function () {
        var invalidRequest = validSuccessResponse;
        invalidRequest.status = undefined;

        helper.assertAnyFailure(env, invalidRequest, schema);
    });

    test('invalid status', function () {
        var invalidRequest = validSuccessResponse;
        invalidRequest.status = "undefined error";

        helper.assertAnyFailure(env, invalidRequest, schema);
    });

    test('missing locale', function () {
        var invalidRequest = validSuccessResponse;
        invalidRequest.locale = undefined;

        helper.assertAnyFailure(env, invalidRequest, schema);
    });

    test('invalid locale', function () {
        var invalidRequest = validSuccessResponse;
        invalidRequest.locale = 27;

        helper.assertAnyFailure(env, invalidRequest, schema);
    });

});
