
/*global document, Option, moment*/
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
    var defaultOptions = { ahead: 'ahead',
                           behind: 'behind',
                           sunRise: { hour: 6, minute: 0 },
                           sunSet: { hour: 20, minute: 0 },
                           sun: '\u263c',  // Unicode white sun with rays
                           moon: '\u263e', // Unicode last quarter moon
                           hour: 'hour',
                           hours: 'hours',
                           legendFormat: 'h:mm a',
                           legendBreak: true,
                           legendDash: ' - ',
                           legendSeparator: ' .. ',
                           timeFormat: 'dddd h:mm a MMM-DD-YYYY',
                           timeShowTimezoneName: true
                         },
        MODE_SINGLE = 0,
        MODE_SPLIT_HOUR24 = 1,
        MODE_SPLIT_HOUR12 = 2;
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
    // getMinutes
    //
    // Calculates the number of minutes since the base year
    //
    // This allows a difference to be calculated should dayes be in different years
    //
    function getMinutes(m, baseYear) {
        var year,
            minutes = 0;
        if (m.year() > baseYear) {
            for (year = baseYear; year < m.year(); year += 1) {
                minutes += daysInYear(year) * (24 * 60);
            }
        }
        minutes += ((m.dayOfYear() - 1) * (24 * 60)) +
                   (m.hour() * 60) +
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
    function comboValuePresent(combo, text, value) {
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
    function addComboValue(combo, text, value) {
        if (!comboValuePresent(combo, text, value)) {
            combo.options[combo.options.length] = new Option((text ? String(text) : String(value)), String(value));
        }
    }
    function populateHourOptions(element, format, hours24) {
        var m,
            i;
        for (i = 0; i < (hours24 ? 24 : 12); i += 1) {
            m = moment([2014, 0, 1, i, 0, 0]);
            addComboValue(element, m.format(format), i);
        }
    }
    function populateMinuteOptions(element, format) {
        var m,
            i;
        for (i = 0; i < 60; i += 1) {
            m = moment([2014, 0, 1, 0, i, 0]);
            addComboValue(element, m.format(format), i);
        }
    }
    function populateAmpmOptions(element, format) {
        function add(value, hour) {
            var m;
            m = moment([2014, 0, 1, hour, 0, 0]);
            addComboValue(element, m.format(format), value);
        }
        var values = { 0: 6, 1: 18 },
            prop;
        for (prop in values) {
            if (values.hasOwnProperty(prop)) {
                add(prop, values[prop]);
            }
        }
    }
    function populateMonthOptions(element, format) {
        var m,
            i;
        for (i = 0; i < 12; i += 1) {
            m = moment([2014, i, 1, 0, 0, 0]);
            addComboValue(element, m.format(format), i);
        }
    }
    function populateDayOptions(element, format) {
        var m,
            i;
        for (i = 1; i <= 31; i += 1) {
            m = moment([2014, 0, i, 0, 0, 0]);
            addComboValue(element, m.format(format), i);
        }
    }
    function populateYearOptions(element, format, minValue, maxValue) {
        var m,
            i;
        for (i = minValue; i <= maxValue; i += 1) {
            m = moment([i, 0, 1, 0, 0, 0]);
            addComboValue(element, m.format(format), i);
        }
    }
    function populateTimezoneOptions(element, currentTimezoneText) {
        addComboValue(element, currentTimezoneText, '');
    }
    function getOptionValue(options, name, defaultValue) {
        if (options && (options[name] !== undefined)) {
            return options[name];
        }
        return defaultValue;
    }
    function DateTimeElements(id, options) {
        var element = document.getElementById(id),
            mode = getOptionValue(options, 'mode', MODE_SPLIT_HOUR12),
            timeDelim = getOptionValue(options, 'timeDelim', ':'),
            dateDelim = getOptionValue(options, 'dateDelim', '-'),
            hourFormat = getOptionValue(options, 'hourFormat', (mode === MODE_SPLIT_HOUR12) ? 'hh' : 'HH'),
            elements;
        if (!element) {
            console.error('Element with id "' + id + '" not found');
            return;
        }
        if (mode === MODE_SINGLE) {
            elements = { };
            elements.single = appendChild(element, createElement('input', {type: 'text', maxlength: getOptionValue(options, 'maxlength', 255) }));
        } else if ((mode === MODE_SPLIT_HOUR24) || (mode === MODE_SPLIT_HOUR12)) {
            elements = { };
            elements.hour = appendChild(element, createElement('select'));
            populateHourOptions(elements.hour, hourFormat, (mode === MODE_SPLIT_HOUR24));
            appendChild(element, createElement('span', { textContent: timeDelim }));
            elements.minute = appendChild(element, createElement('select'));
            populateMinuteOptions(elements.minute, getOptionValue(options, 'minuteFormat', 'mm'));
            if ((mode !== MODE_SPLIT_HOUR24)) {
                appendChild(element, createElement('span', { textContent: ' ' }));
                elements.ampm = appendChild(element, createElement('select'));
                populateAmpmOptions(elements.ampm, getOptionValue(options, 'ampmFormat', 'a'));
            }
            appendChild(element, createElement('span', { textContent: ' ' }));
            elements.month = appendChild(element, createElement('select'));
            populateMonthOptions(elements.month, getOptionValue(options, 'monthFormat', 'MMM'));
            appendChild(element, createElement('span', { textContent: dateDelim }));
            elements.day = appendChild(element, createElement('select'));
            populateDayOptions(elements.day, getOptionValue(options, 'dayFormat', 'DD'));
            appendChild(element, createElement('span', { textContent: dateDelim }));
            elements.year = appendChild(element, createElement('select'));
            populateYearOptions(elements.year, getOptionValue(options, 'yearFormat', 'YYYY'),
                                               getOptionValue(options, 'minYear', 2010),
                                               getOptionValue(options, 'maxYear', 2020));
        } else {
            console.error('Mode "' + mode + '" is invalid');
            return;
        }
        appendChild(element, createElement('span', { textContent: ' ' }));
        elements.timezone = appendChild(element, createElement('select'));
        populateTimezoneOptions(elements.timezone, getOptionValue(options, 'currentTimezoneText', ''));
        appendChild(element, createElement('span', { textContent: ' ' }));
        this.currentTime = appendChild(element, createElement('a', { textContent: getOptionValue(options, 'currentTime', '\u25d4'),
                                                                     href: '#',
                                                                     title: getOptionValue(options, 'currentTimeTitle', 'Current Time'),
                                                                     className: getOptionValue(options, 'currentTimeClass', 'CurrentTime') }));
        this.mode = mode;
        this.elements = elements;
    }
    DateTimeElements.prototype.addTimezone = function (name, timezone) {
        if (this.elements && this.elements.timezone) {
            addComboValue(this.elements.timezone, name, timezone);
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
                        break;
                    }
                } else {
                    if (element.options[i].value === value) {
                        element.selectedIndex = i;
                        break;
                    }
                }
            }
        }
    }
    function setSelectedIndex(element, value) {
        value = parseInt(value, 10);
        if (element) {
            element.selectedIndex = value;
        }
    }
    DateTimeElements.prototype.getSelected = function () {
        var selected,
            ampm;
        if (this.mode === MODE_SINGLE) {
            selected = { };
            selected.timezone = getSelectedValueText(this.elements.timezone);
        } else if ((this.mode === MODE_SPLIT_HOUR12) || (this.mode === MODE_SPLIT_HOUR24)) {
            selected = { };
            selected.hour = getSelected(this.elements.hour);
            selected.minute = getSelected(this.elements.minute);
            selected.month = getSelected(this.elements.month);
            selected.day = getSelected(this.elements.day);
            selected.year = getSelected(this.elements.year);
            if (this.mode === MODE_SPLIT_HOUR12) {
                ampm = getSelected(this.elements.ampm);
                if (ampm === 0) {
                    if (selected.hour === 12) {
                        selected.hour = 0;
                    }
                } else {
                    if (selected.hour < 12) {
                        selected.hour += 12;
                    }
                }
            }
            selected.timezone = getSelectedValueText(this.elements.timezone);
        } else {
            console.error('Unknown mode "' + this.mode + '"');
        }
        return selected;
    };
    DateTimeElements.prototype.setSelected = function (selected) {
        var hour,
            ampm;
        if (this.mode === MODE_SINGLE) {
        } else if ((this.mode === MODE_SPLIT_HOUR12) || (this.mode === MODE_SPLIT_HOUR24)) {
            setSelected(this.elements.year, selected.year);
            setSelected(this.elements.month, selected.month);
            setSelected(this.elements.day, selected.day);
            hour = selected.hour;
            if (this.mode === MODE_SPLIT_HOUR12) {
                if (hour === 0) {
                    hour = 12;
                    ampm = 0;
                } else if (hour < 12) {
                    ampm = 0;
                } else if (hour === 12) {
                    ampm = 1;
                } else {
                    hour -= 12;
                    ampm = 1;
                }
                setSelected(this.elements.ampm, ampm);
            }
            setSelected(this.elements.hour, hour);
            setSelected(this.elements.minute, selected.minute);
            if (selected.timezone && selected.timezone.value) {
                setSelected(this.elements.timezone, selected.timezone.value, selected.timezone.text);
            } else {
                setSelectedIndex(this.elements.timezone, 0);
            }
        } else {
            console.error('Unknown mode "' + this.mode + '"');
        }
    };
    function registerTimezone(timezones, name, timezone, elementFormats) {
        timezones.push({ name: name, timezone: timezone, elementFormats: elementFormats });
    }
    function createLegend(options) {
        function sayRange(from, to, format, separator) {
            var momentFrom = moment([2014, 0, 1, from.hour, from.minute, 0]),
                momentTo = moment([2014, 0, 1, to.hour, to.minute, 0]);
            momentTo.subtract(1, 'minute');
            return momentFrom.format(format) + separator + momentTo.format(format);
        }
        var lines = [ ];
        if (options && options.sunRise && options.sunSet) {
            lines.push(options.sun + options.legendDash + sayRange(options.sunRise, options.sunSet, options.legendFormat, options.legendSeparator));
            lines.push(options.moon + options.legendDash + sayRange(options.sunSet, options.sunRise, options.legendFormat, options.legendSeparator));
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
                } else {
                    appendChild(legendElement, createElement('span', { textContent: ' ' }));
                }
            }
            appendChild(legendElement, createElement('span', { textContent: lines[i] }));
        }
    }
    function createOnchange(env) {
        return function () {
            if (env) {
                env.updated();
            }
        };
    }
    function createSetCurrentTime(env) {
        return function() {
            if (env) {
                env.setCurrentTime();
            }
            return false;
        };
    }
    
    function Environment(setupOptions, options) {
        var dateTimeElements,
            container,
            formats,
            timeElement,
            legendElement,
            rows,
            cells,
            nameNum = -1,
            timezoneNum = -1,
            timeFormats = { },
            name,
            timezone,
            elementFormats,
            token,
            param,
            onchange,
            i;
        dateTimeElements = getOptionValue(setupOptions, 'dateTimeElements') || new DateTimeElements('mtzdDate');
        container = document.getElementById(getOptionValue(setupOptions, 'containerId', 'mtzdContainer'));
        formats = document.getElementById(getOptionValue(setupOptions, 'formatsId', 'mtzdFormats'));
        timeElement = document.getElementById(getOptionValue(setupOptions, 'timeId', 'mtzdTime'));
        legendElement = document.getElementById(getOptionValue(setupOptions, 'legendId', 'mtzdLegend'));
        if (!container || !container.children || !formats || !formats.children) {
            return;
        }
        formats = formats.children;
        for (i = 0; i < formats.length; i += 1) {
            if (formats[i]) {
                token = formats[i].textContent;
                if (token === 'NAME') {
                    nameNum = i;
                } else if (token === 'TIMEZONE') {
                    timezoneNum = i;
                } else if (token) {
                    timeFormats[i] = token;
                }
            }
        }
        this.moment = moment();
        this.timezone = undefined;
        this.timezones = [ ];
        this.options = duplicate(defaultOptions);
        if (options) {
            setOptionValues(this.options, options);
        }
        this.timeElement = timeElement;
        rows = container.children;
        for (i = 0; i < rows.length; i += 1) {
            if (rows[i] && rows[i].children) {
                cells = rows[i].children;
                name = ((nameNum !== -1) && cells[nameNum]) ? cells[nameNum].textContent : undefined;
                timezone = (timezoneNum !== -1) && cells[timezoneNum] ? cells[timezoneNum].textContent : undefined;
                elementFormats = [ ];
                for (param in timeFormats) {
                    if (timeFormats.hasOwnProperty(param)) {
                        if (cells[param] && timeFormats[param]) {
                            elementFormats.push( { element: cells[param], format: timeFormats[param] });
                        }
                    }
                }
                if (timezone && elementFormats.length) {
                    name = name || timezone;
                    registerTimezone(this.timezones, name, timezone, elementFormats);
                    if (dateTimeElements) {
                        dateTimeElements.addTimezone(name, timezone);
                    }
                }
            }
        }
        if (dateTimeElements) {
            if (dateTimeElements.elements) {
                onchange = createOnchange(this);
                for (param in dateTimeElements.elements) {
                    if (dateTimeElements.elements.hasOwnProperty(param)) {
                        dateTimeElements.elements[param].onchange = onchange;
                    }
                }
            }
            if (dateTimeElements.currentTime) {
                dateTimeElements.currentTime.onclick = createSetCurrentTime(this);
            }
            this.dateTimeElements = dateTimeElements;
        }
        if (legendElement) {
            updateLegend(legendElement, this.options);
        }
    }
    Environment.prototype.register = function (name, timezone, elementFormats) {
        registerTimezone(this.timezones, name, timezone, elementFormats);
    };
    function updateText(element, text) {
        if (element) {
            element.textContent = text;
        }
    }
    function updateTimezone(m, timezone, elementFormats, options) {
        var tzDiff,
            i;
        if (m && timezone && elementFormats) {
            tzDiff = new TimezoneDiff(m, timezone, options);
            for (i = 0; i < elementFormats.length; i += 1) {
                updateText(elementFormats[i].element, tzDiff.format(elementFormats[i].format));
            }
        }
    }
    Environment.prototype.refresh = function () {
        var selected,
            i;
        if (this.dateTimeElements) {
            selected = { };
            selected.hour = this.moment.hour();
            selected.minute = this.moment.minute();
            selected.day = this.moment.date();
            selected.month = this.moment.month();
            selected.year = this.moment.year();
            selected.timezone = this.timezone;
            this.dateTimeElements.setSelected(selected);
        }
        if (this.timeElement) {
            var text = this.moment.format(this.options.timeFormat);
            if (this.timezone && this.timezone.value) {
                text += ' (' + (this.options.timeShowTimezoneName ? this.timezone.text : this.timezone.value) + ')';
            }
            updateText(this.timeElement, text);
        }
        if (this.timezones) {
            for (i = 0; i < this.timezones.length; i += 1) {
                updateTimezone(this.moment, this.timezones[i].timezone, this.timezones[i].elementFormats, this.options);
            }
        }
    };
    Environment.prototype.update = function (values, timezone, name) {
        if (timezone) {
            this.moment = moment(values, timezone);
            this.timezone = { name: name, timezone: timezone };
        } else {
            this.moment = moment(values);
            this.timezone = undefined;
        }
        this.refresh();
    };
    Environment.prototype.updated = function () {
        var selected;
        if (this.dateTimeElements) {
            selected = this.dateTimeElements.getSelected();
        }
        if (selected) {
            if (selected.timezone && selected.timezone.value) {
                this.moment = moment.tz([selected.year, selected.month, selected.day, selected.hour, selected.minute, 0], selected.timezone.value);
                this.timezone = selected.timezone;
            } else {
                this.moment = moment([selected.year, selected.month, selected.day, selected.hour, selected.minute, 0]);
                this.timezone = undefined;
            }
            this.refresh();
        }
    };
    Environment.prototype.setCurrentTime = function () {
        this.moment = moment();
        this.timezone = undefined;
        this.refresh();
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
        return duplicate(this.options);
    };
    Environment.prototype.setOptions = function (o) {
        setOptionValues(this.options, o);
    };
    Environment.prototype.sunny = function (m, options) {
        return sunny(m, options || this.options);
    };
    function TimezoneDiff(momentReference, timezone, options) {
        this.momentReference = momentReference;
        this.momentTz = moment.tz(momentReference, timezone);
        this.options = duplicate(defaultOptions);
        if (options) {
            setOptionValues(this.options, options);
        }
    }
    TimezoneDiff.prototype.diff = function () {
        return (getMinutes(this.momentTz, this.momentReference.year()) - getMinutes(this.momentReference, this.momentTz.year())) / 60;
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
        if (options && options.sunRise && options.sunSet) {
            value = (compare(hour, minute, options.sunRise.hour, options.sunRise.minute) >= 0) &&
                    (compare(hour, minute, options.sunSet.hour, options.sunSet.minute) < 0);
        }
        return value;
    }
    TimezoneDiff.prototype.sunny = function () {
        return sunny(this.momentTz, this.options);
    };
    Environment.prototype.timezoneDiff = function (momentReference, timezone) {
        return new TimezoneDiff(momentReference, timezone, this.options);
    };
    Environment.prototype.createLegend = function () {
        return createLegend(this.options);
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
            return this.momentTz.format(f);
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
                            value = makeDiffText(hoursDiff, true, this.options);
                        } else if (match[2] === 'diff') {
                            value = makeDiffText(hoursDiff, false, this.options);
                        } else if (match[2] === 'sunmoon') {
                            value = sunny(this.momentTz, this.options) ? (this.options.sun || '') : (this.options.moon || '');
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
        return this.momentTz.format(fNew);
    };
    TimezoneDiff.prototype.getOptions = function () {
        return duplicate(this.options);
    };
    TimezoneDiff.prototype.setOptions = function (o) {
        setOptionValues(this.options, o);
    };
    var mtzd = { };
    mtzd.MODE_SINGLE = MODE_SINGLE;
    mtzd.MODE_SPLIT_HOUR24 = MODE_SPLIT_HOUR24;
    mtzd.MODE_SPLIT_HOUR12 = MODE_SPLIT_HOUR12;
    mtzd.DateTimeElements = DateTimeElements;
    mtzd.Environment = Environment;
    mtzd.TimezoneDiff = TimezoneDiff;
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