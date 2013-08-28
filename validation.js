/**
 * (C) Copyright 2013 Johnson Controls, Inc.
 *     Use or Copying of all or any part of this program, except as
 *     permitted by License Agreement, is prohibited.
 */

// File that utilizes the JSV module.

(function () {
    "use strict";
    var fs = require('fs'),
        schemaValidator = require('./lib/schemavalidator'),

        beginValidation = function () {
            var actualNumber = 15;

            if (schemaValidator.validateUnsigned16Request(JSON.parse(actualNumber))) {
                console.log(actualNumber + " is a Unsigned 16");
            } else {
                console.log(actualNumber + " is NOT a Unsigned 16");
            }

            /*
            if (passedInArguments === undefined || passedInArguments.length === 0 || passedInArguments.length % 2 !== 0) {
                console.log('usage: -target filename');
                return;
            }
            passedInArguments.forEach(function (val, index, array) {
                switch (val) {
                case targetNumber:
                    var number = array[index + 1];
                    if (schemaValidator.validateUnsigned16Request(JSON.parse(actualNumber))) {
                        console.log(actualNumber + " is a Unsigned 16");
                    } else {
                        console.log(actualNumber + " is NOT a Unsigned 16");
                    }
                    break;
                case targetFileArgument:
                    var targetFile = array[index + 1];
                    fs.exists(targetFile, function (exists) {
                        if (exists === true) {
                            console.log('opening file: ' + targetFile);
                            fs.readFile(targetFile, {encoding: 'utf8'}, function (error, fileData) {
                                if (error) {
                                    throw error;
                                }
                                var transfer = JSON.parse(fileData);
                                if (schemaValidator.validateViewListResponse(transfer).isCorrect === true) {
                                    console.log('File is a CORRECT view definition file');
                                } else {
                                    console.log('File is NOT a correct view definition file');
                                }
                            });
                        } else {
                            console.log('error no targetFile found');
                        }
                    });
                    break;
                }
            });*/
        };

    beginValidation();
}());