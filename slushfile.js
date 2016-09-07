'use strict';

const path = require('path');
const gulp = require('gulp');
const moment = require('moment-timezone');
const inquirer = require('inquirer');
const chalk = require('chalk');
const argv = require('minimist')(process.argv.slice(2));
const clone = require('lodash/clone');
const validateGithubRepo = require('./utils/validate-github-repo');
const parseGithubRepo = require('./utils/parse-github-repo');
const getDefaults = require('./utils/get-defaults');
const slugify = require('./utils/slugify');
const getBootswatchThemes = require('./utils/get-bootswatch-themes');
const installTheme = require('./tasks/install-theme');
const pkg = require('./package.json');

const THEMES_DIR = path.join(__dirname, 'themes');

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
    default() {
      if (defaults.config && defaults.config.repository) {
        return defaults.config.respository;
      }
      if (defaults.gitConfig && defaults.gitConfig['remote "origin"']) {
        return defaults.gitConfig['remote "origin"'].url;
      }
    },
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
    message: `What is the CNAME / hostname for your site? [Leave blank if not using a custom domain]
[e.g., If you own the domain 'foo.com' and you intend to point it at this site, enter 'foo.com' here]
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
    default: defaults.config && defaults.config.timezone ? defaults.config.timezone : defaults.timezone,
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
    when: answers => answers.framework === 'bootstrap3',
    choices() {
      const choices = [{
        name: '- None -',
        value: 'none'
      }, new inquirer.Separator()];

      return getBootswatchThemes().then(themes => choices.concat(themes));
    }
  }, {
    type: 'confirm',
    name: 'moveon',
    message: 'Continue?'
  }];

  // Ask
  inquirer.prompt(prompts).then(answersRaw => {
    let answers = clone(answersRaw);
    if (!answers.moveon) {
      return done();
    }

    // Add GitHub repo info
    answers = Object.assign(answers, parseGithubRepo(answers.github));

    // Add version of this generator
    answers.generatorVersion = pkg.version;

    // Basic time info in selected timezone
    answers.now = moment.tz(new Date(), answers.timezone).format('YYYY-MM-DD HH:mm:ss Z');
    answers.year = moment.tz(new Date(), answers.timezone).format('YYYY');

    // Add theme name
    answers.theme = 'default';

    installTheme({
      answers,
      defaults,
      themesDir: THEMES_DIR,
      skipInstall: argv['skip-install']
    })
    .then(() => {
      done();
      process.exit();
    })
    .catch(err => {
      done(err);
      process.exit();
    });
  });
});
