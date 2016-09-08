---
title: {SLUSH{=name}}
date: {SLUSH{=now}}
layout: page
body_class: body--homepage
---

### Welcome to GitHub Pages.

This automatic page generator is the easiest way to create beautiful pages for all of your projects. Author your page content here [using GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/), select a template crafted by a designer, and publish. After your page is generated, you can check out the new `{SLUSH{ if (branch) { }}{SLUSH{=branch}}{SLUSH{ } else { }}gh-pages{SLUSH{ } }}` branch locally. If you're using GitHub Desktop, simply sync your repository and you'll see the new branch.

### Latest posts

{% include posts.html %}

### GitHub Pages Generator

If you're seeing this you probably used the [GitHub Pages Generator](https://github.com/ronik-design/slush-gh-pages). This means you have a bunch of useful dev tools built in, and your local. You can start developing your site, with compilation of stylesheets, javascript and image minification handled automatically. Just type `npm start` (which you probably did just to see this page). When you're ready to push your work up to GitHub Pages simply commit your work then run `npm run deploy` which will test your build, increment the version, and push the new work up to GitHub.

For more information see the [README](/README.md).

### Creating pages manually

If you prefer to not use the automatic generator, push a branch named `{SLUSH{ if (branch) { }}{SLUSH{=branch}}{SLUSH{ } else { }}gh-pages{SLUSH{ } }}` to your repository to create a page manually. In addition to supporting regular HTML content, GitHub Pages support Jekyll, a simple, blog aware static site generator. Jekyll makes it easy to create site-wide headers and footers without having to copy them across every page. It also offers intelligent blog support and other advanced templating features.

### Authors and Contributors

You can [@mention](https://help.github.com/articles/basic-writing-and-formatting-syntax/#mentioning-users-and-teams) a GitHub username to generate a link to their profile. The resulting `<a>` element will link to the contributor's GitHub Profile. For example: In 2007, Chris Wanstrath ([@defunkt](https://github.com/defunkt)), PJ Hyett ([@pjhyett](https://github.com/pjhyett)), and Tom Preston-Werner ([@mojombo](https://github.com/mojombo)) founded GitHub.

### Plugins and additional functionality

GitHub Pages supports a number of Jekyll plugins which are one by default in the GitHub Pages Generator version of the site. They add some great functionality. Read more about them.

  * [jekyll-mentions](https://github.com/jekyll/jekyll-mentions) - the previous mentioned `@mention` support
  * [jemoji](https://github.com/jekyll/jemoji) - use GitHub flavored emoji shorthand, like `:+1:` :+1:
  * [jekyll-redirect-from](https://github.com/jekyll/jekyll-redirect-from) - use `redirect_from` and `redirect_to` in your frontmatter for easy page redirects
  * [jekyll-sitemap](https://github.com/jekyll/jekyll-sitemap) - automatically generate a `sitemap.xml`
  * [jekyll-feed](https://github.com/jekyll/jekyll-feed) - automatically generate a `feed.xml`
  * [jekyll-seo-tag](https://github.com/jekyll/jekyll-seo-tag) - provides a bunch of SEO metadata and opengraph tags
  * [jekyll-paginate](https://jekyllrb.com/docs/pagination/) - paginate your results!
  * [jekyll-gist](https://github.com/jekyll/jekyll-gist) - specify a [gist](https://gist.github.com) in your page or post with `{% raw %}{% gist parkr/c08ee0f2726fd0e3909d %}{% endraw %}`
  * [jekyll-github-metadata](https://help.github.com/articles/repository-metadata-on-github-pages/) - provides all the `site.github` contextual information that you get on GitHub in your local dev.

### Support or Contact

Having trouble with Pages? Check out our [documentation](https://help.github.com/pages) or [contact support](https://github.com/contact) and we'll help you sort it out.
