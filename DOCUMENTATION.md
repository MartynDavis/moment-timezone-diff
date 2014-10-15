
# Moment Timezone Difference

To use moment-timezone-diff, you will need [moment@2.8.3+](http://momentjs.com/), [moment-timezone@0.2.2](http://momentjs.com/timezone/), and the [moment-timezone](http://momentjs.com/timezone/) data.

## Browser

Include the [moment](http://momentjs.com/) and [moment-timezone](http://momentjs.com/timezone/) files, and then include *moment-timezone-diff.js*.

	<script src="moment+locales.js"></script>
	<script src="moment-timezone-all-years.js"></script>
	<script src="moment-timezone-diff.js"></script>

See [moment-timezone](http://momentjs.com/timezone/) 

## Node.js

Include the [moment-timezone](http://momentjs.com/timezone/) files, and then include *moment-timezone-diff.js*.

	var moment = require('moment-timezone'),
		momentTimezoneDiff = require('moment-timezone-diff');

# Namespace

The *momentTimezoneDiff* namespace allows access to the top-level properties, methods and classes. 

Name | Type | Description
-----|------|------------
version | String | Version of moment-timezone-diff.js
MODE_TEXTBOX | Number | Date time elements use a single text box for the date & time.
MODE_DROPDOWN_HOUR24 | Number | Date time elements use multiple drop down controls for date & time where hours is expressed using the 24 hour clock.
MODE_DROPDOWN_HOUR12 | Number | Date time elements use multiple drop down controls for date & time where hours is expressed using the 12 hour clock.
DATE_ORDER_DMY | Number | Date drop down controls are ordered day, month and year.
DATE_ORDER_MDY | Number | Date drop down controls are ordered month, day and year.
DATE_ORDER_YMD | Number | Date drop down controls are ordered year, month & day.
Environment | Class Constructor | Creates a new timezone difference environment within an HTML page.<br>Browser only.
DateTimeElements | Class Constructor | Creates a new timezone difference date & time controls within an HTML page.<br>Browser only.
TimezoneDiff | Class Constructor | Allows calculation of the difference between two timezones for a given moment in time.
getDefaultTimezone | function| Gets a valid timezone which best matches the current timezone.
getOptions | function | Gets a copy of the current options.
setOptions | function | Sets one or more option properties.
daytime | function | Determines whether a given moment is in the daytime.
createLegend | function | Returns an array of strings which present the legend. 

## getDefaultTimezone

	String momentTimezoneDiff.getDefaultTimeZone()

Uses logic incorporated from [tzdetect](https://github.com/Canop/tzdetect.js) to provide a timezone which best represents the user's current timezone.

## getOptions

	Object momentTimezoneDiff.getOptions()

Returns a copy of the default options, which are used when creating Environment, DateTimeElements and TimezoneDiff objects, should options not be explicitly specified.

## setOptions

	momentTimezoneDiff.setOptions(Object options)

Sets the default option values to those specified within the *options* parameter.

## daytime

	Boolean momentTimezoneDiff.daytime(Moment moment, [Object options])

For a given moment and option values, returns whether the time of day presents daytime, as determined by the configured sunrise and sunset times.  See options sunRiseHour, sunRiseMinute, sunSetHour & sunSetMinute values for more information.  If *options * is not specified, the namespace's default options are used.

## createLegend

	Array momentTimezoneDiff.createLegend([Object options])

For the given options, returns an array of String values which show the daytime and nighttime times   If *options * is not specified, the namespace's default options are used. 

# Options

The moment-timezone-diff namespace default options are used to control the behaviour of the Environment, DateTimeElements and TimezoneDiff objects, unless overridden at creation time.

Name | Description
-----|------------
locale | The moment locale to be used.<br>Default: *undefined*
ahead | The string to use when the timezone is ahead of the referenced moment's timezone.<br>Default: 'ahead'
behind | The string to use when the timezone is behind the referenced moment's timezone. <br>Default: 'behind'
hour | The string to use for a single hour. <br>Default: 'hour'
hours | The string to use for mulitple hours.<br>Default:  'hours'
sunRiseHour | The hour of sunrise. <br>Default:  6
sunRiseMinute | The minute of sunrise. <br>Default:  0
sunSetHour | The hour of sunset. <br>Default:  20
sunSetMinute | The minute of sunset. <br>Default:  0
daytime | The string to use to represent daytime. <br>Default:  '\u263c'  // Unicode white sun with rays
nighttime | The string to use to represent nighttime.  <br>Default:  '\u263e' // Unicode last quarter moon
legendFormat | The moment format to use within the legend for sunrise and sunset. <br>Default:  'h:mm a'
legendBreak | Whether to insert a break between the sunrise and sunset legend information <br>Default:  false
legendDash | The string inserted between the daytime/nighttime string and the sunrise and sunset range. <br>Default:  ' - '
legendSeparator | The string inserted between the sunrise and sunset times. <br>Default:  ' .. '
timeFormat | The moment format to use to display the time for which the environment is referencing. <br>Default:  'dddd h:mm a DD-MMM-YYYY'
timeShowTimezoneName | Whether to show the timezone associated name instead of the actual timezone within the environment's dislayed time.<br>Default:  false
defaultTimezone | The default timezone to be used, should the data contain a blank timezone. <br>Default:  getDefaultTimezone()

## Example

The following options will ensure that all information is displayed in French.

	options = { locale: 'fr',
	            sunRiseHour: 8,
	            sunSetHour: 16,
	            ahead: 'devant',
	            behind: 'derrière',
	            hour: 'heure',
	            hours: 'heures'
              };

# Environment Class

## Constructor

	momentTimezoneDiff.Environment(Object options);

The following option values control how the environment is created:

Name | Description
-----|------------
dateTimeElements | A reference to the DateTimeElements object to be used.<br>Default: *undefined*
dateId | The id of the element to be used against which the DateTimeElements object is created, using dteOptions if specified.<br>Only used if 'dateTimeElements' is not defined.<br>Default: 'mtzdDate'
formatsId | The id of the element which contains information about the formats to be used.<br>Default: 'mtzdFormats'
containerId | The id of the element which contains the rows and columns to be populated.<br>Default: 'mtzdContainer'
timeId | The id of the element which displays the time referenced.<br>Default: 'mtzdTime'
legendId  | The id of the element which displays the legend information.<br>Default: 'mtzdLegend'
tokenSeparator | The character to use to separate the tokens used within the formats element.<br>Default: '&#124;'
linkClass | The class to use when a link is added to an element to change the timezone within the DateTimeElements object.<br>Default: 'mtzdLink'
legendClass | The class of the legend elements which contains textual information.<br>Default: 'mtzdLegend'
legendBreakClass | The class of the legend which contains the break within the legend.<br>Default: 'mtzdLegendBreak'
autoRefresh | Whether the environment is refreshed with information for the current time.<br>Default: true
autoUpdate | Whether the environment is to automatically update every minute to reflect the current time.<br>Default: false
autoUpdateSeconds | The update frequency, should 'autoUpdate' be enabled.<br>Default: 30

The namespace default option values can also be overriden via the *options* parameter.

## Refresh

	Environment.refresh();

Updates the DateTimeElements controls, if present, and Environment values as per current moment and timezone values.

## Update

	Environment.update(Object value, String timezone, [String name]);

Updates the current moment and timezone values for the given date/time *value*, *timezone* and *name*.  If name is not specified, the *timezone* value is used.

The *value* value can be either of the following:

Value | Description
------|------------
Moment | moment() value
Date | Javascript Date object
Number Array | An array of numbers presenting year (full 4 digit year value), month (0..11), day (1..31), hour (0..23) and minute (0..59).

## Set Current Time

	Environment.setCurrentTime();

Sets the moment and timezone values to be the user's current time.

## Set Timezone

	Environment.setCurrentTime(String timezone, [String name]);

Sets the current timezone, and name, to the specified value.

## Get Options

	Object Environment.getOptions();

Returns a copy of the environment's configured options.

## Set Options

	Environment.getOptions(Object options);

Allows one or more of the environment's configured option values to be overridden.

## Daytime

	Boolean Environment.daytime(Moment moment);

Returns whether the supplied moment occurs during the daytime, as per the environment's configured options.

## Create Legend

	Array Environment.createLegend();

Returns an array of String values which present the environment's legend, as per the environment's configured options.

## Timezone Diff

	TimezoneDiff Environment.timezoneDiff(Moment moment, String timezone);

Creates a new TimezoneDiff object for the specified moment, so that the hourly difference to the supplied timezone can be calculated.
