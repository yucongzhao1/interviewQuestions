# 1. 什么是CSS预处理器？区别
特点
- CSS预处理器为CSS增加一些编程的特性，无需考虑浏览器的兼容性问题
- 你可以在CSS中使用变量丶简单的逻辑程序丶函数等在编程语言的一些基本特性
- 让你CSS更加简洁丶适应性更强丶可读性更佳，更易于代码的维护等等
- 语法强大，比如嵌套书写导致模块化开发中需要书写很多重复的选择器

`Sass`丶`LESS`丶`Stylus`区别

- 环境
  - `Sass`使用前需要安装Ruby环境,
  - `Less`是基于JavaScript，直接引入Less.js来处理代码输出css到浏览器
- 使用
  - Less并没有裁剪CSS原有的特性，而是在现有 
- 处理机制不一样
    - `LESS`是通过客户端处理的，`Sass`通过服务端处理，`Less`的解析会比`Sass`慢一些






# 2. 水平垂直居中？兼容性？不知宽高的情况下？
```js
// 兼容性好 知道宽高
子级 {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -50px;
    margin-top: -50px;
    width: 100px;
    height: 100px;
    background: red;
}


// 兼容性好 不知道宽高 
子级{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    background: red;
}


// 不知道宽高
父级 {
    display: flex;
    justify-content: center;
    align-items: center;
}


// 不知道宽高
父级 {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
}
```






# 3. CSS实现1px像素，解决移动端1px线条的显示方式
- **利用box-shadow + transfrom**
```js
 .opeixel {
    position: relative;
    top: 50px;
    width: 300px;
}

.opeixel::after {
    position: absolute;
    bottom: 0;
    left: 0;
    content: '';
    width: 300px;
    box-shadow: 0 0 1px #666;
    transform-origin: 0 bottom;
    transform: scaleY(.5) translateZ(0);
}

@media(min-resolution: 2dppx) {
    .shadow::after {
        box-shadow: 0 0 0 .5px #666;
    }
}

@media(min-resolution: 3dpx) {
    .shadow::after {
        box-shadow: 0 0 0 0.333333px #666;
    }
}


<span class="opeixel shadow"></span>
```
- **利用border+伪元素 + transform**





# 4. BFC概念？作用？常用场景？
Formatting context(格式化上下文)是W3C CSS2.1规范中一个概念。它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。

BFC 即 Block Formatting Context(块级格式化上下文)，它属于上述定位方案的普通流
具有 BFC 特性的元素可以看作成隔离了独立容器，容器里面的元素不会在布局上影响到外面的元素，并且 BFC 具有普通容器所没有的一些特性。

**触发BFC：**

- 浮动元素：float除了none以外的值
- 绝对定位元素： position(absolute丶fixed)
- display为inline-block丶table-cells丶flex
- oveflow除了visible以外的值（hidden丶auto丶scroll）

**BFC特性及应用：**

- 同一个BFC下外边距会发生折叠
    ```js
    div{
        width: 100px;
        height: 100px;
        background: lightblue;
        margin: 100px;
    }
      
    
    <div></div>
    <div></div>
    ```
    - 解决：想要避免外边距的重叠，可以将其放在不同的BFC容器中
       ```js
       .container {
            overflow: hidden;
        }
       
        p {
            width: 100px;
            height: 100px;
            background: lightblue;
            margin: 100px;
        }
       
        <div class="container">
            <p></p>
        </div>
        <div class="container">
                <p></p>
        </div>
       ```
- BFC可以包含浮动的元素（清除浮动流）
  ```js
  .container {
      border: 1px solid #000; 
  }
  .box {
      width: 100px; 
      height: 100px; 
      background: #eee;  
      float: left;
  }
  
  <div class="container">
     <div class="box"></div>
  </div>
  ```
  - 解决方案
    ```js
    .container {
        overflow: hidden;
        border: 1px solid #000; 
    }
    .box {
        width: 100px; 
        height: 100px; 
        background: #eee;  
        float: left;
    }
    
    <div class="container">
        <div class="box"></div>
    </div>
    ```
- BFC可以阻止元素被浮动元素覆盖
  ```js
  .box1 {
      height: 100px; 
      width: 100px;
      float: left; 
      background: lightblue;
  }
  
   <div class="box1">我是一个左浮动的元素</div>
    <div class="bxo2" style="width: 200px; height: 200px; background: #eee; overflow: hidden;">
        我是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮是一个设置浮动
    </div>
  ```





# 5. Flex？注意flex：1的含义，一般会给你个场景题？

## 6个属性设置在容器上：

- **flex-direction: 决定主轴的方向（即项目的排列方向）**
    - row (默认值)：主轴为水平方向，起点为左端。
    - row-reverse：主轴为水平方向，起点在右端。
    - column：主轴为垂直方向，起点在上沿。
    - column-reverse：主轴为垂直方向，起点为下沿。
- **flex-wrap：默认情况下，项目都排在一条线（又称轴线）上。这个属性定义如果一条轴线排不下，如何换行**
    - nowrap（默认）：不换行
    - wrap：换行，第一条在上方
    - wrap-reverse：换行，第一行在下方
- **flex-flow：是 flex-direction 属性和 flex-wrap 属性的简写形式，默认值为 row nowrap**
- **justify-content：定义了项目在主轴上的对齐方式。**
    - flex-start（默认值）：左对齐
    - flex-end：右对齐
    - center：居中
    - space-between：两端对齐，项目之间的间隔都相等
    - space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。
- **align-items：定义项目在交叉轴上如何对齐**
    - flex-start：交叉轴的起点对齐
    - flex-end：交叉轴的终点对齐
    - center：交叉轴的中点对齐
    - baseline：项目的第一行文字的基线对齐
    - stretch（默认值）：如果项目未设置高度或设为 auto，将占满整个容器的高度
- **align-content：定义了多根轴线的对齐方式，如果项目只有一根轴线，该属性不起作用**
    - flex-start：与交叉轴的起点对齐
    - flex-end：与交叉轴的终点对齐
    - center：与交叉轴的中点对齐
    - space-between：与交叉轴两端对齐，轴线之间的间隔平均分布
    - space-around：每根轴线两侧的间隔都相等，所以，轴线之间的间隔比轴线与间距的间隔大一倍
    - stretch（默认值）：轴线占满整个交叉轴

## 6个属性设置上项目上

- **order：定义项目的排列顺序。数值越小，排列越靠前，默认为0**
- **flex-grow：定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大**
- **flex-shrink：定义项目的缩小比例，默认为1，即如果空间不足，即项目将缩小**
- **flex-basis：定义了在分配多余空间之前，项目占据的主轴空间。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小**
- **flex：是flex-grow丶flex-shrink和flex-basis的简写，默认值1 为`0 1 auto` 该属性有两个属性值`auto（1 1 auto）`和`none（0 0 auto）` 建议优先使用这个属性 因为浏览器会推算相关值**
- **align-self: 允许单个项目有与其它项目不一样的对齐方式，可覆盖`aligin-items`属性。默认为`auto`，表示继承元素`align-items`属性，如果没有父元素，等同于`stretch`**

