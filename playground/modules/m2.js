define(function (require, exports) {
    exports.m2 = 'm2'
    exports.m1 = require('./m1').m1
    console.info('m2', { m1: exports.m1, m2: exports.m2 })
})
