**设计模式**： 通常在我们解决问题的时候，很多时候不是只有一种方式，我们通常有多种方式来解决；但是肯定会有一种通用且高效的解决方案，这种解决方案在软件开发中我们称之为设计模式；设计模式并不是一种固定的公式，而是一种思想，是一种解决问题的思路；恰当的使用设计模式，可以实现更好的代码重用性丶可读性丶可维护性。

**设计原则**：通常在做很多事情的时候，都会有一定的规范制约；在软件开发的时候，我们可以将设计原则视为一种开发规范，但不是一定会要遵守的，只是不遵守的话，代码后期的维护和复用都会变得很糟糕；遵守设计原则可以帮助我们写出**高内聚丶低耦合**的代码，当然代码的**复用性丶健壮性丶可维护性**也会变得更好。

# 设计模式六大原则

- **`单一职责原则`：** 一个程序或一个类或一个方法只做好一件事情，如果功能过于复杂，我们就拆分开，每个方法保持独立，减少耦合度。
- **`开放封闭原则`：** 对拓展开发，对修改封闭；增加需求时，拓展新代码，而非修改已有代码
- **`里氏置换原则`：** 子类能覆盖父类，父类能出现的地方子类就能出现
- **`接口独立原则`：** 保持接口的单一独立，避免出现胖接口
- **`依赖倒置原则`：** 编程依赖抽象接口，不要依赖具体实现，使用方只关注接口而不关注具体类的实现





# 设计模式的分类

- 创建性模式
  - 工厂方法模式
  - 抽象工厂模式
  - 单例模式/单体模式
  - 创建者模式
  - 原型模式
- 结构型模式
  - 适配型模式
  - 装饰者模式
  - 代理模式
  - 外观模式
  - 桥接模式
  - 组合模式
  - 享元模式
- 行为模式   
  - 策略模式
  - 模板方法模型
  - 观察者模式
  - 迭代子模式
  - 责任链模式
  - 命令模式
  - 备忘录模式
  - 状态模式
  - 访问者模式
  - 中介者模式
  - 解释器模式
- 并发型模式
- 线程池模式 


- 观察者

 



# 1. 观察者模式

**发布订阅模式又叫观察者模式，它定义了对象间的一种一对多的关系，让多个观察者对象同时监听某一个主题对象，当一个对象发生改变时，所有依赖它的对象都得到通知**

## 优点：

- 支持简单的广播通信，当对象状态发生改变时，会自动通知已经订阅过的对象
- 发布者和订阅者耦合性降低

## 缺点:

- 创建订阅者需要消耗一定的时间和内存，订阅消息后，也许不会有发布，而订阅者始终存在内存中。  
- 虽然可以弱化对象之间的联系，如果过度使用的话，反而使代码不好理解及代码不好维护

## 应用场景：

- 关注公众号
- 订阅杂志
- Vue 中的双向数据绑定

源码实现：
```js
function Event() {
    // 存储不同的事件类型对应不同的处理函数，保证后续emmit可以执行
    this.cache = {};
}
Event.prototype.on = function(type, handle) {
    if(!this.cache[type]) {
        this.cache[type] = [handle];
    }else {
        this.cache[type].push(handle);
    }
}
Event.prototype.emmit = function() {
    // 没有保证参数是多少个 就用arguments
    var type = arguments[0];
    var arg = [].slice.call(arguments, 1);
    for(var i = 0; i < this.cache[type].length; i++) {
        this.cache[type][i].apply(this, arg);
    }
}
Event.prototype.empty = function(type) {
    this.cache[type] = [];
}
Event.prototype.remove = function(type, handle) {
    this.cache[type] = this.cache[type].filter(function(ele) {
        return ele != handle;
    }) 
}
Event.prototype.once = function(type, handle) {
    if(!this.cache[type]) {
        this.cache[type] = [];
    }
    // 做标记
    handle.tag = 'true';
    this.cache[type].push(handle);
}


// 测试
function deal1(time) {
    console.log('overtime1:' + time);
}
function deal2(time) {
    console.log('overtime2:' + time);
}
var oE = new Event();
oE.on('over', deal1);
oE.on('over', deal2);
oE.emmit('over', '2018-9-25');
oE.remove('over', deal2);
oE.emmit('over', 'seconde-1-1');
```






# 2. 单例模式/单体模式
**单例模式限制一个类只有一个实例化对象，节省资源和开销，因为浏览器的资源时有限的**

