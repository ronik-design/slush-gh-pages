# GitHub Pages Generator (w/Slush)

[![npm version](https://badge.fury.io/js/slush-gh-pages.svg)](https://badge.fury.io/js/slush-gh-pages)
[![Build Status](https://travis-ci.org/ronik-design/slush-gh-pages.svg?branch=master)](https://travis-ci.org/ronik-design/slush-gh-pages)

A [Slush](http://slushjs.github.io) generator for GitHub Pages that provides robust tooling for creating sophisticated Jekyll-based static websites.

[A [Ronik Design](http://www.ronikdesign.com) creation.]

### Goals

The goal of this project is to make it incredibly easy to get up-and-running with a GitHub Pages site that goes beyond the simple templates they offer. This generator has incorporated many of the best practices for building Jekyll-based sites, and adds in a number of helpful, Node.js-based development tools, as well as an easy selection of a CSS framework (Concise.css, Bootstrap v4, Bootstrap v3) and if using Bootstrap v3, Bootswatch themes. All is set up in a way that treats the framework and theme as a starting point that is easy to expand upon. You can also use it with no framework at all, just the stub directories and build tools.

A key focus is on simplicity, so in general the only commands you'll need to use in your project are `npm start` and `npm run deploy`. `npm start` will launch your local development environment, and watch your JS, SCSS, image and icon assets for changes to automatically recompile them, and `npm run deploy` aliases `npm version minor` and will increment your version identifier and commit your project to your GitHub repository, effectively deploying the latest version of your site.

### Requirements

First prepare your environments. You will need:

  * [Ruby](https://github.com/github/pages-gem#1-ruby) environment, and a working  
  * [Node.js](https://gist.github.com/mshick/306171bf69cf6d901d1332f49b5c4e2d) environment.

Plus, some global packages for those environments.

  * [Bundler](https://bundler.io) Ruby Gem
  * [Slush](https://slushjs.github.io/) npm module

Details might vary, but that should be as easy as running these commands:

```
[sudo] gem install bundler
npm install slush slush-gh-pages --global
```

### Install

Now, clone the GitHub repo you want to set up with Pages and run:

```
cd [REPO_DIR]
git checkout -b gh-pages
slush gh-pages
```

> GitHub provides several options for the location of your GitHub Pages source. the `gh-pages` branch has been around the longest. See: [User, Organization, and Project Pages](https://git.io/v6hek)  

> Running `npm start` after you've generated without a git repo in the working directory can result in some warnings. You've been warned.

### What you get

* `npm start` - launch watchers, start serving your site locally, auto-reload with Browser Sync
* `npm run deploy` - create production builds of your assets, increment the version tag, and push to GitHub. Alias for `npm version minor` which you can also use.
* `_assets/javascripts` - build your JS app using ES2015 (at Stage 0, so some ES7 as well), Babel (with [transform-runtime](https://babeljs.io/docs/plugins/transform-runtime/) handling polyfills), Uglify, Webpack and any selected framework libraries. Configure your build in the generated `webpack.config.js`.
* `_assets/stylesheets` - build your stylesheets using SCSS, PostCSS and any selected frameworks. Configure your PostCSS build in the generated `postcss.config.js`.
* `_assets/images` - any images here will be automatically optimized via imagemin.
* `_assets/images/icons` - any `svg` files placed here will automatically be compiled into a svg-sprite.
* `_layouts/compress.html` - the [Jekyll HTML compressor](http://jch.penibelst.de)
* `package.json` - build and watch scripts.
* Gems - all the github supported plugins are enabled, giving you some great features
  * the [github-pages](https://github.com/github/pages-gem) Ruby gem, replicating the deployed environment locally
  * [jekyll-mentions](https://github.com/jekyll/jekyll-mentions)
  * [jemoji](https://github.com/jekyll/jemoji)
  * [jekyll-redirect-from](https://github.com/jekyll/jekyll-redirect-from)
  * [jekyll-sitemap](https://github.com/jekyll/jekyll-sitemap)
  * [jekyll-feed](https://github.com/jekyll/jekyll-feed)
  * [jekyll-seo-tag](https://github.com/jekyll/jekyll-seo-tag)
  * [jekyll-paginate](https://jekyllrb.com/docs/pagination/)
  * [jekyll-gist](https://github.com/jekyll/jekyll-gist)
  * [jekyll-github-metadata](https://help.github.com/articles/repository-metadata-on-github-pages/)

### Q&A

In lieu of real documentation, just be prepared to answer the following questions. Sensible defaults are offered where available, read either from your system and directory, or a pre-existing `package.json` or  `_config.yml`.

  * GitHub repo name?  This is required. [e.g. foo/bar, https://github.com/foo/bar.git]
    - Because some of the GitHub Pages modules will fail without this, and I think they are important for the whole process,   please have this ready, even if you haven't added any files to your repo just yet.
  * Branch for GitHub Pages? [For Travis CI config]
    - This is often `gh-pages` but GitHub has a number of [other options](https://git.io/v6hek)
  * GitHub token?
    - This is strongly suggested for several of the default plugins to function correctly
    - Suggested permissions are 'public_repo' and 'gist'.
    - See: [Creating an access token for command-line use](https://git.io/v61m7)
  * What is the PRETTY name of your site?
  * What is the name SLUG for your site?
  * What is the url for your site?
  * What is the hostname for your site? [Leave blank if not using a custom domain]  
    - This will create or modify your `CNAME` file for a custom domain.
  * Who is authoring the site?
    - Just the author's name.
  * What is the author's email address?
  * Twitter username?
    - [jekyll-seo-tag](https://github.com/jekyll/jekyll-seo-tag) is installed by default, and can make use of this.
  * Please describe your site.
  * What is the timezone for your site?
    - This will detect your system TZ as the default.
  * What is the version of your site?
    - Detected from an existing `package.json`
  * Which permalink pattern would you like to use?
    - See: [jekyll permalink style](https://jekyllrb.com/docs/permalinks/#built-in-permalink-styles)
  * Which CSS & JS framework would you like to use?  
    - Blank — just some stub files and directories.
    - [Concise.css](http://concisecss.com)
    - [Bootstrap v4](https://getbootstrap.com)
    - [Bootstrap v3](https://getbootstrap.com)
  * If you chose Bootstrap v3 you will also have the option to select a [Bootswatch](https://bootswatch.com)
  * Deploy after intstall?

### Nice to know

Feel free to run this generator multiple times, or over a GitHub Pages project you've already started working on, but where you think some of the tools here might come in handy. During the Q&A phase you'll have many defaults provided based on reading your system env and any existing `package.json` `_config.yml` and `_data/authors.yml` files in your current directory.

After the Q&A you will be prompted for a conflict resolution for any file that would be modified by the generator. You need to be very careful here, since you could overwrite work you want to keep.

### Credit

Created by [Michael Shick](https://www.shick.us) for [Ronik Design](http://www.ronikdesign.com) to ease the creation of simple static sites.
