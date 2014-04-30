module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-stylus');

    grunt.initConfig({
        shell: {
            getDistPackages: {
                command: [
                    'bower install',
                    'cd src',
                    'npm install',
                    'cd ..'
                ].join('&&')
            }
        },
        nodewebkit: {
            build: {
                options: {
                    build_dir: './build', // Where the build version of my node-webkit app is saved
                    mac: true,
                    win: true,
                    linux32: true,
                    linux64: false
                },
                src: ['./src/**/*'] // Your node-webkit app
            }
        },
        stylus: {
            compile: {
                options: {},
                files: {
                    'src/css/connect.css': 'src/css/connect.styl',
                    'src/css/style.css': 'src/css/style.styl'
                }
            }
        }
    });

    grunt.registerTask('build', ['shell', 'stylus', 'nodewebkit']);
    grunt.registerTask('default', ['build']);
};