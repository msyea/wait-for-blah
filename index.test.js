const { spawn, exec, emit } = require('child_process')
const wfb = require('.')

const {
  ERROR_SERVICE_REQUIRED,
  ERROR_SERVICE_MUST_BE_STRING,
  ERROR_MATCHERS_MUST_NOT_BE_EMPTY,
} = require('./constants')

jest.mock('child_process')

describe('wait-for-blah', () => {
  const SERVICE_NAME = 'myservice'
  beforeEach(() => jest.clearAllMocks())
  it('is a function', () => {
    expect(typeof wfb).toBe('function')
  })
  it('requires a service', () => {
    expect(wfb()).rejects.toThrow(ERROR_SERVICE_REQUIRED)
  })
  describe('runner', () => {
    it('runs a service using docker-compose', async () => {
      const service = wfb(SERVICE_NAME)
      expect(exec).toHaveBeenCalledWith(
        `docker-compose run ${SERVICE_NAME}`,
        expect.any(Function),
      )
      await expect(service).resolves.toBe(undefined)
    })
  })
  describe('waiter', () => {
    it('blows up if service is not a string', () => {
      expect(wfb({ config: 'object' }, 'matcher')).rejects.toThrow(
        ERROR_SERVICE_MUST_BE_STRING,
      )
    })
    it('blows up if matchers are empty', () => {
      expect(wfb(SERVICE_NAME, [])).rejects.toThrow(
        ERROR_MATCHERS_MUST_NOT_BE_EMPTY,
      )
      expect(wfb(SERVICE_NAME, ['', ''])).rejects.toThrow(
        ERROR_MATCHERS_MUST_NOT_BE_EMPTY,
      )
    })
    it('runs a service using docker-compose and string', async () => {
      const service = wfb(SERVICE_NAME, 'matcher')
      expect(spawn).toHaveBeenCalledWith('docker-compose', ['up', SERVICE_NAME])
      emit('line with "matcher"')
      await expect(service).resolves.toBe(undefined)
    })
    it('runs a service using docker-compose and regexp', async () => {
      const service = wfb(SERVICE_NAME, /lolcats\d+ever/)
      expect(spawn).toHaveBeenCalledWith('docker-compose', ['up', SERVICE_NAME])
      emit('line with "lolcats4ever"')
      await expect(service).resolves.toBe(undefined)
    })
    it('waits for a complex mix of matchers', async () => {
      const service = wfb(SERVICE_NAME, ['simple', 'simon', /lolcats\d+ever/])
      expect(spawn).toHaveBeenCalledWith('docker-compose', ['up', SERVICE_NAME])
      emit('line with "lolcats4ever"')
      emit('simple')
      emit('simon')
      await expect(service).resolves.toBe(undefined)
    })
  })
})
