/*global module:false*/

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    watch: {
      src: {
          files: [ 'scripts/*.js' ],
          tasks: [ 'jshint' ]
      },
      tests: {
          files: [ 'test/*.js' ],
          tasks: [ 'jshint', 'mochaTest' ]
      },
      options: {
        spawn: false,
      },
    },
    jshint: {
      source: {
        src: [ 'scripts/*.js' ],
      },
      tests: {
        src: [ 'test/*.js' ],
      },
      options: {
        curly: true,        // Always put curly braces around blocks in loops and conditionals.
        eqeqeq: true,       // prohibits the use of == and != in favor of === and !==
        immed: true,        // Prohibits the use of immediate function invocations without wrapping them in parentheses
        latedef: true,      // Prohibits the use of a variable before it was defined.
        newcap: true,       // Capitalize names of constructor functions
        noarg: true,        // Prohibits the use of arguments.caller and arguments.callee
        sub: true,          // Suppresses warnings about using [] notation when it can be expressed in dot notation: person['name'] vs. person.name.
        undef: true,        // Prohibits the use of explicitly undeclared variables
        boss: false,        // Suppresses warnings about the use of assignments in cases where comparisons are expected
        eqnull: true,       // Suppresses warnings about == null comparisons.
        browser: false,     // Defines globals exposed by modern browsers (but not alert and console)
        node: true,         // Defines globals available when your code is running inside of the Node runtime environment
        globals: {
        }
      }
    },
    mochaTest: {
      tests: {
        options: {
          require: 'should'
        },
        src: [ 'test/*.js' ]
      }
    },
    qunit: {
      all: ['qunit-tests/*.html']
    },
  });

  // Load tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  // Default task.
  grunt.registerTask('default', [ 'jshint', 'mochaTest', 'qunit' ]);
  grunt.registerTask('jshint-job', [ 'jshint' ]);
  grunt.registerTask('qunit-job', [ 'jshint', 'qunit' ]);
};
