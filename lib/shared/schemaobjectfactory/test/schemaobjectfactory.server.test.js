/*global suite, setup, teardown, test, require, console */
var expect = require('expect.js'),
    sinon = require('sinon'),
    util = require('util'),
    _ = require('underscore'),
    schemavalidator = require('./../../../server/lib/schemavalidator'),
    testSubject = require('./../schemaobjectfactory.js').createSchemaObjectFactory();

suite('Server Schema Object Factory Tests', function () {
    "use strict";

    test('create a single identifier', function () {
        var objectId = 6,
            attributeId = 7,
            actualIdentfifier = testSubject.createValueNoneWithBACnetObjectReference(objectId, attributeId).identifier;

        expect(actualIdentfifier.bacoid).to.be(objectId);
        expect(actualIdentfifier.attributeId).to.be(attributeId);
    });


    suite('createChoiceResponse tests', function () {
        var validPhrases = { '0': 'Do not look directly into the sun.',
                             '5': 'It was fun, it was real, but it was not real fun.' };

        test('use createChoiceResponse as expected', function () {
            var testSet = 5,
                testLocale = 'en-us',
                actual = testSubject.createChoiceResponse(testSet, testLocale, validPhrases, _);

            expect(schemavalidator.validateChoicesResponse(actual)).to.be(true);
        });

        test('use createChoiceResponse with a valid number as a string', function () {
            var testSet = '250',
                testLocale = 'en-us',
                actual = testSubject.createChoiceResponse(testSet, testLocale, validPhrases, _);

            expect(schemavalidator.validateChoicesResponse(actual)).to.be(true);
        });

        test('use createChoiceResponse with a invalid number as a string', function () {
            var testSet = 'ThisShouldThrow',
                testLocale = 'en-us',
                actual;

            expect(function () {
                testSubject.createChoiceResponse(testSet, testLocale, validPhrases, _);
            }).to.throwException(function (error) {
                expect(error.message).to.be('Unable to parse [' + testSet + '] into an int.');
            });
        });

        test('use createChoiceResponse with an undefined locale throw an exception', function () {
            var testSet = '250',
                actual;

            expect(function () {
                actual = testSubject.createChoiceResponse(testSet, undefined, validPhrases, _);
            }).to.throwException(function (error) {
                expect(error.message).to.be('locale is undefined cannot create response.');
            });
        });

        test('use createChoiceResponse with an undefined phrases will return response with status of failedToTranslate', function () {
            var testSet = '250',
                testLocale = 'en-us',
                actual = testSubject.createChoiceResponse(testSet, testLocale, undefined, _);

            expect(schemavalidator.validateChoicesResponse(actual)).to.be(true);
            expect(actual.status).to.be('failedToTranslate');
        });

        test('use createChoiceResponse with an empty phrases array will return response with status of failedToTranslate', function () {
            var testSet = '250',
                testLocale = 'en-us',
                actual = testSubject.createChoiceResponse(testSet, testLocale, [], _);

            expect(schemavalidator.validateChoicesResponse(actual)).to.be(true);
            expect(actual.status).to.be('failedToTranslate');
        });

        test('use createChoiceResponse with an empty object literal will return response with status of failedToTranslate', function () {
            var testSet = '250',
                testLocale = 'en-us',
                actual = testSubject.createChoiceResponse(testSet, testLocale, {}, _);

            expect(schemavalidator.validateChoicesResponse(actual)).to.be(true);
            expect(actual.status).to.be('failedToTranslate');
        });

        test('use createChoiceResponse with an malformed phrases array (Garbage in Garbage out)', function () {
            var testSet = '250',
                testLocale = 'en-us',
                invalidPhrase = { 'NCAA': 65.5,
                                  'NBA': {'this': 'is bad news'} },
                actual = testSubject.createChoiceResponse(testSet, testLocale, invalidPhrase, _);

            expect(schemavalidator.validateChoicesResponse(actual)).to.be(true);
        });

        test('use createChoiceResponse with an undefined reference to underscore will throw', function () {
            var testSet = '250',
                testLocale = 'en-us',
                actual;

            expect(function () {
                actual = testSubject.createChoiceResponse(testSet, testLocale, validPhrases, undefined);
            }).to.throwException(function (error) {
                expect(error.message).to.be('Cannot call method \'map\' of undefined');
            });
        });

        test('use createViewDefinitionRequest with a valid number', function () {
            var testOid = 10,
                actual;

            actual = testSubject.createViewDefinitionRequest(testOid);
            expect(schemavalidator.validateViewDefinitionRequest(actual)).to.be(true);
        });

        test('use createViewDefinitionRequest with a valid number as a string', function () {
            var testOid = '10',
                actual;

            actual = testSubject.createViewDefinitionRequest(testOid);
            expect(schemavalidator.validateViewDefinitionRequest(actual)).to.be(true);
        });

        test('use createViewDefinitionRequest with a string that cannot be converted to a number', function () {
            var testOid = 'junk',
                actual;
            expect(function () {
                testSubject.createViewDefinitionRequest(testOid);
            }).to.throwException(function (err) {
                expect(err.name).to.be("Error");
                expect(err.message).to.be("Cannot convert junk to a number");
            });
        });
    });

    suite('generation of GetAlarmList Request', function () {
        test('generation o GetAlarlList Request should pass schema validation', function () {
            var generatedObject = testSubject.createGetAlarmListRequest('test id');
            expect(schemavalidator.validateAlarmRequest(generatedObject)).to.be(true);

        });
    });

    suite('createValueWithoutUnitsUsingBACnetObjectReference', function () {
        // HINTS FOR HOW TO USE THE VALUE PROPERTY: NONE (0): value not required, BOOL (1): see enum.json, ULONG (2): see numeric.json, 
        // LONG (3): see numeric.json, FLOAT (4): see numeric.json, DOUBLE (5): see numeric.json, OCTET_STRING (6): STRING (7): standard json string,
        // BIT_STRING (8):, ENUM (9): see enum.json, 
        // DATE (10):, TIME (11):, BAC_OID (12):, (13):, (14):, (15):,
        // BYTE (16): see numeric.json, SHORT (17): see numeric.json, USHORT (18): see numeric.json,
        // (19):, OID (20):, LIST (21):, LIST_OF (22):, ARRAY (23):, STRUCT (24):, OBJECT_REFERENCE (25):, ATTRIBUTE_REFERENCE (26):
        test('generate value with datatype none (0)', function () {
            var generatedValue = testSubject.createValueWithoutUnitsUsingBACnetObjectReference(0, 25, 100),
                updateMsg = {values: [generatedValue]};
            expect(schemavalidator.validateUpdate(updateMsg)).to.be(true);
        });

        test('generate value with datatype bool (1)', function () {
            var generatedValue = testSubject.createValueWithoutUnitsUsingBACnetObjectReference(1, 25, 100),
                updateMsg = {values: [generatedValue]};
            expect(schemavalidator.validateUpdate(updateMsg)).to.be(true);
        });

        test('generate value with datatype ulong (2)', function () {
            var generatedValue = testSubject.createValueWithoutUnitsUsingBACnetObjectReference(2, 25, 100),
                updateMsg = {values: [generatedValue]};
            expect(schemavalidator.validateUpdate(updateMsg)).to.be(true);
        });

        test('generate value with datatype long (3)', function () {
            var generatedValue = testSubject.createValueWithoutUnitsUsingBACnetObjectReference(3, 25, 100),
                updateMsg = {values: [generatedValue]};
            expect(schemavalidator.validateUpdate(updateMsg)).to.be(true);
        });

        test('generate value with datatype float (4)', function () {
            var generatedValue = testSubject.createValueWithoutUnitsUsingBACnetObjectReference(4, 25, 100),
                updateMsg = {values: [generatedValue]};
            expect(schemavalidator.validateUpdate(updateMsg)).to.be(true);
        });

        test('generate value with datatype DOUBLE (5)', function () {
            var generatedValue = testSubject.createValueWithoutUnitsUsingBACnetObjectReference(5, 25, 100),
                updateMsg = {values: [generatedValue]};
            expect(schemavalidator.validateUpdate(updateMsg)).to.be(true);
        });

        test('generate value with datatype STRING (7)', function () {
            var generatedValue = testSubject.createValueWithoutUnitsUsingBACnetObjectReference(7, 25, 100),
                updateMsg = {values: [generatedValue]};
            expect(schemavalidator.validateUpdate(updateMsg)).to.be(true);
        });

        test('generate value with datatype ENUM (9)', function () {
            var generatedValue = testSubject.createValueWithoutUnitsUsingBACnetObjectReference(9, 25, 100),
                updateMsg = {values: [generatedValue]};
            expect(schemavalidator.validateUpdate(updateMsg)).to.be(true);
        });

        test('generate value with datatype BYTE (16)', function () {
            var generatedValue = testSubject.createValueWithoutUnitsUsingBACnetObjectReference(16, 25, 100),
                updateMsg = {values: [generatedValue]};
            expect(schemavalidator.validateUpdate(updateMsg)).to.be(true);
        });

        test('generate value with datatype SHORT (17)', function () {
            var generatedValue = testSubject.createValueWithoutUnitsUsingBACnetObjectReference(17, 25, 100),
                updateMsg = {values: [generatedValue]};
            expect(schemavalidator.validateUpdate(updateMsg)).to.be(true);
        });

        test('generate value with datatype USHORT (18)', function () {
            var generatedValue = testSubject.createValueWithoutUnitsUsingBACnetObjectReference(18, 25, 100),
                updateMsg = {values: [generatedValue]};
            expect(schemavalidator.validateUpdate(updateMsg)).to.be(true);
        });

    });
});