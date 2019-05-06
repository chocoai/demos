var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    minimist = require('minimist'),
    gutil = require('gulp-util'),
    reload = browserSync.reload,
    $ = require('gulp-load-plugins')();

//默认development环境
var knowOptions = {
    string: 'env',
    default: {
        env: process.env.NODE_ENV || 'development'
    }
};

var options = minimist(process.argv.slice(2), knowOptions);

//生成filename文件，存入string内容
function string_src(filename, string) {
    var src = require('stream').Readable({ objectMode: true });
    src._read = function () {
        this.push(new gutil.File({ cwd: "", base: "", path: filename, contents: new Buffer(string) }));
        this.push(null);
    }
    return src;
}

gulp.task('constants', function() {
    //读入config.json文件
    var myConfig = require('./config.json');
    //取出对应的配置信息
    var envConfig = myConfig[options.env];
    var conConfig = 'appconfig = ' + JSON.stringify(envConfig);
    //生成config.js文件
    return string_src("apiUrl.js", conConfig)
        .pipe(gulp.dest('lib/api/'))
});

// 管理资源文件路径集合
var config = {};

// 源资源文件路径
config['assets'] = {
    global: '*',
    less: ['less/*.less'],
    _less: ['less/*.less', 'less/common/*.less'],
    css: 'css/',
    _css: 'css/*.css',
    img: 'images/**/*',
    _img: 'images/**/*',
    js: 'js/',
    _js: 'js/*.js',
    html: 'html/',
    _html: 'html/*.*',
    _lib: 'lib/**/*'
};

// 临时资源文件路径
config['sources'] = {
    global: 'sources/',
    _global: 'sources/rev/**/*.json',
    css: 'sources/rev/css',
    _css: 'sources/rev/css/*.json',
    js: 'sources/rev/js',
    _js: 'sources/rev/js/*.json',
    img: 'sources/rev/images',
    _img: 'sources/rev/images/*.json'
};

// 目标文件路径 不用替换
config['dist'] = {
    global: 'dist/',
    _global: 'dist/**/*',
    css: 'dist/css/',
    less: 'dist/less/',
    img: 'dist/images/',
    js: 'dist/js/',
    html: 'dist/html/',
    _html: 'dist/**/*.html',
    rev_json: 'dist/rev-manifest.json',
    rev_img: 'dist/**/*.+(css|html|js)',
    lib: 'dist/lib/'
};

// 发布前清理文件
gulp.task('clean', function() {
    return gulp.src([config['dist'].global, config['sources'].global], { read: false })
        .pipe($.clean());
});

// 发布后清理临时文件
gulp.task('cnext', function() {
    return gulp.src([config['dist'].rev_json, config['sources'].global], { read: false })
        .pipe($.clean());
});

// css文件处理
gulp.task('buildCss', function() {
    return gulp.src(config['assets']._css)
        .pipe($.minifyCss())
        .pipe($.rev())
        .pipe(gulp.dest(config['dist'].css))
        .pipe($.rev.manifest())
        .pipe(gulp.dest(config['sources'].css));
});

// js文件处理
gulp.task('buildJs', function() {
    return gulp.src(config['assets']._js)
        .pipe($.uglify().on('error', function (e) {
            console.log(e)
        }))
        .pipe($.if('!config.js', $.rev()))
        .pipe(gulp.dest(config['dist'].js))
        .pipe($.rev.manifest())
        .pipe(gulp.dest(config['sources'].js));
});

// img文件处理
gulp.task('buildImg', function() {
    return gulp.src(config['assets']._img)
        .pipe($.rev())
        .pipe(gulp.dest(config['dist'].img))
        .pipe($.rev.manifest())
        .pipe(gulp.dest(config['dist'].global));
});

// html文件处理
gulp.task('buildHtml', function() {
    return gulp.src(config['assets']._html)
        .pipe(gulp.dest(config['dist'].html));
});

// 版本号文件替换
gulp.task('rev', ['buildJs', 'buildCss', 'buildHtml'], function() {
    return gulp.src([config['sources']._global, config['dist']._global]) //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe($.revCollector()) //- 执行文件内css名的替换
        .pipe(gulp.dest(config['dist'].global))
        .pipe(reload({ stream: true })); //- 替换后的文件输出的目录
});

// 版本号文件替换(仅图片)
gulp.task('revimg', ['buildImg'], function() {
    return gulp.src([config['dist'].rev_json, config['dist'].rev_img])
        .pipe($.revCollector())
        .pipe(gulp.dest(config['dist'].global))
        .pipe(reload({ stream: true }));
});

// 编译less
gulp.task('less', function() {
    gulp.src(config['assets'].less)
        .pipe($.plumber({ errorHandler: $.notify.onError('Error: <%= error.message %>') }))
        .pipe($.less())
        .pipe(gulp.dest(config['assets'].css));
});

gulp.task('copy', function() {
    return gulp.src(config['assets']._lib)
        .pipe(gulp.dest(config['dist'].lib));
});

// 简化命令行命令(直接输入gulp); 监听事件(编译less后压缩css)
gulp.task('default', ['constants'], function() {
    gulp.watch(config['assets']._less, ['less']);
});

// 发布
gulp.task('build', ['constants'], function(cb) {
    $.sequence('clean', 'rev', 'revimg', 'cnext', 'copy', cb);
})
