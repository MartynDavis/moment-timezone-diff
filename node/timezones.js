/*
    timezones.js
    version : 0.5.0
    authors : Martyn Davis
    license : MIT
*/
"use strict";
var moment = require('moment-timezone'),
    momentTimezoneDiff = require('../scripts/moment-timezone-diff'),
    yargs = require('yargs'),
    fs = require('fs'),
    table = require('text-table');

//
// Parse command line options
//
var argv = yargs
    .usage('\nDisplay Timezone Related Information\n\nUsage: $0')
    .demand(0)
    .alias({ 'f': 'file' })
    .describe({ 'f': 'File containing configuration to load' })
    .string([ 'f' ])
    .defaults({ 'f': './timezones.json' })
    .strict(true)
    .argv;

/*jslint nomen: true*/
if (argv._.length !== 0) {
    /*jslint nomen: false*/
    yargs.showHelp();
    process.exit(1);
}

var file = argv.f,
    config,
    data = [ ],
    m = moment(),
    timezone,
    tzDiff,
    rowData,
    i,
    j,
    align,
    t;

if (!fs.existsSync(file)) {
    console.error('File "' + file + '" does not exist');
    process.exit(1);
}

console.log('Loading "' + file + '"...');
config = JSON.parse(fs.readFileSync(file, 'utf8'));

if (!config.output) {
    config.output = [ "hh:mm a DD-MMM-YYYY DIFF daynight" ];
}

console.log();

for (i = 0; i < config.timezones.length; i++) {
    tzDiff = new momentTimezoneDiff.TimezoneDiff(m, config.timezones[i], config.options);
    
    rowData = [ config.timezones[i] || 'Current timezone' ];
    
    for (j = 0; j < config.output.length; j++) {
        rowData.push(tzDiff.format(config.output[j]));
    }
    
    data.push(rowData);
}

align = [ 'l' ];

for (j = 0; j < config.output.length; j++) {
    align.push('r');
}
t = table(data, { align: align });
console.log(t);
