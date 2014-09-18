
/*global moment*/

(function (root, factory) {
    "use strict";

    if (typeof exports === 'object') {
        module.exports = factory(require('moment-timezone'));   // Node
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

    function getMinutes(m) {
        return ((m.dayOfYear() - 1) * (24 * 60)) +
               (m.hour() * 60) +
               m.minute();
    }

    function TimezoneDiff(momentReference, timezone) {
        this.momentReference = momentReference;
        this.momentTz = moment(this.momentReference, timezone);
    }

    TimezoneDiff.prototype.diff = function () {
        var minutes = getMinutes(this.momentTz),
            minutesReference = getMinutes(this.momentReference),
            factor,
            fromYear,
            toYear;
        if (this.momentTz.year() === this.momentReference.year()) {
            return minutes - minutesReference;
        }
        if (this.momentTz.year() < this.momentReference.year()) {
            factor = -1;
        } else {
            factor = 1;
        }
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
