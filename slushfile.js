'use strict';

const gulp = require('gulp');
const path = require('path');
const exec = require('child_process').exec;
const async = require('async');
const install = require('gulp-install');
const conflict = require('gulp-conflict');
const ignore = require('gulp-ignore');
const template = require('gulp-template');
const rename = require('gulp-rename');
const jeditor = require('gulp-json-editor');
const clone = require('lodash/clone');
const merge = require('lodash/merge');
const inquirer = require('inquirer');
const moment = require('moment-timezone');
const istextorbinary = require('istextorbinary');
const chalk = require('chalk');
const validateGithubRepo = require('./utils/validate-github-repo');
const parseGithubRepo = require('./utils/parse-github-repo');
const getDefaults = require('./utils/get-defaults');
const dest = require('./utils/dest');
const slugify = require('./utils/slugify');
const getBootswatchThemes = require('./utils/get-bootswatch-themes');

const pkg = require('./package.json');

const TEMPLATE_SETTINGS = {
  evaluate: /\{SLUSH\{(.+?)\}\}/g,
  interpolate: /\{SLUSH\{=(.+?)\}\}/g,
  escape: /\{SLUSH\{-(.+?)\}\}/g
};

const defaults = getDefaults();

if (!defaults.repoPresent) {
  console.log(`
---
${chalk.bgRed.bold('No git repo is present. You should clone or init one first!')}
${chalk.bold('(ctrl-c to terminate this set up)')}
---
`);
}

