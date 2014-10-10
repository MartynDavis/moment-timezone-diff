/*
    moment-timezone-diff.js
    version : 0.3.0
    authors : Martyn Davis
    license : MIT
*/

/*global moment, $*/
(function (root, factory) {
    "use strict";
    if (typeof exports === 'object') {
        module.exports = factory(require('../moment/moment-timezone'));   // Node
    } else {
        root.momentTimezoneDiff = factory(moment);              // Browser
    }
}(this, function (moment) {
    "use strict";
    function MomentTimezoneDiffException(message) {
       this.message = message;
       this.name = "MomentTimezoneDiffException";
    }
    if (!moment || !moment.tz) {
        if (!moment) {
            throw new MomentTimezoneDiffException('Moment has not been loaded');
        }
        throw new MomentTimezoneDiffException('Moment-timezone has not been loaded');
    }
    // Verify that at least version 2.8.3 of moment.js is being used
    var thirdPartyVersion = moment.version.split('.'),
        major = +thirdPartyVersion[0],
        minor = +thirdPartyVersion[1],
        subminor = +thirdPartyVersion[2];
    if (major < 2 || (major === 2 && minor < 8) || (major === 2 && minor === 8 && subminor < 3)) {
        throw new MomentTimezoneDiffException('Moment Timezone Diff requires moment.js >= 2.8.3. You are using moment.js ' + moment.version + '.');
    }
    // Verify that at least version 0.2.2 of moment-timezone.js is being used
    thirdPartyVersion = moment.tz.version.split('.');
    major = +thirdPartyVersion[0];
    minor = +thirdPartyVersion[1];
    subminor = +thirdPartyVersion[2];
    if (major < 0 || (major === 0 && minor < 2) || (major === 0 && minor === 2 && subminor < 2)) {
        throw new MomentTimezoneDiffException('Moment Timezone Diff requires moment-timezone.js >= 0.2.2. You are using moment-timezone.js ' + moment.tz.version + '.');
    }
    function duplicate(obj) {
        var copy,
            prop;
        if (typeof obj === 'object') {
            copy = { };
            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    copy[prop] = obj[prop];
                }
            }
        }
        return copy;
    }
    // getDefaultTimezone() logic taken from tzdetect.js
    function getDefaultTimezone() {
        function makekey(id) {
            return [-12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function(months){
                var m = moment(now + months * 30 * 24 * 60 * 60 * 1000);
                // NOTE: Locale is not required here
                if (id) {
                    m.tz(id);
                }
                // Compare using day of month, hour and minute (some timezones differ by 30 minutes)
                return m.format("DDHHmm");
            }).join(' ');
        }
        var now = Date.now(),
            lockey = makekey(),
            timezones = moment.tz.names(),
            i;
        if (timezones) {
            for (i = 0; i < timezones.length; i += 1) {
                if (makekey(timezones[i]) === lockey) {
                    return timezones[i];
                }
            }
        }
    }
    var defaultOptions = { locale: undefined,
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
                           legendBreak: false,
                           legendDash: ' - ',
                           legendSeparator: ' .. ',
                           timeFormat: 'dddd h:mm a DD-MMM-YYYY',
                           timeShowTimezoneName: false,
                           defaultTimezone: getDefaultTimezone()
                         },
        MODE_SINGLE = 0,
        MODE_SPLIT_HOUR24 = 1,
        MODE_SPLIT_HOUR12 = 2,
        DATE_ORDER_DMY = 0,
        DATE_ORDER_MDY = 1,
        DATE_ORDER_YMD = 2;
    //
    // daysInYear
    //
    // Calculates the number of days in year
    //
    function daysInYear(year) {
        var days = 0,
            i;
        for (i = 1; i <= 12; i += 1) {
            days += moment(year + '-' + ((i < 10) ? '0' : '') + i, "YYYY-MM").daysInMonth();
        }
        return days;
    }
    //
    // getDays
    //
    // Calculates the number of days since the base year
    //
    // This allows a difference to be calculated should days be in different years
    //
    function getDays(m, baseYear) {
        var year,
            days = 0;
        if (m.year() > baseYear) {
            for (year = baseYear; year < m.year(); year += 1) {
                days += daysInYear(year);
            }
        }
        days += m.dayOfYear() - 1;
        return days;
    }
    //
    // getMinutes
    //
    // Calculates the number of minutes since the base year
    //
    // This allows a difference to be calculated should days be in different years
    //
    function getMinutes(m, baseYear) {
        var year,
            minutes = getDays(m, baseYear) * (24 * 60);
        minutes += (m.hour() * 60) +
                   m.minute();
        return minutes;
    }
    function createElement(type, value) {
        var element = document.createElement(type),
            property;
        if (value) {
            for (property in value) {
                if (value.hasOwnProperty(property)) {
                    element[property] = value[property];
                }
            }
        }
        return element;
    }
    function appendChild(element, child) {
        if (element && child) {
            element.appendChild(child);
        }
        return child;
    }
    function comboValuePresent(combo, value, text) {
        var i;
        value = String(value);
        if (text !== undefined) {
            text = String(text);
        }
        if (combo && combo.options) {
            for (i = 0; i < combo.options.length; i += 1) {
                if (text === undefined) {
                    if (combo.options[i].value === value) {
                        return true;
                    }
                } else {
                    if ((combo.options[i].value === value) && (combo.options[i].textContent === text)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    function addComboValue(combo, value, text) {
        var option;
        if (!comboValuePresent(combo, value, text)) {
            option = document.createElement('option');
            option.text = text ? String(text) : String(value);
            option.value = String(value);
            combo.add(option, null);
        }
    }
    function populateHourOptions(element, format, hours24, locale) {
        var m,
            i;
        for (i = 0; i < (hours24 ? 24 : 12); i += 1) {
            m = moment([2014, 0, 1, i, 0, 0]);
            if (locale) {
                m.locale(locale);
            }
            addComboValue(element, i, m.format(format));
        }
    }
    function populateMinuteOptions(element, format, locale) {
        var m,
            i;
        for (i = 0; i < 60; i += 1) {
            m = moment([2014, 0, 1, 0, i, 0]);
            if (locale) {
                m.locale(locale);
            }
            addComboValue(element, i, m.format(format));
        }
    }
    function populateAmpmOptions(element, format, locale) {
        function add(value, hour) {
            var m;
            m = moment([2014, 0, 1, hour, 0, 0]);
            if (locale) {
                m.locale(locale);
            }
            addComboValue(element, value, m.format(format));
        }
        var values = { 0: 6, 1: 18 },
            prop;
        for (prop in values) {
            if (values.hasOwnProperty(prop)) {
                add(prop, values[prop]);
            }
        }
    }
    function getMonthNames(format, locale) {
        var names = [ ],
            m,
            i;
        for (i = 0; i < 12; i += 1) {
            m = moment([2014, i, 1, 0, 0, 0]);
            if (locale) {
                m.locale(locale);
            }
            names.push(m.format(format));
        }
        return names;
    }
    function getWeekdayNames(format, locale) {
        var names = [ ],
            m = moment([2014, 0, 1, 0, 0, 0]),
            i;
        if (locale) {
            m.locale(locale);
        }
        while (m.day() !== 0) {
            m.add(1, 'day');
        }
        for (i = 0; i < 7; i += 1) {
            names.push(m.format(format));
            m.add(1, 'day');
        }
        return names;
    }
    function populateMonthOptions(element, format, locale) {
        var m,
            i;
        for (i = 0; i < 12; i += 1) {
            m = moment([2014, i, 1, 0, 0, 0]);
            if (locale) {
                m.locale(locale);
            }
            addComboValue(element, i, m.format(format));
        }
    }
    function populateDayOptions(element, format, locale) {
        var m,
            i;
        for (i = 1; i <= 31; i += 1) {
            m = moment([2014, 0, i, 0, 0, 0]);
            if (locale) {
                m.locale(locale);
            }
            addComboValue(element, i, m.format(format));
        }
    }
    function populateYearOptions(element, format, minValue, maxValue, locale) {
        var m,
            i;
        for (i = minValue; i <= maxValue; i += 1) {
            m = moment([i, 0, 1, 0, 0, 0]);
            if (locale) {
                m.locale(locale);
            }
            addComboValue(element, i, m.format(format));
        }
    }
    function populateTimezoneOptions(element, currentTimezoneText) {
        addComboValue(element, '', currentTimezoneText);
    }
    function getOptionValue(options, name, defaultValue) {
        if (options && options.hasOwnProperty(name)) {
            return options[name];
        }
        return defaultValue;
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
    function getDatepickerOnclick(dte, minYear, maxYear) {
        return function () {
            var date = dte.getSelectedDate() || new Date();
            if (date.getFullYear() < minYear) {
                date.setYear(minYear);
            } else if (date.getFullYear() > maxYear) {
                date.setYear(maxYear);
            }
            $(dte._datepicker).datepicker('setDate', date);
            $(dte._datepicker).show().focus().hide();
        };
    }
    function getDatepickerOnSelect(dte) {
        return function () {
            var selected = dte.getSelected(),
                date = $(dte._datepicker).datepicker( "getDate" );
            if (date) {
                if (!selected) {
                    selected = { };
                    selected.hour = 0;
                    selected.minute = 0;
                }
                selected.year = date.getFullYear();
                selected.month = date.getMonth();
                selected.day = date.getDate();
                dte.setSelected(selected);
                // Trigger a change event so the environment is updated
                // Use the timezone control as this is common to all modes
                fireChangeEvent(dte._elements.timezone);
            }
        };
    }
    function createSetCurrentTime(dte) {
        return function() {
            if (dte) {
                dte.setCurrentTime();
                fireChangeEvent(dte._elements.timezone);
            }
        };
    }
    function createOnchange(dte) {
        return function () {
            if (dte) {
                var selected = dte.getSelected(),
                    i;
                if (selected) {
                    for (i = 0; i < dte._callbacks.length; i += 1) {
                        dte._callbacks[i](selected);
                    }
                }
            }
        };
    }
    function getIntialDateTimeValue(format, minYear, locale) {
        var m = moment([minYear, 0, 1, 0, 0, 0]);
        if (locale) {
            m.locale(locale);
        }
        return m.format(format);
    }
    function DateTimeElements(id, options) {
        var element = document.getElementById(id),
            mode = getOptionValue(options, 'mode', MODE_SPLIT_HOUR12),
            timeDelim = getOptionValue(options, 'timeDelim', ':'),
            dateDelim = getOptionValue(options, 'dateDelim', '-'),
            hourFormat = getOptionValue(options, 'hourFormat', (mode === MODE_SINGLE) ? 'h' : ((mode === MODE_SPLIT_HOUR12) ? 'hh' : 'HH')),
            minuteFormat = getOptionValue(options, 'minuteFormat', 'mm'),
            ampmFormat = getOptionValue(options, 'ampmFormat', 'a'),
            yearFormat = getOptionValue(options, 'yearFormat', 'YYYY'),
            monthFormat = getOptionValue(options, 'monthFormat', 'MMM'),
            dayFormat = getOptionValue(options, 'dayFormat', (mode === MODE_SINGLE) ? 'D' : 'DD'),
            elements,
            title,
            dateOrder = getOptionValue(options, 'dateOrder', DATE_ORDER_DMY),
            dateControlsOrder,
            datepickerOptions,
            datepickerLocale,
            minYear = getOptionValue(options, 'minYear', 2010),
            maxYear = getOptionValue(options, 'maxYear', 2020),
            locale = getOptionValue(options, 'locale'),
            property,
            format,
            i;
        if (!element) {
            console.error('Element with id "' + id + '" not found');
            return;
        }
        if (mode === MODE_SINGLE) {
            if (dateOrder === DATE_ORDER_MDY) {
                dateControlsOrder = [ monthFormat, dayFormat, yearFormat];
            } else if (dateOrder === DATE_ORDER_YMD) {
                dateControlsOrder = [ yearFormat, monthFormat, dayFormat ];
            } else {
                dateControlsOrder = [ dayFormat, monthFormat, yearFormat];
            }
            format = hourFormat + timeDelim + minuteFormat;
            if (hourFormat.match(/h/)) {
                format += ' ' + ampmFormat;
            }
            format += ' ' + dateControlsOrder.join(dateDelim);
            // Set how the date is to be displayed
            this._timeDisplayFormat = getOptionValue(options, 'timeDisplayFormat', format);
            // Set how the date can be input-ed
            this._timeInputFormats = getOptionValue(options, 'timeInputFormats');
            if (!this._timeInputFormats) {
                this._timeInputFormats = [ this._timeDisplayFormat ];
                format = 'h' + timeDelim + 'mm a ' + dateControlsOrder.join(dateDelim);
                if (format !== this._timeDisplayFormat) {
                    this._timeInputFormats.push(format);
                }
                format = 'H' + timeDelim + 'mm ' + dateControlsOrder.join(dateDelim);
                if (format !== this._timeDisplayFormat) {
                    this._timeInputFormats.push(format);
                }
            }
            elements = { };
            title = getOptionValue(options, 'timeTitle', 'Enter the required date and time.');
            if (this._timeInputFormats && getOptionValue(options, 'timeTitleShowInputFormats', true)) {
                title += '  ' + getOptionValue(options, 'timeTitleInputFormats', 'Supported formats are:') + '\n';
                if (typeof this._timeInputFormats === 'string') {
                    title += '\n  ' + this._timeInputFormats;
                } else if (this._timeInputFormats) {
                    for (i = 0; i < this._timeInputFormats.length; i += 1) {
                        title += '\n  ' + this._timeInputFormats[i];
                    }
                }
            }
            elements.datetime = appendChild(element, createElement('input', { type: 'text', 
                                                                              title: title, 
                                                                              placeholder: format,
                                                                              className: getOptionValue(options, 'inputClass', 'mtzdInput'), 
                                                                              size: getOptionValue(options, 'size', 18), 
                                                                              maxlength: getOptionValue(options, 'maxlength', 255) 
                                                                            }));
            elements.datetime.value = getIntialDateTimeValue(this._timeDisplayFormat, minYear, locale);
        } else if ((mode === MODE_SPLIT_HOUR24) || (mode === MODE_SPLIT_HOUR12)) {
            elements = { };
            elements.hour = appendChild(element, createElement('select', { title: getOptionValue(options, 'hourTitle', 'Select hour of the day'),
                                                                           className: getOptionValue(options, 'selectClass', 'mtzdSelect'),
                                                                         }));
            populateHourOptions(elements.hour, hourFormat, (mode === MODE_SPLIT_HOUR24), locale);
            appendChild(element, createElement('span', { textContent: timeDelim,
                                                         className: getOptionValue(options, 'timeDelimClass', 'mtzdTimeDelim'),
                                                       }));
            elements.minute = appendChild(element, createElement('select', { title: getOptionValue(options, 'minuteTitle', 'Select minute of the hour'),
                                                                             className: getOptionValue(options, 'selectClass', 'mtzdSelect')
                                                                           }));
            populateMinuteOptions(elements.minute, minuteFormat, locale);
            if ((mode !== MODE_SPLIT_HOUR24)) {
                appendChild(element, createElement('span', { textContent: ' ',
                                                             className: getOptionValue(options, 'delimClass', 'mtzdDelim')
                                                           }));
                elements.ampm = appendChild(element, createElement('select', { title: getOptionValue(options, 'ampmTitle', 'Select morning or afternoon'),
                                                                               className: getOptionValue(options, 'selectClass', 'mtzdSelect')
                                                                             }));
                populateAmpmOptions(elements.ampm, ampmFormat, locale);
            }
            appendChild(element, createElement('span', { textContent: ' ',
                                                         className: getOptionValue(options, 'delimClass', 'mtzdDelim')
                                                       }));
            
            dateOrder = getOptionValue(options, 'dateOrder', DATE_ORDER_DMY);
            if (dateOrder === DATE_ORDER_MDY) {
                dateControlsOrder = [ 1, 0, 2];
            } else if (dateOrder === DATE_ORDER_YMD) {
                dateControlsOrder = [ 2, 1, 0];
            } else {
                dateControlsOrder = [ 0, 1, 2];
            }
            for (i = 0; i < dateControlsOrder.length; i += 1) {
                if (i > 0) {
                    appendChild(element, createElement('span', { textContent: dateDelim,
                                                                 className: getOptionValue(options, 'dateDelimClass', 'mtzdDateDelim'),
                                                               }));
                }
                if (dateControlsOrder[i] === 0) {
                    elements.day = appendChild(element, createElement('select', { title: getOptionValue(options, 'dayTitle', 'Select day of the month'),
                                                                                  className: getOptionValue(options, 'selectClass', 'mtzdSelect')
                                                                                }));
                    populateDayOptions(elements.day, dayFormat, locale);
                } else if (dateControlsOrder[i] === 1) {
                    elements.month = appendChild(element, createElement('select', { title: getOptionValue(options, 'monthTitle', 'Select month of the year'),
                                                                                    className: getOptionValue(options, 'selectClass', 'mtzdSelect')
                                                                                  }));
                    populateMonthOptions(elements.month, monthFormat, locale);
                } else if (dateControlsOrder[i] === 2) {
                    elements.year = appendChild(element, createElement('select', { title: getOptionValue(options, 'yearTitle', 'Select year'),
                                                                                   className: getOptionValue(options, 'selectClass', 'mtzdSelect')
                                                                                 }));
                    populateYearOptions(elements.year, yearFormat, minYear, maxYear, locale);
                }
            }
        } else {
            console.error('Mode "' + mode + '" is invalid');
            return;
        }
        if (getOptionValue(options, 'usejQueryDatepicker', true) && window.jQuery && $ && $.datepicker) {
            datepickerLocale = getOptionValue(options, 'datepickerLocale');
            datepickerOptions = { showButtonPanel: false,
                                  changeYear: true,
                                  changeMonth: true,
                                  yearRange: minYear + ':' + maxYear,
                                  onSelect: getDatepickerOnSelect(this)
                                };
            if (!datepickerLocale) {
                datepickerOptions.dayNames = getWeekdayNames('dddd', locale);
                datepickerOptions.dayNamesShort = getWeekdayNames('ddd', locale);
                datepickerOptions.dayNamesMin = getWeekdayNames('dd', locale);
                datepickerOptions.monthNames = getMonthNames('MMMM', locale);
                datepickerOptions.monthNamesShort = getMonthNames('MMM', locale);
            }
            appendChild(element, createElement('span', { textContent: ' ',
                                                         className: getOptionValue(options, 'delimClass', 'mtzdDelim')
                                                       }));
            this._datepicker = appendChild(element, createElement('input', { type: 'text', 
                                                                             className: getOptionValue(options, 'datepickerClass', 'mtzdDatepicker')
                                                                           }));
            $(this._datepicker).datepicker(datepickerOptions);
            if (datepickerLocale) {
                $(this._datepicker).datepicker( $.datepicker.regional[ datepickerLocale ] );
            }
            this._datepickerImage = appendChild(element, createElement('img', { className: getOptionValue(options, 'datepickerImageClass', 'mtzdDatepickerImage'), 
                                                                                title: getOptionValue(options, 'datepickerTitle', 'Select the date using a calendar'),
                                                                                src: getOptionValue(options, 'datepickerImage', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAUCAMAAAC+oj0CAAAABGdBTUEAALGPC/xhBQAAAwBQTFRFY2RmZ2hqampqb3BydXZ4e3x+Ll2NMWqfJmajN2mjOm6lP3GtPn25XnSKWXaWW32bQ3euRHerSHOkSHirQn26RX68Tn6xS366Y3qQYX6eZX6YfX6AQ4K+RIG/T4CzToO6ToW6U4CyUYW+UIi9V4q8Woq8X42/ZICTZ4GUa4eZbYKZb4SZboidaYWibommbY+tZYmyYoy7eo+iepypdJOyfpiye5y6fpm5RoXBTo7JV4nFUIrIUo/LXI7GW47KXpLHXpLJYpfDY53RbZ7acJvNdaDRgICBioyMj4+SjZaYk5OVlZaZlJiTl5mZgJ65nZ6gmpmtnqCeiaCwjKa0jqm3maurkaW2k627l6i4mam4oJiwoaKlo6ijpaqkpqipqaqsqKuwra2zr7Cyu7y9gqLAkq3Bla/MlLPKobbHoLrGpLrJqL3OurvCv8K9v8S+p8PWrMHUu8TAvsDIuMjVrNbuvNfqu93svuLuwcHBwcLFwsTGxMTEwsPKwMnGxsrEwsnPw8zKxM3KycbIyMvGyM3HycjJycrMyM3Jy8zOzsrPzc3Oy8bdys7Rzc7Ry9DKwdLRxNfXwtPcwdnfxtrbydPVz9LTy9XZzN/f08/U0dLN0tXO0NDT1dTT1dXV1tbZ1trW19zW19rf2dfT2tvW2dnZ2trd2t/Y29zf3Nnd3t/Z3d7ez87jwNrz1Nbo2NPq3dzh2+Db2eHf3uDdwuHsxuDoxuLtz+DhxuHxyeLwzOLxzOTx2eDj3eDn3Obp0ef10u732+zw3O7x3fL03fj74d/c4Nvg4N7i4eHi4uHk4uTj5eLi5OLk5+bk5ufq4+jj5+zm4evt5ejt6eXp6ezl7ezn6+vr4uP25+f85Ovy7ej67+n/6/Dp7fDr7vDv4fL15/P27/Dx7fX56vn86/z78u7w8fHu8fHx8fL08/Xy8vT29/Py9fXx9fX18/X59fb49fb89vjy8/v89/j69/j99vz5+PX//fb++Pn2/P33+vn6+vr8+vz8///7/fz9AAAAAAAAtJTP7AAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAAAAJcEhZcwAAFiQAABYkAZsVxhQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAHXSURBVChTAcwBM/4Aw8KSVFe0wmpSa97BaFaR3nNYWcDf4gBlKSdpUywoGL4NKyoycBouDnUtLS5mAA82L2dONGQOvxlONzVvMEUhdDFFRBIAB0IgIyAfQBBBCkA9ESQiPhdACzpDCQAIOTgMHB08HRQUOzsUFSIeFhMWJSYGADe4uLe4uKy4t7m6urm4tbO1dne1tTMAYOCVjXqIr6fIxsbGxsi7tpCTl4/jVQBe4IrJqorm+eyk+fnq0vrvrdbXq/pQAFzPh86wg+X995389+XM/fWu2dqL9loAXdyEpqCD0/Drqfjr1Mz57aHR0Yz9WwBM225+jm2ao6mZmcSimZ+xfYCBcfRHAFHmsujmpNX365zr6uXK6eGWvdCU8UkATd2q+uyk5vnsgv3k5Mb74ZbY2H/hSQBL5pulxo2or8iJqMWomK+8cnJ8bPNKAEjsnsfVisvV1YXV1cuezdF5bHxh+kcAStWd1e6K1e7Vhezm1aTs7mN6lU/7SgBK1ar5+aTV6uak5uzVx+7yY3qeX/sbAEfVhXhjeIWFhXh7hXh4eYZhX15b50cATeb3/f397Pv9/fn9/f39+unp+fvgRgBHRgICAgICAgICAgICAgIBBAMAAgVPytv2Q9UZjMgAAAAASUVORK5CYII=') 
                                                                              }));
        }
        // Setup timezone dropdown
        appendChild(element, createElement('span', { textContent: ' ',
                                                     className: getOptionValue(options, 'delimClass', 'mtzdDelim')
                                                   }));
        elements.timezone = appendChild(element, createElement('select', { title: getOptionValue(options, 'timezoneTitle', 'Select timezone'),
                                                                           className: getOptionValue(options, 'selectClass', 'mtzdSelect')
                                                                         }));
        populateTimezoneOptions(elements.timezone, getOptionValue(options, 'currentTimezoneText', ''));
        if (getOptionValue(options, 'showCurrentTime', true)) {
            // Setup current time
            appendChild(element, createElement('span', { textContent: ' ',
                                                         className: getOptionValue(options, 'delimClass', 'mtzdDelim')
                                                       }));
            this._currentTime = appendChild(element, createElement('span', { textContent: getOptionValue(options, 'currentTime', '\u25d4'),
                                                                             title: getOptionValue(options, 'currentTimeTitle', 'Current Time'),
                                                                             className: getOptionValue(options, 'currentTimeClass', 'mtzdCurrentTime') }));
        }
        // Register events
        if (this._currentTime) {
            this._currentTime.addEventListener('click', createSetCurrentTime(this), false);
        }
        if (this._datepickerImage) {
            this._datepickerImage.addEventListener('click', getDatepickerOnclick(this, minYear, maxYear), false);
        }
        for (property in elements) {
            if (elements.hasOwnProperty(property)) {
                elements[property].addEventListener('change', createOnchange(this), false);
            }
        }
        // Setup 'this' properties
        this._mode = mode;
        this._elements = elements;
        this._errorClassName = getOptionValue(options, 'errorClass', 'mtzdError');
        this._locale = locale;
        this._callbacks = [ ];
    }
    DateTimeElements.prototype.registerCallback = function (callback) {
        if (callback && (typeof callback === 'function')) {
            this._callbacks.push(callback);
        }
    };
    DateTimeElements.prototype.addTimezone = function (timezone, name) {
        if (this._elements && this._elements.timezone) {
            addComboValue(this._elements.timezone, timezone, name);
        }
    };
    function getSelected(element) {
        if (element) {
            return parseInt(element.options[element.selectedIndex].value, 10);
        }
    }
    function getSelectedValueText(element) {
        if (element) {
            return { value: element.options[element.selectedIndex].value, text: element.options[element.selectedIndex].textContent };
        }
        return undefined;
    }
    function setSelected(element, value, text) {
        var i;
        value = String(value);
        if (text !== undefined) {
            text = String(text);
        }
        if (element && element.options) {
            for (i = 0; i < element.options.length; i += 1) {
                if (text !== undefined) {
                    if ((element.options[i].value === value) && (element.options[i].textContent === text)) {
                        element.selectedIndex = i;
                        return true;
                    }
                } else {
                    if (element.options[i].value === value) {
                        element.selectedIndex = i;
                        return true;
                    }
                }
            }
        }
        return false;
    }
    function setSelectedIndex(element, value) {
        value = parseInt(value, 10);
        if (element) {
            element.selectedIndex = value;
            return true;
        }
        return false;
    }
    function classAdd(element, className) {
        var classNames = element.className ? element.className.split(/\s+/) : [ ],
            i;
        for (i = 0; i < classNames.length; i += 1) {
            if (classNames[i] === className) {
                return;
            }
        }
        classNames.push(className);
        element.className = classNames.join(' ');
    }
    function classRemove(element, className) {
        var classNames = element.className.split(/\s+/),
            i;
        for (i = classNames.length - 1; i >= 0; i -= 1) {
            if (classNames[i] === className) {
                classNames.splice(i, 1);
            }
        }
        element.className = classNames.join(' ');
    }
    DateTimeElements.prototype.getSelected = function () {
        var selected,
            ampm,
            m;
        if (this._mode === MODE_SINGLE) {
            if (this._locale) {
                m = moment(this._elements.datetime.value, this._timeInputFormats, true, this._locale);
            } else {
                m = moment(this._elements.datetime.value, this._timeInputFormats, true);
            }
            if (m.isValid()) {
                selected = { };
                selected.hour = m.hour();
                selected.minute = m.minute();
                selected.month = m.month();
                selected.day = m.date();
                selected.year = m.year();
                selected.timezone = getSelectedValueText(this._elements.timezone);
                classRemove(this._elements.datetime, this._errorClassName);
            } else {
                classAdd(this._elements.datetime, this._errorClassName);
                return;
            }
        } else if ((this._mode === MODE_SPLIT_HOUR12) || (this._mode === MODE_SPLIT_HOUR24)) {
            selected = { };
            selected.hour = getSelected(this._elements.hour);
            selected.minute = getSelected(this._elements.minute);
            selected.day = getSelected(this._elements.day);
            selected.month = getSelected(this._elements.month);
            selected.year = getSelected(this._elements.year);
            if (this._mode === MODE_SPLIT_HOUR12) {
                ampm = getSelected(this._elements.ampm);
                if (ampm !== 0) {
                    selected.hour += 12;
                }
            }
            selected.timezone = getSelectedValueText(this._elements.timezone);
            // Since the month drop down has 31 days, this will cause the date to roll over 1 (Apr, Jun, Sep & Nov) 
            // or 2 or 3 (Feb) days. Therefore, use moment() to calculate the roll over values, so a valid date 
            // is returned and displayed.
            m = moment([selected.year, selected.month, selected.day, selected.hour, selected.minute, 0]);
            if (selected.year !== m.year()) {
                selected.year = m.year();
                setSelected(this._elements.year, m.year());
            }
            if (selected.month !== m.month()) {
                selected.month = m.month();
                setSelected(this._elements.month, m.month());
            }
            if (selected.day !== m.date()) {
                selected.day = m.date();
                setSelected(this._elements.day, m.date());
            }
            if (selected.hour !== m.hour()) {
                selected.hour = m.hour();
                setSelected(this._elements.hour, m.hour());
            }
            if (selected.minute !== m.minute()) {
                selected.minute = m.minute();
                setSelected(this._elements.minute, m.minute());
            }
        } else {
            console.error('Unknown mode "' + this._mode + '"');
        }
        return selected;
    };
    DateTimeElements.prototype.getSelectedDate = function () {
        var selected = this.getSelected(),
            date;
        if (selected) {
            date = new Date(selected.year, selected.month, selected.day, selected.hour, selected.minute, 0, 0);
        }
        return date;
    };
    DateTimeElements.prototype.setSelected = function (selected) {
        var m;
        if (this._mode === MODE_SINGLE) {
            m = moment([selected.year, selected.month, selected.day, selected.hour, selected.minute, 0]);
            if (this._locale) {
                m.locale(this._locale);
            }
            this._elements.datetime.value = m.format(this._timeDisplayFormat);
        } else if ((this._mode === MODE_SPLIT_HOUR12) || (this._mode === MODE_SPLIT_HOUR24)) {
            setSelected(this._elements.year, selected.year);
            setSelected(this._elements.month, selected.month);
            setSelected(this._elements.day, selected.day);
            if (this._mode === MODE_SPLIT_HOUR12) {
                if (selected.hour < 12) {
                    setSelected(this._elements.hour, selected.hour);
                    setSelected(this._elements.ampm, 0);
                } else {
                    setSelected(this._elements.hour, selected.hour - 12);
                    setSelected(this._elements.ampm, 1);
                }
            } else {
                setSelected(this._elements.hour, selected.hour);
            }
            setSelected(this._elements.minute, selected.minute);
        } else {
            console.error('Unknown mode "' + this._mode + '"');
            return;
        }
        if (selected.timezone) {
            if (!setSelected(this._elements.timezone, selected.timezone.value, selected.timezone.text)) {
                setSelectedIndex(this._elements.timezone, 0);
            }
        } else {
            setSelectedIndex(this._elements.timezone, 0);
        }
    };
    DateTimeElements.prototype.setCurrentTime = function () {
        var date = new Date(),
            selected = { };
        selected.hour = date.getHours();
        selected.minute = date.getMinutes();
        selected.month = date.getMonth();
        selected.day = date.getDate();
        selected.year = date.getFullYear();
        selected.timezone = undefined;
        this.setSelected(selected);
    };
    function registerTimezone(timezones, timezone, elementFormats) {
        timezones.push({ timezone: timezone, elementFormats: elementFormats });
    }
    function createLegend(options) {
        function sayRange(fromHour, fromMinute, toHour, toMinute, format, separator) {
            var momentFrom = moment([2014, 0, 1, fromHour, fromMinute, 0]),
                momentTo = moment([2014, 0, 1, toHour, toMinute, 0]);
            momentTo.subtract(1, 'minute');
            return momentFrom.format(format) + separator + momentTo.format(format);
        }
        var lines = [ ];
        if (options) {
            lines.push(options.sun + options.legendDash + sayRange(options.sunRiseHour, options.sunRiseMinute, options.sunSetHour, options.sunSetMinute, options.legendFormat, options.legendSeparator));
            lines.push(options.moon + options.legendDash + sayRange(options.sunSetHour, options.sunSetMinute, options.sunRiseHour, options.sunRiseMinute, options.legendFormat, options.legendSeparator));
        }
        return lines;
    }
    function updateLegend(legendElement, options) {
        var lines = createLegend(options),
            i;
        for (i = 0; i < lines.length; i += 1) {
            if (i > 0) {
                if (options.legendBreak) {
                    appendChild(legendElement, createElement('br'));
                }
            }
            appendChild(legendElement, createElement('span', { textContent: lines[i] }));
        }
    }
    function createSetTimezone(env, timezone, name) {
        return function () {
            if (env) {
                env.setTimezone(timezone, name);
            }
        };
    }
    function invokeAutoUpdate(env) {
        return function () {
            if (env) {
                env.setCurrentTime();
            }
        };
    }
    function getDateTimeElementsCallback(env) {
        return function (selected) {
            if (env) {
                env.updated(selected);
            }
        };
    }
    function Environment(setupOptions, options) {
        var dateTimeElements,
            dateId,
            container,
            formats,
            timeElement,
            legendElement,
            rows,
            cells,
            links = [ ],
            nameNum = -1,
            timezoneNum = -1,
            timeFormats = { },
            name,
            timezone,
            elementFormats,
            tokens,
            token,
            param,
            onchange,
            onclick,
            i,
            j;
        dateTimeElements = getOptionValue(setupOptions, 'dateTimeElements');
        if (!dateTimeElements) {
            dateId = getOptionValue(setupOptions, 'dateId', 'mtzdDate');
            if (dateId) {
                dateTimeElements = new DateTimeElements(dateId);
            }
        }
        container = document.getElementById(getOptionValue(setupOptions, 'containerId', 'mtzdContainer'));
        formats = document.getElementById(getOptionValue(setupOptions, 'formatsId', 'mtzdFormats'));
        timeElement = document.getElementById(getOptionValue(setupOptions, 'timeId', 'mtzdTime'));
        legendElement = document.getElementById(getOptionValue(setupOptions, 'legendId', 'mtzdLegend'));
        if (!container || !container.children || !formats || !formats.children) {
            return;
        }
        formats = formats.children;
        for (i = 0; i < formats.length; i += 1) {
            if (formats[i] && formats[i].textContent) {
                tokens = formats[i].textContent.split(getOptionValue(setupOptions, 'tokenSeparator', '|'));
                for (j = 0; j < tokens.length; j += 1) {
                    token = tokens[j];
                    if (token === 'NAME') {
                        nameNum = i;
                    } else if (token === 'TIMEZONE') {
                        timezoneNum = i;
                    } else if (token === 'LINK') {
                        links.push(i);
                    } else if (token) {
                        timeFormats[i] = token;
                    }
                }
            }
        }
        this._options = duplicate(defaultOptions);
        if (options) {
            setOptionValues(this._options, options);
        }
        this.moment = moment();
        if (this._options.locale) {
            this.moment.locale(this._options.locale);
        }
        this.timezone = undefined;
        this._timezones = [ ];
        this._timeElement = timeElement;
        rows = container.children;
        for (i = 0; i < rows.length; i += 1) {
            if (rows[i] && rows[i].children) {
                cells = rows[i].children;
                name = ((nameNum !== -1) && cells[nameNum]) ? cells[nameNum].textContent : undefined;
                timezone = (timezoneNum !== -1) && cells[timezoneNum] ? (cells[timezoneNum].textContent || '') : undefined;
                elementFormats = [ ];
                for (param in timeFormats) {
                    if (timeFormats.hasOwnProperty(param)) {
                        if (cells[param] && timeFormats[param]) {
                            elementFormats.push( { element: cells[param], format: timeFormats[param] });
                        }
                    }
                }
                if (timezone !== undefined) {
                    if (elementFormats.length) {
                        name = name || timezone;
                        registerTimezone(this._timezones, timezone, elementFormats);
                        if (dateTimeElements) {
                            dateTimeElements.addTimezone(timezone, name);
                        }
                        onclick = createSetTimezone(this, timezone, name);
                        for (j = 0; j < links.length; j += 1) {
                            if (cells[j]) {
                                cells[j].addEventListener('click', onclick, false);
                                classAdd(cells[j], getOptionValue(setupOptions, 'linkClass', 'mtzdLink'));
                            }
                        }
                    }
                }
            }
        }
        if (dateTimeElements) {
            dateTimeElements.registerCallback(getDateTimeElementsCallback(this));
            this._dateTimeElements = dateTimeElements;
        }
        if (legendElement) {
            updateLegend(legendElement, this._options);
        }
        if (getOptionValue(setupOptions, 'autoRefresh', true)) {
            this.refresh();
        }
        if (getOptionValue(setupOptions, 'autoUpdate', false)) {
            setInterval(invokeAutoUpdate(this), getOptionValue(setupOptions, 'autoUpdateSeconds', 30) * 1000);
        }
    }
    Environment.prototype.register = function (timezone, elementFormats) {
        registerTimezone(this._timezones, timezone, elementFormats);
    };
    function updateText(element, text) {
        if (element) {
            element.textContent = text;
        }
    }
    function updateTimezone(m, timezone, elementFormats, options) {
        var tzDiff,
            i;
        if (m && elementFormats) {
            tzDiff = new TimezoneDiff(m, timezone, options);
            for (i = 0; i < elementFormats.length; i += 1) {
                updateText(elementFormats[i].element, tzDiff.format(elementFormats[i].format));
            }
        }
    }
    Environment.prototype.refresh = function () {
        var selected,
            i;
        if (this._dateTimeElements) {
            selected = { };
            selected.hour = this.moment.hour();
            selected.minute = this.moment.minute();
            selected.day = this.moment.date();
            selected.month = this.moment.month();
            selected.year = this.moment.year();
            selected.timezone = this.timezone;
            this._dateTimeElements.setSelected(selected);
        }
        if (this._timeElement) {
            var text = this.moment.format(this._options.timeFormat);
            if (this.timezone && this.timezone.value) {
                text += ' (' + (this._options.timeShowTimezoneName ? this.timezone.text : this.timezone.value) + ')';
            }
            updateText(this._timeElement, text);
        }
        if (this._timezones) {
            for (i = 0; i < this._timezones.length; i += 1) {
                updateTimezone(this.moment, this._timezones[i].timezone, this._timezones[i].elementFormats, this._options);
            }
        }
    };
    Environment.prototype.update = function (value, timezone, name) {
        if (timezone) {
            this.moment = moment.tz(value, timezone);
            this.timezone = { text: (name || timezone), value: timezone };
        } else {
            this.moment = moment(value);
            this.timezone = undefined;
        }
        if (this._options.locale) {
            this.moment.locale(this._options.locale);
        }
        this.refresh();
    };
    Environment.prototype.setCurrentTime = function () {
        this.moment = moment();
        if (this._options.locale) {
            this.moment.locale(this._options.locale);
        }
        this.timezone = undefined;
        this.refresh();
    };
    Environment.prototype.setTimezone = function(timezone, name) {
        // Use the current time/date, for the current timezone, to create the new time/date for the required timezone
        var values = [this.moment.year(), this.moment.month(), this.moment.date(), this.moment.hour(), this.moment.minute(), 0];
        if (timezone) {
            this.moment = moment.tz(values, timezone);
        } else {
            this.moment = moment(values);
        }
        if (this._options.locale) {
            this.moment.locale(this._options.locale);
        }
        this.timezone = { text: (name || timezone), value: timezone };
        this.refresh();
    };
    Environment.prototype.updated = function (selected) {
        var values;
        if (this._dateTimeElements && !selected) {
            selected = this._dateTimeElements.getSelected();
        }
        if (selected) {
            values = [selected.year, selected.month, selected.day, selected.hour, selected.minute, 0];
            if (selected.timezone && selected.timezone.value) {
                this.moment = moment.tz(values, selected.timezone.value);
            } else {
                this.moment = moment(values);
            }
            if (this._options.locale) {
                this.moment.locale(this._options.locale);
            }
            this.timezone = selected.timezone;
            this.refresh();
        }
    };
    function setOptionValues(options, o) {
        var prop;
        for (prop in o) {
            if (o.hasOwnProperty(prop)) {
                options[prop] = o[prop];
            }
        }
    }
    Environment.prototype.getOptions = function () {
        return duplicate(this._options);
    };
    Environment.prototype.setOptions = function (o) {
        setOptionValues(this._options, o);
    };
    Environment.prototype.sunny = function (m, options) {
        return sunny(m, options || this._options);
    };
    function TimezoneDiff(momentReference, timezone, options) {
        this._momentReference = momentReference;
        this._momentTz = moment(momentReference);
        this._momentTz.tz(timezone ? timezone : options.defaultTimezone);
        this._options = duplicate(defaultOptions);
        if (options) {
            setOptionValues(this._options, options);
        }
        if (this._options.locale) {
            this._momentTz.locale(this._options.locale);
        }
    }
    TimezoneDiff.prototype.diff = function () {
        return (getMinutes(this._momentTz, this._momentReference.year()) - getMinutes(this._momentReference, this._momentTz.year())) / 60;
    };
    TimezoneDiff.prototype.dayDiff = function () {
        return (getDays(this._momentTz, this._momentReference.year()) - getDays(this._momentReference, this._momentTz.year())) / 60;
    };
    function sunny(m, options) {
        var hour = m.hour(),
            minute = m.minute(),
            value = false;
        function compare(hour1, minute1, hour2, minute2) {
            if (hour1 !== hour2) {
                return hour1 - hour2;
            }
            return (minute1 || 0) - (minute2 || 0);
        }
        if (options) {
            value = (compare(hour, minute, options.sunRiseHour, options.sunRiseMinute) >= 0) &&
                    (compare(hour, minute, options.sunSetHour, options.sunSetMinute) < 0);
        }
        return value;
    }
    TimezoneDiff.prototype.sunny = function () {
        return sunny(this._momentTz, this._options);
    };
    Environment.prototype.timezoneDiff = function (momentReference, timezone) {
        return new TimezoneDiff(momentReference, timezone, this._options);
    };
    Environment.prototype.createLegend = function () {
        return createLegend(this._options);
    };
    function makeDiffText(d, useSuffix, options) {
        var suffix = '',
            text;
        if (d === 0) {
            return '';
        }
        if (useSuffix) {
            if ((d < 0) && options.behind) {
                suffix = options.behind;
                d = Math.abs(d);
            } else if ((d > 0) && options.ahead) {
                suffix = options.ahead;
                d = Math.abs(d);
            }
        }
        text = String(d);
        if ((Math.abs(d) === 1) && options.hour) {
            text += ' ' + options.hour;
        } else if ((Math.abs(d) !== 1) && options.hours) {
            text += ' ' + options.hours;
        }
        if (suffix) {
            text += ' ' + suffix;
        }
        return text;
    }
    TimezoneDiff.prototype.format = function (f) {
        var re = /^(.*?)\b(DIFF|diff|sunmoon)\b(.*?)$/,
            fNew = '',
            match,
            value,
            hoursDiff = this.diff(),
            process;
        if (f.match(/^\s*$/)) {
            return this._momentTz.format(f);
        }
        while (true) {
            match = re.exec(f);
            if (match) {
                if (match[1]) {
                    fNew += match[1];
                }
                if (match[2]) {
                    if (match[1] && (match[1].substr(match[1].length - 1) === '[') &&
                        match[3] && (match[3].substr(0, 1) === ']')) {
                        fNew += match[2] + ']';
                        f = match[3].substr(1);
                    } else {
                        if (match[2] === 'DIFF') {
                            value = makeDiffText(hoursDiff, true, this._options);
                        } else if (match[2] === 'diff') {
                            value = makeDiffText(hoursDiff, false, this._options);
                        } else if (match[2] === 'sunmoon') {
                            value = sunny(this._momentTz, this._options) ? (this._options.sun || '') : (this._options.moon || '');
                        } else {
                            value = match[2];
                        }
                        if (value) {
                            // Enclose value within [] so that moment.format does not replace it
                            fNew += '[' + value + ']';
                        }
                        f = match[3];
                    }
                } else {
                    f = match[3];
                }
            } else {
                fNew += f;
                break;
            }
        }
        if (fNew === '') {
            return '';
        }
        return this._momentTz.format(fNew);
    };
    TimezoneDiff.prototype.getOptions = function () {
        return duplicate(this._options);
    };
    TimezoneDiff.prototype.setOptions = function (o) {
        setOptionValues(this._options, o);
    };
    var mtzd = { };
    mtzd.version = '0.3.0';
    mtzd.MODE_SINGLE = MODE_SINGLE;
    mtzd.MODE_SPLIT_HOUR24 = MODE_SPLIT_HOUR24;
    mtzd.MODE_SPLIT_HOUR12 = MODE_SPLIT_HOUR12;
    mtzd.DATE_ORDER_DMY = DATE_ORDER_DMY;
    mtzd.DATE_ORDER_MDY = DATE_ORDER_MDY;
    mtzd.DATE_ORDER_YMD = DATE_ORDER_YMD;
    mtzd.DateTimeElements = DateTimeElements;
    mtzd.Environment = Environment;
    mtzd.TimezoneDiff = TimezoneDiff;
    mtzd.getDefaultTimezone = getDefaultTimezone;
    mtzd.getOptions = function () {
        return duplicate(defaultOptions);
    };
    mtzd.setOptions = function (o) {
        setOptionValues(defaultOptions, o);
    };
    mtzd.sunny = function (m, options) {
        return sunny(m, options || defaultOptions);
    };
    mtzd.createLegend = function (options) {
        return createLegend(options || defaultOptions);
    };
    return mtzd;
}));