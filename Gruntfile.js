module.exports = function(grunt) {

    ////
    // configure project
    ////

    var CONF = {
        dest:{
            slug: 'flickr-feed'
        },
        files: {
             lib: [
                 'src/*.js', 
             ],
             examples:{
                 js: [
                    'src/examples/**/*.js', 
                ],
                css: [
                    'src/examples/**/*.css',
                ],
                
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
        
        CONF: CONF,
        
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
            // lib
            lib:{
                options: {
                    separator: '\n',
                    banner: '<%= meta.banner %>\n'
                },
                src: CONF.files.lib,
                dest: 'dist/<%= CONF.dest.slug %>.js'
            }
        },

        // copy files
        copy: {
            // examples
            examples: {
                expand: true,
                cwd: 'src/examples',
                src: [
                    '**/*.js',
                    '**/*.css',
                    '**/*.html' 
                ],
                dest: 'dist/examples'
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
                    'dist/<%= CONF.dest.slug %>.min.js': ['<%= concat.lib.dest %>']
                },
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
                'concat',
                'copy',
                'uglify'
            ]
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
            'concat',
            'copy',
            'uglify'
        ]
    );

}; // end module.exports
