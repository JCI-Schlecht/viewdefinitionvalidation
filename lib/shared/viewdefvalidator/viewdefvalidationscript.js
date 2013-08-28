/**
* (C) Copyright 2013 Johnson Controls, Inc.
* Use or Copying of all or any part of this program, except as
* permitted by License Agreement, is prohibited.
*/

/*global $, document, FormData, XMLHttpRequest */

$(document).ready(function () {

    var httpRequest,
        fileTextObj,
        tempListAppend,
        tempString = "",
        tempLink = "",
        progress = document.getElementById("prog"),
        progressValue = 0,
        IDArray = [],
        errorArray = [];

    function setProgressExplanation() {
        var progressexplanation = document.getElementById("progressexplanation"),
            tempMessage;

        if (progressValue === 0) {
            tempMessage = "LOADING";
        } else if (progressValue === 1) {
            tempMessage = "VALIDATING";
        } else if (progressValue === 2) {
            tempMessage = "VALIDATING";
        } else if (progressValue === 3) {
            tempMessage = "GENERATING RESULTS";
        } else if (progressValue === 4) {
            tempMessage = "LOADING RESULTS";
        } else if (progressValue === 5) {
            tempMessage = "DONE";
        } else {
            tempMessage = "ERROR";
        }

        $("#progressexplanation").text(tempMessage);
    }

    function colorErrors() {
        var tempTarget,
            i;

        for (i = 0; i < errorArray.length; i++) {
            tempTarget = "#" + errorArray[i];

            $(tempTarget).addClass("error");
        }

    }

    function resetDisplay() {
        $("#viewdefcode").val("");
        $("#progressbar").hide();
        $("#progressexplanation").text("");
        $("#failsuccessdiv").hide();
        $("#success").hide();
        $("#fail").hide();
        $("table#resultstable tr#rowtodelete").remove();
        $("#validationerror").val("");
        $("#validationerror").hide();
    }

    function generateJsTree() {
        $("#viewdeftree").jstree({
            "themes" : {
                "theme" : "default",
                "dots" : true,
                "icons" : false
            },
            "plugins" : [ "themes", "html_data" ],
            "rules" : {
                "clickable" : true
            }
        });
    }

    function generateID() {
        var ID = "",
            i;
        for (i = 0; i < IDArray.length; i++) {
            ID += IDArray[i];
            if (i !== IDArray.length - 1) {
                ID += "_";
            }
        }
        return ID;
    }

    function nextLevel(tempObj, tempIndex) {
        var keys,
            i,
            tempVal;

        $.each(tempObj, function (index, value) {

            if (typeof value === 'object' || Array.isArray(value)) {
                keys = Object.keys(value);
                IDArray.push(index);
                tempString += "<li id=\"" + generateID() + "\"><a data-listitemid=\"" + generateID() + "\", onclick=\"openClose(this)\"><b>" + index + ":</b></a><ul>";

                for (i = 0; i < keys.length; i++) {
                    if (typeof value[keys[i]] === 'object' || Array.isArray(value[keys[i]])) {
                        if (index === "views") {
                            tempIndex = "view" + keys[i];
                        } else {
                            tempIndex = keys[i];
                        }
                        IDArray.push(tempIndex);
                        tempString += "<li id=\"" + generateID() + "\"><a data-listitemid=\"" + generateID() + "\", onclick=\"openClose(this)\"><b>" + index + "</b> [" + keys[i] + "]</a><ul>";
                        nextLevel(value[keys[i]], index);
                        tempString += "</ul></li>";
                        IDArray.pop();
                    } else {
                        IDArray.push(keys[i]);
                        if (typeof value[keys[i]] === 'string') {
                            tempVal = "\"" + value[keys[i]] + "\"";
                        } else {
                            tempVal = value[keys[i]];
                        }
                        tempString += "<li id=\"" + generateID() + "\"><a><b>" + keys[i] + ": </b> " + tempVal + "</a></li>";
                        IDArray.pop();
                    }
                }
                tempString += "</ul></li>";
                IDArray.pop();

            } else {
                IDArray.push(index);
                if (typeof value === 'string') {
                    tempVal = "\"" + value + "\"";
                } else {
                    tempVal = value;
                }
                tempString += "<li id=\"" + generateID() + "\"><a><b>" + index + ":</b> " + tempVal + "</a></li>";
                IDArray.pop();
            }
        });
    }

    function generateJSONList(jsonText) {
        var tempObj = JSON.parse(jsonText),
            keys,
            i,
            tempIndex,
            tempVal;

        tempString = "<ul>";
        IDArray = [];

        $.each(tempObj, function (index, value) {

            if (typeof value === 'object' || Array.isArray(value)) {
                keys = Object.keys(value);
                if (index === "views") {
                    IDArray.push(index);
                    tempString += "<li id=\"" + generateID() + "\"><a data-listitemid=\"" + generateID() + "\", onclick=\"openClose(this)\"><b>" + index + "</b></a><ul>";
                    IDArray.pop();
                } else {
                    IDArray.push(index);
                    tempString += "<li id=\"" + generateID() + "\"><a data-listitemid=\"" + generateID() + "\", onclick=\"openClose(this)\"><b>" + index + "</b></a><ul>";
                }

                for (i = 0; i < keys.length; i++) {
                    if (typeof value[keys[i]] === 'object' || Array.isArray(value[keys[i]])) {
                        if (index === "views") {
                            tempIndex = "view" + keys[i];
                        } else {
                            tempIndex = keys[i];
                        }

                        IDArray.push(tempIndex);
                        tempString += "<li id=\"" + generateID() + "\"><a data-listitemid=\"" + generateID() + "\", onclick=\"openClose(this)\"><b>" + index + "</b> [" + keys[i] + "]</a><ul>";
                        nextLevel(value[keys[i]], index);
                        tempString += "</ul></li>";
                        IDArray.pop();
                    } else {
                        IDArray.push(keys[i]);
                        if (typeof value[keys[i]] === 'string') {
                            tempVal = "\"" + value[keys[i]] + "\"";
                        } else {
                            tempVal = value[keys[i]];
                        }
                        tempString += "<li id=\"" + generateID() + "\"><a><b>" + keys[i] + ":</b> " + tempVal + "</a></li>";
                        IDArray.pop();
                    }
                }
                tempString += "</ul></li>";
                if (index !== "views") {
                    IDArray.pop();
                }
            } else {
                IDArray.push(index);
                if (typeof value === 'string') {
                    tempVal = "\"" + value + "\"";
                } else {
                    tempVal = value;
                }
                tempString += "<li id=\"" + generateID() + "\"><a><b>" + index + ":</b> " + tempVal + "</a></li>";
                IDArray.pop();
            }
        });

        tempString += "</ul>";
        $("#viewdeftree").html(tempString);
    }

    function displayDetails(tempObj) {
        var keys,
            tab = "&nbsp; &nbsp; &nbsp; &nbsp;",
            i;

        $.each(tempObj, function (index, value) {
            keys = Object.keys(value);
            for (i = 0; i < keys.length; i++) {
                if (typeof value[keys[i]] === 'object' || Array.isArray(value[keys[i]])) {
                    displayDetails(value[keys[i]]);
                } else {
                    tempString += tab + "<b>" + keys[i] + " :</b> " + value[keys[i]] + "<br>";
                }
            }
        });
    }

    function generateSchemaErrorLink(errorObject) {
        var tempVal = "";
        tempLink = "";

        if (errorObject.location !== undefined) {
            tempLink += errorObject.location.replace('-', '') + "_";
        }

        tempVal = errorObject.uri.slice(errorObject.uri.indexOf("#") + 2);
        tempVal = tempVal.replace('/', '_');
        tempLink += tempVal;
    }

    function generateRulesErrorLink(errorObject) {
        var tempVal = "",
            tempObj;
        tempLink = "";

        tempVal = errorObject.location.replace('-', '') + "_";
        tempLink += tempVal;

        tempVal = errorObject.viewDefValidationErrors[0].location;
        tempVal = tempVal.slice(tempVal.indexOf(">") + 2);
        tempVal = tempVal.replace("major-group-", "elements_");

        tempLink += tempVal;
    }

    function handleResponse() {

        var validationResponse,
            errorList,
            i,
            keys,
            fileText,
            tempPath;

        progress.value = httpRequest.readyState;
        progressValue = httpRequest.readyState;
        setProgressExplanation();

        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {

                validationResponse = JSON.parse(httpRequest.response);

                if (validationResponse.error === undefined) {
                    errorList = validationResponse.validationResults.errors;
                    fileText = validationResponse.fileText;

                    $("#viewdefcode").val(fileText);
                    generateJSONList(fileText);

                    if (errorList.length === 0) {
                        $("#progressbar").hide();
                        $("#success").show();
                    } else {
                        $.each(errorList, function (index, value) {
                            tempString = "";
                            if (value.viewDefValidationErrors === undefined) {
                                generateSchemaErrorLink(value);
                            } else {
                                generateRulesErrorLink(value);
                            }
                            keys = Object.keys(value);
                            for (i = 0; i < keys.length; i++) {
                                if (keys[i] === "viewDefValidationErrors") {
                                    tempString += "<b>" + keys[i] + ": </br>{</b><br/>";
                                    displayDetails(value[keys[i]]);
                                    tempString += "<b>}</b><br />";
                                } else {
                                    tempString += "<b>" + keys[i] + " :</b> " + value[keys[i]] + "<br>";
                                }
                            }

                            tempString += "<b> Error Link:</b> " + tempLink + "<br>";
                            errorArray.push(tempLink);

                            $("#resultstable").append("<tr id=\"rowtodelete\", class=\"tableRow\", onClick=\"toggleNode('" + tempLink + "', this)\" ><td class=\"shadowed disabledError\"><p>" + (index + 1) + "</p></td><td id=\"errorString\", class=\"shadowed disabledError\"><p>" + tempString + "</p></td></tr>");
                        });

                        colorErrors();
                    }

                    generateJsTree();

                    setTimeout(function() {
                        progressValue = 5;
                        progress.value = progressValue;
                        setProgressExplanation();

                        setTimeout(function(){
                            $("#progressbar").hide();
                            $("#fail").show();
                            $("#failsuccessdiv").show();
                        }, 150);
                    }, 1000);

                } else {
                    $("#validationerrorexplanation").append("Error (" + JSON.stringify(validationResponse.error) + ")");
                    $("#validationerror").show();
                }
            } else {
                $("#validationerrorexplanation").append("Error (" + httpRequest.status + ")");
                $("#validationerror").show();
            }
        }
    }

    function handleButtonPress(e) {
        e.preventDefault();

        var formData = new FormData(),
            form = document.getElementById("filechooser"),
            upload,
            file,
            progressValue = 0;
        errorArray = [];

        if (form.files.length > 0) {

            resetDisplay();
            file = form.files[0];

            httpRequest = new XMLHttpRequest();

            upload = httpRequest.upload;
            $("#resultssection").show();
            $("#progressbar").show();

            upload.onload = function (e) {
                progress.value = 1;
                progress.max = 5;
            };

            formData.append('file', file);

            httpRequest.onreadystatechange = handleResponse;
            httpRequest.open("POST", '/viewdefvalidator/validate');
            httpRequest.send(formData);
        } else {
            $("#resultssection").hide();
        }
    }

    function changeEditState() {
        var editArea = document.getElementById("viewdefcode");

        if (editArea.disabled) {
            $("#viewdefcode").attr('disabled', false);
            $("#enabledisable").text("Disable Editing");
        } else {
            $("#viewdefcode").attr('disabled', true);
            $("#enabledisable").text("Enable Editing");
        }
    }

    document.getElementById("submitbutton").onclick = handleButtonPress;
    document.getElementById("enableediting").onclick = changeEditState;
});

