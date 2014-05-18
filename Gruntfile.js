//Rename labPowerSuply -> labPowerSupply
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
                      'js-src/labPowerSuply.js',
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
                    'js/webLabURI.js' : [ 'js-src/webLabURI-cat.js' ]
                }
            }
        },
        //Kopiranje na spletni strežnik
        shell: {
            webSrvCopy: {
                command: 'rsync -av --files-from=syncFileList.txt ./ /mnt/vBoxWebS/webLabURI/'
            },
            date: {
                command: 'date'
            }
        },
        //Payi na spremembe v imenikih.
        watch: {
            files: ['**/js-src/*', '**/css/*', '**/labR.html', '**/images/*'],
            tasks: ['default']
        }
    });



    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concat', 'uglify:js', 'shell:webSrvCopy', 'watch']);
};
