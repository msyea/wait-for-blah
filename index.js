const { spawn, exec } = require('child_process')
const { promisify } = require('util')

const {
  ERROR_SERVICE_REQUIRED,
  ERROR_SERVICE_MUST_BE_STRING,
  ERROR_MATCHERS_MUST_NOT_BE_EMPTY,
} = require('./constants')

const execPromise = promisify(exec)

const wfb = (service, matchersMixed) =>
  new Promise((resolve, reject) => {
    let matchers = Array.isArray(matchersMixed)
      ? matchersMixed
      : [matchersMixed]
    matchers = matchers.filter(matcher => !!matcher)
    if (typeof service !== 'string') {
      reject(new Error(ERROR_SERVICE_MUST_BE_STRING))
      return
    }
    if (matchers.length === 0) {
      reject(new Error(ERROR_MATCHERS_MUST_NOT_BE_EMPTY))
      return
    }
    const docker = spawn('docker-compose', ['up', service])
    docker.stdout.on('data', data => {
      const line = data.toString()
      matchers.some((match, i) => {
        if (
          (match instanceof RegExp && match.test(line)) ||
          (typeof match === 'string' && line.includes(match))
        ) {
          matchers.splice(i, 1)
          return true
        }
        return false
      })
      if (matchers.length === 0) {
        resolve()
      }
    })
    docker.on('error', reject)
  })

module.exports = (service, matchers) => {
  if (service && matchers) {
    return wfb(service, matchers)
  }
  if (service) {
    return execPromise(`docker-compose run ${service}`)
  }
  return Promise.reject(new Error(ERROR_SERVICE_REQUIRED))
}
