"use strict";

/*global QUnit, sinon, momentTimezoneDiff*/

QUnit.test('Diff', function (assert) {

    var m = moment.tz([2014, 8, 1, 12, 42, 13], 'US/Pacific'),
        tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'US/Eastern');
    assert.ok(tzDiff.diff() === 3, 'Time difference correct');
    
    m = moment.tz([2014, 11, 31, 23, 42, 13], 'US/Pacific');
    tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'US/Eastern');
    assert.ok(tzDiff.diff() === 3, 'Time difference correct when years different');

    m = moment.tz([2015, 0, 1, 1, 1, 1], 'Australia/Melbourne');
    tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Perth');
    assert.ok(tzDiff.diff() === -3, 'Time difference correct when years different and daylight saving difference');
    tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Brisbane');
    assert.ok(tzDiff.diff() === -1, 'Time difference correct when years different and daylight saving difference');

    m = moment.tz([2014, 7, 7, 7, 7, 7], 'Australia/Melbourne');
    tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Perth');
    assert.ok(tzDiff.diff() === -2, 'Time difference correct with no daylight savings differences');
    tzDiff = new momentTimezoneDiff.TimezoneDiff(m, 'Australia/Brisbane');
    assert.ok(tzDiff.diff() === 0, 'Time difference correct with no daylight savings differences');
});
