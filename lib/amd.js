module.exports = {
    define,
    require,
}

const modules = {} // 模块容器
const loadedNotifies = {} // 模块加载就绪通知器
const loadingModules = {} // 加载中的模块

function define (id, dependencies, factory) { // define(id:String?, dependencies:Array?, factory:Function)
    if(typeof id === 'function'){ // define(factory)
        factory = id 
        dependencies = null
        id = null
    }else if(typeof dependencies === 'function'){
        factory = dependencies
        if(typeof id === 'string'){ // define(id, factory)
            dependencies = null
        }else{ // define(dependencies, factory)
            dependencies = id
            id = null
        }
    }else if(id && typeof id === 'object'){ // define(exports)
        factory = id
        id = null
        dependencies = null
    }else if(typeof id === 'string' && typeof dependencies === 'object'){ // define(id, exports)
        factory = dependencies
        dependencies = null
    }else{
        throw Error('arguments not accept!')
    }

    defineModule(id, dependencies, factory)
}

function defineModule(id, dependencies, factory){
    id = id || getModuleId()
    if(module[id]){
        throw Error('module "'+ id +'" has allready define!')
    }

    const module = modules[id] = {
        loaded: false,
        resolved: false,
        exports: null,
        parent: null,
        dependencies: null,
        factory: null
    }

    if(typeof factory === 'function'){
        module.factory = factory
        let hasDependencies = true
        if(dependencies === null){
            hasDependencies = false
            dependencies = getDependencies(factory)
        }
        module.exports = {}
        module.dependencies = dependencies
        module.hasDependencies = hasDependencies // 传入的dependencies，而不是依靠扫描factory所得


        const childrenOnLoaded = []
        dependencies.forEach(id => {
            const childModule = modules[id]
            if(childModule && childModule.loaded){ // 模块已经加载就绪
                return
            }

            const onloaded = () => { // 依赖模块加载完成
                loadedNotifies[id]




            }
            childrenOnLoaded.push(id) // 添加加载依赖
            loadModule(id)
        })


        loadedModule(module)
    }else{ // factory === exports
        module.exports = factory
        loadedModule(module)
    }
}

function loadedModule(module){
    module.loaded = true
    if(loadedNotifies[module.id]){
        loadedNotifies[module.id].forEach(loadedNofiy => {
            loadedNofiy()
        })
        loadedNotifies[module.id] = null
    }
}

function loadModule(id){
    setTimeout(()=>{
        if(loadingModules[id]){
            return
        }
        loadFile(CONFIG.BASE_URL + id + '.js')
    })

    function loadFile(src){
        if(loadingModules[id]){
            return
        }
        loadingModules[id] = true
        
        const script = document.createElement('script')
        script.onload = ()=>{
            script.parentNode.removeChild(script)
            script.onload = null
            if(!modules[id]){
                console.info('module "'+ id +'" load failure')
            }
        }
        script.src = path
        document.documentElement.appendChild(script)
    }
}



function require (dependencies, resolve) { // require(id), require(dependencies:Array?, resolve:Function?)
    if (typeof dependencies === 'string') { // require(id) 同步引入模块
        const id = dependencies
        const module = modules[id]
        if (!module.resolved) {
            module.resolved = true
            module.exports = module.factory()
        }
        return module.exports
    }

    // require(dependencies:Array, resolve:Function?) 异步引入模块
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

function defineModule (id, dependencies, factory) {
    let module = modules[id]
    if (module) {
        return
    }
    module = modules[id] = {
        id,
        dependencies,
        factory,
        loaded: false,
        resolved: false,
        exports: {},
    }

    const dependenciesLoadedNotifies = [] // 子模块依赖通知队列

    dependencies.forEach((id) => { // 子模块依赖队列添加加载通知
        const childModule = modules[id]
        if(!childModule || !childModule.loaded){
            dependenciesLoadedNotifies.push(id)

            const childModuleLoadedNotifies = loadedNotifies[id] = loadedNotifies[id] || [] // 使用子模块通知队列
            const onloaded = ()=>{
                const removedIndex = dependenciesLoadedNotifies.indexOf(id) // 找到子模块的id，然后从通知队列中移除
                dependenciesLoadedNotifies.splice(removedIndex, 1)
                loadedNotifies[id] = null


                if(dependenciesLoadedNotifies.length === 0){ // 所有子模块依赖全部加载完毕
                    module.loaded = true
                    if(loadedNotifies[module.id]){ // 向上冒泡依赖加载完成消息
                        loadedNotifies[module.id].forEach(onloaded => {
                            onloaded()
                        })
                    }

                    if(!module.parent){
                        resolveModule(module)
                    }
                }
            }
            childModuleLoadedNotifies.push(onloaded)

        }

    })


    for(var i = 0; i < afterdependencies.length; i++){
        if(afterdependencies[i] == dependenciesId){
            afterdependencies.splice(i, 1);
            break;
        }
    }
    for(var i = 0; i < onloadedObservable[dependenciesId]; i++){
        if(onloadedObservable[dependenciesId][i] == onloaded){
            onloadedObservable[dependenciesId].splice(i, 1);
            break;
        }
    }
    if(afterdependencies.length == 0){
        addModuleToBox();
    }



    for(let i = 0; i < dependencies.length; i++){
        newLoadedNotify


        const childModuleId = dependencies[i]
        const childModule = modules[childModuleId]
        if(!childModule || !childModule.loaded){
            thisLoadedNotifies.push(childModuleId)
            const childModuleLoadedNotify = loadedNotifies[childModuleId] = loadedNotifies[childModuleId] || []
            childModuleLoadedNotify.push()

        }
    }


    function newLoadedNotify(moduleId){
        
    }


    var 
    beforedependencies = [], //初始依赖
    afterdependencies = []; //剩余依赖
    for(var i = 0; i < dependencies.length; i++){
        if(!modulesBox[dependencies[i]]){ //添加未就绪的依赖
            beforedependencies.push(dependencies[i]);
        }
    }
    
    if(beforedependencies.length){
        for(var i = 0; i < beforedependencies.length; i++){
            adddependencies(beforedependencies[i]);
        }
    }else{
        addModuleToBox();
    }

    const dependencies

}

function resolveModule(module){
    module.resolved = true
    module.factory(require, module.exports, module)
}


function loadjs () {

}

define('abc/ssss', function () {

})
