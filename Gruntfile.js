/*jshint forin: true */
module.exports = function (grunt) {

    "use strict";

    var os = require('os'),
        projectConfig = grunt.file.readJSON('project-config.json'),
        productionEnabled = false,
        basePathReplace = 'CDN_BASEPATH',
        basePath = projectConfig.urls.basePathLocal,
        noCacheReplace = 'NO_CACHE_VAR';

    grunt.initConfig({

        clean: {
            built: ['deploy/**']
        },

        sprite: projectConfig.sprites,

        imagemin: {                          // Task
            static: {                          // Target
                options: {                       // Target options
                    optimizationLevel: 3,
                    svgoPlugins: [{ removeViewBox: false }]
                },
                files: [{
                    expand: true,
                    cwd: 'deploy/assets/images/',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: 'deploy/assets/images/'
                }]
            }
        },

        htmlclean: {
            deploy: {
                expand: true,
                cwd: 'deploy/',
                src: ['**/*.html', '!_*.*'],
                dest: 'deploy/'
            }
        },

        stylus: {
            main: {
                files: projectConfig.stylus.files,
                options: {
                    compress: projectConfig.stylus.compress,
                    sourcemap: {
                        inline: true
                    }
                }
            }
        },

        uglify: {
            main: {
                options: {
                    beautify: projectConfig.uglify.beautify,
                    sourceMap: projectConfig.uglify.sourceMap,
                    compress: {
                        drop_console: projectConfig.uglify.dropConsole
                    }
                },
                files: projectConfig.uglify.files
            }
        },

        replace: {
            main: {
                src: ['deploy/**/*.html', 'deploy/**/*.json', 'deploy/**/*.css', 'deploy/**/*.js'],
                overwrite: true,
                replacements: [
                    {
                        from: basePathReplace,
                        to: projectConfig.urls.basePathLocal
                    },
                    {
                        from: noCacheReplace,
                        to: (new Date()).getTime()
                    },
                    {
                        from: '{{{site_title}}}',
                        to: projectConfig.urls.title
                    }
                ]
            }
        },

        jslint: {
            client: {
                src: [
                    'Gruntfile.js',
                    'sources/assets/scripts/**/*.js',
                    ((projectConfig.jslint.mainEnabled === true) ? '' : '!') + 'sources/assets/scripts/main.js',
                    '!sources/assets/scripts/plugins/**/*.js'
                ],
                directives: {
                    indent: 4,
                    nomen: true,
                    regexp: true,
                    predef: [
                        'require',
                        'module',
                        'jQuery',
                        'window',
                        'document',
                        'console',
                        'YT',
                        'setInterval',
                        'clearInterval'
                    ]
                },
                options: {
                    regexp: false,
                    failOnError: true,
                    forin: true
                }
            }
        },

        copy: {
            css: {
                files: [
                    {
                        expand: true,
                        cwd: 'sources/assets/css/',
                        src: ['**/*.css'],
                        dest: 'deploy/assets/css/'
                    }
                ]
            },
            scripts: {
                files: [
                    {
                        expand: true,
                        cwd: 'sources/assets/scripts/',
                        src: ['**/*.*', '!main.js'],
                        dest: 'deploy/assets/scripts/'
                    }
                ]
            },
            fonts: {
                files: [
                    {
                        expand: true,
                        cwd: 'sources/assets/fonts/',
                        src: ['*.*', '**/*.*'],
                        dest: 'deploy/assets/fonts/'
                    }
                ]
            },
            images: {
                files: [
                    {
                        expand: true,
                        cwd: 'sources/assets/images/',
                        src: ['**/*.*', '!sprite*/*.*'],
                        dest: 'deploy/assets/images/'
                    }
                ]
            },
            otherAssets: {
                files: [
                    {
                        expand: true,
                        cwd: 'sources/assets/',
                        src: ['**/*.*', '!css/**/*.*', '!scripts/**/*.*', '!fonts/**/*.*', '!images/**/*.*'],
                        dest: 'deploy/assets/'
                    }
                ]
            },
            html: {
                files: [
                    {
                        expand: true,
                        cwd: 'sources/site/',
                        src: ['**/*.*', '!_*.html'],
                        dest: 'deploy/'
                    }
                ]
            }
        },

        notify: {
            watch: {
                options: {
                    title: 'Watch Completed!',
                    message: 'Waiting for more changes...'
                }
            }
        },

        watch: {
            options: {
                dateFormat: function () {
                    grunt.task.run(['notify']);
                }
            },
            sprite: {
                files: (function () {
                    var i,
                        arr = [];
                    for (i in projectConfig.sprites) {
                        if (projectConfig.sprites.hasOwnProperty(i)) {
                            arr.push(projectConfig.sprites[i].src);
                        }
                    }
                    if (arr.length === 0) {
                        return 'sources/assets/images/sprite/**/*.png';
                    }
                    return arr;
                }()),
                tasks: ['sprite', 'stylus', 'replace'],
                options: {
                    spawn: false
                }
            },
            scripts: {
                files: ['Gruntfile.js', 'sources/assets/scripts/**/*.js'],
                tasks: ['jslint', 'uglify', 'copy:scripts', 'replace'],
                options: {
                    spawn: false
                }
            },
            css: {
                files: ['sources/assets/css/**/*.styl', 'sources/assets/css/**/*.css'],
                tasks: ['stylus', 'replace', 'copy:css'],
                options: {
                    spawn: false
                }
            },
            fonts: {
                files: ['sources/assets/fonts/**/*.*'],
                tasks: ['copy:fonts'],
                options: {
                    spawn: false
                }
            },
            images: {
                files: ['sources/assets/images/**/*.*'],
                tasks: ['copy:images'],
                options: {
                    spawn: false
                }
            },
            html: {
                files: ['sources/site/**/*.*'],
                tasks: ['copy:html', 'apply-templates:' + projectConfig.urls.basePathLocal, 'replace'],
                options: {
                    spawn: false
                }
            }
        }
    });

    // Load all dependences needed
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    function replaceStr(str, f, r) {
        if (str && f && r) {
            return str.split(f).join(r);
        }
        return str;
    }

    function applyTemplate(fileObject) {
        var html = grunt.file.read('sources/site/' + fileObject.file),
            i,
            total = projectConfig.templateFiles.length,
            replaceObj;

        // Apply templates or code's include when needed
        for (i = 0; i < total; i = i + 1) {
            html = replaceStr(html, '{{{' + projectConfig.templateFiles[i] + '}}}', grunt.file.read(projectConfig.templateFiles[i]));
        }

        // Replace {{{any ...}}} per object's array registers on page object at project-config.json
        if (fileObject.replace && fileObject.replace.length > 0) {
            total = fileObject.replace.length;
            for (i = 0; i < total; i = i + 1) {
                replaceObj = fileObject.replace[i];
                html = replaceStr(html, '{{{' + replaceObj.find + '}}}', replaceObj.replace);
            }
        }

        // production url
        html = replaceStr(html, '{{{baseUrlProduction}}}', projectConfig.urls.baseUrlProduction);

        if (fileObject.title) {
            // Replace page title to page title setted on project-config.json
            html = replaceStr(html, '{{{site_title}}}', fileObject.title);
        } else {
            // Replace page title to project title setted on project-config.json
            html = replaceStr(html, '{{{site_title}}}', projectConfig.title);
        }

        // Remove {{{any ...}}} unused.
        html = html.replace(/\{{3,3}[^\{\}]+\}{3,3}/g, '');

        // If executing this function on production mode, run the htmlclean command.
        if (productionEnabled === true) {
            grunt.task.run('htmlclean');
        }

        // Write the file with the path of fileObject.file
        grunt.file.write('deploy/' + fileObject.file, html);
    }

    /* Apply templates pushed to array "toApplyTemplate" setted on package.json
     * $ grunt apply-templates
     */
    grunt.registerTask('apply-templates', 'Apply templates pushed to array "toApplyTemplate" setted on package.json with custom basePath', function () {
        var i,
            total = projectConfig.toApplyTemplate.length;

        for (i = 0; i < total; i = i + 1) {
            applyTemplate(projectConfig.toApplyTemplate[i]);
        }
    });

    /* Build the project with local basepath setted on package.json
     * $ grunt deploy
     *
     * Build project with a custom url basepath
     * $ grunt deploy:http://custom-url-basepath
     */
    grunt.registerTask('deploy', 'Build the project with local basepath setted on package.json', function (newBasePath) {
        var tasks = [],
            gruntConfig = {},
            i,
            total;

        tasks = [
            'clean',
            'sprite',
            'jslint',
            'uglify',
            'stylus',
            'copy',
            'apply-templates',
            'replace'
        ];

        basePath = this.args.join(':');

        // When the basePath is empty, get the local basepath setted on package.json
        if (basePath.length === 0) {
            basePath = projectConfig.urls.basePathLocal;
        }

        // Change setup to production default
        if (productionEnabled === true) {

            // uglify
            projectConfig.uglify.beautify = false;
            projectConfig.uglify.sourceMap = true;
            projectConfig.uglify.dropConsole = true;

            // stylus
            projectConfig.stylus.compress = true;

            // imagemin
            tasks.push('imagemin');
        }

        // jslint
        gruntConfig.jslint = grunt.config('jslint');
        if (projectConfig.jslint.mainEnabled === false) {
            gruntConfig.jslint.client.src.push('!sources/assets/scripts/main.js');
            grunt.config('jslint', gruntConfig.jslint);
        }

        // uglify
        grunt.config('uglify.main.options.beautify', projectConfig.uglify.beautify);
        grunt.config('uglify.main.options.sourceMap', projectConfig.uglify.sourceMap);
        grunt.config('uglify.main.options.compress.drop_console', projectConfig.uglify.dropConsole);

        // sprite
        grunt.config('sprite', projectConfig.sprites);

        // stylus
        grunt.config('stylus.main.options.compress', projectConfig.stylus.compress);

        // copy
        gruntConfig.copy = grunt.config('copy');
        total = projectConfig.toApplyTemplate.length;
        for (i = 0; i < total; i = i + 1) {
            gruntConfig.copy.html.files[0].src.push('!' + projectConfig.toApplyTemplate[i].file);
        }
        grunt.config('copy', gruntConfig.copy);

        // replace
        gruntConfig.replace = grunt.config('replace');
        gruntConfig.replace.main.replacements[0] = {
            from: basePathReplace,
            to: basePath
        };
        grunt.config('replace', gruntConfig.replace);

        grunt.task.run(tasks);

        return newBasePath;
    });

    /* Build the project with the local basepath and initialize the watch task
     * $ grunt w
     */
    grunt.registerTask('w', ['deploy', 'watch']);

    /* Build the project with a production setup and a custom basepath
     * $ grunt production:http://cdn.htmltemplate.com.br
     *
     */
    grunt.registerTask('production', 'Build the project with a production configs.', function (newBasePath) {
        productionEnabled = true;
        grunt.task.run(['deploy:' + this.args.join(':')]);
        return newBasePath;
    });


    /* Build the project with a production local ip address.
     * That is useful to test the project in the smartphones for example.
     * $ grunt my-ip
     *
     * When this task not recognize your ip address, you can make this:
     * $ grunt deploy:http://your-address-ip/html-template/deploy
     */
    grunt.registerTask('my-ip', '', function () {
        // console.log(os.networkInterfaces());
        var ip = os.networkInterfaces().en1[1].address,
            newBasePath = projectConfig.urls.basePathLocal.split('localhost').join(ip);
        grunt.task.run(['deploy:' + newBasePath]);
    });
};