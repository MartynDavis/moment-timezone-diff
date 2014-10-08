﻿"use strict";

/*global QUnit, moment, momentTimezoneDiff, testVars*/

QUnit.test('momentTimezoneDiff', function (assert) {
    assert.equal(momentTimezoneDiff.version, '0.1.0', 'Moment timezone diff version is correct');
    assert.equal(momentTimezoneDiff.MODE_SINGLE, 0, 'Moment timezone diff MODE_SINGLE is correct');
    assert.equal(momentTimezoneDiff.MODE_SPLIT_HOUR24, 1, 'Moment timezone diff MODE_SPLIT_HOUR24 is correct');
    assert.equal(momentTimezoneDiff.MODE_SPLIT_HOUR12, 2, 'Moment timezone diff MODE_SPLIT_HOUR12 is correct');
    assert.equal(momentTimezoneDiff.DATE_ORDER_DMY, 0, 'Moment timezone diff DATE_ORDER_DMY is correct');
    assert.equal(momentTimezoneDiff.DATE_ORDER_MDY, 1, 'Moment timezone diff DATE_ORDER_MDY is correct');
    assert.equal(momentTimezoneDiff.DATE_ORDER_YMD, 2, 'Moment timezone diff DATE_ORDER_YMD is correct');
    assert.equal(typeof momentTimezoneDiff.DateTimeElements, 'function', 'Moment timezone diff DateTimeElements is a function');
    assert.equal(typeof momentTimezoneDiff.Environment, 'function', 'Moment timezone diff Environment is a function');
    assert.equal(typeof momentTimezoneDiff.TimezoneDiff, 'function', 'Moment timezone diff TimezoneDiff is a function');
    assert.equal(typeof momentTimezoneDiff.getDefaultTimezone, 'function', 'Moment timezone diff getDefaultTimezone is a function');
    assert.equal(typeof momentTimezoneDiff.getOptions, 'function', 'Moment timezone diff getOptions is a function');
    assert.equal(typeof momentTimezoneDiff.setOptions, 'function', 'Moment timezone diff setOptions is a function');
    assert.equal(typeof momentTimezoneDiff.sunny, 'function', 'Moment timezone diff sunny is a function');
    assert.equal(typeof momentTimezoneDiff.createLegend, 'function', 'Moment timezone diff createLegend is a function');
});
QUnit.test('Diff', function (assert) {

    var m = moment.tz([2014, 8, 1, 12, 42, 13], 'US/Pacific'),
        tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'US/Eastern');
    assert.equal(tzDiff.diff(), 3, 'Time difference correct');
    
    m = moment.tz([2014, 11, 31, 23, 42, 13], 'US/Pacific');
    tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'US/Eastern');
    assert.equal(tzDiff.diff(), 3, 'Time difference correct when years different');

    m = moment.tz([2015, 0, 1, 1, 1, 1], 'Australia/Melbourne');
    tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Perth');
    assert.equal(tzDiff.diff(), -3, 'Time difference correct when years different and daylight saving difference');
    tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Brisbane');
    assert.equal(tzDiff.diff(), -1, 'Time difference correct when years different and daylight saving difference');

    m = moment.tz([2014, 7, 7, 7, 7, 7], 'Australia/Melbourne');
    tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Perth');
    assert.equal(tzDiff.diff(), -2, 'Time difference correct with no daylight savings differences');
    tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Brisbane');
    assert.equal(tzDiff.diff(), 0, 'Time difference correct with no daylight savings differences');
});
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
function getDateTimeElementValues(dte) {
    var values = { },
        name;
    if (dte && dte.elements && values) {
        for (name in dte.elements) {
            if (dte.elements.hasOwnProperty(name)) {
                if (dte.elements[name]) {
                    if (dte.elements[name].options) {
                        values[name] = dte.elements[name].selectedIndex;
                    } else {
                        values[name] = dte.elements[name].value;
                    }
                }
            }
        }
    }
    return values;
}
function setDateTimeElementValues(dte, values) {
    var name;
    if (dte && dte.elements && values) {
        for (name in dte.elements) {
            if (dte.elements.hasOwnProperty(name) && values.hasOwnProperty(name)) {
                if (dte.elements[name]) {
                    if (dte.elements[name].options) {
                        dte.elements[name].selectedIndex = values[name];
                    } else {
                        dte.elements[name].value = values[name];
                    }
                }
            }
        }
    }
}
QUnit.test('DateTimeElements1', function (assert) {
    var dateElement,
        index = 0,
        hourElement,
        minuteElement,
        ampmElement,
        dayElement,
        monthElement,
        yearElement,
        timezoneElement,
        currentTimeElement,
        values;
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
    dayElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                             title: "Choisir jour du mois",
                                                             options: makeOptions(1, 31, 2)
                                                           });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: '-'
                                              });
    monthElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                               title: "Sélectionnez un mois de l'année",
                                                               options: [ { text: 'janvier',   value:  '0' },
                                                                          { text: 'février',   value:  '1' },
                                                                          { text: 'mars',      value:  '2' },
                                                                          { text: 'avril',     value:  '3' },
                                                                          { text: 'mai',       value:  '4' },
                                                                          { text: 'juin',      value:  '5' },
                                                                          { text: 'juillet',   value:  '6' },
                                                                          { text: 'août',      value:  '7' },
                                                                          { text: 'septembre', value:  '8' },
                                                                          { text: 'octobre',   value:  '9' },
                                                                          { text: 'novembre',  value: '10' },
                                                                          { text: 'décembre',  value: '11' }
                                                                        ]
                                                             });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: '-'
                                              });
    yearElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                              title: "Sélectionnez l'année",
                                                              options: makeOptions(2010, 2020)
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
    assert.equal(testVars.dte1.elements.day, dayElement, 'Day element matches');
    assert.equal(testVars.dte1.elements.month, monthElement, 'Month element matches');
    assert.equal(testVars.dte1.elements.year, yearElement, 'Year element matches');
    assert.equal(testVars.dte1.elements.timezone, timezoneElement, 'Timezone element matches');
    assert.equal(testVars.dte1.elements.datetime, undefined, 'Date/time element is not defined');
    assert.equal(testVars.dte1.timeDisplayFormat, undefined, 'Display format is not defined');
    assert.equal(testVars.dte1.timeInputFormats, undefined, 'Input formats is not defined');
    assert.equal(testVars.dte1.elements.datePicker, undefined, 'Date Picker element is not defined');
    assert.equal(testVars.dte1.datePickerFormat, undefined, 'Date display/input format is not defined');
    
    setDateTimeElementValues(testVars.dte1, { hour: 5, minute: 42, ampm: 1, day: 5, month: 7, year: 3, timezone: 0 });
    values = testVars.dte1.getSelected();
    assert.deepEqual(values, { hour: 17, minute: 42, day: 6, month: 7, year: 2013, timezone: { text: '', value: '' } }, 'Selected matches date');
    testVars.dte1.setSelected({ hour: 6, minute: 13, day: 17, month: 3, year: 2014, timezone: { text: 'André Lurçat', value: 'Canada/Newfoundland' } });
    values = getDateTimeElementValues(testVars.dte1);
    assert.deepEqual(values, { hour: 6, minute: 13, ampm: 0, day: 16, month: 3, year: 4, timezone: 2 }, 'Selected values matches date');
});
QUnit.test('DateTimeElements2', function (assert) {
    var dateElement,
        index = 0,
        hourElement,
        minuteElement,
        dayElement,
        monthElement,
        yearElement,
        timezoneElement,
        currentTimeElement,
        values;
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
                                                textContent: '-'
                                              });
    yearElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                              title: "Select year",
                                                              options: makeOptions(2010, 2020)
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
    assert.equal(testVars.dte2.elements.day, dayElement, 'Day element matches');
    assert.equal(testVars.dte2.elements.month, monthElement, 'Month element matches');
    assert.equal(testVars.dte2.elements.year, yearElement, 'Year element matches');
    assert.equal(testVars.dte2.elements.timezone, timezoneElement, 'Timezone element matches');
    assert.equal(testVars.dte2.elements.datetime, undefined, 'Date/time element is not defined');
    assert.equal(testVars.dte2.timeDisplayFormat, undefined, 'Display format is not defined');
    assert.equal(testVars.dte2.timeInputFormats, undefined, 'Input formats is not defined');
    assert.equal(testVars.dte2.elements.datePicker, undefined, 'Date Picker element is not defined');
    assert.equal(testVars.dte2.datePickerFormat, undefined, 'Date display/input format is not defined');

    testVars.dte2.setSelected({ hour: 17, minute: 55, day: 21, month: 8, year: 2017, timezone: { text: 'US/Eastern', value: 'US/Eastern' } });
    values = getDateTimeElementValues(testVars.dte2);
    assert.deepEqual(values, { hour: 17, minute: 55, day: 20, month: 8, year: 7, timezone: 1 }, 'Selected values matches date');
    setDateTimeElementValues(testVars.dte2, { hour: 5, minute: 42, day: 5, month: 7, year: 3, timezone: 2 });
    values = testVars.dte2.getSelected();
    assert.deepEqual(values, { hour: 5, minute: 42, day: 6, month: 7, year: 2013, timezone: { text: 'Australia/Perth', value: 'Australia/Perth' } }, 'Selected matches date');
});
QUnit.test('DateTimeElements3', function (assert) {
    var dateElement,
        index = 0,
        datetimeElement,
        timezoneElement,
        currentTimeElement,
        values;
    dateElement = document.getElementById('mtzdDateSingle');
    assert.ok(dateElement, 'Date element exists');
    datetimeElement = expectChild(assert, dateElement, index++, { tagName: 'INPUT',
                                                                  type: 'text',
                                                                  title: 'Enter the required date and time.  Supported formats are:\n' +
                                                                         '\n' +
                                                                         '  dddd h:mm a DD-MMM-YYYY\n' +
                                                                         '  dddd H:mm DD-MMM-YYYY\n' +
                                                                         '  h:mm a DD-MMM-YYYY\n' +
                                                                         '  H:mm DD-MMM-YYYY\n' +
                                                                         '  h:mm a MMM-DD-YYYY\n' +
                                                                         '  H:mm MMM-DD-YYYY\n' +
                                                                         '  h:mm a DD-MM-YYYY\n' +
                                                                         '  H:mm DD-MM-YYYY\n' +
                                                                         '  h:mm a MM-DD-YYYY\n' +
                                                                         '  H:mm MM-DD-YYYY',
                                                                  size: 28
                                                                });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: ' '
                                              });
    timezoneElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                                  title: "Select timezone",
                                                                  options: [ { text: 'The current timezone', value: '' },
                                                                             { text: 'timezone1',            value: 'US/Pacific' },
                                                                             { text: 'timezone2',            value: 'Australia/Melbourne' }
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
    assert.equal(testVars.dte3.mode, momentTimezoneDiff.MODE_SINGLE, 'Mode matches');
    assert.equal(testVars.dte3.errorClassName, 'mtzdError', 'Error class matches');
    assert.equal(testVars.dte3.currentTime, currentTimeElement, 'Current time element matches');
    assert.equal(testVars.dte3.elements.hour, undefined, 'Hour element is not defined');
    assert.equal(testVars.dte3.elements.minute, undefined, 'Minute element is not defined');
    assert.equal(testVars.dte3.elements.ampm, undefined, 'AmPm element is not defined');
    assert.equal(testVars.dte3.elements.day, undefined, 'Day element is not defined');
    assert.equal(testVars.dte3.elements.month, undefined, 'Month element is not defined');
    assert.equal(testVars.dte3.elements.year, undefined, 'Year element is not defined');
    assert.equal(testVars.dte3.elements.datetime, datetimeElement, 'Date/time element matches');
    assert.equal(testVars.dte3.elements.timezone, timezoneElement, 'Timezone element matches');
    assert.equal(testVars.dte3.timeDisplayFormat, 'dddd h:mm a DD-MMM-YYYY', 'Display format matches');
    assert.deepEqual(testVars.dte3.timeInputFormats, [ 'dddd h:mm a DD-MMM-YYYY', 
                                                       'dddd H:mm DD-MMM-YYYY', 
                                                       'h:mm a DD-MMM-YYYY', 
                                                       'H:mm DD-MMM-YYYY', 
                                                       'h:mm a MMM-DD-YYYY', 
                                                       'H:mm MMM-DD-YYYY', 
                                                       'h:mm a DD-MM-YYYY', 
                                                       'H:mm DD-MM-YYYY', 
                                                       'h:mm a MM-DD-YYYY', 
                                                       'H:mm MM-DD-YYYY'
                                                     ], 'Input formats match');
    assert.equal(testVars.dte3.elements.datePicker, undefined, 'Date Picker element is not defined');
    assert.equal(testVars.dte3.datePickerFormat, undefined, 'Date display/input format is not defined');

    testVars.dte3.setSelected({ hour: 7, minute: 14, day: 18, month: 4, year: 2015, timezone: { text: 'timezone1', value: 'US/Pacific' } });
    values = getDateTimeElementValues(testVars.dte3);
    assert.deepEqual(values, { datetime: 'Monday 7:14 am 18-May-2015', timezone: 1 }, 'Selected values matches date');
    setDateTimeElementValues(testVars.dte3, { datetime: 'Wednesday 8:58 pm 8-Oct-2014', timezone: 0 });
    values = testVars.dte3.getSelected();
    assert.deepEqual(values, { hour: 20, minute: 58, day: 8, month: 9, year: 2014, timezone: { text: 'The current timezone', value: '' } }, 'Selected matches date');
});
QUnit.test('DateTimeElements4', function (assert) {
    var dateElement,
        index = 0,
        hourElement,
        minuteElement,
        ampmElement,
        dayElement,
        monthElement,
        yearElement,
        timezoneElement,
        currentTimeElement,
        values;
    dateElement = document.getElementById('mtzdDate12hour2');
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
                                                textContent: '-'
                                              });
    yearElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                              title: "Select year",
                                                              options: makeOptions(2010, 2020)
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
    assert.equal(testVars.dte4.locale, undefined, 'locale is not defined');
    assert.equal(testVars.dte4.mode, momentTimezoneDiff.MODE_SPLIT_HOUR12, 'Mode matches');
    assert.equal(testVars.dte4.errorClassName, 'mtzdError', 'Error class matches');
    assert.equal(testVars.dte4.currentTime, currentTimeElement, 'Current time element matches');
    assert.equal(testVars.dte4.elements.hour, hourElement, 'Hour element matches');
    assert.equal(testVars.dte4.elements.minute, minuteElement, 'Minute element matches');
    assert.equal(testVars.dte4.elements.ampm, ampmElement, 'AmPm element matches');
    assert.equal(testVars.dte4.elements.day, dayElement, 'Day element matches');
    assert.equal(testVars.dte4.elements.month, monthElement, 'Month element matches');
    assert.equal(testVars.dte4.elements.year, yearElement, 'Year element matches');
    assert.equal(testVars.dte4.elements.timezone, timezoneElement, 'Timezone element matches');
    assert.equal(testVars.dte4.elements.datetime, undefined, 'Date/time element is not defined');
    assert.equal(testVars.dte4.timeDisplayFormat, undefined, 'Display format is not defined');
    assert.equal(testVars.dte4.timeInputFormats, undefined, 'Input formats is not defined');
    assert.equal(testVars.dte4.elements.datePicker, undefined, 'Date Picker element is not defined');
    assert.equal(testVars.dte4.datePickerFormat, undefined, 'Date display/input format is not defined');

    testVars.dte4.setSelected({ hour: 0, minute: 0, day: 1, month: 0, year: 2010, timezone: { text: '', value: '' } });
    values = getDateTimeElementValues(testVars.dte4);
    assert.deepEqual(values, { hour: 0, minute: 0, ampm: 0, day: 0, month: 0, year: 0, timezone: 0 }, 'Selected values matches date');
    setDateTimeElementValues(testVars.dte4, { hour: 11, minute: 59, ampm: 1, day: 30, month: 11, year: 10, timezone: 2 });
    values = testVars.dte4.getSelected();
    assert.deepEqual(values, { hour: 23, minute: 59, day: 31, month: 11, year: 2020, timezone: { text: 'Japan', value: 'Japan' } }, 'Selected matches date');
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
        dayElement,
        monthElement,
        yearElement,
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
    dayElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                             title: "Select day of the month",
                                                             options: makeOptions(1, 31, 2)
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
    yearElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                              title: "Select year",
                                                              options: makeOptions(2010, 2020)
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
    assert.equal(testVars.env.dateTimeElements.elements.day, dayElement, 'Day element matches');
    assert.equal(testVars.env.dateTimeElements.elements.month, monthElement, 'Month element matches');
    assert.equal(testVars.env.dateTimeElements.elements.year, yearElement, 'Year element matches');
    assert.equal(testVars.env.dateTimeElements.elements.timezone, timezoneElement, 'Timezone element matches');
    assert.equal(testVars.env.dateTimeElements.elements.datetime, undefined, 'Date/time element is not defined');
    assert.equal(testVars.env.dateTimeElements.timeDisplayFormat, undefined, 'Display format is not defined');
    assert.equal(testVars.env.dateTimeElements.timeInputFormats, undefined, 'Input formats is not defined');
    assert.equal(testVars.env.dateTimeElements.elements.datePicker, undefined, 'Date Picker element is not defined');
    assert.equal(testVars.env.dateTimeElements.datePickerFormat, undefined, 'Date display/input format is not defined');

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
