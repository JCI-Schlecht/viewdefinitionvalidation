/**
* (C) Copyright 2012-2013 Johnson Controls, Inc.
* Use or Copying of all or any part of this program, except as
* permitted by License Agreement, is prohibited.
*/

/*jslint nomen: true, plusplus:true */
/*global require, console, WebPage, phantom, window, mocha, dependencies, _$jscoverage */

/* 
* 
* Arguments to the process:
* usage: [path to this file] -target [path to file to validate]
*/

(function () {
    "use strict";
    var fs = require('fs'),
        schemaValidator = require('./../../../server/lib/schemavalidator'),

        beginValidation = function () {
            var passedInArguments = process.argv.splice(2),
                targetFileArgument = '-target';

            if (passedInArguments === undefined || passedInArguments.length === 0 || passedInArguments.length % 2 !== 0) {
                console.log('usage: -target filename');
                return;
            }
            passedInArguments.forEach(function (val, index, array) {
                switch (val) {
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
            });
        };

    beginValidation();
}());