function toggleNode(target, divObj) {
    var tempTarget = "#" + target,
        targetTwo;

    if ($(divObj).children("td").hasClass("enabledError")) {
        if (tempTarget.indexOf("_") !== -1) {
            targetTwo = tempTarget.slice(0, tempTarget.indexOf("_"));
            $("#viewdeftree").jstree("toggle_node", $(targetTwo));
        }

        if ($(tempTarget).hasClass("jstree-open")) {
            $("#viewdeftree").jstree("toggle_node", $(tempTarget));
        }

        $(divObj).children("td").addClass("disabledError");
        $(divObj).children("td").removeClass("enabledError");
    } else {
        if ($(tempTarget).hasClass("jstree-closed")) {
            $("#viewdeftree").jstree("toggle_node", $(tempTarget));
        }

        $(divObj).children("td").addClass("enabledError");
        $(divObj).children("td").removeClass("disabledError");
    }
}

/*function toggleNode(target, divObj) {
    var tempTarget = "#" + target;

    if ($(tempTarget).hasClass("error")) {
        $("#viewdeftree").jstree("toggle_node", $(tempTarget));
        $(tempTarget).removeClass("error");
        $(divObj).children("td").addClass("disabledError");
        $(divObj).children("td").removeClass("enabledError");
    } else {
        $("#viewdeftree").jstree("toggle_node", $(tempTarget));
        $(tempTarget).addClass("error");
        $(divObj).children("td").addClass("enabledError");
        $(divObj).children("td").removeClass("disabledError");

    }
}*/

function openClose(toggleTarget) {
    var tempToggle = "#" + toggleTarget.dataset.listitemid;
    $("#viewdeftree").jstree("toggle_node", $(tempToggle));
}