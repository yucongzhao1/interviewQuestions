# 结合场景来解答问题
1. 这个API设计的目的和作用
2. 原理实现
3. 应用场景

# 1. Vue 生命周期
| 钩子函数                | 作用                                                         | 应用场景                                         |
| :---------------------- | :----------------------------------------------------------- | :----------------------------------------------- |
| beforeCreate（创建前）  | 是获取不到 props 或者 data 中的数据，因为这些数据初始化都在 initState 中。 | 可以在这加一些loading 效果，在created 时进行移除 |
| created（创建后）       | 可以访问到 data 中的数据，但是这个时候组件还没被挂载，所以看不到。 | 异步请求数据丶页面初始化的工作                   |
| beforeMount（载入前）   | 开始创建 VDOM，相关的 render 函数首次被调用，把 data 里面的数据和模板生成 html |                                                  |
| mounted（载入后）       | 并将 VDOM 渲染成真实的 DOM 并且渲染数据，组件中如果有子组件的话，会递归挂载子组件，只有当子组件全部挂载完毕，才会执行根组件的挂载钩子 | 获取挂载dom元素节点                              |
| beforeUpdate（更新前）  | 数据更新前，发生在虚拟 DOM 重新渲染和打补丁之前，可以在此区间进一步更改状态，不会触发附加的渲染过程 |                                                  |
| update（更新后）        | 数据更新后                                                   | 当数据更新需要做一些业务处理的时候使用           |
| beforeDestory（销毁前） | 适合移除事件丶定时器等等，否则会引起内存泄漏的问题           |                                                  |
| destoryed（销毁后）     | 进行一系列的销毁操作，如果有子组件的话，也会递归销毁子组件，当所有子组件都销毁完毕后才会执行根组件的 destroyed 钩子函数。 |                                                  |
| deactivated             | 用 keep-alive 包裹的组件在切换时不会进行销毁，而是缓存到内存中执行这个钩子函数 |                                                  |
| activated               | 命中缓存渲染后会执行这个函数                                 |                                                  |





# 2. Vue 父子组件生命周期执行顺序
>Vue 父子组件生命周期钩子的执行顺序遵循：从外到内丶然后从内到外。

## 组件加载渲染过程

`父组件beforeCreate` -> `父组件created` -> `父组件beforeMount` -> `子组件beforeCreated` -> `子组件created` -> `子组件beforeMount` -> `子组件mounted` -> `父组件mounted`

## 子组件更新过程

`父组件beforeUpdate` -> `子组件beforeUpdate` -> `子组件updated` -> `父组件updated`

## 父组件更新过程

`父组件beforeUpdate` -> `父组件updated`

## 销毁过程

`父组件beforeDestory` -> `子组件beforeDestory` -> `子destoryed` -> `父组件destoryed`





# 3. 组件通信

## props 和  发布订阅 $emit/$on

**最基本的父组件给子组件传递数据方式，将我们自定义的属性传给子组件，子组件通过 $emit 方法，触发父组件 v-on 的事件，从而实现子组件触发父组件方法**

- 父组件传值给子组件：子组件通过 props 方法接受数据
- 子组件传值给父组件：$emit 方法传递参数

优点：

- 使用最为简单，也是父子组件传递最常见的方法
- Vue 会为 props 提供了类型检查支持
- $emit 不会修改到别的组件的同名事件，因为它只能触发父级的事件，这里和 event-bus 不同

缺点：

- 单一组件层级一深需要逐层传递，会有很多不必要的代码量
- 不能解决了多组件依赖同一个状态的问题


## vue的自定义事件
## eventBus
**就是创建一个事件中心，相当于中转站，可以用它来传递事件和接受事件。项目小的时候  用这个比较合适**

使用方法

```js
// bus.js
import Vue from 'vue'
export default new Vue({})

// component-a.js
import bus from './bus.js'
export default {
	created () {
    created () {
      bus.$on('event-name', (preload) => {
        // ...
      })
    }
  }
}

// component-b.js
import bus from './bus.js'
export default {
  created () {
    bus.$emit('event-name', preload);
  }
}
```

优点：

- 解决了多层级组件之间繁琐的事件传播
- 使用原理十分简单，代码量少

缺点：

- 由于是使用一个 Vue 实例，所以容易出现重复触发的情景，例如：
  - 多人开放时，A、B两个人定义了同一个事件名
  - 两个页面都定义了同一个事件名，并且没有用 $off 销毁（常出现在路由切换时）
  - 在 for 出来的组件里注册
- 项目一大用这种方式管理事件会十分混乱，这时候建议用 Vuex

## vuex: 

**主要有两种数据会使用 vuex 进行管理**

- 组件之间全局共享数据 
- 通过后端异步请求的数据

- 优点：
  - 解决了多层组件之间繁琐的事件传
  - 解决了多组件依赖同一状态的问题
  - 单向数据流
  - 为 Vue 量身定做，学习成本不高

- 缺点
  - 不能做数据持久化存储，刷新页面就要重制，要做数据持久化可以考虑使用 localstorage
  - 增加额外的代码体积，简单的业务场景不建议使用

## provide / inject

在父组件上通过 provide 提供给后代组件的数据/方法，在后代组件上通过 inject 来接收被注入的数据/方法

provide 选项应该是一个对象或返回一个对象的函数。该对象包含其子孙的属性。在该对象中你可以使用 ES2015 Symbol 作为 key，但是原生只支持 Symbol 和 Reflect.ownKeys 的环境下可工作

inject 选项应该是：一个字符串数组 或 一个对象，对象的 key 是本地的绑定名。

优点：

- 不用像 props 一层层传递，可以跨层级传递

缺点：

- 用这种方式传递的属性是非响应式的，所以尽可能来传递一些静态属性
- 引用官网的话是 它将你的应用以目前的组件方式耦合了起来，使重构变得更加困难，我对这句话的理解是用了provide/inject 你就要遵循它的组件组织方式，在项目的重构时如果要破坏这个组织方式会有额外的开发成本，其实 event-bus 也有这种问题

## slot

你可以在组件的 html 模版里添加自定义内容，这个内容可以是任何代码模板，就像：

```js
<navigator-link url='/profile'>
	<!-- 添加一个 Font Awesome 图标 -->
  <span class="fa fa-user"></span> 
	Your Profile
</navigator-link>  
```

> 父组件模版的所有东西都会在父级作用域内编译；子组件模版的所有东西都会在子级作用域内编译

你也可以通过 slot-scope 属性来实现从子组件将一些信息传递给父组件，注意这个属性是 vue2.1.0+ 新增的

优点：

- 可以在父组件里自定义到子组件内的内容，虽然其它属性也可以，但是我觉得 slot 更倾向于自定义的条件是来自于父容器中
- 复用性好，适合做组件开发

缺点：

- 和 props 一样不支持跨层级传递

## $parent 和 $children

通过 $parent/$children 可以拿到父子组件的实例，从而调用实例里的方法，实现父子组件通信。并不推荐这种做法

**使用方法**

通过 this.$parent 或者 this.$children 拿到父或子组件的实例

优点：

- 可以拿到父子组件的实例，从而拥有实例里的所有属性

缺点：

- 用这种方法写出的组件十分难维护，因为你并不知道数据的来源是哪里，有悖于单向数据流的原则
- this.$children 拿到的是一个数组，你并不能很准确的找到你要找的子组件的位置，尤其是子组件多的时候




# 4. extend 能做什么
作用是拓展组件生成一个构造器，通常会与 `$mount` 一起使用。

## 使用场景：

- 组件模板都是事先定义好的，如果我要从接口动态渲染组件怎么办？
- 所有内容都是在`#app`下渲染，注册组件都是在当前位置渲染。如果我要实现一个类似于`window.alert()`提示组件要求像调用 JS 函数一样调用它，该怎么办？

```js
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>在Vue中注册组件</title>
</head>
<body>
<div id="todoItem"></div>
</body>
<script src="https://cdn.jsdelivr.net/npm/vue" type="text/javascript"></script>
<script>

// 局部注册组件
var todoItem = Vue.extend({
  data: function () {
        return {
            todoData: [
              { id: 0, text: '蔬菜' },
              { id: 1, text: '奶酪' },
              { id: 2, text: '随便其它什么人吃的东西' }
            ]
        }
  },
  template: `
        <ul>
            <li v-for='(d, i) in todoData' :key="i">
                {{ d.text }}
            </li>
        </ul>
  `
});

// 请注意，在实例化extends组件构造器时，传入属性必须是 propsData、而不是 props 哦
new todoItem({
  propsData: {
      todoData: [
          { id: 0, text: '蔬菜' },
          { id: 1, text: '奶酪' },
          { id: 2, text: '随便其它什么人吃的东西' }
      ]
  }
}).$mount('#todoItem')

</script>
</html>
```






# 5. mixin 和 mixins 区别
**类似小程序的 behaviors，用于组件间代码共享的特性**

## mixin

- 用于全局混入，会影响到每个组件实例，通常插件都是这样做初始化的。
- 虽然文档不建议我们在应用中直接使用 mixin，但是如果不滥用的话也是很有帮助的，比如可以全局混入封装好的 ajax 或者一些工具函数等等。

## mixins

- 应用场景：应该是我们最常使用的拓展组件的方式了。如果多个组件中有相同的业务逻辑，就可以将这些逻辑剥离出来，通过 mixins 混入代码，比如 上拉下拉加载数据  这种逻辑等等。
- 另外需要注意的是同名钩子函数（craeted, mounted...）将混为一个数组，mixins 混入的钩子函数会先于 组件内的钩子函数 执行，并且在遇到同名选项的时候也会有选择性的进行合并，
- 对象数据（data）在内部会进行递归合并，并在发生冲突时以组件数据优先。
- 值为对象的选项（method丶component和directives）将混合为同一个对象，两个对象键名冲突时，取组件对象的键值对






# 6. computed 和 watch 区别
## computed

- 是计算属性，依赖其他属性计算值，并且 computed 的值有缓存，只有当计算机值变化才会返回内容。
- 一般需要依赖别的属性来动态获得值的时候可以使用 computed
- 应用场景：
  - 适用于一些重复使用数据或复杂及废时的运算。我们可以把它放入 computed 中进行计算，然后会在 computed 中缓存起来，下次直接获取了
  - 如果我们需要的数据依赖于其它的数据的话，完美可以把该数据设计为 computed 中
  - 购物车结算商品的时候
```js
<template>
    <div class="hello">
        {{fullName}}
    </div>
</template>

<script>
export default {
    data() {
        return {
            firstName: "飞",
            lastName: "旋"
        }
    },
    props: {
        msg: String
    },
    computed: {
        fullName() {
            return this.firstName + ' ' + this.lastName;
        }
    }
}
</script>
```
**computed 设计的初衷是：为了使模版中的逻辑运算更简单。它有两大优势：**

- 使模版中的逻辑更清晰，方便代码管理
- 计算之后的值会被缓存，依赖的 data 值改变后会重新计算

**因为我们要理解 computed 的话，我们只需要理解如下如下问题：**

- computed 是如何初始化的，初始化之后做了哪些事情？
- 为什么我们改变了 data 中的属性值后，computed 会重新计算，它是如何实现的？
- computed 它是如何缓存值的，当我们下次访问该属性的时候，是怎样读取缓存数据的？

## methods

**区别是：**

- computed 是基于响应式依赖来进行缓存的。只有在响应式依赖发生改变它们才会重新求值，也就是说，当 msg 属性值没有发生改变时，多次访问  reverseMsg 计算属性会立即返回之前缓存的计算结果，而不会再次执行 computed 中的函数。但是 
- methods 方法中是每次调用，都会执行函数，methods 它不是响应式的。
- computed 中的成员可以只定义一个函数作为只读属性，也可以定义成 get/set 变成可读写属性，但是 methods 中的成员没有这样的

## watch

watch 它是一个对 data 的数据监听回调，当依赖的 data 的数据变化时，会执行回调。在回调中会传入 newVal 和 oldVal 两个参数。

Vue 实例将会在实例化时调用 $watch()，它会遍历 watch 对象的每一个属性

**watch 的使用场景是：**当在 data 的某个数据发生变化时，我们需要做一些操作，或者当需要在数据变化时执行异步或开销较大的操作时，我们就可以使用 watch 来进行监听

- 监听到值的变化就会执行回调，在回调中可以执行一些逻辑操作。
- 对于监听到值的变化需要做一些复杂逻辑的情况下可以使用 `watch`
- 使用场景：当一条数据影响到多条数据的时候就需要用到 `watch`，例如搜索数据

**理解 handler 方法及 immediate 属性**

如上 watch 有一个特点是：第一次初始化页面的时候，是不会去执行 age 这个属性监听的，只有当 age 值发生改变的时候才会执行监听计算。因此我们上面第一次初始化页面的时候，basicMsg 属性值默认为空字符串。那么我们现在想要第一次初始化页面的时候也希望它能够进行 age 进行监听，最后能把结果返回给 basicMsg 值来。因此我们需要修改下我们的 watch 的方法，需要引入 handler 方法和 immediate 属性

```js
<!DOCTYPE html>
<html>
<head>
  <title>vue</title>
  <meta charset="utf-8">
  <script type="text/javascript" src="https://cn.vuejs.org/js/vue.js"></script>
</head>
<body>
  <div id="app">
    <p>空智个人信息情况: {{ basicMsg }}</p>
    <p>空智今年的年龄: <input type="text" v-model="age" /></p>
  </div>
  <script type="text/javascript">
    var vm = new Vue({
      el: '#app',
      data: {
        basicMsg: '',
        age: 31,
        single: '单身'
      },
      watch: {
        age: {
          handler(newVal, oldVal) {
            this.basicMsg = '今年' + newVal + '岁' + ' ' + this.single;
          },
          immediate: true
        }
      }
    });
  </script>
</body>
</html>
```

如上代码，我们给我们的代码的 age 属性绑定了一个 handler 方法。其实我们之前的 watch 当中的方法默认就是这个 handler 方法。但是在这里我们使用了 immediate: true 属性，含义是：如果在 watch 里面声明了 age 的话，就会立即执行里面的 handler 方法。如果 immediate 值为 false 的话，那么效果就和之前的一样，就不会执行 handler 这个方法的。因此设置了 immediate: true 的话，第一次页面加载的时候也会执行该 handler 函数的，即第一次 basicMsg 有值

**理解 deep 属性**

watch 里面有一个属性为 deep，含义是：是否深度监听某个对象的值，该值默认为 false

```js
<!DOCTYPE html>
<html>
<head>
  <title>vue</title>
  <meta charset="utf-8">
  <script type="text/javascript" src="https://cn.vuejs.org/js/vue.js"></script>
</head>
<body>
  <div id="app">
    <p>空智个人信息情况: {{ basicMsg }}</p>
    <p>空智今年的年龄: <input type="text" v-model="obj.age" /></p>
  </div>
  <script type="text/javascript">
    var vm = new Vue({
      el: '#app',
      data: {
        obj: {
          basicMsg: '',
          age: 31,
          single: '单身'
        }
      },
      watch: {
        'obj': {
          handler(newVal, oldVal) {
            this.basicMsg = '今年' + newVal.age + '岁' + ' ' + this.obj.single;
          },
          immediate: true,
          deep: true // 需要添加deep为true即可对obj进行深度监听
        }
      }
    });
  </script>
</body>
</html>
```
如上测试代码，如果我们不把 deep: true 添加的话，当我们在输入框中输入值的时候，改变 obj.age 值后，obj 对象中的 handler 函数是不会被执行到的。受 JS 的限制，Vue 不能检测到对象属性的添加或删除的。它只能监听到 obj 这个对象的变化，比如说对 obj 赋值操作会被监听到。比如在 mouted 事件钩子函数中对我们的 obj 进行重新赋值操作

