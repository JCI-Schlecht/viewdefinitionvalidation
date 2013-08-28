/**
 * (C) Copyright 2013 Johnson Controls, Inc.
 *     Use or Copying of all or any part of this program, except as
 *     permitted by License Agreement, is prohibited.
 */
var util = require('util'),
    jsvAndSchemas = require('./../shared/schemas')(),
    jsvEnvironment = jsvAndSchemas.env,
    schemas = jsvAndSchemas.schemas;
    //nconf = require('nconf'),
//    viewDefValidator = require('./viewdefvalidation');

function SchemaValidationService() {
    var validation = {
            devicelist: true,
            viewdefinition: true,
            changeofvalue: true,
            alarms: true
        },
        validateObject = function (obj, schema) {
            return jsvEnvironment.validate(obj, schema);
        },
        didValidationPass = function (report) {
            return report.errors.length === 0;
        },
        reportOutValidationResults = function (schema, obj, report, whereToLog) {
            var passed = didValidationPass(report);
            if (passed === false) {
                //logger.warn("schema validation failed: ", {schema: schema._attributes.id, errors: JSON.stringify(report.errors, null, 2)});
                // if (nconf.get('connection:onValidationErrorPrettyPrintJsonMessage')) {
                //     logger.warn(JSON.stringify(obj, null, 3));
                // }
            }
            return passed;
        },
        /**
         * Validates an object to a given schema within an environment containing known schemas.
         * @param  {object} obj    The object which should be validated
         * @param  {object} schema The 'most-appropriate' schema which the object should match
         * @return {bool}          Returns true if the object can be described by the schema.
         */
        validate = function (obj, schema) {
            var report = validateObject(obj, schema);
            return reportOutValidationResults(schema, obj, report);
        },
        validateUnsigned16Request = function (req) {
            return validate(req, schemas["unsigned16.json"]);
        },
        // validateDeviceListStructure = function (deviceList) {
        //     return validateObject(deviceList, schemas["device-list.json"]);
        // },
        // validateDevice = function (device) {
        //     return validateObject(device, schemas["device.json"]);
        // },
        // /**
        //  * Validates a device list response.
        //  * @param  {[type]} res The response object which requires validation.
        //  * @return {[type]}     Returns true if the response matches the response schema.
        //  */
        // validateDeviceList = function (res) {
        //     var report,
        //         isStructureValid,
        //         i,
        //         j,
        //         deviceValidationReport,
        //         validDevices = [];

        //     if (validation.devicelist !== true) {
        //         return {
        //             isUsable: true,
        //             validDevices: res.devices,
        //             errors: []
        //         };
        //     }

        //     report = validateDeviceListStructure(res);
        //     isStructureValid = didValidationPass(report);

        //     if (isStructureValid) {
        //         for (i = 0; i < res.devices.length; i++) {
        //             deviceValidationReport = validateDevice(res.devices[i], 'device-' + i);

        //             // add any errors from that report into a running report
        //             if (didValidationPass(deviceValidationReport)) {
        //                 validDevices.push(res.devices[i]);
        //             } else {
        //                 for (j = 0; j < deviceValidationReport.errors.length; j++) {
        //                     deviceValidationReport.errors[j].location = 'device-' + i;
        //                     report.errors.push(deviceValidationReport.errors[j]);
        //                 }
        //             }
        //         }
        //     }

        //     reportOutValidationResults(schemas["device-list.json"], res, report);

        //     return {
        //         isUsable: isStructureValid,
        //         validDevices: validDevices,
        //         errors: report.errors
        //     };
        // },
        // /**
        //  * Validates a subscription request.
        //  * @param  {object} req The request object which requires validation.
        //  * @return {bool}       Returns true of the request match the subscription schema.
        //  */
        // validateSubscription = function (req) {
        //     return validate(req, schemas["value-subscription.json"]);
        // },

        // /**
        //  * Validates a value update response.
        //  * @param  {object} res The response object which requires validation.
        //  * @return {bool}       Returns true if the response matches the value-update schema.
        //  */
        // validateUpdate = function (res) {
        //     if (validation.changeofvalue === true) {
        //         return validate(res, schemas["value-update.json"]);
        //     }
        //     return true;
        // },

        // /**
        //  * Validates a GetViewbyId request.
        //  * @param  {object} req The request object which requires validation.
        //  * @return {bool}       Returns true if the response matches the request schema.
        //  */
        // validateViewRequest = function (req) {
        //     return validate(req, schemas["view-request.json"]);
        // },
        // /**
        //  * Validates a response to the GetViewById request.
        //  * @param  {object} res The response object representing the view.
        //  * @return {bool}       Returns true if the object matches the required properties of the schema.
        //  */
        // validateViewResponse = function (res) {
        //     return validate(res, schemas["view-definition.json"]);
        // },

        // validateView = function (view, path) {
        //     return viewDefValidator.validateViewDefinition(
        //         view,
        //         path,
        //         function () { return validateObject(view, schemas["view-definition.json"]); },
        //         didValidationPass
        //     );
        // },

        // validateViewList = function (viewList) {
        //     return validateObject(viewList, schemas["view-list-definition.json"]);
        // },

        // isViewInternal = function (view) {
        //     return view.internalView;
        // },
        // /**
        //  * Validates a response to the GetViewById request.
        //  * @param  {object} res The response object representing the view.
        //  * @return {bool}       Returns true if the object matches the required properties of the schema.
        //  */
        // validateViewListResponse = function (res, overrideConfig) {
        //     var report,
        //         isListValid,
        //         i,
        //         j,
        //         viewDefValidationReport,
        //         validViews = [];
        //     overrideConfig = overrideConfig === undefined ? false : overrideConfig;
        //     if (validation.viewdefinition !== true && overrideConfig === false) {
        //         if (res && res.views) {
        //             for (i = 0; i < res.views.length; i++) {
        //                 // get report from validating a single view
        //                 if (isViewInternal(res.views[i])) {
        //                     logger.info("Dropping internal view at index: " + i);
        //                 } else {
        //                     validViews.push(res.views[i]);
        //                 }
        //             }
        //         }
        //         return {
        //             isUsable: true,
        //             validViews: validViews,
        //             errors: []
        //         };
        //     }

        //     report = validateViewList(res);
        //     isListValid = didValidationPass(report);

        //     if (isListValid) {
        //         for (i = 0; i < res.views.length; i++) {
        //             // get report from validating a single view
        //             if (isViewInternal(res.views[i])) {
        //                 logger.info("Dropping internal view at index: " + i);
        //             } else {
        //                 viewDefValidationReport = validateView(res.views[i], 'view-' + i);

        //                 // add any errors from that report into a running report
        //                 if (didValidationPass(viewDefValidationReport)) {
        //                     validViews.push(res.views[i]);
        //                 } else {
        //                     for (j = 0; j < viewDefValidationReport.errors.length; j++) {
        //                         viewDefValidationReport.errors[j].location = 'view-' + i;
        //                         report.errors.push(viewDefValidationReport.errors[j]);
        //                     }
        //                 }
        //             }
        //         }
        //     }

        //     reportOutValidationResults(schemas["view-list-definition.json"], res, report);

        //     return {
        //         isUsable: isListValid && validViews.length > 0,
        //         validViews: validViews,
        //         errors: report.errors
        //     };
        // },

        // validateValueMetadataRequest = function (req) {
        //     return validate(req, schemas["value-metadata-request.json"]);
        // },

        // validateValueMetadataResponse = function (req) {
        //     return validate(req, schemas["value-metadata-response.json"]);
        // },

        // /**
        //  * Validates a Standard response.
        //  * @param  {object} req The request object which requires validation.
        //  * @return {bool}       Returns true if the response matches the request schema.
        //  */
        // validateStandardResponse = function (res) {
        //     return validate(res, schemas["standard-response.json"]);
        // },

        // /**
        //  * Validates a Set Value request.
        //  * @param  {object} req The request object which requires validation.
        //  * @return {bool}       Returns true if the response matches the request schema.
        //  */
        // validateSetValueRequest = function (req) {
        //     return validate(req, schemas["set-value-request.json"]);
        // },

        // /**
        //  * Validates the list of properties that are to be acted upon
        //  * between client -> server and client <- server.
        //  * @param  {object} req The request object which requires validation.
        //  * @return {bool}       Returns true if the response matches the request schema.
        //  */
        // validateConfigurationPropertiesMessage = function (req) {
        //     return validate(req, schemas["settings-properties.json"]);
        // },

        // /**
        //  * Validates the response from settings service on applying a message
        //  * @param  {[type]} req an object representing the response
        //  * @return {[type]}     True if it matches the schema
        //  */
        // validateConfigurationApplyResponseMessage = function (req) {
        //     return validate(req, schemas["settings-apply-response.json"]);
        // },

        // /**
        //  * Validates the servers response to getting values for an enum
        //  * @param  {[type]} req the object representing the response
        //  * @return {[type]}     Returns true if object matches schema
        //  */
        // validateChoicesResponse = function (req) {
        //     return validate(req, schemas["get-translated-choices-response.json"]);
        // },


        // validateAlarmRequest = function (req) {
        //     return validate(req, schemas["alarm-request.json"]);
        // },

        // /**
        //  * Validates the servers response for getting alarms
        //  * @param  {[type]} req the object representing the response
        //  * @return {[type]}     Returns true if object matches schema
        //  */
        // validateAlarmResponse = function (req) {
        //     if (validation.alarms === true) {
        //         return validate(req, schemas["alarm-response.json"]);
        //     }
        //     return true;
        // },

        // /**
        //  * Validates the clients request for getting view definition file
        //  * @param  {[type]} req object representing the request
        //  * @return {[type]}     Returns true if object matches schema
        //  */
        // validateViewDefinitionRequest = function (req) {
        //     return validate(req, schemas["view-definition-request.json"]);
        // },
        init = function (appEnvironment) {
            // var executionModeString = 'validation:' + appEnvironment + ":",
            //     devicelist,
            //     viewdefinition,
            //     changeofvalue,
            //     alarms;
            //logger.info('Running in ' + executionModeString + '!.');

            // devicelist = nconf.get(executionModeString + 'devicelist');
            // viewdefinition = nconf.get(executionModeString + 'viewdefinition');
            // changeofvalue = nconf.get(executionModeString + 'changeofvalue');
            // alarms = nconf.get(executionModeString + 'alarms');

            // validation.devicelist = devicelist === undefined ? true : devicelist;
            // validation.viewdefinition = viewdefinition === undefined ? true : viewdefinition;
            // validation.changeofvalue = changeofvalue === undefined ? true : changeofvalue;
            // validation.alarms = alarms === undefined ? false : alarms;
            //logger.info(JSON.stringify(validation, null, 2));
        };

    return { validateUnsigned16Request: validateUnsigned16Request,
        //      validateDeviceList: validateDeviceList,
        //      validateSubscription: validateSubscription,
        //      validateUpdate: validateUpdate,
        //      validateViewRequest: validateViewRequest,
        //      validateViewResponse: validateViewResponse,
        //      validateViewListResponse: validateViewListResponse,
        //      validateValueMetadataRequest : validateValueMetadataRequest,
        //      validateValueMetadataResponse : validateValueMetadataResponse,
        //      validateSetValueRequest: validateSetValueRequest,
        //      validateStandardResponse: validateStandardResponse,
        //      validateConfigurationPropertiesMessage: validateConfigurationPropertiesMessage,
        //      validateConfigurationApplyResponseMessage: validateConfigurationApplyResponseMessage,
        //      validateChoicesResponse: validateChoicesResponse,
        //      validateAlarmResponse: validateAlarmResponse,
        //      validateAlarmRequest: validateAlarmRequest,
        //      validateViewDefinitionRequest: validateViewDefinitionRequest,
             init: init
            };
}

module.exports = new SchemaValidationService();