**flex 属性是 flex-grow 丶 flex-shrink 和 flex-basis 的简写 默认值为 0 1 auto**





# 6. 盒模型概念，如何切换盒模型？
**盒模型分为 IE 盒模型和 W3C 标准盒模型，盒模型的组成为 content丶padding丶border丶margin**
**区别是：**

- 在标准盒模型中，width和height指的是内容区域的宽度和高度。增加内边距丶边框和外边距不会影响到内容区域的尺寸，但是会增加元素框的总尺寸。
- IE盒模型中，width和height指的是 内容区域 + border + padding 的宽度和高度

**写了<!Doctype html>会会根据这个解析成标准盒模型，设置 box-sizing: border-box 不担心被撑暴导致换行**

**box-sizieng:**
- content-box 采用标准模型
- border-box 采用IE怪异模型






# 7. 伪类和伪元素区别？使用场景？
**CSS引入伪类和伪元素概念是为了格式化文档树以外的信息。也就是说伪类和伪元素是用来修饰不在文档树中的部分，比如，一句话中的第一个字母，或者是列表中的第一个元素。**

- 伪类用来当已有元素处于的某个状态时，为其添加对应的样式，这个状态是根据用户行为而动态变化的。比如说，当用户悬停在指定元素的时，我们可以通过`:hover`来描述这个元素的状态。虽然它和普通的CSS类相似，可以为已有的元素添加样式，但是它只有处于dom树无法描述的状态下才能为元素添加样式，所以将其称为伪类。
- 伪元素用于创建一些不在文档树中的元素，并为其添加样式。比如说，我们可以通过`:before`来在一个元素前添加一些文本，并为这些文本添加样式。虽然用户可以看到这些文本，但是这些文本实际上不在文档树中。 

区别
- 伪类的操作对象是文档树中已有的元素，而伪元素则创建了一个文档树外的元素。因此，伪类和伪元素的区别在于：有没有创建一个文档树之外的元素。

- CSS3 规范中的要求使用双冒号`（::）`表示伪元素，以此来区分伪元素和伪类，比如`::before`和`::after`等伪元素使用双冒号`(::)`，`:hover`和`:active`等伪类使用单冒号`(:)`。除了一些低于IE8版本的浏览器外，大部分浏览器都支持伪元素的双冒号`(::)`表示方法。虽然CSS标准要求伪元素使用双冒号的写法，但也支持单冒号的写法。为了向后兼容，我们建议你在目前还是使用单冒号的写法。

伪类
- `:link`:选择未访问的链接
- `:hover`：选择鼠标指针浮动在其上的元素
- `:focus`：选择获取焦点的输入字段
- `:active`：选择活动的链接
- `first-child`：匹配元素的第一个子元素

伪元素
- `::before`:在被选元素前插入内容
- `::after`: 在被元素后插入内容
- `::first-letter/:first-letter`: 匹配元素中文本的首字母
- `::first-line/:first-line`：匹配元素中的第一行的文本
- `::placeholder`: 匹配占位符的文本，只有元素设置了`placeholder`属性时，该伪元素才能生效






# 8. 单行文本和多行文本溢出截断省略的实现？
> 单行文本

**优点**
- 无兼容性
- 响应式截断
- 文本溢出范围才显示省略号，否则不显示省略号
- 省略号的位置刚刚好

**短板**
- 只支持单行文本截断

**适用场景**
- 适用于单行文本溢出显示省略号的情况
```js
<p class="p1">11111111111111111111111111111111111</p>

.p1 {
    width: 200px;
    background: red;
    overflow: hidden;
    /* 文本不会换行 控制在一行 */
    white-space: nowrap;
    /* 当文本溢出时，以省略号 */
    text-overflow: ellipsis;
}
```


> 多行文本
### 按行数 - 多行文本溢出（兼容性不好）

**使用WebKit的css拓展属性 该方法适用于`safari`丶`chrome`和大多数移动端浏览器**

**优点**
- 响应式截断
- 文本溢出范围才显示省略号，否则不显示省略号
- 省略号显示位置刚刚好    

**缺点**
- 兼容性一般，`webkit-line-clamp`属性只有WebKit内核的浏览器才支持

**适用场景**
- 多适用于移动端页面，因为移动端设备浏览器更多是基于WebKit内核

```js
.p2 {
    width: 200px;
    overflow: hidden;
    /* 将对象作为弹性盒子模型展示 */
    display: -webkit-box;
    /* 设置子元素排列方式 */
    -webkit-box-orient: vertical;
    /* 设置显示的行数 多出的部分会显示为... */
    -webkit-line-clamp: 3;
}

<p class="p2">重播健康才能为健康理念那请问看来今年人间难得 蚕蛾我春节前温柔才能乔恩成本怒问u称其为偶灰常覅哦请问比较hi气温较低哦亲卫军地区为囧让</p>
```
### 按高度 - 多行文本溢出
**使用伪元素实现，将伪元素放在最后一个字的上方，达到显示省略号的目的。该方法兼容性较好，但文字未超出的情况下也会显示省略号**

**优点**
- 无兼容性问题
- 响应式截断

**短板**
- 无法识别出文字的长短，无论文本是否溢出范围，一直显示省略号
- 省略号显示可能不会刚刚好，有时会遮住一半的文字

**使用场景**
- 适用于数量效果要求比较低，文本一定溢出的情况

```js
.p3 {
    position: relative;
    line-height: 1.2em;
    max-height: 3.6em;
    width: 300px;
    text-align: justify;
    overflow: hidden;
}
.p3::after {
    content: "...";
    position: absolute;
    bottom: 0;
    right: 0;
    width: 1em;
    background: #fff;
}

<p class="p3">呢看来你能否发呢入境南非人发呢让你分解开来奥利弗啊反馈蓝枫库拉索尼的辽宁省的疯狂拉升你看反击看来你就看论文加快了妇女节快乐人才可能</p>
```

### 基于JavaScript的实现方案
**优点**
- 无兼容性问题
- 响应式截断
- 文本溢出范围才显示省略号，否则不显示省略号

**短板**
- 需要JS实现，背离展示和行为相分离
- 文本为中英文混合时，省略号显示位置略有偏差

