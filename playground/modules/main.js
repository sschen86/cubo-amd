define((require, exports) => {
    exports.main = 666
    const m1 = exports.xxx = require('./m1')

    console.info('m1', { m1: m1.m1, m2: m1.m2 })
})
