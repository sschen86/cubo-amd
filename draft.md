







### amd模块

```html
<!--&router/index#index-->
<!--&router/routes#index-->

<!--&routes/etc#test-->
<!--&routes/etc#xx-->



<include url="cubo://xxxxxxx" />

<script amd>



</script>


<!--&views/index#main-->
<!--&views/login#main-->

<!--&apis/index#main-->
<!--&apis/configs#goods-->







<script>
export const goods_detail = ['getGoodsDetailByCode', {
    method: 'post',
    mock(){


    }
}]
</script>


<!--&vue/vue-->
<!--&vue/vuex-->
<!--&vue/vue-router-->



<!--&#lib-->
<!--&#lib-->
<script>
import lib from 'lib'
import myLib from './my-lib'

export default{
    render(){

    }
}
</script>


<script>
import some from './some'
export default{


}
</script>





```


```
|-- router // 路由仓库
    |-- index.js // 路由入口文件
    |-- routes
        |-- index.js // 路由配置项入口文件
        |-- 
```


```html
<script amd="">
</script>
```