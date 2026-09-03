const fs = require('fs')
const path = require('path')
const selfsigned = require('selfsigned')

async function generateCertificate() {
    const attrs = [
        { name: 'commonName', value: 'localhost' }
    ]

    const pems = await selfsigned.generate(attrs, {
        days: 365,
        keySize: 2048
    })

    const certsDir = path.join(__dirname, 'certs')

    if (!fs.existsSync(certsDir)) {
        fs.mkdirSync(certsDir)
    }

    fs.writeFileSync(path.join(certsDir, 'key.pem'), pems.private)
    fs.writeFileSync(path.join(certsDir, 'cert.pem'), pems.cert)

    console.log('Local HTTPS certificate generated successfully.')
}

generateCertificate().catch(err => {
    console.error('Certificate generation failed:', err.message)
})