module.exports = {
    define,
}

const modules = {} // 模块容器
const onloadModulesNotifies = {} // 模块加载就绪消息中心
const loadingModules = {} // 加载中的模块

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
        loaded: false,
        resolved: false,
        lazyResovle: dependencies === null, // 懒执行，通过行内require方式导入
        exports: null,
        parent: null,
        dependencies: null,
        factory: null,
    }

    if (typeof factory === 'function') { // 处理依赖和自身加载
        const dependenciesLoadedNotifies = [] // 子模块依赖通知队列
        dependencies.forEach((id) => { // 子模块依赖队列添加加载通知
            const childModule = modules[id]
            if (childModule && childModule.loaded) { // 已经加载就绪的模块，
                return
            }
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

function getModuleId () {
    return ''
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
    module.resolved = true
    if (module.resolved) {
        return module.exports
    }
    module.resolved = true
    module.exports = module.lazyResovle ? module.factory(require, module.exports, module) : module.factory.apply(null, module.children.map(resolvedModule))
}

function loadModule (id, parent, retry = 3) { // 加载失败重试3次
    if (modules[id] || loadingModules[id]) {
        return
    }
    loadingModules[id] = true
    setTimeout(() => { // 延迟加载，因为模块可以先使用，后定义
        const script = document.createElement('script')
        script.onload = () => {
            script.parentNode.removeChild(script)
            delete loadingModules[id]
            const module = modules[id]
            if (module) {
                module.parent = parent
            } else {
                if (retry > 0) {
                    return loadModule(id, parent, retry - 1)
                }
                console.error('module "' + id + '" load failure')
            }
        }
        script.src = getModuleUrl(id)
        document.documentElement.appendChild(script)
    })
}

function getModuleUrl (id) {
    return String(id)
}