```js
mounted() {
  this.obj = {
    age: 22,
    basicMsg: '',
    single: '单身'
  };
}
```

以后我们的页面会被渲染到 age 为 22，因此这样我们的 handler 函数才会被执行到。如果我们需要监听对象中的某个属性值的话，外面可以使用 deep 设置为 true 即可生效。deep 实现机制是：监听器会一层层的往下遍历，给对象的所有属性都加上这个监听器。当然性能开销会非常大

当然我们可以直接对对象中的某个属性进行监听，比如就对 'obj.age'来进行监听，如下的代码也是可以生效的

```js
<!DOCTYPE html>
<html>
<head>
  <title>vue</title>
  <meta charset="utf-8">
  <script type="text/javascript" src="https://cn.vuejs.org/js/vue.js"></script>
</head>
<body>
  <div id="app">
    <p>空智个人信息情况: {{ basicMsg }}</p>
    <p>空智今年的年龄: <input type="text" v-model="obj.age" /></p>
  </div>
  <script type="text/javascript">
    var vm = new Vue({
      el: '#app',
      data: {
        obj: {
          basicMsg: '',
          age: 31,
          single: '单身'
        }
      },
      watch: {
        'obj.age': {
          handler(newVal, oldVal) {
            this.basicMsg = '今年' + newVal + '岁' + ' ' + this.obj.single;
          },
          immediate: true,
          // deep: true // 需要添加deep为true即可对obj进行深度监听
        }
      }
    });
  </script>
</body>
</html>
```

**watch 和 computed 的区别是：**

相同点：它们两者都是观察页面数据变化的

不同点：computed 只有当依赖的数据变化时才会计算，当数据没有变化时，它会读取缓存数据。watch 每次都需要执行函数。watch 更适合数据变化时的异步操作

**共同点：都支持对象的写法**






# 6. keep-alive 组件有什么用
- 如果你需要在组件切换的时候，保存一些组件的状态防止多次渲染，就可以使用 keep-alive 组件包裹需要保存的组件。
- 对于 keep-alive 组件来说，它拥有两个独立的生命周期钩子函数，分别为 `activated` 和 `deactivated`。用 keep-alive 包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行 deactivated 钩子函数，命中缓存渲染后会执行 activated 钩子函数。
- 使用场景：有时候需要将整个路由页面一切缓存，也就是将 `<router-view>` 进行缓存
  - 商品列表页点击商品跳转商品详情，返回后任显示原有信息
  - 订单列表跳转到的订单详情，然后返回

**keep-alive的生命周期**

当引入 keep-alive 的时候，页面第一次进入，钩子的触发顺序为 `created`  >  `mounted`  >  `activated`，退出后触发 `deactived`。再次进入（前进或后退）时，只会触发 `activated`。

事件挂载的方法等，只执行一次的放在 `mounted`，组件每次进去执行的方法放在 `activated`  

**vue 缓存页面keep-alive 的坑（数据不刷新，只缓存第一次进入的页面数据），强制刷新缓存的页面的方法**

需求：A 进入 B，根据不同 ID 刷新 B 页面数据，B 进入 C，如果  C 有操作数据，则返回 B 后刷新 B 数据，否则 B 页面不刷新。

<img src="https://image-static.segmentfault.com/278/771/2787710213-9c6eb1dac235161f_fix732">

**解决方案一**

A 页面

```J
beforRoutLeave(to, from, next) {
	to.meta.isrefer = true; // 刷新 B 的数据
  to.meta.type = false;
  next();
}	
```

B 页面

```JS
beforeRouteEnter(to, from, next) {
  to.meta.keeplive = true;
  if(vm.$route.meta.isrefer) {
    next(vm => {
      // 这里把页面初始值重新赋值，以刷新页面
      vm.dataList = [];
      vm.$route.meta.isrefer = false; // 恢复初始值
      vm.seatList = [];
      vm.query = {
        activatedId: vm.$route.query.activityId,
        meetplaceId: vm.$route.query.meetplaceId
      }
      vm.getSeatImgList(); // 请求数据
    })
  }
  beforeRouteLeave(to, from, next) {
    from.meta.keeplive = true; // 每次进入页面都缓存 B
    next();
  }
}
```

C 页面与上面不变

App.vue

````js
<keep-alive>
	<router-riew v-if="$route.meta.keeplive"><router-view>
</keep-alive>
<router-view v-if="!$route.meta.keeplive"></router-view>
````

**解决方案二（利用 provide 和 inject）推荐使用**

app.vue

```js
<keep-alive v-if="isRouterAlive">
  <router-view v-if="$route.meta.keeplive"></router-riew>
<keep-alive>
<router-view v-if="!$route.meta.keeplive"></router-view>    
```

Data 里面加个初始值

```js
data () {
  return  {
    isRouterAlive: true
  }
}
```

与 data 同级加个 provide

```js
provide () {
  return {
    reload: this.reload
  };
}
```

Method 加 reload 方法

```hs
reload () {
	this.isRouterAlive = false;
	this.$nextTick(() => {
		this.isRouteAlive = true;
	})
}
```

要缓存的页面

```js
// 与 data 同级加个
inject: ["reload"]
```

修改 beforeRouterEnter

```js
beforeRouteEnter(to, from, next) {
  to.meta.keeplive = true;
  next(vm => {
    vm.reload(); // 调用 app.vue 的方法
  })
}
```





# 7. v-show 与 v-if 区别    

**共同点：都能控制元素的显示和隐藏**  
**不同点：**

- **实现方式**
  - `v-if`是直接从 DOM 树上删除和重建元素节点
  - `v-show`只是修改 CSS 样式，也就是 display 的属性值，元素始终在 DOM 树上
- **编译过程**
  - `v-if` 切换有一个局部编译/卸载的过程，切换过程中合适地销毁和重建内部的事件监听和子组件
  - `v-show` 只是简单的基于 CSS 切换
- **编译条件**
  - `v-if` 是惰性的，如果初始条件为假，则什么都不做，只有在条件第一次为真的时候才开始编译
  - `v-show` 是在任何条件都被编译，然后被缓存，而且 DOM 元素始终被保留
- **性能消耗**
  - `v-if` 有更高的切换消耗，不适合做频繁的切换
  - `v-show` 有更高的初始渲染消耗，适合做频繁的切换    
- **使用场景**
  - 如果需要频繁的切换，则使用 `v-show` 比较好
  - 如果在运行时条件很少改变，则使用 `v-if` 较好 






# 8. 组件中 data 什么时候可以使用对象
- 组件复用时所有组件实例都会共享 `data`，如果 `data` 是对象的话，就会造成一个组件修改`data`以后会影响到其他所有组件，所以需要将 `data` 写成函数，每次用到就调用一次函数获得新的数据。
- 当我们使用 `new Vue()`的方式的时候，无论我们将 data 设置为对象还是函数都是可以的，因为 `new Vue()` 的方式是生成一个根组件，该组件不会复用，也就不会共享 data 的情况了。




# 9. v-for 与 v-if 的优先级
* 当 Vue 处理指令时，`v-for` 比 `v-if`具更高的优先级
* 永远不要把 `v-if` 和 `v-for` 同时用在同一个元素上，如果实在需要，则在外套层 `template`，在这一层进行 `v-if` 判断，然后再内部进行 `v-for` 循环，避免每次只有 `v-if`只渲染很少一部分元素，也要遍历同级的所有元素
```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="https://cdn.jsdelivr.net/npm/vue"></script>
    <script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.js"></script>
</head>
<body>
<div id="app">
    <ul >
        <li v-for="item in user" v-if="item.isActive">{{item.name}}</li>
    </ul>
</div>
</body>
<script>
    new Vue({
        el: '#app',
        data: {
            user: [
                {name: 'hehe1', isActive: true},
                {name: 'hehe2', isActive: false},
                {name: 'hehe3', isActive: true},
                {name: 'hehe4', isActive: true},
            ]
        },
    });


    // 将会进行如下运算
    // this.users.map(function(user) {
    //    if(user.isActive) {
    //       return user.name; 
    //    }    
    // })
</script>
</html>
```

- 如果条件出现在循环内部，可通过计算属性`computed`提前过滤掉那些不需要显示的项

```js
computed: {
    items: function() {
      return this.list.filter(function (item) {
        return item.isShow
      })
    }
}
```






# 10. Vue 子组件调用父组件方法总结
## this.$emit('fn')

  ```js
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    </head>
    <body>
        
        <div id="app">
            <div>
                <child @fatherMethod="fatherMethod"></child>
            </div>
        </div>

        <script>

            Vue.component('child', {
                template: `<div @click="activeBtn">点击我</div>`,
                methods: {
                    activeBtn() {
                        console.log(11);
                        this.$emit('fatherMethod');
                    }
                }          
            })
            var app = new Vue({
                el: "#app",
                methods: {
                    fatherMethod() {
                        console.log('父组件');
                    }
                }
            })

        </script>
        
    </body>
    </html> 
  ```

## this.$parent.fn()

```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
</head>
<body>
    
    <div id="app">
        <div>
            <child></child>
        </div>
    </div>

    <script>

        Vue.component('child', {
            template: `<div @click="activeBtn">点击我</div>`,
            methods: {
                activeBtn() {
                    this.$parent.fatherMethod();
                }
            }          
        })
        var app = new Vue({
            el: "#app",
            methods: {
                fatherMethod() {
                    console.log('父组件');
                }
            }
        })

    </script>
    
</body>
</html>
```
## 父组件把方法通过props传入子组件中，在子组件里面调用这个方法

  ```js
  <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    </head>
    <body>
        
        <div id="app">
            <div>
                <child :acson="fatherMethod"></child>
            </div>
        </div>

        <script>

            Vue.component('child', {
                template: `<div @click="activeBtn">点击我</div>`,
                props: {
                    acson: {
                        type: Function,
                        default: null
                    }  
                },
                methods: {
                    activeBtn() {
                        this.acson();
                    }
                }          
            })
            var app = new Vue({
                el: "#app",
                methods: {
                    fatherMethod() {
                        console.log('父组件');
                    }
                }
            })

        </script>
        
    </body>
    </html>

  ```





# 11. 自己封装的组件如何使用 v-model
```js
<!-- parent -->
<template>
    <div class="parent">
        <p>我是父亲, 对儿子说： {{sthGiveChild}}</p>
        <Child v-model="sthGiveChild"></Child>
    </div>
</template>
<script>
import Child from './Child.vue';
export default {
    data() {
        return {
            sthGiveChild: '给你100块'
        };
    },
    components: {
        Child
    }
}
</script>


<!-- child -->
<template>
    <div class="child">
        <p>我是儿子，父亲对我说： {{give}}</p>
        <a href="javascript:;" @click="returnBackFn">回应</a>
    </div>
</template>
<script>
export default {
    props: {
        give: String
    },
    model: {
        prop: 'give',
        event: 'returnBack'
    },
    methods: {
        returnBackFn() {
            this.$emit('returnBack', '还你200块');
        }
    }
}
</script>
```





# 12. Vue 响应式原理
<img src="https://cn.vuejs.org/images/data.png">

## 总结一下：

- 任何一个 `Vue Component` 都有一个与之对应的 `Watcher` 实例
- `Vue` 的 `data` 上的属性会被添加 `getter` 和 `setter` 属性
- 当`Vue Componnet` `render`函数被执行的时候，`data`上会被触碰（touch），即被读，`getter`方法会被调用，此时 Vue 会去记录此 `Vue Componnent` 所依赖的所有 `data`。（这一过程被称为依赖收集）
- `data` 被改动时候（主要是用户操作），即被写，`setter`方法会被调用，此时 Vue 会去通知所有依赖于此data的 组件去调用

**Vue 不支持 IE8 以下版本的浏览器，因为浏览器是基于 Object.defineProperty 来实现数据响应的，而Object.defienProperty 是 ES5 中无法 shim 的特性，这也是为什么 Vue 不支持 IE8 以及更低版本浏览器的原因；Vue 通过 Object.defineProperty 的 getter/setter 对收集的依赖进行监听，在监听被访问和修改时通知变化，进而更新视图数据。**

### Vue数据响应式变化涉及Observer丶Watcher丶Dep
**1. 首选进行Vue的init初始化操作**
- initData这里面做了两件事，一是将_data上面的数据代理到vm上，二是通过执行observe(data, true/asRootData)将所有data变成可观察的，即对data定义的每个属性进行getter/setter操作，这里就是Vue实现响应式的基础
- 这里**new Observer(value)** 就是实现响应式的核心方法之一了，通过它将data转变可以变成观察的，而这里正是我们开头说的，用了**Object.definedProperty**实现了data的**getter/setter**操作，通过**Watcher**来观察数据的变化，进行更新到视图中。

**2. Observer**
- Observer类是将每个目标对象（即data）的键值对转换成getter/setter形式，用于进行依赖收集以及调度更新

https://juejin.cn/post/6844903561327820808
？？？？






# 13. Vue 中的 key 和 React 中的key
## Vue 中的 key 

### 作用：

- **Vue 中的 key 是为了 Vue 中的 vNode 标记的唯一标识，通过这个标识，我们的 diff 操作可以更准确丶更快速。**

- **为了虚拟 dom 能够快速找准对应的节点，进行对比，极大的提升虚拟 dom 对比速度，也减少了不必要的遍历。**

### 特点：

- **准确：** 如果不加 key，那么 Vue 会选择复用节点（Vue的就地更新策略），导致之前节点的状态被保留下来，会产生一系列的 bug
- **快速：** key 的唯一性可以被 Map 数据结构充分利用，相比于遍历查找的时间复杂度O(n)，Map的时间复杂度仅仅为O(1)。
  
    ```objc
    function createKeyOldIdx(children, beginIndex, endIndex) {
        let i, key;
        const map = {};
        for(i = beginIndex, i <= endIndex, ++i) {
            key = children[i].key;
            if(isDef(key)) {
                map[key] = i；  
            }
        }
        return map;
    }
    ```

### 应用场景：

- **列表组件**
  
  ```js
  <div v-for="item in items" :key="item.id">
      <!-- 内容 -->
  </div>
  ```
- **允许用户在不同的登录方式之间切换**
  ```js
  <template v-if="loginType === 'username'">
      <label>Username</label>
      <input placeholder="Enter you name" key="username-input">
  </template>
  <template v-else>
      <label>Email</label>
      <input placeholder="Enter your email address" key="email-input">
  </template>
  ```

## React 中的 key

### 定义：

