(function (exports) {
    const DEFULT_CONFIG = {
        // baseUrl: window.location.href.replace(/[^/]+$/, ''),
    }

    const modules = {} // 模块容器
    const onloadModulesNotifies = {} // 模块加载就绪消息中心
    const loadingModules = {} // 加载中的模块

    // eslint-disable-next-line no-unused-vars
    let baseUrl

    function amd (config) {
        exports.define = define
        exports.require = require

        const configBaseUrl = config.baseUrl

        if (/^https?:\/\//.test(configBaseUrl)) { // 绝对路径
            baseUrl = configBaseUrl
        } else {
            const currentPath = window.location.href.replace(/[^/]+$/, '')
            baseUrl = configBaseUrl ? pathNormalize(currentPath + configBaseUrl + '/') : currentPath
        }

        require.async(config.main || './main')
    }

    function define (id, dependencies, factory) { // define(id:String?, dependencies:Array?, factory:Function)
        if (typeof id === 'function') { // define(factory)
            factory = id
            dependencies = null
            id = null
        } else if (typeof dependencies === 'function') {
            factory = dependencies
            if (typeof id === 'string') { // define(id, factory)
                dependencies = null
            } else { // define(dependencies, factory)
                dependencies = id
                id = null
            }
        } else if (id && typeof id === 'object') { // define(exports)
            factory = id
            id = null
            dependencies = null
        } else if (typeof id === 'string' && typeof dependencies === 'object') { // define(id, exports)
            factory = dependencies
            dependencies = null
        } else {
            throw Error('arguments not accept!')
        }

        defineModule(id, dependencies, factory)
    }

    function defineModule (id, dependencies, factory) { // 定义模块
        id = id || getModuleId()
        if (modules[id]) {
            throw Error('module "' + id + '" has allready define!')
        }

        const module = modules[id] = {
            id,
            loaded: false,
            resolved: false,
            lazyResovle: dependencies === null, // 懒执行，通过行内require方式导入
            exports: null,
            parent: null,
            dependencies: null,
            factory: null,
        }

        if (typeof factory === 'function') { // 处理依赖和自身加载
            module.factory = factory

            if (dependencies == null) {
                dependencies = getModuleDependencies(factory, module.id).filter(id => !modules[id])
            }

            if (dependencies.length === 0) {
                moduleOnload(module)
                return
            }
            const dependenciesLoadedNotifies = [] // 子模块依赖通知队列
            dependencies.forEach((id) => { // 子模块依赖队列添加加载通知
                const childModuleNotifies = onloadModulesNotifies[id] = onloadModulesNotifies[id] || [] // 子模块通知队列
                const childModuleOnload = () => { // 子模块加载完成，调用通知
                    dependenciesLoadedNotifies.splice(dependenciesLoadedNotifies.indexOf(id), 1) // 移除当前子模块依赖

                    if (dependenciesLoadedNotifies.length === 0) { // 所有的依赖都已经加载完成
                        moduleOnload(module)
                    }
                }

                childModuleNotifies.push(childModuleOnload)
                dependenciesLoadedNotifies.push(id)
                loadModule(id, module)
            })
        } else { // factory === exports
            module.exports = factory
            moduleOnload(module)
        }
    }

    function getModuleId (id, parentId) {
        let moduleId

        if (id == null) {
            moduleId = document.currentScript.src.replace('.js', '').replace(baseUrl, './')
        } else {
            const parentPath = parentId.replace(/[^/]+$/, '')
            moduleId = [parentPath, id].join('').replace('/./', '/').replace(/\/{2,}/g, '/')
            while (/[\w]+\/\.\./.test(moduleId)) {
                moduleId = moduleId.replace(/[\w]+\/\.\./g, '')
            }
        }

        return moduleId
        // './a/b' + '../a/b' => ./a/a/b
        // './a/b' +'./a/b' => './a/b/a/b'
    }

    function getModuleDependencies (factory, parentId) {
        const dependencies = []
        String(factory).replace(/\/\/.+|\/\*[^]*\*\//).replace(/require\(\s*(['"])([^'"]+)\1\s*\)/g, (match, quote, id) => {
            dependencies.push(getModuleId(id, parentId))
        })
        return dependencies
    }

    function moduleOnload (module) {
        module.loaded = true
        const moduleLoadedNotifies = onloadModulesNotifies[module.id] // 获取当前的通知列表

        if (moduleLoadedNotifies) {
            moduleLoadedNotifies.forEach(onload => { // 依次发起通知
                onload()
            })
        }
        if (!module.parent) {
            resolvedModule(module)
        }
    }

    function resolvedModule (module) {
        if (!module.resolved) {
            module.resolved = true

            if (module.lazyResovle) {
                module.factory((() => {
                    const moduleRequire = (id) => require(getModuleId(id, module.id))
                    moduleRequire.async = (id) => require.async(getModuleId(id, module.id))
                    return moduleRequire
                })(), module.exports = {}, module)
            } else {
                module.exports = module.factory.apply(null, module.children.map(resolvedModule))
            }

            if (module.asyncCall) {
                module.asyncCall(module.exports)
                module.asyncCall = null
            }
        }
        return module.exports
    }

    function loadModule (id, parent, retry = 3, callback) { // 加载失败重试3次
        if (modules[id] || loadingModules[id]) {
            return
        }
        loadingModules[id] = true

        setTimeout(() => { // 延迟加载，因为模块可以先使用，后定义
            if (modules[id]) {
                return
            }

            const script = document.createElement('script')
            script.onload = () => {
                script.parentNode.removeChild(script)
                delete loadingModules[id]
                const module = modules[id]
                if (module) {
                    module.parent = parent
                    if (module.loaded) {
                        callback && callback(module.exports)
                    } else {
                        module.asyncCall = callback
                    }
                } else {
                    if (retry > 0) {
                        return loadModule(id, parent, retry - 1, callback)
                    }
                    console.error('module "' + id + '" load failure')
                }
            }
            script.src = getModuleUrl(id)
            document.documentElement.appendChild(script)
        })
    }

    function getModuleUrl (id) {
        return pathNormalize(baseUrl + id) + '.js'
    }

    function require (id) {
        return resolvedModule(modules[id])
    }

    function pathNormalize (path) {
        return path.replace('/./', '/').replace(/(\\\\)/g, '/').replace(/[^/]+\/\.\.\//, '')
    }

    require.async = function (id) {
        return new Promise((resolve, reject) => {
            const module = modules[id]
            if (module && module.resolved) {
                resolve(module.exports)
                return
            }
            loadModule(id, null, undefined, resolve)
        })
    }

    amd.define = define
    amd.require = require

    exports.cubo = exports.cubo || {
        amd,
    }
})(this)
