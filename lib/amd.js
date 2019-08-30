module.exports = {
    define,
    require,
}

const modules = {}

function define (id, deps, factory) { // define(id:String?, deps:Array?, factory:Function)
    if (typeof id === 'function') {
        factory = id
        deps = getDependencies(factory)
        id = getModuleId()
    } else if (typeof deps === 'function') {
        factory = deps
        if (typeof id === 'string') {
            deps = getDependencies(factory)
        } else {
            deps = id
            id = getModuleId()
        }
    } else if (id && typeof id === 'object') { // 直接返回一个对象
        modules[getModuleId()].exports = id
        return
    }

    defineModule(id, deps, factory)
}

function require (deps, resolve) { // require(id), require(deps:Array?, resolve:Function?)
    if (typeof deps === 'string') { // require(id) 同步引入模块
        const id = deps
        const module = modules[id]
        if (!module.isResolve) {
            module.isResolve = true
            module.exports = module.factory()
        }
        return module.exports
    }

    // require(deps:Array, resolve:Function?) 异步引入模块
}

function getModuleId () {

}

function getDependencies (factory) {
    const childMap = {}
    String(factory).replace(/\brequire\(\s*(['"])([\w./-]+)\1\s*\)/g, (match, quote, id) => {
        childMap[id] = true
    })
    return Object.keys(childMap)
}

function defineModule () {

}

function loadjs () {

}

define('abc/ssss', function () {

})
