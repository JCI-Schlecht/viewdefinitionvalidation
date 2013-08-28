/*global suite, test, define, require, expect, setup, teardown, console, ko, testr, dependencies:true, sinon, $, schemaObjectFactory */

(function (exports) {
    "use strict";

    function MockServiceRepositoryFactory() {
        var bad = function (functionId) { return function () {throw new Error("use sinon for " + functionId + "!"); }; },
            getLogger = function () {
                return {info: bad('logger.info'), warn: bad('logger.warn'), debug: bad('logger.debug')};
            },
            getDeviceListDataService = function () {
                return { getDeviceList : bad('dataServiceMock.getDeviceList'), getDeviceByKey: bad('GetDataService.getDeviceByKey') };
            },
            getTreeDataService = function () {
                return { getTreeForDevice: bad('treeServiceMock.getTreeForDevice')};
            },
            getDataServiceToReturnObjectReferencePrefix = function (objectReferencePrefix, device) {
                var deviceListService = getDeviceListDataService(),
                    selectedDevice = device === undefined ? {objectReferencePrefix: bad} : device,
                    devicePromise = $.Deferred().resolve(selectedDevice),
                    deviceArray = ko.observableArray([selectedDevice]),
                    selectedDeviceStub = sinon.stub(selectedDevice, 'objectReferencePrefix').returns(objectReferencePrefix),
                    getDeviceListStub = sinon.stub(deviceListService, 'getDeviceList').returns(deviceArray),
                    getDeviceByKeyStub = sinon.stub(deviceListService, 'getDeviceByKey').returns(devicePromise);
                return {service: deviceListService, stubs: { getDeviceListStub: getDeviceListStub, getDeviceByKeyStub: getDeviceByKeyStub}};
            },
            initializeNConf = function (nconf, require) {
                //These are added so that require can be forced to unload the nconf module to gaurantee nconf changes do not reflect other tests
                // BEGIN - http://stackoverflow.com/questions/9210542/node-js-require-cache-possible-to-invalidate
                require.uncache = function (moduleName) {
                    // Run over the cache looking for the files loaded by the specified module name
                    require.searchCache(moduleName, function (mod) {
                        delete require.cache[mod.id];
                    });
                };

                /**
                * Runs over the cache to search for all the cached files
                */
                require.searchCache = function (moduleName, callback) {
                    try {
                        // Resolve the module identified by the specified name
                        var mod = require.resolve(moduleName);

                        // Check if the module has been resolved and found within the cache
                        if (mod && ((mod = require.cache[mod]) !== undefined)) {
                            // Recursively go over the results
                            (function run(mod) {
                                // Go over each of the module's children and run over it
                                mod.children.forEach(function (child) {
                                    run(child);
                                });

                                // Call the specified callback providing the found module
                                callback(mod);
                            }(mod));
                        }
                    } catch (error) {
                        // Do not notify developer if the error is module not found.
                        if (error.code !== "MODULE_NOT_FOUND") {
                            console.log(JSON.stringify(error, null, 2));
                        }
                    }
                };
                // END - http://stackoverflow.com/questions/9210542/node-js-require-cache-possible-to-invalidate
                if (nconf) {
                    nconf.use('memory');
                    nconf.clear();
                }
            },
            unInitializeNConf = function (require) {
                if (require.uncache) {
                    require.uncache('nconf');
                }
            },
            // TODO: Needed to add this function to get all tests to pass when run together.
            // node_modules/.bin/mocha -u tdd -R spec -t 10000 server/lib/json.api/test/itemservice.test.js server/lib/controllers/test/choices.controller.test.js server/lib/json.api/test/itemservice.test.js
            // With out this function the above tests would fail, however if you run settings first it would work!!!
            // The current theory is based on the fact that nconf is a global object that has the ability to maintain state.
            // So an instance is created early on before the tests have a chance to jump that instance
            createNewNConf = function (existingnconf, require) {
                var theNConf;
                initializeNConf(existingnconf, require);
                require.uncache('../../server/lib/configuration');
                unInitializeNConf(require);
                theNConf = require('nconf');
                initializeNConf(theNConf, require);
                return theNConf;
            },

            //TODO: taken directly from schemaobjectfactory.  Should find way to link this file to schemaobjfactory so both server and client can use that relationship
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
            createTestStandardResponseObjectFromString = function (resultCode, message) {
                var returnValue = createStandardResponseObjectFromStringResult(resultCode, message);
                returnValue.resultCode.text = returnValue.resultCode.id;
                return returnValue;
            };

        return {
            getDataServiceToReturnObjectReferencePrefix: getDataServiceToReturnObjectReferencePrefix,
            getDeviceListDataService: getDeviceListDataService,
            getTreeDataService: getTreeDataService,
            initializeNConf: initializeNConf,
            unInitializeNConf: unInitializeNConf,
            createNewNConf: createNewNConf,
            bad: bad,
            getLogger: getLogger,
            createTestStandardResponseObjectFromString: createTestStandardResponseObjectFromString
        };
    }

    exports.createMockServiceRepository = function () {
        return new MockServiceRepositoryFactory();
    };

}((typeof exports === 'undefined') ? this.mockServiceRepository = {} : exports));