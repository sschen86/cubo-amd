define(function (require, exports, module) {
    module.exports = {
        all: [
            {
                path: '/',
                component: {
                    template: '<div>首页</div>',

                },
            },
            {
                name: 'login',
                path: '/login',
                component: () => require.async('../../views/login'),

            },
        ],
    }
})
