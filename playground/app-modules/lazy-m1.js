
define('./lazy-m3', function (require, exports) {
    exports.name = './modules/lazy-m3'
})

define(function (require) {
    alert('./modules/lazy-m1')
    require('./lazy-m2')
})

define('./lazy-m2', function (require, exports) {
    alert('./modules/lazy-m2')
    exports.name = require('./lazy-m3')
})
