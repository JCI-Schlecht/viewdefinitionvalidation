/*global suite, test */

var expect = require('expect.js'),
    helper = require('./schema-test-helper.js'),
    jsvAndSchemas = require('../')(),
    env = jsvAndSchemas.env,
    schema = jsvAndSchemas.schemas['device-list.json'];

function createDeviceList() {
    var obj = {},
        list = [];
    list.push(helper.createDevice());
    obj.devices = list;
    return obj;
}

function createEmptyDeviceList() {
    var obj = {},
        list = [];
    obj.devices = list;
    return obj;
}

suite('#json.schemas.device-list', function () {
    test('valid', function () {
        var result = env.validate(createDeviceList(), schema);
        expect(result.errors).to.be.empty(result);
    });

    test('valid with empty list', function () {
        var result = env.validate(createEmptyDeviceList(), schema);
        expect(result.errors).to.be.empty(result);
    });

    test('invalid with bad type', function () {
        var result = env.validate([{}], schema);
        expect(result.errors).not.to.be.empty(result);
    });
});