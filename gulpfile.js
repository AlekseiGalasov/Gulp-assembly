
//Connect guld modules
const gulp = require('gulp'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    cssClean = require('gulp-clean-css'),
    jsTerser = require('gulp-terser'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    sourseMap = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin');

    
//Array of all CSS files
//You can add new files here 
const scssFiles = [
    './src/scss/main.scss',
    './src/scss/media.scss'
]

//Array of all JS files
//You can add new files here 
const jsFiles = [
    './src/js/main.js',
    './src/js/multiply.js'
]

//Task for the CSS
function styles() {
    //Template to the searching CSS files
    return gulp.src(scssFiles)
    .pipe(sourseMap.init())
    .pipe(sass().on('error', sass.logError))
    //Concat all css files in './build/css/style.css'
    .pipe(concat('style.css'))
    //plugin to minify CSS
    .pipe(cssClean({compatibility: 'ie8'}))

    //plugin to add prefixes CSS
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 2 versions'],
        cascade: false
    }))

    .pipe(sourseMap.write())
    //Entering folder for the files
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
}

//Task for the JS
function scripts() {
    //Template to the searching JS files
    return gulp.src(jsFiles)

    //Concat all css files in './build/js/main.js'
    .pipe(concat('main.js'))

    //plugin to minify CSS
    .pipe(jsTerser())

    //Entering folder for the files
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());
}
//Delete all in folder
function clean() {
    return del(['./build/*'])
}

gulp.task('imgCompress', () => {
    return gulp.src('./src/img/**')
    .pipe(imagemin({
        progressive: true
    }))
    .pipe(gulp.dest('./build/img/'))
})

//Watcher 
function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./src/img/**', gulp.series('imgCompress'))
    //watching styles
    gulp.watch('./src/scss/**/*.scss', styles)
    //watching scripts
    gulp.watch('./src/js/**/*.js', scripts)
    //watching html
    gulp.watch("./*.html").on('change', browserSync.reload);
}

//Calling task for the styles function
gulp.task('styles', styles);
//Calling task for the scripts function
gulp.task('scripts', scripts);
//Delete files
gulp.task('clean', clean);
//Watch files
gulp.task('watch', watch);
//Delete all files and run styles and scripts 
gulp.task('build', gulp.series(clean, gulp.parallel('styles' , 'scripts', 'imgCompress')))
//Run Build and Watch task
gulp.task('dev', gulp.series('build', 'watch'));