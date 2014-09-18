"use strict";

/*global describe, it*/

var mtzd = require('../scripts/moment-timezone-diff');

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
        // Objects are copied in the parameter order, so last property value wins
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
            
            mtzd.getOptions().should.eql(defaultOptions);
        });
        it('get/set', function () {
            var options,
                newOptions1 = { ahead: 'changed ahead', hour: 'changed hours' },
                newOptions2 = { sun: 'sun', sunRise: { hours: 1, minutes: 42 } };
            mtzd.getOptions().should.eql(defaultOptions);
            mtzd.setOptions(newOptions1);
            options = copy(defaultOptions, newOptions1);
            mtzd.getOptions().should.eql(options);
            mtzd.setOptions(newOptions2);
            options = copy(defaultOptions, newOptions1, newOptions2);
            mtzd.getOptions().should.eql(options);
            mtzd.setOptions(defaultOptions);
            mtzd.getOptions().should.eql(defaultOptions);
        });
    });
});
