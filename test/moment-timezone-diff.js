"use strict";

/*global describe, it*/

var moment = require('moment-timezone'),
    momentTimezoneDiff = require('../scripts/moment-timezone-diff');

describe('options', function () {
    describe('options', function () {
        var defaultOptions = { ahead: 'ahead',
                               behind: 'behind',
                               sunRise: { hours: 6, minutes: 0 },
                               sunSet: { hours: 19, minutes: 59 },
                               sun: '\u263c',  // Unicode white sun with rays
                               moon: '\u263e', // Unicode last quarter moon
                               hour: 'hour',
                               hours: 'hours'
                             };
        //
        // copy(...)
        //
        // Copies one or more objects creating a new object which contains all of the properties of the supplied objects
        // Objects are copied in the parameter order, so last property value wins.
        //
        function copy() {
            var newObj = { },
                prop,
                i;
            for (i = 0; i < arguments.length; i += 1) {
                if (typeof arguments[i] === 'object') {
                    for (prop in arguments[i]) {
                        if (arguments[i].hasOwnProperty(prop)) {
                            newObj[prop] = arguments[i][prop];
                        }
                    }
                }
            }
            return newObj;
        }
        it('defaultOptions', function () {
            
            momentTimezoneDiff.getOptions().should.eql(defaultOptions);
        });
        it('get/set', function () {
            var options,
                newOptions1 = { ahead: 'changed ahead', hour: 'changed hours' },
                newOptions2 = { ahead: 'changed ahead again', sun: 'sun', sunRise: { hours: 1, minutes: 42 } };
            momentTimezoneDiff.getOptions().should.eql(defaultOptions);
            momentTimezoneDiff.setOptions(newOptions1);
            options = copy(defaultOptions, newOptions1);
            momentTimezoneDiff.getOptions().should.eql(options);
            momentTimezoneDiff.setOptions(newOptions2);
            options = copy(defaultOptions, newOptions1, newOptions2);
            momentTimezoneDiff.getOptions().should.eql(options);
            momentTimezoneDiff.setOptions(defaultOptions);
            momentTimezoneDiff.getOptions().should.eql(defaultOptions);
        });
        it('TimezoneDiff', function () {
            
            var m = moment.tz([2014, 8, 1, 12, 42, 13], 'US/Pacific'),
                tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'US/Eastern');
            tzDiff.diff().should.equal(3);
            
            m = moment.tz([2014, 11, 31, 23, 42, 13], 'US/Pacific');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'US/Eastern');
            tzDiff.diff().should.equal(3);

            m = moment.tz([2015, 0, 1, 1, 1, 1], 'Australia/Melbourne');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Perth');
            tzDiff.diff().should.equal(-3);
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Brisbane');
            tzDiff.diff().should.equal(-1);

            m = moment.tz([2014, 7, 7, 7, 7, 7], 'Australia/Melbourne');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Perth');
            tzDiff.diff().should.equal(-2);
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Brisbane');
            tzDiff.diff().should.equal(0);
        });
    });
});