**属性，它是一种特殊的属性，它的出现不适给开发者用的，而是给 React 自己使用的，有了 key 属性后，就可以与组件建立了一种对应关系，简单来说，react 利用 key 来识别组件，它是一种身份识别，就像每个人有一个身份证来辨识一样。每个key对应一个组件，相同的key，React认为是同一个组件，这样后续相同的 key 对应组件都不会被创建。**

### 作用：

**react 的 diff 算法是把 key 当成唯一 id 然后比对组件的 value 来确定是否需要更新的，所以如果没有 key，react 将不会知道该如何更新组件。**

- key 值相同的，如果两个元素是相同的 key，且满足第一点元素类型相同，若元素属性有所变化，则 React 值更新组件对应的属性，这样的情况下，性能开销相对较小
- key 值不同，在 render 函数执行的时候，新旧两个虚拟 DOM 会进行对比，如果两个元素有不同的 key，那么前后两次渲染中就会被认为是不同的元素，这时候旧的那个元素会被不挂载，新的元素会被挂载




# 14. $nextTick 的使用和作用
## 原理：

**在下一次 DOM 更新循环之后执行延迟回调，在修改数据之后立即使用这个方法，获取更新后的 DOM。**

**`$nextTick`原理：** 为什么要使用`$nextTick`?这是由于 Vue 是异步执行 dom 更新的，一旦观察到数据变化，Vue 就会开启一个队列，然后把在同一个事件循环（event loop）当中观察到数据变化的 watcher 推送进这个队列。如果这个 watcher 被触发多次，只会被推送到队列一次。这种缓冲行为可以有效的去掉重复数据造成的不必要的计算和 dom 操作。而下一个事件循环开始时，Vue 会进行必要的 dom 更新，并清空队列（$nextTick方法就相当于在 dom 更新 和 清空队列后 额外插入的执行步骤）

## 应用场景：需要在视图更新之后，基于新的视图进行操作。

**需要注意得是，在 created 和 mouted 阶段，如果操作渲染后的视图，也要使用`$nextTick`方法**

- 点击按钮显示原本以v-show = false隐藏起来的输入框，并获得焦点 
    ```js
    <div id="app">
        <input type="text" v-show = "showit" id="keywords">
    
        <button @click="click">click</button>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/vue"></
    <script>
        new Vue({
            el: '#app',
            data: {
                showit: false
            },
            methods: {
                showsou() {
                    this.showit = true;
                    // document.getElementById('keywords').focus();
    
                    this.$nextTick(function() {
                        document.getElementById('keywords').focus();
                    })
                },
                click() {
                    this.showsou();
                }
            }
        });
    </script>
    ```
- 点击获取元素的宽度
    ```js  
    <div id="app">
        <p ref="myWidth" v-if="showMe">{{message}}</p>
        <button @click="getMyWidth">click</button>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/vue"></script>
    <script>
        new Vue({
            el: '#app',
            data: {
                showMe: false,
                message: ""
            },
            methods: {
                getMyWidth() {
                    this.showMe = true;
                    // this.message = this.$refs.myWidth.offsetWidth;
    
                    this.$nextTick(() => {
                        this.message = this.$refs.myWidth.offsetWidth;
                    })
                }
            }
        });
    </script>
    ```
- 使用 swiper 插件通过 ajax 请求图片后的滑动问题

## 源码分析
```js
let timerFunc;
let callbacks = []; // 回调函数队列
let pending = false; // 异步锁

// 执行回调函数
function flushCallbacks() {
    // 重置异步锁
    pending = false;
    // 防止出现nextTick包含nextTick时出现的问题，在执行回调函数队列时，提前复制备份，清空回调函数队列
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    // 执行回调函数队列
    for(let i = 0; i < copies.length; i++) {
        copies[i]();
    }
}

// 判断1：是否支持原生Promise
if (typeof Promise !== 'undefiend' && isNative(Promise)) {
    const p = Promise.resolve();
    timerFunc = () => {
        p.then(flushCallbacks);
        if(isIOS) setTimeout(noop);
    }
    isUsingMicroTask = true;
// 判断2：是否原生支持MutationObserver 
}else if(!isIE && MutationObserver !== 'undefiend' && (
    isNative(MutationObserver) || 
    MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
    let counter = 1;
    const observer = new MutationObserve(flushCallbacks);
    const textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
        characterData: true
    })
    timerFunc = () => {
        counter = (counter + 1) % 2;
        textNode.data = String(counetr);
    }
    isUsingMicroTask = true;
// 判断3：是否原生支持setImmediate
}else if(typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    timerFunc = () => {
        setImmediate(flushCallbacks);
    }
// 判断4：上面都不行，直接使用setTimeout
}else {
    timerFunc = () => {
        setTimeout(flushCallbacks, 0);
    }
}
// 微任务  Promise MutationObserver
// 宏任务  setImmediate setImmediate


// 我们调用的nextTick函数
export function nextTick(cb?: Function, ctx?: Object) {
    let _resolve;
    // 将回调函数推入异步队列
    callback.push(() => {
        if(cb) {
            try {
                cb.call(ctx);
            } catch(e) {
                handleError(e, ctx, 'nextTick');
            }
        }else if(_resolve) {
            _resolve(ctx);
        }
    })
    // 如果异步锁未锁上，锁上异步锁，调用异步函数；
    // 准备等同步函数执行完后，就开始执行回调队列
    if(!pending) {
        pending = true;
        timerFunc();
    }
    // 如果没有提供回调，并且支持Promise，返回一个Promise
    if(!cb && typeof Promise !== 'undefined') {
        return new Promise(resolve => {
            _resolve = resolve;
        })
    }
}
```
- 把回调函数放在callbacks等待执行
- 将执行函数放到微任务或者宏任务中
- 事件循环到了微任务或者宏任务，执行函数依次执行callbacks中的回调

`this.$nextTick`是微任务

## 实现一个简易版本的nextTick
```js
// 通过nextTick接收回调函数，通过setTimeout来异步执行回调函数
// 通过这种方式，可以在下一个tick中 执行回调函数，即在UI重新渲染后执行回调函数

let callbacks = [];
let pending = false;

function nextTick(cb) {
    callbacks.push(cb);
    if(!pending) {
        pending = true;
        setTimeout(flushCallback, 0);
    }
}
function flushCallbacks() {
    pending = false;
    let copies = callbacks.slice();
    callbacks.length = 0;
    copies.forEach(copy => {
        copy(); 
    })
}

// 测试
nextTick(function() {
    console.log(1);
})
console.log(2);
// 2
// 1

```





# 15. Vue 的组件为什么要用 export defalut?
**Vue 的模块机制是通过 `webpack` 实现的模块化，因此可以使用 import 来引入模块,，例如:**

```js
import Vue from 'vue'
import App from './App'
import router from './router'
```

**你还可以在 build/webpack.base.conf.js 文件中修改相关配置：**

```js
resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('src'),
    }
}
```
意思是，你的模块可以省略`.js`丶`.vue`丶`json` 后缀，webpack 会在之后自动加上

export 用来导出模块，Vue 的单文件组件通常需要导出一个对象，这个对象是 Vue 实例的选项对象，以便在其它地方可以使用import引入。而 new Vue() 相当于一个构造函数，在入口文件 `main.js` 构造根组件的同时，如果根组件还包含其它子组件，那么 Vue 会通过引入的选项对象构造其对应的 Vue 实例，最终形成一棵组件树。

## export 和 export defalut 的区别在于：

- `export` 可以导出多个命名模块，例如：
```js
// demo1.js
export const str = 'hello word';

export function f(a) {
    return a + 1;
}
```
对应的引入格式：
```js
// demo2.js
import { str, f } from 'demo1'
```

- `export default` 只能导出一个默认模块，这个模块可以匿名，例如：
```js
// demo1.js
export default {
    a: 'hello',
    b: 'world'
}
```
对应的引入方式
```js
import obj from 'demo1'
```
引入的方式可以给这个模块取任意名字，例如'obj'，且不需要用大括号括起来

## 总结：
- `export` 命令对外接口是有名称的且 `import` 命令从模块导入的变量名与被导入模块对外接口的名称相同，而 `export default` 命令对外输出的变量名可以是任意的，这时 `import` 命令后面，不使用大括号
- `export default` 命令用于指定的默认输出。显然，一个模块只能有一个默认输出，因此 `export default` 命令只能使用一次。所以，`import` 命令后面才不用加大括号，因为只可能唯一对应 `export default` 命令。






# 16. Vuex原理
## Vuex是什么？怎么使用？ 那种功能场景下使用它 ？
**Vuex 是专门为 VueJs 应用程序设计的状态管理工具。它是集中式存储管理应用的所有组件的状态，并以相应的规则保证以一种可预测的方式发生变化。**

- Vuex 框架中状态管理。
- 在 main.js 引入 store.js, 新建一个目录 store.js
- 场景：单页面应用中 组件之间的状态 音乐播放 登录状态 加入购物车


## Vuex 有哪种属性
State丶Getter丶Mutation丶Action丶Module

**1）State** 

state 是存储的单一状态，是存储的基本数据。

**2）Getters**

getter 是 store 的计算属性，对 state 的加工，是派生出来的数据。就像 computed 计算属性一样，getter 返回的值会根据它的依赖被缓存起来，且只有当它的依赖值发生变化才被重新计算。

**3）Mutation** 

mutation 提交更改数据，使用 store.commit 方法更改 state 存储的状态。（mutation是同步函数）

**4）Action**

action像一个装饰器，提交 mutation，而不是直接变更状态（action可以包含任何异步操作）


**5）Modules**

Module是 store 分割的模块，每个模块拥有自己的state丶getter丶mutations丶actions

**6）辅助函数**

Vuex提供了 mapState丶MapGetter丶MapActions丶mapMutation等辅助函数给开发vm中处理store

**Vuex 会有一定的门槛和复杂性，它的主要使用场景是大型单页面应用场景，如果你的项目不是很复杂，用一个bus也可以实现数据的共享，但是它在数据管理，维护，还只是一个简单的组件，而 Vuex 可以更优雅高效的完成状态管理，所以，是否属于 Vuex 取决于你的团队和技术储备**

## Vuex 的特点

- 遵循单向数据流
- Vuex 中的数据是响应式的

## Vuex 数据传输过程

- 通过 new Vue.Store() 创建一个仓库，state 是公共的状态，state -> components 渲染页面
- 当组件内部通过 this.$store.state 属性来调用公共状态中的 state，进行页面的渲染
- 当组件需要修改数据的时候，必须遵循单向数据流。组件里在 methods 中拓展 mapActions，调用 store 里的 actions 里的方法
- actions 中的每个方法都会接收一个对象，这个对象里面有个 commit 方法，用来触发 mutation 里面的方法
- mutation 里面的方法用来修改 state 中的数据，mutation 里面的方法都会接收2个参数

## 疑问：

### Vuex 的 store 是如何挂载注入到组件中呢？

- 利用 Vue 的插件机制，使用 Vue.use(vuex) 时，会调用 Vuex 的 install 方法，挂载 Vuex
- 里面的 applyMixin 方法使用 Vue 混入机制，Vue 的生命周期 beforeCreate 钩子函数前混入 vuelint 方法

  分析源码知道 vuex 是利用 vue 的 mixin 混入机制，在 beforeCraete 钩子前混入 vuexlnit 方法，vuexlint 方法实现了 store 注入 vue 组件实例，并注册了 vuex store 的引用属性 `$store`

**store注入过程**
<img src="https://pic4.zhimg.com/v2-a8b969f8771a1fc13b7cedfdfe86f0e7_b.jpg">

### Vuex 的 state 和 getter 是如何映射到各个组件实例中响应式更新状态呢？

- store 实现的源码在 src/store.js
- 找到 resetStoreVM 核心方法
- 可以看出 Vuex 的 state 状态是响应式，是借助 Vue 的 data 是响应式，将 state 存入 Vue 实例组件的 data中；Vuex 的 getters 是借助 Vue 的计算属性 computed 实现数据实时监听
- computed 计算属性监听 data 数据变更主要经历几个过程
  <img src="https://pic3.zhimg.com/v2-2730644102b66eef140110b814a90496_b.jpg">

### Vuex 页面刷新数据丢失的解决办法

