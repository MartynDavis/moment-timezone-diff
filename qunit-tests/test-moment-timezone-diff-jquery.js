/*
    test-moment-timezone-diff-jquery.js
    version : 0.5.0
    authors : Martyn Davis
    license : MIT
*/
"use strict";
/*global QUnit, moment, momentTimezoneDiff, testVars*/
QUnit.test('momentTimezoneDiff', function (assert) {
    var version = '0.5.0';
    assert.equal(momentTimezoneDiff.version, version, 'Moment timezone diff version is correct');
    assert.equal(momentTimezoneDiff.MODE_TEXTBOX, 0, 'Moment timezone diff MODE_TEXTBOX is correct');
    assert.equal(momentTimezoneDiff.MODE_DROPDOWN_HOUR24, 1, 'Moment timezone diff MODE_DROPDOWN_HOUR24 is correct');
    assert.equal(momentTimezoneDiff.MODE_DROPDOWN_HOUR12, 2, 'Moment timezone diff MODE_DROPDOWN_HOUR12 is correct');
    assert.equal(momentTimezoneDiff.DATE_ORDER_DMY, 0, 'Moment timezone diff DATE_ORDER_DMY is correct');
    assert.equal(momentTimezoneDiff.DATE_ORDER_MDY, 1, 'Moment timezone diff DATE_ORDER_MDY is correct');
    assert.equal(momentTimezoneDiff.DATE_ORDER_YMD, 2, 'Moment timezone diff DATE_ORDER_YMD is correct');
    assert.equal(typeof momentTimezoneDiff.DateTimeElements, 'function', 'Moment timezone diff DateTimeElements is a function');
    assert.equal(typeof momentTimezoneDiff.Environment, 'function', 'Moment timezone diff Environment is a function');
    assert.equal(typeof momentTimezoneDiff.TimezoneDiff, 'function', 'Moment timezone diff TimezoneDiff is a function');
    assert.equal(typeof momentTimezoneDiff.getDefaultTimezone, 'function', 'Moment timezone diff getDefaultTimezone is a function');
    assert.equal(typeof momentTimezoneDiff.getOptions, 'function', 'Moment timezone diff getOptions is a function');
    assert.equal(typeof momentTimezoneDiff.setOptions, 'function', 'Moment timezone diff setOptions is a function');
    assert.equal(typeof momentTimezoneDiff.daytime, 'function', 'Moment timezone diff daytime is a function');
    assert.equal(typeof momentTimezoneDiff.createLegend, 'function', 'Moment timezone diff createLegend is a function');
    assert.equal(typeof momentTimezoneDiff.getVersionInfo, 'function', 'Moment timezone diff getVersionInfo is a function');
    assert.equal(typeof momentTimezoneDiff.displayVersionInfo, 'function', 'Moment timezone diff displayVersionInfo is a function');
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
function checkVersion(assert, element, info, options) {
    var index = 0,
        properties;
    expectChildren(assert, element, 2);
    if (options.versionIncludeLinks && info.link) {
        properties = { tagName: 'A',
                       href: info.link,
                       className: options.versionNameClass,
                       textContent: info.name
                     };
        if (options.versionLinkTarget) {
            properties.target = options.versionLinkTarget;
        }
        expectChild(assert, element, index++, properties);
    } else {
        expectChild(assert, element, index++, { tagName: 'SPAN',
                                                className: options.versionNameClass,
                                                textContent: info.name
                                              });
    }
    expectChild(assert, element, index++, { tagName: 'SPAN',
                                            className: options.versionVersionClass,
                                            textContent: info.versionNumber
                                          });
}
function checkVersionInfo(assert, id, options) {
    var version = '0.5.0',
        element = document.getElementById(id),
        versions = [ { name: 'moment-timezone-diff', link: 'https://github.com/MartynDavis/moment-timezone-diff/', versionNumber: version },
                     { name: 'moment', link: 'http://momentjs.com/', versionNumber: '2.8.3' },
                     { name: 'moment-timezone', link: 'http://momentjs.com/timezone/', versionNumber: '0.2.2' },
                     { name: 'moment-timezone-data', link: 'http://momentjs.com/timezone/', versionNumber: '2014g' }
                   ],
        childrenLength,
        index = 0,
        i;
    if (options.versionIncludejQuery) {
        versions.push({ name: 'jQuery', link: 'https://jquery.com/', versionNumber: '1.10.2' });
        versions.push({ name: 'jQuery-UI', link: 'https://jqueryui.com/', versionNumber: '1.11.1' });
    }
    if (!options.versionIncludeLinks) {
        for (i = 0; i < versions.length; i += 1) {
            delete versions[i].link;
        }
    }
    assert.deepEqual(momentTimezoneDiff.getVersionInfo(options), versions, 'Version information matches');
    childrenLength = versions.length;
    if (options.versionTitle) {
        childrenLength += 1;
    }
    expectChildren(assert, element, childrenLength);
    
    if (options.versionTitle) {
        expectChild(assert, element, index++, { tagName: 'SPAN',
                                                textContent: options.versionTitle,
                                                className: options.versionTitleClass,
                                              });
    }
    for (i = 0; i < versions.length; i += 1) {
        expectChild(assert, element, index, { tagName: 'SPAN',
                                              className: options.versionClass
                                            });
        checkVersion(assert, element.children[index], versions[i], options);
        index += 1;
    }
}
QUnit.test('versions', function (assert) {
    checkVersionInfo(assert, 'versions', { versionClass: 'mtzdVersion',
                                           versionTitle: 'Versions:',
                                           versionTitleClass: 'mtzdVersionTitle',
                                           versionNameClass: 'mtzdVersionName',
                                           versionVersionClass: 'mtzdVersionVersion',
                                           versionIncludeLinks: true,
                                           versionLinkTarget: '_blank',
                                           versionIncludejQuery: true
                                         });
    checkVersionInfo(assert, 'versionsNoTarget', { versionClass: 'mtzdVersion',
                                                   versionTitle: 'Versions:',
                                                   versionTitleClass: 'mtzdVersionTitle',
                                                   versionNameClass: 'mtzdVersionName',
                                                   versionVersionClass: 'mtzdVersionVersion',
                                                   versionIncludeLinks: true,
                                                   versionLinkTarget: '',
                                                   versionIncludejQuery: true
                                                 });
    checkVersionInfo(assert, 'versionsNoLinks', { versionClass: 'mtzdVersionNew',
                                                  versionTitle: '',
                                                  versionTitleClass: 'mtzdVersionTitleNew',
                                                  versionNameClass: 'mtzdVersionNameNew',
                                                  versionVersionClass: 'mtzdVersionVersionNew',
                                                  versionIncludeLinks: false,
                                                  versionIncludejQuery: false
                                                });
});
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
function fireChangeEvent(element) {
    if (typeof document.createEvent === 'function') {
        var event = document.createEvent('HTMLEvents');
        event.initEvent('change', false, true);
        element.dispatchEvent(event);
    } else {
        element.fireEvent('onchange');
    }
}
function setDateTimeElementValues(dte, values, fireChange) {
    var name;
    if (dte && dte._elements && values) {
        if (fireChange === undefined) {
            fireChange = true;
        }
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
        if (fireChange) {
            fireChangeEvent(dte._elements.timezone);
        }
    }
}
function createCallback(callbackData) {
    return function (selected) {
        callbackData.selected = selected;
    };
}
function resetCallbackData(array) {
    var i;
    for (i = 0; i < array.length; i += 1) {
        delete array[i].selected;
    }
}
function checkCallbackData(assert, array, expected) {
    var i;
    for (i = 0; i < array.length; i += 1) {
        assert.deepEqual(array[i].selected, expected, 'Data from "' + array[i].name + '" matches expected'); 
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
        dte,
        callbackData1 = { name: 'Callback #1' },
        callbackData2 = { name: 'Callback #2' },
        expected;
    dateElement = document.getElementById('mtzdDate12hour');
    assert.ok(dateElement, 'Date element exists');
    hourElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                              title: 'Sélectionnez les heures de la journée',
                                                              className: 'mtzdSelect',
                                                              options: makeOptions(0, 11, 2, { 0: '12' })
                                                            });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: ':',
                                                className: 'mtzdTimeDelim'
                                              });
    minuteElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                                title: "Sélectionner les minutes de l'heure",
                                                                className: 'mtzdSelect',
                                                                options: makeOptions(0, 59, 2)
                                                              });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: ' ',
                                                className: 'mtzdDelim'
                                              });
    ampmElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                              title: "Sélectionnez le matin ou l'après-midi",
                                                              className: 'mtzdSelect',
                                                              options: [ { text: 'am', value: '0'  },
                                                                         { text: 'pm', value: '1' }
                                                                       ]
                                                            });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: ' ',
                                                className: 'mtzdDelim'
                                              });
    dayElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                             title: "Choisir jour du mois",
                                                             className: 'mtzdSelect',
                                                             options: makeOptions(1, 31, 2)
                                                           });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: '-',
                                                className: 'mtzdDateDelim'
                                              });
    monthElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                               title: "Sélectionnez un mois de l'année",
                                                               className: 'mtzdSelect',
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
                                                textContent: '-',
                                                className: 'mtzdDateDelim'
                                              });
    yearElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                              title: "Sélectionnez l'année",
                                                              className: 'mtzdSelect',
                                                              options: makeOptions(2010, 2020)
                                                            });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: ' ',
                                                className: 'mtzdDelim'
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
                                                textContent: ' ',
                                                className: 'mtzdDelim'
                                              });
    timezoneElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                                  title: "Sélectionnez le fuseau horaire",
                                                                  className: 'mtzdSelect',
                                                                  options: [ { text: '',                value: '' },
                                                                             { text: 'Sebastian Roché', value: 'Europe/Paris' },
                                                                             { text: 'André Lurçat',    value: 'Canada/Newfoundland' }
                                                                           ]
                                                                });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: ' ',
                                                className: 'mtzdDelim'
                                              });
    currentTimeElement = expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                                     className: 'currentTimeFrench',
                                                                     title: "l'heure actuelle",
                                                                     textContent: "Régler l'heure actuelle"
                                                                   });
    expectChildren(assert, dateElement, index);
    dte = testVars.dte1;
    assert.equal(dte._locale, 'fr', 'Locale is "fr"');
    assert.equal(dte._mode, momentTimezoneDiff.MODE_DROPDOWN_HOUR12, 'Mode matches');
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
    assert.equal(dte._datepicker, datepickerElement, 'Date picker element matches');
    assert.equal(dte._datepickerImage, datepickerImageElement, 'Date picker image element matches');

    assert.equal(dte.getTimezoneName(''), '', 'Timezone name matches');
    assert.equal(dte.getTimezoneName('Europe/Paris'), 'Sebastian Roché', 'Timezone name matches');
    assert.equal(dte.getTimezoneName('Canada/Newfoundland'), 'André Lurçat', 'Timezone name matches');
    assert.equal(dte.getTimezoneName('I DO NOT EXIST'), undefined, 'Invalid timezone returns undefined');

    dte.registerCallback(createCallback(callbackData1));
    dte.registerCallback(createCallback(callbackData2));

    resetCallbackData([ callbackData1, callbackData2 ]);
    setDateTimeElementValues(dte, { hour: 5, minute: 42, ampm: 1, day: 5, month: 7, year: 3, timezone: 0 });
    expected = { hour: 17, minute: 42, day: 6, month: 7, year: 2013, timezone: { text: '', value: '' } };
    values = dte.getSelected();
    assert.deepEqual(values, expected, 'Selected matches expected');
    checkCallbackData(assert, [ callbackData1, callbackData2 ], expected);

    dte.setSelected({ hour: 6, minute: 13, day: 17, month: 3, year: 2014, timezone: { text: 'André Lurçat', value: 'Canada/Newfoundland' } });
    values = getDateTimeElementValues(dte);
    assert.deepEqual(values, { hour: 6, minute: 13, ampm: 0, day: 16, month: 3, year: 4, timezone: 2 }, 'Selected values matches date');

    // Cycle through hour/ampm values
    for (index = 0; index < 24; index += 1) {
        setDateTimeElementValues(dte, { hour: (index < 12) ? index : index - 12, minute: 42, ampm: (index < 12) ? 0 : 1, day: 5, month: 7, year: 3, timezone: 0 });
        expected = { hour: index, minute: 42, day: 6, month: 7, year: 2013, timezone: { text: '', value: '' } };
        values = dte.getSelected();
        assert.deepEqual(values, expected, 'Selected matches expected');
        checkCallbackData(assert, [ callbackData1, callbackData2 ], expected);
    }
    // Cycle through minute values
    for (index = 0; index < 60; index += 1) {
        setDateTimeElementValues(dte, { hour: 3, minute: index, ampm: 1, day: 5, month: 7, year: 3, timezone: 0 });
        expected = { hour: 15, minute: index, day: 6, month: 7, year: 2013, timezone: { text: '', value: '' } };
        values = dte.getSelected();
        assert.deepEqual(values, expected, 'Selected matches expected');
        checkCallbackData(assert, [ callbackData1, callbackData2 ], expected);
    }
    // Cycle through day values (note 31 daay month selected)
    for (index = 0; index < 31; index += 1) {
        setDateTimeElementValues(dte, { hour: 3, minute: 13, ampm: 1, day: index, month: 7, year: 3, timezone: 0 });
        expected = { hour: 15, minute: 13, day: index + 1, month: 7, year: 2013, timezone: { text: '', value: '' } };
        values = dte.getSelected();
        assert.deepEqual(values, expected, 'Selected matches expected');
        checkCallbackData(assert, [ callbackData1, callbackData2 ], expected);
    }
    // Cycle through month values
    for (index = 0; index < 12; index += 1) {
        setDateTimeElementValues(dte, { hour: 3, minute: 13, ampm: 1, day: 13, month: index, year: 3, timezone: 0 });
        expected = { hour: 15, minute: 13, day: 14, month: index, year: 2013, timezone: { text: '', value: '' } };
        values = dte.getSelected();
        assert.deepEqual(values, expected, 'Selected matches expected');
        checkCallbackData(assert, [ callbackData1, callbackData2 ], expected);
    }
    // Cycle through year values
    for (index = 0; index < (2020 - 2010 + 1); index += 1) {
        setDateTimeElementValues(dte, { hour: 3, minute: 13, ampm: 1, day: 13, month: 4, year: index, timezone: 0 });
        expected = { hour: 15, minute: 13, day: 14, month: 4, year: 2010 + index, timezone: { text: '', value: '' } };
        values = dte.getSelected();
        assert.deepEqual(values, expected, 'Selected matches expected');
        checkCallbackData(assert, [ callbackData1, callbackData2 ], expected);
    }
    // cycle through timezones
    timezones = [ { text: '',                value: '' },
                  { text: 'Sebastian Roché', value: 'Europe/Paris' },
                  { text: 'André Lurçat',    value: 'Canada/Newfoundland' }
                ];
    for (index = 0; index < timezones.length; index += 1) {
        setDateTimeElementValues(dte, { hour: 3, minute: 13, ampm: 1, day: 13, month: 4, year: 3, timezone: index });
        expected = { hour: 15, minute: 13, day: 14, month: 4, year: 2013, timezone: timezones[index] };
        values = dte.getSelected();
        assert.deepEqual(values, expected, 'Selected matches expected');
        checkCallbackData(assert, [ callbackData1, callbackData2 ], expected);
    }
    // Test month rollover for months which have less than 31 days (31-Apr => 1-May)
    setDateTimeElementValues(dte, { hour: 5, minute: 42, ampm: 1, day: 30, month: 3, year: 3, timezone: 0 });
    expected = { hour: 17, minute: 42, day: 1, month: 4, year: 2013, timezone: { text: '', value: '' } };
    values = dte.getSelected();
    assert.deepEqual(values, expected, 'Selected matches expected');
    checkCallbackData(assert, [ callbackData1, callbackData2 ], expected);
    // Test month rollover for months which have less than 31 days (31-Feb => 3-Mar for non-leap years)
    setDateTimeElementValues(dte, { hour: 5, minute: 42, ampm: 1, day: 30, month: 1, year: 3, timezone: 0 });
    expected = { hour: 17, minute: 42, day: 3, month: 2, year: 2013, timezone: { text: '', value: '' } };
    values = dte.getSelected();
    assert.deepEqual(values, expected, 'Selected matches expected');
    checkCallbackData(assert, [ callbackData1, callbackData2 ], expected);
    // Test month rollover for months which have less than 31 days (31-Feb => 2-Mar for leap years)
    setDateTimeElementValues(dte, { hour: 5, minute: 42, ampm: 1, day: 30, month: 1, year: 2, timezone: 0 });
    expected = { hour: 17, minute: 42, day: 2, month: 2, year: 2012, timezone: { text: '', value: '' } };
    values = dte.getSelected();
    assert.deepEqual(values, expected, 'Selected matches expected');
    checkCallbackData(assert, [ callbackData1, callbackData2 ], expected);
    // Test 29-Feb is valid for leap years
    setDateTimeElementValues(dte, { hour: 5, minute: 42, ampm: 1, day: 28, month: 1, year: 2, timezone: 0 });
    expected = { hour: 17, minute: 42, day: 29, month: 1, year: 2012, timezone: { text: '', value: '' } };
    values = dte.getSelected();
    assert.deepEqual(values, expected, 'Selected matches expected');
    checkCallbackData(assert, [ callbackData1, callbackData2 ], expected);
    // Test 29-Feb rolls over for non-leap years
    setDateTimeElementValues(dte, { hour: 5, minute: 42, ampm: 1, day: 28, month: 1, year: 4, timezone: 0 });
    expected = { hour: 17, minute: 42, day: 1, month: 2, year: 2014, timezone: { text: '', value: '' } };
    values = dte.getSelected();
    assert.deepEqual(values, expected, 'Selected matches expected');
    checkCallbackData(assert, [ callbackData1, callbackData2 ], expected);
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
                                                              className: 'mtzdSelect',
                                                              options: makeOptions(0, 23, 2)
                                                            });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: ':',
                                                className: 'mtzdTimeDelim'
                                              });
    minuteElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                                title: "Select minute of the hour",
                                                                className: 'mtzdSelect',
                                                                options: makeOptions(0, 59, 2)
                                                              });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: ' ',
                                                className: 'mtzdDelim'
                                              });
    monthElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                               title: "Select month of the year",
                                                               className: 'mtzdSelect',
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
                                                textContent: '-',
                                                className: 'mtzdDateDelim'
                                              });
    dayElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                             title: "Select day of the month",
                                                             className: 'mtzdSelect',
                                                             options: makeOptions(1, 31, 2)
                                                           });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: '-',
                                                className: 'mtzdDateDelim'
                                              });
    yearElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                              title: "Select year",
                                                              className: 'mtzdSelect',
                                                              options: makeOptions(2010, 2020)
                                                            });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: ' ',
                                                className: 'mtzdDelim'
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
                                                textContent: ' ',
                                                className: 'mtzdDelim'
                                              });
    timezoneElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                                  title: "Select timezone",
                                                                  className: 'mtzdSelect',
                                                                  options: [ { text: '',                value: '' },
                                                                             { text: 'US/Eastern',      value: 'US/Eastern' },
                                                                             { text: 'Australia/Perth', value: 'Australia/Perth' }
                                                                           ]
                                                                });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: ' ',
                                                className: 'mtzdDelim'
                                              });
    currentTimeElement = expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                                     className: 'mtzdCurrentTime',
                                                                     title: 'Current Time',
                                                                     textContent: '\u25d4'
                                                                   });
    expectChildren(assert, dateElement, index);
    dte = testVars.dte2;
    assert.equal(dte._locale, undefined, 'locale is not defined');
    assert.equal(dte._mode, momentTimezoneDiff.MODE_DROPDOWN_HOUR24, 'Mode matches');
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
    assert.equal(dte._datepicker, datepickerElement, 'Date picker element matches');
    assert.equal(dte._datepickerImage, datepickerImageElement, 'Date picker image element matches');

    assert.equal(dte.getTimezoneName(''), '', 'Timezone name matches');
    assert.equal(dte.getTimezoneName('US/Eastern'), 'US/Eastern', 'Timezone name matches');
    assert.equal(dte.getTimezoneName('Australia/Perth'), 'Australia/Perth', 'Timezone name matches');
    assert.equal(dte.getTimezoneName('I DO NOT EXIST'), undefined, 'Invalid timezone returns undefined');

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
    setDateTimeElementValues(dte, { hour: 5, minute: 42, day: 28, month: 1, year: 4, timezone: 0 });
    values = dte.getSelected();
    assert.deepEqual(values, { hour: 5, minute: 42, day: 1, month: 2, year: 2014, timezone: { text: '', value: '' } }, 'Selected matches date');
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
                                                                  className: 'mtzdInput',
                                                                  title: 'Enter the required date and time.  Supported formats are:\n' +
                                                                         '\n' +
                                                                         '  h:mm a D-MMM-YYYY\n' +
                                                                         '  H:mm D-MMM-YYYY',
                                                                  size: 18
                                                                });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: ' ',
                                                className: 'mtzdDelim'
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
                                                textContent: ' ',
                                                className: 'mtzdDelim'
                                              });
    timezoneElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                                  title: "Select timezone",
                                                                  className: 'mtzdSelect',
                                                                  options: [ { text: '',      value: '' },
                                                                             { text: 'Barry', value: 'America/Argentina/Buenos_Aires' },
                                                                             { text: 'Bruce', value: 'Europe/Budapest' },
                                                                             { text: 'Brett', value: 'Pacific/Norfolk' }
                                                                           ]
                                                                });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: ' ',
                                                className: 'mtzdDelim'
                                              });
    currentTimeElement = expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                                     className: 'mtzdCurrentTime',
                                                                     title: 'Current Time',
                                                                     textContent: '\u25d4'
                                                                   });
    expectChildren(assert, dateElement, index);
    dte = testVars.dte3;
    assert.equal(dte._locale, undefined, 'locale is not defined');
    assert.equal(dte._mode, momentTimezoneDiff.MODE_TEXTBOX, 'Mode matches');
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
    assert.equal(dte._timeDisplayFormat, 'h:mm a D-MMM-YYYY', 'Display format matches');
    assert.deepEqual(dte._timeInputFormats, [ 'h:mm a D-MMM-YYYY',
                                              'H:mm D-MMM-YYYY'
                                            ], 'Input formats match');
    assert.equal(dte._datepicker, datepickerElement, 'Date picker element matches');
    assert.equal(dte._datepickerImage, datepickerImageElement, 'Date picker element matches');

    assert.equal(dte.getTimezoneName(''), '', 'Timezone name matches');
    assert.equal(dte.getTimezoneName('America/Argentina/Buenos_Aires'), 'Barry', 'Timezone name matches');
    assert.equal(dte.getTimezoneName('Europe/Budapest'), 'Bruce', 'Timezone name matches');
    assert.equal(dte.getTimezoneName('Pacific/Norfolk'), 'Brett', 'Timezone name matches');
    assert.equal(dte.getTimezoneName('I DO NOT EXIST'), undefined, 'Invalid timezone returns undefined');

    dte.setSelected({ hour: 7, minute: 14, day: 18, month: 4, year: 2015, timezone: { text: 'Barry', value: 'America/Argentina/Buenos_Aires' } });
    values = getDateTimeElementValues(dte);
    assert.deepEqual(values, { datetime: '7:14 am 18-May-2015', timezone: 1 }, 'Selected values matches date');

    setDateTimeElementValues(dte, { datetime: '8:58 pm 8-Oct-2014', timezone: 0 });
    values = dte.getSelected();
    assert.deepEqual(values, { hour: 20, minute: 58, day: 8, month: 9, year: 2014, timezone: { text: '', value: '' } }, 'Selected matches date');

    // Test 29-Feb is valid for leap years
    setDateTimeElementValues(dte, { datetime: '8:58 pm 29-Feb-2012', timezone: 3 });
    values = dte.getSelected();
    assert.deepEqual(values, { hour: 20, minute: 58, day: 29, month: 1, year: 2012, timezone: { text: 'Brett', value: 'Pacific/Norfolk' } }, 'Selected matches date');
    
    // Invalid dates are not, well, valid (April has 30 days)
    setDateTimeElementValues(dte, { datetime: '8:58 pm 31-Apr-2014', timezone: 0 });
    values = dte.getSelected();
    assert.strictEqual(values, undefined, 'Selected is not defined');
    // Same for 31-Feb for non-leap years)
    setDateTimeElementValues(dte, { datetime: '8:58 pm 31-Feb-2014', timezone: 0 });
    values = dte.getSelected();
    assert.strictEqual(values, undefined, 'Selected is not defined');
    // Same for 31-Feb for leap years)
    setDateTimeElementValues(dte, { datetime: '8:58 pm 31-Feb-2012', timezone: 0 });
    values = dte.getSelected();
    assert.strictEqual(values, undefined, 'Selected is not defined');
    // Test 29-Feb is NOT valid for non-leap years
    setDateTimeElementValues(dte, { datetime: '8:58 pm 29-Feb-2013', timezone: 0 });
    values = dte.getSelected();
    assert.strictEqual(values, undefined, 'Selected is not defined');
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
                                                              className: 'mtzdSelect',
                                                              options: makeOptions(0, 11, 2, { 0: '12' })
                                                            });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: ':',
                                                className: 'mtzdTimeDelim'
                                              });
    minuteElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                                title: "Select minute of the hour",
                                                                className: 'mtzdSelect',
                                                                options: makeOptions(0, 59, 2)
                                                              });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: ' ',
                                                className: 'mtzdDelim'
                                              });
    ampmElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                              title: "Select morning or afternoon",
                                                              className: 'mtzdSelect',
                                                              options: [ { text: 'am', value: '0'  },
                                                                         { text: 'pm', value: '1' }
                                                                       ]
                                                            });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: ' ',
                                                className: 'mtzdDelim'
                                              });
    yearElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                              title: "Select year",
                                                              className: 'mtzdSelect',
                                                              options: makeOptions(2010, 2020)
                                                            });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: '-',
                                                className: 'mtzdDateDelim'
                                              });
    monthElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                               title: "Select month of the year",
                                                               className: 'mtzdSelect',
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
                                                textContent: '-',
                                                className: 'mtzdDateDelim'
                                              });
    dayElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                             title: "Select day of the month",
                                                             className: 'mtzdSelect',
                                                             options: makeOptions(1, 31, 2)
                                                           });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: ' ',
                                                className: 'mtzdDelim'
                                              });
    timezoneElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                                  title: "Select timezone",
                                                                  className: 'mtzdSelect',
                                                                  options: [ { text: '',              value: '' },
                                                                             { text: 'Europe/London', value: 'Europe/London' },
                                                                             { text: 'Japan',         value: 'Japan' }
                                                                           ]
                                                                });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: ' ',
                                                className: 'mtzdDelim'
                                              });
    currentTimeElement = expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                                     className: 'mtzdCurrentTime',
                                                                     title: 'Current Time',
                                                                     textContent: '\u25d4'
                                                                   });
    expectChildren(assert, dateElement, index);
    dte = testVars.dte4;
    assert.equal(dte._locale, undefined, 'locale is not defined');
    assert.equal(dte._mode, momentTimezoneDiff.MODE_DROPDOWN_HOUR12, 'Mode matches');
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
    assert.equal(dte._datepicker, undefined, 'Date picker element is not defined');
    assert.equal(dte._datepickerImage, undefined, 'Date picker image element is not defined');

    assert.equal(dte.getTimezoneName(''), '', 'Timezone name matches');
    assert.equal(dte.getTimezoneName('Europe/London'), 'Europe/London', 'Timezone name matches');
    assert.equal(dte.getTimezoneName('Japan'), 'Japan', 'Timezone name matches');
    assert.equal(dte.getTimezoneName('I DO NOT EXIST'), undefined, 'Invalid timezone returns undefined');

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
        values,
        dte;
    dateElement = document.getElementById('mtzdDateSingle2');
    assert.ok(dateElement, 'Date element exists');
    datetimeElement = expectChild(assert, dateElement, index++, { tagName: 'INPUT',
                                                                  type: 'text',
                                                                  className: 'mtzdInput',
                                                                  title: 'Enter the required date and time.  Supported formats are:\n' +
                                                                         '\n' +
                                                                         '  h:mm a D-MMM-YYYY\n' +
                                                                         '  H:mm D-MMM-YYYY',
                                                                  size: 18
                                                                });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: ' ',
                                                className: 'mtzdDelim'
                                              });
    timezoneElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                                  title: "Select timezone",
                                                                  className: 'mtzdSelect',
                                                                  options: [ { text: '',                     value: '' },
                                                                             { text: 'America/Blanc-Sablon', value: 'America/Blanc-Sablon' }
                                                                           ]
                                                                });
    expectChildren(assert, dateElement, index);
    dte = testVars.dte5;
    assert.equal(dte._locale, undefined, 'locale is not defined');
    assert.equal(dte._mode, momentTimezoneDiff.MODE_TEXTBOX, 'Mode matches');
    assert.equal(dte._errorClassName, 'mtzdError', 'Error class matches');
    assert.equal(dte._currentTime, undefined, 'Current time element is not defined');
    assert.equal(dte._elements.hour, undefined, 'Hour element is not defined');
    assert.equal(dte._elements.minute, undefined, 'Minute element is not defined');
    assert.equal(dte._elements.ampm, undefined, 'AmPm element is not defined');
    assert.equal(dte._elements.day, undefined, 'Day element is not defined');
    assert.equal(dte._elements.month, undefined, 'Month element is not defined');
    assert.equal(dte._elements.year, undefined, 'Year element is not defined');
    assert.equal(dte._elements.datetime, datetimeElement, 'Date/time element matches');
    assert.equal(dte._elements.timezone, timezoneElement, 'Timezone element matches');
    assert.equal(dte._timeDisplayFormat, 'h:mm a D-MMM-YYYY', 'Display format matches');
    assert.deepEqual(dte._timeInputFormats, [ 'h:mm a D-MMM-YYYY',
                                              'H:mm D-MMM-YYYY'
                                            ], 'Input formats match');
    assert.equal(dte._datepicker, undefined, 'Date Picker element is not defined');
    assert.equal(dte._datepickerImage, undefined, 'Date Picker element is not defined');

    dte.setSelected({ hour: 7, minute: 14, day: 18, month: 4, year: 2015, timezone: { text: 'America/Blanc-Sablon', value: 'America/Blanc-Sablon' } });
    values = getDateTimeElementValues(dte);
    assert.deepEqual(values, { datetime: '7:14 am 18-May-2015', timezone: 1 }, 'Selected values matches date');

    setDateTimeElementValues(dte, { datetime: '8:58 pm 8-Oct-2014', timezone: 0 });
    values = dte.getSelected();
    assert.deepEqual(values, { hour: 20, minute: 58, day: 8, month: 9, year: 2014, timezone: { text: '', value: '' } }, 'Selected matches date');

    // Test 29-Feb is valid for leap years
    setDateTimeElementValues(dte, { datetime: '8:58 pm 29-Feb-2012', timezone: 1 });
    values = dte.getSelected();
    assert.deepEqual(values, { hour: 20, minute: 58, day: 29, month: 1, year: 2012, timezone: { text: 'America/Blanc-Sablon', value: 'America/Blanc-Sablon' } }, 'Selected matches date');
    
    // Invalid dates are not, well, valid (April has 30 days)
    setDateTimeElementValues(dte, { datetime: '8:58 pm 31-Apr-2014', timezone: 0 });
    values = dte.getSelected();
    assert.strictEqual(values, undefined, 'Selected is not defined');
    // Same for 31-Feb for non-leap years)
    setDateTimeElementValues(dte, { datetime: '8:58 pm 31-Feb-2014', timezone: 0 });
    values = dte.getSelected();
    assert.strictEqual(values, undefined, 'Selected is not defined');
    // Same for 31-Feb for leap years)
    setDateTimeElementValues(dte, { datetime: '8:58 pm 31-Feb-2012', timezone: 0 });
    values = dte.getSelected();
    assert.strictEqual(values, undefined, 'Selected is not defined');
    // Test 29-Feb is NOT valid for non-leap years
    setDateTimeElementValues(dte, { datetime: '8:58 pm 29-Feb-2013', timezone: 0 });
    values = dte.getSelected();
    assert.strictEqual(values, undefined, 'Selected is not defined');
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
        prop,
        i;
    assert.ok(containerElement && containerElement.children, 'Container exists and contains children');
    child = containerElement.children[index];
    assert.ok(child && child.children, 'Child exists and contains children');
    assert.equal(child.children.length, values.length, 'Child contains required number of children');
    for (i = 0; i < values.length; i += 1) {
        if (typeof values[i] === 'string') {
            assert.equal(child.children[i].textContent, values[i], 'Value matches');
        } else if (typeof values[i] === 'object') {
            for (prop in values[i]) {
                if (values[i].hasOwnProperty(prop)) {
                    assert.equal(child.children[i][prop], values[i][prop], 'Property "' + prop + '" value matches');
                }
            }
        }
    }
}
function expectLegend(assert, legendElement, first, second, breakPresent, legendClass, legendBreakClass) {
    var index = 0;
    assert.ok(legendElement && legendElement.children, 'Legend exists and has children');
    assert.equal(legendElement.children.length, 3, 'Legend has required number of children');
    assert.equal(legendElement.children[index].tagName, 'SPAN', 'First child is a SPAN');
    assert.equal(legendElement.children[index].textContent, first, 'Child has required text');
    assert.equal(legendElement.children[index].className, legendClass || 'mtzdLegend', 'Child has required class');
    index ++;
    if (breakPresent) {
        assert.equal(legendElement.children[index].tagName, 'BR', 'Next child is a BR');
    } else {
        assert.equal(legendElement.children[index].tagName, 'SPAN', 'Next child is a SPAN');
        assert.equal(legendElement.children[index].textContent, ' ', 'Child has required text');
    }
    assert.equal(legendElement.children[index].className, legendBreakClass || 'mtzdLegendBreak', 'Next child has required class');
    index ++;
    assert.equal(legendElement.children[index].tagName, 'SPAN', 'Next child is a SPAN');
    assert.equal(legendElement.children[index].textContent, second, 'Child has required text');
    assert.equal(legendElement.children[index].className, legendClass || 'mtzdLegend', 'Child has required class');
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
QUnit.test('Environment1', function (assert) {
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
                           daytime: '\u263c',  // Unicode white sun with rays
                           nighttime: '\u263e', // Unicode last quarter moon
                           legendFormat: 'h:mm a',
                           legendBreak: false,
                           legendDash: ' - ',
                           legendSeparator: ' .. ',
                           timeFormat: 'dddd h:mm a DD-MMM-YYYY',
                           timeShowTimezoneName: false,
                           defaultTimezone: momentTimezoneDiff.getDefaultTimezone(),
                           versionClass: 'mtzdVersion',
                           versionTitle: 'Versions:',
                           versionTitleClass: 'mtzdVersionTitle',
                           versionNameClass: 'mtzdVersionName',
                           versionVersionClass: 'mtzdVersionVersion',
                           versionIncludeLinks: true,
                           versionLinkTarget: '_blank',
                           versionIncludejQuery: true
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
                                                              className: 'mtzdSelect',
                                                              options: makeOptions(0, 11, 2, { 0: '12' })
                                                            });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: ':',
                                                className: 'mtzdTimeDelim'
                                              });
    minuteElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                                title: "Select minute of the hour",
                                                                className: 'mtzdSelect',
                                                                options: makeOptions(0, 59, 2)
                                                              });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: ' ',
                                                className: 'mtzdDelim'
                                              });
    ampmElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                              title: "Select morning or afternoon",
                                                              className: 'mtzdSelect',
                                                              options: [ { text: 'am', value: '0'  },
                                                                         { text: 'pm', value: '1' }
                                                                       ]
                                                            });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: ' ',
                                                className: 'mtzdDelim'
                                              });
    dayElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                             title: "Select day of the month",
                                                             className: 'mtzdSelect',
                                                             options: makeOptions(1, 31, 2)
                                                           });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: '-',
                                                className: 'mtzdDateDelim'
                                              });
    monthElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                               title: "Select month of the year",
                                                               className: 'mtzdSelect',
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
                                                textContent: '-',
                                                className: 'mtzdDateDelim'
                                              });
    yearElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                              title: "Select year",
                                                              className: 'mtzdSelect',
                                                              options: makeOptions(2010, 2020)
                                                            });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: ' ',
                                                className: 'mtzdDelim'
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
                                                textContent: ' ',
                                                className: 'mtzdDelim'
                                              });
    timezoneElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                                  title: "Select timezone",
                                                                  className: 'mtzdSelect',
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
                                                textContent: ' ',
                                                className: 'mtzdDelim'
                                              });
    currentTimeElement = expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                                     className: 'mtzdCurrentTime',
                                                                     title: 'Current Time',
                                                                     textContent: '\u25d4'
                                                                   });
    expectChildren(assert, dateElement, index);
    env = testVars.env1;
    assert.equal(env._dateTimeElements._locale, undefined, 'env dateTimeElements locale is not defined');
    assert.equal(env._dateTimeElements._mode, momentTimezoneDiff.MODE_DROPDOWN_HOUR12, 'Mode matches');
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

    assert.equal(env._dateTimeElements.getTimezoneName(''), '', 'Timezone name matches');
    assert.equal(env._dateTimeElements.getTimezoneName('US/Pacific'), 'Fred Flintstone', 'Timezone name matches');
    assert.equal(env._dateTimeElements.getTimezoneName('US/Eastern'), 'Barny Rubble', 'Timezone name matches');
    assert.equal(env._dateTimeElements.getTimezoneName('Europe/London'), 'Bamm Bamm Rubble', 'Timezone name matches');
    assert.equal(env._dateTimeElements.getTimezoneName('Europe/Paris'), 'Wilma Flintstone', 'Timezone name matches');
    assert.equal(env._dateTimeElements.getTimezoneName('Asia/Calcutta'), 'Betty Rubble', 'Timezone name matches');
    assert.equal(env._dateTimeElements.getTimezoneName('Australia/Perth'), 'Pebbles Flintstone', 'Timezone name matches');
    assert.equal(env._dateTimeElements.getTimezoneName('Australia/Melbourne'), 'Dino', 'Timezone name matches');
    assert.equal(env._dateTimeElements.getTimezoneName('I DO NOT EXIST'), undefined, 'Invalid timezone returns undefined');

    assert.deepEqual(env._options, defaultOptions, 'options matches default options');
    assert.deepEqual(env.getOptions(), defaultOptions, 'getOptions() matches default options');
    assert.notEqual(env._options, env.getOptions(), 'getOptions() returns a copy');
    assert.equal(env._timeElement, timeElement, 'Time element matches');
    formats = [ 'dddd',
                'h:mm a',
                'DD-MMM-YYYY',
                'DIFF',
                'daynight'
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
    expectValues(assert, containerElement, index++, [ { textContent: 'Fred Flintstone', title: 'Vancouver, Canada\nUS/Pacific' },
                                                  'Vancouver, Canada',
                                                  'US/Pacific',
                                                  'Sunday',
                                                  '7:00 am',
                                                  '31-Aug-2014',
                                                  '17 hours behind',
                                                  '\u263c'
                                                ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Barny Rubble', title: 'New York, USA\nUS/Eastern' },
                                                  'New York, USA',
                                                  'US/Eastern',
                                                  'Sunday',
                                                  '10:00 am',
                                                  '31-Aug-2014',
                                                  '14 hours behind',
                                                  '\u263c'
                                                ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Bamm Bamm Rubble', title: 'London, United Kingdom\nEurope/London' },
                                                      'London, United Kingdom',
                                                      'Europe/London',
                                                      'Sunday',
                                                      '3:00 pm',
                                                      '31-Aug-2014',
                                                      '9 hours behind',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Wilma Flintstone', title: 'Paris, France\nEurope/Paris' },
                                                      'Paris, France',
                                                      'Europe/Paris',
                                                      'Sunday',
                                                      '4:00 pm',
                                                      '31-Aug-2014',
                                                      '8 hours behind',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Betty Rubble', title: 'Mumbai, India\nAsia/Calcutta' },
                                                      'Mumbai, India',
                                                      'Asia/Calcutta',
                                                      'Sunday',
                                                      '7:30 pm',
                                                      '31-Aug-2014',
                                                      '4.5 hours behind',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Pebbles Flintstone', title: 'Perth, Australia\nAustralia/Perth' },
                                                      'Perth, Australia',
                                                      'Australia/Perth',
                                                      'Sunday',
                                                      '10:00 pm',
                                                      '31-Aug-2014',
                                                      '2 hours behind',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Dino', title: 'Melbourne, Australia\nAustralia/Melbourne' },
                                                      'Melbourne, Australia',
                                                      'Australia/Melbourne',
                                                      'Monday',
                                                      '12:00 am',
                                                      '01-Sep-2014',
                                                      '',
                                                      '\u263e'
                                                    ]);
    assert.equal(timeElement.textContent, 'Monday 12:00 am 01-Sep-2014 (Australia/Melbourne)', 'Time value matches');
    expectLegend(assert, legendElement, '\u263c - 6:00 am .. 7:59 pm', '\u263e - 8:00 pm .. 5:59 am', false);
    // 15-Oct-2014 - Australia IS in daylight savings - US IS in daylight savings
    env.update([2014, 9, 15, 14, 30, 0], 'US/Pacific', 'Fred Flintstone');
    values = getMomentValues(env.moment);
    assert.deepEqual(values, [ 2014, 9, 15, 14, 30, 0], 'moment matches');
    assert.deepEqual(env.timezone, { value: 'US/Pacific', text: 'Fred Flintstone' }, 'timezone matches');
    env.update([2014, 9, 15, 14, 30, 0], 'Australia/Melbourne');
    values = getMomentValues(env.moment);
    assert.deepEqual(values, [ 2014, 9, 15, 14, 30, 0], 'moment matches');
    assert.deepEqual(env.timezone, { value: 'Australia/Melbourne', text: 'Dino' }, 'timezone matches');
    env.update([2014, 9, 15, 14, 30, 0], 'US/Pacific');
    values = getMomentValues(env.moment);
    assert.deepEqual(values, [ 2014, 9, 15, 14, 30, 0], 'moment matches');
    assert.deepEqual(env.timezone, { value: 'US/Pacific', text: 'Fred Flintstone' }, 'timezone matches');
    index = 0;
    expectValues(assert, containerElement, index++, [ { textContent: 'Fred Flintstone', title: 'Vancouver, Canada\nUS/Pacific' },
                                                      'Vancouver, Canada',
                                                      'US/Pacific',
                                                      'Wednesday',
                                                      '2:30 pm',
                                                      '15-Oct-2014',
                                                      '',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Barny Rubble', title: 'New York, USA\nUS/Eastern' },
                                                      'New York, USA',
                                                      'US/Eastern',
                                                      'Wednesday',
                                                      '5:30 pm',
                                                      '15-Oct-2014',
                                                      '3 hours ahead',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Bamm Bamm Rubble', title: 'London, United Kingdom\nEurope/London' },
                                                      'London, United Kingdom',
                                                      'Europe/London',
                                                      'Wednesday',
                                                      '10:30 pm',
                                                      '15-Oct-2014',
                                                      '8 hours ahead',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Wilma Flintstone', title: 'Paris, France\nEurope/Paris' },
                                                      'Paris, France',
                                                      'Europe/Paris',
                                                      'Wednesday',
                                                      '11:30 pm',
                                                      '15-Oct-2014',
                                                      '9 hours ahead',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Betty Rubble', title: 'Mumbai, India\nAsia/Calcutta' },
                                                      'Mumbai, India',
                                                      'Asia/Calcutta',
                                                      'Thursday',
                                                      '3:00 am',
                                                      '16-Oct-2014',
                                                      '12.5 hours ahead',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Pebbles Flintstone', title: 'Perth, Australia\nAustralia/Perth' },
                                                      'Perth, Australia',
                                                      'Australia/Perth',
                                                      'Thursday',
                                                      '5:30 am',
                                                      '16-Oct-2014',
                                                      '15 hours ahead',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Dino', title: 'Melbourne, Australia\nAustralia/Melbourne' },
                                                      'Melbourne, Australia',
                                                      'Australia/Melbourne',
                                                      'Thursday',
                                                      '8:30 am',
                                                      '16-Oct-2014',
                                                      '18 hours ahead',
                                                      '\u263c'
                                                    ]);
    assert.equal(timeElement.textContent, 'Wednesday 2:30 pm 15-Oct-2014 (US/Pacific)', 'Time value matches');
    expectLegend(assert, legendElement, '\u263c - 6:00 am .. 7:59 pm', '\u263e - 8:00 pm .. 5:59 am', false);
    // 15-Nov-2014 - Australia IS in daylight savings - US NOT in daylight savings
    env.update([2014, 10, 15, 14, 30, 0], 'Europe/Paris', 'Wilma Flintstone');
    values = getMomentValues(env.moment);
    assert.deepEqual(values, [ 2014, 10, 15, 14, 30, 0], 'moment matches');
    assert.deepEqual(env.timezone, { value: 'Europe/Paris', text: 'Wilma Flintstone' }, 'timezone matches');
    env.update([2014, 9, 15, 14, 30, 0], 'Australia/Melbourne');
    values = getMomentValues(env.moment);
    assert.deepEqual(values, [ 2014, 9, 15, 14, 30, 0], 'moment matches');
    assert.deepEqual(env.timezone, { value: 'Australia/Melbourne', text: 'Dino' }, 'timezone matches');
    env.update([2014, 10, 15, 14, 30, 0], 'Europe/Paris');
    values = getMomentValues(env.moment);
    assert.deepEqual(values, [ 2014, 10, 15, 14, 30, 0], 'moment matches');
    assert.deepEqual(env.timezone, { value: 'Europe/Paris', text: 'Wilma Flintstone' }, 'timezone matches');
    index = 0;
    expectValues(assert, containerElement, index++, [ { textContent: 'Fred Flintstone', title: 'Vancouver, Canada\nUS/Pacific' },
                                                      'Vancouver, Canada',
                                                      'US/Pacific',
                                                      'Saturday',
                                                      '5:30 am',
                                                      '15-Nov-2014',
                                                      '9 hours behind',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Barny Rubble', title: 'New York, USA\nUS/Eastern' },
                                                      'New York, USA',
                                                      'US/Eastern',
                                                      'Saturday',
                                                      '8:30 am',
                                                      '15-Nov-2014',
                                                      '6 hours behind',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Bamm Bamm Rubble', title: 'London, United Kingdom\nEurope/London' },
                                                      'London, United Kingdom',
                                                      'Europe/London',
                                                      'Saturday',
                                                      '1:30 pm',
                                                      '15-Nov-2014',
                                                      '1 hour behind',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Wilma Flintstone', title: 'Paris, France\nEurope/Paris' },
                                                      'Paris, France',
                                                      'Europe/Paris',
                                                      'Saturday',
                                                      '2:30 pm',
                                                      '15-Nov-2014',
                                                      '',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Betty Rubble', title: 'Mumbai, India\nAsia/Calcutta' },
                                                      'Mumbai, India',
                                                      'Asia/Calcutta',
                                                      'Saturday',
                                                      '7:00 pm',
                                                      '15-Nov-2014',
                                                      '4.5 hours ahead',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Pebbles Flintstone', title: 'Perth, Australia\nAustralia/Perth' },
                                                      'Perth, Australia',
                                                      'Australia/Perth',
                                                      'Saturday',
                                                      '9:30 pm',
                                                      '15-Nov-2014',
                                                      '7 hours ahead',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Dino', title: 'Melbourne, Australia\nAustralia/Melbourne' },
                                                      'Melbourne, Australia',
                                                      'Australia/Melbourne',
                                                      'Sunday',
                                                      '12:30 am',
                                                      '16-Nov-2014',
                                                      '10 hours ahead',
                                                      '\u263e'
                                                    ]);
    assert.equal(timeElement.textContent, 'Saturday 2:30 pm 15-Nov-2014 (Europe/Paris)', 'Time value matches');
    expectLegend(assert, legendElement, '\u263c - 6:00 am .. 7:59 pm', '\u263e - 8:00 pm .. 5:59 am', false);
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
    expectValues(assert, containerElement, index++, [ { textContent: 'Fred Flintstone', title: 'Vancouver, Canada\nUS/Pacific' },
                                                      'Vancouver, Canada',
                                                      'US/Pacific',
                                                      'Thursday',
                                                      '4:00 pm',
                                                      '31-Dec-2009',
                                                      '8 hours behind',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Barny Rubble', title: 'New York, USA\nUS/Eastern' },
                                                      'New York, USA',
                                                      'US/Eastern',
                                                      'Thursday',
                                                      '7:00 pm',
                                                      '31-Dec-2009',
                                                      '5 hours behind',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Bamm Bamm Rubble', title: 'London, United Kingdom\nEurope/London' },
                                                      'London, United Kingdom',
                                                      'Europe/London',
                                                      'Friday',
                                                      '12:00 am',
                                                      '01-Jan-2010',
                                                      '',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Wilma Flintstone', title: 'Paris, France\nEurope/Paris' },
                                                      'Paris, France',
                                                      'Europe/Paris',
                                                      'Friday',
                                                      '1:00 am',
                                                      '01-Jan-2010',
                                                      '1 hour ahead',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Betty Rubble', title: 'Mumbai, India\nAsia/Calcutta' },
                                                      'Mumbai, India',
                                                      'Asia/Calcutta',
                                                      'Friday',
                                                      '5:30 am',
                                                      '01-Jan-2010',
                                                      '5.5 hours ahead',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Pebbles Flintstone', title: 'Perth, Australia\nAustralia/Perth' },
                                                      'Perth, Australia',
                                                      'Australia/Perth',
                                                      'Friday',
                                                      '8:00 am',
                                                      '01-Jan-2010',
                                                      '8 hours ahead',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Dino', title: 'Melbourne, Australia\nAustralia/Melbourne' },
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
    expectValues(assert, containerElement, index++, [ { textContent: 'Fred Flintstone', title: 'Vancouver, Canada\nUS/Pacific' },
                                                      'Vancouver, Canada',
                                                      'US/Pacific',
                                                      'Thursday',
                                                      '8:59 pm',
                                                      '31-Dec-2020',
                                                      '3 hours behind',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Barny Rubble', title: 'New York, USA\nUS/Eastern' },
                                                      'New York, USA',
                                                      'US/Eastern',
                                                      'Thursday',
                                                      '11:59 pm',
                                                      '31-Dec-2020',
                                                      '',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Bamm Bamm Rubble', title: 'London, United Kingdom\nEurope/London' },
                                                      'London, United Kingdom',
                                                      'Europe/London',
                                                      'Friday',
                                                      '4:59 am',
                                                      '01-Jan-2021',
                                                      '5 hours ahead',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Wilma Flintstone', title: 'Paris, France\nEurope/Paris' },
                                                      'Paris, France',
                                                      'Europe/Paris',
                                                      'Friday',
                                                      '5:59 am',
                                                      '01-Jan-2021',
                                                      '6 hours ahead',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Betty Rubble', title: 'Mumbai, India\nAsia/Calcutta' },
                                                      'Mumbai, India',
                                                      'Asia/Calcutta',
                                                      'Friday',
                                                      '10:29 am',
                                                      '01-Jan-2021',
                                                      '10.5 hours ahead',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Pebbles Flintstone', title: 'Perth, Australia\nAustralia/Perth' },
                                                      'Perth, Australia',
                                                      'Australia/Perth',
                                                      'Friday',
                                                      '12:59 pm',
                                                      '01-Jan-2021',
                                                      '13 hours ahead',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Dino', title: 'Melbourne, Australia\nAustralia/Melbourne' },
                                                      'Melbourne, Australia',
                                                      'Australia/Melbourne',
                                                      'Friday',
                                                      '3:59 pm',
                                                      '01-Jan-2021',
                                                      '16 hours ahead',
                                                      '\u263c'
                                                    ]);
});
function testFrench(assert, env, dateId, formatsId, containerId, timeId, legendId) {
    var dateElement,
        containerElement,
        timeElement,
        legendElement,
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
        formats,
        values,
        col,
        defaultOptions = { locale: 'fr',
                           ahead: 'devant',
                           behind: 'derrière',
                           hour: 'heure',
                           hours: 'heures',
                           sunRiseHour: 8,
                           sunRiseMinute: 0,
                           sunSetHour: 16,
                           sunSetMinute: 0,
                           daytime: '\u263c',  // Unicode white sun with rays
                           nighttime: '\u263e', // Unicode last quarter moon
                           legendFormat: 'h:mm a',
                           legendBreak: true,
                           legendDash: ' - ',
                           legendSeparator: ' .. ',
                           timeFormat: 'dddd HH:mm Do MMMM YYYY',
                           timeShowTimezoneName: true,
                           defaultTimezone: momentTimezoneDiff.getDefaultTimezone(),
                           versionClass: 'mtzdVersion',
                           versionTitle: 'Versions:',
                           versionTitleClass: 'mtzdVersionTitle',
                           versionNameClass: 'mtzdVersionName',
                           versionVersionClass: 'mtzdVersionVersion',
                           versionIncludeLinks: true,
                           versionLinkTarget: '_blank',
                           versionIncludejQuery: true
                         };
    dateElement = document.getElementById(dateId);
    assert.ok(dateElement, 'Date element exists');
    containerElement = document.getElementById(containerId);
    assert.ok(containerElement, 'Container is defined');
    timeElement = document.getElementById(timeId);
    assert.ok(timeElement, 'Time is defined');
    legendElement = document.getElementById(legendId);
    assert.ok(legendElement, 'Legend is defined');
    hourElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                              title: "Sélectionnez les heures de la journée",
                                                              className: 'mtzdSelect',
                                                              options: makeOptions(0, 23, 2)
                                                            });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: ':',
                                                className: 'mtzdTimeDelim'
                                              });
    minuteElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                                title: "Sélectionner les minutes de l'heure",
                                                                className: 'mtzdSelect',
                                                                options: makeOptions(0, 59, 2)
                                                              });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: ' ',
                                                className: 'mtzdDelim'
                                              });
    dayElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                             title: "Choisir jour du mois",
                                                             className: 'mtzdSelect',
                                                             options: makeOptions(1, 31, 2)
                                                           });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: '-',
                                                className: 'mtzdDateDelim'
                                              });
    monthElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                               title: "Sélectionnez un mois de l'année",
                                                               className: 'mtzdSelect',
                                                               options: [ { text: 'janvier', value:  '0'},
                                                                          { text: 'février', value:  '1'},
                                                                          { text: 'mars', value:  '2'},
                                                                          { text: 'avril', value:  '3'},
                                                                          { text: 'mai', value:  '4'},
                                                                          { text: 'juin', value:  '5'},
                                                                          { text: 'juillet', value:  '6'},
                                                                          { text: 'août', value:  '7'},
                                                                          { text: 'septembre', value:  '8'},
                                                                          { text: 'octobre', value:  '9'},
                                                                          { text: 'novembre', value: '10'},
                                                                          { text: 'décembre', value: '11'}
                                                                        ]
                                                             });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: '-',
                                                className: 'mtzdDateDelim'
                                              });
    yearElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                              title: "Sélectionnez l'année",
                                                              className: 'mtzdSelect',
                                                              options: makeOptions(2010, 2020)
                                                            });
    expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                textContent: ' ',
                                                className: 'mtzdDelim'
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
                                                textContent: ' ',
                                                className: 'mtzdDelim'
                                              });
    timezoneElement = expectChild(assert, dateElement, index++, { tagName: 'SELECT',
                                                                  title: "Sélectionnez le fuseau horaire",
                                                                  className: 'mtzdSelect',
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
                                                textContent: ' ',
                                                className: 'mtzdDelim'
                                              });
    currentTimeElement = expectChild(assert, dateElement, index++, { tagName: 'SPAN',
                                                                     className: 'currentTimeFrench',
                                                                     title: "l'heure actuelle",
                                                                     textContent: "Régler l'heure actuelle"
                                                                   });
    expectChildren(assert, dateElement, index);
    assert.equal(env._dateTimeElements._locale, 'fr', 'env dateTimeElements locale matches');
    assert.equal(env._dateTimeElements._mode, momentTimezoneDiff.MODE_DROPDOWN_HOUR24, 'Mode matches');
    assert.equal(env._dateTimeElements._errorClassName, 'mtzdError', 'Error class matches');
    assert.equal(env._dateTimeElements._currentTime, currentTimeElement, 'Current time element matches');
    assert.equal(env._dateTimeElements._elements.hour, hourElement, 'Hour element matches');
    assert.equal(env._dateTimeElements._elements.minute, minuteElement, 'Minute element matches');
    assert.equal(env._dateTimeElements._elements.ampm, undefined, 'AmPm element is not defined');
    assert.equal(env._dateTimeElements._elements.day, dayElement, 'Day element matches');
    assert.equal(env._dateTimeElements._elements.month, monthElement, 'Month element matches');
    assert.equal(env._dateTimeElements._elements.year, yearElement, 'Year element matches');
    assert.equal(env._dateTimeElements._elements.timezone, timezoneElement, 'Timezone element matches');
    assert.equal(env._dateTimeElements._elements.datetime, undefined, 'Date/time element is not defined');
    assert.equal(env._dateTimeElements._timeDisplayFormat, undefined, 'Display format is not defined');
    assert.equal(env._dateTimeElements._timeInputFormats, undefined, 'Input formats is not defined');
    assert.equal(env._dateTimeElements._datepicker, datepickerElement, 'Date picker element matches');
    assert.equal(env._dateTimeElements._datepickerImage, datepickerImageElement, 'Date picker image element matches');

    assert.equal(env._dateTimeElements.getTimezoneName(''), '', 'Timezone name matches');
    assert.equal(env._dateTimeElements.getTimezoneName('US/Pacific'), 'Fred Flintstone', 'Timezone name matches');
    assert.equal(env._dateTimeElements.getTimezoneName('US/Eastern'), 'Barny Rubble', 'Timezone name matches');
    assert.equal(env._dateTimeElements.getTimezoneName('Europe/London'), 'Bamm Bamm Rubble', 'Timezone name matches');
    assert.equal(env._dateTimeElements.getTimezoneName('Europe/Paris'), 'Wilma Flintstone', 'Timezone name matches');
    assert.equal(env._dateTimeElements.getTimezoneName('Asia/Calcutta'), 'Betty Rubble', 'Timezone name matches');
    assert.equal(env._dateTimeElements.getTimezoneName('Australia/Perth'), 'Pebbles Flintstone', 'Timezone name matches');
    assert.equal(env._dateTimeElements.getTimezoneName('Australia/Melbourne'), 'Dino', 'Timezone name matches');
    assert.equal(env._dateTimeElements.getTimezoneName('I DO NOT EXIST'), undefined, 'Invalid timezone returns undefined');

    assert.deepEqual(env._options, defaultOptions, 'options matches default options');
    assert.deepEqual(env.getOptions(), defaultOptions, 'getOptions() matches default options');
    assert.notEqual(env._options, env.getOptions(), 'getOptions() returns a copy');
    assert.equal(env._timeElement, timeElement, 'Time element matches');
    formats = [ 'dddd HH:mm Do MMMM YYYY',
                'diff',
                'daynight'
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
    assert.deepEqual(values, [ 2014, 0, 8, 14, 42, 0], 'moment matches');
    assert.deepEqual(env.timezone, { value: 'Australia/Melbourne', text: 'Dino' }, 'timezone matches');
    index = 0;
    expectValues(assert, containerElement, index++, [ { textContent: 'Fred Flintstone', title: 'US/Pacific' },
                                                      'US/Pacific',
                                                      'mardi 19:42 7 janvier 2014',
                                                      '-19 heures',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Barny Rubble', title: 'US/Eastern' },
                                                      'US/Eastern',
                                                      'mardi 22:42 7 janvier 2014',
                                                      '-16 heures',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Bamm Bamm Rubble', title: 'Europe/London' },
                                                      'Europe/London',
                                                      'mercredi 03:42 8 janvier 2014',
                                                      '-11 heures',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Wilma Flintstone', title: 'Europe/Paris' },
                                                      'Europe/Paris',
                                                      'mercredi 04:42 8 janvier 2014',
                                                      '-10 heures',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Betty Rubble', title: 'Asia/Calcutta' },
                                                      'Asia/Calcutta',
                                                      'mercredi 09:12 8 janvier 2014',
                                                      '-5.5 heures',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Pebbles Flintstone', title: 'Australia/Perth' },
                                                      'Australia/Perth',
                                                      'mercredi 11:42 8 janvier 2014',
                                                      '-3 heures',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Dino', title: 'Australia/Melbourne' },
                                                      'Australia/Melbourne',
                                                      'mercredi 14:42 8 janvier 2014',
                                                      '',
                                                      '\u263c'
                                                    ]);
    assert.equal(timeElement.textContent, 'mercredi 14:42 8 janvier 2014 (Dino)', 'Time value matches');
    expectLegend(assert, legendElement, '\u263c - 8:00 am .. 3:59 pm', '\u263e - 4:00 pm .. 7:59 am', true);
    // 15-Oct-2014 - Australia IS in daylight savings - US IS in daylight savings
    env.update([2014, 9, 15, 14, 30, 0], 'US/Pacific', 'Fred Flintstone');
    values = getMomentValues(env.moment);
    assert.deepEqual(values, [ 2014, 9, 15, 14, 30, 0], 'moment matches');
    assert.deepEqual(env.timezone, { value: 'US/Pacific', text: 'Fred Flintstone' }, 'timezone matches');
    env.update([2014, 9, 15, 14, 30, 0], 'Australia/Melbourne');
    values = getMomentValues(env.moment);
    assert.deepEqual(values, [ 2014, 9, 15, 14, 30, 0], 'moment matches');
    assert.deepEqual(env.timezone, { value: 'Australia/Melbourne', text: 'Dino' }, 'timezone matches');
    env.update([2014, 9, 15, 14, 30, 0], 'US/Pacific');
    values = getMomentValues(env.moment);
    assert.deepEqual(values, [ 2014, 9, 15, 14, 30, 0], 'moment matches');
    assert.deepEqual(env.timezone, { value: 'US/Pacific', text: 'Fred Flintstone' }, 'timezone matches');
    index = 0;
    expectValues(assert, containerElement, index++, [ { textContent: 'Fred Flintstone', title: 'US/Pacific' },
                                                      'US/Pacific',
                                                      'mercredi 14:30 15 octobre 2014',
                                                      '',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Barny Rubble', title: 'US/Eastern' },
                                                      'US/Eastern',
                                                      'mercredi 17:30 15 octobre 2014',
                                                      '3 heures',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Bamm Bamm Rubble', title: 'Europe/London' },
                                                      'Europe/London',
                                                      'mercredi 22:30 15 octobre 2014',
                                                      '8 heures',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Wilma Flintstone', title: 'Europe/Paris' },
                                                      'Europe/Paris',
                                                      'mercredi 23:30 15 octobre 2014',
                                                      '9 heures',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Betty Rubble', title: 'Asia/Calcutta' },
                                                      'Asia/Calcutta',
                                                      'jeudi 03:00 16 octobre 2014',
                                                      '12.5 heures',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Pebbles Flintstone', title: 'Australia/Perth' },
                                                      'Australia/Perth',
                                                      'jeudi 05:30 16 octobre 2014',
                                                      '15 heures',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Dino', title: 'Australia/Melbourne' },
                                                      'Australia/Melbourne',
                                                      'jeudi 08:30 16 octobre 2014',
                                                      '18 heures',
                                                      '\u263c'
                                                    ]);
    assert.equal(timeElement.textContent, 'mercredi 14:30 15 octobre 2014 (Fred Flintstone)', 'Time value matches');
    expectLegend(assert, legendElement, '\u263c - 8:00 am .. 3:59 pm', '\u263e - 4:00 pm .. 7:59 am', true);
    // 15-Nov-2014 - Australia IS in daylight savings - US NOT in daylight savings
    env.update([2014, 10, 15, 14, 30, 0], 'Europe/Paris', 'Wilma Flintstone');
    values = getMomentValues(env.moment);
    assert.deepEqual(values, [ 2014, 10, 15, 14, 30, 0], 'moment matches');
    assert.deepEqual(env.timezone, { value: 'Europe/Paris', text: 'Wilma Flintstone' }, 'timezone matches');
    env.update([2014, 9, 15, 14, 30, 0], 'Australia/Melbourne');
    values = getMomentValues(env.moment);
    assert.deepEqual(values, [ 2014, 9, 15, 14, 30, 0], 'moment matches');
    assert.deepEqual(env.timezone, { value: 'Australia/Melbourne', text: 'Dino' }, 'timezone matches');
    env.update([2014, 10, 15, 14, 30, 0], 'Europe/Paris');
    values = getMomentValues(env.moment);
    assert.deepEqual(values, [ 2014, 10, 15, 14, 30, 0], 'moment matches');
    assert.deepEqual(env.timezone, { value: 'Europe/Paris', text: 'Wilma Flintstone' }, 'timezone matches');
    index = 0;
    expectValues(assert, containerElement, index++, [ { textContent: 'Fred Flintstone', title: 'US/Pacific' },
                                                      'US/Pacific',
                                                      'samedi 05:30 15 novembre 2014',
                                                      '-9 heures',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Barny Rubble', title: 'US/Eastern' },
                                                      'US/Eastern',
                                                      'samedi 08:30 15 novembre 2014',
                                                      '-6 heures',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Bamm Bamm Rubble', title: 'Europe/London' },
                                                      'Europe/London',
                                                      'samedi 13:30 15 novembre 2014',
                                                      '-1 heure',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Wilma Flintstone', title: 'Europe/Paris' },
                                                      'Europe/Paris',
                                                      'samedi 14:30 15 novembre 2014',
                                                      '',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Betty Rubble', title: 'Asia/Calcutta' },
                                                      'Asia/Calcutta',
                                                      'samedi 19:00 15 novembre 2014',
                                                      '4.5 heures',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Pebbles Flintstone', title: 'Australia/Perth' },
                                                      'Australia/Perth',
                                                      'samedi 21:30 15 novembre 2014',
                                                      '7 heures',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Dino', title: 'Australia/Melbourne' },
                                                      'Australia/Melbourne',
                                                      'dimanche 00:30 16 novembre 2014',
                                                      '10 heures',
                                                      '\u263e'
                                                    ]);
    assert.equal(timeElement.textContent, 'samedi 14:30 15 novembre 2014 (Wilma Flintstone)', 'Time value matches');
    expectLegend(assert, legendElement, '\u263c - 8:00 am .. 3:59 pm', '\u263e - 4:00 pm .. 7:59 am', true);
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
    assert.deepEqual(values, { hour: 0, minute: 0, day: 0, month: 0, year: 0, timezone: 3 }, 'Selected values matches date');
    fireChangeEvent(env._dateTimeElements._elements.hour);
    
    index = 0;
    expectValues(assert, containerElement, index++, [ { textContent: 'Fred Flintstone', title: 'US/Pacific' },
                                                      'US/Pacific',
                                                      'jeudi 16:00 31 décembre 2009',
                                                      '-8 heures',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Barny Rubble', title: 'US/Eastern' },
                                                      'US/Eastern',
                                                      'jeudi 19:00 31 décembre 2009',
                                                      '-5 heures',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Bamm Bamm Rubble', title: 'Europe/London' },
                                                      'Europe/London',
                                                      'vendredi 00:00 1er janvier 2010',
                                                      '',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Wilma Flintstone', title: 'Europe/Paris' },
                                                      'Europe/Paris',
                                                      'vendredi 01:00 1er janvier 2010',
                                                      '1 heure',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Betty Rubble', title: 'Asia/Calcutta' },
                                                      'Asia/Calcutta',
                                                      'vendredi 05:30 1er janvier 2010',
                                                      '5.5 heures',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Pebbles Flintstone', title: 'Australia/Perth' },
                                                      'Australia/Perth',
                                                      'vendredi 08:00 1er janvier 2010',
                                                      '8 heures',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Dino', title: 'Australia/Melbourne' },
                                                      'Australia/Melbourne',
                                                      'vendredi 11:00 1er janvier 2010',
                                                      '11 heures',
                                                      '\u263c'
                                                    ]);

    setDateTimeElementValues(env._dateTimeElements, { hour: 23, minute: 59, day: 30, month: 11, year: 10, timezone: 2 });
    values = env._dateTimeElements.getSelected();
    assert.deepEqual(values, { hour: 23, minute: 59, day: 31, month: 11, year: 2020, timezone: { text: 'Barny Rubble', value: 'US/Eastern' } }, 'Selected matches date');
    fireChangeEvent(env._dateTimeElements._elements.hour);

    index = 0;
    expectValues(assert, containerElement, index++, [ { textContent: 'Fred Flintstone', title: 'US/Pacific' },
                                                      'US/Pacific',
                                                      'jeudi 20:59 31 décembre 2020',
                                                      '-3 heures',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Barny Rubble', title: 'US/Eastern' },
                                                      'US/Eastern',
                                                      'jeudi 23:59 31 décembre 2020',
                                                      '',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Bamm Bamm Rubble', title: 'Europe/London' },
                                                      'Europe/London',
                                                      'vendredi 04:59 1er janvier 2021',
                                                      '5 heures',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Wilma Flintstone', title: 'Europe/Paris' },
                                                      'Europe/Paris',
                                                      'vendredi 05:59 1er janvier 2021',
                                                      '6 heures',
                                                      '\u263e'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Betty Rubble', title: 'Asia/Calcutta' },
                                                      'Asia/Calcutta',
                                                      'vendredi 10:29 1er janvier 2021',
                                                      '10.5 heures',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Pebbles Flintstone', title: 'Australia/Perth' },
                                                      'Australia/Perth',
                                                      'vendredi 12:59 1er janvier 2021',
                                                      '13 heures',
                                                      '\u263c'
                                                    ]);
    expectValues(assert, containerElement, index++, [ { textContent: 'Dino', title: 'Australia/Melbourne' },
                                                      'Australia/Melbourne',
                                                      'vendredi 15:59 1er janvier 2021',
                                                      '16 heures',
                                                      '\u263c'
                                                    ]);
}
QUnit.test('Environment2', function (assert) {
    testFrench(assert, testVars.env2, 'dateFrench', 'cellFormatsFrench', 'containerFrench', 'currentTimeFrench', 'legendFrench');
});
QUnit.test('Environment3', function (assert) {
    testFrench(assert, testVars.env3, 'dateFrench2', 'cellFormatsFrench2', 'containerFrench2', 'currentTimeFrench2', 'legendFrench2');
});
