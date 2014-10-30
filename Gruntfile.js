/*global module:false*/

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    clean: {
      min: {
        src: [ 'scripts/*.min.js', 'test/*.min.js', 'qunit-tests/*.min.html' ]
      }
    },
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
    jsonlint: {
      source: {
        src: [ '*.json' ]
      },
      node: {
        src: [ 'node/*.json' ]
      },
    },
    jshint: {
      source: {
        src: [ 'scripts/*.js', '!scripts/*.min.js' ],
      },
      tests: {
        src: [ 'test/**/*.js', '!test/**/*.min.js', 'qunit-tests/**/test*.js' ],
      },
      node: {
        src: [ 'node/**/*.js' ],
      },
      grunt: {
        src: [ 'Gruntfile.js' ],
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
        unused: true,       // Prohibits declaration of variables which are not used
        boss: false,        // Suppresses warnings about the use of assignments in cases where comparisons are expected
        eqnull: true,       // Suppresses warnings about == null comparisons.
        browser: true,      // Defines globals exposed by modern browsers (but not alert and console)
        node: true,         // Defines globals available when your code is running inside of the Node runtime environment
        globals: {
        }
      }
    },
    copy: {
      qunit: {
        options: {
          // Replace moment-timezone-diff.js script include with uglified version
          process: function (content/*, srcpath*/) {
            return content.replace(/<script src="\.\.\/scripts\/moment-timezone-diff\.js"><\/script>/g,'<script src="../scripts/moment-timezone-diff.min.js"></script>');
          },
        },
        files: [
          {
           src: 'qunit-tests/moment-timezone-diff.html',
           dest: 'qunit-tests/moment-timezone-diff.min.html'
          },
          {
           src: 'qunit-tests/moment-timezone-diff-jquery.html',
           dest: 'qunit-tests/moment-timezone-diff-jquery.min.html'
          }
        ]
      },
      test: {
        options: {
          // Replace moment-timezone-diff include with uglified version
          process: function (content/*, srcpath*/) {
            return content.replace(/require\('\.\.\/scripts\/moment-timezone-diff'\)/g,"require('../scripts/moment-timezone-diff.min')");
          },
        },
        files: [ 
          {
           src: 'test/moment-timezone-diff.js',
           dest: 'test/moment-timezone-diff.min.js'
          }
        ]
      },
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
      all: [ 'qunit-tests/*.html' ]
    },
    version: {
      minor: {
        options: {
          prefix: '[^\\-\\w]version[\'"]?\\s*[:=]\\s*[\'"]?',
          release: 'minor'
        },
        src: [ 'package.json', 
               'scripts/*.css', 
               'scripts/*.js', 
               'qunit-tests/*.html',
               'qunit-tests/*.js',
               'node/*.js',
               'test/*.js',
               'examples/*.html'
             ]
      },
      patch: {
        options: {
          prefix: '[^\\-\\w]version[\'"]?\\s*[:=]\\s*[\'"]?',
          release: 'patch'
        },
        src: [ 'package.json', 
               'scripts/*.css', 
               'scripts/*.js', 
               'qunit-tests/*.html',
               'qunit-tests/*.js',
               'node/*.js',
               'test/*.js',
               'examples/*.html'
             ]
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %>' +
                ' <%= pkg.author.name %>' +
                ' License: <%= pkg.licenses[0].type %>' +
                ' v<%= pkg.version %>' +
                ' <%= grunt.template.today("yyyy-mm-dd") %>' +
                ' */\n',
        mangle: {
          except: ['jQuery']
        }
      },
      min: {
        files: {
          'scripts/moment-timezone-diff.min.js': ['scripts/moment-timezone-diff.js']
        }
      }
    }
  });

  // Load tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-version');
  grunt.loadNpmTasks('grunt-jsonlint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task.
  grunt.registerTask('default', [ 'clean', 'jsonlint', 'jshint', 'copy', 'uglify', 'mochaTest', 'qunit' ]);
  grunt.registerTask('jshint-job', [ 'jshint' ]);
  grunt.registerTask('qunit-job', [ 'jshint', 'copy', 'qunit' ]);
  grunt.registerTask('build', [ 'clean', 'jsonlint', 'jshint', 'version:minor', 'copy', 'uglify', 'mochaTest', 'qunit' ]);
  grunt.registerTask('build-patch', [ 'clean', 'jsonlint', 'jshint', 'version:patch', 'copy', 'uglify', 'mochaTest', 'qunit' ]);
};