**适用场景**
- 适用于响应式截断多行文本溢出省略的情况
```js
<body>
    <div class='demo'></div>
</body>

<script type="text/javascript">
    
    const text = '一段很长这是一段很长这是一段很长这是一段很长这是一段很长这是一段很长这是一段很长这是一段很长这是一段很长这是一段很长这是一段很长这是一段很长这是一段很长这是一段很长这是一段很长这是一段很长这是一段很长这是一段很长这是一段很长这是一段很长这是一段很长这是一段很长这是一段很长这是一段很长这是一段很长这是一段很长这是一段很长这是一段很长这是一段很长的文本';
    const totalTextLen = text.length;
    const formatStr = () => {
        const ele = document.getElementsByClassName('demo')[0];
        const lineNum = 2;
        const baseWidth = window.getComputedStyle(ele).width;
        const baseFontSize = window.getComputedStyle(ele).fontSize;
        const lineWidth = +baseWidth.slice(0, -2);

        // 所计算的strNum为元素内部一行可容纳的字数(不区分中英文)
        const strNum = Math.floor(lineWidth / +baseFontSize.slice(0, -2));

        let content = '';

        // 多行可容纳总字数
        const totalStrNum = Math.floor(strNum * lineNum);

        const lastIndex = totalStrNum - totalTextLen;

        if (totalTextLen > totalStrNum) {
            content = text.slice(0, lastIndex - 3).concat('...');
        } else {
            content = text;
        }
        ele.innerHTML = content;
    }

    formatStr();

        window.onresize = () => {
        formatStr();
    };

</script>
```

- 使用插件jQuery.dotdotdot，下载及详细文档地址
```js

```





# 9. Position 属性

## 9-1. static

默认值。没有定位，元素出现在正常的流中（忽略top丶bottom丶left丶right 或者 z-index声明）。元素框正常生成。块级元素生成一个矩阵框，作为文档流的一部分，行内元素则会形成一个或多个行框。置于其父元素中。

## 9-2. relative

相对定位，相对于自己的初始位置，不脱离文档流。也就是说元素偏移某个距离，元素仍保持其未定位前的形状，它原本所占的空间仍保留。

```js
div {
    width: 100px;
    height: 100px;
}
.div1 {
    background: #ffff00;
}
.div2 {
    background: #00ff00;
    position: relative;
    top: 40px;
    left: 40px;
}
.div3 {
    background: #0000ff;
}

<div class="div1">div1</div>
<div class="div2">div2</div>
<div class="div3">div3</div>
```

## 9-3. absolute

绝对定位的元素的位置相对于最近的已定位祖先元素，如果元素没有已定位的祖先元素，那么它的位置相对于最初的包含块。

```j
div {
    width: 100px;
    height: 100px;
}
.div1 {
    background: #ffff00;
}
.div2 {
    background: #00ff00;
    position: absolute;
    top: 40px;
    left: 40px;
}
.div3 {
    background: #0000ff;
}

<div class="div1">div1</div>
<div class="div2">div2</div>
<div class="div3">div3</div>
```

由于 div2 的祖先元素都没有定位，所以相对于最初的包含块也就是 body，同时由于绝对定位脱离文档流，所以 div3 占了 div2 原来的位置。

## 9-4. fixed

fixed 元素脱离正常的文档流，所以它与 absolute 元素相类似，同样会被周围元素忽略，支持 top 丶 bottom 丶left丶right 属性，但 fixed 元素正如它的名字一样，它是固定在屏幕的某个位置，它不会随着浏览器滚动条的滚动而一起滚动。比如我们常见的回到顶部的功能，按钮一直在浏览器的左下方，不管滚动条如何滚动，该按钮都会在左下方固定的位置，这个需求就可以使用 position: fixed; 完成。但需要注意得是，position: fixed 是由兼容性问题的，不支持 IE6 丶 IE7 丶IE8。可以通过给该元素设置 position: absolute; 并获得滚动条距离顶部高度加上某个固定高度来实现。

## 9-5. inherit

inherit 值如同其它 CSS 属性的 inherit 值，即继承父元素的 position 值。

## 9-6. sticky

sticky 的本意是粘贴，可以称之为粘性定位，但在 CSS 中表现更像是吸附，这是一个结合了 position: relative; 和 position: fixed; 两种定位功能于一体的特许定位，常见的吸顶丶吸底（网站的头部发挥栏丶底部切换了栏之类）的效果用这个属性非常适合，例如下面淘宝

<img src="https://github.com/xiecheng328/md-img/blob/master/p3.png?raw=true">

当元素距离页面视口（Viewport，也就是 fixed定位的参照）顶部距离大于 0px 时，元素以 relative 定位表现，而当元素距离页面视口小于 0px 时，元素表现为 fixed 定位，也就会固定在顶部。

**注意：**

- 需指定 top 丶right丶 bottom丶right 四个阀值其中之一，才可使粘性定位失效。否则其行为与相对定位相同。
- 并且 top 和 bottom 同时设置时，top 的生效的优先级高，left 和 right 同时设置时，left 的优先级搞。
- 设定为 position: sticky 元素的任意父节点的 overflow 属性必须是 relative，否则 position: sticky 不会生效。如果 position: sticky 元素的任意父节点定位设置为 over: hidden; 则父元素无法进行滚动，所以 position: sticky 元素也不会滚定然后固定的情况，如果 position: relative 元素的任意节点定位设置为 position: relative |  absolute | fixed，则元素相对于父元素进行定位，而不会相对 viewport 定位
- 达到设定的阀值，也就是设定了 position: sticky; 的元素表现为 relative 还是 fixed 是根据元素是否达到设定了的阀值决定的。





# 10. 如何实现一个自适应的正方形？

## 10-1.  CSS3 vw 单位

 ```js
 div {
     width: 100%; // width: 100vw; 也可以
     height: 100vw;
     background: pink;
 }
 ```

优点：简洁方便

缺点：浏览器兼容性不好	

## 10-2. 设置垂直方向的 padding 撑开容器

```js
div {
    width: 20%;
    height: 0;
    padding-bottom: 20%;
    background: pink;
}
```

优点：兼容性好

缺点：除了填充内容后会出现问题后，还有可能遇到 max-height 不收缩 失效

## 10-3. 利用伪元素的 margin(padding)-top 撑开容器

```js
div {
    width: 100%;
    overflow: hidden;
}

div:after {
    content: '';
    display: block;
    margin-top: 100%;
    background: pink;
}
```





# 11. 利用 CSS 实现一个三角形

```js
 div {
     width: 0;
     height: 0;
     border: 50px solid transparent;
     border-top: 100px solid green;
 }
```





# 12. 清除浮动的方法？

## 12-1.  利用 clear 样式

```js
clear: both;
```

## 12-2. 父元素结束标签前插入清除浮动的块级元素

## 12-3. 利用伪元素（clearfix）

```js
.clearfix:after {
    content: '.';
    height: 0;
    display: block;
    clear: both;
}
```

