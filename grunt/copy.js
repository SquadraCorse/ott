module.exports = {
    'build': {
        cwd: 'target/build-frontend',
        src: ['**'],
        dest: 'target/build/<%= package.version %>',
        expand: true
    }
};