## 优点：

- 适用于单一对象，只生成一个对象实例，避免频繁创建和销毁实例，减少内存占用

## 缺点：

- 不适用于动态拓展对象，或需创建多个相似对象的场景

## 应用场景：

- 引用第三方库（多次引用只会使用一个库引用，如jQuery）
- 弹窗丶登录框丶信息提示框
- 购物车（一个用户只有一个购物车）
- 全部状态管理store(Vuex/Redux)

## 源码实现：

```js
// 源码实现
var jsUtil = {
    getSingle: function(func) {
        var result;
        return function() {
            if(!result) {
                result = func.apply(this, arguments);
            }
            return result;
        }
    }
}


// 应用弹窗
var createAlert = function(text) {
    var oDiv = document.createElement('div');
    oDiv.style.display = 'none';
    oDiv.innerText = text;
    document.body.appendChild(oDiv);
    return oDiv;
}
var singleAlert = jsUtil.getSingle(createAlert);
oBtn.onclick = function () {
    var oDiv = singleAlert('haha');
    oDiv.style.display = 'block';
}
```






# 3. 策略模式
**策略模式，用一个对象来管理一堆算法，这个算法就是对不同情况做出相应的反应，这些算法对这些对象进行集中的管理，这些算法还可以相互进行替换，这个对象我写完之后我可以在不同的对象下使用它，复用，继承。**

## 优点：

- 采用组合丶委托和多态等技术和思想，有效避免很多 if 条件语句
- 策略模式提供了开放-封闭原则，将书法封装在独立 strategy 中，使代码更容易理解丶切换和拓展
- 策略模式的代码可以复用，从而避免很多地方的复制粘贴

## 缺点：

- 在策略模式中，我们会增加很多策略类丶策略对象
- 要使用策略模式，我们必须了解所有的strategy丶必须了解各个 stragegy 之间的不同点，才能选择一个适合的 strategy

## 应用场景：

- 表单验证
```js
// html
<div>
    用户名：<input type="text" id="userDom" name="username">
    <span id="showUser"></span>
    密码：<input type="password" id="psDom" name="code">
    <span id="showPs"></span>
    邮箱：<input type="text" id="emDom" name="email">
    <span id="showEm"></span>
    <button id="submit">提交</button>
</div>


// js
function Validator() {
    this.cache = [];
    this.warnDom = [];
}
Validator.prototype.strategies = {
    isNonEmpty: function(value, errorMsg) {
        if(value == '') {
            return errorMsg;
        }
        return true;
    },
    maxLength: function(value, length, errorMsg) {
        if(value != '' && value.length > length) {
            return errorMsg;
        }
        return true;
    },
    minLength: function(value, length, errorMsg) {
        if(value != '' && value.length < length) {
            return errorMsg;
        }
        return true;
    }
}

// 添加校验规则
// 不是直接去校验 而是缓存 把信息缓存在这 warnDom cache
Validator.prototype.add = function(dom, showDom, strategyArr) { // 不是直接去校验 而是缓存
    var self = this;
    this.warnDom.push(showDom);
    strategyArr.forEach(function(ele, index) {
        self.cache.push(function() {
            var arr = ele.strategy.split(':');
            var type = arr.shift();
            arr.unshift(dom.value); 
            arr.push(ele.errorMsg);
            var msg = self.strategies[type].apply(self, arr);

            if(msg != true) {
                showDom.innerText = msg;
            }

            return msg;
        })
    })
}

// 开始校验
Validator.prototype.start = function() {
    // 标记最后是否能符合规则
    var flag = true;
    this.warnDom.forEach(function(ele) {
        ele.innerText = '';
    })
    this.cache.forEach(function(ele) {
        if(ele() != true) {
            flag = false;
        }
    })
    console.log(this.warnDom, this.cache);
    return flag;
}

// 拓展方法
Validator.prototype.extend = function(config) {
    for(var prop in config) {
        Validator.prototype.strategies[prop] = config[prop];
    }
}




var validator = new Validator();
validator.extend({
    isEmail: function(val, errorMsg) {
        if(value != '' && value.indexOf('@') == -1) {
            return errorMsg;
        }
        return true;
    },
    isPhone: function(val, errorMsg) {
        if(value != '' && value.length != 11) {
            return errorMsg;
        }
        return true;
    }
})
// 代理模式
var ProxyRequest = (function() {
    // 1.校验内容dom 2.错误信息心事dom 3. 校验规则
    validator.add(userDom, showUser, [{strategy: 'isNonEmpty', errorMsg: '用户名不为空'}, {strategy: 'maxLength:4', errorMsg: '用户名长度不能超过4'}]);
    validator.add(psDom, showPs, [{strategy: 'isNonEmpty', errorMsg: '密码不能为空'}, {strategy: 'minLength:6', errorMsg: '密码长度不能小于6'}]);
    validator.add(emDom, showEm, [{strategy: 'isNonEmpty', errorMsg: '邮箱不能为空'}, {strategy: 'isEmail', errorMsg: '邮箱格式不正确'}]);
    return function() {
        if(validator.start() == true) {
            Request();
        }
    }
})();
submit.onclick = function() {
    ProxyRequest();
}
```






