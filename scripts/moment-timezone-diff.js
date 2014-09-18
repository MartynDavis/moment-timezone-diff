
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
                    sunRise: { hours: 6, minutes: 0 },
                    sunSet: { hours: 19, minutes: 59 },
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
    
    function daysInYear(year) {
        var days = 0,
            i;
        for (i = 1; i <= 12; i += 1) {
            days += moment(year + '-' + ((i < 10) ? '0' : '') + i, "YYYY-MM").daysInMonth();
        }
        return days;
    }

    function getMinutes(m, base) {
        var year,
            minutes = 0;
        if (m.year() > base.year()) {
            for (year = base.year(); year < m.year(); year += 1) {
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
        var minutesTz = getMinutes(this.momentTz, this.momentReference),
            minutesReference = getMinutes(this.momentReference, this.momentTz),
            factor,
            fromYear,
            toYear;
        return (minutesTz - minutesReference) / 60;
    };

    TimezoneDiff.prototype.format = function () {
        return moment.format.apply(this.momentTz, arguments);
    };

    var mtzd = { };
    
    mtzd.TimezoneDiff = TimezoneDiff;
    mtzd.getOptions = getOptions;
    mtzd.setOptions = setOptions;
    
    return mtzd;
}));
