// eslint-disable-next-line @typescript-eslint/no-var-requires
const http = require('http')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

const httpServer = http.createServer((req, res) => {
  const sourcePath = path.join('./src', req.url)
  try {
    if (fs.existsSync(sourcePath)) {
      const readStream = fs.createReadStream(sourcePath)
      readStream.pipe(res)
    } else {
      throw new Error('资源不存在')
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
    console.error(error)
    res.end(error.message)
  }
})

httpServer.listen(8000)
console.log('图片资源服务启动在http://localhost:8080')
