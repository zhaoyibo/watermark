# Watermark your ID photo

> Provide watermarking to documents and ID photos to ensure that the document information is safe and not leaked. Completely implemented locally, no information is uploaded to the server

[preview](https://windmt.com/tools/watermark/)

## Build Setup

```bash
# install dependencies
yarn

# serve with hot reload at localhost:8080
yarn dev

# build for production with minification
yarn build
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

> NOTE: You may need to change `assetsPublicPath` in `config/index.js`

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
