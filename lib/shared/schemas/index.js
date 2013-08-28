/**
 * (C) Copyright 2013 Johnson Controls, Inc.
 *     Use or Copying of all or any part of this program, except as
 *     permitted by License Agreement, is prohibited.
 */

/*jslint plusplus: true, stupid: true */

var fs = require('fs'),
    path = require('path'),
    wrench = require('wrench'),
    JSV = require('JSV').JSV;

module.exports = function () {
    var env = JSV.createEnvironment(),
        schemaPaths = wrench.readdirSyncRecursive('./shared/schemas'),
        i,
        currentSchemaPath,
        schemas = {};

    for (i = 0; i < schemaPaths.length; i++) {
        currentSchemaPath = schemaPaths[i];
        if (currentSchemaPath.indexOf('.json') !== -1) {
            // todo: share this fix with 'createdebugtestlauncher.js'
            // paths like C:\dir1\dir2\dir3/filename.json need to be cleaned up
            currentSchemaPath = ('./' + currentSchemaPath).replace(path.sep, '/');

            //console.log(currentSchemaPath);
            //console.log(currentSchemaPath.slice(currentSchemaPath.lastIndexOf('/') + 1));
            schemas[currentSchemaPath.slice(currentSchemaPath.lastIndexOf('/') + 1)] = env.createSchema(require('./' + currentSchemaPath));
        }
    }

    return { env: env, schemas: schemas };
};