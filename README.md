grunt-simple-ejs
================

オプションにincludePathを追加してみた。
テンプレートのejsファイルのincludeの指定をシンプルにできます。
includePathで指定したディレクトリをルートとして
includeで書かれたファイルを参照するように。

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        ejs: {
           dev: {
               templateRoot: 'src/ejs',
               template: [ '*.ejs', 'article/*.ejs' ],
               dest: './',
               include: ['bower_components/external-templates/*.ejs'],
               includePath: './examples/src/ejs/include'
               options: [ 'option.dev.json', { env: 'dev' } ]
           }
        }
    });

    grunt.loadNpmTasks('grunt-simple-ejs');
    grunt.registerTask('default', ['ejs:dev']);
};
```
