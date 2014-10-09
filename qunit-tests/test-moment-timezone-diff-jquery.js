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
function getDateTimeElementValues(dte) {
    var values = { },
        name;
    if (dte && dte._elements && values) {
        for (name in dte._elements) {
            if (dte._elements.hasOwnProperty(name)) {
                if (dte._elements[name]) {
                    if (dte._elements[name].options) {
                        values[name] = dte._elements[name].selectedIndex;
                    } else if (dte._elements[name].value !== undefined) {
                        values[name] = dte._elements[name].value;
                    }
                }
            }
        }
    }
    return values;
}
function setDateTimeElementValues(dte, values) {
    var name;
    if (dte && dte._elements && values) {
        for (name in dte._elements) {
            if (dte._elements.hasOwnProperty(name) && values.hasOwnProperty(name)) {
                if (dte._elements[name]) {
                    if (dte._elements[name].options) {
                        dte._elements[name].selectedIndex = values[name];
                    } else {
                        dte._elements[name].value = values[name];
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
        datepickerElement,
        datepickerImageElement,
        timezoneElement,
        currentTimeElement,
        values,
        timezones,
        dte;
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
    datepickerElement = expectChild(assert, dateElement, index++, { tagName: 'INPUT',
                                                                    type: 'text'
                                                                  });
    assert.ok(classPresentInClassName(datepickerElement.className, 'mtzdDatepicker'), 'Class name "mtzdDatepicker" is present in "' + datepickerElement.className + '"');
    datepickerImageElement = expectChild(assert, dateElement, index++, { tagName: 'IMG',
                                                                         className: 'mtzdDatepickerImage',
                                                                         title: "Sélectionnez la date en utilisant le calendrier."
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
    dte = testVars.dte1;
    assert.equal(dte._locale, 'fr', 'Locale is "fr"');
    assert.equal(dte._mode, momentTimezoneDiff.MODE_SPLIT_HOUR12, 'Mode matches');
    assert.equal(dte._errorClassName, 'mtzdError', 'Error class matches');
    assert.equal(dte._currentTime, currentTimeElement, 'Current time element matches');
    assert.equal(dte._elements.hour, hourElement, 'Hour element matches');
    assert.equal(dte._elements.minute, minuteElement, 'Minute element matches');
    assert.equal(dte._elements.ampm, ampmElement, 'AmPm element matches');
    assert.equal(dte._elements.day, dayElement, 'Day element matches');
    assert.equal(dte._elements.month, monthElement, 'Month element matches');
    assert.equal(dte._elements.year, yearElement, 'Year element matches');
    assert.equal(dte._elements.timezone, timezoneElement, 'Timezone element matches');
    assert.equal(dte._elements.datetime, undefined, 'Date/time element is not defined');
    assert.equal(dte._timeDisplayFormat, undefined, 'Display format is not defined');
    assert.equal(dte._timeInputFormats, undefined, 'Input formats is not defined');
    assert.equal(dte._datepicker, datepickerElement, 'Date Picker element matches');
    assert.equal(dte._datepickerImage, datepickerImageElement, 'Date Picker image element matches');
    setDateTimeElementValues(dte, { hour: 5, minute: 42, ampm: 1, day: 5, month: 7, year: 3, timezone: 0 });
    values = dte.getSelected();
    assert.deepEqual(values, { hour: 17, minute: 42, day: 6, month: 7, year: 2013, timezone: { text: '', value: '' } }, 'Selected matches date');

    dte.setSelected({ hour: 6, minute: 13, day: 17, month: 3, year: 2014, timezone: { text: 'André Lurçat', value: 'Canada/Newfoundland' } });
    values = getDateTimeElementValues(dte);
    assert.deepEqual(values, { hour: 6, minute: 13, ampm: 0, day: 16, month: 3, year: 4, timezone: 2 }, 'Selected values matches date');

    // Cycle through hour/ampm values
    for (index = 0; index < 24; index += 1) {
        setDateTimeElementValues(dte, { hour: (index < 12) ? index : index - 12, minute: 42, ampm: (index < 12) ? 0 : 1, day: 5, month: 7, year: 3, timezone: 0 });
        values = dte.getSelected();
        assert.deepEqual(values, { hour: index, minute: 42, day: 6, month: 7, year: 2013, timezone: { text: '', value: '' } }, 'Selected matches date');
    }
    // Cycle through minute values
    for (index = 0; index < 60; index += 1) {
        setDateTimeElementValues(dte, { hour: 3, minute: index, ampm: 1, day: 5, month: 7, year: 3, timezone: 0 });
        values = dte.getSelected();
        assert.deepEqual(values, { hour: 15, minute: index, day: 6, month: 7, year: 2013, timezone: { text: '', value: '' } }, 'Selected matches date');
    }
    // Cycle through day values (note 31 daay month selected)
    for (index = 0; index < 31; index += 1) {
        setDateTimeElementValues(dte, { hour: 3, minute: 13, ampm: 1, day: index, month: 7, year: 3, timezone: 0 });
        values = dte.getSelected();
        assert.deepEqual(values, { hour: 15, minute: 13, day: index + 1, month: 7, year: 2013, timezone: { text: '', value: '' } }, 'Selected matches date');
    }
    // Cycle through month values
    for (index = 0; index < 12; index += 1) {
        setDateTimeElementValues(dte, { hour: 3, minute: 13, ampm: 1, day: 13, month: index, year: 3, timezone: 0 });
        values = dte.getSelected();
        assert.deepEqual(values, { hour: 15, minute: 13, day: 14, month: index, year: 2013, timezone: { text: '', value: '' } }, 'Selected matches date');
    }
    // Cycle through year values
    for (index = 0; index < (2020 - 2010 + 1); index += 1) {
        setDateTimeElementValues(dte, { hour: 3, minute: 13, ampm: 1, day: 13, month: 4, year: index, timezone: 0 });
        values = dte.getSelected();
        assert.deepEqual(values, { hour: 15, minute: 13, day: 14, month: 4, year: 2010 + index, timezone: { text: '', value: '' } }, 'Selected matches date');
    }
    // cycle through timezones
    timezones = [ { text: '',                value: '' },
                  { text: 'Sebastian Roché', value: 'Europe/Paris' },
                  { text: 'André Lurçat',    value: 'Canada/Newfoundland' }
                ];
    for (index = 0; index < timezones.length; index += 1) {
        setDateTimeElementValues(dte, { hour: 3, minute: 13, ampm: 1, day: 13, month: 4, year: 3, timezone: index });
        values = dte.getSelected();
        assert.deepEqual(values, { hour: 15, minute: 13, day: 14, month: 4, year: 2013, timezone: timezones[index] }, 'Selected matches date');
    }
    // Test month rollover for months which have less than 31 days (31-Apr => 1-May)
    setDateTimeElementValues(dte, { hour: 5, minute: 42, ampm: 1, day: 30, month: 3, year: 3, timezone: 0 });
    values = dte.getSelected();
    assert.deepEqual(values, { hour: 17, minute: 42, day: 1, month: 4, year: 2013, timezone: { text: '', value: '' } }, 'Selected matches date');
    // Test month rollover for months which have less than 31 days (31-Feb => 3-Mar for non-leap years)
    setDateTimeElementValues(dte, { hour: 5, minute: 42, ampm: 1, day: 30, month: 1, year: 3, timezone: 0 });
    values = dte.getSelected();
    assert.deepEqual(values, { hour: 17, minute: 42, day: 3, month: 2, year: 2013, timezone: { text: '', value: '' } }, 'Selected matches date');
    // Test month rollover for months which have less than 31 days (31-Feb => 2-Mar for leap years)
    setDateTimeElementValues(dte, { hour: 5, minute: 42, ampm: 1, day: 30, month: 1, year: 2, timezone: 0 });
    values = dte.getSelected();
    assert.deepEqual(values, { hour: 17, minute: 42, day: 2, month: 2, year: 2012, timezone: { text: '', value: '' } }, 'Selected matches date');
    // Test 29-Feb is valid for leap years
    setDateTimeElementValues(dte, { hour: 5, minute: 42, ampm: 1, day: 28, month: 1, year: 2, timezone: 0 });
    values = dte.getSelected();
    assert.deepEqual(values, { hour: 17, minute: 42, day: 29, month: 1, year: 2012, timezone: { text: '', value: '' } }, 'Selected matches date');
    // Test 29-Feb rolls over for non-leap years
    setDateTimeElementValues(dte, { hour: 5, minute: 42, ampm: 1, day: 28, month: 1, year: 4, timezone: 0 });
    values = dte.getSelected();
    assert.deepEqual(values, { hour: 17, minute: 42, day: 1, month: 2, year: 2014, timezone: { text: '', value: '' } }, 'Selected matches date');
});
QUnit.test('DateTimeElements2', function (assert) {
    var dateElement,
        index = 0,
        hourElement,
        minuteElement,
        dayElement,
        monthElement,
        yearElement,
        datepickerElement,
        datepickerImageElement,
        timezoneElement,
        currentTimeElement,
        values,
        timezones,
        dte;
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
    datepickerElement = expectChild(assert, dateElement, index++, { tagName: 'INPUT',
                                                                    type: 'text'
                                                                  });
    assert.ok(classPresentInClassName(datepickerElement.className, 'mtzdDatepicker'), 'Class name "mtzdDatepicker" is present in "' + datepickerElement.className + '"');
    datepickerImageElement = expectChild(assert, dateElement, index++, { tagName: 'IMG',
                                                                         className: 'mtzdDatepickerImage',
                                                                         title: "Select the date using a calendar"
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
    dte = testVars.dte2;
    assert.equal(dte._locale, undefined, 'locale is not defined');
    assert.equal(dte._mode, momentTimezoneDiff.MODE_SPLIT_HOUR24, 'Mode matches');
    assert.equal(dte._errorClassName, 'mtzdError', 'Error class matches');
    assert.equal(dte._currentTime, currentTimeElement, 'Current time element matches');
    assert.equal(dte._elements.hour, hourElement, 'Hour element matches');
    assert.equal(dte._elements.minute, minuteElement, 'Minute element matches');
    assert.equal(dte._elements.ampm, undefined, 'AmPm element is not defined');
    assert.equal(dte._elements.day, dayElement, 'Day element matches');
    assert.equal(dte._elements.month, monthElement, 'Month element matches');
    assert.equal(dte._elements.year, yearElement, 'Year element matches');
    assert.equal(dte._elements.timezone, timezoneElement, 'Timezone element matches');
    assert.equal(dte._elements.datetime, undefined, 'Date/time element is not defined');
    assert.equal(dte._timeDisplayFormat, undefined, 'Display format is not defined');
    assert.equal(dte._timeInputFormats, undefined, 'Input formats is not defined');
    assert.equal(dte._datepicker, datepickerElement, 'Date Picker element matches');
    assert.equal(dte._datepickerImage, datepickerImageElement, 'Date Picker image element matches');

    dte.setSelected({ hour: 17, minute: 55, day: 21, month: 8, year: 2017, timezone: { text: 'US/Eastern', value: 'US/Eastern' } });
    values = getDateTimeElementValues(dte);
    assert.deepEqual(values, { hour: 17, minute: 55, day: 20, month: 8, year: 7, timezone: 1 }, 'Selected values matches date');

    setDateTimeElementValues(dte, { hour: 5, minute: 42, day: 5, month: 7, year: 3, timezone: 2 });
    values = dte.getSelected();
    assert.deepEqual(values, { hour: 5, minute: 42, day: 6, month: 7, year: 2013, timezone: { text: 'Australia/Perth', value: 'Australia/Perth' } }, 'Selected matches date');

    // Cycle through hour values
    for (index = 0; index < 24; index += 1) {
        setDateTimeElementValues(dte, { hour: index, minute: 42, day: 5, month: 7, year: 3, timezone: 1 });
        values = dte.getSelected();
        assert.deepEqual(values, { hour: index, minute: 42, day: 6, month: 7, year: 2013, timezone: { text: 'US/Eastern', value: 'US/Eastern' } }, 'Selected matches date');
    }
    // Cycle through minute values
    for (index = 0; index < 60; index += 1) {
        setDateTimeElementValues(dte, { hour: 3, minute: index, day: 5, month: 7, year: 3, timezone: 0 });
        values = dte.getSelected();
        assert.deepEqual(values, { hour: 3, minute: index, day: 6, month: 7, year: 2013, timezone: { text: '', value: '' } }, 'Selected matches date');
    }
    // Cycle through day values (note 31 daay month selected)
    for (index = 0; index < 31; index += 1) {
        setDateTimeElementValues(dte, { hour: 3, minute: 13, day: index, month: 7, year: 3, timezone: 0 });
        values = dte.getSelected();
        assert.deepEqual(values, { hour: 3, minute: 13, day: index + 1, month: 7, year: 2013, timezone: { text: '', value: '' } }, 'Selected matches date');
    }
    // Cycle through month values
    for (index = 0; index < 12; index += 1) {
        setDateTimeElementValues(dte, { hour: 3, minute: 13, day: 13, month: index, year: 3, timezone: 0 });
        values = dte.getSelected();
        assert.deepEqual(values, { hour: 3, minute: 13, day: 14, month: index, year: 2013, timezone: { text: '', value: '' } }, 'Selected matches date');
    }
    // Cycle through year values
    for (index = 0; index < (2020 - 2010 + 1); index += 1) {
        setDateTimeElementValues(dte, { hour: 3, minute: 13, day: 13, month: 4, year: index, timezone: 0 });
        values = dte.getSelected();
        assert.deepEqual(values, { hour: 3, minute: 13, day: 14, month: 4, year: 2010 + index, timezone: { text: '', value: '' } }, 'Selected matches date');
    }
    // cycle through timezones
    timezones = [ { text: '',                value: '' },
                  { text: 'US/Eastern',      value: 'US/Eastern' },
                  { text: 'Australia/Perth', value: 'Australia/Perth' }
                ];
    for (index = 0; index < timezones.length; index += 1) {
        setDateTimeElementValues(dte, { hour: 3, minute: 13, day: 13, month: 4, year: 3, timezone: index });
        values = dte.getSelected();
        assert.deepEqual(values, { hour: 3, minute: 13, day: 14, month: 4, year: 2013, timezone: timezones[index] }, 'Selected matches date');
    }
    // Test month rollover for months which have less than 31 days (31-Apr => 1-May)
    setDateTimeElementValues(dte, { hour: 5, minute: 42, day: 30, month: 3, year: 3, timezone: 0 });
    values = dte.getSelected();
    assert.deepEqual(values, { hour: 5, minute: 42, day: 1, month: 4, year: 2013, timezone: { text: '', value: '' } }, 'Selected matches date');
    // Test month rollover for months which have less than 31 days (31-Feb => 3-Mar for non-leap years)
    setDateTimeElementValues(dte, { hour: 5, minute: 42, day: 30, month: 1, year: 3, timezone: 0 });
    values = dte.getSelected();
    assert.deepEqual(values, { hour: 5, minute: 42, day: 3, month: 2, year: 2013, timezone: { text: '', value: '' } }, 'Selected matches date');
    // Test month rollover for months which have less than 31 days (31-Feb => 2-Mar for leap years)
    setDateTimeElementValues(dte, { hour: 5, minute: 42, day: 30, month: 1, year: 2, timezone: 0 });
    values = dte.getSelected();
    assert.deepEqual(values, { hour: 5, minute: 42, day: 2, month: 2, year: 2012, timezone: { text: '', value: '' } }, 'Selected matches date');
    // Test 29-Feb is valid for leap years
    setDateTimeElementValues(dte, { hour: 5, minute: 42, day: 28, month: 1, year: 2, timezone: 0 });
    values = dte.getSelected();
    assert.deepEqual(values, { hour: 5, minute: 42, day: 29, month: 1, year: 2012, timezone: { text: '', value: '' } }, 'Selected matches date');
    // Test 29-Feb rolls over for non-leap years
    setDateTimeElementValues(dte, { hour: 5, minute: 42, day: 28, month: 1, year: 4, timezone: 2 });
    values = dte.getSelected();
    assert.deepEqual(values, { hour: 5, minute: 42, day: 1, month: 2, year: 2014, timezone: { text: 'Australia/Perth', value: 'Australia/Perth' } }, 'Selected matches date');
});
QUnit.test('DateTimeElements3', function (assert) {
    var dateElement,
        index = 0,
        datetimeElement,
        datepickerElement,
        datepickerImageElement,
        timezoneElement,
        currentTimeElement,
        values,
        dte;
    dateElement = document.getElementById('mtzdDateSingle');
    assert.ok(dateElement, 'Date element exists');
    datetimeElement = expectChild(assert, dateElement, index++, { tagName: 'INPUT',
                                                                  type: 'text',
                                                                  title: 'Enter the required date and time.  Supported formats are:\n' +
                                                                         '\n' +
                                                                         '  h:mm a DD-MMM-YYYY\n' +
                                                                         '  H:mm DD-MMM-YYYY\n' +
                                                                         '  DD-MMM-YYYY',
                                                                  size: 15
                                                                });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: ' '
                                              });
    datepickerElement = expectChild(assert, dateElement, index++, { tagName: 'INPUT',
                                                                    type: 'text'
                                                                  });
    assert.ok(classPresentInClassName(datepickerElement.className, 'mtzdDatepicker'), 'Class name "mtzdDatepicker" is present in "' + datepickerElement.className + '"');
    datepickerImageElement = expectChild(assert, dateElement, index++, { tagName: 'IMG',
                                                                         className: 'mtzdDatepickerImage',
                                                                         title: "Select the date using a calendar"
                                                                       });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: ' '
                                              });
    timezoneElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                                  title: "Select timezone",
                                                                  options: [ { text: '',      value: '' },
                                                                             { text: 'Barry', value: 'America/Argentina/Buenos_Aires' },
                                                                             { text: 'Bruce', value: 'Europe/Budapest' },
                                                                             { text: 'Brett', value: 'Pacific/Norfolk' }
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
    dte = testVars.dte3;
    assert.equal(dte._locale, undefined, 'locale is not defined');
    assert.equal(dte._mode, momentTimezoneDiff.MODE_SINGLE, 'Mode matches');
    assert.equal(dte._errorClassName, 'mtzdError', 'Error class matches');
    assert.equal(dte._currentTime, currentTimeElement, 'Current time element matches');
    assert.equal(dte._elements.hour, undefined, 'Hour element is not defined');
    assert.equal(dte._elements.minute, undefined, 'Minute element is not defined');
    assert.equal(dte._elements.ampm, undefined, 'AmPm element is not defined');
    assert.equal(dte._elements.day, undefined, 'Day element is not defined');
    assert.equal(dte._elements.month, undefined, 'Month element is not defined');
    assert.equal(dte._elements.year, undefined, 'Year element is not defined');
    assert.equal(dte._elements.datetime, datetimeElement, 'Date/time element matches');
    assert.equal(dte._elements.timezone, timezoneElement, 'Timezone element matches');
    assert.equal(dte._timeDisplayFormat, 'HH:mm DD-MMM-YYYY', 'Display format matches');
    assert.deepEqual(dte._timeInputFormats, [ 'h:mm a DD-MMM-YYYY',
                                                       'H:mm DD-MMM-YYYY',
                                                       'DD-MMM-YYYY'
                                                     ], 'Input formats match');
    assert.equal(dte._datepicker, datepickerElement, 'Date Picker element matches');
    assert.equal(dte._datepickerImage, datepickerImageElement, 'Date Picker element matches');

    dte.setSelected({ hour: 7, minute: 14, day: 18, month: 4, year: 2015, timezone: { text: 'Barry', value: 'America/Argentina/Buenos_Aires' } });
    values = getDateTimeElementValues(dte);
    assert.deepEqual(values, { datetime: '07:14 18-May-2015', timezone: 1 }, 'Selected values matches date');

    setDateTimeElementValues(dte, { datetime: '8:58 pm 8-Oct-2014', timezone: 0 });
    values = dte.getSelected();
    assert.deepEqual(values, { hour: 20, minute: 58, day: 8, month: 9, year: 2014, timezone: { text: '', value: '' } }, 'Selected matches date');

    // Test 29-Feb is valid for leap years
    setDateTimeElementValues(dte, { datetime: '8:58 pm 29-Feb-2012', timezone: 3 });
    values = dte.getSelected();
    assert.deepEqual(values, { hour: 20, minute: 58, day: 29, month: 1, year: 2012, timezone: { text: 'Brett', value: 'Pacific/Norfolk' } }, 'Selected matches date');
    
    // NOTE: The remaining invalid dates have been disabled, since moment() appears to sometimes say valid, and other times invalid
    // // Invalid dates are not, well, valid (April has 30 days)
    // setDateTimeElementValues(dte, { datetime: '8:58 pm 31-Apr-2014', timezone: 0 });
    // values = dte.getSelected();
    // assert.strictEqual(values, undefined, 'Selected is not defined');
    // // Same for 31-Feb for non-leap years)
    // setDateTimeElementValues(dte, { datetime: '8:58 pm 31-Feb-2014', timezone: 0 });
    // values = dte.getSelected();
    // assert.strictEqual(values, undefined, 'Selected is not defined');
    // // Same for 31-Feb for leap years)
    // setDateTimeElementValues(dte, { datetime: '8:58 pm 31-Feb-2012', timezone: 0 });
    // values = dte.getSelected();
    // assert.strictEqual(values, undefined, 'Selected is not defined');
    // // Test 29-Feb is NOT valid for non-leap years
    // setDateTimeElementValues(dte, { datetime: '8:58 pm 29-Feb-2013', timezone: 0 });
    // values = dte.getSelected();
    // assert.strictEqual(values, undefined, 'Selected is not defined');
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
        values,
        dte;
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
    dte = testVars.dte4;
    assert.equal(dte._locale, undefined, 'locale is not defined');
    assert.equal(dte._mode, momentTimezoneDiff.MODE_SPLIT_HOUR12, 'Mode matches');
    assert.equal(dte._errorClassName, 'mtzdError', 'Error class matches');
    assert.equal(dte._currentTime, currentTimeElement, 'Current time element matches');
    assert.equal(dte._elements.hour, hourElement, 'Hour element matches');
    assert.equal(dte._elements.minute, minuteElement, 'Minute element matches');
    assert.equal(dte._elements.ampm, ampmElement, 'AmPm element matches');
    assert.equal(dte._elements.day, dayElement, 'Day element matches');
    assert.equal(dte._elements.month, monthElement, 'Month element matches');
    assert.equal(dte._elements.year, yearElement, 'Year element matches');
    assert.equal(dte._elements.timezone, timezoneElement, 'Timezone element matches');
    assert.equal(dte._elements.datetime, undefined, 'Date/time element is not defined');
    assert.equal(dte._timeDisplayFormat, undefined, 'Display format is not defined');
    assert.equal(dte._timeInputFormats, undefined, 'Input formats is not defined');
    assert.equal(dte._datepicker, undefined, 'Date Picker element is not defined');
    assert.equal(dte._datepickerImage, undefined, 'Date Picker image element is not defined');

    dte.setSelected({ hour: 0, minute: 0, day: 1, month: 0, year: 2010, timezone: { text: '', value: '' } });
    values = getDateTimeElementValues(dte);
    assert.deepEqual(values, { hour: 0, minute: 0, ampm: 0, day: 0, month: 0, year: 0, timezone: 0 }, 'Selected values matches date');

    setDateTimeElementValues(dte, { hour: 11, minute: 59, ampm: 1, day: 30, month: 11, year: 10, timezone: 2 });
    values = dte.getSelected();
    assert.deepEqual(values, { hour: 23, minute: 59, day: 31, month: 11, year: 2020, timezone: { text: 'Japan', value: 'Japan' } }, 'Selected matches date');
});
QUnit.test('DateTimeElements5', function (assert) {
    var dateElement,
        index = 0,
        datetimeElement,
        timezoneElement,
        currentTimeElement,
        values,
        dte;
    dateElement = document.getElementById('mtzdDateSingle2');
    assert.ok(dateElement, 'Date element exists');
    datetimeElement = expectChild(assert, dateElement, index++, { tagName: 'INPUT',
                                                                  type: 'text',
                                                                  title: 'Enter the required date and time.  Supported formats are:\n' +
                                                                         '\n' +
                                                                         '  h:mm a DD-MMM-YYYY\n' +
                                                                         '  H:mm DD-MMM-YYYY\n' +
                                                                         '  DD-MMM-YYYY',
                                                                  size: 15
                                                                });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN', 
                                                textContent: ' '
                                              });
    timezoneElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT', 
                                                                  title: "Select timezone",
                                                                  options: [ { text: '',                     value: '' },
                                                                             { text: 'America/Blanc-Sablon', value: 'America/Blanc-Sablon' }
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
    dte = testVars.dte5;
    assert.equal(dte._locale, undefined, 'locale is not defined');
    assert.equal(dte._mode, momentTimezoneDiff.MODE_SINGLE, 'Mode matches');
    assert.equal(dte._errorClassName, 'mtzdError', 'Error class matches');
    assert.equal(dte._currentTime, currentTimeElement, 'Current time element matches');
    assert.equal(dte._elements.hour, undefined, 'Hour element is not defined');
    assert.equal(dte._elements.minute, undefined, 'Minute element is not defined');
    assert.equal(dte._elements.ampm, undefined, 'AmPm element is not defined');
    assert.equal(dte._elements.day, undefined, 'Day element is not defined');
    assert.equal(dte._elements.month, undefined, 'Month element is not defined');
    assert.equal(dte._elements.year, undefined, 'Year element is not defined');
    assert.equal(dte._elements.datetime, datetimeElement, 'Date/time element matches');
    assert.equal(dte._elements.timezone, timezoneElement, 'Timezone element matches');
    assert.equal(dte._timeDisplayFormat, 'HH:mm DD-MMM-YYYY', 'Display format matches');
    assert.deepEqual(dte._timeInputFormats, [ 'h:mm a DD-MMM-YYYY',
                                                       'H:mm DD-MMM-YYYY',
                                                       'DD-MMM-YYYY'
                                                     ], 'Input formats match');
    assert.equal(dte._datepicker, undefined, 'Date Picker element is not defined');
    assert.equal(dte._datepickerImage, undefined, 'Date Picker element is not defined');

    dte.setSelected({ hour: 7, minute: 14, day: 18, month: 4, year: 2015, timezone: { text: 'America/Blanc-Sablon', value: 'America/Blanc-Sablon' } });
    values = getDateTimeElementValues(dte);
    assert.deepEqual(values, { datetime: '07:14 18-May-2015', timezone: 1 }, 'Selected values matches date');

    setDateTimeElementValues(dte, { datetime: '8:58 pm 8-Oct-2014', timezone: 0 });
    values = dte.getSelected();
    assert.deepEqual(values, { hour: 20, minute: 58, day: 8, month: 9, year: 2014, timezone: { text: '', value: '' } }, 'Selected matches date');

    // Test 29-Feb is valid for leap years
    setDateTimeElementValues(dte, { datetime: '8:58 pm 29-Feb-2012', timezone: 1 });
    values = dte.getSelected();
    assert.deepEqual(values, { hour: 20, minute: 58, day: 29, month: 1, year: 2012, timezone: { text: 'America/Blanc-Sablon', value: 'America/Blanc-Sablon' } }, 'Selected matches date');
    
    // NOTE: The remaining invalid dates have been disabled, since moment() appears to sometimes say valid, and other times invalid
    // // Invalid dates are not, well, valid (April has 30 days)
    // setDateTimeElementValues(dte, { datetime: '8:58 pm 31-Apr-2014', timezone: 0 });
    // values = dte.getSelected();
    // assert.strictEqual(values, undefined, 'Selected is not defined');
    // // Same for 31-Feb for non-leap years)
    // setDateTimeElementValues(dte, { datetime: '8:58 pm 31-Feb-2014', timezone: 0 });
    // values = dte.getSelected();
    // assert.strictEqual(values, undefined, 'Selected is not defined');
    // // Same for 31-Feb for leap years)
    // setDateTimeElementValues(dte, { datetime: '8:58 pm 31-Feb-2012', timezone: 0 });
    // values = dte.getSelected();
    // assert.strictEqual(values, undefined, 'Selected is not defined');
    // // Test 29-Feb is NOT valid for non-leap years
    // setDateTimeElementValues(dte, { datetime: '8:58 pm 29-Feb-2013', timezone: 0 });
    // values = dte.getSelected();
    // assert.strictEqual(values, undefined, 'Selected is not defined');
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
    selectedTimezone = getTimezone(env && env._dateTimeElements && env._dateTimeElements._elements && env._dateTimeElements._elements.timezone);
    assert.equal(selectedTimezone.value, timezone, 'Timezone value matches timezone combo');
    assert.equal(selectedTimezone.text, name, 'Timezone text matches timezone combo');
    assert.ok(classPresentInClassName(cell.className, linkClass), 'Class name "' + linkClass + '" is present in "' + cell.className + '"');
}
function fireChangeEvent(element) {
    if (typeof document.createEvent === 'function') {
        var event = document.createEvent('HTMLEvents');
        event.initEvent('change', false, true);
        element.dispatchEvent(event);
    } else {
        element.fireEvent('onchange');
    }
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
        datepickerElement,
        datepickerImageElement,
        timezoneElement,
        currentTimeElement,
        formats,
        values,
        col,
        env,
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
    datepickerElement = expectChild(assert, dateElement, index++, { tagName: 'INPUT',
                                                                    type: 'text'
                                                                  });
    assert.ok(classPresentInClassName(datepickerElement.className, 'mtzdDatepicker'), 'Class name "mtzdDatepicker" is present in "' + datepickerElement.className + '"');
    datepickerImageElement = expectChild(assert, dateElement, index++, { tagName: 'IMG',
                                                                         className: 'mtzdDatepickerImage',
                                                                         title: "Select the date using a calendar"
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
    env = testVars.env1;
    assert.equal(env._dateTimeElements._locale, undefined, 'env dateTimeElements locale is not defined');
    assert.equal(env._dateTimeElements._mode, momentTimezoneDiff.MODE_SPLIT_HOUR12, 'Mode matches');
    assert.equal(env._dateTimeElements._errorClassName, 'mtzdError', 'Error class matches');
    assert.equal(env._dateTimeElements._currentTime, currentTimeElement, 'Current time element matches');
    assert.equal(env._dateTimeElements._elements.hour, hourElement, 'Hour element matches');
    assert.equal(env._dateTimeElements._elements.minute, minuteElement, 'Minute element matches');
    assert.equal(env._dateTimeElements._elements.ampm, ampmElement, 'AmPm element matches');
    assert.equal(env._dateTimeElements._elements.day, dayElement, 'Day element matches');
    assert.equal(env._dateTimeElements._elements.month, monthElement, 'Month element matches');
    assert.equal(env._dateTimeElements._elements.year, yearElement, 'Year element matches');
    assert.equal(env._dateTimeElements._elements.timezone, timezoneElement, 'Timezone element matches');
    assert.equal(env._dateTimeElements._elements.datetime, undefined, 'Date/time element is not defined');
    assert.equal(env._dateTimeElements._timeDisplayFormat, undefined, 'Display format is not defined');
    assert.equal(env._dateTimeElements._timeInputFormats, undefined, 'Input formats is not defined');
    assert.equal(env._dateTimeElements._datepicker, datepickerElement, 'Date Picker element matches');
    assert.equal(env._dateTimeElements._datepickerImage, datepickerImageElement, 'Date Picker image element matches');

    assert.deepEqual(env._options, defaultOptions, 'options matches default options');
    assert.deepEqual(env.getOptions(), defaultOptions, 'getOptions() matches default options');
    assert.notEqual(env._options, env.getOptions(), 'getOptions() returns a copy');
    assert.equal(env._timeElement, timeElement, 'Time element matches');

    formats = [ 'dddd', 
                'h:mm a', 
                'DD-MMM-YYYY', 
                'DIFF', 
                'sunmoon'
              ];

    index = 0;
    expectTimezone(assert, env._timezones, index++, 'US/Pacific', formats);
    expectTimezone(assert, env._timezones, index++, 'US/Eastern', formats);
    expectTimezone(assert, env._timezones, index++, 'Europe/London', formats);
    expectTimezone(assert, env._timezones, index++, 'Europe/Paris', formats);
    expectTimezone(assert, env._timezones, index++, 'Asia/Calcutta', formats);
    expectTimezone(assert, env._timezones, index++, 'Australia/Perth', formats);
    expectTimezone(assert, env._timezones, index++, 'Australia/Melbourne', formats);
    expectTimezones(assert, env._timezones, index);
    
    // 1-Sep-2014 - Australia NOT in daylight savings - US IS in daylight savings
    values = getMomentValues(env.moment);
    assert.deepEqual(values, [ 2014, 8, 1, 0, 0, 0], 'moment matches');
    assert.deepEqual(env.timezone, { value: 'Australia/Melbourne', text: 'Dino' }, 'timezone matches');
    
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
    env.update([2014, 9, 15, 14, 30, 0], 'US/Pacific', 'Fred Flintstone');

    values = getMomentValues(env.moment);
    assert.deepEqual(values, [ 2014, 9, 15, 14, 30, 0], 'moment matches');
    assert.deepEqual(env.timezone, { value: 'US/Pacific', text: 'Fred Flintstone' }, 'timezone matches');

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
    env.update([2014, 10, 15, 14, 30, 0], 'Europe/Paris', 'Wilma Flintstone');

    values = getMomentValues(env.moment);
    assert.deepEqual(values, [ 2014, 10, 15, 14, 30, 0], 'moment matches');
    assert.deepEqual(env.timezone, { value: 'Europe/Paris', text: 'Wilma Flintstone' }, 'timezone matches');

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
        verifyLink(assert, env, containerElement, index++, col, 'US/Pacific', 'Fred Flintstone', 'mtzdLink');
        verifyLink(assert, env, containerElement, index++, col, 'US/Eastern', 'Barny Rubble', 'mtzdLink');
        verifyLink(assert, env, containerElement, index++, col, 'Europe/London', 'Bamm Bamm Rubble', 'mtzdLink');
        verifyLink(assert, env, containerElement, index++, col, 'Europe/Paris', 'Wilma Flintstone', 'mtzdLink');
        verifyLink(assert, env, containerElement, index++, col, 'Asia/Calcutta', 'Betty Rubble', 'mtzdLink');
        verifyLink(assert, env, containerElement, index++, col, 'Australia/Perth', 'Pebbles Flintstone', 'mtzdLink');
        verifyLink(assert, env, containerElement, index++, col, 'Australia/Melbourne', 'Dino', 'mtzdLink');
        assert.equal(containerElement.children.length, index, 'All rows verified');
    }

    // Change the DateTimeElements and trigger a change to verify that the details have changed
    env._dateTimeElements.setSelected({ hour: 0, minute: 0, day: 1, month: 0, year: 2010, timezone: { text: 'Bamm Bamm Rubble', value: 'Europe/London' } });
    values = getDateTimeElementValues(env._dateTimeElements);
    assert.deepEqual(values, { hour: 0, minute: 0, ampm: 0, day: 0, month: 0, year: 0, timezone: 3 }, 'Selected values matches date');
    fireChangeEvent(env._dateTimeElements._elements.hour);
    
    index = 0;
    expectValues(assert, containerElement, index++, [ 'Fred Flintstone',
                                                      'Vancouver, Canada',
                                                      'US/Pacific',
                                                      'Thursday',
                                                      '4:00 pm',
                                                      '31-Dec-2009',
                                                      '8 hours behind',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Barny Rubble',
                                                      'New York, USA',
                                                      'US/Eastern',
                                                      'Thursday',
                                                      '7:00 pm',
                                                      '31-Dec-2009',
                                                      '5 hours behind',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Bamm Bamm Rubble',
                                                      'London, United Kingdom',
                                                      'Europe/London',
                                                      'Friday',
                                                      '12:00 am',
                                                      '01-Jan-2010',
                                                      '',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Wilma Flintstone',
                                                      'Paris, France',
                                                      'Europe/Paris',
                                                      'Friday',
                                                      '1:00 am',
                                                      '01-Jan-2010',
                                                      '1 hour ahead',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Betty Rubble',
                                                      'Mumbai, India',
                                                      'Asia/Calcutta',
                                                      'Friday',
                                                      '5:30 am',
                                                      '01-Jan-2010',
                                                      '5.5 hours ahead',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Pebbles Flintstone',
                                                      'Perth, Australia',
                                                      'Australia/Perth',
                                                      'Friday',
                                                      '8:00 am',
                                                      '01-Jan-2010',
                                                      '8 hours ahead',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Dino',
                                                      'Melbourne, Australia',
                                                      'Australia/Melbourne',
                                                      'Friday',
                                                      '11:00 am',
                                                      '01-Jan-2010',
                                                      '11 hours ahead',
                                                      '\u263c'
                                                    ]);

    setDateTimeElementValues(env._dateTimeElements, { hour: 11, minute: 59, ampm: 1, day: 30, month: 11, year: 10, timezone: 2 });
    values = env._dateTimeElements.getSelected();
    assert.deepEqual(values, { hour: 23, minute: 59, day: 31, month: 11, year: 2020, timezone: { text: 'Barny Rubble', value: 'US/Eastern' } }, 'Selected matches date');
    fireChangeEvent(env._dateTimeElements._elements.hour);

    index = 0;
    expectValues(assert, containerElement, index++, [ 'Fred Flintstone',
                                                      'Vancouver, Canada',
                                                      'US/Pacific',
                                                      'Thursday',
                                                      '8:59 pm',
                                                      '31-Dec-2020',
                                                      '3 hours behind',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Barny Rubble',
                                                      'New York, USA',
                                                      'US/Eastern',
                                                      'Thursday',
                                                      '11:59 pm',
                                                      '31-Dec-2020',
                                                      '',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Bamm Bamm Rubble',
                                                      'London, United Kingdom',
                                                      'Europe/London',
                                                      'Friday',
                                                      '4:59 am',
                                                      '01-Jan-2021',
                                                      '5 hours ahead',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Wilma Flintstone',
                                                      'Paris, France',
                                                      'Europe/Paris',
                                                      'Friday',
                                                      '5:59 am',
                                                      '01-Jan-2021',
                                                      '6 hours ahead',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Betty Rubble',
                                                      'Mumbai, India',
                                                      'Asia/Calcutta',
                                                      'Friday',
                                                      '10:29 am',
                                                      '01-Jan-2021',
                                                      '10.5 hours ahead',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Pebbles Flintstone',
                                                      'Perth, Australia',
                                                      'Australia/Perth',
                                                      'Friday',
                                                      '12:59 pm',
                                                      '01-Jan-2021',
                                                      '13 hours ahead',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ 'Dino',
                                                      'Melbourne, Australia',
                                                      'Australia/Melbourne',
                                                      'Friday',
                                                      '3:59 pm',
                                                      '01-Jan-2021',
                                                      '16 hours ahead',
                                                      '\u263c'
                                                    ]);
});
