define((require, exports) => {
    const Vue = require('vue')
    const router = require('./router/index')

    new Vue({
        template: `
            <div>
                <router-link to="/login">登录 </router-link>
                <router-link to="/">首页</router-link>
                <router-view></router-view> 
            </div>
        `,
        router,
    }).$mount('#main')
})
