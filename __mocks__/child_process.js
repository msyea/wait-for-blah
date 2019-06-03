const callbacks = []
module.exports = {
  exec: jest.fn((command, callback) => callback()),
  spawn: jest.fn(() => ({
    stdout: {
      on: (event, callback) => {
        callbacks.push(callback)
      },
    },
    on: jest.fn(),
  })),
  emit: line => {
    callbacks.forEach(callback => callback(Buffer.from(line)))
  },
}
