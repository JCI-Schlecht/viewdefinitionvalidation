/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['view-element-group-presence-indicator.json'];

suite('#json.schemas.view-element-group-presence-indicator', function () {
    test('valid', function () {
        var result = env.validate(
            helper.randomViewElementGroupPresenceIndicator(),
            schema
        );
        expect(result.errors).to.be.empty(result);
    });

    test('invalid missing value reference', function () {
        var def = helper.randomViewElementGroupPresenceIndicator();
        delete def.valueReference;
        helper.assertPropertyRequired(env, def, schema, "valueReference");
    });

    test('invalid missing operator', function () {
        var def = helper.randomViewElementGroupPresenceIndicator();
        delete def.operator;
        helper.assertPropertyRequired(env, def, schema, "operator");
    });

});