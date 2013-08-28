/*global suite, test, dependencies:true, expect, schemaObjectFactory */

dependencies = ["../schemaobjectfactory.js"];

suite('Client Schema Object Factory Tests', function () {
    "use strict";

    var testSubject = schemaObjectFactory.createSchemaObjectFactory();

    test('create a single identifier', function () {
        var objectId = 6,
            attributeId = 7,
            actualIdentifier = testSubject.createValueNoneWithBACnetObjectReference(objectId, attributeId).identifier;

        expect(actualIdentifier.bacoid).to.be(objectId);
        expect(actualIdentifier.attributeId).to.be(attributeId);
    });

    test('create a float value with no units', function () {
        var datatype = 5,
            objectId = 6,
            attributeId = 7,
            actualIdentifier = testSubject.createValueWithoutUnitsUsingBACnetObjectReference(datatype, objectId, attributeId);

        expect(actualIdentifier.identifier.bacoid).to.be(objectId);
        expect(actualIdentifier.identifier.attributeId).to.be(attributeId);
        expect(actualIdentifier.value.dataType).to.be(datatype);
    });

    suite('Generate ViewDefTree Tests', function () {
        //TODO: test viewdefinition generation throuh schema validator
        //TODO: add links, and bacoids to view def generation (and appropriate unit tests)
        var verifyLabel = function (label) {
                expect(label).to.not.be(undefined);
                expect(label.set).to.not.be(undefined);
                expect(label.id).to.not.be(undefined);
                expect(label.set).to.be.a("number");
                expect(label.id).to.be.a("number");
            },
            verifyViewElementType = function (viewElementType, expectedType) {
                expect(viewElementType).to.not.be(undefined);
                expect(viewElementType).to.be(expectedType);
            },
            verifyValue = function (element, isObjectReference) {
                expect(element).to.not.be(undefined);
                verifyLabel(element.label);
                verifyViewElementType(element.viewElementType, 'value');
                expect(element.valueReference).to.not.be(undefined);
                expect(element.valueReference.attributeId).to.not.be(undefined);
                expect(element.valueReference.attributeId).to.be.a("number");
                if (isObjectReference === true) {
                    expect(element.valueReference.objectReference).to.not.be(undefined);
                    expect(element.valueReference.objectReference).to.be('*.Object Reference');
                } else {
                    expect(element.valueReference.bacoid).to.not.be(undefined);
                    expect(element.valueReference.bacoid).to.be.a("number");
                }
            },
            verifyLink = function (element) {
                expect(element).to.not.be(undefined);
                verifyLabel(element.label);
                verifyViewElementType(element.viewElementType, 'link');
                expect(element.linkViewId).to.not.be(undefined);
                expect(element.linkGroupId).to.not.be(undefined);
                expect(element.linkViewId).to.be.a("number");
                expect(element.linkGroupId).to.be.a("number");
            },
            verifyElements = function (elements, targetLength) {
                expect(elements).to.not.be(undefined);
                expect(elements).to.be.an("array");
                expect(elements.length).to.be(targetLength);
            },
            verifyGroup = function (element, expectedNumberOfChildren, isLeafGroup, expectedElementNumber) {
                var i = 0;
                expect(element).to.not.be(undefined);
                verifyLabel(element.label);
                verifyViewElementType(element.viewElementType, 'group');
                expect(element.id).to.not.be(undefined);
                expect(element.id).to.be.a("number");
                verifyElements(element.elements, expectedNumberOfChildren);

                if (isLeafGroup !== true) {
                    for (i = 0; i < element.elements.length; i++) {
                        verifyGroup(element.elements[i], expectedElementNumber, true, expectedElementNumber);
                    }
                } else {
                    for (i = 0; i < element.elements.length; i++) {
                        verifyValue(element.elements[i], true);
                    }
                }
            },
            verifyView = function (view, expectedNumberOfGroups, expectedNumberOfElements, has2GroupLevels) {
                var i = 0;
                expect(view).to.not.be(undefined);
                expect(view.viewId).to.not.be(undefined);
                expect(view.viewId).to.be.a("object");
                expect(view.viewId.set).to.be.a("number");
                expect(view.viewId.id).to.be.a("number");
                expect(view.viewId.text).to.be.a("number");
                verifyElements(view.elements, expectedNumberOfGroups);

                for (i = 0; i < expectedNumberOfGroups; i++) {
                    verifyGroup(view.elements[i], has2GroupLevels === true ? expectedNumberOfGroups : expectedNumberOfElements, !has2GroupLevels, expectedNumberOfElements);
                }
            };

        test('verify tree gets created with 3-views, 4-groups, 3-elements per group, 2 group levels deep', function () {
            var i = 0,
                viewDef = testSubject.createViewDefTree(3, 4, 3, true);

            expect(viewDef).to.not.be(undefined);
            expect(viewDef.equipmentType).to.not.be(undefined);
            expect(viewDef.templateId).to.not.be(undefined);
            expect(viewDef.views).to.not.be(undefined);
            expect(viewDef.views).to.be.an("array");
            expect(viewDef.views.length).to.be(3);
            for (i = 0; i < 3; i++) {
                verifyView(viewDef.views[i], 4, 3, true);
            }
        });
        test('verify tree gets created with 3-views, 4-groups, 3-elements per group, 1 group levels deep', function () {
            var i = 0,
                viewDef = testSubject.createViewDefTree(3, 4, 3, false);

            expect(viewDef).to.not.be(undefined);
            expect(viewDef.equipmentType).to.not.be(undefined);
            expect(viewDef.templateId).to.not.be(undefined);
            expect(viewDef.views).to.not.be(undefined);
            expect(viewDef.views).to.be.an("array");
            expect(viewDef.views.length).to.be(3);

            for (i = 0; i < 3; i++) {
                verifyView(viewDef.views[i], 4, 3, false);
            }
        });

    });

    suite('Generate GetAlarmsRequest', function () {
        test('generate a valid getAlarmListRequest object', function () {
            var getAlarmsRequestObject = testSubject.createGetAlarmListRequest("item ref");

            expect(getAlarmsRequestObject).to.be.an("object");
            expect(getAlarmsRequestObject.deviceIdentifier).to.be.an('object');
            expect(getAlarmsRequestObject.deviceIdentifier.objectReference).to.not.be(undefined);
            expect(getAlarmsRequestObject.deviceIdentifier.objectReference).to.be("item ref");
        });
    });
});