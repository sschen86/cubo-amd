define(function (require, exports, module) {
    const Vue = require('vue')
    const Router = require('vue/vue-router')
    const routes = require('./routes/index')

    Vue.use(Router)

    const router = new Router({
        mode: 'hash',
        base: '',
        routes: routes.all,
    })

    module.exports = router
})
