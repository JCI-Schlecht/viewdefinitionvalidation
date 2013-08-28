/*global suite, test */

var expect = require('expect.js'),
    helper = require('../../test/schema-test-helper.js'),
    jsvAndSchemas = require('../../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['fqr-objectreference.json'];

suite('#json.schemas.point-model.fqr-objectreference', function () {

    test('valid', function () {
        helper.assertNoFailure(env, { "objectReference": "UCB.RTU.HVAC ZONE"}, schema);
    });

});
