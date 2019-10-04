const { exec } = require('child_process')
const { promisify } = require('util')

const execPromise = promisify(exec)

const onlyOnce = () => {
  let first = true
  return (callback, ...args) => {
    if (first) {
      callback(...args)
    }
    first = false
  }
}

const stop = (service, docker) =>
  new Promise(async (resolve, reject) => {
    docker.on('error', reject)
    docker.on('exit', resolve)
    await execPromise(`docker-compose stop ${service}`)
  })

module.exports = {
  onlyOnce,
  stop,
}