# 4. 代理模式
**为一个对象提供一个代理以控制对这个对象的访问**

## 代理分类

- 虚拟代理：
  - 虚拟代理是把一些开销很大的对象，延迟到真正需要它的时候才去创建执行
  - 图片加载 文件上传
- 安全代理：
  - 控制真实对象的访问权限
  - 登录操作后才能看全功能 前端校验
- 远程代理：
  - 一个对象将不同空间的对象进行局部代理
  - 监控多个对象的状态 总机控制分店
- 智能代理：
  - 调用对象代理处理另外一些事情如垃圾回收机制增加额外的服务
  - 提供额外的其它服务 火车站代售站
- 缓存代理：为开销大的运算结果提供缓存  

## 优点

- 可拦截和监听外部对本地对象的访问
- 复杂运算前可以进行校验和资源管理
- 对象职能粒度细分，函数功能复杂度降低，符合“单一职责原则”
- 依托代理，可额外添加拓展功能，而不修改本地对象，符合“开发-封闭原则”

## 缺点

- 额外代理对象的创建，增加部分内存开销
- 处理请求速度可能有差别，非直接访问存在开销，但“虚拟代理”以及“缓存代理”均能提升性能

## 应用场景

### 图片预加载

如果直接给某个 img 标签节点设置 src 属性，由于图片过大或者网络不佳的时候，图片的位置往往会有段时间会是一片空白的。常见的做法是先用一张 loading 图片占位，然后用异步的方式加载图片，等图片加载好了再把它填充到 img 节点里，这种场景适合使用虚拟代理。

```js
var MyImage = function(id) {
    var oImg = new Image();
    this.setSrc = function(src) {
        oImg.src = src;
    }
    document.getElementById(id).appendChild(oImg);
}
var ProxyImage = (function() {
    var oMyImg = new MyImage('demo');
    
    var oNewImage = new Image();
    oNewImage.onload = function() {
        oMyImg.setSrc(oNewImage.src);
    }
    
    return function(src) {
        oMyImg.setSrc('./logo.jpg');
        oNewImage.src = src;
    }
})();

// 测试
ProxyImage('https://images.pexels.com/photos/4427027/pexels-photo-4427027.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500');
```


### 缓存代理 文件上传
```js
// css
div {
    width: 100px;
    height: 100px;
    border: 1px solid black;
}

// html
<div id="show">duyi</div>
<button type="bg">add greenBg</button>
<button type="cl">add blueColor</button>
<button type="fs">add fontSize</button>
<button type="fw">add fontWeight</button>
<button type="op">add opcacity</button>

// js
var oDiv = document.getElementById('show');
var oButtonArray = document.getElementsByTagName('button');

function changeStyle(dom, typeArr) {    
    var typeObj = {
        bg: ['backgroundColor', 'green'],
        cl: ['color', 'blue'],
        fs: ['fontSize', '24px'],
        fw: ['fontWeight', 'bold'],
        op: ['opacity', '0.3']
    }

    if(typeArr.constructor == Array) {
        typeArr.forEach(function(ele) {
            dom.style[typeObj[ele][0]] = typeObj[ele][1];
        })
    }else {
        dom.style[typeObj[typeArr][0]] = typeObj[typeArr][1];
    }
}

// 代理
var ProxyRequest = function(func) {
    var cache = []; // 缓存
    var timer = null;
    return function() { 
        cache.push(this.getAttribute('type'))
        clearTimeout(timer);
        timer = setTimeout(function() { 
            func(oDiv, cache);
            cache = [];           
        }, 2000);
    }
}
var realChangeStyle = ProxyRequest(changeStyle);
for(var i = 0; i < oButtonArray.length; i++) {
    oButtonArray[i].onclick = realChangeStyle;
} 
```

