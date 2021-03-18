# Worst Buy: a demo e-commerce website

[![Netlify Status](https://api.netlify.com/api/v1/badges/94a7f325-841d-4ee5-bfb4-9eb5e9304791/deploy-status)](https://app.netlify.com/sites/worst-buy/deploys)

This is a demo e-commerce website built on [Next.js](https://nextjs.org/), backed by [Contentful](https://www.contentful.com/), and deployed to [Nelify](https://www.netlify.com/) with alert using [Courier](https://courier.com).

## Workflow

![Workflow Diagram](/resources/worst-buy-workflow.png)

## Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/cassidoo/next-netlify-starter&utm_source=github&utm_medium=nextstarter-cs&utm_campaign=devex)

(If you click this button, it will create a new repo for you that looks exactly like this one, and sets that repo up immediately for deployment on Netlify)

## Getting Started

### Environment Variables

You'll need to add the following environment variables in your Netlify site:

* `NEXT_PUBLIC_CONTENTFUL_SPACE_ID` - Contentful Space ID
* `NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN` - Contentful Access Token
* `COURIER_AUTH_TOKEN` - Courier Auth Token

### Local Development

First, install the Netlify CLI and login and link your site. Then run the development server:

```bash
netlify dev
```

Open [http://localhost:8888](http://localhost:8888) with your browser to see the result.

### Installation options

**Option one:** One-click deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/aydrian/worst-buy)

**Option two:** Manual clone

1. Clone this repo: `git clone https://github.com/aydrian/worst-dev.git`
2. Navigate to the directory and run `npm run dev`
3. Make your changes
4. Connect to [Netlify](https://url.netlify.com/Bk4UicocL) manually (the `netlify.toml` file is the one you'll need to make sure stays intact to make sure the export is done and pointed to the right stuff)
