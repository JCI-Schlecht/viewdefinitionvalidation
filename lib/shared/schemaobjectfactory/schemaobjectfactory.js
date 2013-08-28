/**
* (C) Copyright 2013 Johnson Controls, Inc.
* Use or Copying of all or any part of this program, except as
* permitted by License Agreement, is prohibited.
*/

/*global exports */
/*jslint nomen: true */
(function (exports) {
    "use strict";

    //TODO: separate production from test based object generation.
    //TODO: separate schema object based generation from other various object generation logic if any
    function SchemaObjectFactory() {
        var createEnum = function (set, id, text) {
                return text === undefined ? { "set": set, "id": id }
                    : { "set": set, "id": id, "text": text };
            },
            createBACnetObjectReference = function (objectId) {
                return objectId;
            },
            createAttributeReferenceWithBACnetObjectReference = function (objectId, attributeId) {
                return {"bacoid": createBACnetObjectReference(objectId), "attributeId": attributeId};
            },
            createValueSubscriptionWithBACnetObjectReference = function (objectId, attributeId) {
                return {"identifier": createAttributeReferenceWithBACnetObjectReference(objectId, attributeId)};
            },
            createValueNoneWithBACnetObjectReference = function (objectId, attributeId) {
                return { "identifier": createAttributeReferenceWithBACnetObjectReference(objectId, attributeId), "value": {"dataType": 0}, "status": {"set": 516, "id": 0}, "writable": true, "reliability": {"set": 503, "id": 5}};
            },
            createNumericValueWithUnitsUsingBACnetObjectReference = function (objectId, attributeId) {
                return { "identifier": createAttributeReferenceWithBACnetObjectReference(objectId, attributeId),
                        "value": {
                        "dataType": 4,
                        "value": {
                            "value": 4500200.238765,
                            "precision": "PT_01",
                            "units" : {
                                "id": 1,
                                "set": 509
                            },
                            "highLimit": 100000,
                            "lowLimit": -100000
                        }
                    },
                    "status": {
                        "set": 516,
                        "id": 0
                    },
                    "writable": true
                    };
            },
            createStringValue = function (value, maxLength) {
                return { value: {value: value, maxLength: maxLength}, dataType: 7};
            },
            createValueWithoutUnitsUsingBACnetObjectReference = function (datatype, objectId, attributeId) {
                var attribute = createValueNoneWithBACnetObjectReference(objectId, attributeId);

                attribute.value.dataType = datatype;
                switch (datatype) {
                case 0:
                    break;
                case 2:
                case 3:
                case 16:
                case 17:
                case 18:
                    attribute.value.value = {
                        "value": 3445,
                        "highLimit": 100000,
                        "lowLimit": -100000
                    };
                    break;
                case 4:
                case 5:
                    attribute.value.value = {
                        "value": 4500200.238765,
                        "precision": "PT_01",
                        "highLimit": 100000,
                        "lowLimit": -100000
                    };
                    break;
                case 7:
                    attribute.value = createStringValue("weeeeeeeeeee!", 1024);
                    break;
                case 1:
                case 9:
                    attribute.value.value = {
                        "id": 0,
                        "set": 105
                    };
                    break;
                default:
                    throw new Error("The datatype of " + datatype + " is not defined.");
                }

                return attribute;
            },
            createAttributeValues = function (attributes) {
                return { "values": attributes };
            },
            createReadWithSignupRequest = function (identifiers) {
                return {'identifiers': identifiers};
            },
            createDevice = function (deviceName, deviceDescription, address, isOnline, hasMtgConnected, equipmentModels, hasActiveCriticalAlarms) {
                hasActiveCriticalAlarms = hasActiveCriticalAlarms === undefined ? false : hasActiveCriticalAlarms;
                return {
                    "name": deviceName,
                    "itemReference": deviceName + "-ItemReference",
                    "hasActiveCriticalAlarms": hasActiveCriticalAlarms,
                    "description": deviceDescription,
                    "address": address,
                    "isOnline": isOnline,
                    "hasMtgConnected": hasMtgConnected,
                    "equipmentModels": equipmentModels
                };
            },
            createDeviceList = function (devices) {
                return { devices: devices };
            },
            createViewRequest = function (emRef, viewId) {
                return { "equipmentModelReference": emRef, "viewId": viewId};
            },
            createSetValueRequest  = function (attrRef, newValue, datatype) {
                return { "valueReference": attrRef, "write": {"value": newValue, "datatype": datatype} };
            },
            createChoiceResponse = function (set, locale, phrases, _) {
                var response = {},
                    cleanset = (typeof set === 'number') ? set : parseInt(set, 10);

                if (isNaN(cleanset)) {
                    throw new Error('Unable to parse [' + set + '] into an int.');
                }

                if (locale === undefined) {
                    throw new Error('locale is undefined cannot create response.');
                }
                response.set = cleanset;
                response.enumValues = _.map(phrases, function (text, value, list) {
                    return {'id': parseInt(value, 10), 'text': text};
                });
                response.status = (response.enumValues.length > 0) ? 'success' : 'failedToTranslate';
                response.locale = locale;

                return response;
            },
            isString = function (o) {
                return typeof o === "string" || (typeof o === "object" && o.constructor === String);
            },
            createStandardResponseObjectFromResultCode = function (resultId, optionalMessage) {
                return { resultCode: {set: 1212, id: resultId}, message: optionalMessage };
            },
            createStandardResponseObjectFromStringResult = function (resultString, optionalMessage) {
                var id = 1;
                switch (resultString) {
                case "Fail":
                    id = 12;
                    break;
                case "Success":
                    id = 0;
                    break;
                case "Timeout":
                    id = 13;
                    break;
                }
                return createStandardResponseObjectFromResultCode(id, optionalMessage);
            },
            createViewDefinitionRequest = function (oid) {
                var cleanOid;

                if (isString(oid)) {
                    cleanOid = parseInt(oid, 10);
                    if (isNaN(cleanOid)) {
                        throw new Error("Cannot convert " + oid + " to a number");
                    }
                } else {
                    cleanOid = oid;
                }
                return { "oid": cleanOid};
            },
            createGetAlarmListRequest = function (itemReference) {
                return {"deviceIdentifier": {"objectReference": itemReference}};
            },
            createTreeEnum = function (set, id) {
                return {set: set, id: id, text: id};
            },
            generateViewDefHeader = function (type, set, id) {
                return { viewElementType: type, label: createTreeEnum(set, id)};
            },
            createViewElement = function (idCounter) {
                var element = generateViewDefHeader('value', 11 + idCounter, 22 + idCounter);
                element.shortLabel = { set: element.label.set + 10, id: element.label.id + 10, text: element.label.text + 10};
                idCounter++;
                element.valueReference = { objectReference: "*.Object Reference", attributeId: 70 + idCounter};
                idCounter++;
                return element;
            },
            createViewLink = function (viewId, groupId, idCounter) {
                var link = generateViewDefHeader('link', 11 + idCounter, 22 + idCounter);
                idCounter++;
                link.linkViewId = viewId;
                link.linkGroupId = groupId;
                return link;
            },
            createViewDefGroup = function (numberOfGroupsPerView, numberOfElementsPerGroup, createSubGroups, idCounter, isMinorType, createMinorGroups) {
                var i = 0,
                    group = generateViewDefHeader("group", 11 + idCounter, 22 + idCounter);
                createMinorGroups = createMinorGroups === undefined ? false : createMinorGroups;
                isMinorType = isMinorType === undefined ? false : isMinorType;
                idCounter++;
                group.id = 12;
                group.elements = [];
                if (isMinorType) {
                    group.typeMinor = true;
                }
                if (createSubGroups === true) {
                    for (i = 0; i < numberOfGroupsPerView; i++) {
                        group.elements.push(createViewDefGroup(numberOfGroupsPerView, numberOfElementsPerGroup, false, idCounter, createMinorGroups));
                    }
                } else {
                    for (i = 0; i < numberOfElementsPerGroup; i++) {
                        group.elements.push(createViewElement(idCounter));
                    }
                }

                return group;
            },
            createViewDefRoot = function () {
                return { equipmentType: createTreeEnum(1111, 2222), templateId: "Template ID", views: []};
            },
            createViewDefView = function (numberOfGroupsPerView, numberOfElementsPerGroup, createSubGroups, idCounter, createMinorGroups) {
                var i = 0,
                    view = { viewId: createTreeEnum(1712, idCounter), elements: [], label: createTreeEnum(1712, idCounter)};
                idCounter++;
                createMinorGroups = createMinorGroups === undefined ? false : createMinorGroups;
                for (i = 0; i < numberOfGroupsPerView; i++) {
                    view.elements.push(createViewDefGroup(numberOfGroupsPerView, numberOfElementsPerGroup, createSubGroups, idCounter, createMinorGroups));
                }

                return view;
            },
            createViewDefTree = function (numberOfViews, numberOfGroupsPerView, numberOfElementsPerGroup, createSubGroups, createMinorGroups) {
                var i = 0,
                    idCounter = 0,
                    root = createViewDefRoot();
                createMinorGroups = createMinorGroups === undefined ? false : createMinorGroups;
                for (i = 0; i < numberOfViews; i++) {
                    root.views.push(createViewDefView(numberOfGroupsPerView, numberOfElementsPerGroup, createSubGroups, idCounter, createMinorGroups));
                }

                return root;
            };


        return {
            createEnum: createEnum,
            createAttributeReferenceWithBACnetObjectReference: createAttributeReferenceWithBACnetObjectReference,
            createValueNoneWithBACnetObjectReference: createValueNoneWithBACnetObjectReference,
            createNumericValueWithUnitsUsingBACnetObjectReference: createNumericValueWithUnitsUsingBACnetObjectReference,
            createValueWithoutUnitsUsingBACnetObjectReference: createValueWithoutUnitsUsingBACnetObjectReference,
            createValueSubscriptionWithBACnetObjectReference: createValueSubscriptionWithBACnetObjectReference,
            createAttributeValues: createAttributeValues,
            createReadWithSignupRequest: createReadWithSignupRequest,
            createViewRequest: createViewRequest,
            createDevice: createDevice,
            createDeviceList: createDeviceList,
            createSetValueRequest : createSetValueRequest,
            createChoiceResponse: createChoiceResponse,
            createViewDefinitionRequest: createViewDefinitionRequest,
            createViewDefTree: createViewDefTree,
            createViewDefGroup: createViewDefGroup,
            createViewElement: createViewElement,
            createGetAlarmListRequest: createGetAlarmListRequest,
            createStandardResponseObjectFromStringResult: createStandardResponseObjectFromStringResult,
            createStandardResponseObjectFromResultCode: createStandardResponseObjectFromResultCode,
            createStringValue: createStringValue
        };
    }

    exports.createSchemaObjectFactory = function () {
        return new SchemaObjectFactory();
    };

}((typeof exports === 'undefined') ? this.schemaObjectFactory = {} : exports));