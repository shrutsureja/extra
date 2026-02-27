# Story Point Calculator

React + TypeScript app for calculating story points and reverse-detecting complexity level.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Cloudflare Pages

First-time setup:

```bash
npm run cf:login
```

Deploy:

```bash
npm run build
npm run deploy
```

When prompted for the project name in the first deploy, use `story-point-calc`.
