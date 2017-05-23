
var gulp = require("gulp");

gulp.task("compile-stylus", require("./build/compile-stylus").compile);
gulp.task("compile-stylus:watch", require("./build/compile-stylus").watch);

