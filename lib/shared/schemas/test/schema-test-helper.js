var expect = require('expect.js'),
    factory = require('../../schemaobjectfactory').createSchemaObjectFactory(),
    util = require('util');

/**
 * Verify exactly one error as part of the schema's property bag that matches the path and reason
 * @param  {[type]} env          JSV environment
 * @param  {[type]} instance     object under test
 * @param  {[type]} schema       schema to which the object under test complies
 * @param  {[type]} propertyPath path under the property bag for which the error is expected
 * @param  {[type]} reason       JSV reason for failure
 */
var assertSinglePropertyFailure = function (env, instance, schema, propertyPath, reason) {
    var report = env.validate(instance, schema);
    expect(report.errors).to.have.length(1);
    expect(report.errors[0].schemaUri).to.be(schema._value.id + "#/properties/" + propertyPath);
    expect(report.errors[0].attribute).to.be(reason);
};
exports.assertSinglePropertyFailure = assertSinglePropertyFailure;

/**
 * Verify exactly one required field error as part of the schema's property bag that matches the path
 * @param  {[type]} env          JSV environment
 * @param  {[type]} instance     object under test
 * @param  {[type]} schema       schema to which the object under test complies
 * @param  {[type]} propertyPath path under the property bag for which the error is expected
 */
exports.assertPropertyRequired = function (env, instance, schema, propertyPath) {
    assertSinglePropertyFailure(env, instance, schema, propertyPath, "required");
};

/**
 * Verify exactly one error as part of the schema but not in the property bag that matches the path and reason
 * @param  {[type]} env          JSV environment
 * @param  {[type]} instance     object under test
 * @param  {[type]} schema       schema to which the object under test complies
 * @param  {[type]} propertyPath path under the object (but not the property bag) for which the error is expected
 * @param  {[type]} reason       JSV reason for failure
 */
exports.assertSingleNonPropertyFailure = function (env, instance, schema, propertyPath, reason) {
    var report = env.validate(instance, schema);
    expect(report.errors).to.have.length(1);
    expect(report.errors[0].schemaUri).to.be(schema._value.id + propertyPath);
    expect(report.errors[0].attribute).to.be(reason);
};

/**
 * Typically used when the number or type of error is not important
 * @param  {[type]} env          JSV environment
 * @param  {[type]} instance     json to validate
 * @param  {[type]} schema       schema to validate against
 */
exports.assertAnyFailure = function (env, instance, schema) {
    var report = env.validate(instance, schema);
    expect(report.errors.length).to.be.above(0);
};

/**
 * Verify no validation errors present
 * @param  {[type]} env          JSV environment
 * @param  {[type]} instance     json to validate
 * @param  {[type]} schema       schema to validate against
 */
exports.assertNoFailure = function (env, instance, schema) {
    var report = env.validate(instance, schema);
    expect(report.errors.length).to.be(0);
};

/**
 * Create a valid device object
 * @return {[type]} Hard coded device
 */
exports.createDevice = function () {
    return {
        name: "some name",
        itemReference: 'some item reference',
        hasActiveCriticalAlarms: false,
        description: "some description",
        address: 1,
        isOnline: true,
        hasMtgConnected: false,
        equipmentModels: [
            {
                reference: "entity name"
            }
        ]
    };
};

function createFloatValue() {
    return {
        value: {
            value: 3.14159,
            precision: "PT_1",
            highLimit: 100000,
            lowLimit: -100000
        },
        dataType: 4
    };
}

function createIntegerValue() {
    return {
        value: {
            value: 3,
            highLimit: 100000,
            lowLimit: -100000
        },
        dataType: 2
    };
}

function createEnumValue() {
    return {
        value: {
            set: 3,
            id: 1
        },
        dataType: 9
    };
}

function createStringValue() {
    return factory.createStringValue("a kinda long string value", 1024);
}

function createNoneValue() {
    return {
        dataType: 0
    };
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomUnsigned16() {
    return randomInt(0, 65535);
}

function randomUnsigned32() {
    return randomInt(0, 4294967295);
}

function randomViewElementValue() {
    return {
        viewElementType: "value",
        valueReference: { objectReference: "*.HVAC ZONE", attributeId: 7000 },
        label: { set: 1675, id: 15 },
        shortLabel: { set: 1675, id: 15 }
    };
}

function randomViewElementLink() {
    return {
        viewElementType: "link",
        label: { set: 1672, id: 1 },
        linkViewId: 0,
        linkGroupId: 99
    };
}

function randomViewElementGroup() {
    return {
        viewElementType: "group",
        label: { set: 1, id: 1 },
        elements: [
            randomViewElementValue(),
            randomViewElementValue()
        ]
    };
}

function randomPresenceIndicator() {
    return {
        valueReference: {
            objectReference: "*.HVAC Zone",
            attributeId: 7009
        },
        operator: "equal",
        constant: 4
    };
}

function randomViewElementGroupWithPresenceIndicator() {
    return {
        viewElementType: "group",
        label: { set: 1, id: 1 },
        presenceIndicator: randomPresenceIndicator(),
        elements: [
            randomViewElementValue(),
            randomViewElementValue()
        ]
    };
}

function randomViewDefinition() {
    return {
        viewId: {set: 1712, id: 0},
        internalView: false,
        elements: [
            randomViewElementGroup(),
            randomViewElementValue()
        ]
    };
}

exports.randomViewDefinitionReference = function () {
    return randomUnsigned32();
};

exports.randomEnum = function () {
    return factory.createEnum(randomUnsigned16(), randomUnsigned16());
};

exports.randomViewElementGroup = function () {
    return randomViewElementGroup();
};

exports.randomViewElementGroupWithPresenceIndicator = function () {
    return randomViewElementGroupWithPresenceIndicator();
};

exports.randomViewElementGroupPresenceIndicator = function () {
    return randomPresenceIndicator();
};

exports.randomViewElementValue = function () {
    return randomViewElementValue();
};

exports.randomViewElementLink = function () {
    return randomViewElementLink();
};

exports.randomViewDefinition = function () {
    return randomViewDefinition();
};

exports.createFloatValue = function () {
    return createFloatValue();
};

exports.createStringValue = function () {
    return createStringValue();
};
exports.createIntegerValue = function () {
    return createIntegerValue();
};
exports.createEnumValue = function () {
    return createEnumValue();
};

exports.createNoneValue = function () {
    return createNoneValue();
};