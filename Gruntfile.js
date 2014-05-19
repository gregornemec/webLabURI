module.exports = function(grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
        //Združevanje v eno datoteko.
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['js-src/lib/stopwatch.js',
                      'js-src/lib/jsxgraphcore.js',
                      'js-src/labResistor.js',
                      'js-src/labExperiment.js',
                      'js-src/labPowerSupply.js',
                      'js-src/labAmperMeter.js',
                      'js-src/labGraph.js',
                      'js-src/labCollectData.js',
                      'js-src/labInterface.js',
                      'js-src/labmain.js'                 ],
                dest: 'js-src/webLabURI-cat.js'
            }
        },
        //Zmanjševanje izvorne kode.
        uglify : {
            js: {
                files: {
                    'web/js/webLabURI.js' : [ 'js-src/webLabURI-cat.js' ]
                }
            }
        },
        //Kopiranje na spletni strežnik
        shell: {
            cpIndex: {
                command: 'cp labR.html web/index.html '
            },
            cpCSS: {
                command: 'cp -rf css-src/labRStyle.css web/css/labRStyle.css '
            },
            webSrvCopy: {
                command: 'rsync -av --files-from=syncFileList.txt ./web/ /mnt/vBoxWebS/webLabURI/'
            },
            date: {
                command: 'date'
            }
        },
        //Payi na spremembe v imenikih.
        watch: {
            js: {
                files: ['**/js-src/*'],
                tasks: ['concat', 'uglify:js', 'shell:webSrvCopy']
            },
            html: {
                files: ['**/labR.html'],
                tasks: ['shell:cpIndex']
            },
            css: {
                files: ['**/css-src/*'],
                tasks: ['shell:cpCSS', 'shell:webSrvCopy']
            },
            webCoopy: {
                files: ['**/web/*'],
                tasks: ['shell:webSrvCopy']
            }

        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['shell:date', 'watch']);
};
