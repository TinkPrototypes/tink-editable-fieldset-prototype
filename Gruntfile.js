'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Check for a new version
  var currentversion = require('./bower_components/tink-core/bower.json').version;

  var bowerFile = grunt.file.readJSON('./bower.json');

  var prodComponents = Object.keys(bowerFile.dependencies).concat(Object.keys(bowerFile.devDependencies)).filter(
      function(prodComponent) {
        if(prodComponent.substr(0, 5) === 'tink-'){
          return true;
        }
        return false;
      }
    ).map(
      function(prodComponent) {
          return prodComponent + '/*.md';
      }
  );

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'src',
    dist: 'dist',
    version: currentversion,
    module: require('./package.json').name,
    domain: 'tink.prototype-skeleton',
    tinkReadme: prodComponents
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep', 'copy:dependenciesMd']
      },
      md: {
        files: ['bower_components/tink-*/bower.json'],
        tasks: ['wiredep', 'copy:dependenciesMd']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      sass: {
        // files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['sass:server', 'autoprefixer']
      },
      html: {
        files: ['<%= yeoman.app %>/templates/{,*/}*.{htm,html}'],
        tasks: ['ngtemplates']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/**/*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    // ngtemplates:  {
    //   app:        {
    //     options: {
    //       module: '<%= yeoman.domain %>',
    //       standalone:false,
    //       htmlmin: {
    //         collapseBooleanAttributes: true,
    //         collapseWhitespace: true,
    //         removeAttributeQuotes: true,
    //         removeComments: true, // Only if you don't use comment directives!
    //         removeEmptyAttributes: true,
    //         removeRedundantAttributes: true,
    //         removeScriptTypeAttributes: true,
    //         removeStyleLinkTypeAttributes: true,
    //         conservativeCollapse: true,
    //         preserveLineBreaks: true
    //       }
    //     },
    //     cwd: 'src',
    //     src: 'templates/**.html',
    //     dest: '<%= yeoman.dist %>/scripts/templates.js'
    //   }
    // },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
      },
     test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },
    connect: {
      options: {
        port: 9004,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: 35733
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: {
        files: [{
          src: [
            '.tmp',
            // '<%= yeoman.dist %>/scripts'
          ]
        }]
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 3 versions']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles',
          src: '{,*/}*.css',
          dest: '.tmp/styles'
        }]
      }
    },
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath: /\.\.\//
      },
      sass: {
        src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },
    sass: {
      options: {
        imagePath:'../images',
        includePaths: [
          'bower_components'
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/styles',
          src: ['*.scss'],
          dest: '.tmp/styles',
          ext: '.css'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/styles',
          src: ['*.scss'],
          dest: '.tmp/styles',
          ext: '.css'
        }]
      }
    },
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          // '<%= yeoman.dist %>/styles/{,*/}*.css',
          '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    copy: {
      // dist: {
      //   files: [
      //     {
      //       expand: true,
      //       dot: true,
      //       cwd: '<%= yeoman.app %>/scripts/',
      //       dest: '<%= yeoman.dist %>/scripts/',
      //       src: [
      //         '{,*/}*'
      //       ]
      //     }
      //   ]
      // },
       dependenciesMd:{
        files: [{
            expand: true,
            cwd: 'bower_components',
            src: '<%= yeoman.tinkReadme %>',
            dest: '<%= yeoman.app %>/markdown'
        }]
      },
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>',
            src: [
              '*.{ico,png,txt}',
              '.htaccess',
              '*.html',
              'views/{,*/}*.html',
            'markdown/{,*/}*.md',
              'images/{,*/}*.{webp}',
              'fonts/*'
            ]
          }
        ]
      },
      styles: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '.tmp/styles/',
            dest: '<%= yeoman.dist %>/styles',
            src: [
              '{,*/}*'
            ]
          }
        ]
      }
    },
    // concat: {
    //   options: {
    //     separator: ';'
    //   },
    //   dist: {
    //     src: [
    //       '<%= yeoman.dist %>/scripts/{,*/}*.js'
    //     ],
    //     dest: '<%= yeoman.dist %>/<%= yeoman.module %>.js'
    //   }
    // },
    // uglify: {
    //   options: {
    //     mangle: false,
    //     banner: '/*! <%= yeoman.module %> v<%= yeoman.version %> */',
    //     sourceMap: true,
    //     screwIE8: true
    //   },
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/<%= yeoman.module %>.min.js': ['<%= yeoman.dist %>/<%= yeoman.module %>.js'],
    //     }
    //   }
    // },
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs']
            },
            post: {}
          }
        }
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>/images'],
        basedir: ['<%= yeoman.dist %>/images'],
        assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/images']
      }
    },
    concurrent: {
      server: [
        'sass:server',
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'sass',
        'imagemin',
        'svgmin'
      ]
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
      // options: {
      //   plugins: {
      //     removeViewBox: false
      //   }
      // }
      // dist: {
      //   files: [{
      //     expand: true,
      //     cwd: '<%= yeoman.app %>/images',
      //     src: '{,*/}*.svg',
      //     dest: '<%= yeoman.dist %>/images'
      //   }]
      // }
    },
    cssmin: {
      dist: {
        files: {
          '<%= yeoman.dist %>/styles/tink-politie.<%= yeoman.version %>.min.css': ['bower_components/tink-theme-politie/dist/tink-politie.css'],
          '<%= yeoman.dist %>/styles/default-politie.<%= yeoman.version %>.min.css': ['bower_components/highlightjs/styles/default.css'],
          '<%= yeoman.dist %>/styles/styleguide-politie.<%= yeoman.version %>.min.css': ['.tmp/styles/styleguide-politie.css'],

          '<%= yeoman.dist %>/styles/tink-ocmw.<%= yeoman.version %>.min.css': ['bower_components/tink-theme-ocmw/dist/tink-ocmw.css'],
          '<%= yeoman.dist %>/styles/default-ocmw.<%= yeoman.version %>.min.css': ['bower_components/highlightjs/styles/default.css'],
          '<%= yeoman.dist %>/styles/styleguide-ocmw.<%= yeoman.version %>.min.css': ['.tmp/styles/styleguide-ocmw.css'],

          '<%= yeoman.dist %>/styles/tink-stad.<%= yeoman.version %>.min.css': ['bower_components/tink-theme-stad/dist/tink-stad.css'],
          '<%= yeoman.dist %>/styles/default-stad.<%= yeoman.version %>.min.css': ['bower_components/highlightjs/styles/default.css'],
          '<%= yeoman.dist %>/styles/styleguide-stad.<%= yeoman.version %>.min.css': ['.tmp/styles/styleguide-stad.css'],

          '<%= yeoman.dist %>/styles/tink.<%= yeoman.version %>.min.css': ['bower_components/tink-core/dist/tink.css'],
          '<%= yeoman.dist %>/styles/default.<%= yeoman.version %>.min.css': ['bower_components/highlightjs/styles/default.css'],
          '<%= yeoman.dist %>/styles/styleguide.<%= yeoman.version %>.min.css': ['.tmp/styles/styleguide.css'],
        }
      }
    },
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: ['*.js', '!oldieshim.js'],
          dest: '.tmp/concat/scripts'
        }]
      }
    },
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },
    replace: {
      dist:{
      },
      md: {
        options: {
          patterns: [
            {
              match: /v(\d+)\.(\d+)\.(\d+)/g,
              replacement: 'v<%= yeoman.version %>'
            }
          ]
        },
        files: [
          {
            expand: true, flatten: true, src: ['README.md'], dest: ''
          }
        ]
      },
      html: {
        options: {
          patterns: [
            {
              match: /\-\-\>(\d+).(\d+).(\d+)<\!\-\-\@\-\-\>/g,
              replacement: '--><%= yeoman.version %><!--@-->'
            }
          ]
        },
        files: [
          {
            expand: true, flatten: false, src: ['<%= yeoman.app %>/**/*.html'], dest: ''
          }
        ]
      },
      rev: {
        options: {
          patterns: [
            {
              match: /{{tink-version}}/g,
              replacement: '<%= yeoman.version %>'
            }
          ]
        },
        files: [
          {expand: true, flatten: false, src: ['<%= yeoman.dist %>/index.html','<%= yeoman.dist %>/scripts/*.js'], dest: ''}
        ]
      },
      // json: {
      //   options: {
      //     patterns: [
      //       {
      //         match: /"version": "(\d+).(\d+).(\d+)"/g,
      //         replacement: '"version": "<%= yeoman.version %>"'
      //       }
      //     ]
      //   },
      //   files: [
      //     {expand: true, flatten: false, src: ['package.json','bower.json'], dest: ''}
      //   ]
      // },
      liveRev: {
        options: {
          patterns: [
            {
              match: /var versionFileTinkProp = '.+';/g,
              replacement: 'var versionFileTinkProp = \'<%= yeoman.version %>\';'
            }
          ]
        },
        files: [
          {expand: true, flatten: false, src: ['<%= yeoman.app %>/scripts/*.js','<%= yeoman.dist %>/scripts/*.js'], dest: ''}
        ]
      }
    },
    // replace: {
    //   dist: {
    //     options: {
    //       patterns: [
    //         {
    //           match: /v(\d+)\.(\d+)\.(.+)/g,
    //           replacement: 'v<%= yeoman.version %>'
    //         }
    //       ]
    //     },
    //     files: [
    //       {expand: true, flatten: true, src: ['README.md'], dest: ''}
    //     ]
    //   }
    // },
    cssUrlEmbed: {
      encodeWithBaseDir: {
        expand: true,
        cwd: '.tmp/styles',
        src: [ '{,*/}*.css' ],
        dest: '.tmp/styles',
        options: {
          baseDir: './src/styles'
        }
      }
    },
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: false
      }
    }
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'copy:dependenciesMd',
      'wiredep',
      'concurrent:server',
      'replace:liveRev',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'copy:dependenciesMd',
    'replace:md',
    'replace:html',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
      // 'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'replace:rev',
    'replace:liveRev',
      // 'cssUrlEmbed',
      // 'clean:server'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
