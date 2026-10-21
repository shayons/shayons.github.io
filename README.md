# shayons.github.io

Personal site of Shayon Sanyal: [shayons.github.io](https://shayons.github.io).

## Stack

Astro 7 with static output and no client-side JavaScript, self-hosted variable fonts, and GitHub
Pages.

## Develop

Requires Node 26 (`nvm use` reads `.nvmrc`).

    npm ci
    npm run dev

`npm ci` also points git at `.githooks/`, so every commit runs the format check and unit tests.

## Content

Talks, writing, case studies, and builds live in `src/data/*.json`. The schemas in
`src/content/schemas.mjs` validate them at build time. To add a talk, add an entry to
`src/data/talks.json` that links to its public event page.

## Checks

    npm run verify          # formatting, types, unit tests, build, output checks, Playwright and axe
    npm run links:external  # optional: check outbound links
    npm run og              # regenerate public/og.png after changing the headline or portrait

## Deploy

Pushing to `main` runs every check and deploys to GitHub Pages. A weekly scheduled build keeps
date-based labels such as "Upcoming" current.
