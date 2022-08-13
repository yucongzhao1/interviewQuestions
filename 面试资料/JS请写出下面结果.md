## 请写出代码执行结果，并解释为什么

## 21. 
`涉及知识点`： `函数声明提升 变量声明提升 作用域`
```js
function yideng() {
    console.log(1);
}
(function () {
    if(false) {
        function yideng () {
            console.log(2); 
        }
    }
    console.log(typeof yideng);
    yideng();
})
```
```js
console.log(a);
if(true) {
    a = 10;
    console.log(a);
}
console.log(a);
```
```js
console.log(a);
if(true) {
    console.log(a);
    function a() {}
}
console.log(a);
```
```js
console.log(a, window.a);
{
    console.log(a, window.a);
    function a() {}
    console.log(a, window.a);
}
console.log(a, window.a);
```



## 22.
`设计知识点：事件循环机制`
```js
console.log('start');
setTimout(() => {
    console.log('children2');
    Promise.resolve().then(() => {
        console.log('children');
    })
}, 0)
new Promise(function(resolve, reject) {
    console.log('children4');
    setTimout(function() {
        console.log('children5');
        resolve('children6');
    }, 0)
}).then((res) => {
    console.log('children7');
    setTimout(() => {
        console.log(res);
    }, 0);
})
```
解析
- 先执行宏任务script脚本
- `console.log('start')`执行
- 遇到定时器交由定时器线程，等待时间到了加入队列
- 遇到Promise直接执行executor，打印`console.log('children4');`；遇到第二定时器，又交由定时器线程管理，等待加入队列。Promise.then等待resolve之后加入微队列。此时第一轮任务执行完毕
- 第一定时器进入队列，取出任务进行执行`console.log('children2')`；此时遇到Promise执行并将promise.then放入宏任务队列中的微任务队列。当前任务还未完毕，执行then，打印`console.log('children3')`
- 取出第二定时器，打印`console.log('children5')`，并把then放入微任务中，当前宏任务执行完毕，取出then执行`children7`
- 又遇到定时器，由定时器线程管理等待时间到了添加到宏任务中
- 取出定时器任务，打印`children6`

原理
- JS是单线程，最大特点就维持了一个事件循环
- 事件循环的组成由主线程和任务队列
- 执行方式就是主线程不断从任务队列一个一个取出任务进行执行
- 任务分为宏任务和微任务
- 每个宏任务内都维持一个微任务队列，为了让高优先及任务及时执行。也就是每取出一个宏任务，执行完毕之后。检查当前宏任务是否微任务可执行




## 23.
`涉及的知识点` 作用域提升 变量声明提升 函数声明提升
```js
alert(a); 
a(); 
var a = 3;
function a() {
    alert(10);
}
alert(a); 
a = 6;
a(); 
```





## 43.
`涉及知识点`：
```js
// counter.js 
let counter = 10;
export default counter;

// index.js
import myCounter from './counter'
myCounter ++;
console.log(myCounter);
```
???




## 44.
`涉及的知识点`：作用域
```js
function test(m) {
    m = {v: 5};
}  
var m = {k: 30};
test(m);
alert(m.v);
```



## 45.
涉及知识点：`this`
```js
function fn() {
    console.log(this.length);
}
var person = {
    length: 5,
    method: function(fn) {
        fn();
    }
}
person.method(fn, 1);
```



## 47. 
涉及的知识点：`隐式类型转换`
```js
if([] == false) { 
    console.log(1);
};
if([] == false) { 
    console.log(2); 
};
if([]) { // ??
    console.log(3);
};
if([1] == [1]) {
    console.log(4);
}
```


## 105.
> 涉及的知识点：`this指向`  
```js
var yideng = {
    bar: function() {
        return  this.baz;
    },
    baz: 1
};
(function() {
    console.log(typeof arguments[0]());
})(yideng.bar);
```




## 106.
涉及的知识点：`函数声明提升`
```js
function test() {
    console.log('out');
}
(function() {
    if(false) {
        function test() {
            console.log('in');
        }
        test();
    }
})();
```




## 107.
涉及的知识点：数据类型
```js
var x = [typeof x, typeof y][0];
typeof x;
```




## 108.
涉及的知识点：经过var的变量delete不了
```js
(function(x) {
    delete x;
    return x;
})(1)
```



## 109. 
涉及的知识点：`隐式类型转换`
```js
var x = 1;
if(function f() {}) { // 相当于 !!function f() {} Boolean()
    x += typeof f;
}
x; 
```


## 110. 
涉及的知识点：`类型判断的方法及原理`
```js
function f() {
    return f;
}
new f() instanceof f;
```



