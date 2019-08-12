const onlyOnce = () => {
  let first = true
  return (callback, ...args) => {
    if (first) {
      callback(...args)
    }
    first = false
  }
}

class Docker {
  constructor(docker) {
    this.docker = docker
  }

  stop() {
    return new Promise((resolve, reject) => {
      const once = onlyOnce(this)
      this.on('exit', once.bind(resolve))
      this.on('error', once.bind(reject))
      this.docker.kill()
    })
  }
}

module.exports = {
  onlyOnce,
  Docker,
}