## 12-4. 利用 overflow 清除浮动





# 13. 选择器权重计算方式

- **!important** 权值：无限大
- **内联样式** 权值：1000
- **ID选择器** 权值：100
- **伪类和属性选择器** 权值：10
- **类型选择器和伪类选择器** 权值：1
- **通配符丶子选择器丶相邻选择器** 权值：0
- **继承的样式没有权值**





# 14. 伪类和伪元素的区别？

**CSS 引入伪类和伪元素是为了格式化文档树以外的信息。**也就是说，伪类和伪元素是用来修饰不在文档树中的部分，比如，一句话中的第一个字母，或者是列表中的第一个元素。下面分别对伪类和伪元素进行解释：

**伪类用于当已有元素处于的某个状态时，为其添加对应的样式，这个状态是根据用户行为而动态变化的。**比如说。当用户悬停在指定的元素时，我们可以通过 hover 来描述这个元素的状态。虽然它和普通的 CSS 类相似，可以为已有的元素添加样式，但是它只有处于 dom 树无法描述的状态下才能为元素添加样式，所以将其称为伪类。

**伪元素用于创建一些不在文档树中的元素，并为其添加样式。**比如说，我们可以通过:before 来在一个元素前添加一些文本，并为这些文本添加样式。虽然用户可以看到这些文本，但是这些文本实际上不在文档树中。

**伪类的操作对象是文档树中已有的元素，而伪元素则创建了一个文档树外的元素。因此，伪类和伪元素的区别在于：有没有创建一个文档树之外的元素。**

<img src="http://www.alloyteam.com/wp-content/uploads/2016/05/%E4%BC%AA%E7%B1%BB.png">

<img src="http://www.alloyteam.com/wp-content/uploads/2016/05/%E4%BC%AA%E5%85%83%E7%B4%A0.png">





# 15. 三栏布局

三栏布局就是两边固定，中间自适应。

## 15-1. 流体布局

左右模块各自向左右浮动，并设置中间模块的 margin 值使中间模块宽度自适应

缺点：就是主要内容无法最先加载，当内容较多时会影响用户体验

```js
.left {
    float: left;
    height: 200px;
    width: 100px;
    background-color: red;
}
.right {
    width: 200px;
    height: 200px;
    background-color: blue;
    float: right;
}
.main {
    margin-left: 120px;
    margin-right: 220px;
    height: 200px;
    background-color: green;
}

<div class="container">
    <div class="left"></div>
    <div class="right"></div>
    <div class="main"></div>
</div>
```

## 15-2. BFC 三栏布局

BFC 规则有这样的描述：BFC 区域，不会与浮动元素重叠。

缺点：主要内容无法最先加载，当页面中内容较多的时候会影响用户体验。

```js
.left {
    float: left;
    height: 200px;
    width: 100px;
    background-color: red;
}
.right {
    width: 200px;
    height: 200px;
    background-color: blue;
    float: right;
}
.main {
    overflow: hidden;
    height: 200px;
    background-color: green;
}

 <div class="container">
    <div class="left"></div>
    <div class="right"></div>
    <div class="main"></div>
</div>
```

## 15-3. 双飞翼布局

利用的是浮动元素 margin 负值的应用

主题内容可以优先加载，HTML 代码结构稍微复杂点

```js
.container {
    float: left;
    width: 100%;
}
.main {
    margin-left: 110px;
    margin-right: 220px;
    height: 200px;
    background-color: green;
}
.left {
    margin-left: -100%;
    float: left;
    height: 200px;
    width: 100px;
    background-color: red;
}
.right {
    margin-left: -220px;
    float: right;
    width: 200px;
    height: 200px;
    background-color: blue;
}

<div class="container">
    <div class="main"></div>
</div>
<div class="left"></div>
<div class="right"></div>
```

## 15-4. 圣杯布局

跟双飞翼布局很像，但是相对于双飞翼布局来说，HTML 结构相对简单，但是样式定义就稍微复杂，也是优先加载内容主体。

```js
.container {
    margin-left: 120px;
    margin-right: 220px;
}
.main {
    float: left;
    width: 100%;
    height: 200px;
    background-color: green;
}
.left {
    position: relative;
    left: -120px;
    margin-left: -100%;
    float: left;
    height: 200px;
    width: 100px;
    background-color: red;
}
.right {
    position: relative;
    right: -220px;
    margin-left: -220px;
    float: right;
    width: 200px;
    height: 200px;
    background-color: blue;
}

<div class="container">
    <div class="main"></div>
    <div class="left"></div>
    <div class="right"></div>
</div>
```

## 15-5. flex 布局

简单实用，未来的趋势，需要考虑浏览器的兼容性

```j
.container {
	display: flex;
}
.main {
    order: 2;
    flex-grow: 1;
    height: 200px;
    background-color: green;
}
.left {
    order: 1;
    height: 200px;
    width: 100px;
    background-color: red;
}
.right {
    order: 3;
    width: 200px;
    height: 200px;
    background-color: blue;
}

<div class="container">
    <div class="main"></div>
    <div class="left"></div>
    <div class="right"></div>
</div>
```

## 15-6. Tabel 布局

缺点：不能设置栏间距

```js
.container {
    display: table;
    width: 100%;
}
.left, 
.main,
.right {
    display: table-cell;
}
.left,
.right {
    height: 200px;
    width: 100px;
    background-color: red;
}
.right {
    width: 200px;
    height: 200px;
    background-color: blue;
}
.main {
    background: green;
}

<div class="container">
    <div class="left"></div>
    <div class="main"></div>
    <div class="right"></div>
</div>
```

## 15-7.  绝对定位布局

简单实用，并且主要内容可以优先加载。

```js
.container {
    position: relative;
}

.main {
    height: 400px;
    margin: 0 120px;
    background: green;
}

.left {
    position: absolute;
    left: 0;
    top: 0;
    width: 100px;
    height: 300px;
    background-color: red;
}

.right {
    position: absolute;
    right: 0;
    top: 0;
    width: 100px;
    height: 300px;
    background-color: blue;
}

<div class="container">
    <div class="main"></div>
	<div class="left"></div>
	<div class="right"></div>
</div>
```

## 15-8. 栅格布局

**容器和项目**

采用网格布局的区域，称为“容器（container）”。容器内部采用网格定位的子元素，称为“项目（item）”

```js
<div>
  <div><p>1</p></div>
  <div><p>2</p></div>
  <div><p>3</p></div>
</div>    
```

上面代码中，最外层的 div 元素就是容器，，内层的三个 div 元素就是项目

注意，项目只能是容器的顶层子元素，不包含项目的子元素，比如上面代码的 p 元素就不是项目，Gird 布局只对项目生效。

行和列

