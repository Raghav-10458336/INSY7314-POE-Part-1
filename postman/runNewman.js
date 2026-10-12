const fs = require('fs')
const path = require('path')
const https = require('https')
const crypto = require('crypto')
const { spawn, execFileSync } = require('child_process')

const root = path.join(__dirname, '..')

require('dotenv').config({ path: path.join(root, '.env'), quiet: true })

const newman = require('newman')
const mongoose = require('mongoose')

const port = process.env.TEST_PORT || '5055'
const baseUrl = `https://localhost:${port}`
const reportDir = path.join(__dirname, 'reports')

function testDatabaseUri() {
    if (process.env.TEST_MONGO_URI) {
        return process.env.TEST_MONGO_URI
    }

    const url = new URL(
        process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hustlehub'
    )
    const name = url.pathname.replace(/^\//, '') || 'hustlehub'

    url.pathname = `/${name}_test`

    return url.toString()
}

function ensureCertificates() {
    const present = ['key.pem', 'cert.pem'].every(file =>
        fs.existsSync(path.join(root, 'certs', file))
    )

    if (!present) {
        execFileSync(
            process.execPath,
            [path.join(root, 'generateCert.js')],
            { stdio: 'inherit' }
        )
    }
}

function waitForServer(server) {
    return new Promise((resolve, reject) => {
        const started = Date.now()

        server.once('exit', code => {
            reject(new Error(`server exited with code ${code}`))
        })

        function retry() {
            if (Date.now() - started > 30000) {
                reject(new Error('server did not start within 30 seconds'))
                return
            }

            setTimeout(attempt, 300)
        }

        function attempt() {
            https
                .get(
                    {
                        host: 'localhost',
                        port,
                        path: '/health',
                        rejectUnauthorized: false
                    },
                    res => {
                        res.resume()

                        if (res.statusCode === 200) {
                            resolve()
                        } else {
                            retry()
                        }
                    }
                )
                .on('error', retry)
        }

        attempt()
    })
}

function runCollection() {
    return new Promise((resolve, reject) => {
        newman.run(
            {
                collection: path.join(
                    __dirname,
                    'HustleHub_API.postman_collection.json'
                ),
                envVar: [{ key: 'baseUrl', value: baseUrl }],
                insecure: true,
                reporters: ['cli', 'junit'],
                reporter: {
                    junit: {
                        export: path.join(reportDir, 'newman-junit.xml')
                    }
                }
            },
            (err, summary) => (err ? reject(err) : resolve(summary))
        )
    })
}

function teeStdout(file) {
    const stream = fs.createWriteStream(file)
    const write = process.stdout.write.bind(process.stdout)

    process.stdout.write = (chunk, ...args) => {
        stream.write(String(chunk).replace(/\u001b\[[0-9;]*m/g, ''))

        return write(chunk, ...args)
    }

    return () => {
        process.stdout.write = write
        stream.end()
    }
}

// only ever drops a database whose name says it is a test one
async function dropTestDatabase(uri) {
    try {
        if (!/test/i.test(new URL(uri).pathname)) {
            return
        }

        const connection = await mongoose.createConnection(uri).asPromise()

        await connection.dropDatabase()
        await connection.close()
    } catch (err) {
        console.error('Could not clean the test database:', err.message)
    }
}

async function main() {
    fs.mkdirSync(reportDir, { recursive: true })
    ensureCertificates()

    const mongoUri = testDatabaseUri()

    const server = spawn(process.execPath, ['server.js'], {
        cwd: root,
        env: {
            ...process.env,
            PORT: port,
            FRONTEND_ORIGINS: 'http://localhost:5173',
            MONGO_URI: mongoUri,
            JWT_SECRET: crypto.randomBytes(32).toString('hex'),
            NODE_ENV: 'test'
        },
        stdio: ['ignore', 'pipe', 'pipe']
    })

    let serverOutput = ''

    server.stdout.on('data', data => {
        serverOutput += data
    })
    server.stderr.on('data', data => {
        serverOutput += data
    })

    const stopTee = teeStdout(path.join(reportDir, 'newman-cli.txt'))

    let failed = true

    try {
        await waitForServer(server)

        const summary = await runCollection()

        failed = summary.run.failures.length > 0
    } catch (err) {
        console.error(err.message)
        console.error(serverOutput)
    } finally {
        stopTee()
        server.kill()
        await dropTestDatabase(mongoUri)
    }

    process.exitCode = failed ? 1 : 0
}

main()