gulp.task('default', done => {
  const prompts = [{
    name: 'github',
    default: defaults.config && defaults.config.repository,
    validate(str) {
      if (str === null) {
        return false;
      }
      return true;
    },
    filter(str) {
      return validateGithubRepo(str);
    },
    message: `GitHub repo name? This is required. [e.g., foo/bar, https://github.com/foo/bar.git]
>`
  }, {
    name: 'branch',
    default(answers) {
      if (defaults.branch) {
        return defaults.branch;
      }
      const repo = parseGithubRepo(answers.github);
      if (repo.githubRepoName === `${repo.githubAuthorName}.github.io`) {
        return 'master';
      }
      return 'gh-pages';
    },
    message: `Branch for GitHub Pages? [required for Travis testing set-up]
>`
  }, {
    name: 'githubToken',
    default: defaults.githubToken,
    message: `GitHub token? [Permissions required are 'public_repo' and 'gist'. See: https://git.io/v61m7]
--It is strongly advised that you provide this. Some plugins may fail without it.--
>`
  }, {
    name: 'name',
    default(answers) {
      if (defaults.name) {
        return defaults.name;
      }
      return parseGithubRepo(answers.github).githubRepoName;
    },
    validate(str) {
      if (!str) {
        return false;
      }
      return true;
    },
    message() {
      return `What is the PRETTY name of your site?
>`;
    }
  }, {
    name: 'slug',
    default(answers) {
      return slugify(answers.name);
    },
    validate(slug) {
      return slug === slugify(slug);
    },
    message: `What is the name SLUG for your site?
>`
  }, {
    name: 'url',
    default(answers) {
      if (defaults.url) {
        return defaults.url;
      }
      const repo = parseGithubRepo(answers.github);
      let hostname = `${repo.githubAuthorName}.github.io`;
      if (hostname !== repo.githubRepoName) {
        hostname += `/${repo.githubRepoName}`;
      }
      return `https://${hostname}`;
    },
    message: `What is the url for your site?
>`
  }, {
    name: 'hostname',
    default: defaults.hostname,
    message: `What is the hostname for your site? [Leave blank if not using a custom domain]
>`
  }, {
    name: 'author',
    default: defaults.authorName,
    message: `Who is authoring the site? [name only]
>`
  }, {
    name: 'email',
    default: defaults.authorEmail,
    message: `Author's email address?
>`
  }, {
    name: 'twitter',
    default: defaults.authorTwitter,
    message: `Author's Twitter username? [for jekyll-seo plugin]
>`
  }, {
    name: 'description',
    default: defaults.description,
    message: `Please describe your site.
>`
  }, {
    name: 'timezone',
    default: defaults.config ? defaults.config.timezone : defaults.timezone,
    message: `What is the timezone for your site?
>`
  }, {
    name: 'version',
    default: defaults.pkg ? defaults.pkg.version : '0.1.0',
    message: `What is the version of your site?
>`
  }, {
    name: 'permalink',
    default: defaults.config && defaults.config.permalink,
    message: `Which permalink pattern would you like to use? [see: https://git.io/v6hJD]
>`,
    type: 'list',
    choices: [{
      name: 'Date (/:categories/:year/:month/:day/:title.html)',
      value: 'date'
    }, {
      name: 'Pretty (/:categories/:year/:month/:day/:title/)',
      value: 'pretty'
    }, {
      name: 'Ordinal (/:categories/:year/:y_day/:title.html)',
      value: 'ordinal'
    }, {
      name: 'None (/:categories/:title.html)',
      value: 'none'
    }]
  }, {
    name: 'framework',
    message: 'Which CSS & JS framework would you like to use?',
    type: 'list',
    choices: [{
      name: 'Blank (nothing at all, just a css stub dir, and some script polyfills)',
      value: 'blank'
    },
    new inquirer.Separator(), {
      name: 'Bootstrap v3 + Bootswatch (jQuery and support scripts)',
      value: 'bootstrap3'
    }, {
      name: 'Bootstrap v4 (jQuery and support scripts)',
      value: 'bootstrap4'
    }, {
      name: 'Concise CSS (a pure CSS framework, no scripts necessary)',
      value: 'concise'
    }]
  }, {
    name: 'bootswatch',
    message: 'Which Bootswatch template would you like?',
    type: 'list',
    when(answers) {
      return answers.framework === 'bootstrap3';
    },
    choices() {
      const choices = [{
        name: '- None -',
        value: 'none'
      }, new inquirer.Separator()];

      return getBootswatchThemes().then(themes => choices.concat(themes));
    }
  }, {
    type: 'confirm',
    name: 'deploy',
    default: false,
    when() {
      return defaults.repoPresent;
    },
    message: 'Deploy after install?'
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

    let config = clone(answers);

    // Add GitHub repo info
    config = Object.assign(config, parseGithubRepo(answers.github));

    // Add version of this generator
    config.generatorVersion = pkg.version;

    // Basic time info in selected timezone
    config.now = moment.tz(new Date(), answers.timezone).format('YYYY-MM-DD HH:mm:ss Z');
    config.year = moment.tz(new Date(), answers.timezone).format('YYYY');

    const srcDir = path.join(__dirname, 'templates');
    const destDir = dest();

    const handleLater = [
      '**/*',
      '!_assets/stylesheets',
      '!_assets/stylesheets/**',
      '!_assets/javascripts',
      '!_assets/javascripts/**',
      '!CNAME',
      '!__*',
      '!**/__*',
      '!package.json'
    ];

    const installTextFiles = function (cb) {
      console.log(chalk.blue('--Installing text files--'));
      const src = handleLater;
      gulp.src(src, {cwd: srcDir, base: srcDir})
        .pipe(ignore.include(file => istextorbinary.isTextSync(file.basename, file.contents)))
        .pipe(template(config, TEMPLATE_SETTINGS))
        .pipe(conflict(destDir, {logger: console.log}))
        .pipe(gulp.dest(destDir))
        .on('end', cb);
    };

    const installBinaryFiles = function (cb) {
      console.log(chalk.blue('--Installing binary files--'));
      const src = handleLater;
      gulp.src(src, {cwd: srcDir, base: srcDir})
        .pipe(ignore.include(file => istextorbinary.isBinarySync(file.basename, file.contents)))
        .pipe(conflict(destDir, {logger: console.log}))
        .pipe(gulp.dest(destDir))
        .on('end', cb);
    };

    const installDotfiles = function (cb) {
      console.log(chalk.blue('--Installing dotfiles--'));
      const dotfiles = [
        '__*',
        '**/__*',
        '!__tests__'
      ];

      if (!config.githubtoken) {
        dotfiles.push('!__githubtoken');
      }

      gulp.src(dotfiles, {cwd: srcDir, base: srcDir})
        .pipe(rename(path => {
          path.basename = path.basename.replace('__', '.');
        }))
        .pipe(template(config, TEMPLATE_SETTINGS))
        .pipe(conflict(destDir, {logger: console.log}))
        .pipe(gulp.dest(destDir))
        .on('end', cb);
    };

    const installStylesheetFiles = function (cb) {
      console.log(chalk.blue('--Installing stylesheets--'));
      const src = `_assets/stylesheets/${config.framework}/**/*`;
      gulp.src(src, {cwd: srcDir, base: srcDir})
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
      console.log(chalk.blue('--Installing javascripts--'));
      let jsFramework = config.framework;
      if (jsFramework === 'concise') {
        jsFramework = 'blank';
      }
      const src = `_assets/javascripts/${jsFramework}/**/*`;
      gulp.src(src, {cwd: srcDir, base: srcDir})
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
      if (!config.hostname) {
        return cb();
      }
      console.log(chalk.blue('--Installing CNAME--'));
      gulp.src('CNAME', {cwd: srcDir, base: srcDir})
        .pipe(template(config, TEMPLATE_SETTINGS))
        .pipe(conflict(destDir, {logger: console.log}))
        .pipe(gulp.dest(destDir))
        .on('end', cb);
    };

    const mergePackageAndInstall = function (cb) {
      console.log(chalk.blue('--Installing package.json--'));
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
        .pipe(conflict(destDir, {logger: console.log}))
        .pipe(gulp.dest(destDir))
        .pipe(install())
        .on('end', cb);
    };

    const deploySite = function (cb) {
      console.log('Deploying...');
      exec('npm run deploy', () => cb());
    };

    const tasks = [
      installTextFiles,
      installBinaryFiles,
      installCNAME,
      installDotfiles,
      installStylesheetFiles,
      installJavascriptFiles,
      mergePackageAndInstall
    ];

    if (answers.deploy) {
      tasks.push(deploySite);
    }

    async.series(tasks, done);
  });
});
