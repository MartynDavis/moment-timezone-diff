"use strict";

/*global QUnit, document, moment, momentTimezoneDiff, env, dte1, dte2, dte3*/

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
                assert.equal(childOptions.length, expectedOptions.length, 'Options length "' + childOptions.length + '" has expected length "' + expectedOptions.length + '"');
                for (i = 0; i < expectedOptions.length; i += 1) {
                    childOption = childOptions[i];
                    expectedOption = expectedOptions[i];
                    assert.ok(childOption && expectedOption, 'Expected option preent');
                    assert.equal(childOption.value, expectedOption.value, 'Option value "' + childOption.value + '" matches expected "' + expectedOption.value + '"');
                    assert.equal(childOption.text,  expectedOption.text,  'Option text "'  + childOption.text  + '" matches expected "' + expectedOption.text  + '"');
                }
            }
            else {
                assert.equal(child[property], properties[property], 'Property "' + property + '" value "' + child[property] + '" ' +
                                                                    'matches expected "' + properties[property] + '"');
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
        dayElement,
        monthElement,
        yearElement,
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
                                                                  options: [ { text: '', value: '' }
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
    assert.equal(dte1.locale, 'fr', 'env.locale is "fr"');
    assert.equal(dte1.mode, momentTimezoneDiff.MODE_SPLIT_HOUR12, 'Mode matches');
    assert.equal(dte1.errorClassName, 'mtzdError', 'Error class matches');
    assert.equal(dte1.currentTime, currentTimeElement, 'Current time element matches');
    assert.equal(dte1.elements.hour, hourElement, 'Hour element matches');
    assert.equal(dte1.elements.minute, minuteElement, 'Minute element matches');
    assert.equal(dte1.elements.ampm, ampmElement, 'AmPm element matches');
    assert.equal(dte1.elements.day, dayElement, 'Day element matches');
    assert.equal(dte1.elements.month, monthElement, 'Month element matches');
    assert.equal(dte1.elements.year, yearElement, 'Year element matches');
    assert.equal(dte1.elements.timezone, timezoneElement, 'Timezone element matches');
    assert.equal(dte1.elements.datetime, undefined, 'Date/time element is not defined');
    assert.equal(dte1.timeDisplayFormat, undefined, 'Display format is not defined');
    assert.equal(dte1.timeInputFormats, undefined, 'Input formats is not defined');
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
                                                                  options: [ { text: '', value: '' }
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
    assert.equal(dte2.locale, undefined, 'env.locale is not defined');
    assert.equal(dte2.mode, momentTimezoneDiff.MODE_SPLIT_HOUR24, 'Mode matches');
    assert.equal(dte2.errorClassName, 'mtzdError', 'Error class matches');
    assert.equal(dte2.currentTime, currentTimeElement, 'Current time element matches');
    assert.equal(dte2.elements.hour, hourElement, 'Hour element matches');
    assert.equal(dte2.elements.minute, minuteElement, 'Minute element matches');
    assert.equal(dte2.elements.ampm, undefined, 'AmPm element is not defined');
    assert.equal(dte2.elements.day, dayElement, 'Day element matches');
    assert.equal(dte2.elements.month, monthElement, 'Month element matches');
    assert.equal(dte2.elements.year, yearElement, 'Year element matches');
    assert.equal(dte2.elements.timezone, timezoneElement, 'Timezone element matches');
    assert.equal(dte2.elements.datetime, undefined, 'Date/time element is not defined');
    assert.equal(dte2.timeDisplayFormat, undefined, 'Display format is not defined');
    assert.equal(dte2.timeInputFormats, undefined, 'Input formats is not defined');
});
QUnit.test('DateTimeElements3', function (assert) {
    var dateElement,
        index = 0,
        datetimeElement,
        timezoneElement,
        currentTimeElement;
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
                                                                  options: [ { text: '', value: '' },
                                                                             { text: 'timezone1', value: 'US/Pacific' },
                                                                             { text: 'timezone2', value: 'Australia/Melbourne' }
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
    assert.equal(dte3.locale, undefined, 'env.locale is not defined');
    assert.equal(dte3.mode, momentTimezoneDiff.MODE_SINGLE, 'Mode matches');
    assert.equal(dte3.errorClassName, 'mtzdError', 'Error class matches');
    assert.equal(dte3.currentTime, currentTimeElement, 'Current time element matches');
    assert.equal(dte3.elements.hour, undefined, 'Hour element is not defined');
    assert.equal(dte3.elements.minute, undefined, 'Minute element is not defined');
    assert.equal(dte3.elements.ampm, undefined, 'AmPm element is not defined');
    assert.equal(dte3.elements.day, undefined, 'Day element is not defined');
    assert.equal(dte3.elements.month, undefined, 'Month element is not defined');
    assert.equal(dte3.elements.year, undefined, 'Year element is not defined');
    assert.equal(dte3.elements.datetime, datetimeElement, 'Date/time element matches');
    assert.equal(dte3.elements.timezone, timezoneElement, 'Timezone element matches');
    assert.equal(dte3.timeDisplayFormat, 'dddd h:mm a DD-MMM-YYYY', 'Display format matches');
    assert.deepEqual(dte3.timeInputFormats, [ 'dddd h:mm a DD-MMM-YYYY', 
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
});
QUnit.test('Environment', function (assert) {
    assert.ok(env.locale === undefined, 'env.locale is undefined');
    var dateElement = document.getElementById('mtzdDate');
});

