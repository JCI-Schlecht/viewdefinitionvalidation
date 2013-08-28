/*global suite, test */

var expect = require('expect.js'),
    helper = require('../../test/schema-test-helper.js'),
    jsvAndSchemas = require('../../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['fqr-property-reference.json'];

suite('#json.schemas.point-model.fqr-property-reference', function () {

    test('valid', function () {
        helper.assertNoFailure(env, { "objectReference": "UCB.RTU.HVAC ZONE", "attributeId": 2 }, schema);
    });

    test('objectReference missing', function () {
        helper.assertPropertyRequired(env, { "attributeId": 2 }, schema, "objectReference");
    });

    test('attributeId missing', function () {
        helper.assertPropertyRequired(env, {  "objectReference": "UCB.RTU.HVAC ZONE"}, schema, "attributeId");
    });

});
