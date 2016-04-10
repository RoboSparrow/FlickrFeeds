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
                 'src/**/*.js', 
             ]
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
    
        // jshint: specify your preferred options in 'globals'
        // http://jshint.com/docs/options/
        jshint: {
            files: ['src/**/*.js'],
            options: CONF.jshint.options
        },
        
        // copy files
        copy: {
            // examples
            src: {
                expand: true,
                cwd: 'src',
                src: [
                    '**/*.js',
                    '**/*.css',
                    '**/*.html' 
                ],
                dest: ''
            }
        },
        
        // configure watch task
        watch: {
            files: ['<%= jshint.files %>', 'src/**/*.css', 'src/**/*.html'],
            tasks: [
                'jshint',
                'copy'
            ]
        }

    }); // end grunt.initConfig

    ////
    // grunt tasks
    ////

    // requirements
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    
    // custom tasks (mind the order of your tasks!), just comment out what you don't need
    grunt.registerTask(
        'default',
        'Compiles all of the assets and copies the files to the build directory.', [
            'jshint',
            'copy'
        ]
    );

}; // end module.exports
