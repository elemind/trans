// generated on 2015-09-11 using generator-gulp-webapp 1.0.3
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
const $ = gulpLoadPlugins();
const reload = browserSync.reload;

var argv = require('minimist')(process.argv.slice(2)),
    env = (argv.production) ? 'production': 'devel',
    settings = {
      devel: { _config: '_config.yml', _folder: '.tmp' },
      production: { _config: '_config.dist.yml', _folder: 'dist'}
    };

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));
gulp.task('clean_scripts', del.bind(null, ['.tmp/scripts/*.*']));
gulp.task('clean_images', del.bind(null, ['.tmp/images/*.*']));

gulp.task('copy_scripts', ['clean_scripts'], () => {
  return gulp.src('app/scripts/**/*.js').pipe(gulp.dest('.tmp/scripts'));
});

gulp.task('copy_images', ['clean_images'], () => {
  return gulp.src('app/images/**/*.*').pipe(gulp.dest('.tmp/images'));
});

gulp.task('styles', () => {
  var outputStyle = (argv.production) ? 'compressed': 'expanded';
  return gulp.src('app/_styles/main.scss')
    .pipe($.plumber())
    .pipe($.sass.sync({
      outputStyle: outputStyle,
      precision: 10,
      includePaths: ['.', 'app/_sass']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['last 2 version']}))
    .pipe(gulp.dest(settings[env]._folder + '/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('app/fonts/**/*'))
    .pipe(gulp.dest(settings[env]._folder + '/fonts'));
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest(settings.production._folder + '/images'));
});

gulp.task('jekyll', function () {
  return gulp.src(settings[env]._config)
    .pipe($.shell([
      'jekyll build --config <%= file.path %>'
    ]))
    .pipe(reload({stream: true}));
});

gulp.task('compile', ['jekyll'], function(){
  gulp.start('assets');
});

gulp.task('assets', ['fonts','styles']);

gulp.task('serve:production', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: [settings.production._folder]
    }
  });
});

gulp.task('serve', ['compile'], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: [settings[env]._folder],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('app/**/*.html', ['compile']);
  gulp.watch('app/**/*.haml', ['compile']);
  gulp.watch('app/_styles/**/*.scss', ['styles']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('app/scripts/**/*', ['copy_scripts']).on('change', reload);
  gulp.watch('app/images/**/*', ['copy_images']).on('change', reload);
});

gulp.task('build', ['compile'], () => {
  return gulp.start('images');
});

gulp.task('default', ['clean'], () => {
  if(argv.production){
    return gulp.start('build');
  } else {
    return gulp.start('serve');
  }
});
