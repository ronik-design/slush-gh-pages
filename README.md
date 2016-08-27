# slush-gh-pages [![npm version](https://badge.fury.io/js/slush-gh-pages.svg)](https://badge.fury.io/js/slush-gh-pages)

A [Slush](http://slushjs.github.io) generator for GitHub Pages that provides robust tooling for creating sophisticated Jekyll-based static websites.

### Goals

The goal of this project is to make it incredibly easy to get up-and-running with a GitHub Pages site that goes beyond the simple templates they offer. This generator has incorporated many of the best practices for building Jekyll-based sites, and adds in a number of helpful, Node.js-based development tools. A key focus is on simplicity, so in general the only commands you'll need to use in your project are `npm start` and `npm version`. `npm start` will launch your local development environment, and watch your JS, SCSS, image and icon assets for changes to automatically recompile them, and `npm version [patch|minor|major]` will increment your version identifier and commit your project to your GitHub repository, effectively deploying the latest version of your site.

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

### Q&A

In lieu of real documentation, just be prepared to answer the following questions. Sensible defaults are offered where available.

* What is the PRETTY name of your site?
* What is the name SLUG for your site?
* What is the url for your site?
* What is the hostname for your site? [Leave blank if not using a custom domain]  
  - This will create or modify your `CNAME` file for a custom domain.
* Who is authoring the site?
* Please describe your site.
* What is the timezone for your site?
  - This will detect your system TZ as the default.
* What is the version of your site?
* Which permalink pattern would you like to use? See: [jekyll permalink style](https://jekyllrb.com/docs/permalinks/#built-in-permalink-styles)
* GitHub repo name? (e.g. foo/bar, https://github.com/foo/bar.git) This is required!
  - Because some of the GitHub Pages modules will fail without this, and I think they are important for the whole process, please have this ready, even if you haven't added any files to your repo just yet.
* GitHub token? (Required for some plugins. Suggested permissions are 'public_repo' and 'gist'. See: [Creating an access token for command-line use](https://git.io/v61m7))
* Twitter username?
  - [jekyll-seo-tag](https://github.com/jekyll/jekyll-seo-tag) is installed by default, and can make use of this.
* Which CSS & JS framework would you like to use?  
  - [Concise.css](http://concisecss.com)
  - [Bootstrap v4](https://getbootstrap.com)
  - [Bootstrap v3](https://getbootstrap.com)
  - Blank — just some stub files and directories.
* If you chose Bootstrap v3 you will also have the option to select a [Bootswatch](https://bootswatch.com)
