module.exports = function(grunt) {

    ////
    // configure project
    ////

    var CONF = {

        // task: concat
        concat: {
            // name slug for the concated js file (i.e app.js, app.css, app.min.js)
            destSlug: 'flickr-feeds', //destSlug: 'app'
            // debug: print src file paths as comments
            printPath: true,
            // glob patterns
            files:{
                js: [
                    'src/Flickr.js', 
                    'src/Flickr.View.js', 
                    'src/Flickr.Controller.js'
                ],
                css: [
                    'src/Flickr.View.css'
                ]
            }
        },

        // jhint options, some of the listed are default already buty listed here to be easily edited
        jshint: {
            options: {
                curly: true,
                funcscope:true,
                undef: true,
                unused: false,
                jquery: false,
                globals: {
                    console: true,
                    module: true,
                    document: true,
                    window: true,
                }
            }
        }

    };

    ////
    // grunt config
    ////

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // banner
        meta: {
            banner: [
                '/**',
                ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>',
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>',
                ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>',
                ' */',
                ''
            ].join("\n")
        },

        // concat files
        concat: {
            // js
            js:{
                options: {
                    separator: '\n',
                    banner: '<%= meta.banner %>\n',
                    process: function(src, filepath) {
                        return (CONF.concat.printPath) ? '/*' + filepath + '*/\n\n' + src : src;
                    }
                },
                src: CONF.concat.files.js,
                dest: 'dist/' + CONF.concat.destSlug + '.js'
            },
            // css
            css:{
                options: {
                    separator: '\n',
                    banner: '<%= meta.banner %>\n',
                    process: function(src, filepath) {
                        return (CONF.concat.printPath) ? '/*' + filepath + '*/\n\n' + src : src;
                    }
                },
                src: CONF.concat.files.css,
                dest: 'dist/' + CONF.concat.destSlug + '.css'
            }
        },

        // copy files
        copy: {
            // js
            vendorJs: {
                src: [
                    // vendors
                    'vendor/handlebars/handlebars.min.js'
                ],
                dest: 'dist/'
            },
            // css
            vendorCss: {
                src: [
                    // vendors
                ],
                dest: 'dist/'
            },
            // js
            js: {
                expand: true,
                cwd: 'src/',
                src: ['**/*.js'],
                dest: 'dist/'
            },
            // css
            css: {
                expand: true,
                cwd: 'src/',
                src: ['**/*.css'],
                dest: 'dist/'
            },
            // html
            html: {
                expand: true,
                cwd: 'src/',
                src: ['**/*.html'],
                dest: 'dist/'
            },
            // assets
            assets: {
                expand: true,
                cwd: 'src/assets/',
                src: ['**/*.*'],
                dest: 'dist/assets/'
            }

        },

        // clean dist folder (before build)
        clean: {
            build: {
                src: ['dist/**']
            }
        },

        // uglify js
        uglify: {
            js: {
                options: {
                    banner: '<%= meta.banner %>\n'
                },
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.js.dest %>']
                }
            }
        },

        // jshint: specify your preferred options in 'globals'
        // http://jshint.com/docs/options/
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options: CONF.jshint.options
        },

        // configure watch task
        watch: {
            files: ['<%= jshint.files %>', 'src/**/*.css', 'src/**/*.html'],
            tasks: [
                'jshint', 
                //'concat', 
                'copy', 
                //'replace'
            ]
        },

        // string replacments
        replace: {
            // index.html
            'index.html': {
                options: {
                    patterns: [{
                        match: 'package',
                        replacement: '<%= pkg.name %>'
                    }, {
                        match: 'version',
                        replacement: '<%= pkg.version %>'
                    }]
                },
                files: [{
                    src: ['dist/index.html'],
                    dest: 'dist/index.html'
                }]
            }
        }

    }); // end grunt.initConfig

    ////
    // grunt tasks
    ////

    // requirements

    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    
    // custom tasks (mind the order of your tasks!), just comment out what you don't need
    grunt.registerTask(
        'default',
        'Compiles all of the assets and copies the files to the build directory.', [
            'clean',
            'jshint',
            //'concat',
            'copy'
            //'min'
            //'replace',
            //'uglify'
        ]
    );

}; // end module.exports
