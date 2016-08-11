# slush-gh-pages
Slush generator for GitHub Pages Jekyll-based websites.

### To use:

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

That should do it!
