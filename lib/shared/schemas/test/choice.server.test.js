/*global suite, setup, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['choice.json'];

suite('#json.schemas.choice', function () {
    var validChoice;

    setup(function () {
        validChoice = {id: 1, text: "eins"};
    });

    test('valid', function () {
        var result = env.validate(validChoice, schema);
        expect(result.errors).to.be.empty(result);
    });

    test('missing id', function () {
        var invalidChoice = validChoice;
        invalidChoice.id = undefined;

        helper.assertPropertyRequired(env, invalidChoice, schema, "id");
    });

    test('invalid id', function () {
        var invalidChoice = validChoice;
        invalidChoice.id = "broken";

        helper.assertSinglePropertyFailure(env, invalidChoice, schema, "id", "type");
    });

    test('missing text', function () {
        var invalidChoice = validChoice;
        invalidChoice.text = undefined;

        helper.assertPropertyRequired(env, invalidChoice, schema, "text");
    });

    test('invalid text', function () {
        var invalidChoice = validChoice;
        invalidChoice.text = 25;

        helper.assertSinglePropertyFailure(env, invalidChoice, schema, "text", "type");
    });

});