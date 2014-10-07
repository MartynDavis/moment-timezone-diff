"use strict";

/*global QUnit, moment, momentTimezoneDiff, testVars*/

function expectChild(assert, parent, index, properties) {
    var child,
        property,
        childOptions,
        childOption,
        expectedOptions,
        expectedOption,
        i;
    assert.ok(parent && parent.children, 'Parent has children');
    child = parent.children[index];
    assert.ok(child, 'Child exists');
    for (property in properties) {
        if (properties.hasOwnProperty(property)) {
            if (property === 'options') {
                childOptions = child.options;
                expectedOptions = properties.options;
                assert.ok(childOptions && expectedOptions, 'Expected options preent');
                assert.equal(childOptions.length, expectedOptions.length, 'Options has expected length');
                for (i = 0; i < expectedOptions.length; i += 1) {
                    childOption = childOptions[i];
                    expectedOption = expectedOptions[i];
                    assert.ok(childOption && expectedOption, 'Expected option preent');
                    assert.equal(childOption.value, expectedOption.value, 'Option value matches');
                    assert.equal(childOption.text,  expectedOption.text,  'Option text matches');
                }
            }
            else {
                assert.equal(child[property], properties[property], 'Property "' + property + '" value matches');
            }
        }
    }
    return child;
}
function expectChildren(assert, parent, length) {
    assert.ok(parent && parent.children, 'Parent has children');
    assert.equal(parent.children.length, length, 'Parent has required number of children');
}
function makeOptions(from, to, length, exceptions) {
    var values = [ ],
        value,
        i;
    for (i = from; i <= to; i += 1) {
        value = { };
        value.value = String(i);
        if (exceptions && exceptions[i]) {
            value.text = exceptions[i];
        } else {
            value.text = String(i);
            if (length) {
                while (value.text.length < length) {
                    value.text = '0' + value.text;
                }
            }
        }
        values.push(value);
    }
    return values;
}
QUnit.test('DateTimeElements1', function (assert) {
    var dateElement,
        index = 0,
        hourElement,
        minuteElement,
        ampmElement,
        datePickerElement,
        timezoneElement,
        currentTimeElement;
    dateElement = document.getElementById('mtzdDate12hour');
    assert.ok(dateElement, 'Date element exists');
    hourElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                              title: 'Sélectionnez les heures de la journée',
                                                              options: makeOptions(0, 11, 2, { 0: '12' })
                                                            });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: ':'
                                              });
    minuteElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                                title: "Sélectionner les minutes de l'heure",
                                                                options: makeOptions(0, 59, 2)
                                                              });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: ' '
                                              });
    ampmElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                              title: "Sélectionnez le matin ou l'après-midi",
                                                              options: [ { text: 'am', value: '0'  },
                                                                         { text: 'pm', value: '1' }
                                                                       ]
                                                            });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: ' '
                                              });
    datePickerElement = expectChild(assert, dateElement, index++, { tagName: 'INPUT',
                                                                    type: 'text',
                                                                    title: "Entrez la date requise. Format pris en charge est DD-MMMM-YYYY",
                                                                    size: 10
                                                                  });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: ' '
                                              });
    timezoneElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                                  title: "Sélectionnez le fuseau horaire",
                                                                  options: [ { text: '',                value: '' },
                                                                             { text: 'Sebastian Roché', value: 'Europe/Paris' },
                                                                             { text: 'André Lurçat',    value: 'Canada/Newfoundland' }
                                                                           ]
                                                                });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: ' '
                                              });
    currentTimeElement = expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                                     className: 'currentTimeFrench',
                                                                     title: "l'heure actuelle",
                                                                     textContent: "Régler l'heure actuelle"
                                                                   });
    expectChildren(assert, dateElement, index);
    assert.equal(testVars.dte1.locale, 'fr', 'Locale is "fr"');
    assert.equal(testVars.dte1.mode, momentTimezoneDiff.MODE_SPLIT_HOUR12, 'Mode matches');
    assert.equal(testVars.dte1.errorClassName, 'mtzdError', 'Error class matches');
    assert.equal(testVars.dte1.currentTime, currentTimeElement, 'Current time element matches');
    assert.equal(testVars.dte1.elements.hour, hourElement, 'Hour element matches');
    assert.equal(testVars.dte1.elements.minute, minuteElement, 'Minute element matches');
    assert.equal(testVars.dte1.elements.ampm, ampmElement, 'AmPm element matches');
    assert.equal(testVars.dte1.elements.day, undefined, 'Day element is not defined');
    assert.equal(testVars.dte1.elements.month, undefined, 'Month element is not defined');
    assert.equal(testVars.dte1.elements.year, undefined, 'Year element is not defined');
    assert.equal(testVars.dte1.elements.timezone, timezoneElement, 'Timezone element matches');
    assert.equal(testVars.dte1.elements.datetime, undefined, 'Date/time element is not defined');
    assert.equal(testVars.dte1.timeDisplayFormat, undefined, 'Display format is not defined');
    assert.equal(testVars.dte1.timeInputFormats, undefined, 'Input formats is not defined');
    assert.equal(testVars.dte1.elements.datePicker, datePickerElement, 'Date Picker element matches');
    assert.equal(testVars.dte1.datePickerFormat, 'DD-MMMM-YYYY', 'Date display/input format matches');
});
QUnit.test('DateTimeElements2', function (assert) {
    var dateElement,
        index = 0,
        hourElement,
        minuteElement,
        datePickerElement,
        timezoneElement,
        currentTimeElement;
    dateElement = document.getElementById('mtzdDate24hour');
    assert.ok(dateElement, 'Date element exists');
    hourElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                              title: 'Select hour of the day',
                                                              options: makeOptions(0, 23, 2)
                                                            });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: ':'
                                              });
    minuteElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                                title: "Select minute of the hour",
                                                                options: makeOptions(0, 59, 2)
                                                              });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: ' '
                                              });
    datePickerElement = expectChild(assert, dateElement, index++, { tagName: 'INPUT',
                                                                    type: 'text',
                                                                    title: "Enter the required date. Supported format is MMM-DD-YYYY",
                                                                    size: 10
                                                                  });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: ' '
                                              });
    timezoneElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                                  title: "Select timezone",
                                                                  options: [ { text: '',                value: '' },
                                                                             { text: 'US/Eastern',      value: 'US/Eastern' },
                                                                             { text: 'Australia/Perth', value: 'Australia/Perth' }
                                                                           ]
                                                                });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: ' '
                                              });
    currentTimeElement = expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                                     className: 'mtzdCurrentTime',
                                                                     title: 'Current Time',
                                                                     textContent: '\u25d4'
                                                                   });
    expectChildren(assert, dateElement, index);
    assert.equal(testVars.dte2.locale, undefined, 'locale is not defined');
    assert.equal(testVars.dte2.mode, momentTimezoneDiff.MODE_SPLIT_HOUR24, 'Mode matches');
    assert.equal(testVars.dte2.errorClassName, 'mtzdError', 'Error class matches');
    assert.equal(testVars.dte2.currentTime, currentTimeElement, 'Current time element matches');
    assert.equal(testVars.dte2.elements.hour, hourElement, 'Hour element matches');
    assert.equal(testVars.dte2.elements.minute, minuteElement, 'Minute element matches');
    assert.equal(testVars.dte2.elements.ampm, undefined, 'AmPm element is not defined');
    assert.equal(testVars.dte2.elements.day, undefined, 'Day element is not defined');
    assert.equal(testVars.dte2.elements.month, undefined, 'Month element is not defined');
    assert.equal(testVars.dte2.elements.year, undefined, 'Year element is not defined');
    assert.equal(testVars.dte2.elements.timezone, timezoneElement, 'Timezone element matches');
    assert.equal(testVars.dte2.elements.datetime, undefined, 'Date/time element is not defined');
    assert.equal(testVars.dte2.timeDisplayFormat, undefined, 'Display format is not defined');
    assert.equal(testVars.dte2.timeInputFormats, undefined, 'Input formats is not defined');
    assert.equal(testVars.dte2.elements.datePicker, datePickerElement, 'Date Picker element matches');
    assert.equal(testVars.dte2.datePickerFormat, 'MMM-DD-YYYY', 'Date display/input format matches');
});
QUnit.test('DateTimeElements3', function (assert) {
    var dateElement,
        index = 0,
        hourElement,
        minuteElement,
        ampmElement,
        dayElement,
        monthElement,
        yearElement,
        timezoneElement,
        currentTimeElement;
    dateElement = document.getElementById('mtzdDate24hour2');
    assert.ok(dateElement, 'Date element exists');
    hourElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                              title: 'Select hour of the day',
                                                              options: makeOptions(0, 11, 2, { 0: '12' })
                                                            });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: ':'
                                              });
    minuteElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                                title: "Select minute of the hour",
                                                                options: makeOptions(0, 59, 2)
                                                              });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: ' '
                                              });
    ampmElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                              title: "Select morning or afternoon",
                                                              options: [ { text: 'am', value: '0'  },
                                                                         { text: 'pm', value: '1' }
                                                                       ]
                                                            });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: ' '
                                              });
    yearElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                              title: "Select year",
                                                              options: makeOptions(2010, 2020)
                                                            });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: '-'
                                              });
    monthElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                               title: "Select month of the year",
                                                               options: [ { text: 'Jan', value:  '0'},
                                                                          { text: 'Feb', value:  '1'},
                                                                          { text: 'Mar', value:  '2'},
                                                                          { text: 'Apr', value:  '3'},
                                                                          { text: 'May', value:  '4'},
                                                                          { text: 'Jun', value:  '5'},
                                                                          { text: 'Jul', value:  '6'},
                                                                          { text: 'Aug', value:  '7'},
                                                                          { text: 'Sep', value:  '8'},
                                                                          { text: 'Oct', value:  '9'},
                                                                          { text: 'Nov', value: '10'},
                                                                          { text: 'Dec', value: '11'}
                                                                        ]
                                                             });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: '-'
                                              });
    dayElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                             title: "Select day of the month",
                                                             options: makeOptions(1, 31, 2)
                                                           });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: ' '
                                              });
    timezoneElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                                  title: "Select timezone",
                                                                  options: [ { text: '',              value: '' },
                                                                             { text: 'Europe/London', value: 'Europe/London' },
                                                                             { text: 'Japan',         value: 'Japan' }
                                                                           ]
                                                                });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: ' '
                                              });
    currentTimeElement = expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                                     className: 'mtzdCurrentTime',
                                                                     title: 'Current Time',
                                                                     textContent: '\u25d4'
                                                                   });
    expectChildren(assert, dateElement, index);
    assert.equal(testVars.dte3.locale, undefined, 'locale is not defined');
    assert.equal(testVars.dte3.mode, momentTimezoneDiff.MODE_SPLIT_HOUR12, 'Mode matches');
    assert.equal(testVars.dte3.errorClassName, 'mtzdError', 'Error class matches');
    assert.equal(testVars.dte3.currentTime, currentTimeElement, 'Current time element matches');
    assert.equal(testVars.dte3.elements.hour, hourElement, 'Hour element matches');
    assert.equal(testVars.dte3.elements.minute, minuteElement, 'Minute element matches');
    assert.equal(testVars.dte3.elements.ampm, ampmElement, 'AmPm element matches');
    assert.equal(testVars.dte3.elements.day, dayElement, 'Day element matches');
    assert.equal(testVars.dte3.elements.month, monthElement, 'Month element matches');
    assert.equal(testVars.dte3.elements.year, yearElement, 'Year element matches');
    assert.equal(testVars.dte3.elements.timezone, timezoneElement, 'Timezone element matches');
    assert.equal(testVars.dte3.elements.datetime, undefined, 'Date/time element is not defined');
    assert.equal(testVars.dte3.timeDisplayFormat, undefined, 'Display format is not defined');
    assert.equal(testVars.dte3.timeInputFormats, undefined, 'Input formats is not defined');
    assert.equal(testVars.dte3.elements.datePicker, undefined, 'Date Picker element is not defined');
    assert.equal(testVars.dte3.datePickerFormat, undefined, 'Date display/input format is not defined');
});
function expectTimezone(assert, timezones, index, timezone, formats) {
    var i;
    assert.ok(timezones[index], 'Timezone exists');
    assert.equal(timezones[index].timezone, timezone, 'Timezone matches');
    assert.equal(timezones[index].elementFormats.length, formats.length, 'elementFormats has required number of entries');
    for (i = 0; i < timezones[index].elementFormats.length; i += 1) {
        assert.equal(timezones[index].elementFormats[i].format, formats[i], 'Format matches');
        assert.ok(timezones[index].elementFormats[i].element, 'Element is defined');
    }
}
function expectTimezones(assert, timezones, length) {
    assert.equal(timezones.length, length, 'Expected number of timezones present');
}
function expectValues(assert, containerElement, index, values) {
    var child,
        i;
    assert.ok(containerElement && containerElement.children, 'Container exists and contains children');
    child = containerElement.children[index];
    assert.ok(child && child.children, 'Child exists and contains children');
    assert.equal(child.children.length, values.length, 'Child contains required number of children');
    for (i = 0; i < values.length; i += 1) {
        assert.equal(child.children[i].textContent, values[i], 'Value matches');
    }
}
function expectLegend(assert, legendElement, first, second, breakPresent) {
    var index = 0;
    assert.ok(legendElement && legendElement.children, 'Legend exists and has children');
    assert.equal(legendElement.children.length, breakPresent ? 3 : 2, 'Legend has required number of children');
    assert.equal(legendElement.children[index].tagName, 'SPAN', 'First child is a SPAN');
    assert.equal(legendElement.children[index++].textContent, first, 'First span child has required text');
    if (breakPresent) {
        assert.equal(legendElement.children[index++].tagName, 'BR', 'Next child is a BR');
    }
    assert.equal(legendElement.children[index].tagName, 'SPAN', 'Next child is a SPAN');
    assert.equal(legendElement.children[index++].textContent, second, 'Next span child has required text');
}
function getMomentValues(moment) {
    return [ moment.year(),
             moment.month(),
             moment.date(),
             moment.hour(),
             moment.minute(),
             moment.second()
           ];
}
function simulateClick(element) {
    var event = document.createEvent ('MouseEvent');
    event.initMouseEvent ('click', true, true, window);
    return element.dispatchEvent(event);
}
function getTimezone(element) {
    if (element) {
        return { value: element.options[element.selectedIndex].value, text: element.options[element.selectedIndex].textContent };
    }
    return undefined;
}
function classPresentInClassName(className, classNameToCheck) {
    var classes = className.split(/\s+/),
        i;
    for (i = 0; i < classes.length; i += 1) {
        if (classes[i] === classNameToCheck) {
            return true;
        }
    }
    return false;
}
function verifyLink(assert, env, containerElement, row, col, timezone, name, linkClass) {
    var cells = containerElement && containerElement.children && containerElement.children[row],
        cell,
        selectedTimezone;
    assert.ok(cells, 'Row has children');
    cell = cells && cells.children && cells.children[col];
    assert.ok(cell, 'Cell exists');
    assert.ok(simulateClick(cell), 'Click similated');
    assert.equal(env.timezone.value, timezone, 'Timezone value matches');
    assert.equal(env.timezone.text, name, 'Timezone text matches');
    selectedTimezone = getTimezone(env && env.dateTimeElements && env.dateTimeElements.elements && env.dateTimeElements.elements.timezone);
    assert.equal(selectedTimezone.value, timezone, 'Timezone value matches timezone combo');
    assert.equal(selectedTimezone.text, name, 'Timezone text matches timezone combo');
    assert.ok(classPresentInClassName(cell.className, linkClass), 'Class name "' + linkClass + '" is present in "' + cell.className + '"');
}
QUnit.test('Environment', function (assert) {
    var dateElement,
        containerElement,
        timeElement,
        legendElement,
        index = 0,
        hourElement,
        minuteElement,
        ampmElement,
        datePickerElement,
        timezoneElement,
        currentTimeElement,
        formats,
        values,
        col,
        defaultOptions = { locale: undefined,
                           ahead: 'ahead',
                           behind: 'behind',
                           hour: 'hour',
                           hours: 'hours',
                           sunRiseHour: 6,
                           sunRiseMinute: 0,
                           sunSetHour: 20,
                           sunSetMinute: 0,
                           sun: '\u263c',  // Unicode white sun with rays
                           moon: '\u263e', // Unicode last quarter moon
                           legendFormat: 'h:mm a',
                           legendBreak: true,
                           legendDash: ' - ',
                           legendSeparator: ' .. ',
                           timeFormat: 'dddd h:mm a DD-MMM-YYYY',
                           timeShowTimezoneName: true,
                           defaultTimezone: momentTimezoneDiff.getDefaultTimezone()
                         };

    dateElement = document.getElementById('mtzdDate');
    assert.ok(dateElement, 'Date element exists');
    containerElement = document.getElementById('mtzdContainer');
    assert.ok(containerElement, 'Container is defined');
    timeElement = document.getElementById('mtzdTime');
    assert.ok(timeElement, 'Time is defined');
    legendElement = document.getElementById('mtzdLegend');
    assert.ok(legendElement, 'Legend is defined');

    hourElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                              title: 'Select hour of the day',
                                                              options: makeOptions(0, 11, 2, { 0: '12' })
                                                            });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: ':'
                                              });
    minuteElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                                title: "Select minute of the hour",
                                                                options: makeOptions(0, 59, 2)
                                                              });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: ' '
                                              });
    ampmElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                              title: "Select morning or afternoon",
                                                              options: [ { text: 'am', value: '0'  },
                                                                         { text: 'pm', value: '1' }
                                                                       ]
                                                            });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: ' '
                                              });
    datePickerElement = expectChild(assert, dateElement, index++, { tagName: 'INPUT',
                                                                    type: 'text',
                                                                    title: "Enter the required date. Supported format is DD-MMM-YYYY",
                                                                    size: 10
                                                                  });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: ' '
                                              });
    timezoneElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                                  title: "Select timezone",
                                                                  options: [ { text: '',                   value: '' },
                                                                             { text: 'Fred Flintstone',    value: 'US/Pacific' },
                                                                             { text: 'Barny Rubble',       value: 'US/Eastern' },
                                                                             { text: 'Bamm Bamm Rubble',   value: 'Europe/London' },
                                                                             { text: 'Wilma Flintstone',   value: 'Europe/Paris' },
                                                                             { text: 'Betty Rubble',       value: 'Asia/Calcutta' },
                                                                             { text: 'Pebbles Flintstone', value: 'Australia/Perth' },
                                                                             { text: 'Dino',               value: 'Australia/Melbourne' },
                                                                           ]
                                                                });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: ' '
                                              });
    currentTimeElement = expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                                     className: 'mtzdCurrentTime',
                                                                     title: 'Current Time',
                                                                     textContent: '\u25d4'
                                                                   });
    expectChildren(assert, dateElement, index);

    assert.equal(testVars.env.dateTimeElements.locale, undefined, 'env dateTimeElements locale is not defined');
    assert.equal(testVars.env.dateTimeElements.mode, momentTimezoneDiff.MODE_SPLIT_HOUR12, 'Mode matches');
    assert.equal(testVars.env.dateTimeElements.errorClassName, 'mtzdError', 'Error class matches');
    assert.equal(testVars.env.dateTimeElements.currentTime, currentTimeElement, 'Current time element matches');
    assert.equal(testVars.env.dateTimeElements.elements.hour, hourElement, 'Hour element matches');
    assert.equal(testVars.env.dateTimeElements.elements.minute, minuteElement, 'Minute element matches');
    assert.equal(testVars.env.dateTimeElements.elements.ampm, ampmElement, 'AmPm element matches');
    assert.equal(testVars.env.dateTimeElements.elements.day, undefined, 'Day element is not defined');
    assert.equal(testVars.env.dateTimeElements.elements.month, undefined, 'Month element is not defined');
    assert.equal(testVars.env.dateTimeElements.elements.year, undefined, 'Year element is not defined');
    assert.equal(testVars.env.dateTimeElements.elements.timezone, timezoneElement, 'Timezone element matches');
    assert.equal(testVars.env.dateTimeElements.elements.datetime, undefined, 'Date/time element is not defined');
    assert.equal(testVars.env.dateTimeElements.timeDisplayFormat, undefined, 'Display format is not defined');
    assert.equal(testVars.env.dateTimeElements.timeInputFormats, undefined, 'Input formats is not defined');
    assert.equal(testVars.env.dateTimeElements.elements.datePicker, datePickerElement, 'Date Picker element matches');
    assert.equal(testVars.env.dateTimeElements.datePickerFormat, 'DD-MMM-YYYY', 'Date display/input format matches');

    assert.deepEqual(testVars.env.options, defaultOptions, 'options matches default options');
    assert.deepEqual(testVars.env.getOptions(), defaultOptions, 'getOptions() matches default options');
    assert.notEqual(testVars.env.options, testVars.env.getOptions(), 'getOptions() returns a copy');
    assert.equal(testVars.env.timeElement, timeElement, 'Time element matches');

    formats = [ 'dddd', 
                'h:mm a', 
                'DD-MMM-YYYY', 
                'DIFF', 
                'sunmoon'
              ];

    index = 0;
    expectTimezone(assert, testVars.env.timezones, index++, 'US/Pacific', formats);
    expectTimezone(assert, testVars.env.timezones, index++, 'US/Eastern', formats);
    expectTimezone(assert, testVars.env.timezones, index++, 'Europe/London', formats);
    expectTimezone(assert, testVars.env.timezones, index++, 'Europe/Paris', formats);
    expectTimezone(assert, testVars.env.timezones, index++, 'Asia/Calcutta', formats);
    expectTimezone(assert, testVars.env.timezones, index++, 'Australia/Perth', formats);
    expectTimezone(assert, testVars.env.timezones, index++, 'Australia/Melbourne', formats);
    expectTimezones(assert, testVars.env.timezones, index);
    
    // 1-Sep-2014 - Australia NOT in daylight savings - US IS in daylight savings
    values = getMomentValues(testVars.env.moment);
    assert.deepEqual(values, [ 2014, 8, 1, 0, 0, 0], 'moment matches');
    assert.deepEqual(testVars.env.timezone, { value: 'Australia/Melbourne', text: 'Dino' }, 'timezone matches');
    
    index = 0;
    expectValues(assert, containerElement, index++, [ 'Fred Flintstone',
                                                  'Vancouver, Canada',
                                                  'US/Pacific',
                                                  'Sunday',
                                                  '7:00 am',
                                                  '31-Aug-2014',
                                                  '17 hours behind',
                                                  '\u263c'
                                                ]);
    expectValues(assert, containerElement, index++, [ 'Barny Rubble',
                                                  'New York, USA',
                                                  'US/Eastern',
                                                  'Sunday',
                                                  '10:00 am',
                                                  '31-Aug-2014',
                                                  '14 hours behind',
                                                  '\u263c'
                                                ]);
    expectValues(assert, containerElement, index++, [ 'Bamm Bamm Rubble',
                                                      'London, United Kingdom',
                                                      'Europe/London',
                                                      'Sunday',
                                                      '3:00 pm',
                                                      '31-Aug-2014',
                                                      '9 hours behind',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Wilma Flintstone',
                                                      'Paris, France',
                                                      'Europe/Paris',
                                                      'Sunday',
                                                      '4:00 pm',
                                                      '31-Aug-2014',
                                                      '8 hours behind',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Betty Rubble',
                                                      'Mumbai, India',
                                                      'Asia/Calcutta',
                                                      'Sunday',
                                                      '7:30 pm',
                                                      '31-Aug-2014',
                                                      '4.5 hours behind',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Pebbles Flintstone',
                                                      'Perth, Australia',
                                                      'Australia/Perth',
                                                      'Sunday',
                                                      '10:00 pm',
                                                      '31-Aug-2014',
                                                      '2 hours behind',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Dino',
                                                      'Melbourne, Australia',
                                                      'Australia/Melbourne',
                                                      'Monday',
                                                      '12:00 am',
                                                      '01-Sep-2014',
                                                      '',
                                                      '\u263e'
                                                    ]);
    assert.equal(timeElement.textContent, 'Monday 12:00 am 01-Sep-2014 (Dino)', 'Time value matches');
    expectLegend(assert, legendElement, '\u263c - 6:00 am .. 7:59 pm', '\u263e - 8:00 pm .. 5:59 am', true);

    // 15-Oct-2014 - Australia IS in daylight savings - US IS in daylight savings
    testVars.env.update([2014, 9, 15, 14, 30, 0], 'US/Pacific', 'Fred Flintstone');

    values = getMomentValues(testVars.env.moment);
    assert.deepEqual(values, [ 2014, 9, 15, 14, 30, 0], 'moment matches');
    assert.deepEqual(testVars.env.timezone, { value: 'US/Pacific', text: 'Fred Flintstone' }, 'timezone matches');

    index = 0;
    expectValues(assert, containerElement, index++, [ 'Fred Flintstone', 
                                                      'Vancouver, Canada', 
                                                      'US/Pacific', 
                                                      'Wednesday', 
                                                      '2:30 pm', 
                                                      '15-Oct-2014', 
                                                      '', 
                                                      '\u263c' 
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Barny Rubble', 
                                                      'New York, USA', 
                                                      'US/Eastern', 
                                                      'Wednesday', 
                                                      '5:30 pm', 
                                                      '15-Oct-2014', 
                                                      '3 hours ahead', 
                                                      '\u263c' 
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Bamm Bamm Rubble', 
                                                      'London, United Kingdom', 
                                                      'Europe/London', 
                                                      'Wednesday', 
                                                      '10:30 pm', 
                                                      '15-Oct-2014', 
                                                      '8 hours ahead', 
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Wilma Flintstone', 
                                                      'Paris, France', 
                                                      'Europe/Paris', 
                                                      'Wednesday', 
                                                      '11:30 pm', 
                                                      '15-Oct-2014', 
                                                      '9 hours ahead', 
                                                      '\u263e' 
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Betty Rubble', 
                                                      'Mumbai, India', 
                                                      'Asia/Calcutta', 
                                                      'Thursday', 
                                                      '3:00 am', 
                                                      '16-Oct-2014', 
                                                      '12.5 hours ahead', 
                                                      '\u263e' 
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Pebbles Flintstone', 
                                                      'Perth, Australia', 
                                                      'Australia/Perth', 
                                                      'Thursday', 
                                                      '5:30 am', 
                                                      '16-Oct-2014', 
                                                      '15 hours ahead', 
                                                      '\u263e' 
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Dino', 
                                                      'Melbourne, Australia', 
                                                      'Australia/Melbourne', 
                                                      'Thursday', 
                                                      '8:30 am', 
                                                      '16-Oct-2014', 
                                                      '18 hours ahead', 
                                                      '\u263c'
                                                    ]);
    assert.equal(timeElement.textContent, 'Wednesday 2:30 pm 15-Oct-2014 (Fred Flintstone)', 'Time value matches');
    expectLegend(assert, legendElement, '\u263c - 6:00 am .. 7:59 pm', '\u263e - 8:00 pm .. 5:59 am', true);

    // 15-Nov-2014 - Australia IS in daylight savings - US NOT in daylight savings
    testVars.env.update([2014, 10, 15, 14, 30, 0], 'Europe/Paris', 'Wilma Flintstone');

    values = getMomentValues(testVars.env.moment);
    assert.deepEqual(values, [ 2014, 10, 15, 14, 30, 0], 'moment matches');
    assert.deepEqual(testVars.env.timezone, { value: 'Europe/Paris', text: 'Wilma Flintstone' }, 'timezone matches');

    index = 0;
    expectValues(assert, containerElement, index++, [ 'Fred Flintstone',
                                                      'Vancouver, Canada',
                                                      'US/Pacific',
                                                      'Saturday',
                                                      '5:30 am',
                                                      '15-Nov-2014',
                                                      '9 hours behind',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Barny Rubble',
                                                      'New York, USA',
                                                      'US/Eastern',
                                                      'Saturday',
                                                      '8:30 am',
                                                      '15-Nov-2014',
                                                      '6 hours behind',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Bamm Bamm Rubble',
                                                      'London, United Kingdom',
                                                      'Europe/London',
                                                      'Saturday',
                                                      '1:30 pm',
                                                      '15-Nov-2014',
                                                      '1 hour behind',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Wilma Flintstone',
                                                      'Paris, France',
                                                      'Europe/Paris',
                                                      'Saturday',
                                                      '2:30 pm',
                                                      '15-Nov-2014',
                                                      '',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Betty Rubble',
                                                      'Mumbai, India',
                                                      'Asia/Calcutta',
                                                      'Saturday',
                                                      '7:00 pm',
                                                      '15-Nov-2014',
                                                      '4.5 hours ahead',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Pebbles Flintstone',
                                                      'Perth, Australia',
                                                      'Australia/Perth',
                                                      'Saturday',
                                                      '9:30 pm',
                                                      '15-Nov-2014',
                                                      '7 hours ahead',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Dino',
                                                      'Melbourne, Australia',
                                                      'Australia/Melbourne',
                                                      'Sunday',
                                                      '12:30 am',
                                                      '16-Nov-2014',
                                                      '10 hours ahead',
                                                      '\u263e'
                                                    ]);
    assert.equal(timeElement.textContent, 'Saturday 2:30 pm 15-Nov-2014 (Wilma Flintstone)', 'Time value matches');
    expectLegend(assert, legendElement, '\u263c - 6:00 am .. 7:59 pm', '\u263e - 8:00 pm .. 5:59 am', true);
    
    // Simulate click on the LINK cells, verify action triggered and class name as been updated
    for (col = 0; col < 3; col += 1) {
        index = 0;
        verifyLink(assert, testVars.env, containerElement, index++, col, 'US/Pacific', 'Fred Flintstone', 'mtzdLink');
        verifyLink(assert, testVars.env, containerElement, index++, col, 'US/Eastern', 'Barny Rubble', 'mtzdLink');
        verifyLink(assert, testVars.env, containerElement, index++, col, 'Europe/London', 'Bamm Bamm Rubble', 'mtzdLink');
        verifyLink(assert, testVars.env, containerElement, index++, col, 'Europe/Paris', 'Wilma Flintstone', 'mtzdLink');
        verifyLink(assert, testVars.env, containerElement, index++, col, 'Asia/Calcutta', 'Betty Rubble', 'mtzdLink');
        verifyLink(assert, testVars.env, containerElement, index++, col, 'Australia/Perth', 'Pebbles Flintstone', 'mtzdLink');
        verifyLink(assert, testVars.env, containerElement, index++, col, 'Australia/Melbourne', 'Dino', 'mtzdLink');
        assert.equal(containerElement.children.length, index, 'All rows verified');
    }
});