解决思路：将 state 的数据保存在 localstorage、sessionstorage 或 cookie 中（[三者的区别](https://stackoverflow.com/questions/19867599/what-is-the-difference-between-localstorage-sessionstorage-session-and-cookies)），这样即可保证页面刷新数据不丢失且易于读取。

由于 Vue 是单页面应用，操作都是在一个页面跳转路由，因此 sessionStorage 较为合适,原因如下

- sessionStorage 可以保证打开页面时 sessionStorage 的数据为空；
- 每次打开页面 localStorage 存储着上一次打开页面的数据，因此需要清空之前的数据。

Vuex 的数据在每次页面刷新时丢失，是否可以在页面刷新前再将数据存储到 sessionstorage 中呢，是可以的。beforeunload 事件可以在页面刷新前触发，但是在每个页面中监听 beforeunload 事件感觉也不太合适，那么最好的监听该事件的地方就在 app.vue 中。

- 在 app.vue 的 created 方法中读取 sessionstorage 中的数据存储在 store 中，此时用vuex.store的replaceState 方法，替换 store 的根状态

- 在 beforeunload 方法中将 store.state 存储到 sessionstorage 中。

#### 代码如下

```js
export default {
  name: 'App',
  created () {
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store") ) {
        this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
    } 

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload",()=>{
        sessionStorage.setItem("store",JSON.stringify(this.$store.state))
    })
  }
}
```




# 17. 路由原理
路由这个概念最先是后端出现的。在以前用模板引擎开发页面时，经常会看到这样

```js
http://www.xxx.com/login
```

大致流程可以看成这样：
- 浏览器发出请求
- 浏览器监听到80端口（或443）有请求过来，并解析路径
- 根据服务器的路由配置，返回相应信息（可以是html字符串，也可以是json数据和图片等）
- 浏览器根据数据包的 Content-Type 来决定如何解析数据

简单来说路由就是用来跟后端进行交互的一种方式，通过不同的路径，来请求不同的资源，请求不同的页面是路由的其中一种功能。

## hash模式
随着 ajax 的流行，异步数据请求交互在不刷新浏览器的情况下进行。而异步交互体验的跟高级版本就是SPA --- 单页应用。单页应用不仅仅是在页面交互无刷新的，连页面跳转都是无刷新的，为了实现单页应用，所以就有了前端路由。

类似服务器路由，前端路由实现起来其实也很简单，就是匹配不同的 URL 路径，进行解析，然后动态的渲染区域html 内容。但是这样存在一个问题，就是 url 每次变化的时候，都会造成页面的刷新。那解决问题的思路在改变 url 的情况下，保证页面的不刷新。在 2014 年之前，大家是通过 hash 来实现路由的， url hash就是类似于：
```js
http://www.xxx.com/#.login
```
**这种#。后面 hash 值的变化，并不会导致浏览器向服务器发出请求，浏览器不发出请求，也就不会刷新页面。另外每次 hash 值的变化，还会触发 hashchange 这个事情，通过这个事情我们就可以知道 hash 值发生了哪些变化。然后我们便可以监听 hashchange 来实现更新页面部分内容的操作：**

```js
function matchAndUpdate() {

}
window.addEventListener("hashchange", matchAndUpdate)
```

## history模式
14年之后，因为 HTML5 标准发布。多了两个API `pushState` 和 `replaceState`，通过这两个 API 可以改变 url 地址且不会发送请求。同时还有 `popstate`事件。通过这些就能用另一种方式来实现前端路由，但原理都是跟 hash 实现相同的。用了 HTML5 的实现，单页路由的 url 就不会多出一个 #,变得更加美观。但因为没有 # 号，所以当用户刷新页面之类的操作时，浏览器还是会想浏览器服务器发送请求。为了避免出现这种情况，所以这个实现需要服务器的支持，需要把路由都重定向到根页面。

```js
funtion matchAndUpdate() {
    // todo 匹配路径做 dom 更新操作
}

window.addEventListener("popstate", matchAndUpdate)
```

## vue-router 是什么？它有哪些组件？
vue 用来写路由的一个插件。router-link丶router-view


## active-class 是哪些组件的属性？
vue-router模块的router-link组件   children数组定义子路由


## 怎么定义vue-router的动态路由？怎么获取传过来的值？
在router目录下的index.js文件 对path属性加上/:id

使用router对象的params.id


## vue-router有哪些导航钩子？
三种

第一种：是全局导航钩子：router.beforeEach(to, from, next) 作用：跳转之前进行判断拦截

第二种：组件内的钩子

第三种：单独路由独享组件



## `$route`和`$router`的区别
`$router`是VueRouter的实例，在script标签中想要导航到不同的URL，使用$router.push方法。返回上一个历史history用$router.to(-1)

$route为当前router跳转对象 里面可以获取当前路由的name丶path丶query丶params等




## vue-router的两种模式
> 前端路由实现本质就是监听URL的变化，然后匹配路由规则，显示相应的页面，并且无须刷新页面

#### Hash模式 
`www.test.com/#/`，就是Hash URL，当`#`后面的哈希值发生变化时，可以通过`hashchange`事件来监听URL的变化，从而进行跳转页面，并且无论哈希值如何变化，服务端收到的URL请求永远是`www.test.com`
```js
window.addEventListener('hashchange', () => {
    // ...具体逻辑
})
```
Hash模式相对于说更简单，并且兼容性也更好
#### History模式
History模式是HTML5新推出的功能，主要使用`history.pushState`和`history.replace`改变URL  
通过History模式改变URL同样不会引起页面的刷新，只会更新浏览器的历史记录
```js
// 新增历史记录
history.pushState(stateObject, title, URL)
// 替换当前历史记录
history.replaceState(stateObject, title, URL)
```
当用户做出浏览器动作时，比如点击后退按钮时会触发`popState`事件
```js
window.addEventListener('popState', e => {
    console.log(e.state);
})
```
#### 两种模式对比
- Hash模式只可以更改`#`后面的内容，History模式可以通过API设置任意的同源URL
- History模式可以通过API添加任意类型的数据到历史记录中，Hash模式只能更改哈希值，也就是字符串
- Hash模式无须后端配置，并且兼容性好。History模式在用户手动输入地址或者刷新页面的时候会发起URL请求，后端需要配置`index.html`页面用于匹配不到静态资源的时候    




## vue-router实现路由懒加载（动态加载路由）
三种方式

- 第一种：vue异步组件技术 === 异步加载，vue-router配置路由，使用vue的异步组件技术，可以实现按需加载，但是这种情况下一个组件生成一个JS文件

- 路由懒加载（使用import）

- webpack提供的require(), vue-router配置路由，使用webpack的require.ensure技术，也可以按需加载。这种情况下，多个路由指定相同的chunkName，会合并打包成一个JS文件





## 路由守卫

- 分类
  - 全局守卫：是指路由实例上直接操作的钩子函数，特点是所有路由配置的组件都会触发，直白点就是触发路由就会触发这些钩子函数
     - router.beforeEach(to, from, next)   （全局前置守卫）
     - router.beforeResolve(to, from, next)  （全局解析守卫）
     - router.afterEach(to, from)  （全局后置守卫）
     - 注：beforeEach 和 afterEach 都是 vue-router 实例对象的属性，每次跳转前 beforeEach 和 afterEach 都会执行的
     
  - 路由独享守卫：是指在单个路由配置的时候也可以设置的钩子函数
    - beforeEnter(to, from, next) 
    
      ```js
      {
        path: '/',
        name: 'Login',
        component: Login,
        beforeEnter: (to, from, next) => {
          console.log('即将进入 Login');
          next();
        }  
      }
      ```
    
      
  - 组件内守卫: 是指在组件内执行的钩子函数，类似于组件内的生命周期，相当于为配置路由的组件添加的生命周期钩子函数
    - beforeRouterEnter(to, from, next)
    - beforeRouterUpfate(to, from, next)
    - beforeRouterLeave(to, from, next)
- 应用场景
  - 只有当用户已经登录并拥有某些权限时才能进入某些路由
  - 一个由多个表单组成的向导，例如注册流程，用户只有在当前路由的组件中填写了满足的信息才可以导航到下一个路由  
  - 当用户未执行保存操作而试图离开导航时提醒用户
  - 应用场景：在用户离开当前界面时询问
  - 应用场景：验证用户登录过期






## vue路由传参的形式
- 页面刷新数据不会丢失
  ```js
  <div class="exmaine" @click="insurance(2)">查看详情</div>
  
  methods: {
      insurance(id): {
          this.$router.push({
              path: "/particulars/${id}"
          })
      }
  }
  
  // 对应的路由配置
  {
      path: "/particulars/:id",
      name: "particulars",
      component: particulars
  }
  
  // 另外页面获取参数如下
  this.$route.params.id
  ```
- 页面刷新数据会丢失（可以在路由的path里加参数，加上参数以后刷新页面数据就不会丢了）
  ```js
  // 通过路由属性中的name来确定匹配的路由 通过params来传递参数
  methods: {
      insurance(id) {
          this.$router.push({
              name: "particulars",
              params: {
                  id: id
              }
          })
      }
  }
  
  // 对应路由配置：注意这里不能使用:/id来传递参数了 因为组件中已经使用params来携带参数了
  {
      path: "/particulars",
      name: "particulars",
      component: particulars
  }
  
  // 子组件中主要获取参数
  this.$route.params.id
  ```
- 使用path来匹配路由，然后通过query来传递参数
  ```js
  methods: {
      insurance(id) {
          this.$router.push({
              path: "/particulars",
              qury: {
                  id: id
              }
          })
      }
  }
  
  {
      path: "/particulars",
      name: "particulars",
      components: "particulars"
  }
  
  this.$route.query.id
  ```
- 应用场景
  - 点击父组件   






# 18. Vue SSR
SSR：服务端将 Vue 组件渲染为HTML字符串，并将 html 字符串直接发送到浏览器，最后将这些静态资源标记“激活”为客户端上完全可以可交互的应用程序。

## 优点：

- 更好的 SEO，由于搜索引擎爬虫工具可以直接查看完全渲染的页面
- 更快的内容到达时间，提高首屏渲染速度

## 缺点：

- 开发条件受限（服务端只执行 beforeCreated 和 created 生命周期函数，并且没有window丶DOM和BOM等）
- 涉及构建设置和部署的更多要求，需要处于 node server 的运行环境
- 更多的服务端负载



优点：（SPA缺点）

1. 首屏渲染速度慢 来回次数多  内容到达时间长 
2. SEO不友好 搜索引擎爬虫不友好


VUe模板 解析html  查库等异步操作


1. 开发条件受限  不执行Mounted生命周期的钩子函数 第三方库不能使用
2. 构建部署要求多 nodejs渲染
3. 服务端负载变大


预渲染 几个广告页面  没有动态页面 非常在于SEO 静态 应用程序 

传统的web渲染技术 asp.net php jsp


cli3
渲染器 vue-server-render
nodejs 服务器 express
ssr>npm i vue-server-render express -D

入口：app.js
服务端入口：entry-server.js
客户端入口：entry-client.js 

打包脚本 跨平台 





# 19. MVVM
## 什么是 MVVM？
- MVVM 是 Model-View-ViewModel 的缩写，MVVM是一种设计思想。Model 层代表数据模型，也可以在Model 中定义数据修改和操作的业务逻辑；View 代表 UI 组件，它负责将数据模型转化成 UI 展示出来，ViewModel 是一个同步View和Model的对象。
- 在 MVVM 架构下，View 和 Model 之间并没有直接的联系，而是通过 ViewModel 进行交互，Model和ViewModel 之间的交互是双向的，因此View数据的变化会同步到 Model 中，而 Model 数据的变化也会立即反应到 View 上。
- ViewModel 通过双向数据绑定把 View 层和 Model 层连接了起来，而 View 和 Model 之间的同步工作完全是自动的，无需人为干涉，因此开发者只需要关注业务逻辑，不需要手动操作 DOM，不需要关注数据状态的同步问题，复杂的数据状态维护完全有 MVVM 来统一管理。


## MVVM 和 MVC 区别？
- MVC和MVVM其实区别不大。都是一种设计思想。主要是 MVC 中的 Controller 演变成 MVVM 中的viewModel。
- MVVM 主要是解决了 MVC 中大量的 DOM 操作使页面性能降低，加载速度变慢，影响用户体验。和当 Model 频繁发生变化，开发者需要主动更新到 View。   






# 20. Vue 优点
**Vue两大特点：响应式编程丶组件化**

- **轻量级框架：** 只关注视图层，是一个构建数据的视图集合，大小只有几十 KB
- **简单易学：** 国人开发，中文文档，不存在语言障碍，易于理解和学习
- **双向数据绑定：** 保留了 angular 的特点，在数据操作方面更加简单
- **组件化：** 
  - 保留了 react 的优点，实现了 html 的封装和重用，在构建单页面应用方面有着独特的优势。
  - 优点是：提高开发效率丶方便重复使用丶简化调试步骤丶提高整个项目的可维护性丶便于协同开发。
- **视图丶数据丶结构分离：** 使数据的更改更为简单，不需要进行逻辑代码的修改，只需要操作数据就能完成相关操作
- **虚拟DOM:** dom 操作是非常耗费性能的，不再使用原生的 dom 操作结点，极大解放 dom 操作，更具体操作还是dom，只不过换了一种方式
- **运行速度赶快：** 
  - 相比较与 react 而言，同样是操作虚拟 DOM，就性能而言，Vue 存在很大的优势
  - Vue 是单页面应用，使页面局部刷新，不用每次跳转页面都要请求所有数据 和 dom，这样大大加快了访问速度和提高用户体验。而且它第三方 UI 库很多，节省开发时间。





# 21. Vue 常用修饰符
- **`.prevent`:** 提交事件不再重载页面
- **`.stop`:** 阻止单击冒泡事件
- **`.capture`:** 事件监听 事件发生的时候会调用
- **`.self`:** 当事情发生在该元素本身而不是子元素的时候会触发
- **`.number`:** 将用户的输入转为成数值类型
- **`.once`:** 只会触发一次

## v-on可以监听多个方法吗？???
可以???
```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <input type="text"   @input = "onInput" @focus ="onFucus"  @blur ="onBlur">
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script>
       new Vue({
           el: "input",
           methods: {
                onInput: function () {
                     console.log(1);
                },
                onBlur: function () {
                    console.log(2);
                },
                onFucus: function() {
                    console.log(3);
                }
           },
       }) 
    </script>

</body>
</html>
```






# 22. Vue 事件中如何使用 event 对象？
- 如果是函数的形式的，直接给个形参

  ```js
  <div id="app">
      <button v-on:click="click">click me</button>
  </div>
  ...
  var app = new Vue({
      el: '#app',
      methods: {
          click(event) {
              console.log(typeof event);    // object
          }
      }
  });
  ```

- 如果是函数执行的形式，需要传入一个参数 `$event`

  ```js
  <div id="app">
      <button v-on:click="click($event, 233)">click me</button>
  </div>
  ...
  var app = new Vue({
      el: '#app',
      methods: {
          click(event, val) {
              console.log(typeof event);    // object
          }
      }
  });
  ```

  




# 23. Vue 中如何编写可复用的组件？
- 高内聚，低耦合
- 单一职责
- 组件分类
  - 通用组件（可复用组件）    
  - 业务组件 （一次性组件）
- 可复用组件尽量减少对外部条件的依赖，所有与 Vuex 相关的操作都不应该在可复用组件中出现 
- 组件应当避免对父组件的依赖，不要通过 this.$parent 来操作父组件的示例，父组件也不要通过 this.$children 来引用子组件的示例，而是通过子组件的接口与之交互

？？?
https://www.jianshu.com/p/79a37137e45d






# 24. Vue 插槽
## 使用场景：

- 父组件向子组件传递 DOM 节点
- “固定部分+动态部分”的组件的使用场景

## 单个插槽 | 默认插槽 | 匿名插槽

- 特点：不用设置 name 属性
- 源码实现
  ```js
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  </head>
  <body>
  
      <div id="app">
          <h1>我是父组件的标题</h1>
          <my-home>
              <p>这是一些初始内容</p>
              <p>这是更多的初始内容</p>
          </my-home>
      </div>
  
      <script>
  
          Vue.component('my-home', {
              data: function() {
                  return {
                      count: 0
                  }
              },
              template: `<div><h2>我是子组件的标题</h2><slot>只有在没有要分发的内容时才会显示。</slot></div>`
          })
          new Vue({
              el: "#app"
          })
  
      </script>
      
  </body>
  </html>
  ```

## 具名插槽

- 特点：有 name 属性，具名属性可以在一个组件
中出现多次，出现在不同的位置
- 源码实现 
```js
<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  </head>
  <body>

      <div id="app">
          <app-layout>
              <h1 slot="header">这里可能是一个页面标题</h1>
              <p>主要内容的一个段落</p>
              <p>另一个主要段落</p>
              <p slot="footer">这里有一些联系信息</p>
          </app-layout>
      </div>
      
      <script>

          // 具名插槽
          Vue.component('app-layout', {
              template: `<div class="container">
                          <header>
                              <slot name="header">头</slot>
                          </header>
                          <main>
                              <slot></slot>
                          </main>
                          <footer>
                              <slot name="footer">尾巴</slot>
                          </footer>
                      </div>`
          })

          new Vue({
              el: "#app"
          })

      </script>

  </body>
  </html>
```

## 作用域插槽

- 特点：在 slot 上绑定数据，可从子组件获取数据的可复用的插槽
- 应用场景：封装一个列表组件（或者类似列表的组件）因为在真正使用场景下，子组件的数据都是来自父组件的，作为组件内部应该保持纯净，就像 element-ui 里的 table 组件，肯定不会定义一些数据在组件内部，然后传递给你，table 组件的数据都是来自调用者，然后 table 会把每一行的 row，在开发者需要时，传递出去 
- 源码实现：
```js
<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  </head>
  <body>

      <div id="app">
          <child>
              <template slot-scope="user">
                  <div class="tmp">
                      <span v-for="item in user.data">{{ item }}</span>
                  </div>
              </template>
          </child>

      </div>

      <script>

          Vue.component('child', {
              data: function() {
                  return {
                      data: ['haha', 'hihi', 'hehe']
                  }
              },
              template: `<div class="child">
                          <slot :data="data"></slot>
                      </div>`
          })
 new Vue({
            el: "#app"
        })

    </script>
   </body>
    </html>
```

  ```
 <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    </head>
    <body>

        <div id="app">
            <todo-list :todos="todos">
                <template slot-scope="slotProps">
                    <span v-if="slotProps.todo.isComplete">✓</span>
                    <span>{{ slotProps.todo.text }}</span>
                </template>
            </todo-list>
        </div>

        <script>

            Vue.component('todoList', {
                props: {
                    todos: {
                        type: Array 
                    }
                },
                template: `<ul>
                            <li v-for="todo in todos" :key="todo.id">
                                <slot :todo="todo"></slot>
                            </li>
                        </ul>`
            })

            new Vue({
                el: "#app",
                data() {
                    return {
                        todos: [
                            {
                                id: 0,
                                text: 'haha0',
                                isComplete: false
                            },
                            {
                                text: 'haha1',
                                id: 1,
                                isComplete: true
                            },
                            {
                                text: 'haha2',
                                id: 2,
                                isComplete: false
                            },
                            {
                                text: 'haha3',
                                id: 3,
                                isComplete: false
                            }
                        ]
                    }
                }
            })

        </script>

        
    </body>
    </html>
  ```
## 动态插槽名

```js
<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  </head>
  <body>

      <div id="app">
          <base-layout>
              <template v-slot:[dyname]>
                  This is Me.
              </template>
          </base-layout>
      </div>

      <script>

          Vue.component('base-layout', {
              template: `<div>
                          <header style="font-size: 20rpx">
                              <slot name="header"></slot>
                          </header>
                      </div>`
          })

          new Vue({
              el: "#app",
              data: {
                  dyname: 'header'
              }
          })

      </script>

      
  </body>
  </html>
```






# 25. 说说你对 SPA 单页面的理解，它的优缺点是什么？
**SPA（single-page application）单页面仅在Web页面初始化时加载相应的 HTML丶JavaScript 和 CSS。一旦页面加载完成，单页面不会因为用户的操作而进行页面的重新加载或跳转；取而代之的是利用路由机制实现 HTML 内容的变换，UI 和 用户的交互，避免页面的重新加载。**

## 优点：

- 用户体验好丶快，内容的改变不需要加载整个页面，避免了不必要的跳转和重新渲染
- 基于上面一点，SPA 相对于服务器的压力较小
- 前后端分离，架构清晰，前后端进行交互逻辑，后端负责数据处理

## 缺点：

- **初始加载耗时多：** 为实现单页面Web应用功能及显示效果。需要在加载页面的时候将JavaScript丶CSS统一加，部分页面按需加载
- **前进后退路由管理：** 由于单页面应用在一个页面中显示所有的内容，所以不能使用浏览器的前进后退功能，所有的页面切换需要自己建立堆栈管理
- **SEO难度较大：** 由于所有的内容都在一个页面中动态替换显示，所以在SEO上其有天然的弱势











# 26. Vue.js 中的 ajax 请求代码应该写在组件的 methods 中还是 vuex 的 action 中
如果请求来的数据不是被其他组件公用，仅仅在请求的组件内使用，就不要放入vuex的state里面

如果被其他地方复用，这个很大概率上是需要的，如果是需要的请将放入action里面，方便使用





# 27. Vue 单元测试

## 单元测试是什么？

- 为检测特定的目标是否符合标准而采用专用的工具或者方法进行验证，并最终得出特定结果
- 需要访问数据库的测试不是单元测试
- 需要访问网络的测试不是单元测试
- 需要访问文件系统的测试不是单元测试

## 为什么需要单元测试？

- 准确性：测试可以验证代码的正确性，在上线前做到心里有底
- 自动化：当然手工也可以测试，通过 console 可以打印出内部信息，但是这是一次性的事情，下次测试还需要从头来过，效率不能得到保证。通过编写测试用例，可以做到一次编写，多次运行。
- 解释性：测试用例用于测试接口丶模块的重要性，那么在测试用例中就会涉及如何使用这些 API。其它开发人员如果要使用这些 API，那阅读测试用例是一种很好的途径，有时比文档说明更清晰。
- 驱动开发丶指导设计：代码被测试的前提是代码本身的可测试性，那么要保证代码的可测试性，就需要在开发中注意 API 的设计，TDD 将测试前移就是起到这么一个作用。
- 保证重构：互联网行业产品迭代速度很快，迭代必然存在代码重构的过程，那怎么才能保证重构后代码的的质量呢？有测试用例做后盾，就可以大胆的进行重构。

## 测试分类：

- 单元测试：关注应用中每个零件的正常运转，防止后续修改影响之前的组件
- 功能测试：确保其整体表现符合预期，关注能否让用户正常使用
- 整合测试：确保单独运行正常的零部件整合到一起之后依然能正常运行

## 单元测试的原则：

- 测试代码时，只考虑测试，不考虑内部实现
- 数据尽量模拟现实，越靠进现实越好
- 充分考虑数据的边界条件
- 对重点丶复杂丶核心代码，重点测试
- 利用AOP，减少测试代码数量，避免无用功能
- 测试丶功能开发相结合，有利于设计和代码重构

## 常用的测试工具：

- Mocha：JavaScript的测试框架，类似于 Java 中 Junit
- Chai：单元测试的验证框架

  



# 28. 如何设计一个通用组件？

- 要易用（至少让使用者能够简单方便的引入到程序当中）
- 要稳定（需要增加关键的测试）
- 要灵活（关键参数可配置）
- 要全面（日志丶拦截器丶监听器）
- 要谨慎（要考虑多种情况）
- 要易读（写的东西要能给别人讲清楚）

如何做？

- 如何做到易用，所谓中口难调，你觉得好用，其他人未必这样觉得。







# 29. Vue 如何防止引入外部 CSS 导致的全局污染

在它的 style 上加入 scope 属性

值得注意的是， Vue 的 scope 属性会导致该 style 不能覆盖 import 进来的 CSS 样式文件





# 30. 单页面和多页面的区别?

|                     | 单页面应用（SPA）                                            | 多页面应用（MPA）                          |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------ |
| 结构                | 一个主页面 + 许多模块的组件                                  | 许多完整的页面                             |
| 资源文件（CSS丶JS） | 组件公用的资源只需要加载一次                                 | 每个页面都要加载公用的资源                 |
| 刷新方式            | 页面局部刷新                                                 | 整页刷新                                   |
| url 模式            | a.com/#/page1  a.com/#/page2  hash和history都可使用          | a.com/page1.html a.com/page2.html          |
| 用户体验            | 页面切换快丶体验佳；当初次加载文件过多时，需要做相关的调优   | 页面切换慢，网速慢得时候，体验尤其不好     |
| 转场动画            | 容易实现                                                     | 无法实现                                   |
| 数据传递            | 容易                                                         | 依赖 url 传参丶或者 cookie丶localStorage等 |
| 搜索引擎优化（SEO） | 需要单独方案丶实现较为困难丶不利于SEO检索 可用服务器渲染（SSR）优化 | 实现方法简易                               |
| 适用范围            | 高要求的体验度丶追求界面流畅的应用                           | 适用于追求高度支持搜索引擎的应用           |
| 开发成本            | 较高，常需要借助专业的框架                                   | 较低，但页面重复代码多                     |
| 维护成本            | 相对容易                                                     | 相对复杂                                   |
|                     |                                                              |                                            |





# 31. Vue 中的 computed 实现原理

- 每个 computed 属性都会生成对应的观察者（Watcher 实例），观察者存在 value 属性和 get 方法。computed 属性的 getter 函数会在 get 方法中调用，并将返回值赋值给 value。初始时设置 dirty 和 lazy 的值为 true。lazy 为 true 不会立即执行 get 方法，而是会在读取 computed 值时执行。

  ```js
  function initComputed(vm, computed) {
      var watchers = vm._computedWatchers = Object.create(null); // 存放 computed 的观察者
      var isSSR = isServerRendering();
      for(var key in computed) {
          var userDef = computed[key];
          var getter = typeof userDef === "function" ? userDef : userDef.get;
          // ...
          watchers[key] = new Watcher( // 生成观察者（Watcher 实例）
              vm,
              getter || noop, // getter 将在观察者 get 方法中执行
              noop,
              computedWatcherOptions // { lazy: true } 懒加载，暂不执行 get 方法，当读取 computed 属性值执行
          )
          // ...
          defineComputed(vm, key, userDef);
      }
  }
  ```

- 将 compted 属性添加到组件实例上，并通过 get丶set 方法获取或者设置属性值，并且重定义 getter 函数、

  ```js
  function defineCompted(target, key, userDef) {
      var shouldCache != isServerRendering();
      // ...
      sharedPropertyDefinition.shouldCache
      	? createComputedGetter(key)
      	: createGetterInvoker(userDef);
      // ...
      Object.defineProperty(target, key, sharedPropertyDefinition); // 将 computed 属性添加到组件实例上
  }
  ```

  ```js
  // 重定义的 getter 函数
  function createComputedGetter(key) {
      return function computedGetter() {
          var watcher = this._computedWatchers && this.computedWatchers[key];
          if(watcher) {
              // true  懒加载
              watcher.evaluate(); // 执行 watcher 方法后设置 dirty 为 false
          }
          if(Dep.target) {
              watcher.depend();
          }
          return watch.value; // 返回观察者的 value 值
      }
  }
  ```

- 页面初始渲染时，读取 computed 属性值，触发定义后的 getter 属性。由于观察者的 dirty 值为 true，将会调用 get 方法，执行原始 getter 函数。getter 函数中读取 data （响应式）数据，读取数据时会触发 data 的 getter 方法，会将 computed 属性对应的观察者添加到 data 的依赖收集器中（用于 data 变更时通知更新）。观察者的 get 方法执行完成后，更新观察者的 value 值，并将 dirty 设置为 false，表示 value 值已更新，之后在执行观察者的 depend 方法，将上层观察者（该观察者含页面更新的方法，方法中读取了 computed 属性值）也添加到 getter 函数中 data 的依赖收集器中（getter 中的 data 的依赖收集器包含 computed 对应的观察者，以及包含页面更新方法（调用了 computed 属性）的观察者），最后返回 computed 观察者的 value 值。

  <img src="https://image-static.segmentfault.com/350/493/3504939397-5e7da0b9c325f_fix732">

- 当更改了 computed 属性的 getter 函数依赖的 data 值时，将会根据之前依赖收集的观察者，依次调用观察者的 update 方法，先调用 computed 观察者的 update 方法，由于设置观察者的 dirty 为 true，表示 computed 属性 getter 函数依赖的 data 值发生变化，但不调用观察者的 get 方法更新 value 值。再调用包含页面更新方法的观察者的 update 方法，在更新页面时读取 computed 属性值，触发重定义的 getter 函数，此时由于 computed 属性的观察者 dirty 为 true，调用该观察者的 get 方法，更新 value 值，并返回，完成页面的渲染。

  <img src="https://image-static.segmentfault.com/172/761/1727619555-5e7d9c4504ec5_fix732">

- dirty  值初始为 true，即首次读取 computed 属性值时，根据 setter 计算属性值，并保存在观察者 value 上，然后设置 dirty 值为 false。之后读取 computed 属性值时，dirty 值为 false，不调用 setter 重新计算值，而是直接返回观察者的 value，也就是上一次计算值。只有当 computed 属性 setter 函数依赖的 data 发生变化时，才设置 dirty 为 true，即下一次读取 computed 函数值调用 setter 重新计算。也就是说，computed 属性依赖的 data 不发生变化时，不会调用 setter 函数重新计算值，而是读取上一次计算值。



## 总结：

- 当组件初始化的时候，computed 和 data 会分别建立各自的响应系统，Observe 遍历 data 中每个属性设置 get/set 数据拦截
- 初始化 computed 会调用 initComputed 函数
  - 注册一个 watcher 实例，并在内实例化一个 Dep 消息订阅器用作后续收集依赖（比如渲染函数的 watcher 或者其它观察该计算属性的 watcher）
  - 调用计算属性时会触发器 Object.defineProperty 的 get 访问器函数
  - 调用 watch.depend() 方法向自身的消息订阅器 dep 的 subs 中添加其它属性的 watcher
  - 调用 watcher 的 evaluate 方法（进而调用 watcher 的 get 方法）让自身成为其它 watcher 的消息订阅器的订阅者，首先把 watcher 赋给 Dep.target，然后执行 getter 求值函数，当访问求值函数里面的属性（比如来自 data丶props 或 其它 computed）时，会同样触发它们的 get 访问器函数从而把该计算属性的 watcher 添加到求值函数中的属性 watcher 的消息订阅器 dep 中，当这些操作完成，最后关闭 Dep.target 赋为 null 并返回求值函数结果
- 当某个属性发生变化，触发 set 拦截函数，然后调用自身消息订阅器 dep 的 notify 方法，遍历当前 dep 中保存所有订阅者 watcher 的 subs 数组，并逐个调用 watcher 的 update 方法，完成响应更新

## computed 计算值为什么还可以依赖另外一个 computed 计算值

其中的原理是，加入计算属性 A 依赖计算属性 B，而计算属性 B 又依赖响应式数据 C，那么最一开始先把计算属性 AB 都转化为 watcher，然后再把计算属性 AB 挂载到 vm 上面的时候，插入了一段 getter，而计算属性 B 的这个 getter 在这个计算属性 B 被读取的时候会把计算属性 A 的 watcher 添加到响应式数据 C 的依赖里面，所以响应式数据 C 在改变的时候会先后导致计算属性 B 和 A 执行 update，从而发生改变。

而其中关键的那段代码就是这段：

```js
function createComputedGetter(key) {
    return function computedGetter() {
        const watcher = vm.computedWatchers[key];
        
        if(watcher) {
            if(watch.dirty) {
                watcher.evaluate();
            }

         	// 这里非常关键
            if(Dep.target) {
                watcher.depend();
            }
            
         	return watcher.value;
        }
    }
}
```

为什么在计算属性 B 的 getter 函数里面会添加计算属性 A 的 watcher呢？这是因为计算属性 B 在求值成功完成后，会自动把 Dep.target 出栈，从而暴露出计算属性 A 的 watcher。代码如下：

```js
class Watcher {
    get() {
        // 这里把自己的 watcher 入栈
        pushTarget(this);
        const value = this.getter();
        // 这里把自己的 watcher 出栈
        popTarget(this);
        this.deps = [...this.newDeps];
        this.newDeps = [];
        return value;
    }
}
```

这就是 pushTarget 和 popTarget 调度 watchers 的魅力之处

**需要注意的点：**

- 在计算属性生成 getter 的时候，不能直接使用 Object.defineProperty，而是使用闭包把 key 值存储了起来
- 为什么不直接使用 defineReative 把计算属性变成响应式的。因为当把计算属性用setter 挂载到 vm 上面的时候，计算属性这里确实变成了一个具体的值，但是如果使用 defineReative 把计算属性变成响应式的话，计算属性会执行自己的依赖，从而和响应式数据的依赖重复了。其实这也是把非数据变成响应式的的一种方法。



# 32.  Vue 中的 watch 实现原理

<img src="https://upload-images.jianshu.io/upload_images/9896962-3705f526761ae703.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp">





## 简述响应式

Vue 会把数据设置响应式，即是设置它的 get 和 set

当数据被读取，get 被触发，然后收集读取它的东西，保存到依赖收集器

当数据被更新，set 被触发，然后通知曾经读取它的东西进行更新

## 监听的数据改变的时候，watch 如何工作

watch 在一开始的时候，会读取一遍监听的数据的值，于是，此时那个数据就收集到 watch 的 watcher 了

然后你给 watch 设置的 handler，watch 会被放入 watcher 的更新函数中

当数据改变时，通知 watch 的 watcher 进行更新，于是你设置的 handler 就被调用了

## 设置 immediate，watch 如何工作

当你设置了 immediate 时，就不需要在数据改变的时候才会触发

而是在初始化 watch 时，在读取了监听的数据的值之后，便立即调用一遍你设置的监听回调，然后传入刚读取的值

## 设置了 deep，watch 如何工作

我们都知道 watch 有一个 deep 选项，是用来深度监听的。什么是深度监听呢？就是当你监听的属性的值是一个对象的时候，如果你没有设置深度监听，当对象内部变化时，你监听的回调是不会被触发的。

在说明这个之前，请大家先了解一下

当你使用 Object.defineProperty 给值是对象的属性设置 set 和 get 的时候

- 如果你直接改变或读取这个属性（直接赋值），可以触发这个属性的设置的 set 和 get
- 如果你改变或读取它内部的属性，get 和 set 不会被触发的

举个例子

```js
var inner = { first: 111 };
var test = { name: inner };

Object.defineProperty(test, "name" {
	get() {
    	console.log("name get被触发");
    	return inner;
	},
    set() {
		console.log("name set被触发")
    }
})

// 访问 test.name 第一次，触发 name 的 get
Object.defineProperty(test.name, "first", {
    get() {
        return console.log("first get被触发");
    },
    set() {
        console.log("first set被触发");
    }
})

var a = test.name;
var b = a.first;
b = a.first;
a.first = 5;
```

<img src="https://mmbiz.qpic.cn/mmbiz_png/HCyqJSXNAiaTnPOwNr3rfCSQOGZyib0QQ9ibG0KwvibswHtlJiaXlE4RYxTGiab81Yibf3GN9ICW2QV78xmqmsGZQe2dw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1">

被看到除了有两次需要访问到 name，必不可少会触发到 name 的 get

之后，当我们独立访问 name 内容的 first 的时，只会触发 first 的 get 函数，而 name 设置的 get 并不会被触发

## 结论

看了上面的例子后，所以当你的 data 属性值是对象，比如下面的 info

```js
data() {
    return {
        info: { name: 1 }
    }
}
```

此时，Vue 在设置响应式数据的时候，遇到值是对象，会递归遍历，把对象内所有的属性都设置为响应式，就是每个属性都设置 get 和 set，于是每个属性都有自己的一个依赖收集器

首先，再次说明，watch 初始化的时候，会先读取一遍监听数据的值

### 没有设置 deep

因为读取了监听的 data 的属性，watch 的 watcher 会收集在这个属性的收集器中

### 设置了 deep

- 因为读取了监听 data 的属性，watch 的 watcher 被收集在这个属性的收集器中
- 在读取 data 属性的时候，发现设置了 deep 而且值是一个对象，回遍历递归这个值，把内部所有属性逐个读取一遍，于是属性和它的对象值内每一个属性都会收集到 watch 的 watcher

于是，无论对象嵌套多深的属性，只要改变了，会通知相应的 watch 的 watcher 会更新，于是你设置的 watch 回调就被触发了

实际证明

证明 watch 的 watcher 深度监听时是否被内部每个属性都收集

我在 Vue 内部给 watch 的 watcher 加了一个属性，标识它是 watch 的 watcher，并且去掉了多余的属性，为了截图短一点

<img src="https://mmbiz.qpic.cn/mmbiz_png/HCyqJSXNAiaTnPOwNr3rfCSQOGZyib0QQ9gibv2D6ic2ulsoUn6zPjpS5d9ibHmvhVL9GtmMaKaHNk0AYicvXECOxib7A/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1">

<img src="https://mmbiz.qpic.cn/mmbiz_png/HCyqJSXNAiaTnPOwNr3rfCSQOGZyib0QQ9RIEDicwXACl5cCibAQrZOBgrNMtqxr4CVSvnqGRepgYLorLbrehDuPZA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1">

<img src="https://mmbiz.qpic.cn/mmbiz_png/HCyqJSXNAiaTnPOwNr3rfCSQOGZyib0QQ98BE7k0EEC64MRJFOadVHevkTZmYK30qcR5mmsiaicXAicrdmFB3ficUvHw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1">

于是我们能看到，parentName 以及 parentName 内部的属性 a 都收集了 watch 的 watcher，以此类推，就算嵌套再深，设置深度监听就可以触发回调了。





# 33. vue和react谈谈区别和选型考虑

## 相同

- 使用 Virtual DOM
- 提供了响应式和组件化的视图组件
- 将注意力集中保持在核心库，伴随于此，有配套

## 不同

- 性能：到目前为止，针对现实情况的测试中，Vue 的性能是优于 React的

- 选型：
  - 如果你希望用（或希望能够用）模板搭建应用，请使用 Vue
  - 如果你喜欢简单和能用就行的东西，请使用 Vue
  - 如果你的应用需要尽可能的小和快，请使用 Vue
  - 如果你计划构建一个大型应用程序，请使用 React
  - 如果你想要一个同时适用于 Web 端和原生 App 的框架，请选择 React
  - 如果你需要最大的生态圈，请使用 React





# 34. Vue 的数据为什么频繁变化但只会更新一次

Vue 在更新 DOM 时是异步执行的，只要侦听到数据变化，Vue 将开启有个队列，并缓存在同一个事件循环中发生的所有数据变更。

如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常是要的。

然后，在下一个事件循环 tick 中，Vue 刷新队列并执行实际（已去重的）工作。Vue 在内部对异步队列尝试原生的 Promise.then，MutationObserver 和 setTimmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替。







# 35. Vue 如何实现多个路由共用一个页面组件

## 多个页面共用同一个组件

**当多个路由共用同一个组件时，切换路由不会触发该组件页面的钩子函数。为了重新触发钩子函数，获取最新数据，有两种方式：**

- 假如父组件下的两个子组件 A丶B需要共用同一个组件，在父组件中，router-view 中添加 key，并保证 key 值具有类似 ID 值得唯一性。这样就能实现，进行相应的子组件路由，会根据相应的 key 值触发相应子组件
- 通过监听路由的变化，来处理数据

## 在 router-veiw 里添加 key 控制

**这里的弊端是如果 router-veiw 里包含其它组件，切换其它组件会让其它组件也重新渲染**

**这里的问题是导致切换路由会闪烁一下，因为切换路由后所有的钩子函数都会重新触发了**

```js
// app.vue
<router-view :key="key" /> // 必须加上 key 属性，让每次进入路由时重新触发钩子函数

computed: {
    key() {
        // 只要保证 key 唯一性就可以，保证不同页面的 key 不相同
        console.log(this.$route.fullPath);
        return this.$route.fullPath
    }
}    

// 在 index.js 文件中，让多个路由共用同一个组件，路径指向同一个组件，保证路由 path 和 name 属性具有唯一性
{
    path: '/role',
    name: "role", // 角色
    meta: {
        requireAuth: true // 表示该路由需要登录验证后才能进入，在切换路径跳转路由之前作判断
    },
    component: () => import("@/view/policy/policy.vue")   
},
{
    path: "/strategy",
    name: "strategy",
    meta: {
        requireAuth: true // 表示该路由需要验证后才能进入 在切换路径跳转之前作判断
    },
    component: () => import("@/veiws/policy/policy.vue")    
}    
```

## 通过监听路由的方法来重新触发钩子函数

**通过监听路由的变化，来重写初始数据**

```js
watch: {
    $route: {
        handler: "resetData"
    }
}
method: {
    resetData: {
        if(this.$route.fullPath === '/strategy') {
           // 在这里获取并处理该路由下所需要的数据
        }
    }
}
```





# 36. React 和 Vue 更新机制的区别

**获取数据更新的手段和更新颗粒度不一样**

- Vue 通过依赖收集，当数据更新时，Vue 明确地知道是哪些数据更新了，每个组件都有自己的渲染 watcher，掌管当前组件的视图更新，所以可以精确地更新对应地组件，所以更新地粒度是组件级别地
- React 会递归地把所有的子组件 re--render 一下，不管是不是更新的数据，此时都是新的。然后通过 diff 算法来决定更新哪部分的视图，所以 React 的更新粒度是预估整体

**对更新数据是否需要渲染页面的处理不一样**

- 只有依赖收集的数据发生更新，Vue 才回去重新渲染页面
- 只要数据有更新（setData丶useState 等手段触发更新），都会去重新渲染页面（可以使用 shouldComponentUpdate / PureComponent 改善）





# 37. 数据绑定与数据流

## 单向数据绑定 vs 双向数据绑定

> 所谓数据绑定，就是指 View 层和 Model 层之间的映射关系

单向数据绑定：Model 的更新会触发 View 的更新，而 View 的更新不会触发 Model 的更新，它们的作用是单向的

双向数据绑定：Model 的更新会触发 View 的更新，View 的更新也会触发 Model 的更新，它们的作用是相互的

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/1738a3b99d0f8356~tplv-t2oaga2asx-watermark.awebp">

**React 采用单向数据绑定**

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/1738a3b99e317253~tplv-t2oaga2asx-watermark.awebp">

当用户访问 View 时，通过触发 Event 进行交互，而在相应 Event Handers 中，会触发相应的 Actions，而 Actions 方法对 View 的 State 进行更新，State 更新后会触发 View 的重新渲染

可以看出，在 React 中，View 层是不能直接修改 State，必须通过相应的 Actions 来进行操作

**单向数据绑定的优缺点：**

优点：所有状态都可以被记录的、跟踪，状态变化通过手动调用触发，源头易追踪

缺点：会有很多类似的样板代码，代码量会相应的上升

**Vue 支持单向数据绑定和双向数据绑定：**

- 单向数据绑定：使用 v-bind 属性绑定、v-on 事件绑定或插值形式 {{data}}
- 双向数据绑定：使用 v-model 指令，用户对 View 的更改会直接同步到 Model

Vue 的双向数据绑定就是指使用 v-model 指令进行数据绑定，而 v-model 本质上是 v-bind 和 v-on 相组合的语法糖，是框架自动帮助我们实现了更新事件，我们完全可以采取单向数据绑定，自己实现类似的双向数据绑定

**双向数据绑定的优缺点：**

优点：在操作表单时使用 v-model 方便简单，可以节省繁琐或重复的 onChange 事件去处理每个表单数据的变化（减少代码量）

缺点：属于暗箱操作，无法更好的跟踪双向绑定的数据的变化

## 单向数据流 VS 双向数据流

> 所谓数据流，就是指的是组件之间的数据流动

**React、Vue 以及 Angular 都是单向数据流**

虽然 Vue 和 Angular 有双向数据绑定，但 Vue 和 Angular 父子组件之间数据传递，仍然遵守单向数据流，即父组件可以向子组件传递 props，但是子组件不能修改父组件传递来的 props，子组件只能通过事件通知父组件进行数据更改。如下图：

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/1738a3b9a12dd8ce~tplv-t2oaga2asx-watermark.awebp">

优点：由于组件数据传递只有唯一的入口和出口，使得程序更直观、更容易理解，有利于程序的维护性

**所谓双向数据流，就是在子组件中可以直接更新父组件的数据（angular 支持双向数据流）**

缺点：由于组件数据变化的来源入口变得可能不止一个，如果缺乏相应的“管理”手段，容易将数据流转弄得絮乱。同时也会增加了出错时 debug 的难度

## 数据流与数据绑定

严格来说，数据流和数据绑定是两个概念，并不是同一个东西。单向数据流也可以支持双向数据绑定，双向数据绑定也可以支持单向数据绑定

简单总结一下前端三大框架的数据流与数据绑定的区别：

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/1738a3b9a230688e~tplv-t2oaga2asx-watermark.awebp">





# 38. Vue.use 源码

**Vue.use() 的作用**

官方文档的解释：安装 Vue.js 插件，如果插件是一个对象，必须提供 install 方法。如果插件是一个函数，他会被作为 install 方法。install 方法调用时候，会将 Vue 作为参数传入。

**Vue.use() 使用场景**

可以在项目中使用 vue.use() 全局注入一个插件，从而不需要在每个组件中 import 插件。例如：不使用 vue.use() 注入插件

```js
const utils = require('./utils');
// 或者
import utils from './utils'
```

使用 vue.use() 注入插件，最典型的案例：

```js
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
```

使用了 vue.use() 注册插件之后就可以在所有的 vue 文件中使用路由：this.$route

**vue.use()源码**

下面切入本文的主题，我们知道了 vue.use() 怎么用还不够

```JS
import { toArray } from '../util/index'

export function initUse(Vue: GlobalAPI) {
  Vue.use = function(plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = [])) {
      if(installedPlugins.indexOf(plugin) > -1) {
        return this;
      }
      
      // additional parameters
      const args = toArray(arguments, 1) {
        if(typeof plugins.install === 'function') {
          plugin.install.apply(plugin, args);
        }else if(typeof plugin === 'function') {
          plugin.apply(null, args);
        }
        installedPlugins.push(plugin);
        return this;
      }
    }
  }
}
```

vue.use() 源码中采用了 flow 的语法。flow 语法，官方解释是：Flow is a static type checker for your JavaScript code. It does a lot of work to make you more productive.Making you code faster.Marking you code faster, smarter, more confidently, and to a bigger scale

简单的意思就是 flow 是 JavaScript 代码的静态类型检查工具

使用 flow 的好处就是：在编译期对 JS 代码变量做类型检查，缩短调试时间，减少因类型错误引起的 bug。我们都知道 JS 是解释执行语言，运行的时候才检查变量的类型，flow 可以在编译阶段就对 JS 进行类型检查

**下面将对 vue.use() 源码进行解读：**

- **首先先判断插件 plugin 是否是对象或者函数**

  ```js
  vue.use = function (plugin: Function | Object);
  ```

- **判断 vue 是否已经注册过这个插件**

  ```js
  installedPlugin.indexOf(plugin) > -1;
  ```

  如果已经注册过，跳出方法

- **取 vue.use 参数**

  ```js
  const args = toArray(arguments, 1);
  ```

- **toArray() 取参数**

  ```js
  export function toArray (list: any, start ?: number): Array<any> {
    start = start || 0;
    let i = list.length - start;
    const res: Array<any> = new Array(i);
  	while(i --) {
      ret[i] = list[i + start]
    } 
  	return ret;
  }
  ```

  let i = list.length - start 意思是 vue.use() 方法传入的参数，除了第一个参数外（第一个参数是插件 plugin），其它参数都存储到一个数组中，并且将 vue 对象插入到参数数组的第一位。最后参数数组就是[vue, arg1, arg2, ...]

- **判断插件是否有 install 方法，如果有就执行 install() 方法。没有就直接把 plugin 当 install 执行**

  ```js
  if(typeof plugin.install === 'function') {
    plugin.install.apply(plugin, args);
  }else if(typeof plugin === 'function') {
    plugin.apply(null, args);
  }
  ```

  plugin.install.apply(plugin, args) 将 install 方法绑定在 plugin 环境中执行，并且传入 args 参数数组进 install 方法。此时 install 方法内的 this 指向 plugin 对象

  plugin.apply(null, args) plugin 内的 this 指向 null

  最后告知 vue 该插件已经注册过 installedPlugins.psh(plugin) 保证每个插件只会注册一次

**总结**

使用 vue.use() 注册插件，插件可以是一个函数，可以是一个带有 install 属性的对象。不管是函数还是 install 方法，第一个参数总是 vue 对象

个人还是喜欢使用将插件的功能方法写在 install 方法里。因为 install 内的 this 指向的是 plugin 对象自身，拓展性更好





# 39. 数据更新了但是页面没有更新

**1. Vue 无法检测实例被创建时不存在于 data 中的 property**

原因：由于 Vue 会在初始化实例时对 property 执行 getter/setter 转化，所以 property 必须在 data 对象上存在才能让 Vue  将它转化为响应式的

场景：

```js
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
</head>

<body>

    <div id="app">
        {{ message }}
    </div>

    <script>

        var app = new Vue({
            el: '#app'
        })
        app.message = '111!' // `vm.message` 不是响应式的

    </script>

</body>
</html>
```

解决方法：

```js
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
</head>

<body>

    <div id="app">
        {{ message }}
    </div>

    <script>

        var app = new Vue({
            el: '#app',
            data: {
              message: 222
            } // 声明为空字符串
        })
        app.message = '111!' 

    </script>

</body>
</html>
```

**2. Vue 无法检测对象 property 的添加或移除**

原因：官方由于 JavaScript（ES5）的限制，Vue.js 不能检测到对象属性的添加或删除。因为 Vue.js 在初始化实例时将属性转化为 getter/setter，所以属性必须在 data 对象上才能让 Vue.js 转换它，才能让它是响应式的。

```js
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
</head>

<body>

    <div id="app">
        {{obj.id}}
    </div>

    <script>

        var app = new Vue({
            el: '#app',
            data: {
                obj : {
                    id: 0001
                }
            }
        })
      
        delete app.obj.id; // 不是响应式的

    </script>

</body>
</html>
```

解决方案：

```js
// 动态添加 - Vue.set
Vue.set(vm.obj, propertyName, newVal);

// 动态添加 - app.$set
app.$set(app.obj, id, 222);

// 动态添加多个
// 代替 Object.assign(this.obj {a: 1, b: 2 });
app.obj = Object.assign({}, app.obj, { a: 1, b: 2 });

// 动态移除 - Vue.delete
Vue.delete(vm.obj, propertName);

// 动态移除 - app.$delete
app.$delete(app.obj, propertName);
```

**3. Vue 不能检测通过数组索引直接修改一个数组项**

原因：官方 - 由于 JavaScript 的限制，Vue 不能检测数组和对象的变化；尤雨溪 - 性能获取和获取用户体验不成正比

场景：

```js
var vm = new Vue({
  data: {
    items: ['a', 'b', 'c']
  }
})
vm.items[1] = 'x'; // 不能是响应式的
```

解决方法：

```js
// Vue.set
Vue.set(vm.items, indexOfItem, newVal);

// vm.$set
vm.$set(vm.items, indexOfItem, newValue);

// Array.prototype.splice
vm.items.splice(indexOfItem, 1, newValue)
```

**拓展：Object.definedProperty() 可以检测数组的变化**

Object.defineProperty()可以检测数组的变化，但对数组新增一个属性（index）不会监测到数据变化，因为无法咨询到新增数组的下标（index），删除一个属性（index）也是

场景：

```hjs
var arr = [1, 2, 3, 4];
arr.forEach(function(item, index) {
	Object.defineProperty(arr, index, {
		set: function(value) {
			console.log('触发 setter');
			item = value;
		},
		get: function() {
			console.log('触发 getter');
			return item;
		}
	})
})

arr[1] = '123'; // 触发 setter
arr[1]; // 触发 getter 返回值为 '123'
arr[5] = 5; // 不会触发
```

**4. Vue 不能监测直接修改数组长度的变化**

原因：官方-由于 JavaScript 的限制，Vue 不能检测数组和对象的变化；尤雨溪-性能代价和获得用户体验不成正比

场景：

```js
var vm = new Vue({
  data: {
    items: ['a', 'b', 'c']
  }
})

vm.items.length = 2; // 不是响应式
```

解决方法：

```js
vm.items.splice(newLength);
```

**5. 在异步更新执行之前操作 DOM 数据不会变化**

原因：Vue 在更新 DOM 时是异步执行的。只要监听到数据变化，Vue 将开启一个队列，并缓冲在同一个事件中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入队列中一次。这种在缓冲中去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际（已去重的）工作。Vue 在内部在异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替

场景：

```js
<div id="example">{{ message }}</div>
```

```js
var vm = new Vue({
  el: "#example",
  data: {
    message: '123'
  }
})
vm.messgae = "new message"; // 更改数据
vm.$el.textContent = 'new message'; // false
vm.$el.style.color = 'red'; // 页面没有变化
```

解决方法：

```js
var vm = new Vue({
  el: "#example",
  data: {
    message: '123'
  }
})
vm.message = 'new message'; // 更改数据
// 使用 Vue.nextTick(call) callback 将在 DOM 更新完成后被调用
Vue.nextTick(function () {
  vm.$el.textContent === 'new message'; // true
  vm.$el.style.color = 'red'; // 文字颜色变成红色
})
```

**拓展：异步更新带来的数据响应的误解**

```js
<!-- 页面显示：我更新啦！ -->
<div id="example">{{ message.text }}</div>
```

```js
var vm = new Vue({
  el: "#example",
  data: {
    message: {}
  }
})

vm.$nextTick(function() {
  this.message = {};
  this.message.text = '我要更新啦！';
})
```

上段代码中，我们在 data 对象中声明了一个 message 空对象，然后在下次 DOM 更新循环结束之后触发的异步回到中，执行了如下两段代码：

```;
this.message = {};
this.message.text = '我更新啦';
```

到这里，模版更新了，页面最后会显示 我更新啦

模版更新了，应该具有响应式特性，如果这么想那么你就已经走入了误区。

一开始我们在 data 对象中只是声明了一个 message 空对象，并不具有 text 属性，所以该 text 属性是不具有响应式特性的

但模版切切实实已经更新了，这又是怎么回事呢？

那是因为 Vue.js 的 DOM 更新是异步的，即当 setter 操作发生后，指令不会立马更新，指令的更新操作会有一个延迟，当延迟更新真正执行的时候，此时 text 属性已经赋值，所以指令更新模版时得到的是新值

> 模版中每个指令/数据绑定都有一个对应的 watcher 对象，在计算过程中它把属性记录为依赖。之后当依赖的 setter 被调用时，会触发 watcher 重新计算，也就会导致它的关联指令更新 DOM

<img src="https://segmentfault.com/img/remote/1460000022772028">

具体流程如下所示：

- 执行 this.message = {}; 时，setter 被调用
- Vue.js 追踪到 message 依赖的 setter 被调用后，会触发 watcher 重新计算
- this.message.text = '我要更新啦！'; 对 text 属性进行赋值
- 异步回调逻辑执行结束之后，就会导致它的关联指令更新 DOM ，指令更新开始执行

所以真正的触发模版更新的操作是 this.message = {}; 这句话引起的，因为触发了 setter，所以单看上述例子，具有响应式特性的数据只有 message 这一层，它的动态添加的属性是不具备的

> 对应上述第二点 - Vue 无法检测对象 property 的添加或移除

**6. 循环嵌套层级太深，视图不更新**

看到网上有些人说数据更新的层级太深，导致数据不更新或者更新缓慢从而导致视图不更新？

由于我没有遇到这种情况，在我试图重现这种场景的情况下，发现并没有上述情况的发生，所以对于这一点不进行过多的描述

针对这种情况有人给出的方案是使用强制更新：

> 如果你发现你自己需要在 Vue 中做一次强制更新，99.9% 的情况，是你在某个地方做错了事

```js
vm.$forceUpdate();
```

**拓展：路由参数变化时，页面不更新（数据不更新）**

拓展一个因为路由参数变化，而导致页面不更新的问题，页面不更新本质上就是数据没有更新

> 原因：路由视图组件引用了相同组件时，当路由参会变化时，会导致组件无法更新，也就是我们常说中的页面无法更新的问题

场景：

```js
<div id="app">
	<ul>
  	<li><router-link to="/homr/foo">Too Foo</router-link></li>
    <li><router-link to="/homr/foo">Too Foo</router-link></li>
    <li><router-link to="/homr/foo">Too Foo</router-link></li>
  </ul>
	<router-view></router-view>
</div>  
```

```js
const Home = {
  template: `<div>{{ message}} </div>`,
  data() {
    return {
      message: this.$route.params.name
    }
  }
}

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: '/home', component: Home
    },
    {
      path: '/home/:name',
      component: Home
    }
  ]
})

new Vue({
  el: "#app",
  router
})
```

上段代码中，我们在路由构建选项 routes 中配置了一个动态路由 '/home/:name'，它们公用一个路由组件 Home，这代表它们复用 RouterView

当进行路由切换时，页面只会渲染第一次路由匹配到的参数，之后再进行路由切换时，message 是没有变化的

解决方法：

- 通过 watch 监听 $route 的变化

  ```appjs
  const Home = {
    template: `<div>{{ message }}</div>`,
    data() {
      return {
        message: this.$route.params.name
      }
    },
    watch: {
      '$route': function() {
        this.message = this.$route.params.name
      }
    }
  }
  
  new Vue({
    el: '#app',
    router
  })
  ```

- 给 <router-view> 绑定 key 属性，这样 Vue 就会认为这是不同的 <route-view>

  > 弊端：如果从 /home 跳转到 /user 等其它路由下，我们是不用担心组件更新问题，所以这个时候 key 属性是多余的

  ````js
  <div id="app">
  	<router-view :key="key"></router-view>
  </div>
  ````

  

  

# 40. Vue 常用指令

**v-once**

> 默认情况下，Vue 事件是可以重复触发的，但是在特定的情况下，我们只想事件执行一次，所以就有了 v-once

```j
<div id="app">
    <input type="text" placeholder="请输入数据" v-model="name">
    <p v-once>{{ name }} <span>我会进行一次渲染</span></p>
    <p>{{ name }} <span>我会进行多次渲染</span></p>
</div>
    
<script>
    new Vue({
        el: "#app",
        data:({
             name:"张三",
        })
    })
</script>
```

**v-cloak**

vue 如果渲染的时候使用的是 {{data}} 进行渲染的话，在网络不好的情况，会显示 {{data}}，这样子用户体验并不好，所以有了 b-cloak 这个指令

```hs'
<style>
    [v-cloak] {
    /* v-cloak 必须配合这个style 进行隐藏 */
        display: none;
    }
</style>

<div id="app">
    <p v-cloak>{{ name }} <span>如果网络差,我则不会显示</span></p>
    <p>{{ name }} <span>无论网络状态如何 ,我都会显示</span></p>
</div>

<script src="vue.js"></script>

<script>
    new Vue({
        el: "#app",
        data: ({
            name: "张三",
        })
    })
</script>
```

**v-text and v-html**

> V-text 等同于 innerText
>
> v-html 等同于 innerHtml

```js
<div id="app">
    <!-- 数据插值 : 把数据插入到指定位置 ,并且不会覆盖原有的内容 -->
    <p>{{name}}</p>
    <p>+++++n{{name}}+++++</p>
    <!-- 数据插值 : 不会解析HMTL标签 -->
    <p>{{span}}</p>
    <!-- v-text 直接渲染数据, 并且会覆盖原有的数据 -->
    <p v-text="name"></p>
    <p v-text="name">++++++++++</p>
    <!-- v-text 不会渲染 HTML 标签 -->
    <p v-text="span"></p>
    <!-- v-html 会覆盖原有数据, 并且可以渲染数据和html标签 -->
    <p v-html="name">+++++++++</p>
    <p v-html="span">+++++++++</p>
</div>
<script>
    new Vue({
        el: "#app",
        data: ({
            name: "张三",
            span: "<span> 我是span标签 </span>"
        })
    })
</script>
```

**v-if and v-else-if and v-else**

```js
<div id="app">
    <!-- v-if 如果为假, 则压根不会创建元素  -->
    <input type="text" v-model="age">
    <!-- v-if 会接收数据模型中的数据 , 判断是否是真 ,为真就显示  -->
    <p v-if="show">我会显示</p>
    <p v-if="hidden">我不会显示</p>
    <p>------</p>
    <!-- v-if 可以接收行内表达式 -->
    <p v-if="age >= 18">成年人</p>
    <p v-if="age < 18">未成年</p>
    <!-- 也可以接收直接传值 -->
    <p v-if="true">我会显示</p>
    <p v-if="false">我会显示</p>
    <!-- v-if 也可以搭配 v-else 和 v-else-if 进行使用  -->
    <!-- v-else-if如果不需要, 也是可以省略的 , 但是需要主要注意的是 ,else必须紧跟if后面 -->
    <input type="text" v-model="abc">
    <p v-if="abc === 'a'">a</p>
    <p v-else-if="abc === 'b'">b</p>
    <p v-else-if="abc === 'c'">c</p>
    <p v-else>not abc</p>
</div>

<script>
    new Vue({
        el: "#app",
        data: ({
            show: true,
            hidden: false,
            age: 18,
            abc: "a"
        })
    })
</script>
```

**v-show**

```js
<div id="app">
    <!-- v-show 和 v-if 特性相同, 而不同之处则是它无论条件是否成立 ,都会创建元素, 控制display,而v-if则会动态创建元素与否 -->
    <p v-show="show">我会显示</p>
    <p v-show="hidden">我不会显示</p>

    <p v-show="true">我会显示</p>
    <p v-show="false">我不会显示</p>

    <input type="text" v-model="age">
    <p v-show="age >= 18">我会显示</p>
    <p v-show="age < 18">我不会显示</p>
</div>

<script>
    new Vue({
        el: "#app",
        data: ({
            show: true,
            hidden: false,
            age: 18
        })
    })
</script>
```

**v-model**

````hs
<div id="app">
    <input placeholder="请输入数据" type="text" v-model="name">
    <p>{{ name }}</p>
</div>


<script>
    new Vue({
        el: "#app",
        data: ({
            name: "张三",
        })
    })
</script>
````

**v-for**

```js
<div id="app">
    <!-- 单属性 -->
    <!-- <li v-for="value in list">{{value}}</li> -->
    <ul>
        <!-- 遍历数组 -->
        <li v-for="(value,index) in listArr">{{index}}---{{value}}</li>
    </ul>
    <ul>
        <!-- 遍历对象 -->
        <li v-for="(value,key) in listObj">{{key}} --- {{value}}</li>
    </ul>
    <ul>
        <!-- 遍历字符 -->
        <li v-for="(value,index) in 'abcdefghijklmn'">{{index}}---{{value}}</li>
    </ul>
    <ul>
        <!-- 遍历数字 -->
        <li v-for="(value,index) in 10">{{index}}---{{value}}</li>
    </ul>
</div>


<!-- v-for 相当于 js 中的 for in 循环 -->
<!-- v-for 可以循环遍历   数组 / 对象 / 字符 / 数字 -->
<script>
    new Vue({
        el: "#app",
        data: ({
            listArr: ["张三", "李四", "王五", "赵六"],
            listObj: {
                name: "张三",
                age: "18",
                sex: "男"
            }
        })
    })
</script>
```

**v-bind**

````js
<div id="app">
    <!-- value 绑定 -->
    <input type="text" v-bind:value="name">
    <input :value="name" type="text">
    <input :value="age + 10 " type="text">
</div>
<!-- v-bind 可以给元素的属性动态绑定数据 -->
<!-- v-bind 取值特点: 只要是一个合法的 js 表达式即可 -->
<!-- v-bind 可以简写为   :    -->
<script>
    new Vue({
        el: "#app",
        data: ({
            name: "张三",
            age: 18,
        })
    })
</script>
````







# 41. Flux、Vuex、MobX 和 Redux各自的特点和区别

## Flux

Flux 是一种架构思想，类似于 MVC、MVVM 等

**Flux 的组成**

- **View：**视图层
- **Action：**动作，即数据改变的消息对象（可通过事件触发、测试用例触发等）
  - Store 的改变只能通过 Action
  - 具体 Action 的处理逻辑一般放在 Store 里
  - Action 对象包含 type（类型）与 payload（传递参数）

- **Dispatcher：**派发器，接受 Actions，发给所有的 Store
- **Store：**数据层，存放应用状态与更新状态的方法，一旦发生变动，就提醒 View 更新页面

<img src="https://pic1.zhimg.com/80/v2-79ed4a3780c622f8f4b3656f6903b578_720w.jpg">

注意：Action 仅仅是改变 Store 的一个动作，一般包含该动作的类型、传递的数据

**Flux 的特点：**

- **单向数据流：**视图事件或者外部测试用例发出 Action，经由 Dispatcher 派发给 Store，Store 会触发相应的方法更新数据、更新视图
- **Store 可以有多个**
- **Store 不仅存放数据，还封装了处理数据的方法**

## Redux

**Redux 的组成**

- **Store：**存储应用 state 以及用于触发 state 更新的 dispatch 方法等，整个应用仅有单一的 Store。Store 中提供了几个 API：
  - **store.getState()：**获取当前的 state
  - **store.dispatch(action)：**用于 view 发出 action
  - **store.subscribe(listener)：**设置监听函数，一旦 state 变化则执行该函数（若把视图更新函数作为 listener 传入，则可触发视图自动渲染）
- **Action：**同 Flux，Action 是用于更新 state 的消息对象，由 view 发出
  - 有专门生成 Action 的 Action Creator
- **Reducer：**是同一个改变 state 的纯函数（对于相同的参数返回相同的返回结果，不修改参数，不依赖外部变量），即通过应用状态与 Action 推导出新的 state:(previousState, action) => newState。Reducer 返回一个新的 state

<img src="https://pic4.zhimg.com/80/v2-e4537d38f50a3f42be2e432262dffa77_720w.jpg">

**Redux 的特点**

- **单向数据流：**View 发出 Action(store.dispatch(action))，Store 调用 Reducer 计算出新的 state，若 state 发生变化，则调用监听函数重新渲染 View（store.subscrible(render）
- **单一数据源，只有一个 Store**
- State 是只读，每次状态更新之后只能返回一个新的 state
- 没有 Dispatcher，而是在 Store 中集成了 dispatch 方法，store.dispatch() 是 View 发出 Action 的唯一途径

**Middleware**

Middleware 即中间件，在 Redux 中应用于异步数据流

Redux 的 Middleware 是对 store.dispatch() 进行了封装之后的方法，可以使 dispatch 传递 action 以外的函数或者 promise；通过 applyMiddleware 方法应用中间件。（middleware 链中的最后一个 middleware 开始 dispatch action 时，这个 action 必须是一个普通对象）

常用库：redux-action、redux-thunk、redux-promise

```JS
const store = createStore(
	reducer,
  // 依次执行
  applyMiddleware(thunk, promise, logger)
)
```

## Vuex

**Vuex 是 vue.js 的状态管理模式**

**Vuex 的核心概念**

- **Store：**Vuex 采用单一状态树，每个应用仅有 Store 实例，在该实例下包含了 state、actions、mutations、getter、modules
- **State：**Vuex 为单一数据源
  - 可以通过 mapState 辅助函数将 state 作为计算属性访问，或者将通过 Store 将 state 注入全局之后使用 this.$store.state 访问
  - State 更新视图是通过 vue 的双向绑定机制实现的
- **Getter：**Getter 的作用与 filters 有一些相似，可以将 State 进行过滤后输出
- **Mutation：**Mutation 是 vex 中改变 State 的唯一途径（严格模式下），并且只能是同步操作。Vuex 中通过 store.commit() 调用 Mutation
- Action：一些对 State 的异步操作可以放在 Action 中，并通过在 Action 提交 Mutation 变更状态
  - Action 通过 store.dispatch() 方法触发
  - 可以通过 mapActions 辅助函数将 vue 组件的 methods 映射成 store.dispatch 调用（需要先在根节点注入 store）
- Module：当 Store 对象过于庞大时，可根据具体的业务需求分为多个 Module，每个 Module 都具有自己的 state、mutation、action、getter

<img src="https://pic1.zhimg.com/80/v2-3d69811be9fee4d3989d204bf25ab430_720w.jpg">

**Vuex 的特点：**

- 单向数据流：View 通过 store.dispatch() 调用 Action，在 Action 执行完异步操作之后通过 store.commit() 调用 Mutation 更新 State，通过 vue 的响应式机制进行视图更新
- 单一数据源：和 Redux 一样全局只有一种 Store 实例
- 可直接对 State 进行修改

## MobX

MobX 背后的哲学是：任何源自应用状态的东西都应该自动地获得

意思就是，当状态改变时，所有应用到状态的地方都会自动更新

**MobX 的核心概念**

- State：驱动应用的数据
- Computed values：计算值，如果你想创建一个基于当前状态的值时，请使用 computed
- Reactions：反应，用于改变 State
- 依赖收集（autoRun）：MobX 中的数据以来基于观察者模式，通过 autoRun 方法添加观察者

<img src="https://pic4.zhimg.com/v2-9618e7fdcca4b6579ae19e3c1e8a6837_r.jpg">

举个例子：

```js
const obj = observable({
  a: 1,
  b: 2
})

autoRun((obj) => {
  console.log(obj.a);
})

obj.b = 3; // 什么都没有发生
obj.a = 2; // observe 函数的回调触发了 控制台输出：2
```

**MobX 的特点：**

- 数据流流动不自然，只有用到的数据才会引发绑定，局部精确更新（细粒度控制）
- 没有时间回溯能力，因为数据只有一份引用
- 基于面向对象
- 往往是多个 Store
- 代码侵入性小
- 简单可拓展
- 大型项目使用 MobX 会使得代码难以维护

**总结：**

- Flux、Redux、Vuex 均为单向数据流
- Redux 和 Vuex 是基于 Flux 的，Redux 较为泛用，Vuex 只能用于 vuex
- Flux 与 MobX 适用于大型项目的状态管理，MobX 在大型项目中应用会使代码可维护性变差
- Redux 中引入了中间件，主要解决异步带来的副作用，可通过约定完成许多复杂工作
- MobX 是状态管理库中代码倾入性最小的之一，具有颗粒度控制、简单可拓展等优势，但是没有时间回溯能力，一般适用于中小型项目中





# 42. React、Vue 和 JQuery在什么场景下怎么选型

## Vue

**1. 响应式**

响应式的系统可谓相当方便，也就是基于是数据可变的，通过对每一个属性建立 watcher 来监听，当属性变化的生活，响应式的更新对应的虚拟 DOM，响应式的更新对应的虚拟 DOM。

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/15/172b85fbb1fd1931~tplv-t2oaga2asx-watermark.awebp">

**2. 模版语法**

在 vue 中，我们就像在写 HTML 一样自由畅快，这就得力于 vue 的模版预防

```js
<p>{{ message }}</p>
```

首先我们说的 vue 的模版其实不 html，那么既然不是 html它一定是被转换成了一个 JS 代码，就是所谓的模版编译，在 vue 中使用的就是 vue-template-compiler 这个模版编译工具，那这个工具做了什么？其实就是将 Vue 2.0 模版预编译为渲染函数（template => ast => render）

```js
//模板代码
const compiler = require('vue-template-compiler')
const result = compiler.compile(`
  <div id="test">
    <div>
      <p>This is my vue render test</p>
    </div>
    <p>my name is {{myName}}</p>
  </div>`
)

console.log(result)
```

```js
{
//编译结果
  ast: {
    type: 1,
    tag: 'div',
    attrsList: [ [Object] ],
    attrsMap: { id: 'test' },
    rawAttrsMap: {},
    parent: undefined,
    children: [ [Object], [Object], [Object] ],
    plain: false,
    attrs: [ [Object] ],
    static: false,
    staticRoot: false
  },
  render: `with(this){return _c('div',{attrs:{"id":"test"}},[
        _m(0),          // 上述提到的静态子树，索引为0 <div><p>This is my vue render test</p></div>
        _v(" "),        // 空白节点 </div> <p> 之间的换行内容
        _c('p',[_v("my name is "+_s(myName))])  // <p>my name is {{myName}}</p>
    ])}`,
  staticRenderFns: [
    `with(this){return _c('div',[_c('p',[_v("This is my vue render test")])])}`
  ],
  errors: [],
  tips: []
}
```

然后我们执行这个 render 函数，就会返回一个 vnode，接下来就是我们熟悉的 diff 算法到更新视图

**3. 实现 MVVM**

实现了 MVVM 我至少认为这是一个福音，用数据去驱动视图，简化繁琐的操作 DOM，更关注与业务逻辑，这样就能节省开发时间，何写出易于维护的代码，那么什么叫 MVVM 呢？

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/15/172b87f740ea01d8~tplv-t2oaga2asx-watermark.awebp">

viewmodel ，在 vue 中 viewmodel 其实就是我们的方法，我们的事件等等，都是这一层，这一层的操作帮助改变数据或者改变视图，起到承上启下的作用，也实现了 vue 非常经典的数据双向绑定

**4. 使用好友，上手简单**

这是 vue 最为亮眼的有点，比起 react 的 jsx，比起 angular 的 rxjs、以及各种依赖注入，vue 的语法风格和使用 api 相当友好，社区也都有一些相对固定的方案，当然还有一点比较幸福的是 vue 的性能优化做得相当到位，不用我们手动优化，不用像 react 那样父组件更新 render 子组件也要跟新。

**5. 弱化性能优化，用户只需关注逻辑**

相比于 react 和 angular vue 在按照模版格式开发时就没有太多限制，得益于响应式系统，也不用去做相对应的性能优化，由于 vue 内部的模版语法，能在开发环境下编译，这样就能在编译的生活去做一些性能优化比如，在这段 vue 我们明确知道第二个 name 是变量这样在内部就会有针对性的优化

```JS
<template>
    <ul>
        <li>0</li>
        <li>{{ name }}</li>
        <li>2</li>
        <li>3</li>
    </ul>
</template>
```

而在 react 中，由于 jsx 的写法灵活，不确定性多，所以在编译时就无法去做性能优化，而性能优化放到开发者身上了

```JS
<ul>{
    data.map((name, i) => <li>{i !== 1 ? i : name}</li>)
}</ul>
```

## react

**1. 不可变值的设计思想，也是函数式编程的实践**

我们知道，在 react 中性能优化的权利交给了开发者，所以，在默认情况下

## 三大框架的联系：

**1. 组件化**

三大框架中，都是提倡组件开发的框架，所以当你在开发 vue 的项目时，具备组件化的思想，在平常开发中能够有意识的去抽离展示型组件和容器型组件，那么在开发 react 和 angular 时，你只会得心应手，不会处处为难。

**2. 都是数据驱动视图**

三大框架，都是属于 MVVM 框架，数据驱动视图的思想始终贯穿，所以我们在开发时，只需要关注数据变化即可，虽然使用方式不尽相同，react 属于函数式，angular 和 vue 属于声明式编程，但是数据驱动的思想不变，比如 react 使用 setState 赋值，而 vue 和 angular 使用显示直接赋值它们最后的目的都是改值，从而触发页面更新。

**3. 共同的开发套路**

在三大框架中，由于都遵循组件话思想，所以都有着相同的开发套路，只是使用方式略有差别，比如都有父子组件传递、都有父子组件传递、都有数据管理框架、都有前端路由、都有插槽，只不过在 angular 中叫做投影组件，在 react 中叫做组合，都能实现一些所谓的高阶函数。

## 区别

**1. 模版 vs JSX**

React 与 Vue、angular 最大的不同是模版的编写。Vue 和 angular 鼓励你写近似常规 HTML 的模版。写起来很接近标准 HTML 元素，只是多了一些属性。而 react 则崇尚 all in js 所以独创 jsx 的编写风格，但是它们本质上都是一个语法糖，编译之后都是一个可执行的函数

**2. Virtual DOM VS Incremental DOM**

在底层渲染方面，vue 和 react 都使用的虚拟 DOM，而 angular 却没有使用，它使用的是 incremental DOM

**3. 函数式编程 声明式编程**

在 react 不可变值贯穿整个框架，如果你要改变数据，那么必须调用 api 去改，这就是函数式编程的思想，而在 vue 和 angular 中，声明式编程的思想也深入人心，即方便有快捷。这种直接赋值的方式，和用 API 赋值的方式，其实只是用法不同而已，本质还是数据驱动。

**4. 社区复杂度**

在 angular 和 vue 中，几乎给你想要的全部给你了，而 react 追求的更多的是自力更生，所以有选择困难症的人才会如此的纠结

**5. 入门难度**

angular 工程化最好的框架，也是由于拥抱了 rxjs 和 ts

react 上手很比较简单，尤其是 16 引入 hooks 之后，号称 API 终结者，但是由于社区太过于活跃各种新东西层出不穷，中文文档晦涩难懂，导致相当于 vue 上手也有难度

vue 由于是中国人写的，有着完善的中文文档和稳定的社区，并且有着亲切的模版语法，应当说是入门是最简单的













### Vue的整个实现原理

1. vuex数据流动过程


前端SEO 

Vue 自定义指令

Taro 适配 存储 兼容性 基础库 三套登录方案 取舍

iOS七层

Taro 怎么处理 图片资源。统一扔到服务器？

小程序有原生的map 移动端没有 怎么处理？

小程序双向数据绑定 生命周期

递归 冒泡

html 新特性

冒泡

正则

查找

小程序双向数据绑定是怎么实现的

