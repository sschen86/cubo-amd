define(function (require, exports) {
    exports.m2 = require('./m2').m2
    exports.m1 = 'm1'
    console.info('m1', { m1: exports.m1, m2: exports.m2 })
})