容器里面的水平区域称为“行（row）”，垂直区域称为“列（column）”

<img src="https://www.wangbase.com/blogimg/asset/201903/1_bg2019032502.png">

上图中，水平的深色区域就是“行”，垂直的深色区域就是“列”

单元格

行和列的交叉区域，称为“单元格”（cell）

正常情况下，n 行和 m 列会产生 n * m 个单元格，比如，3 行 3 列会产生 9 个单元格 

网格线

划分网格的线，称为“网格线”（grid line）。水平网格线划分出行，垂直网络线划分出列。

正常情况下，n 行有 n + 1 根水平网络线，m 列有 m + 1 根垂直线，比如三行就有四根垂直网格线

<img src="https://www.wangbase.com/blogimg/asset/201903/1_bg2019032503.png">

上图是一个 4 * 4 的网格，共有 5 根网格线和 5 根垂直网络线

**容器属性**

Grid 布局的属性分成两类。一类定义在容器上面，称为容器属性；另一类定义在项目上面，称为项目属性。这部分先介绍容器属性。

**grid-template-columns：**属性定义每一列的列宽

**grid-template-rows：**属性定义每一行的行高

**repeat()：**接受两个参数，第一个参数是重复的次数，第二个参数是所要重复的值

**auto-fill：**有时，单元格的大小是不固定的，但是容器的大小不固定。如果希望每一行（或每一列）容纳尽可能多的单元格，这时使用 auto-fill 关键字表示自动填充

**fr 关键字：** 为了方便表示比例关系，网格布局提供了 fr 关键字

**minmax：**函数产生一个长度范围，表示长度就在这个范围之中。它接受两个参数，分别是最小值和最大值

**auto：**表示由浏览器自己决定长度

**grid-row-gap：**属性设置行与行的间隔

**grip-column-gap：**属性设置列与列的间隔

**grip-gap：**grip-column-gap 和 grid-row-gap 的合并简写形式

**grid-template-areas：**网格布局允许指定“区域”（area），一个区域由单个或多个单元格组成。用于定义区域

**grid-auto-flow：**划分网格以后，容器的子元素会按照顺序，自动放置在每一个网格。默认的放置顺序是“先行后列”，即先填满第一行，再开始放入第二行。属性除了设置成 row 和 column，还可以设成 row dense 和 column dense。这两个值主要用于，某些项目指定位置后，剩下的项目怎样自动放置。

**justify-items：**属性设置单元格内容的水平位置（左中右），**align-items：**属性设置单元格内容的垂直位置（上中下），**place-items：**属性是 align-items 属性和 justify-items 属性的合并简写形式

- start：对齐单元格的起始边缘
- end：对其单元格的结束边缘
- center：单元格内部居中
- stretch：拉伸，占满单元格的整个宽度（默认）

**justify-content：**属性是整个内容区域在容器里面的水平位置（左中右），**align-content：属性是整个内容区域的垂直位置（上中下）**，**place-content：**属性是 align-content 属性和 justify-content 属性的合并简写形式

- start：对其容器的起始边框
- end：对其容器的结束边框
- center：容器内部居中
- stretch：项目大小没有指定，拉伸占据整个网络容器
- space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与容器边框的间隔大一倍

- space-between：项目与项目的间隔相等，项目与容器边框之间没有间隔
- space-evenly：项目与项目的间隔相等，项目与容器边框之间也是同样长度的间隔

**grid-auto-columns grid-auto-rows：**用来设置，浏览器自动创建的多余网格的列宽和行高

**grid-template：**属性是 grid-template-columns、grid-template-rows 和 grid-template-area 这三个属性的合并简写形式

**grid：**属性是 grid-template-rows、grid- template-columns、grid- template-areas、grid-auto-rows、grid- auto-columns、grid-auto- flow 这六个属性的简写行书

### 项目属性

**grid-column-start：**左边框所在的垂直网络线

**grid-column-end：**右边框所在的垂直网络线

**grid-row-satrt：**上边框所在的水平网络线

**grid-row-end：**下边框所在的水平网络线

**grid-column：** 是 grid-column-start 和 grid-column-end 的合并简写形式

**grid-row：**是 grid-row-start 和 grid-



# 16. HTML5 新特新

**XTML5 总的来说比 HTML4 多了十个新特新，但其不支持 IE8 及IE8 以下版本的的浏览器**

- 语义标签
- 增强型表单
- 视频和音频
- Canvas 绘图
- SVG 绘图
- 地理定位
- 拖放 API 
- WebWorker
- WebStorage
- WebSocket

## 语义标签

HTML5 语义标签，可以使开发者更方便清晰构建页面的布局

| 标签      | 描述                               |
| --------- | ---------------------------------- |
| <header>  | 定义了文档的头部区域               |
| <footer>  | 定义了文档的尾部区域               |
| <nav>     | 定义文档的导航                     |
| <section> | 定义文档中的节                     |
| <article> | 定义文章                           |
| <aside>   | 定义页面以外的内容                 |
| <details> | 定义用户可以看到或者隐藏的额外细节 |
| <summary> | 标签包含 details 元素的标题        |
| <dialog>  | 定义对话框                         |
| <figure>  | 定义包含内容，如图表               |
| <main>    | 定义文档主内容                     |
| <mark>    | 定义内容的主内容                   |
| <time>    | 定义日期/时间                      |

<img src="https://img2018.cnblogs.com/blog/1239961/201905/1239961-20190527090526985-576135815.png">

## 增强型表单

**HTML5 修改一些新的 input 输入特性，改善更好的输入控制和验证**

| 输入类型       | 描述                     |
| -------------- | ------------------------ |
| color          | 主要用于选取颜色         |
| date           | 选择日期                 |
| datetime       | 选取日期（UTC 时间）     |
| datetime-local | 选取日期（无时区）       |
| month          | 选取一个月份             |
| week           | 选择周和年               |
| time           | 选择一个时间             |
| email          | 包含 e-mail 地址的输入域 |
| number         | 数值的输入域             |
| url            | url 地址的输入域         |
| tel            | 定义输入电话号码和字段   |
| search         | 用于搜索域               |
| range          | 一个范围内数字值的输入域 |

**HTML 5 新增了五个表单元素**

| <detail>   | 用户会在它们输入数据时看到域定义选线的下拉列表 |
| ---------- | ---------------------------------------------- |
| <progress> | 进度条，展示连接/下载进度                      |
| <meter>    | 刻度值，用于某些计量，例如温度丶重量等         |
| <keygen>   | 提供一种验证用户的可靠方法 生成一个公钥和私钥  |
| <output>   | 用于不同类型的输出 比如尖酸或脚本输出          |

HTML5 新增表单元素

