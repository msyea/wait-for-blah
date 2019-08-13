const { exec } = require('child_process')
const { onlyOnce, stop } = require('./helpers')

jest.mock('child_process')

describe('helpers', () => {
  describe('onlyOnce', () => {
    test('calls callback only once', () => {
      const once = onlyOnce()
      const callback = jest.fn()

      once(callback)
      once(callback)
      once(callback)

      expect(callback).toHaveBeenCalledTimes(1)
    })
  })

  describe('stop', () => {
    test('calls docker-compose with the correct service', async () => {
      const SERVICE = 'my-super-service'
      await stop(SERVICE)

      expect(exec).toHaveBeenCalledWith(
        `docker-compose stop ${SERVICE}`,
        expect.any(Function), // the callback func
      )
    })
  })
})
