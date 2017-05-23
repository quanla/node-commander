var chokidar = require("chokidar");
var gulp = require("gulp");
const path = require("path");

var compileStyl = function() {
    return new Promise((resolve, reject)=> {

        var stylus = require("gulp-stylus");
        gulp.src("./react/common/style/style.styl")
            .pipe(stylus({
                compress: true
            }))
            .pipe(gulp.dest("./dist/css"))
            .on("end", function() {
                resolve();
                console.log("Compiling stylus done");
            })
        ;
    });
};

var inject_ = function() {
    return new Promise((resolve, reject)=> {

        var target = gulp.src(path.join(__dirname, '../react/common/style/style.styl') );
        var sort = require('gulp-sort');
        var sources = gulp.src([path.join(__dirname, '../react/**/*.styl')], {read: false}).pipe(sort());

        var inject = require("gulp-inject");
        target
            .pipe(inject(sources, {
                starttag: '// inject:all',
                endtag: '// endinject',
                transform: function (filepath, file, i, length) {
                    if (filepath.startsWith("/react/common/style")) {
                        return null;
                    }
                    return `@import "../..${filepath.replace(new RegExp("/react", "g"), "")}";`;
                }
            }))
            .pipe(gulp.dest(path.join(__dirname, '../react/common/style')))
            .on("end", ()=>{
                console.log("Inject stylus done");
                resolve();
            })
        ;
    });
};

module.exports = {
    watch: ()=> {
        chokidar
            .watch([path.join(__dirname, '../react/**/*.styl')], {
                ignoreInitial: true
            })
            .on('add', function(event, path) {
                inject_().then(compileStyl);
            })
            .on('unlink', function(event, path) {
                inject_().then(compileStyl);
            })
            .on('change', function(event, path) {
                compileStyl();
            })
        ;
        inject_().then(compileStyl);

    },
    compile: ()=> {
        return inject_().then(compileStyl);
    }



};