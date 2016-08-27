'use strict';

const gulp = require('gulp');
const path = require('path');
const async = require('async');
const install = require('gulp-install');
const conflict = require('gulp-conflict');
const template = require('gulp-template');
const rename = require('gulp-rename');
const jeditor = require('gulp-json-editor');
const clone = require('lodash/clone');
const merge = require('lodash/merge');
const inquirer = require('inquirer');
const moment = require('moment-timezone');
const parseGithubRepo = require('./utils/parse-github-repo');
const getDefaults = require('./utils/get-defaults');
const dest = require('./utils/dest');
const slugify = require('./utils/slugify');
const getBootswatchThemes = require('./utils/get-bootswatch-themes');

const pkg = require('./package.json');

// TODO: Replace is isTextOrBinary module for better safety
const BINARY_EXTENSIONS = [
  '.png', '.ico', '.gif', '.jpg', '.jpeg', '.svg', '.psd', '.bmp', '.webp', '.webm'
];

const TEMPLATE_SETTINGS = {
  evaluate: /\{SLUSH\{(.+?)\}\}/g,
  interpolate: /\{SLUSH\{=(.+?)\}\}/g,
  escape: /\{SLUSH\{-(.+?)\}\}/g
};

const defaults = getDefaults();

gulp.task('default', done => {
  const prompts = [{
    name: 'name',
    message: `What is the PRETTY name of your site?
>`,
    default: defaults.name
  }, {
    name: 'slug',
    message: `What is the name SLUG for your site?
>`,
    default: defaults.slug,
    validate(slug) {
      return slug === slugify(slug);
    }
  }, {
    name: 'url',
    message: `What is the url for your site?
>`,
    default(answers) {
      return `http://www.${answers.slug}.com`;
    }
  }, {
    name: 'hostname',
    message: `What is the hostname for your site? [Leave blank if not using a custom domain]
>`,
    default() {
      return false;
    }
  }, {
    name: 'author',
    message: `Who is authoring the site?
>`,
    default() {
      let author = defaults.userName;
      if (defaults.authorEmail) {
        author += ` <${defaults.authorEmail}>`;
      }
      return author;
    }
  }, {
    name: 'description',
    message: `Please describe your site.
>`
  }, {
    name: 'timezone',
    message: `What is the timezone for your site?
>`,
    default: defaults.timezone
  }, {
    name: 'version',
    message: `What is the version of your site?
>`,
    default() {
      if (defaults.pkg && defaults.pkg.version) {
        return defaults.pkg.version;
      }
      return '0.1.0';
    }
  }, {
    name: 'permalink',
    message: `Which permalink pattern would you like to use?
>`,
    type: 'list',
    choices: [{
      name: 'Date',
      message: `/:categories/:year/:month/:day/:title.html
>`,
      value: 'date'
    }, {
      name: 'Pretty',
      message: `/:categories/:year/:month/:day/:title/
>`,
      value: 'pretty'
    }, {
      name: 'Ordinal',
      message: `/:categories/:year/:y_day/:title.html
>`,
      value: 'ordinal'
    }, {
      name: 'None',
      message: `/:categories/:title.html
>`,
      value: 'none'
    }]
  }, {
    name: 'github',
    message: `GitHub repo name? (e.g. foo/bar, https://github.com/foo/bar.git) This is required!
>`,
    validate(str) {
      if (str === null) {
        return false;
      }
      return true;
    },
    filter(str) {
      return parseGithubRepo(str);
    }
  }, {
    name: 'githubToken',
    message: `GitHub token? (Required for some plugins. Suggested permissions are 'public_repo' and 'gist'. See: https://git.io/v61m7)
>`,
    default: defaults.githubToken
  }, {
    name: 'twitter',
    message: `Twitter username?
>`
  }, {
    name: 'framework',
    message: 'Which CSS & JS framework would you like to use?',
    type: 'list',
    choices: [{
      name: 'Concise CSS (a pure CSS framework, no scripts necessary)',
      value: 'concise'
    }, {
      name: 'Bootstrap v4 (jQuery and support scripts)',
      value: 'bootstrap4'
    }, {
      name: 'Bootstrap v3 + Bootswatch (jQuery and support scripts)',
      value: 'bootstrap3'
    }, {
      name: 'Blank (nothing at all, just a css stub dir, and some script polyfills)',
      value: 'blank'
    }]
  }, {
    name: 'bootswatch',
    message: 'Which Bootswatch template would you like?',
    type: 'list',
    choices() {
      const choices = [{
        name: '- None -',
        value: 'none'
      }];
      return getBootswatchThemes().then(themes => choices.concat(themes));
    }
  }, {
    type: 'confirm',
    name: 'moveon',
    message: 'Continue?'
  }];

  // Ask
  inquirer.prompt(prompts).then(answers => {
    if (!answers.moveon) {
      return done();
    }

    const config = clone(answers);

    config.generatorVersion = pkg.version;
    config.now = moment.tz(new Date(), answers.timezone).format('YYYY-MM-DD HH:mm:ss Z');
    config.year = moment.tz(new Date(), answers.timezone).format('YYYY');

    const authorEmail = answers.author.match(/(<(.+)>)/);
    config.authorName = authorEmail ? answers.author.replace(authorEmail[1], '').trim() : answers.author.trim();
    config.authorEmail = authorEmail ? authorEmail[2].trim() : '';

    const githubParts = answers.github.match(/([^\/].+)\/(.+)/);
    config.githubAuthorName = githubParts ? githubParts[1].trim() : '';
    config.githubAuthorUrl = `https://github.com/${config.githubAuthorName}`;
    config.githubRepoName = githubParts ? githubParts[2].trim() : '';
    config.githubRepoUrl = `https://github.com/${answers.github}`;

    const binaryFileExtensions = BINARY_EXTENSIONS.join('|');

    const srcDir = path.join(__dirname, 'templates');
    const destDir = dest();

    const installTextFiles = function (cb) {
      const src = [
        `**/*!(${binaryFileExtensions})`,
        '!_assets/stylesheets',
        '!_assets/stylesheets/**',
        '!_assets/javascripts',
        '!_assets/javascripts/**',
        '!CNAME',
        '!_githubtoken',
        '!_gitignore',
        '!_eslintrc',
        '!_stylelintrc',
        '!.DS_Store',
        '!**/.DS_Store',
        '!package.json'
      ];

      gulp.src(src, {dot: true, cwd: srcDir, base: srcDir})
        .pipe(template(config, TEMPLATE_SETTINGS))
        .pipe(conflict(destDir, {logger: console.log}))
        .pipe(gulp.dest(destDir))
        .on('end', cb);
    };

    const installBinaryFiles = function (cb) {
      const src = [
        `**/*.+(${binaryFileExtensions})`,
        '!_assets/stylesheets',
        '!_assets/stylesheets/**',
        '!_assets/javascripts',
        '!_assets/javascripts/**',
        '!CNAME',
        '!_githubtoken',
        '!_gitignore',
        '!_eslintrc',
        '!_stylelintrc',
        '!.DS_Store',
        '!**/.DS_Store',
        '!package.json'
      ];

      gulp.src(src, {dot: true, cwd: srcDir, base: srcDir})
        .pipe(conflict(destDir, {logger: console.log}))
        .pipe(gulp.dest(destDir))
        .on('end', cb);
    };

    const installDotfiles = function (cb) {
      gulp.src(['_gitignore', '_eslintrc', '_stylelintrc'], {cwd: srcDir, base: srcDir})
        .pipe(rename(path => {
          path.basename = path.basename.replace('_', '.');
        }))
        .pipe(conflict(destDir, {logger: console.log}))
        .pipe(gulp.dest(destDir))
        .on('end', cb);
    };

    const installGithubtoken = function (cb) {
      if (!config.githubtoken) {
        return cb();
      }
      gulp.src(['_githubtoken'], {cwd: srcDir, base: srcDir})
        .pipe(rename(path => {
          path.basename = path.basename.replace('_', '.');
        }))
        .pipe(template(config, TEMPLATE_SETTINGS))
        .pipe(conflict(destDir, {logger: console.log}))
        .pipe(gulp.dest(destDir))
        .on('end', cb);
    };

    const installStylesheetFiles = function (cb) {
      const src = [
        `_assets/stylesheets/${config.framework}/**/*`,
        '!.DS_Store',
        '!**/.DS_Store'
      ];

      gulp.src(src, {dot: true, cwd: srcDir, base: srcDir})
        .pipe(template(config, TEMPLATE_SETTINGS))
        .pipe(rename(filepath => {
          filepath.dirname = filepath.dirname.replace(`/${config.framework}`, '');
          return;
        }))
        .pipe(conflict(destDir, {logger: console.log}))
        .pipe(gulp.dest(destDir))
        .on('end', cb);
    };

    const installJavascriptFiles = function (cb) {
      let jsFramework = config.framework;
      if (jsFramework === 'concise') {
        jsFramework = 'blank';
      }
      const src = [
        `_assets/javascripts/${jsFramework}/**/*`,
        '!.DS_Store',
        '!**/.DS_Store'
      ];

      gulp.src(src, {dot: true, cwd: srcDir, base: srcDir})
        .pipe(template(config, TEMPLATE_SETTINGS))
        .pipe(rename(filepath => {
          filepath.dirname = filepath.dirname.replace(`/${jsFramework}`, '');
          return;
        }))
        .pipe(conflict(destDir, {logger: console.log}))
        .pipe(gulp.dest(destDir))
        .on('end', cb);
    };

    const installCNAME = function (cb) {
      if (!answers.hostname) {
        return cb();
      }

      gulp.src('CNAME', {cwd: srcDir, base: srcDir})
        .pipe(template(config, TEMPLATE_SETTINGS))
        .pipe(conflict(destDir, {logger: console.log}))
        .pipe(gulp.dest(destDir))
        .on('end', cb);
    };

    const mergePackageAndInstall = function (cb) {
      const pkgMerge = pkg => {
        if (defaults.pkg) {
          return merge(defaults.pkg, pkg);
        }
        return pkg;
      };

      gulp.src('package.json', {cwd: srcDir, base: srcDir})
        .pipe(template(config, TEMPLATE_SETTINGS))
        .pipe(jeditor(pkgMerge, {
          'indent_char': ' ',
          'indent_size': 2
        }))
        .pipe(gulp.dest(destDir))
        .pipe(install())
        .on('end', cb);
    };
    const tasks = [
      installTextFiles,
      installBinaryFiles,
      installCNAME,
      installDotfiles,
      installGithubtoken,
      installStylesheetFiles,
      installJavascriptFiles,
      mergePackageAndInstall
    ];
    async.series(tasks, done);
  });
});
