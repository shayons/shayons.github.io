# shayons.github.io

[![Deploy](https://github.com/shayons/shayons.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/shayons/shayons.github.io/actions/workflows/deploy.yml)

Personal site of Shayon Sanyal: [shayons.github.io](https://shayons.github.io).

## Stack

Astro 7 with static output, self-hosted variable fonts, and GitHub Pages. The only client-side
JavaScript is a small inline controller for the saved color-theme preference.

Light and dark palettes follow the system automatically through CSS. The header's sun, moon, and
system icons save an override and apply it before the page paints. With JavaScript disabled,
automatic theming and all content still work. Print uses the light palette. The build checks allow
only the exact theme controller and reject other scripts or JavaScript assets.

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
    npm run icons           # regenerate favicon.ico and apple-touch-icon.png from public/favicon.svg

## Deploy

Pushing to `main` runs every check and deploys to GitHub Pages. A weekly scheduled build keeps
date-based labels such as "Upcoming" current.
