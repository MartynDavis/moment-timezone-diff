
/*global moment*/

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
    
    var options = { ahead: 'ahead',
                    behind: 'behind',
                    sunRise: { hour: 6, minute: 0 },
                    sunSet: { hour: 19, minute: 59 },
                    sun: '\u263c',  // Unicode white sun with rays
                    moon: '\u263e', // Unicode last quarter moon
                    hour: 'hour',
                    hours: 'hours'
                  };

    function setOptions(o) {
        var prop;
        for (prop in o) {
            if (o.hasOwnProperty(prop)) {
                options[prop] = o[prop];
            }
        }
    }

    function getOptions() {
        var copy = { },
            prop;
        for (prop in options) {
            if (options.hasOwnProperty(prop)) {
                copy[prop] = options[prop];
            }
        }
        return copy;
    }
    
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

    function TimezoneDiff(momentReference, timezone) {
        this.momentReference = momentReference;
        this.momentTz = moment.tz(momentReference, timezone);
    }

    TimezoneDiff.prototype.diff = function () {
        return (getMinutes(this.momentTz, this.momentReference.year()) - getMinutes(this.momentReference, this.momentTz.year())) / 60;
    };

    function sunny(m) {
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
        return sunny(this.momentTz);
    };

    function makeDiffText(d, useSuffix) {
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
                            value = makeDiffText(hoursDiff, true);
                        } else if (match[2] === 'diff') {
                            value = makeDiffText(hoursDiff, false);
                        } else if (match[2] === 'sunmoon') {
                            value = sunny(this.momentTz) ? (options.sun || '') : (options.moon || '');
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

    var mtzd = { };
    
    mtzd.TimezoneDiff = TimezoneDiff;
    mtzd.getOptions = getOptions;
    mtzd.setOptions = setOptions;
    mtzd.sunny = sunny;
    
    return mtzd;
}));
