# GitHub Pages Generator (w/Slush) [![npm version](https://badge.fury.io/js/slush-gh-pages.svg)](https://badge.fury.io/js/slush-gh-pages)

A [Slush](http://slushjs.github.io) generator for GitHub Pages that provides robust tooling for creating sophisticated Jekyll-based static websites.

### Goals

The goal of this project is to make it incredibly easy to get up-and-running with a GitHub Pages site that goes beyond the simple templates they offer. This generator has incorporated many of the best practices for building Jekyll-based sites, and adds in a number of helpful, Node.js-based development tools, as well as an easy selection of a CSS framework (Concise.css, Bootstrap v4, Bootstrap v3) and if using Bootstrap v3, Bootswatch themes. All is set up in a way that treats the framework and theme as a starting point that is easy to expand upon.

A key focus is on simplicity, so in general the only commands you'll need to use in your project are `npm start` and `npm run deploy`. `npm start` will launch your local development environment, and watch your JS, SCSS, image and icon assets for changes to automatically recompile them, and `npm run deploy` aliases `npm version minor` and will increment your version identifier and commit your project to your GitHub repository, effectively deploying the latest version of your site.

### To use

First prepare your environments. You'll need a working [Ruby](https://github.com/github/pages-gem#1-ruby) environment, and a working [Node.js](https://gist.github.com/mshick/306171bf69cf6d901d1332f49b5c4e2d) environment. Installing those is outside the scope of this humble README, but those links should set you straight!

There are a few global dependencies as well. Some details might vary, but generally this is all you'll need.

```
[sudo] gem install bundler
npm install slush slush-gh-pages --global
```

Now, clone your GitHub repo and run:

```
cd [REPO_DIR]
git checkout -b gh-pages
slush gh-pages
```

> GitHub provides several options for the location of your GitHub Pages source. `gh-pages` has been around the longest. See: [User, Organization, and Project Pages](https://git.io/v6hek)  

> If you attempt to run Jekyll with the configured modules, and no git repo in your current directory you will encounter some anomalies or errors after running `npm start`.

### What you get

* `npm start` - launch watchers, start serving your site locally, auto-reload with Browser Sync
* `npm version [patch|minor|major]` - create production builds of your assets and push to GitHub, aka, deploy.
* `_assets/javascripts` - build your JS app using ES6, Babel (with [transform-runtime](https://babeljs.io/docs/plugins/transform-runtime/) handling polyfills) , Uglify, Rollup.js and any selected framework libraries. Configure your build in the generated `rollup.config.js`.
* `_assets/stylesheets` - build your stylesheets using SCSS, PostCSS and any selected frameworks. Configure your PostCSS build in the generated `postcss.config.js`.
* `_assets/images` - any images here will be automatically optimized via imagemin.
* `_assets/images/icons` - any `svg` files placed here will automatically be compiled into a svg-sprite.
* `_layouts/compress.html` - the [Jekyll HTML compressor](http://jch.penibelst.de)
* `package.json` - build and watch scripts.
* Gems - all the github supported plugins are enabled, giving you some great features
  * the [github-pages](https://github.com/github/pages-gem) Ruby gem, replicating the deployed environment locally
  * jekyll-mentions
  * jemoji
  * jekyll-redirect-from
  * jekyll-sitemap
  * jekyll-feed
  * jekyll-seo-tag
  * jekyll-paginate
  * jekyll-gist
  * jekyll-github-metadata

### Q&A

In lieu of real documentation, just be prepared to answer the following questions. Sensible defaults are offered where available, read either from your system and directory, or a pre-existing `package.json` or  `_config.yml`.

* What is the PRETTY name of your site?
* What is the name SLUG for your site?
* What is the url for your site?
* What is the hostname for your site? [Leave blank if not using a custom domain]  
  - This will create or modify your `CNAME` file for a custom domain.
* Who is authoring the site?
* Twitter username?
  - [jekyll-seo-tag](https://github.com/jekyll/jekyll-seo-tag) is installed by default, and can make use of this.
* Please describe your site.
* What is the timezone for your site?
  - This will detect your system TZ as the default.
* What is the version of your site?
* Which permalink pattern would you like to use? See: [jekyll permalink style](https://jekyllrb.com/docs/permalinks/#built-in-permalink-styles)
* GitHub repo name? (e.g. foo/bar, https://github.com/foo/bar.git) This is required!
  - Because some of the GitHub Pages modules will fail without this, and I think they are important for the whole process, please have this ready, even if you haven't added any files to your repo just yet.
* Branch for GitHub Pages?
  - This is often `gh-pages` but GitHub has a number of [other options](https://git.io/v6hek)
* GitHub token? (Required for some plugins. Suggested permissions are 'public_repo' and 'gist'. See: [Creating an access token for command-line use](https://git.io/v61m7))
* Which CSS & JS framework would you like to use?  
  - [Concise.css](http://concisecss.com)
  - [Bootstrap v4](https://getbootstrap.com)
  - [Bootstrap v3](https://getbootstrap.com)
  - Blank — just some stub files and directories.
* If you chose Bootstrap v3 you will also have the option to select a [Bootswatch](https://bootswatch.com)

### Nice to know

Feel free to run this generator multiple times, or over a GitHub Pages project you've already started working on, but where you think some of the tools here might come in handy. During the Q&A phase you'll have many defaults provided based on reading your system env and any existing `package.json` `_config.yml` and `_data/authors.yml` files in your current directory.

After the Q&A you will be prompted for a conflict resolution for any file that would be modified by the generator. You need to be very careful here, since you could overwrite work you want to keep.
