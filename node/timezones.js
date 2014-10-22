/*
    timezones.js
    version : 0.5.1
    authors : Martyn Davis
    license : MIT
*/
"use strict";
var moment = require('moment-timezone'),
    momentTimezoneDiff = require('../scripts/moment-timezone-diff.min'),
    yargs = require('yargs'),
    fs = require('fs'),
    table = require('text-table');

//
// Parse command line options
//
var argv = yargs
    .usage(
           '\nDisplay Timezone Related Information\n' +
           '\n' +
           'Usage: $0'
    )
    .demand(0)
    .alias(
           {
            'd': 'data',
            'f': 'format',
            't': ['time', 'date' ],
            'z': 'timezone'
           }
    )
    .describe({
               'd': 'File containing configuration data to load',
               'f': 'Format of date & time',
               't': 'Date & time (as per format)',
               'z': 'Timezone'
              }
    )
    .string([
             'd',
             'f',
             't',
             'z'
            ]
    )
    .defaults(
              {
               'd': './timezones.json',
               'f': 'YYYY-MM-DD HH:mm' 
              }
    )
    .strict(true)
    .argv;

/*jslint nomen: true*/
if (argv._.length !== 0) {
    
    /*jslint nomen: false*/
    yargs.showHelp();
    process.exit(1);
}

var file = argv.data,
    config,
    data = [ ],
    m,
    tzDiff,
    rowData,
    i,
    j,
    align,
    t;

if (argv.time) {
    console.log('Date & Time: ' + argv.time);
    if (argv.timezone) {
        console.log('Timezone:    ' + argv.timezone);
        if (!moment.tz.zone(argv.timezone)) {
            console.error('Error: Timezone "' + argv.timezone + '" is not valid');
            process.exit(1);
        }
        m = moment.tz(argv.time, argv.format, true, argv.timezone);
    } else {
        m = moment(argv.time, argv.format, true);
    }
    if (!m.isValid()) {
        console.error('Error: Date & time "' + argv.time + '" is not valid using the format "' + argv.format + '"');
        process.exit(1);
    }
} else {
    m = moment();
}

if (!fs.existsSync(file)) {
    console.error('Error: File "' + file + '" does not exist');
    process.exit(1);
}

console.log('Data:        ' + file);
config = JSON.parse(fs.readFileSync(file, 'utf8'));

if (!config.output) {
    config.output = [ 'hh:mm a DD-MMM-YYYY DIFF daynight' ];
}

console.log();

data.push([ 'Name', 'Location', 'Timezone' ]);

for (i = 0; i < config.timezones.length; i++) {
    tzDiff = new momentTimezoneDiff.TimezoneDiff(m, config.timezones[i].timezone, config.options);
    
    rowData = [ config.timezones[i].name, config.timezones[i].location, config.timezones[i].timezone || 'Current timezone' ];
    
    for (j = 0; j < config.output.length; j++) {
        rowData.push(tzDiff.format(config.output[j]));
    }
    
    data.push(rowData);
}

align = [ 'l', 'l', 'l' ];

for (j = 0; j < config.output.length; j++) {
    align.push('r');
}
t = table(data, { align: align });
console.log(t);
