/*global suite, setup, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['view-definition-request.json'];

suite('#json.schemas.view-definition-request', function () {
    var validViewDefinitionRequest;

    setup(function () {
        validViewDefinitionRequest = {"oid": 275};
    });

    test('valid', function () {
        var result = env.validate(validViewDefinitionRequest, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('missing oid', function () {
        var invalidViewDefinitionRequest = validViewDefinitionRequest;
        invalidViewDefinitionRequest.oid = undefined;
        helper.assertPropertyRequired(env, invalidViewDefinitionRequest, schema, "oid");
    });
});