**把之前写的带有缓存的请求函数进行改写**






# 5. 工厂模式
## 定义

- 工厂模式定义创建对象的接口，但是让子类去真正实例化。也就是工厂方法将类的的实例化延迟到子类
- 工厂模式是用来创建对象的一种最常用的设计模式。我们不暴露创建对象的具体逻辑，而是将逻辑封装在一个函数中，那么这个函数就可以被视为一个工厂。工厂模式根据抽象程度的不同可以分为  `简单工厂`丶`工厂方法` 和 `抽象工厂`。

## 优点：

**能解决多个相似的问题**

## 缺点：

**不能知道对象识别的问题**

## 应用场景：

- 处理大量具有相同属性的小对象
- 对象的构建十分复杂，需要依赖具体环境创建不同实例

### 简单工厂模式

在我们的生活中很多时候就有这样的场景，像在网站中有的页面是需要账号等级来决定是否有流浪权限的；账户等级越高可浏览的就越多，反之越少；
所以，简单工厂只能作用于创建的对象数量较少，对象的创建逻辑不复杂的时使用

```js
function factory(role) {
    function user(opt) {
        this.name = opt.name;
        this.viewPage = opt.viewPage;
    }
    switch (role) {
        case "superAdmin":
            return new user({ name: "superAdmin", viewPage: ["首页", "发现页", "通讯录", "应用数据", "权限管理"] });
            break;
        case "admin":
            return new user({ name: "admin", viewPage: ["首页", "发现页", "通讯录", "应用数据"] });

        case "normal":
            return new user({ name: "normal", viewPage: ["首页", "发现页", "通讯录"] })
    }
}
let superAdmin = factory("superAdmin");
console.log(superAdmin);
let admin = factory("admin");
console.log(admin);
let normal = factory("normal");
console.log(normal);


// ES6写法 
class factory {
    constructor(opt) {
        this.name = opt.name;
        this.viewPage = opt.viewPage;
    }
    static getIntance(role) {
        switch (role) {
            case "superAdmin":
                return new factory({name: "superAdmin", viewPage: ["首页", "发现页", "通讯录", "应用数据", "权限管理"]});
                break;
            case "admin":
                return new factory({name: "admin", viewPage: ["首页", "发现页", "通讯录", "应用数据"]});
                break;
            case "normal":
                return new factory({name: "normal", viewPage: ["首页", "发现页", "通讯录"]});
                break;
        }
    }
}
let superAdmin = factory.getIntance("superAdmin");
console.log(superAdmin);
let admin = factory.getIntance("admin");
console.log(admin);
let normal = factory.getIntance("normal");
console.log(normal);
```






# 6. 适配者模式
**适配者模式：将一个类（对象）的接口（方法或属性）转换成客户希望的另外一个接口（方法或属性），使得原本由于接口不兼容而不能一起工作的那些类（对象）可以正常协作。**

## 模式特点:

- 新包装对象（适配器对象）实现对原对象接口的访问（接口名可不同）
- 适配器对象不对请求对象做预处理，直接传入原对象接口处理
- 适配器对象对接口统一，外部调用者可统一接口调用多对象方法

## 优缺点:

- 优点：兼容性：保证外部可统一接口调用
- 缺点：额外对象的创建，非直接调用，存在一定的开销（且不像代理模式在某些功能上可实现性能优化）

## 适用场景:

### 跨浏览器兼容

```js
function on(target, event, callback) {
    if (target.addEventListener) {
        // 标准的事件监听
        target.addEventListener(event, callback);
    } else if (target.attachEvent) {
        // IE低版本事件监听
        target.attachEvent(event, callback);
    } else {
        // 低版本浏览器事件监听
        target[`on${event}`] = callback;
    }
}
```
### 整合第三方 SDK

```js
// 需要完成一个集成多个第三方地图SDK进行地图渲染功能
const googleMap = {
    show() {
        console.log("开始使用谷歌地图渲染");
    }
}
const baiduMap = {
    show() {
        console.log("开始使用百度地图渲染");
    }
}
const gaodeMap = {
    render() {
        console.log("开始使用高德地图渲染");
    }
}
// 适配器 
const gaodeMapAdapater = {
    show() {
        return gaodeMap.render();
    }
}
// renderMap方法是提供给使用来调用
const renderMap = (map) => {
    if (map.show instanceof Function) {
        map.show();
    }
}
renderMap(googleMap);
renderMap(baiduMap);
renderMap(gaodeMapAdapater);
```
### 新老接口兼容丶数据格式的变更

