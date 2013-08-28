/**
 * (C) Copyright 2013 Johnson Controls, Inc.
 *     Use or Copying of all or any part of this program, except as
 *     permitted by License Agreement, is prohibited.
 */
var util = require('util'),
    jsvAndSchemas = require('./../shared/schemas')(),
    jsvEnvironment = jsvAndSchemas.env,
    schemas = jsvAndSchemas.schemas,
    nconf = require('nconf');

function ViewDefValidator() {
    var elementType = function (element) {
            switch (element.viewElementType) {
            //Technically links and values are different but they're supposed to be mixed
            case 'link':
            case 'value':
                return 'value';
            case 'group':
                return element.typeMinor === true ? 'minor-group' : 'major-group';
            }
        },
        executeRulesOnViewElement = function (element, report, path, hasSeenMinorType) {
            var i,
                j,
                dictionary = {},
                elementValue,
                typeString,
                errorObject = {'viewDefValidationErrors': []},
                reportOutput = [],
                keys,
                myType = elementType(element),
                amIAMinorType = myType === 'minor-group';
            hasSeenMinorType = hasSeenMinorType === undefined ? false : hasSeenMinorType;

            //If hasSeenMinorType is true that means an ancestor of this element
            //  was minor
            if (hasSeenMinorType === true && myType === 'major-group') {
                errorObject.viewDefValidationErrors.push({error: 'major group within a minor group', location: path});
            }
            if (hasSeenMinorType === true && myType === 'minor-group') {
                errorObject.viewDefValidationErrors.push({error: 'minor group within a minor group', location: path});
            }

            if (element.elements !== undefined) {
                for (i = 0; i < element.elements.length; i++) {
                    elementValue = element.elements[i];
                    typeString = elementType(elementValue);
                    if (dictionary[typeString] !== undefined) {
                        dictionary[typeString].push(elementValue);
                    } else {
                        dictionary[typeString] = [elementValue];
                    }
                }
                keys = Object.keys(dictionary);
                for (i = 0; i < keys.length; i++) {
                    reportOutput.push(keys[i]);
                    for (j = 0; j < dictionary[keys[i]].length; j++) {
                        executeRulesOnViewElement(dictionary[keys[i]][j], report, path + " -> " + keys[i] + "-" + j, amIAMinorType || hasSeenMinorType);
                    }
                }
                if (keys.length !== 1) {
                    errorObject.viewDefValidationErrors.push({error: 'mixed element types', location: path, types: reportOutput});
                }
                if (errorObject.viewDefValidationErrors.length !== 0) {
                    report.errors.push(errorObject);
                }
            }
        },
        validateViewDefinition = function (view, path, schemaValidationFunction, validationPassFunction) {
            var validationReport,
                viewDefRules,
                i;
            validationReport = schemaValidationFunction();
            if (validationPassFunction(validationReport)) {
                //Run rules
                //Rule 1:  all elements must be of same type
                executeRulesOnViewElement(view, validationReport, path);
            }
            return validationReport;
        };

    return {
        validateViewDefinition : validateViewDefinition
    };
}

module.exports = new ViewDefValidator();