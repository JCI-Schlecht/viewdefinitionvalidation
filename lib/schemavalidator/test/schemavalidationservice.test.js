/*global suite, setup, teardown, test, require, console */
var expect = require('expect.js'),
    sinon = require('sinon'),
    util = require('util'),
    logger = require('winston'),
    _ = require('underscore'),
    schemaObjFactory = require('./../../../../shared/schemaobjectfactory').createSchemaObjectFactory(),
    mockServiceRepository = require('./../../../../shared/testresources/mock.service.repository').createMockServiceRepository(),
    testSubject = require('../index.js'),
    mockView = require('./../../connection/mock.view.js'),
    nconf = require('nconf');

suite('Schema Validation Service Tests', function () {
    "use strict";

    setup(function () {
        mockServiceRepository.initializeNConf(nconf, require);
        nconf.set('validation:production:viewdefinition', false);
        nconf.set('validation:production:changeofvalue', false);
        nconf.set('validation:production:devicelist', false);
        nconf.set('validation:production:alarms', false);
        nconf.set('validation:development:viewdefinition', true);
        nconf.set('validation:development:changeofvalue', true);
        nconf.set('validation:development:devicelist', true);
        nconf.set('validation:development:alarms', true);
        testSubject.init('development');
    });

    teardown(function () {
        mockServiceRepository.unInitializeNConf(require);
    });


    suite('init production', function () {
        test('disabled device validation does not fail with invalid devicelist', function () {
            testSubject.init('production');
            var payload = schemaObjFactory.createDeviceList([]),
                actual;

            delete payload.devices;
            actual = testSubject.validateDeviceList(payload);
            expect(actual.isUsable).to.be(true);
            expect(payload.validDevices).to.be(undefined);
        });
        test('disabled alarms validation does not fail with invalid alarms', function () {
            testSubject.init('production');
            var payload = {},
                actual = testSubject.validateAlarmResponse(payload);
            expect(actual).to.be(true);
        });
        test('disabled view definition validation does not fail with invalid view definition', function () {
            testSubject.init('production');
            var payload = {},
                actual = testSubject.validateViewListResponse(payload);
            expect(actual).to.be.an('object');
            expect(actual.isUsable).to.be(true);
            expect(actual.validViews).to.be.eql([]);
        });
        test('disabled cov validation does not fail with invalid cov', function () {
            testSubject.init('production');
            var payload = schemaObjFactory.createAttributeValues([schemaObjFactory.createValueNoneWithBACnetObjectReference(6, 7)]),
                actual;
            delete payload.values;
            actual = testSubject.validateUpdate(payload);

            expect(actual).to.be(true);

        });
    });

    suite('validateDeviceList', function () {
        test('will return unusable if structure is invalid', function () {
            var payload = schemaObjFactory.createDeviceList([]),
                actual;

            delete payload.devices;
            actual = testSubject.validateDeviceList(payload);

            expect(actual).to.be.an('object');
            expect(actual.isUsable).to.be(false);
            expect(actual.validDevices.length).to.be(0);
        });

        test('will return usable if structure is valid, empty list', function () {
            var payload = schemaObjFactory.createDeviceList([]),
                actual;

            actual = testSubject.validateDeviceList(payload);

            expect(actual).to.be.an('object');
            expect(actual.isUsable).to.be(true);
            expect(actual.validDevices.length).to.be(0);
        });
        test('will return usable if structure is valid, list contains a single invalid device', function () {
            var devices = [schemaObjFactory.createDevice("test", "for a test", 5, true, false, [ { reference: "2" } ])],
                payload,
                actual;

            delete devices[0].equipmentModels;
            payload = schemaObjFactory.createDeviceList(devices);
            actual = testSubject.validateDeviceList(payload);

            expect(actual).to.be.an('object');
            expect(actual.isUsable).to.be(true);
            expect(actual.validDevices.length).to.be(0);
        });
        test('will return usable if structure is valid and valid devices when list contains invalid device', function () {
            var devices = [schemaObjFactory.createDevice("test", "for a test", 5, true, false, [ { reference: "2" } ]), schemaObjFactory.createDevice("testerman", "second device", 7, true, false, [ { reference: "3" } ])],
                payload,
                actual;

            delete devices[0].equipmentModels;
            payload = schemaObjFactory.createDeviceList(devices);
            actual = testSubject.validateDeviceList(payload);

            expect(actual).to.be.an('object');
            expect(actual.isUsable).to.be(true);
            expect(actual.validDevices.length).to.be(1);
            expect(actual.validDevices[0].name).to.be('testerman');
        });
    });

    test('validateSubscription will return true for valid subscription', function () {
        var payload = schemaObjFactory.createReadWithSignupRequest([schemaObjFactory.createAttributeReferenceWithBACnetObjectReference(6, 7)]),
            actual = testSubject.validateSubscription(payload);

        expect(actual).to.be(true);
    });

    test('validateUpdate will return true for valid update', function () {
        var payload = schemaObjFactory.createAttributeValues([schemaObjFactory.createValueNoneWithBACnetObjectReference(6, 7)]),
            actual = testSubject.validateUpdate(payload);

        expect(actual).to.be(true);
    });

    test('validateViewRequest will return true for valid view request', function () {
        var payload = schemaObjFactory.createViewRequest("entity", 0),
            actual = testSubject.validateViewRequest(payload);

        expect(actual).to.be(true);
    });

    test('validateViewResponse will return true for valid view response', function () {
        var payload = mockView(schemaObjFactory.createViewRequest("entity", 0)),
            actual = testSubject.validateViewResponse(payload.views[0]);

        expect(actual).to.be(true);
    });

    test('validateViewDefinitionRequest will return true for valid request', function () {
        var payload = schemaObjFactory.createViewDefinitionRequest(10),
            actual = testSubject.validateViewDefinitionRequest(payload);

        expect(actual).to.be(true);
    });

});