| 属性         | 描述                                      |
| ------------ | ----------------------------------------- |
| placehoder   | 输入框默认提示文字                        |
| required     | 要求输入的内容是否可为空                  |
| pattern      | 描述一个正则表达式验证输入的值            |
| min/max      | 设置元素最小/最大值                       |
| step         | 为输入域规定合法的数字间隔                |
| height/width | 用于 image 类型 <input> 标签图像高度/宽度 |
| autofocus    | 规定在页面加载时，域自动获得焦点          |
| multiple     | 规定<input>元素中可选择多个值             |

## 音频和视频

HTML5 提供了音频和视频文件的标准，既使用<audio>元素

**音频：<audio src=""></audio>**

```js
<audio controls> //  controls 属性提供添加播放丶暂停和音量控件
    <source src="horse.org" type="audio.ogg">
    <source src="horse.mp3" type="audio/mpeg">   
    你的浏览器不支持 audio 元素  // 浏览器不支持时显示文字
</audio>    
```

**视频：<video src=""></video>**

```js
<video width="320" height="240" controls>
	<source src="movie.mp4" type="video.mp4">
    <source src="movie.mp3" type="audio/mpeg">
    您的浏览器不支持 video 元素
</video>    	
```

## Canvas 绘图

## SVG 绘图

**什么是 SVG ?**

- SVG 指可伸缩矢量图形
- SVG 用于定义网络的基于矢量的图形
- SVG 图像在放大或改变尺寸的情况下其图形质量不会有损失
- SVG 是万维互联网的标准

**SVG 的优势，与其它图像格式相比，SVG 的优势在于：**

- SVG 图像可通过文本编译器来创建和修改
- SVG 图像可被搜索丶索引丶脚本化或压缩
- SVG 是可伸缩的
- SVG 图像可在任何的分辨率下被高质量的打印
- SVG 可在图像质量不下降的情况被放大

**SVG 与 Canvas 区别**

- SVG 适用于描述 XML 的 2D 图形的语言
- Canvas 随时随地描绘 2D 图形（使用 JavaScript）
- SVG 是基于 XML的，意味这可以操作 DOM，渲染速度较慢
- Canvas 是一像素一像素地渲染，如果改变某一个位置，整个画布会重绘

| Canvas                               | SVG                        |
| ------------------------------------ | -------------------------- |
| 依赖分辨率                           | 不依赖分辨率               |
| 不支持事件处理器                     | 支持事件处理器             |
| 能够以 .png 或 .jpg 格式保存结果图像 | 复杂度会减慢搞渲染速度     |
| 文字呈现功能比较简单                 | 适合大型渲染区域的应用程序 |
| 最适合图像密集的游戏                 | 不适合游戏应用             |

## 地理定位

使用 getCurrentPosition() 方法来获取用户的位置，以实现 LBS服务

```js
<script>
    var x = document.getElementById("demo");
	function getLocation() {
        if(navigator.geolocation) {
            navigator.geolcoation.getCurrentPosition(showPosition);
        }else {
            x.innerXHML = "Geolocation is not supported by this browser.";
        }
    }
	function showPosition(position) {
        x.innerXTML = "Latitude: " + position.coords.latitude +
            "<br />Longitude: " + position.coords.longitude;
    }
</script>    
```

## 拖放 API

拖放是一种常见的特性，即捉取对象以后托到另一个位置

在 HTML5 中，拖放是标准的一部分，任何元素都能够拖放

```js
<div draggable="true"></div>
```

当元素拖动时，我们可以检查其拖动的数据

```js
<div draggable="true" ondragstart="drag(event)"></div>
<script>
    function drap(ev) {
    	console.log(ev);
	}
}
</script>
```

| 拖动生命周期 | 属性名      | 描述                                           |
| ------------ | ----------- | ---------------------------------------------- |
| 拖动开始     | ondragstart | 在拖动操作开始时执行脚本                       |
| 拖动过程中   | ondrag      | 只要脚本在被拖动就运行脚本                     |
| 拖动过程中   | ondragenter | 当元素被拖动到一个合法的防止目标时，执行脚本   |
| 拖动过程中   | ondragover  | 只要元素正在合法的防止目标上拖动时，就执行脚本 |
| 拖动过程中   | ondragleave | 当元素离开合法的防止目标时                     |
| 拖动结束     | ondrop      | 将被拖动元素放在目标元素内运行脚本             |
| 拖动结束     | ondragend   | 在拖动操作结束时运行脚本                       |

## Web Worker

**Web Worker 可以通过加载一个脚本文件，进而创建一个独立工作的线程，在主线程之外运行**

**基本使用：**Web Worker 的基本原理就是当前 JavaScript 的主线程中，使用 Worker 类加载一个 JavaScript 文件来开辟一个新的线程，起到互不阻塞执行的效果，并且提供主线程和新线程之间数据交换的接口：postMessage丶onmessage。

**JS：**

```js
// worker.js
onmessage = function(evt) {
    var d = evt.data; // 通过 evt.data 获得发送来的数据
    postMessage(d);
}
```

**HTML：**

```js
<!DOCTYPE HTML>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html" charset="utf-8" />
    <script type="text/javascript">
        // Web 页主线程
        var worker = new Worker("worker.js"); // 创建一个 Worker 对象并向它传递将在新线程中执行的脚本的 URL
		worker.postmessage("hello world"); // 向 worker 发送数据
		worker.onmessage = function(evt) { // 接收 worker 传过来的数据函数
            console.log(evt.data); // 输出 worker 发送来的数据
        }
```

## Web Storage

Web Storage 是 HTML 新增的本地存储解决方案之一，但并不是取代 cookie 而指定的标准，cookie 作为 HTTP 协议的一部分用来处理客户端和服务器的通信是不可或缺的，session 正式依赖于实现的客户端状态保持。Web Storage 的意图在于解决本来不应该 cookie 做，却不得不用 cookie 的本地存储。

Web Storage 拥有 5M 的存储量，而 Cookie 却只有 4K，这个完全不能比的。

客户端存储数据有两个对象，其用法基本是一致。

localStorage：没有时间限制的数据存储

sessionStorage：在浏览器关闭的时候就会清除

```js
localStorage.setItem(key, value); // 保存数据
let value = localStorage.getItem(key); // 读取数据
localStorage.removeItem(key); // 删除某个数据
localStorage.clear(); // 删除所有数据
let key = localStorage.key(index); // 得到某个索引的值
```

## WebSocket

WebSocket 协议为 Web 应用程序客户端和服务端之间提供了一种全双工通信机制

特点：

- 握手阶段采用 HTTP 协议，默认端口是 80 和 403
- 建立在 TCP 协议基础上，和 HTTP 协议同属于应用层
- 可以发送文本，也可以发送二进制数据
- 没有同源限制，客户端可以与任意服务器通信
- 协议标识符是 ws（如果加密，为 wss），如 ws:localhost:8023





