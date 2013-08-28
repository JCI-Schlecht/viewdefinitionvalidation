/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['device.json'];

suite('#json.schemas.device', function () {
    test('valid', function () {
        var result = env.validate(helper.createDevice(), schema);
        expect(result.errors).to.be.empty(result);
    });

    test('name missing', function () {
        var device = helper.createDevice();
        delete device.name;
        helper.assertSinglePropertyFailure(env, device, schema, "name", "required");
    });

    test('itemReference missing', function () {
        var device = helper.createDevice();
        delete device.itemReference;
        helper.assertSinglePropertyFailure(env, device, schema, "itemReference", "required");
    });

    test('hasActiveCriticalAlarms missing', function () {
        var device = helper.createDevice();
        delete device.hasActiveCriticalAlarms;
        helper.assertSinglePropertyFailure(env, device, schema, "hasActiveCriticalAlarms", "required");
    });

    test('description missing', function () {
        var device = helper.createDevice();
        delete device.description;
        helper.assertSinglePropertyFailure(env, device, schema, "description", "required");
    });

    test('address missing', function () {
        var device = helper.createDevice();
        delete device.address;
        helper.assertSinglePropertyFailure(env, device, schema, "address", "required");
    });

    test('equipmentModels missing', function () {
        var device = helper.createDevice();
        delete device.equipmentModels;
        helper.assertSinglePropertyFailure(env, device, schema, "equipmentModels", "required");
    });

    test('equipmentModels must have 1 entry', function () {
        var device = helper.createDevice();
        device.equipmentModels.pop();
        helper.assertSinglePropertyFailure(env, device, schema, "equipmentModels", "minItems");
    });

    test('isOnline missing', function () {
        var device = helper.createDevice();
        delete device.isOnline;
        helper.assertSinglePropertyFailure(env, device, schema, "isOnline", "required");
    });

    test('hasMtgConnected missing', function () {
        var device = helper.createDevice();
        delete device.hasMtgConnected;
        helper.assertSinglePropertyFailure(env, device, schema, "hasMtgConnected", "required");
    });

    test('name wrong type', function () {
        var device = helper.createDevice();
        device.name = {};
        helper.assertSinglePropertyFailure(env, device, schema, "name", "type");
    });

    test('itemReference wrong type', function () {
        var device = helper.createDevice();
        device.itemReference = {};
        helper.assertSinglePropertyFailure(env, device, schema, "itemReference", "type");
    });

    test('hasActiveCriticalAlarms wrong type', function () {
        var device = helper.createDevice();
        device.hasActiveCriticalAlarms = {};
        helper.assertSinglePropertyFailure(env, device, schema, "hasActiveCriticalAlarms", "type");
    });

    test('description wrong type', function () {
        var device = helper.createDevice();
        device.description = {};
        helper.assertSinglePropertyFailure(env, device, schema, "description", "type");
    });

    test('address wrong type', function () {
        var device = helper.createDevice();
        device.address = {};
        helper.assertSinglePropertyFailure(env, device, schema, "address", "type");
    });

    test('isOnline wrong type', function () {
        var device = helper.createDevice();
        device.isOnline = {};
        helper.assertSinglePropertyFailure(env, device, schema, "isOnline", "type");
    });
});