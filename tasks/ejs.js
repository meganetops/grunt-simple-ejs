module.exports = function (grunt) {
    var parseOptions = require('../lib/parseOptions');

    grunt.registerMultiTask('ejs', 'process ejs template', function () {
        var path = require('path'),
            ejs = require('ejs'),
            _ = grunt.util._,

            target = this.target,
            config = grunt.config('ejs')[target];

        var options = parseOptions(config),
            files = [],
            templateRoot = config.templateRoot || '.',
            template = _.isArray(config.template) ? config.template : [config.template],
            include = config.include || [],
            silentInclude = config.silentInclude === false ? false : true,
            withExtensions = config.withExtensions ? true : false;

        if (withExtensions) {
            options = _.defaults(options, require('../lib/extensions'));
        }



        template.forEach(function (pattern) {
            grunt.file.expandMapping(pattern, config.dest, {
                cwd: templateRoot,
                rename: function (dest, matchedSrcPath, options) {
                    return path.join(
                        dest,
                        matchedSrcPath.replace(/\.ejs$/, '')
                    );
                }
            }).forEach(function (file) {
                var srcPath = file.src[0];
                var source = grunt.file.read(srcPath);

/* //////////////
ここから
////////////// */
                if(config.includePath) {
                    // <%include %>が記述されているファイルから
                    // includePathへの相対パスを取得
                    relativePath = path.relative(path.dirname(srcPath),config.includePath);
                    // relativeで最後にスラッシュが入らないので入れておく
                    if(!/\//.test(relativePath.length-1)){
                        relativePath = relativePath+"/";
                    }
                    reg = new RegExp("<% include (.*) ?%>","i");
                    //ソース内のinclude指定を置換
                    source = source.replace(reg,"<% include "+relativePath+"$1 %>");    
                }
/* //////////////
ここまで
////////////// */ 

                // embed include ejs
                var includeStatements = [];
                include.forEach(function (pattern) {
                    grunt.file.expand(pattern).forEach(function (file) {
                        var includePath = path.relative(path.dirname(srcPath), file);
                        includeStatements.push(
                            '<% include ' + includePath + '%>'
                        );
                    });

                    if (silentInclude) {
                        includeStatements.push('<% buf = [] %>');
                    }
                });
                source = includeStatements.join('') + source;
   
                options.filename = srcPath;
                grunt.file.write(
                    file.dest,
                    ejs.render(source, options),
                    { encoding: 'utf8' }
                );
                console.log('[write] %s', file.dest);
            });;
        });
    });
};


