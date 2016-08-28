# {SLUSH{=name}} on GitHub Pages

{SLUSH{=description}}

> This boilerplate was generated with [slush-gh-pages](https://github.com/ronik-design/slush-gh-pages).

### To develop

If you're starting fresh with this project, here's what you need to do.

```
git clone {SLUSH{=githubRepoUrl}}.git
cd {SLUSH{=githubRepoName}}
git checkout -b {SLUSH{ if (branch) { }}{SLUSH{=branch}}{SLUSH{ } else { }}gh-pages{SLUSH{ } }}
echo [YOUR_GITHUB_TOKEN] > .githubtoken
npm install
npm start
```

> NOTE: If you don't know about GitHub tokens see: [Creating an access token for command-line use](https://git.io/v61m7). You will need the `public_repos` and `gist` permissions for all plugins to work properly.

> NOTE: GitHub provides several options for the location of your GitHub Pages source. `gh-pages` has been around the longest. See: [User, Organization, and Project Pages](https://git.io/v6hek)

> NOTE: If you attempt to run Jekyll with the configured modules, and no git repo in your current directory you will encounter some anomalies or errors after running `npm start`.

### To release

```
git commit -am "message here"
npm version [patch|minor|major]
```

> `npm` required that you have a clean repo (no modified files) before running `npm version`

### Travis CI and testing

Some very basic tests are included in the `__tests__` directory along with a `.travis.yml` file. If you choose to set up Travis CI remember to set the `JEKYLL_GITHUB_TOKEN` environment variable in the settings for your repository.

### Files and directories

* `_assets/javascripts/main.js` - write your JS app using ES6, Babel (with [transform-runtime](https://babeljs.io/docs/plugins/transform-runtime/) handling polyfills), Uglify, Rollup.js and any selected framework libraries. Configure your build in the generated `rollup.config.js`.
* `_assets/stylesheets/main.scss` - write your stylesheets using SCSS, PostCSS and any selected frameworks. Configure your PostCSS build in the generated `postcss.config.js`.
* `_assets/images` - any images here will be automatically optimized via imagemin.
* `_assets/images/icons` - any `svg` files placed here will automatically be compiled into a svg-sprite.
* `_assets/fonts` - if you chose Bootstrap v3 Glyphicons will be copied here during install, otherwise use as you see fit.
* `.githubtoken` - this is your API token. It is ignored by default. Don't commit it, unless you really know what you're doing!
