// this isn't used in the solution. Only in the extra credit

const {server} = require('test/server')

// 🐨 flesh these out:
beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())