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
