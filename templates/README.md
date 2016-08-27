# {SLUSH{=name}} on GitHub Pages

{SLUSH{=description}}

> This boilerplate was generated with [slush-gh-pages](https://github.com/ronik-design/slush-gh-pages).

### To develop

```
git clone {SLUSH{=githubRepoUrl}}
cd {SLUSH{=githubRepoName}}
git checkout -b gh-pages
npm install
npm start
```

> GitHub provides several options for the location of your GitHub Pages source. `gh-pages` has been around the longest. See: [User, Organization, and Project Pages](https://git.io/v6hek)

> If you attempt to run Jekyll with the configured modules, and no git repo in your current directory you will encounter some anomalies or errors after running `npm start`.

### To release

```
git commit -am "message here"
npm version [patch|minor|major]
```

> `npm` required that you have a clean repo (no modified files) before running `npm version`

### Files and directories

* `_assets/javascripts/main.js` - write your JS app using ES6, Babel (with [transform-runtime](https://babeljs.io/docs/plugins/transform-runtime/) handling polyfills), Uglify, Rollup.js and any selected framework libraries. Configure your build in the generated `rollup.config.js`.
* `_assets/stylesheets/main.scss` - write your stylesheets using SCSS, PostCSS and any selected frameworks. Configure your PostCSS build in the generated `postcss.config.js`.
* `_assets/images` - any images here will be automatically optimized via imagemin.
* `_assets/images/icons` - any `svg` files placed here will automatically be compiled into a svg-sprite.
* `_assets/fonts` - if you chose Bootstrap v3 Glyphicons will be copied here during install, otherwise use as you see fit.
* `.githubtoken` - this is your API token. It is ignored by default. Don't commit it, unless you really know what you're doing!
