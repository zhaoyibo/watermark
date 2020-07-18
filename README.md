# Watermark your ID photo

> Provide watermarking to documents and ID photos to ensure that the document information is safe and not leaked. Completely implemented locally, no information is uploaded to the server

[preview](https://haoyizebo.com/tools/watermark/)

## Build Setup

```bash
# Project setup
yarn

# Compiles and hot-reloads for development
yarn dev

# Compiles and minifies for production
yarn build

# Lints and fixes files
yarn lint
```

NOTE: You may need to change `assetsDir` in `vue.config.js`

Customize configuration, check out [Configuration Reference](https://cli.vuejs.org/config/).

## Unsplash

If you want to use [Unsplash](https://unsplash.com/) API to get a random photo, you need to register it and create an app, then you will get an access_key and secret_key, put them in env.js

```
  APPLICATION_ID: '"your_access_key"',
  SECRET: '"your_secret_key"',
  CALLBACK_URL: '"your_callback_url"'
```

For more information, you can find it at [documentation](https://unsplash.com/documentation)

## Thanks

[vue-cropper](https://github.com/xyxiao001/vue-cropper)