```js
// 这是之前上传资源，后台给我们返回的文件信息
const responseUpLoadFile = {
    startTime: '',
    file: {
        size: '100kb',
        type: 'text',
        url: '',
        name: ''
    },
    id: ''
}

// 如果某天后台突然说某些原因上传文件返回格式有变动了
const changeResUploadFile = {
    size: '100KB',
    type: 'text',
    url: '',
    name: '',
    startTime: '',
    id: ''
}

// 由于我们之前使用旧格式数据做了很多业务逻辑，这个时候不能其改动，容易导致bug而且需求进行回归测试，采用适配者模式
const responseUploadFileAdater = () => {
    // 在这对新的数据进行拼接转化
}
```





# 7. 迭代器模式
**迭代器模式主要的思想就是在不暴露对象内部结构的同时可以按照一定顺序访问对象内部的元素**

## 模式的特点:

- 为遍历不同数据结构的“集合”提供统一的接口
- 能遍历访问“集合”数据中的项，不关心项的数据结构

## 应用场景:

- 其实JavaScript中的很多方法都运用了迭代器的思想，比如数组的的forEach丶every丶find丶some等等，  这些操作极大的简化我们的逻辑操作

- **实现一个数组迭代器**
```js
let eachArr = function(arr, fn) {
    let i = 0;
    len = arr.length;
    for(; i < len; i++) {
        if(fn.call(arr[i], i, arr[i]) === false) {
            break;
        }
    }
}
eachArr([1, 2, 3, 4], (index, value) => { console.log(index, value) })
```
- **实现一个对象迭代器**
```js
let eachObj = function(obj, fn) {
    for(let key in obj) {
        if(fn.call(obj[key], key, obj[key]) === false) {
            break;
        }
    }
}
eachObj({a: 11, b: 12}, (key, value) => { console.log(key, value) });
```
- **路径查找**
```js
let findObjAttr = function(obj, key) {
    if(!obj || !key) {
        return undefined;
    }
    let result = obj;
    key = key.split('.');
    for(let i = 1, len < key.length; i < len; i++) {
        if(result[key[i]] !== undefined) {
            result = result[key[i]];
        }else {
            return undefined;
        }
    }
    return result;
}
let a = {b: {c: {d: 1}}};
findObjAttr(a, 'a.b.c.d');
```
- **用迭代器的思想解决分支循环嵌套的问题**
```js
function group(name, num) {
    let data = [];
    let strategy = function() {
        let deal = {
            "default": function() {
                return;
            },
            "header": function(i) {
                deta[i][0] = 0;
                data[i][1] = 1;
            },
            "content": function(i) {
                data[i][0] = 2;
                data[i][1] = 3;
            }
        }
        return function(name) {
            return deal[name] || deal["default"];
        }
    }();

    function _each(fn) {
        for(let i = 0; i < num; i++) {
            fn(i);
        }
    }

    _each(strategy(name));

    return data;
}
```
- **实现一个图片播放器
主要功能有`上一页`丶`下一页`丶`首页`丶`尾页`丶`自动播放按钮`丶`停止自动播放按钮`**
```js
// 图片播放器       
let imgPlayer = function (imgData, box) {
    let container = box && document.querySelector(box) || document,
        img = container.querySelector('img');
        len = imgData.length,
        index = 0,
        img.src = imgData[0];
    var timer = null;    
    
    return {
        first: function() {
            index = 0;
            img.src = imgData[index];
        },
        last: function() {
            index = len - 1;
            img.src = imgData[index];
        },
        pre: function () {
            if( --index > 0) {
                img.src = imgData[index];   
            }else {
                index = 0;
                img.src = imgData[index];
            }
        },
        next: function() {
            if(++index < len) {
                img.src = imgData[index];
            }else {
                index = len - 1;
                img.src = imgData[index]; 
            }
        },
        play: function() {
            timer = setInterval(() => {
               if(index > len - 1) {
                   index = 0;
               } 
               img.src = imgData[index];
               index ++;
            }, 5000);
        },
        stop: function() {
            clearInterval(timer);
        }
    }
}
let player = new imgPlayer(imgData, "#box"); 
```



1. 发布订阅模式和观察者模式的异同
