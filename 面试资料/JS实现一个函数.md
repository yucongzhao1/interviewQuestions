## 1. 实现一个函数，判断输入是不是回文字符串
```js
function run(input) {
    if(typeof input != "string") {
        return false;
    }
    return input.split("").reverse().join("") === input;
}
```


## 2. 实现效果，点击容器内的图标，图标边框变成`border: 1px solid red`，点击空白处重置
```js
<style>          
html,
body {
    width: 100%;
    height: 100%;
}
.box {
    width:300px;
    height: 300px;
    background: blue;
}
.icon {
    width: 100px;
    height: 100px;
    background: green;
}
</style>


<div class="box">
    <div class="icon"></div>
</div>

 <script>

    const box = document.getElementsByClassName('box')[0];
    function isIcon(target) {
        return target.className.includes('icon');
    }

    box.onclick = function(e) {
        e.stopPropagation();
        // console.log("点击盒子");
        const target = e.target;
        if (isIcon(target)) {
            target.style.border = '1px solid red';
        }
    }
    const doc = document;
    doc.onclick = function(e) {
        // console.log("点击界面")
        const children = box.children;
        for(let i = 0; i < children.length; i++) {
            if (isIcon(children[i])) {
                children[i].style.border = 'none';
            }
        }
    }

</script>
```




## 3. 请简单实现双向数据绑定mvvm
```js
<input type="text" id="input">


const data = {};
const input = document.getElementById("input");
Object.defineProperty(data, "text", {
    set(value) {
        input.value = value;
        this.value = value;
    }
})
input.onchange = function(e) {
    data.text = e.target.value;
}
```




## 4. 实现Storage
https://segmentfault.com/a/1190000017049146