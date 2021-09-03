const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV
const prefixUrl = {
  development: 'http://localhost:8000',
  production: 'https://inpark.cmsk-icool.com/oss/mini'
}

if(env === 'development') {
  require('./httpServer')
}

const buildTarget = `dist/${env === 'development' ? 'dev' : 'build'}/${process.env.UNI_PLATFORM}`
console.log(`构建平台目录为${buildTarget}`)
const networkImageResource = []
class CleanStaticResourceWepack {
  apply(complier) {
    complier.hooks.done.tap('CleanStaticResourceWepack', compilation => {
      while (networkImageResource.length) {
        var sourceFile = networkImageResource.pop()

        fs.unlink(sourceFile, (err) => {
          if (err) throw err;
          console.log(`${sourceFile} was deleted`)
        })
      }
      console.log('--------开始清理static重复资源--------')
    })
  }
}

module.exports = {
  lintOnSave: false,
  configureWebpack(config) {
    return {
      plugins: [
        new CleanStaticResourceWepack()
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
          '@api': path.resolve(__dirname, 'src/api'),
          '@components': path.resolve(__dirname, 'src/components'),
          '@static': path.resolve(__dirname, 'src/static'),
          '@utils': path.resolve(__dirname, 'src/utils'),
          '@pages': path.resolve(__dirname, 'src/pages'),
          "@store": path.resolve(__dirname, 'src/store'),
          "@customeTypes": path.resolve(__dirname, 'src/types')
        },
      },
    }
  },
  chainWebpack(config) {
    config.module.rule('images').use('url-loader').tap(options => {
      return {
        limit: 20480, // 超过20k图片取网络缓存
        // emitFile: false,
        fallback: {
          loader: 'file-loader',
          options: {
            publicPath(url, resourcePath, context) {
              const fileName = path.relative(`${context}/src`, resourcePath)

              networkImageResource.push(path.join(__dirname, buildTarget, fileName))
              return `${prefixUrl[env]}/${fileName.split(path.sep).join('/').replace(/^\//, '')}`
            },
            outputPath(url, resourcePath, context) {
              const fileName = path.relative(`${context}/src/static`, resourcePath)
              return  `/cdnStatic/${fileName}`
            },
          },
        }
      }
    })
  },
  transpileDependencies: ['@dcloudio/uni-ui']
};