## 111. 
涉及的知识点：`原型链`
```js
Object.prototype.a = 'a';
Function.prototype.a = 'a1';
function Person() {}
var yideng = new Person();
console.log(yideng.a);
```



## 112.
涉及的知识点：`隐式类型转换`
```js
var yideng = [0];
if(yideng) {
    console.log(yideng == true);
}else {
    console.log('yideng');
} 

// ??????/
[0] == true // false
[1] == faklse // true
```




## 113.
```js
function yideng() {
    return;
    {
        a: 1
    }
}
var result = yideng();
console.log(result.a);
```



## 114.
涉及的知识点：??
```js
<script>
    // 使用未定义的变量yideng
    yideng;
    console.log(1);       
</script>    
<script>
    console.log(2);
</script>
```



## 115.
涉及的知识点：`数组map`
```js
var yideng = Array(3);
yideng[0] = 2;
var result = yideng.map(function(elem) {
    return '1';
});
console.log(result);
```



## 116. 
涉及的知识点：`隐式类型转换`
```js
[1 < 2 < 3, 3 < 2 < 1]
```




## 117.
涉及的知识点：`隐式类型转换`
```js 
2 == [[[2]]] ????
```




## 118. 
??




## 119. 
```js
var yidenga = Function.length;
yidengb = new Function().length;
console.log(yidenga === yidengb);
```
？？？




## 120. 
涉及的知识点：`this指向`
```js
var length = 16;
function fn () {
    console.log(this.length);
}
var yideng = {
    length: 5,
    method: function(fn) {
        fn(); 
        arguments[0](); // arguments调用
    }
}
yideng.method(fn, 1); 
```




## 121. 
```js
var yi = new Date('2018-08-20'),
    deng = new Date(2018, 08, 20);
console.log([yi.getDay() === deng.getDay(), yi.getMonth() === deng.getMonth()]);
```
????




## 122. 
```js
for(
    let i = (setTimeout(() => console.log("a ->", i)), 0);  
    setTimeout(() => console.log("b->", i)), i < 2;     
    i ++
) {
    i ++
}
```
???



## 123. 
涉及知识点：`类型判断`
```js
[typeof null, null instanceof Object];
```



## 124. 
涉及的知识点：
```js
<textarea maxlength="10" id="yideng"></textarea>
<script>

    document.getElementById("yideng").value = "a".repeat(10) + "b";

</script>   
```




## 125. 
涉及的知识点：`基础类型和引用类型的区别`
```js
function sidEffecting(arr) {
    arr[0] = arr[2];
}
function yideng(a, b, c = 3) {
    c = 10;
    sidEffecting(arguments);
    return a + b + c; 
}
yideng(1, 1, 1);
```



## 126.
涉及的知识点：`预编译`
```js
yideng();   
var flag = true;
if(flag) {
    function yideng() {
        console.log('yideng1');
    }
}else {
    function yideng() {
        console.log('yideng2');
    }
}
```




## 127. 
????
```js
var min = Math.min(),
    max = Math.max();
console.log(min < max);
```



## 128. 
涉及的知识点：`隐式类型转换`
```js
console.log('hello' +  (1 < 2) ? "word" : "me");
```




## 129. 
涉及的知识点：`预编译`丶`作用域`
```js
var a = (b = 1); 
(function() {
    var a = (b = 2);
})();
console.log(a, b); 
```



## 130.
涉及的知识点：`类型判断`
```js
if([] instanceof Object) {
    console.log(typeof null);
}else {
    console.log(typeof undefined);
}
```



## 131.
涉及的知识点：`引用类型和原始类型的区别`
```js
var obj = {};
obj.name =  "first";
var peo = obj;
peo.name = "second";
console.log(obj.name); 
```




## 132. 
涉及的知识点: `声明类型的区别`丶`预编译`
```js
function say(word) {
    let word = 'hello';
    console.log(word);
}    
say('hello LiLi');
```




## 133.
```js
function fun(n, o) {
    console.log(o);
    return {
        fun: function(m) {
            return fun(m, n);
        }   
    }
}
var b = fun(0).fun(1).fun(2).fun(3);  
```
????




## 141.
涉及的知识点：`事件执行机制`
```js
setTimeout(function() {
    console.log(1); 
}, 0);
new Promise(function exector(resolve) {
    console.log(2);
    for(var i = 0; i < 10000; i++) {
        i == 9999 && resolve();
    }
    console.log(3);
}).then(function() {
    console.log(4);
});
console.log(5);
```



## 146.
涉及的知识点：`字符串拼接`
```js
var s = 'laosu';
s[0] = 1;
console.log(s); 
var s = 'laosu';
s += 2020;
console.log(s);
```


## 167.
涉及的知识点：`Promise`
```js
new Promise((resolve, reject) => {
    reject("1");
})
.catch((e) => {
    console.log(1); ????
})
.then((res) => {
    console.log(2);
});
```



