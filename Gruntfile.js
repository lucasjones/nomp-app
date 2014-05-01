module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    
    var target = grunt.option('target') || 'all';
    if(['all', 'win', 'mac', 'linux'].indexOf(target) === -1) {
        console.error("No such target: " + target);
    }

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
                    mac: target === 'all' || target === 'mac',
                    win: target === 'all' || target === 'win',
                    linux32: target === 'all' || target === 'linux'
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