# 17. 图片格式

## 图片的类型

图片的类型目前就分为两种：

- 位图
- 矢量图

### 位图

所谓位图就是用像素点拼起来的图也叫点阵图，平时我们用到的 png丶jpg 等图片就是位图

<img src="https://segmentfault.com/img/bVbFYLP">

如上图，将一张图片放大可以看到一个一个小点点，这一个一个小点点就是图片的一个像素

### 矢量图

矢量图，也叫做向量图。矢量图并不记录画面上每一点的信息，而是记录了多元素形状和颜色的算法，当你打开一副矢量图的时候，软件对图形对应的函数进行计算，将运算结果图形的形状和颜色显示给你看。

无论显示画面是大还是小，画面上的对象对应的算法是不变的，所以即使对画面进行倍数相当大的缩放，它也不会像位图那样会失真。

常见的就是 SVG 格式的。

## 图片的压缩类似

### 无压缩

无压缩的图片格式不对图片数据进行压缩处理，能准确地呈现图片。例如 BMP 格式的图片

### 有损压缩

指在压缩文件大小的过程中，损失了一部分的信息，也即降低了图片的质量（即图片被压糊了），并且这种损失是不可逆的。

常见的有损压缩手段是按照一定的算法将最近像素点进行合并。压缩算法不会对图片所有的数据进行编码压缩，而是在压缩的时候，去除了人眼无法识别的图片细节。因此有损压缩可以在同等图片质量的情况下大幅度降低图片的体积。例如 jpg 格式的图片使用的就是有损压缩。

### 无损压缩

在压缩图片的过程中，图片的质量没有任何损耗。我们任何时候都可以从无损压缩过的图片中恢复出原来的信息。

压缩算法对图片的所有的数据进行编码压缩，能在保证图片的质量的同时降低图片的体积。例如 png 丶 gif 使用的就是无损压缩。

## 图片位数

**图片位数通常为 8 丶 16丶24丶32**

- 图片位数越大，能表示的颜色越多，同时占比的体积也越大。例如 8 位图片支持 256 钟颜色，即 2 的 8 次方。
- 图片位数越大，颜色过度也就越细腻，携带的色彩信息可以更加丰富
- 32位 跟 24 位的区别就是多了一个 Alpha 通道，用于支持半透明，其它的跟 24 位基本一样

## 常见的图片的格式

### GIF 

GIF 的全称是 Graphics Interchange Format，可译为图片交换格式，是在 1987 年由 Compu Serve 公司为了填补跨平台图像格式的空白而发展起来的。

GIF 采用的是 Lempel-Zev-Welch（LZW）压缩算法，最高支持 256 种颜色。由于这种特性，GIF 比较适合于色彩较少的图片，比如卡通造型丶公司标志等等。如果碰到 24 位真彩色的场合，那么 GIF 的表现力就有限了。

GIF 格式图片最大特点是 帧动画，相比古老的 bmp 格式，尺寸较小，而且支持透明（不支持透明，因为不支持 Alpha 透明通道）和电话。

**优点：**

- 体积小
- 支持动画

**缺点：**

- 由于采用了 8 位压缩，最多只能处理 256 种颜色

### JPEG/JPG

JPEG 是 Joint Photographic Experts Group（联合图像专家组）的缩写，文件后缀名位 .jpg 或 .jpeg，是常用的图像文件格式，由一个软件开发联合会组织制定，是一种有损压缩格式，能够将图像压缩在很小的存储空间，图像中重复或不重要的资料会被丢失，因此容易造成图像数据的损伤。尤其是使用过高的压缩比例，将使最终解压缩后恢复的图像质量明显降低，如果追求高品质图像，不宜采用过高压缩比例。

**优点：**

- 采用有损压缩，压缩后体积更小
- 支持 24 位真彩色
- 支持渐进式加载

**缺点：**

- 有损压缩会损坏图片的质量
- 不支持透明/半透明

渐进式 JPEG（propressive jpeg）图片及相关

渐进式 jpeg 是什么鬼？

先上两张图片压压惊

**普通JPG：**

<img src="https://segmentfault.com/img/bVbsRaM">

**渐进式 JPG：**

<img src="https://segmentfault.com/img/bVbsRaL">

从上面两张图可以看到，普通的 JPG 是从上往下加载图片的，在网络慢的时候尤其明显。

渐进式 JPG 包含多次扫描，这些扫描顺寻的存储在 JPG 文件中。打开文件过程中，会先显示出整个图片的模糊轮廓，随着扫描次数的增加，图片变得越来越清晰

### PNG

PNG 即便携带网络图形是一种无损压缩的位图片形格式，其设计的目的是视图替代 GIF 和 TIFF 文件格式，同时增加一些 GIF 文件格式所不具有的特性。PNG 使用 从 LZ77 派生的无损数据压缩算法，一般应用于 JAVA 程序，网页或 S60 程序中，原因是它压缩比高，生成文件体积小。

PNG 支持 8 位丶24 位丶32 位 3种，我们通常叫它们 PNG8 丶PNG32丶PNG32。

### PNG8

8 位的 PNG 最多支持 256（2 的 8 次方）种颜色，PNG8 有 1 位的布尔透明通道（要么完全透明，要么完全不透明）。

PNG8 格式与 GIF 图像类似，同样采用 8 位调色板将 RGB 彩色图像转换为索引彩色图像，图像中保存的不再是各个像素的彩色信息，而是从图像中挑选出的具有代表性的颜色编号，每个编号对应一种颜色，图像的数据量也因此减少，这对彩色图像的传播非常有利。

### PNG24

支持 2 的 24 次方种颜色，即 rgb 分别用 8 位，不支持透明。

注意：PNG24 是不透明的，是不透明的，是不透明的。

还有人就会说了，我用 PS 导出的 PNG 明明是 PNG24的，而且也选了透明了，出来的图就是透明的啊？为什么 PNG24 就不透明的了？

这个时候可以看图片详情，看看导出的图片位深度是不是 24的？

<img src="https://segmentfault.com/img/bVbFYMb">

如果是透明的话就是 32，否则就是 24，只是在你导出的时候 PS 偷偷帮你转了一下。

### PNG32

它是在 PNG 在 24 位的 PNG 基础上增加了 8 位的透明信息，支持不同程度的半透明效果，例如我们 CSS 设置rgba(0, 0, 0, 0.5)

**优点：**

- 无损压缩
- 支持透明丶半透明
- 最高支持 24 位真彩色图像以及 8 位灰度图像，从而彻底消除锯齿边缘

**缺点：**

- 与 JPG 的有损压缩相比，PNG 提供的压缩量较少
- 不支持动画，如需支持动画还得使用 APNG 

### APNG