## 189.
涉及的知识点：`引用类型和原始值的区别`
```js
 function a(obj) {
    obj.a = 2;
    obj = {a: 3};
    return obj;
}
const obj = {a: 1};
a(obj);
console.log(obj);
```




## 249.
涉及的知识点：`map`和`parseInt`的使用
```js
[1, 2, 3, 4, 5].map(parseInt);
```




## 250.
涉及的知识点：`this指向`
```js
var fullname = 'Test1';
var obj = {
    fullname: 'Test2',
    prop: {
        fullname: 'Test3',
        getFullname: function() {
            return this.fullname;
        }
    }
}
console.log(obj.prop.getFullname());
var test = obj.prop.getFullname;
console.log(test());
```




## 251.
涉及的知识点：`事件执行机制`
？？？？
```js
console.log(1); // 1
setTimeout(() => {
    console.log(2); // 8 5
})
process.nextTick(() => {
    console.log(3); // 4 6
})
setImmediate(() => {
    console.log(4); //  9 3
})
new Promise((resolve) => {
    console.log(5); // 2 7
    resolve();
    console.log(6); // 3 8
}).then(() => {
    console.log(7); // 5 9
})
Promise.resolve().then(() => {
    console.log(8); // 6 2
    process.nextTick(() => {
        console.log(9); // 7 4
    })
})
```




## 275.
涉及的知识点：`this指向`
```js
var a = {
    name: 'A',
    fn() {
        console.log(this.name);
    }
}
a.fn(); // A
a.fn.call({name: 'B'}); // B
var fn1 = a.fn;
fn1(); // ''
```




## 276.
涉及的知识点：`事件执行机制`
```js
let int = 1;
setTimeout(function() {
    console.log(int); // 5
    int = 2;
    new Promise((resolve, reject) => {
        resolve();
    }).then(function() {
        console.log(int); // 2
        int = 7;
    });
    console.log(int); // 2
})
int = 3;
console.log(int); // 3
new Promise((resolve, reject) => {
    console.log(int); // 3
    return resolve((int = 4)); 
}).then(function() {
    console.log(int); // 4
    int = 5;
    setTimeout(function() {
        console.log(int); // 7
        int = 8;
    })
    return false;
});
```




## 278.
涉及的知识点：`原型链`
```js
Function.prototype.a = () => {alert(1)};
Object.prototype.b = () => {alert(2)};
function A() {}
const a = new A();
a.a();
a.b();
```




## 279. 
涉及的知识点：`变量声明和函数声明提升`丶`var丶const丶let的区别`
```js
let a = 0;
console.log(a);
console.log(b);
let b = 0;
console.log(c);
function c() {};
```




## 280.
涉及的知识点：`作用域`
```js
var x = 10;
function a(y) {
    var x = 20;
    return b(y);
}
function b(y) {
    return x + y; 
}
a(20);
```



## 281.
涉及的知识点：`类型判断`
```js
typeof typeof typeof [];
```



## 285. 
涉及的知识点：`事件执行机制`
```js
setTimeout(() => {
    console.log(0); 
}, 0);
new Promise((res) => setTimeout(res, 0)).then(() => {
    console.log(1);
    setTimeout(() => {
        console.log(2);
        })
        new Promise((r => r())).then(() => {
        console.log(3);
    });
})
setTimeout(() => {
    console.log(4);
}, 0)
new Promise((res) => res()).then(() => {
    console.log(5); 
})
```



## 292.
涉及的知识点：`引用类型和原始值的区别`
```js
function a(obj) {
    obj.a = 2;
    obj = {a: 3};
    return obj;
}
const obj = {a: 1};
a(obj);
console.log(obj);
```



## 293.
涉及的知识点：`原型链`丶`预编译`
```js
function Foo() {
    getName = function() {
        alert(1);
    };
    return this;
}
getName();
Foo.getName = function() {
    alert(2);
};
Foo.prototype.getName = function() {
    alert(3)
}
getName = function() {
    alert(4);
}

getName(); // 4
Foo.getName(); // 1
new Foo().getName(); // 3
```




## 322.
涉及的知识点：`运算符的优先级`
```js
function Foo() {
    getName = function() {
        alert(1);
    };
    return this;
}
var getName;
function getName() {
    alert(5);
}
Foo.getName = function() {
    alert(2);   
}
Foo.prototype.getName = function() {
    alert(3);
}
getName = function() {
    alert(4);
}

Foo.getName(); // 2
getName(); // 4
Foo().getName(); // 1
getName(); // 1

new Foo.getName(); // 2
new Foo().getName(); // 3
new new Foo().getName(); // 1?? ????
```









