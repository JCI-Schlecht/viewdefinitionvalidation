/*global suite, test */

var expect = require('expect.js'),
    helper = require('../../test/schema-test-helper.js'),
    jsvAndSchemas = require('../../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['bacnet-property-reference.json'];

suite('#json.schemas.point-model.bacnet-property-reference', function () {

    test('valid', function () {
        helper.assertNoFailure(env, { "bacoid": 3, "attributeId": 2 }, schema);
    });

    test('bacoid missing', function () {
        helper.assertPropertyRequired(env, { "attributeId": 2 }, schema, "bacoid");
    });

    test('attributeId missing', function () {
        helper.assertPropertyRequired(env, { "bacoid": 3 }, schema, "attributeId");
    });

});
