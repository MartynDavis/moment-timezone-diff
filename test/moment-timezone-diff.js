/*
    moment-timezone-diff.js
    version : 0.3.0
    authors : Martyn Davis
    license : MIT
*/
"use strict";
/*global describe, it*/
var moment = require('../moment/moment-timezone'),
    momentTimezoneDiff = require('../scripts/moment-timezone-diff');
describe('options', function () {
    describe('options', function () {
        var defaultOptions = { locale: undefined,
                               ahead: 'ahead',
                               behind: 'behind',
                               sunRiseHour: 6,
                               sunRiseMinute: 0,
                               sunSetHour: 20,
                               sunSetMinute: 0,
                               sun: '\u263c',  // Unicode white sun with rays
                               moon: '\u263e', // Unicode last quarter moon
                               hour: 'hour',
                               hours: 'hours',
                               legendFormat: 'h:mm a',
                               legendBreak: true,
                               legendDash: ' - ',
                               legendSeparator: ' .. ',
                               timeFormat: 'dddd h:mm a DD-MMM-YYYY',
                               timeShowTimezoneName: true,
                               defaultTimezone: momentTimezoneDiff.getDefaultTimezone()
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
                newOptions2 = { ahead: 'changed ahead again', sun: 'sun', sunRiseHour: 1, sunRiseMinute: 42 };
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
            m = moment.tz([2015, 0, 1, 1, 42, 13], 'US/Eastern');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'US/Pacific');
            tzDiff.diff().should.equal(-3);
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
        it('Format', function () {
            var m = moment.tz([2015, 0, 1, 0, 15, 0], 'Australia/Melbourne'),
                tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Adelaide');
            tzDiff.diff().should.equal(-0.5);
            tzDiff.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('23:45 Dec-31-2014 0.5 hours behind \u263e');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'US/Pacific');
            tzDiff.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('05:15 Dec-31-2014 19 hours behind \u263e');
            m = moment.tz([2015, 0, 1, 9, 15, 0], 'Australia/Melbourne');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'US/Pacific');
            tzDiff.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('14:15 Dec-31-2014 19 hours behind \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('14:15 Dec-31-2014 -19 hours \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY [DIFF] sunmoon').should.equal('14:15 Dec-31-2014 DIFF \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY [diff] sunmoon').should.equal('14:15 Dec-31-2014 diff \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY [diff] [sunmoon]').should.equal('14:15 Dec-31-2014 diff sunmoon');
        });
        it('Format - escaped', function () {
            var m = moment.tz([2015, 0, 1, 9, 15, 0], 'Australia/Melbourne'),
                tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'US/Pacific');
            tzDiff.format('DIFF').should.equal('19 hours behind');
            tzDiff.format('diff').should.equal('-19 hours');
            tzDiff.format('sunmoon').should.equal('\u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('14:15 Dec-31-2014 19 hours behind \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('14:15 Dec-31-2014 -19 hours \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY [DIFF] sunmoon').should.equal('14:15 Dec-31-2014 DIFF \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY [diff] sunmoon').should.equal('14:15 Dec-31-2014 diff \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY [diff] [sunmoon]').should.equal('14:15 Dec-31-2014 diff sunmoon');
            m = moment.tz([2014, 11, 31, 14, 15, 0], 'US/Pacific');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Melbourne');
            tzDiff.format('DIFF').should.equal('19 hours ahead');
            tzDiff.format('diff').should.equal('19 hours');
            tzDiff.format('sunmoon').should.equal('\u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('09:15 Jan-01-2015 19 hours ahead \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('09:15 Jan-01-2015 19 hours \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY [DIFF] sunmoon').should.equal('09:15 Jan-01-2015 DIFF \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY [diff] sunmoon').should.equal('09:15 Jan-01-2015 diff \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY [diff] [sunmoon]').should.equal('09:15 Jan-01-2015 diff sunmoon');
        });
        it('Sunny', function () {
            var m = moment.tz([2015, 0, 1, 9, 15, 0], 'Australia/Melbourne'),
                tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'US/Pacific');
            tzDiff.sunny().should.equal(true);
            momentTimezoneDiff.sunny(m).should.equal(true);
            m = moment.tz([2014, 11, 31, 14, 15, 0], 'US/Pacific');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Melbourne');
            tzDiff.sunny().should.equal(true);
            momentTimezoneDiff.sunny(m).should.equal(true);
            m = moment.tz([2014, 11, 31, 20, 15, 0], 'US/Pacific');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Melbourne');
            tzDiff.sunny().should.equal(true);
            momentTimezoneDiff.sunny(m).should.equal(false);
            m = moment.tz([2014, 11, 31, 20, 15, 0], 'Australia/Melbourne');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Perth');
            tzDiff.sunny().should.equal(true);
            momentTimezoneDiff.sunny(m).should.equal(false);
            m = moment.tz([2014, 11, 31, 14, 15, 0], 'Australia/Melbourne');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Perth');
            tzDiff.sunny().should.equal(true);
            momentTimezoneDiff.sunny(m).should.equal(true);
            m = moment.tz([2014, 11, 31, 8, 15, 0], 'Australia/Melbourne');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Perth');
            tzDiff.sunny().should.equal(false);
            momentTimezoneDiff.sunny(m).should.equal(true);
            m = moment.tz([2014, 11, 31, 1, 15, 0], 'Australia/Melbourne');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Adelaide');
            tzDiff.sunny().should.equal(false);
            momentTimezoneDiff.sunny(m).should.equal(false);
        });
        function checkSunny(m, options) {
            var hour = m.hour(),
                minute = m.minute();
            if ((hour > options.sunRiseHour) && (hour < options.sunSetHour)) {
                return true;
            }
            if ((hour === options.sunRiseHour) && (hour === options.sunSetHour)) {
                return (minute >= (options.sunRiseMinute || 0)) && (minute < (options.sunSetMinute || 0));
            }
            if (hour === options.sunRiseHour) {
                return minute >= (options.sunRiseMinute || 0);
            }
            if (hour === options.sunSetHour) {
                return minute < (options.sunSetMinute || 0);
            }
            return false;
        }
        it('Sunny with options', function () {
            var sunRiseHour,
                sunRiseMinute,
                sunSetHour,
                sunSetMinute,
                m = moment.tz([2015, 0, 8, 12, 35, 0], 'Europe/London');
            for (sunRiseHour = 0; sunRiseHour < 24; sunRiseHour += 1) {
                for (sunRiseMinute = 0; sunRiseMinute < 60; sunRiseMinute += 1) {
                    for (sunSetHour = sunRiseHour; sunSetHour < 24; sunSetHour += 1) {
                        for (sunSetMinute = (sunRiseHour === sunSetHour) ? (sunRiseMinute + 1) : 0; sunSetMinute < 60; sunSetMinute += 1) {
                            momentTimezoneDiff.setOptions({ sunRiseHour: sunRiseHour, sunRiseMinute: sunRiseMinute,
                                                            sunSetHour: sunSetHour, sunSetMinute: sunSetMinute });
                            //console.log("Sunny(" + sunRiseHour + ":" + sunRiseMinute + "," + sunSetHour + ":" + sunSetMinute + ") - " + m.hour() + ":" + m.minute());
                            momentTimezoneDiff.sunny(m).should.equal(checkSunny(m, momentTimezoneDiff.getOptions()));
                        }
                    }
                }
            }
            for (sunRiseHour = 0; sunRiseHour < 24; sunRiseHour += 1) {
                for (sunSetHour = sunRiseHour; sunSetHour < 24; sunSetHour += 1) {
                    momentTimezoneDiff.setOptions({ sunRiseHour: sunRiseHour, sunRiseMinute: undefined,
                                                    sunSetHour: sunSetHour, sunSetMinute: undefined });
                    momentTimezoneDiff.sunny(m).should.equal(checkSunny(m, momentTimezoneDiff.getOptions()));
                }
            }
            // restore default options
            momentTimezoneDiff.setOptions(defaultOptions);
            momentTimezoneDiff.getOptions().should.eql(defaultOptions);
        });
        it('Format with various options values', function () {
            var m1 = moment.tz([2015, 0, 1, 9, 15, 0], 'Australia/Melbourne'),
                tzDiff1 = new momentTimezoneDiff.TimezoneDiff(m1, 'US/Pacific'),
                m2 = moment.tz([2014, 11, 31, 14, 15, 0], 'US/Pacific'),
                tzDiff2 = new momentTimezoneDiff.TimezoneDiff(m2, 'Australia/Melbourne'),
                m3 = moment.tz([2014, 11, 31, 14, 15, 0], 'Australia/Melbourne'),
                tzDiff3 = new momentTimezoneDiff.TimezoneDiff(m3, 'Australia/Brisbane'),
                m4 = moment.tz([2014, 11, 31, 1, 15, 0], 'Australia/Brisbane'),
                tzDiff4 = new momentTimezoneDiff.TimezoneDiff(m4, 'Australia/Melbourne');
            tzDiff1.format('DIFF').should.equal('19 hours behind');
            tzDiff1.format('diff').should.equal('-19 hours');
            tzDiff1.format('sunmoon').should.equal('\u263c');
            tzDiff1.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('14:15 Dec-31-2014 19 hours behind \u263c');
            tzDiff1.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('14:15 Dec-31-2014 -19 hours \u263c');
            tzDiff2.format('DIFF').should.equal('19 hours ahead');
            tzDiff2.format('diff').should.equal('19 hours');
            tzDiff2.format('sunmoon').should.equal('\u263c');
            tzDiff2.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('09:15 Jan-01-2015 19 hours ahead \u263c');
            tzDiff2.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('09:15 Jan-01-2015 19 hours \u263c');
            tzDiff3.format('DIFF').should.equal('1 hour behind');
            tzDiff3.format('diff').should.equal('-1 hour');
            tzDiff3.format('sunmoon').should.equal('\u263c');
            tzDiff3.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('13:15 Dec-31-2014 1 hour behind \u263c');
            tzDiff3.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('13:15 Dec-31-2014 -1 hour \u263c');
            tzDiff4.format('DIFF').should.equal('1 hour ahead');
            tzDiff4.format('diff').should.equal('1 hour');
            tzDiff4.format('sunmoon').should.equal('\u263e');
            tzDiff4.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('02:15 Dec-31-2014 1 hour ahead \u263e');
            tzDiff4.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('02:15 Dec-31-2014 1 hour \u263e');
            tzDiff1.setOptions({ ahead: 'XXXX', behind: 'YYYY' });
            tzDiff1.format('DIFF').should.equal('19 hours YYYY');
            tzDiff1.format('diff').should.equal('-19 hours');
            tzDiff1.format('sunmoon').should.equal('\u263c');
            tzDiff1.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('14:15 Dec-31-2014 19 hours YYYY \u263c');
            tzDiff1.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('14:15 Dec-31-2014 -19 hours \u263c');
            tzDiff2.setOptions({ ahead: 'XXXX', behind: 'YYYY' });
            tzDiff2.format('DIFF').should.equal('19 hours XXXX');
            tzDiff2.format('diff').should.equal('19 hours');
            tzDiff2.format('sunmoon').should.equal('\u263c');
            tzDiff2.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('09:15 Jan-01-2015 19 hours XXXX \u263c');
            tzDiff2.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('09:15 Jan-01-2015 19 hours \u263c');
            tzDiff3.setOptions({ ahead: 'XXXX', behind: 'YYYY' });
            tzDiff3.format('DIFF').should.equal('1 hour YYYY');
            tzDiff3.format('diff').should.equal('-1 hour');
            tzDiff3.format('sunmoon').should.equal('\u263c');
            tzDiff3.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('13:15 Dec-31-2014 1 hour YYYY \u263c');
            tzDiff3.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('13:15 Dec-31-2014 -1 hour \u263c');
            tzDiff4.setOptions({ ahead: 'XXXX', behind: 'YYYY' });
            tzDiff4.format('DIFF').should.equal('1 hour XXXX');
            tzDiff4.format('diff').should.equal('1 hour');
            tzDiff4.format('sunmoon').should.equal('\u263e');
            tzDiff4.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('02:15 Dec-31-2014 1 hour XXXX \u263e');
            tzDiff4.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('02:15 Dec-31-2014 1 hour \u263e');
            tzDiff1.setOptions({ hour: 'AAAA', hours: 'AAAAs' });
            tzDiff1.format('DIFF').should.equal('19 AAAAs YYYY');
            tzDiff1.format('diff').should.equal('-19 AAAAs');
            tzDiff1.format('sunmoon').should.equal('\u263c');
            tzDiff1.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('14:15 Dec-31-2014 19 AAAAs YYYY \u263c');
            tzDiff1.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('14:15 Dec-31-2014 -19 AAAAs \u263c');
            tzDiff2.setOptions({ hour: 'AAAA', hours: 'AAAAs' });
            tzDiff2.format('DIFF').should.equal('19 AAAAs XXXX');
            tzDiff2.format('diff').should.equal('19 AAAAs');
            tzDiff2.format('sunmoon').should.equal('\u263c');
            tzDiff2.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('09:15 Jan-01-2015 19 AAAAs XXXX \u263c');
            tzDiff2.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('09:15 Jan-01-2015 19 AAAAs \u263c');
            tzDiff3.setOptions({ hour: 'AAAA', hours: 'AAAAs' });
            tzDiff3.format('DIFF').should.equal('1 AAAA YYYY');
            tzDiff3.format('diff').should.equal('-1 AAAA');
            tzDiff3.format('sunmoon').should.equal('\u263c');
            tzDiff3.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('13:15 Dec-31-2014 1 AAAA YYYY \u263c');
            tzDiff3.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('13:15 Dec-31-2014 -1 AAAA \u263c');
            tzDiff4.setOptions({ hour: 'AAAA', hours: 'AAAAs' });
            tzDiff4.format('DIFF').should.equal('1 AAAA XXXX');
            tzDiff4.format('diff').should.equal('1 AAAA');
            tzDiff4.format('sunmoon').should.equal('\u263e');
            tzDiff4.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('02:15 Dec-31-2014 1 AAAA XXXX \u263e');
            tzDiff4.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('02:15 Dec-31-2014 1 AAAA \u263e');
            tzDiff1.setOptions({ ahead: undefined, behind: undefined });
            tzDiff1.format('DIFF').should.equal('-19 AAAAs');
            tzDiff1.format('diff').should.equal('-19 AAAAs');
            tzDiff1.format('sunmoon').should.equal('\u263c');
            tzDiff1.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('14:15 Dec-31-2014 -19 AAAAs \u263c');
            tzDiff1.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('14:15 Dec-31-2014 -19 AAAAs \u263c');
            tzDiff2.setOptions({ ahead: undefined, behind: undefined });
            tzDiff2.format('DIFF').should.equal('19 AAAAs');
            tzDiff2.format('diff').should.equal('19 AAAAs');
            tzDiff2.format('sunmoon').should.equal('\u263c');
            tzDiff2.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('09:15 Jan-01-2015 19 AAAAs \u263c');
            tzDiff2.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('09:15 Jan-01-2015 19 AAAAs \u263c');
            tzDiff3.setOptions({ ahead: undefined, behind: undefined });
            tzDiff3.format('DIFF').should.equal('-1 AAAA');
            tzDiff3.format('diff').should.equal('-1 AAAA');
            tzDiff3.format('sunmoon').should.equal('\u263c');
            tzDiff3.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('13:15 Dec-31-2014 -1 AAAA \u263c');
            tzDiff3.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('13:15 Dec-31-2014 -1 AAAA \u263c');
            tzDiff4.setOptions({ ahead: undefined, behind: undefined });
            tzDiff4.format('DIFF').should.equal('1 AAAA');
            tzDiff4.format('diff').should.equal('1 AAAA');
            tzDiff4.format('sunmoon').should.equal('\u263e');
            tzDiff4.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('02:15 Dec-31-2014 1 AAAA \u263e');
            tzDiff4.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('02:15 Dec-31-2014 1 AAAA \u263e');
            tzDiff1.setOptions({ hour: undefined, hours: undefined });
            tzDiff1.format('DIFF').should.equal('-19');
            tzDiff1.format('diff').should.equal('-19');
            tzDiff1.format('sunmoon').should.equal('\u263c');
            tzDiff1.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('14:15 Dec-31-2014 -19 \u263c');
            tzDiff1.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('14:15 Dec-31-2014 -19 \u263c');
            tzDiff2.setOptions({ hour: undefined, hours: undefined });
            tzDiff2.format('DIFF').should.equal('19');
            tzDiff2.format('diff').should.equal('19');
            tzDiff2.format('sunmoon').should.equal('\u263c');
            tzDiff2.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('09:15 Jan-01-2015 19 \u263c');
            tzDiff2.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('09:15 Jan-01-2015 19 \u263c');
            tzDiff3.setOptions({ hour: undefined, hours: undefined });
            tzDiff3.format('DIFF').should.equal('-1');
            tzDiff3.format('diff').should.equal('-1');
            tzDiff3.format('sunmoon').should.equal('\u263c');
            tzDiff3.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('13:15 Dec-31-2014 -1 \u263c');
            tzDiff3.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('13:15 Dec-31-2014 -1 \u263c');
            tzDiff4.setOptions({ hour: undefined, hours: undefined });
            tzDiff4.format('DIFF').should.equal('1');
            tzDiff4.format('diff').should.equal('1');
            tzDiff4.format('sunmoon').should.equal('\u263e');
            tzDiff4.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('02:15 Dec-31-2014 1 \u263e');
            tzDiff4.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('02:15 Dec-31-2014 1 \u263e');
            tzDiff1.setOptions({ hour: undefined, hours: undefined, ahead: '+', behind: '-'});
            tzDiff1.format('DIFF').should.equal('19 -');
            tzDiff1.format('diff').should.equal('-19');
            tzDiff1.format('sunmoon').should.equal('\u263c');
            tzDiff1.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('14:15 Dec-31-2014 19 - \u263c');
            tzDiff1.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('14:15 Dec-31-2014 -19 \u263c');
            tzDiff2.setOptions({ hour: undefined, hours: undefined, ahead: '+', behind: '-'});
            tzDiff2.format('DIFF').should.equal('19 +');
            tzDiff2.format('diff').should.equal('19');
            tzDiff2.format('sunmoon').should.equal('\u263c');
            tzDiff2.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('09:15 Jan-01-2015 19 + \u263c');
            tzDiff2.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('09:15 Jan-01-2015 19 \u263c');
            tzDiff3.setOptions({ hour: undefined, hours: undefined, ahead: '+', behind: '-'});
            tzDiff3.format('DIFF').should.equal('1 -');
            tzDiff3.format('diff').should.equal('-1');
            tzDiff3.format('sunmoon').should.equal('\u263c');
            tzDiff3.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('13:15 Dec-31-2014 1 - \u263c');
            tzDiff3.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('13:15 Dec-31-2014 -1 \u263c');
            tzDiff4.setOptions({ hour: undefined, hours: undefined, ahead: '+', behind: '-'});
            tzDiff4.format('DIFF').should.equal('1 +');
            tzDiff4.format('diff').should.equal('1');
            tzDiff4.format('sunmoon').should.equal('\u263e');
            tzDiff4.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('02:15 Dec-31-2014 1 + \u263e');
            tzDiff4.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('02:15 Dec-31-2014 1 \u263e');
            tzDiff1.setOptions({ hour: 'hour', hours: 'hours', ahead: 'ahead', behind: 'behind', sun: 'S', moon: 'M'});
            tzDiff1.format('DIFF').should.equal('19 hours behind');
            tzDiff1.format('diff').should.equal('-19 hours');
            tzDiff1.format('sunmoon').should.equal('S');
            tzDiff1.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('14:15 Dec-31-2014 19 hours behind S');
            tzDiff1.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('14:15 Dec-31-2014 -19 hours S');
            tzDiff2.setOptions({ hour: 'hour', hours: 'hours', ahead: 'ahead', behind: 'behind', sun: 'S', moon: 'M'});
            tzDiff2.format('DIFF').should.equal('19 hours ahead');
            tzDiff2.format('diff').should.equal('19 hours');
            tzDiff2.format('sunmoon').should.equal('S');
            tzDiff2.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('09:15 Jan-01-2015 19 hours ahead S');
            tzDiff2.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('09:15 Jan-01-2015 19 hours S');
            tzDiff3.setOptions({ hour: 'hour', hours: 'hours', ahead: 'ahead', behind: 'behind', sun: 'S', moon: 'M'});
            tzDiff3.format('DIFF').should.equal('1 hour behind');
            tzDiff3.format('diff').should.equal('-1 hour');
            tzDiff3.format('sunmoon').should.equal('S');
            tzDiff3.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('13:15 Dec-31-2014 1 hour behind S');
            tzDiff3.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('13:15 Dec-31-2014 -1 hour S');
            tzDiff4.setOptions({ hour: 'hour', hours: 'hours', ahead: 'ahead', behind: 'behind', sun: 'S', moon: 'M'});
            tzDiff4.format('DIFF').should.equal('1 hour ahead');
            tzDiff4.format('diff').should.equal('1 hour');
            tzDiff4.format('sunmoon').should.equal('M');
            tzDiff4.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('02:15 Dec-31-2014 1 hour ahead M');
            tzDiff4.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('02:15 Dec-31-2014 1 hour M');
            tzDiff1.setOptions({ sun: undefined, moon: undefined});
            tzDiff1.format('DIFF').should.equal('19 hours behind');
            tzDiff1.format('diff').should.equal('-19 hours');
            tzDiff1.format('sunmoon').should.equal('');
            tzDiff1.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('14:15 Dec-31-2014 19 hours behind ');
            tzDiff1.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('14:15 Dec-31-2014 -19 hours ');
            tzDiff2.setOptions({ sun: undefined, moon: undefined});
            tzDiff2.format('DIFF').should.equal('19 hours ahead');
            tzDiff2.format('diff').should.equal('19 hours');
            tzDiff2.format('sunmoon').should.equal('');
            tzDiff2.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('09:15 Jan-01-2015 19 hours ahead ');
            tzDiff2.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('09:15 Jan-01-2015 19 hours ');
            tzDiff3.setOptions({ sun: undefined, moon: undefined});
            tzDiff3.format('DIFF').should.equal('1 hour behind');
            tzDiff3.format('diff').should.equal('-1 hour');
            tzDiff3.format('sunmoon').should.equal('');
            tzDiff3.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('13:15 Dec-31-2014 1 hour behind ');
            tzDiff3.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('13:15 Dec-31-2014 -1 hour ');
            tzDiff4.setOptions({ sun: undefined, moon: undefined});
            tzDiff4.format('DIFF').should.equal('1 hour ahead');
            tzDiff4.format('diff').should.equal('1 hour');
            tzDiff4.format('sunmoon').should.equal('');
            tzDiff4.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('02:15 Dec-31-2014 1 hour ahead ');
            tzDiff4.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('02:15 Dec-31-2014 1 hour ');
            // restore default options
            momentTimezoneDiff.setOptions(defaultOptions);
            momentTimezoneDiff.getOptions().should.eql(defaultOptions);
        });
        it('Same timezone values', function () {
            var m = moment.tz([2015, 0, 1, 1, 15, 0], 'Australia/Melbourne'),
                tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Sydney');
            tzDiff.format('DIFF').should.equal('');
            tzDiff.format('diff').should.equal('');
            tzDiff.format('sunmoon').should.equal('\u263e');
            tzDiff.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('01:15 Jan-01-2015  \u263e');
            tzDiff.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('01:15 Jan-01-2015  \u263e');
            tzDiff.format('HH:mm MMM-DD-YYYY [DIFF] sunmoon').should.equal('01:15 Jan-01-2015 DIFF \u263e');
            tzDiff.format('HH:mm MMM-DD-YYYY [diff] sunmoon').should.equal('01:15 Jan-01-2015 diff \u263e');
            tzDiff.format('HH:mm MMM-DD-YYYY [diff] [sunmoon]').should.equal('01:15 Jan-01-2015 diff sunmoon');
            m = moment.tz([2014, 11, 31, 14, 15, 0], 'Australia/ACT');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Melbourne');
            tzDiff.format('DIFF').should.equal('');
            tzDiff.format('diff').should.equal('');
            tzDiff.format('sunmoon').should.equal('\u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY DIFF sunmoon').should.equal('14:15 Dec-31-2014  \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY diff sunmoon').should.equal('14:15 Dec-31-2014  \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY [DIFF] sunmoon').should.equal('14:15 Dec-31-2014 DIFF \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY [diff] sunmoon').should.equal('14:15 Dec-31-2014 diff \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY [diff] [sunmoon]').should.equal('14:15 Dec-31-2014 diff sunmoon');
        });
        it('Legend', function () {
            momentTimezoneDiff.getOptions().should.eql(defaultOptions);
            momentTimezoneDiff.createLegend().should.eql([ '\u263c - 6:00 am .. 7:59 pm', '\u263e - 8:00 pm .. 5:59 am' ]);
            momentTimezoneDiff.setOptions({ legendFormat: 'HH:mm', legendSeparator: '-' });
            momentTimezoneDiff.createLegend().should.eql([ '\u263c - 06:00-19:59', '\u263e - 20:00-05:59' ]);
            momentTimezoneDiff.setOptions({ legendFormat: 'h:m', legendDash: '> ', legendSeparator: '...' });
            momentTimezoneDiff.createLegend().should.eql([ '\u263c> 6:0...7:59', '\u263e> 8:0...5:59' ]);
            momentTimezoneDiff.setOptions({ sun: 'SUN', moon: 'MOON' });
            momentTimezoneDiff.createLegend().should.eql([ 'SUN> 6:0...7:59', 'MOON> 8:0...5:59' ]);
            momentTimezoneDiff.setOptions({ sunRiseHour: 13, sunRiseMinute: 42, sunSetHour: 19, sunSetMinute: 13, legendDash: ' - ', legendSeparator: ' .. ' });
            momentTimezoneDiff.createLegend().should.eql([ 'SUN - 1:42 .. 7:12', 'MOON - 7:13 .. 1:41' ]);
        });
    });
});