APNG（Anmated Portable Network Graphics）是一个基于 PNG（Portable Network Graphics）的位图动画格式。实际上就是多张 PNG 组成的动画。 MAC 电脑打开看到组成 APNG  的每一张图。

**优点：**

- 支持 PNG 的所有优点
- 支持动画

**缺点：**

- 浏览器支持情况较差

<img src="https://segmentfault.com/img/bVbFYMl">

### WebP

WebP 是 Google 最初在 2010 年发布，目标是减少文件大小。它能同时支持无损压缩和有损压缩

它几乎集成了以上所有图片的优点，并且能够拥有更高的压缩率，我们可以看以下两张图的体积，一张是压缩后的 jpg，一张是 WebP。

jpg:

<img src="https://segmentfault.com/img/bVbFYMq">

webp:

<img src="https://segmentfault.com/img/remote/1460000022359582">

可以看到，WebP 的体积要比 JPG 的还要小差不多 50%

悲剧的是，WebP 支持率优点感人

<img src="https://segmentfault.com/img/bVbFYMv">

### SVG

SVG 是一种用 XML 定义的语言，用来描述二维矢量及矢量/栅格图形。SVG 提供了 3 种类型的图形对象：矢量图形（例如：由直线和曲线组成的路径）丶图像丶文本。图像对象还可进行分组丶添加样式丶变换丶组合等操作，特征集包括嵌套变换丶剪切路径丶alpha蒙板丶滤镜效果丶模板对象和其它拓展。SVG 图形是可交互和动态的，可以在 SVG 文件中嵌入动画元素或通过脚本来定义动画。

SVG 与上面图片不同的是它是矢量图，无论你怎么放大，它都不会失真；同时 SVG 文件通常要比 JPEG 和 PNG 格式的文件要小很多。

**优点：**

- SVG  可被非常多的工具读取和修改（比如记事本）
- SVG 与 JPEG 和 GIF 图像比起来，尺寸更小，且可压缩性更强
- SVG 是可伸缩
- SVG 图像可在任何的分辨率下被高质量地打印
- SVG 可在图像质量下不下降地情况下被放大
- SVG 可以与 JavaScript 技术一起运行
- SVG 文件是纯粹地 XML 

**缺点**

- 渲染成本相对于其它格式图片比较高，对于性能有影响
- 需要学习成本，因为 SVG 是一种用 XML 定义的语言

### SVGA 

SVGA 其实就是一个动画的播放引擎

当设计需要输出复杂动画的适合可以考虑输出 svga 格式的文件。相比 bodymovin 输出的 json 文件要小很多。

**优点：**

- 可以控制动画的播放与暂停，还可以监听动画的播放状态
- 体积相对于 apng 更小
- 可以随意地放大缩小而不失真
- 浏览器兼容性良好

**缺点：**

- 需要 JS 解析，同一个页面不宜使用过多 svga 动画，否则会消耗过多的性能





# 18. 谈谈css预处理器机制

在写 CSS 的时候我们会发现，为了兼容浏览器等原因，我们往往需要写很多冗余的代码，CSS 预处理器就是为了解决 CSS 的这些问题，简化 CSS 代码的编写。

**目前主流的 CSS 预处理器是 Sass丶Less 和 Stylus，它们不同于 CSS 的特性大概就是：**

- 基本语法
- 嵌套语法
- 变量
- @import
- 混入
- 继承
- 函数
- 逻辑控制

**分类：**

- **Sass：2007 年诞生，最早也是最成熟的 CSS 预处理器，拥有 ruby 社区的支持和 Compass 这一强大的 CSS 框架，目前受 Less 影响，已经进化到了全面兼容 CSS 和 SCSS**

- **Less：2009 年出现，受 Sass 的影响较大，但又使用 CSS 的语法，让大部分开发者和设计师更容易上手，在 ruby 社区之外支持者远超 Sass，其缺点是比起 Sass 来，可编程功能不够，不过优点是简单和兼容 CSS，反过来也影响了 Sass 演变到了 SCSS 的时代，著名的 Twitter Boostrap 就是采用 Less 做底层语言的。**

- **Stylus：2010 年产生，来自 Node.js 社群，主要用来给 Node 项目进行 CSS 预处理支持，在此社区之内有一定支持者，在广泛的意义上人气还完全不如 Sass 和 Less。**

**另外，用过 PostCSS 是什么？和日常使用的 CSS 预处理器有什么区别？有什么优势？CSS 预后处理器什么？**

PostCSS 是一个使用 JS 插件来转换 CSS 的工具。这些插件可以支持使用变量，混入（mixin），转换未来的 CSS 语法，内联图片等操作。

简而言之，PostCSS 可以将 CSS 转换成 JavaScript 可以操作的数据格式。基于 JS 写的插件可以完成上面所说的那些操作。

PostCSS 本身不会对 CSS 代码作任何修改，它只是为插件提供了一些接口，方便插件完成它们各自的功能。

**重要：PostCSS 不是预处理器！**





# 19. 说说z-index有什么需要注意的地方

## 层叠水平

一个 DOM 元素，在不考虑层叠上下文的情况下，会按照层叠水平决定元素在 Z 轴上的显示顺序，通俗易懂地讲，不同的 DOM 元素组合在一起发生重叠的时候，它们的显示顺序会遵循层叠水平的规则，而 z-index 是用来调整某个元素显示顺序，使该元素能够上浮下沉。

<img src="https://pic2.zhimg.com/80/v2-1ec9491a660c0e11b7272633976da869_720w.jpg">

可以看出，层叠水平规范了元素层叠时候的呈现规则，有了这个规则，我们也就不难解释为何之前例子中红色方格会覆盖蓝色方格。因为当你设置了 position: relative 属性后，元素 z-index: auto 生效导致层叠水平提升，比普通内联元素来的高，所以红色方格显示在上方。

元素层叠水平相当

那么当两个元素层叠水平相同的时候，这时候就要遵循下面两个准则：

- 后来居上原则
- 谁 z-index 大，谁在上的准则

570  943  093

怎么更新强缓存
进程和线程区别
回调函数一定是异步函数

看出

所以在设置 z-index 要注意：

- 先想有没有必要，可以用其它布局方式解决就用其它解决
- 子孙元素就不要有弹窗，将弹窗拿出来与其并列
- 设置的 z-index 会对并列的定位元素产生什么影响，如果覆盖了兄弟节点，那也等于覆盖了兄弟节点的所有的子孙元素
- 如果两个定位元素，没有设置 z-index，即没有创建层叠上下文，所以其和它们的子孙元素（除了创建层叠上下文的子孙元素（不包括元素本省））











### 熟悉CSS3动画么

前端如何兼容老的 API

熟悉 CSS3动画吗

前端如何兼容来的 API









