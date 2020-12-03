'use strict';

/* eslint-env node */
/* eslint-disable no-var */

// eslint-disable-next-line func-names
module.exports = function(grunt) {
    
    var matchdep = require('matchdep');
    
    
    // Configuration
    grunt.initConfig({
        
        pkg: grunt.file.readJSON('package.json'),
        
        name: '<%= pkg.name %>',
        version: '<%= pkg.version %>',
        
        srcDir: 'src',
        srcFiles: '**/*.js',
        src: '<%= srcDir %>/<%= srcFiles %>',
        
        destDir: 'dist',
        
        eslint: {
            gruntfile: {
                src: 'Gruntfile.js',
                options: {
                    'parserOptions': {
                        'sourceType': 'script'
                    }
                }
            },
            src: {
                src: ['<%= src %>']
            },
            test: {
                src: ['test/*.js']
            }
        },
        
        jsdoc: {
            dist: {
                src: ['<%= src %>', 'README.md'],
                options: {
                    destination: 'doc',
                    template: 'node_modules/ink-docstrap/template',
                    configure: 'jsdoc-conf.json'
                }
            }
        },
        
        clean: {
            dist: {
                src: ['<%= destDir %>']
            }
        },
        
        babel: {
            options: grunt.file.readJSON('.babelrc'),
            /* eslint-disable camelcase, indent */
            dist_common: {
                files: [
                        {
                            expand: true,
                            cwd: '<%= srcDir %>/',
                            src: '<%= srcFiles %>',
                            dest: '<%= destDir %>/',
                            ext: '.common.js'
                        }
                ],
                options: {
                    'babelrc': false,
                    'plugins': [
                        ['transform-es2015-modules-commonjs', {
                            'loose': true
                        } ]
                    ]
                }
            },
            dist_umd: {
                files: [
                        {
                            expand: true,
                            cwd: '<%= srcDir %>/',
                            src: '<%= srcFiles %>',
                            dest: '<%= destDir %>/'
                        }
                ],
                options: {
                    'babelrc': false,
                    'plugins': [
                        ['transform-es2015-modules-umd', {
                            'loose': true
                        } ]
                    ]
                }
            }
            /* eslint-enable camelcase, indent */
        },
        
        uglify: {
            minify: {
                files: [
                    {
                        src: '<%= destDir %>/neva.js',
                        dest: '<%= destDir %>/neva.min.js'
                    }
                ]
            }
        },
        
        bump: {
            options: {
                files: ['package.json', 'bower.json', 'component.json'],
                commitMessage: 'Release version %VERSION%',
                commitFiles: ['-a'],
                tagName: '%VERSION%',
                tagMessage: 'Version %VERSION%',
                pushTo: 'origin'
            }
        },
        
        mochacli: {
            options: {
                require: ['babel-register']
            },
            all: {}
        }
    });
    
    // Plugins
    matchdep.filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.loadNpmTasks('gruntify-eslint');
    
    // Tasks
    grunt.registerTask('build', ['clean', 'babel', 'uglify']);
    grunt.registerTask('doc', ['jsdoc']);
    grunt.registerTask('lint', ['eslint']);
    grunt.registerTask('test', ['mochacli']);
    grunt.registerTask('default', ['lint', 'test']);
    grunt.registerTask('all', ['lint', 'build', 'test', 'doc']);
    
    grunt.registerTask('release', ['bump']);
    grunt.registerTask('release-minor', ['bump:minor']);
    grunt.registerTask('release-major', ['bump:major']);
    
    // For Travis CI service
    grunt.registerTask('travis', ['all']);
    
};
