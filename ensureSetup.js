const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const envPath = path.join(__dirname, '.env')
const certDir = path.join(__dirname, 'certs')
const keyPath = path.join(certDir, 'key.pem')
const certPath = path.join(certDir, 'cert.pem')

if (!fs.existsSync(envPath)) {
  const crypto = require('crypto')
  const secret = crypto.randomBytes(48).toString('hex')
  fs.writeFileSync(envPath, `PORT=5000\nNODE_ENV=development\nJWT_SECRET=${secret}\n`)
  console.log('Created local .env file.')
}

if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.log('Local HTTPS certificate missing; generating it now...')
  execFileSync(process.execPath, [path.join(__dirname, 'generateCert.js')], { stdio: 'inherit' })
}
