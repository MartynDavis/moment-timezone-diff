/*
    moment-timezone-diff.js
    version : 0.5.2
    authors : Martyn Davis
    license : MIT
*/
"use strict";
/*global describe, it*/
var momentTimezoneDiff = require('../scripts/moment-timezone-diff');
describe('options', function () {
    var version = '0.5.2';
    describe('options', function () {
        var defaultOptions = { locale: undefined,
                               ahead: 'ahead',
                               behind: 'behind',
                               sunRiseHour: 6,
                               sunRiseMinute: 0,
                               sunSetHour: 20,
                               sunSetMinute: 0,
                               daytime: '\u263c',  // Unicode white sun with rays
                               nighttime: '\u263e', // Unicode last quarter moon
                               hour: 'hour',
                               hours: 'hours',
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
        it('main', function () {
            var func;
            momentTimezoneDiff.version.should.eql(version);
            momentTimezoneDiff.MODE_TEXTBOX.should.eql(0);
            momentTimezoneDiff.MODE_DROPDOWN_HOUR24.should.eql(1);
            momentTimezoneDiff.MODE_DROPDOWN_HOUR12.should.eql(2);
            momentTimezoneDiff.DATE_ORDER_DMY.should.eql(0);
            momentTimezoneDiff.DATE_ORDER_MDY.should.eql(1);
            momentTimezoneDiff.DATE_ORDER_YMD.should.eql(2);
            (typeof momentTimezoneDiff.DateTimeElements).should.eql('function');
            (typeof momentTimezoneDiff.Environment).should.eql('function');
            (typeof momentTimezoneDiff.TimezoneDiff).should.eql('function');
            (typeof momentTimezoneDiff.getDefaultTimezone).should.eql('function');
            (typeof momentTimezoneDiff.getOptions).should.eql('function');
            (typeof momentTimezoneDiff.setOptions).should.eql('function');
            (typeof momentTimezoneDiff.daytime).should.eql('function');
            (typeof momentTimezoneDiff.createLegend).should.eql('function');
            (typeof momentTimezoneDiff.getVersionInfo).should.eql('function');
            (typeof momentTimezoneDiff.displayVersionInfo).should.eql('function');
            func = function () { new momentTimezoneDiff.DateTimeElements(); };
            func.should.throw('Object can only be created when using a Browser');
            func = function () { new momentTimezoneDiff.Environment(); };
            func.should.throw('Object can only be created when using a Browser');
            func = function () { new momentTimezoneDiff.TimezoneDiff(momentTimezoneDiff.moment(), 'US/Pacific'); };
            func.should.not.throw();
            func = function () { momentTimezoneDiff.displayVersionInfo('blah'); };
            func.should.throw();
        });
        it('defaultOptions', function () {
            momentTimezoneDiff.getOptions().should.eql(defaultOptions);
        });
        it('versionInfo', function () {
            var versions = [ { name: 'moment-timezone-diff', link: 'https://github.com/MartynDavis/moment-timezone-diff/', versionNumber: version },
                             { name: 'moment', link: 'http://momentjs.com/', versionNumber: '2.8.3' },
                             { name: 'moment-timezone', link: 'http://momentjs.com/timezone/', versionNumber: '0.2.3' },
                             { name: 'moment-timezone-data', link: 'http://momentjs.com/timezone/', versionNumber: '2014h' }
                           ],
                i;
            momentTimezoneDiff.getVersionInfo().should.eql(versions);
            for (i = 0; i < versions.length; i += 1) {
                delete versions[i].link;
            }
            momentTimezoneDiff.getVersionInfo({ versionIncludeLinks: false }).should.eql(versions);
        });
        it('get/set', function () {
            var options,
                newOptions1 = { ahead: 'changed ahead', hour: 'changed hours' },
                newOptions2 = { ahead: 'changed ahead again', daytime: 'day', sunRiseHour: 1, sunRiseMinute: 42 };
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
            var m = momentTimezoneDiff.moment.tz([2014, 8, 1, 12, 42, 13], 'US/Pacific'),
                tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'US/Eastern');
            tzDiff.diff().should.equal(3);
            tzDiff.dayDiff().should.equal(0);
            m = momentTimezoneDiff.moment.tz([2014, 11, 31, 23, 42, 13], 'US/Pacific');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'US/Eastern');
            tzDiff.diff().should.equal(3);
            tzDiff.dayDiff().should.equal(1);
            m = momentTimezoneDiff.moment.tz([2015, 0, 1, 1, 42, 13], 'US/Eastern');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'US/Pacific');
            tzDiff.diff().should.equal(-3);
            tzDiff.dayDiff().should.equal(-1);
            m = momentTimezoneDiff.moment.tz([2015, 0, 1, 1, 1, 1], 'Australia/Melbourne');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Perth');
            tzDiff.diff().should.equal(-3);
            tzDiff.dayDiff().should.equal(-1);
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Brisbane');
            tzDiff.diff().should.equal(-1);
            m = momentTimezoneDiff.moment.tz([2014, 7, 7, 7, 7, 7], 'Australia/Melbourne');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Perth');
            tzDiff.diff().should.equal(-2);
            tzDiff.dayDiff().should.equal(0);
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Brisbane');
            tzDiff.diff().should.equal(0);
            tzDiff.dayDiff().should.equal(0);
        });
        it('Format', function () {
            var m = momentTimezoneDiff.moment.tz([2015, 0, 1, 0, 15, 0], 'Australia/Melbourne'),
                tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Adelaide');
            tzDiff.diff().should.equal(-0.5);
            tzDiff.dayDiff().should.equal(-1);
            tzDiff.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('23:45 Dec-31-2014 0.5 hours behind \u263e');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'US/Pacific');
            tzDiff.diff().should.equal(-19);
            tzDiff.dayDiff().should.equal(-1);
            tzDiff.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('05:15 Dec-31-2014 19 hours behind \u263e');
            m = momentTimezoneDiff.moment.tz([2015, 0, 1, 9, 15, 0], 'Australia/Melbourne');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'US/Pacific');
            tzDiff.diff().should.equal(-19);
            tzDiff.dayDiff().should.equal(-1);
            tzDiff.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('14:15 Dec-31-2014 19 hours behind \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('14:15 Dec-31-2014 -19 hours \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY [DIFF] daynight').should.equal('14:15 Dec-31-2014 DIFF \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY [diff] daynight').should.equal('14:15 Dec-31-2014 diff \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY [diff] [daynight]').should.equal('14:15 Dec-31-2014 diff daynight');
        });
        it('Format - escaped', function () {
            var m = momentTimezoneDiff.moment.tz([2015, 0, 1, 9, 15, 0], 'Australia/Melbourne'),
                tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'US/Pacific');
            tzDiff.diff().should.equal(-19);
            tzDiff.format('DIFF').should.equal('19 hours behind');
            tzDiff.format('diff').should.equal('-19 hours');
            tzDiff.format('daynight').should.equal('\u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('14:15 Dec-31-2014 19 hours behind \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('14:15 Dec-31-2014 -19 hours \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY [DIFF] daynight').should.equal('14:15 Dec-31-2014 DIFF \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY [diff] daynight').should.equal('14:15 Dec-31-2014 diff \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY [diff] [daynight]').should.equal('14:15 Dec-31-2014 diff daynight');
            m = momentTimezoneDiff.moment.tz([2014, 11, 31, 14, 15, 0], 'US/Pacific');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Melbourne');
            tzDiff.diff().should.equal(19);
            tzDiff.format('DIFF').should.equal('19 hours ahead');
            tzDiff.format('diff').should.equal('19 hours');
            tzDiff.format('daynight').should.equal('\u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('09:15 Jan-01-2015 19 hours ahead \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('09:15 Jan-01-2015 19 hours \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY [DIFF] daynight').should.equal('09:15 Jan-01-2015 DIFF \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY [diff] daynight').should.equal('09:15 Jan-01-2015 diff \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY [diff] [daynight]').should.equal('09:15 Jan-01-2015 diff daynight');
        });
        it('Daytime', function () {
            var m = momentTimezoneDiff.moment.tz([2015, 0, 1, 9, 15, 0], 'Australia/Melbourne'),
                tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'US/Pacific');
            tzDiff.daytime().should.equal(true);
            momentTimezoneDiff.daytime(m).should.equal(true);
            m = momentTimezoneDiff.moment.tz([2014, 11, 31, 14, 15, 0], 'US/Pacific');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Melbourne');
            tzDiff.daytime().should.equal(true);
            momentTimezoneDiff.daytime(m).should.equal(true);
            m = momentTimezoneDiff.moment.tz([2014, 11, 31, 20, 15, 0], 'US/Pacific');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Melbourne');
            tzDiff.daytime().should.equal(true);
            momentTimezoneDiff.daytime(m).should.equal(false);
            m = momentTimezoneDiff.moment.tz([2014, 11, 31, 20, 15, 0], 'Australia/Melbourne');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Perth');
            tzDiff.daytime().should.equal(true);
            momentTimezoneDiff.daytime(m).should.equal(false);
            m = momentTimezoneDiff.moment.tz([2014, 11, 31, 14, 15, 0], 'Australia/Melbourne');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Perth');
            tzDiff.daytime().should.equal(true);
            momentTimezoneDiff.daytime(m).should.equal(true);
            m = momentTimezoneDiff.moment.tz([2014, 11, 31, 8, 15, 0], 'Australia/Melbourne');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Perth');
            tzDiff.daytime().should.equal(false);
            momentTimezoneDiff.daytime(m).should.equal(true);
            m = momentTimezoneDiff.moment.tz([2014, 11, 31, 1, 15, 0], 'Australia/Melbourne');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Adelaide');
            tzDiff.daytime().should.equal(false);
            momentTimezoneDiff.daytime(m).should.equal(false);
            // Override options within call to daytime()
            momentTimezoneDiff.daytime(m, { sunRiseHour: 1, sunRiseMinute: 0 }).should.equal(true);
            // Default options should not have been affected
            momentTimezoneDiff.daytime(m).should.equal(false);
        });
        function checkDaytime(m, options) {
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
        it('Daytime with options', function () {
            var sunRiseHour,
                sunRiseMinute,
                sunSetHour,
                sunSetMinute,
                m = momentTimezoneDiff.moment.tz([2015, 0, 8, 12, 35, 0], 'Europe/London');
            for (sunRiseHour = 0; sunRiseHour < 24; sunRiseHour += 1) {
                for (sunRiseMinute = 0; sunRiseMinute < 60; sunRiseMinute += 1) {
                    for (sunSetHour = sunRiseHour; sunSetHour < 24; sunSetHour += 1) {
                        for (sunSetMinute = (sunRiseHour === sunSetHour) ? (sunRiseMinute + 1) : 0; sunSetMinute < 60; sunSetMinute += 1) {
                            momentTimezoneDiff.setOptions({ sunRiseHour: sunRiseHour, sunRiseMinute: sunRiseMinute,
                                                            sunSetHour: sunSetHour, sunSetMinute: sunSetMinute });
                            //console.log("daytime(" + sunRiseHour + ":" + sunRiseMinute + "," + sunSetHour + ":" + sunSetMinute + ") - " + m.hour() + ":" + m.minute());
                            momentTimezoneDiff.daytime(m).should.equal(checkDaytime(m, momentTimezoneDiff.getOptions()));
                        }
                    }
                }
            }
            for (sunRiseHour = 0; sunRiseHour < 24; sunRiseHour += 1) {
                for (sunSetHour = sunRiseHour; sunSetHour < 24; sunSetHour += 1) {
                    momentTimezoneDiff.setOptions({ sunRiseHour: sunRiseHour, sunRiseMinute: undefined,
                                                    sunSetHour: sunSetHour, sunSetMinute: undefined });
                    momentTimezoneDiff.daytime(m).should.equal(checkDaytime(m, momentTimezoneDiff.getOptions()));
                }
            }
            // restore default options
            momentTimezoneDiff.setOptions(defaultOptions);
            momentTimezoneDiff.getOptions().should.eql(defaultOptions);
        });
        it('Format with various options values', function () {
            var m1 = momentTimezoneDiff.moment.tz([2015, 0, 1, 9, 15, 0], 'Australia/Melbourne'),
                tzDiff1 = new momentTimezoneDiff.TimezoneDiff(m1, 'US/Pacific'),
                m2 = momentTimezoneDiff.moment.tz([2014, 11, 31, 14, 15, 0], 'US/Pacific'),
                tzDiff2 = new momentTimezoneDiff.TimezoneDiff(m2, 'Australia/Melbourne'),
                m3 = momentTimezoneDiff.moment.tz([2014, 11, 31, 14, 15, 0], 'Australia/Melbourne'),
                tzDiff3 = new momentTimezoneDiff.TimezoneDiff(m3, 'Australia/Brisbane'),
                m4 = momentTimezoneDiff.moment.tz([2014, 11, 31, 1, 15, 0], 'Australia/Brisbane'),
                tzDiff4 = new momentTimezoneDiff.TimezoneDiff(m4, 'Australia/Melbourne');
            tzDiff1.format('DIFF').should.equal('19 hours behind');
            tzDiff1.format('diff').should.equal('-19 hours');
            tzDiff1.format('daynight').should.equal('\u263c');
            tzDiff1.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('14:15 Dec-31-2014 19 hours behind \u263c');
            tzDiff1.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('14:15 Dec-31-2014 -19 hours \u263c');
            tzDiff2.format('DIFF').should.equal('19 hours ahead');
            tzDiff2.format('diff').should.equal('19 hours');
            tzDiff2.format('daynight').should.equal('\u263c');
            tzDiff2.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('09:15 Jan-01-2015 19 hours ahead \u263c');
            tzDiff2.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('09:15 Jan-01-2015 19 hours \u263c');
            tzDiff3.format('DIFF').should.equal('1 hour behind');
            tzDiff3.format('diff').should.equal('-1 hour');
            tzDiff3.format('daynight').should.equal('\u263c');
            tzDiff3.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('13:15 Dec-31-2014 1 hour behind \u263c');
            tzDiff3.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('13:15 Dec-31-2014 -1 hour \u263c');
            tzDiff4.format('DIFF').should.equal('1 hour ahead');
            tzDiff4.format('diff').should.equal('1 hour');
            tzDiff4.format('daynight').should.equal('\u263e');
            tzDiff4.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('02:15 Dec-31-2014 1 hour ahead \u263e');
            tzDiff4.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('02:15 Dec-31-2014 1 hour \u263e');
            tzDiff1.setOptions({ ahead: 'XXXX', behind: 'YYYY' });
            tzDiff1.format('DIFF').should.equal('19 hours YYYY');
            tzDiff1.format('diff').should.equal('-19 hours');
            tzDiff1.format('daynight').should.equal('\u263c');
            tzDiff1.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('14:15 Dec-31-2014 19 hours YYYY \u263c');
            tzDiff1.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('14:15 Dec-31-2014 -19 hours \u263c');
            tzDiff2.setOptions({ ahead: 'XXXX', behind: 'YYYY' });
            tzDiff2.format('DIFF').should.equal('19 hours XXXX');
            tzDiff2.format('diff').should.equal('19 hours');
            tzDiff2.format('daynight').should.equal('\u263c');
            tzDiff2.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('09:15 Jan-01-2015 19 hours XXXX \u263c');
            tzDiff2.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('09:15 Jan-01-2015 19 hours \u263c');
            tzDiff3.setOptions({ ahead: 'XXXX', behind: 'YYYY' });
            tzDiff3.format('DIFF').should.equal('1 hour YYYY');
            tzDiff3.format('diff').should.equal('-1 hour');
            tzDiff3.format('daynight').should.equal('\u263c');
            tzDiff3.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('13:15 Dec-31-2014 1 hour YYYY \u263c');
            tzDiff3.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('13:15 Dec-31-2014 -1 hour \u263c');
            tzDiff4.setOptions({ ahead: 'XXXX', behind: 'YYYY' });
            tzDiff4.format('DIFF').should.equal('1 hour XXXX');
            tzDiff4.format('diff').should.equal('1 hour');
            tzDiff4.format('daynight').should.equal('\u263e');
            tzDiff4.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('02:15 Dec-31-2014 1 hour XXXX \u263e');
            tzDiff4.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('02:15 Dec-31-2014 1 hour \u263e');
            tzDiff1.setOptions({ hour: 'AAAA', hours: 'AAAAs' });
            tzDiff1.format('DIFF').should.equal('19 AAAAs YYYY');
            tzDiff1.format('diff').should.equal('-19 AAAAs');
            tzDiff1.format('daynight').should.equal('\u263c');
            tzDiff1.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('14:15 Dec-31-2014 19 AAAAs YYYY \u263c');
            tzDiff1.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('14:15 Dec-31-2014 -19 AAAAs \u263c');
            tzDiff2.setOptions({ hour: 'AAAA', hours: 'AAAAs' });
            tzDiff2.format('DIFF').should.equal('19 AAAAs XXXX');
            tzDiff2.format('diff').should.equal('19 AAAAs');
            tzDiff2.format('daynight').should.equal('\u263c');
            tzDiff2.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('09:15 Jan-01-2015 19 AAAAs XXXX \u263c');
            tzDiff2.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('09:15 Jan-01-2015 19 AAAAs \u263c');
            tzDiff3.setOptions({ hour: 'AAAA', hours: 'AAAAs' });
            tzDiff3.format('DIFF').should.equal('1 AAAA YYYY');
            tzDiff3.format('diff').should.equal('-1 AAAA');
            tzDiff3.format('daynight').should.equal('\u263c');
            tzDiff3.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('13:15 Dec-31-2014 1 AAAA YYYY \u263c');
            tzDiff3.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('13:15 Dec-31-2014 -1 AAAA \u263c');
            tzDiff4.setOptions({ hour: 'AAAA', hours: 'AAAAs' });
            tzDiff4.format('DIFF').should.equal('1 AAAA XXXX');
            tzDiff4.format('diff').should.equal('1 AAAA');
            tzDiff4.format('daynight').should.equal('\u263e');
            tzDiff4.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('02:15 Dec-31-2014 1 AAAA XXXX \u263e');
            tzDiff4.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('02:15 Dec-31-2014 1 AAAA \u263e');
            tzDiff1.setOptions({ ahead: undefined, behind: undefined });
            tzDiff1.format('DIFF').should.equal('-19 AAAAs');
            tzDiff1.format('diff').should.equal('-19 AAAAs');
            tzDiff1.format('daynight').should.equal('\u263c');
            tzDiff1.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('14:15 Dec-31-2014 -19 AAAAs \u263c');
            tzDiff1.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('14:15 Dec-31-2014 -19 AAAAs \u263c');
            tzDiff2.setOptions({ ahead: undefined, behind: undefined });
            tzDiff2.format('DIFF').should.equal('19 AAAAs');
            tzDiff2.format('diff').should.equal('19 AAAAs');
            tzDiff2.format('daynight').should.equal('\u263c');
            tzDiff2.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('09:15 Jan-01-2015 19 AAAAs \u263c');
            tzDiff2.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('09:15 Jan-01-2015 19 AAAAs \u263c');
            tzDiff3.setOptions({ ahead: undefined, behind: undefined });
            tzDiff3.format('DIFF').should.equal('-1 AAAA');
            tzDiff3.format('diff').should.equal('-1 AAAA');
            tzDiff3.format('daynight').should.equal('\u263c');
            tzDiff3.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('13:15 Dec-31-2014 -1 AAAA \u263c');
            tzDiff3.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('13:15 Dec-31-2014 -1 AAAA \u263c');
            tzDiff4.setOptions({ ahead: undefined, behind: undefined });
            tzDiff4.format('DIFF').should.equal('1 AAAA');
            tzDiff4.format('diff').should.equal('1 AAAA');
            tzDiff4.format('daynight').should.equal('\u263e');
            tzDiff4.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('02:15 Dec-31-2014 1 AAAA \u263e');
            tzDiff4.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('02:15 Dec-31-2014 1 AAAA \u263e');
            tzDiff1.setOptions({ hour: undefined, hours: undefined });
            tzDiff1.format('DIFF').should.equal('-19');
            tzDiff1.format('diff').should.equal('-19');
            tzDiff1.format('daynight').should.equal('\u263c');
            tzDiff1.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('14:15 Dec-31-2014 -19 \u263c');
            tzDiff1.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('14:15 Dec-31-2014 -19 \u263c');
            tzDiff2.setOptions({ hour: undefined, hours: undefined });
            tzDiff2.format('DIFF').should.equal('19');
            tzDiff2.format('diff').should.equal('19');
            tzDiff2.format('daynight').should.equal('\u263c');
            tzDiff2.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('09:15 Jan-01-2015 19 \u263c');
            tzDiff2.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('09:15 Jan-01-2015 19 \u263c');
            tzDiff3.setOptions({ hour: undefined, hours: undefined });
            tzDiff3.format('DIFF').should.equal('-1');
            tzDiff3.format('diff').should.equal('-1');
            tzDiff3.format('daynight').should.equal('\u263c');
            tzDiff3.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('13:15 Dec-31-2014 -1 \u263c');
            tzDiff3.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('13:15 Dec-31-2014 -1 \u263c');
            tzDiff4.setOptions({ hour: undefined, hours: undefined });
            tzDiff4.format('DIFF').should.equal('1');
            tzDiff4.format('diff').should.equal('1');
            tzDiff4.format('daynight').should.equal('\u263e');
            tzDiff4.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('02:15 Dec-31-2014 1 \u263e');
            tzDiff4.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('02:15 Dec-31-2014 1 \u263e');
            tzDiff1.setOptions({ hour: undefined, hours: undefined, ahead: '+', behind: '-'});
            tzDiff1.format('DIFF').should.equal('19 -');
            tzDiff1.format('diff').should.equal('-19');
            tzDiff1.format('daynight').should.equal('\u263c');
            tzDiff1.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('14:15 Dec-31-2014 19 - \u263c');
            tzDiff1.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('14:15 Dec-31-2014 -19 \u263c');
            tzDiff2.setOptions({ hour: undefined, hours: undefined, ahead: '+', behind: '-'});
            tzDiff2.format('DIFF').should.equal('19 +');
            tzDiff2.format('diff').should.equal('19');
            tzDiff2.format('daynight').should.equal('\u263c');
            tzDiff2.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('09:15 Jan-01-2015 19 + \u263c');
            tzDiff2.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('09:15 Jan-01-2015 19 \u263c');
            tzDiff3.setOptions({ hour: undefined, hours: undefined, ahead: '+', behind: '-'});
            tzDiff3.format('DIFF').should.equal('1 -');
            tzDiff3.format('diff').should.equal('-1');
            tzDiff3.format('daynight').should.equal('\u263c');
            tzDiff3.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('13:15 Dec-31-2014 1 - \u263c');
            tzDiff3.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('13:15 Dec-31-2014 -1 \u263c');
            tzDiff4.setOptions({ hour: undefined, hours: undefined, ahead: '+', behind: '-'});
            tzDiff4.format('DIFF').should.equal('1 +');
            tzDiff4.format('diff').should.equal('1');
            tzDiff4.format('daynight').should.equal('\u263e');
            tzDiff4.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('02:15 Dec-31-2014 1 + \u263e');
            tzDiff4.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('02:15 Dec-31-2014 1 \u263e');
            tzDiff1.setOptions({ hour: 'hour', hours: 'hours', ahead: 'ahead', behind: 'behind', daytime: 'S', nighttime: 'M'});
            tzDiff1.format('DIFF').should.equal('19 hours behind');
            tzDiff1.format('diff').should.equal('-19 hours');
            tzDiff1.format('daynight').should.equal('S');
            tzDiff1.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('14:15 Dec-31-2014 19 hours behind S');
            tzDiff1.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('14:15 Dec-31-2014 -19 hours S');
            tzDiff2.setOptions({ hour: 'hour', hours: 'hours', ahead: 'ahead', behind: 'behind', daytime: 'S', nighttime: 'M'});
            tzDiff2.format('DIFF').should.equal('19 hours ahead');
            tzDiff2.format('diff').should.equal('19 hours');
            tzDiff2.format('daynight').should.equal('S');
            tzDiff2.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('09:15 Jan-01-2015 19 hours ahead S');
            tzDiff2.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('09:15 Jan-01-2015 19 hours S');
            tzDiff3.setOptions({ hour: 'hour', hours: 'hours', ahead: 'ahead', behind: 'behind', daytime: 'S', nighttime: 'M'});
            tzDiff3.format('DIFF').should.equal('1 hour behind');
            tzDiff3.format('diff').should.equal('-1 hour');
            tzDiff3.format('daynight').should.equal('S');
            tzDiff3.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('13:15 Dec-31-2014 1 hour behind S');
            tzDiff3.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('13:15 Dec-31-2014 -1 hour S');
            tzDiff4.setOptions({ hour: 'hour', hours: 'hours', ahead: 'ahead', behind: 'behind', daytime: 'S', nighttime: 'M'});
            tzDiff4.format('DIFF').should.equal('1 hour ahead');
            tzDiff4.format('diff').should.equal('1 hour');
            tzDiff4.format('daynight').should.equal('M');
            tzDiff4.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('02:15 Dec-31-2014 1 hour ahead M');
            tzDiff4.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('02:15 Dec-31-2014 1 hour M');
            tzDiff1.setOptions({ daytime: undefined, nighttime: undefined});
            tzDiff1.format('DIFF').should.equal('19 hours behind');
            tzDiff1.format('diff').should.equal('-19 hours');
            tzDiff1.format('daynight').should.equal('');
            tzDiff1.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('14:15 Dec-31-2014 19 hours behind ');
            tzDiff1.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('14:15 Dec-31-2014 -19 hours ');
            tzDiff2.setOptions({ daytime: undefined, nighttime: undefined});
            tzDiff2.format('DIFF').should.equal('19 hours ahead');
            tzDiff2.format('diff').should.equal('19 hours');
            tzDiff2.format('daynight').should.equal('');
            tzDiff2.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('09:15 Jan-01-2015 19 hours ahead ');
            tzDiff2.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('09:15 Jan-01-2015 19 hours ');
            tzDiff3.setOptions({ daytime: undefined, nighttime: undefined});
            tzDiff3.format('DIFF').should.equal('1 hour behind');
            tzDiff3.format('diff').should.equal('-1 hour');
            tzDiff3.format('daynight').should.equal('');
            tzDiff3.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('13:15 Dec-31-2014 1 hour behind ');
            tzDiff3.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('13:15 Dec-31-2014 -1 hour ');
            tzDiff4.setOptions({ daytime: undefined, nighttime: undefined});
            tzDiff4.format('DIFF').should.equal('1 hour ahead');
            tzDiff4.format('diff').should.equal('1 hour');
            tzDiff4.format('daynight').should.equal('');
            tzDiff4.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('02:15 Dec-31-2014 1 hour ahead ');
            tzDiff4.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('02:15 Dec-31-2014 1 hour ');
            // restore default options
            momentTimezoneDiff.setOptions(defaultOptions);
            momentTimezoneDiff.getOptions().should.eql(defaultOptions);
        });
        it('Same timezone values', function () {
            var m = momentTimezoneDiff.moment.tz([2015, 0, 1, 1, 15, 0], 'Australia/Melbourne'),
                tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Sydney');
            tzDiff.format('DIFF').should.equal('');
            tzDiff.format('diff').should.equal('');
            tzDiff.format('daynight').should.equal('\u263e');
            tzDiff.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('01:15 Jan-01-2015  \u263e');
            tzDiff.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('01:15 Jan-01-2015  \u263e');
            tzDiff.format('HH:mm MMM-DD-YYYY [DIFF] daynight').should.equal('01:15 Jan-01-2015 DIFF \u263e');
            tzDiff.format('HH:mm MMM-DD-YYYY [diff] daynight').should.equal('01:15 Jan-01-2015 diff \u263e');
            tzDiff.format('HH:mm MMM-DD-YYYY [diff] [daynight]').should.equal('01:15 Jan-01-2015 diff daynight');
            m = momentTimezoneDiff.moment.tz([2014, 11, 31, 14, 15, 0], 'Australia/ACT');
            tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Melbourne');
            tzDiff.format('DIFF').should.equal('');
            tzDiff.format('diff').should.equal('');
            tzDiff.format('daynight').should.equal('\u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY DIFF daynight').should.equal('14:15 Dec-31-2014  \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY diff daynight').should.equal('14:15 Dec-31-2014  \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY [DIFF] daynight').should.equal('14:15 Dec-31-2014 DIFF \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY [diff] daynight').should.equal('14:15 Dec-31-2014 diff \u263c');
            tzDiff.format('HH:mm MMM-DD-YYYY [diff] [daynight]').should.equal('14:15 Dec-31-2014 diff daynight');
        });
        it('Legend', function () {
            momentTimezoneDiff.getOptions().should.eql(defaultOptions);
            momentTimezoneDiff.createLegend().should.eql([ '\u263c - 6:00 am .. 7:59 pm', '\u263e - 8:00 pm .. 5:59 am' ]);
            momentTimezoneDiff.setOptions({ legendFormat: 'HH:mm', legendSeparator: '-' });
            momentTimezoneDiff.createLegend().should.eql([ '\u263c - 06:00-19:59', '\u263e - 20:00-05:59' ]);
            momentTimezoneDiff.setOptions({ legendFormat: 'h:m', legendDash: '> ', legendSeparator: '...' });
            momentTimezoneDiff.createLegend().should.eql([ '\u263c> 6:0...7:59', '\u263e> 8:0...5:59' ]);
            momentTimezoneDiff.setOptions({ daytime: 'DAY', nighttime: 'NIGHT' });
            momentTimezoneDiff.createLegend().should.eql([ 'DAY> 6:0...7:59', 'NIGHT> 8:0...5:59' ]);
            momentTimezoneDiff.setOptions({ sunRiseHour: 13, sunRiseMinute: 42, sunSetHour: 19, sunSetMinute: 13, legendDash: ' - ', legendSeparator: ' .. ' });
            momentTimezoneDiff.createLegend().should.eql([ 'DAY - 1:42 .. 7:12', 'NIGHT - 7:13 .. 1:41' ]);
            // Override some options via createLegend() parameter
            momentTimezoneDiff.createLegend({ sunRiseHour: 9, legendFormat: 'HH:mm' }).should.eql([ 'DAY - 09:42 .. 19:12', 'NIGHT - 19:13 .. 09:41' ]);
            // The namespace's default options should not have chnaged
            momentTimezoneDiff.createLegend().should.eql([ 'DAY - 1:42 .. 7:12', 'NIGHT - 7:13 .. 1:41' ]);
        });
    });
});