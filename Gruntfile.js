'use strict';
module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);
    var config = grunt.file.readJSON('./Gruntfile-config.json');
    grunt.initConfig({
        // project vars
        config: config,
        paths: {
            app: "<%= config.path.app %>",
            src: "<%= config.path.src %>",
            dist: '<%= config.path.dist %>',
            theme: '<%= config.path.theme %>',
            tmp: '<%= config.path.tmp %>'
        },

        //connect server
        connect: {
            options:{
                keepalive:true
            },
            app: {
                options: {
                    port: 88,
                    base: '<%= paths.app %>'
                }
            },
            dist: {
                options: {
                    port: 99,
                    base:  '<%= paths.dist %>'
                }
            }
        },

        // empty folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= paths.tmp %>',
                        '.sass-cache',
                        '<%= paths.dist %>/*',
                        '!<%= paths.dist %>/.git*',
                        '!<%= paths.dist %>/themes/sftp-config.json'
                    ]
                }]
            },
            server: '<%= paths.tmp %>',
            build:['.git']
        },

        copy: {
            main: {
                cwd: 'src/',
                src: '**',
                dest: 'dist/',
                expand: true,
                flatten: false
            }
        },

        useminPrepare: {
            html: 'dist/views/*.html',
            options: {
                dest: './dist/views',
                root: './src/views'
            }
        },

        filerev: {
            options: {
                algorithm: 'md5',
                length: 8
            },
            js: {
                src: 'dist/static/js/min/*.js'
            },
            css:{
                src: 'dist/static/css/min/*.css'
            }
        },

        usemin: {
            html: 'dist/views/*.html',
            options: {
                assetsDirs: ['dist/views']
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.app %>/themes/<%= paths.theme %>/img',
                    src: '{,*/}*.{gif,jpeg,jpg,png}',
                    dest: '<%= paths.dist %>/themes/<%= paths.theme %>/img'
                }]
            }
        },

        // watch files
        watch: {
            js: {
                files: [
                    '<%= paths.app %>/themes/<%= paths.theme %>/js/{,*/}*.js'
                ],
                tasks: ['jshint']
            },
            grunt: {
                files: ['Gruntfile.js']
            },
            compass: {
                files: ['<%= paths.app %>/themes/<%= paths.theme %>/scss/**/*.{scss,sass}'],
                tasks: ['compass:app','autoprefixer','pixrem:app']
            },
            files: [
                '<%= paths.app %>/themes/<%= paths.theme %>/_includes/{,*/}*.tpl',
                '<%= paths.app %>/themes/<%= paths.theme %>/_layouts/{,*/}*.tpl',
                '<%= paths.app %>/themes/<%= paths.theme %>/_pages/**/*.tpl',
                '<%= paths.app %>/themes/<%= paths.theme %>/css/{,*/}*.css',
                '<%= paths.app %>/themes/<%= paths.theme %>/img/{,*/}*.{gif,jpeg,jpg,png,svg,webp}'
            ],
            options: {
                livereload: true
            }
        }
    });

    grunt.registerTask('build', [
        "clean:build",
        'copy',
        'useminPrepare',
        'concat:generated',
        'cssmin:generated',
        'uglify:generated',
        'filerev',
        'usemin'
    ]);

    grunt.registerTask('default', ['clean:build']);
};