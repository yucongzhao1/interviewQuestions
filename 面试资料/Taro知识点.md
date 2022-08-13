# 1. Taro 1/2 及 Taro 实现原理

Taro1/2 是编译类型的小程序跨平台框架

<img src="https://img-blog.csdnimg.cn/20210112181358599.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MjA3OTQ4,size_16,color_FFFFFF,t_70">

Taro 是使用 React 进行小程序构建的。

React 与小程序之间最大的差异就是它们的模板了，在 React 中，是属于 JSX 来作为组件的模板的，而小程序则是使用字符串模板的。

## 模板转换

Taro 首先要实现的就是进行模板转换，把 JSX 语法转换成可以在小程序运行的字符串模板。

模板转换的实现：

模板转换主要是通过静态编译实现的，分为 解析丶转换丶生成 三个阶段。

- 解析过程：babel 的核心编辑器 bablyon 是支持对 JSX 语法解析的，Taro 框架利用这个编辑器将 JSX 通过词法丶语法分析丶生成抽象树。

  > 非常幸运的是 babel 的核心编辑器 babylon 是支持对 JSX 语法的解析，我们可以直接利用它来帮我们构造 AST，而我们需要专注的核心就是如何对 AST 进行转换操作，得出我们需要的新 AST，再将新的 AST 进行递归遍历，生成小程序的模板。

- 转换过程：针对已经生成的 AST（抽象语法树），Taro 框架会使用已经定义好的转换操作以及多端的组件库则对它进行转换修改

  > - 经 @tarojs/transformer-wx 转换，输出微信小程序模板
  >
  > - @taro/components：支持 Web 环境 Nerv 组件库，通过编译替换成目标平台的原生标签/组件
  > - @tarojs/taro-components-rn：支持 ReactNative 环境的 React 组件库

- 生成过程：将新的 AST 进行递归遍历，生成小程序的模板

## 逻辑转换

除了模板转换，还需要进行逻辑代码的转换，由于各端 API 存在差异，如网络请求丶数据缓存等，所以为了弥补不同端的差异，Taro 定制了统一的 API 标准，同时还为不同的端编写了相应的运行时框架，这些 API 可以直接使用，不用关心当前平台是否支持，因为运行时框架会抹平这些 API 差异

> 组件库以及端能力都是依靠不同的端做不同实现来抹平差异

逻辑转换的实现：

运行时框架负责适配各端能力，以支持跑在上面的 Taro 业务代码，主要有 3 个作用：

- 适配组件化方案丶配置选线等基础 API
- 适配平台能力相关的 API（如网络请求丶支付丶拍照等）
- 提供一些应用级的特性，如事件总线（Taro.Eevents丶Taro.eventCenter）丶运行环境相关的 API （Taro.getEnv() 丶Taro.ENV_TYPE）丶UI 适配方案（Taro.initPxTransform()）等

实现上，@tarojs/taro 是 API 适配的统一入口，编译时分平台替换：

@tarojs/taro：只是一层空壳，提供 API 签名：

平台适配相关的 package 有 6 个：

- tarojs/taro-alipay: 适配支付宝小程序
- tarojs/taro-h5：适配 Web
- tarojs/taro-rn：适配 ReactNative
- @tarojs/taro-swan：适配百度小程序
- @tarojs/taro-tt：适配头条小程序
- tarojs/taro-qapp：适配快应用

taro 通过模板转换和逻辑转换，实现了跨平台多端构架小程序

<img src="https://img-blog.csdnimg.cn/20210112181221583.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MjA3OTQ4,size_16,color_FFFFFF,t_70">

## 限制：

限制方面感受最深的应该是 JSX，毕竟 JSX 的灵活性令人发指（动态组件丶高阶组件），同时微信小程序的模板语法又限制极多（即使通过 WXS 这个补丁增强了一部分能力），这就出现了一个不可调和的矛盾，因此：

> JSX 的写法极其灵活多变，我们只能通过穷举的方式，将常用的丶React 官方推荐的写法转换规则加以支持，而一些比较生僻的，或者是不可推荐的写法则不做支持，转而以 eslint 插件的方式，提示用户进行修改

具体的，JSX 限制如下：

- 不支持动态组件
- 不能再包含 JSX 元素的 map 循环中使用 if 表达式
- 不能使用 Array#map 之外的方法操作 JSX 数组
- 不能在 JSX 参数（props）中传入 JSX 元素
- 只支持 class 组件
- 暂不支持在 render() 之外的方法定义 JSX
- 不能在 JSX 参数中使用对象展开符
- 不支持无状态组件（函数式组件）
- props.children 只能传递不能操作

对于这些转换限制，弥补性方案是 Lint 检查报错，并提供代替方案

除了 JSX 外，还有 2 点比较大的限制：

- CSS：受限于 ReactNative 的 CSS 支持程序（只能使用 flex 布局）
- 标签：约定不要使用 HTML 标签（都用多端适配过的内置组件，如 View丶Button）

补充：

- 仅仅将代码按照对应语法规则转换过去后，还远远不够，因为不同端会有自己的原生组件，端能力 API 等等，代码直接转换过去后，可能不能直接执行。例如，小程序中普通的容器组件用的是 view，而在 H5 中则是 div；小程序中提供了丰富的端能力 API，例如网络请求丶文件下载丶数据缓存等，而在 H5 中对应功能的 API 则不一致
- 可能有些人会有疑问，既然是为不同端实现了对应的组件库与端能力 API（小程序除外，因为组件库和 API 的标准都是源自小程序），那么是怎么能够只写一份代码就够了呢？因为我们有编译的操作，在手写代码的时候，只需要引入标准组件库 @tarojs/components 与运行时框架 





# 2. 京东小程序 Taro 开发对比原生开发测评

## 性能对比

**针对性能的问题，我们分别测试了 Taro 空项目的包大小和 Taro 在长列表中的表现。因为包大小会影响小程序的首次加载速度，而长列表则是常常出现性能瓶颈的场景。**

### Taro 空项目包大小

目前各小程序都对主包的大小进行限制，如京东小程序限制为 5 M丶微信小程序限制为 2 M。这是因为初次进入的速度对于用户的体验非常地关键，而主包体积越大下载的时间就最大。因此小程序框架的大小也成为了开发前框架选型的主要指标之一，倘若框架体积过大，就会压缩业务逻辑的可用空间。

**下列图片分别是 Taro 运行时框架压缩前后的大小，可以看到压缩后仅为 84 K，对主包空间的影响十分小。**

压缩前：

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/7/171ecef249d257b5~tplv-t2oaga2asx-watermark.awebp">

压缩后：

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/7/171ecef280af79be~tplv-t2oaga2asx-watermark.awebp">

 

### 长列表渲染表现

#### benchmark 介绍

我们创造 js-framework-benchmark 编写了一份 benchmark，测试对比了 Taro 代码与原生代码在长列表场景下的渲染表现。

**测速指标：**

- 初始化：从进入页面开始到 40  个商品
- 创建：页面 onLoad 后创建 40 个商品
- 增加：往已创建了 40 个商品的列表中每次增加 20 个商品
- 部分更新：在 400 个商品中更新每 10 个商品的名称
- 交换：在 400 个商品中交换其中两个商品的位置
- 选中：点击商品图片，改变视频名称的字体颜色

**计时点**

**Taro：**

开始：事件响应函数的顶部

结束：setData 回调函数的顶部

**原生小程序：**

开始：事件响应函数的顶部

结束：setData 回调函数的顶部

**其它**
benchmark 仓库：Github

Taro 版本：1.3.21

测试机型：魅蓝 note

测试方法：每组测试 10 条数据，去除其中最大值与最大值后平均值

#### 测试结果

**因为在京东小程序与微信小程序中，setData 的 callback 的触发时机稍有不同，所以分出列出**

| 操作     | Taro jd | 原生京东小程序 |
| -------- | ------- | -------------- |
| 初始化   | 150     | 123            |
| 创建     | 87      | 85             |
| 部分更新 | 125     | 235            |
| 交换     | 140     | 213            |
| 选中     | 131     | 155            |
|          |         |                |

| 操作     | Taro weapp | 原生微信小程序 |
| -------- | ---------- | -------------- |
| 初始化   | 1155       | 1223           |
| 创建     | 500        | 408            |
| 部分更新 | 167        | 307            |
| 交换     | 252        | 309            |
| 选中     | 193        | 178            |

**经测试发现，列表的长度会对增加操作的耗时产生影响：列表越长，增加操作的耗时越久。因此不能简单地对 N 此增加操作平均增加耗时。这里我们选择使用折线图来展现出随增加操作次数的变化，渲染耗时的变化趋势。**

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/7/171ecef2b110f103~tplv-t2oaga2asx-watermark.awebp">

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/7/171ecef33a8271ec~tplv-t2oaga2asx-watermark.awebp">

#### 测试结论

**创建**

**在创建时，Taro 会对数据做一些数据，因此会比原生稍慢。**

**初始化**

初始化与创建相比，差别是引入了页面构建耗时。即**初始化耗时 = 页面构建耗时 + 创建操作耗时。**

Taro 在页面初始化丶创建操作时都会对数据进行处理，因此整个初始化耗时会比原生稍慢。

**那为什么微信小程序中 Taro 初始化耗时更短呢？在 benchmark 中 Taro 和原生分别在 componentWillMount 和 onLoad 渲染列表，而 Taro 使用 Component 构造页面，componentWillMount 其实是在 attach 生命周期中触发。因为在微信小程序中 attached 比 onload 早触发得多，所以会出现如此现象。**

**选中**

因为 Taro 只是把回调函数包装了一层，处理了事件参数和 this 等，所以和原生得速度相当。

**部分更新丶交换丶增加**

Taro 的速度会优于原生。原因是 Taro 会先对将要 setData 的数据和当前 data 的数据做一次 diff，这能够大大减少 setData 的数据量，加快渲染速度。对比两个折现图可以得知，数据量越大，diff 的优化收益也越大。

### Taro 对小程序的性能优化

#### setData

在小程序中，性能的问题主要在于单次 setData 数据量过大和频繁调用 setData 上。Taro 利用 diff 解决了单次 setData 数据量过大的问题，而对于频繁调用 setData 也有解决的方法。

Taro 的 setData 遵循 React 规范，不同于 setData 的同步更新，它会异步地去更新视图。因此假设开发者在单次循环中多次调用 setState，最后也只会在下一次事件循环中进行一次 setData。

#### 跳转预加载

小程序由 A 页面跳转到 B 页面地过程中，从 A 页面发起跳转到 B 页面触发 onLoad，有着 300~400 毫秒的延时。Taro 提供了 componentWillPreload 钩子，钩子会在跳转后立即执行。开发者可以尽早地在钩子里做一些数据拉取的工作，相比在 onLoad 触发后再去拉取数据就能够 300~400 毫秒的延时。

#### shouldComponentUpdate & Taro.PureComponent

开发者的 Class Component 可以继承 Taro.PureComponent，这样组件在更新前会对新旧 props 和新旧 state 各做一次浅对比，避免不必要的更新。当然开发者可以自己实现 shouldComponentUpdate，通过手动控制新旧 props 和新旧 state 的对比，决定是否更新组件。

#### Taro.memo

如果开发者书写的是函数式组件，则可以利用 Taro.memo 实现 shouldComponentUpdate 的相同功能。

## 开发者体验对比

### 语法

京东小程序的原生语法和微信小程序相仿，都是类 MVVM 语法，没有接触过小程序的开发者有一定学习成本。另外样式语法为 CSS 的子集，其中自适应尺寸单位为 rpx，这样意味着如果我们需要 CSS 预处理时需要手动配置工作流，并且在编写样式时处处注意尺寸单位的转换。

目前 Taro 遵循 React 语法（将来会支持所有 Web 前端框架），JSX 令我们的代码更加灵活。因此拥有 React 开发经验的开发者可以马上上手 Taro 的开发工作。在样式方面 Taro 支持在创建项目时是否属于 CSS 预处理器，选择后自动配置相应的工作流。对于样式单位 Taro 也会把用户编写的 px 数值自动转换成相应的 rpx 数值，开发者无需再分心处理各平台的样式单位。

### 开发生态

微信小程序经过不断迭代，相继推出了插件系统和支持引用 npm 包的功能。但京东小程序暂不支持前两者，京东小程序社区也没打造出来，开发者资源十分贫乏。

Taro 中不但能自由引用 npm  包，而且还大量支持 React 社区中沉淀的优秀工具和库，如 react-redux丶mobx-react 等。

### 开发者辅助

京东小程序原生不支持 Typescript，只能在 IDE 的编辑器中有自动补全功能，编码效率不高，同时也容易出错。

Taro 完美支持 Typescript，自带代码智能提示和代码实时检查功能，能让开发‘效率大大提示。

## 写在最后

看到这里大家会问，Taro 性能真的优于原生吗？其实不然，针对每个场景，我们都可以用原生写出性能最佳的代码。但是这样做工作量太大，实际项目开发中需要掌握效率与优化之间的平衡。Taro 的优势在于能让我们在书写更有效率的代码丶拥有更丰富的生态的同时，还带来了不错的性能。





# 3. 京喜首页（微信购入口）跨段开发与优化实践

## 背景介绍

随着今年的双十一落下帷幕，京喜（原京东拼购）也迎来了首捷。双十一前夕微信购物一级入口切换为京喜小程序，项目顺利通过亿级的流量考验，在此与大家分享一点自己参与的工作。

在接手项目前，京喜业务已在线上运行较长时间。但经过一段时间迭代维护后，发现首页存在以下问题：

- H5 版本首页针对不同渠道开发了多套页面，对开发者维护和内容营运来说存在较大挑战，需要投入大量人力成本
- 项目技术栈不统一，分别有传统 H5 开发丶原生小程序开发丶mpVue 框架开发丶严重影响项目复杂度，迭代过程苦不堪言
- H5丶小程序以及 RN 三端存在各自构建和发布流程，涉及较多工具及复杂系统流程，影响业务交付效率

综上所述，京喜迎来一次改版契机

## 改变目标

从前端角度来看，本次改版要实现以下目标：

- 升级并统一项目技术栈，解决项目技术栈混乱的现状
- 使用一套代码，适配微信入口丶手Q入口丶微信小程序丶京东 APP丶京喜 APP丶M 站六大业务场景，减少多套页面的维护成本，提升交付效率
- 通过让 RN 技术在业务上的落地，完善团队在 App 端的技术储备
- 优化页面性能及体验，为下沉市场用户提供优质的产品体验

## 技术选型

京喜业务拥有非常丰富的产品形态，涵盖了 H5丶微信小程序以及独立 APP 三种不同的端，对支持多端的开发框架有着天然的需求

<img src="https://img14.360buyimg.com/ling/jfs/t1/99778/13/1485/65058/5dc00468E7d60a4e0/5bb82c1ec5ce3dd7.jpg">

在技术选型上，我们选择团队自研的 Taro 多端统一开发解决方案

> Taro 是一套遵循 React 语法规范的多端开发解决方案
>
> 现如今市场上端的形态多种多样，Web丶React-Native丶微信小程序等各端大行其道，当业务要求同时在不同的端都要求有所表现的时候，针对不同端编写多套代码的成本显然非常高，这时候只编写一套代码就能适配多端的能力就显得极为需要。
>
> 使用 Taro，我们可以只书写一套代码，再通过 Taro 的编译工具，将源代码分别编译出可以在不同端（微信/百度/支付宝/字节跳动/QQ 小程序丶快应用丶H5丶React-Native 等）运行的代码

选它有两个原因，一是 Taro 已经成熟，内部和外部都有大量实践，内部有京东 7ERESH丶京东到家等，外部有淘票票丶猫眼等多个案例，可以放心投入到业务开发；二是团队成员都拥有使用 Taro 来开发内部组件库的校验，对业务快速完成有保障

<img src="https://img13.360buyimg.com/ling/jfs/t1/98736/39/2685/263027/5dd3b44dE4cc40299/6e5a359d73f0ef7f.png">

## 开发实录

由于首页改版的开发排期并不充裕，因此充分地复用已有基础能力（比如像请求丶上报丶跳转等必不可少地公共类库），能大量减少我们的重复的工作量。话虽如此，但在三端统一开发过程中，我们仍遇到不少问题也带来解决方案，以下我们一一阐述

### H5 篇

我们所有的页面都依赖现有业务的全局公共头尾及搜索栏等组件，这就不可避免的需要 Taro 开发流程融入到现有开发和发布流程中去。同时公共组件都是通过 SSK 的方式引入和维护，为了能在运行 np  run dev:h5 时预览到完整的页面效果，需要对 index.html 模板中的 SSL 语法进行解析，index.html 模板文件代码结构如下：

```js
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>京喜</title>
  <!--#include virtual="/sinclude/common/head_inc.shtml"-->
</head>
<body>
  <div id="m_common_header" style="display:none;"></div>
  <!--S 搜索框-->
  <div id="search_block" class="search_block"></div>
  <div id="smartboxBlock" style="display:none;"></div>
  <!--E 搜索框-->
  <div id="app" class="wx_wrap"></div>
  <!--#include virtual="/sinclude/common/foot.shtml"-->
</body>
</html>
```

可以看到模板中存在很多类似 `<!-- #include virtual="..." -->` 格式的代码，这些就是通过 SSL 方式引入的 H5 公共组件，它的 virtual 属性指向的文件不存在于本地而是存在于服务器上的，所以我们遇到的第一个问题就是在本地如何解析这些文件，确保能预览到完整的页面效果，不然开发调试起来就非常的低效。好在 Taro 有暴露除 webpack 的配置，我们可以通过引入自定义加载器（这里叫 ssi-loader）来解析这些代码的路径，然后请求服务器上的文件内容进行替换即可，要实现这个功能只需在项目的 config/dev.js 中加入如下代码即可：

```js
module.exports = {
    h5: {
        webpackChain(chain, webpack) {
            chain.merge({
                module: {
                    rule: {
                        ssiLoader: {
                            test: /\.html/,
                            use: [
                                {
                                    loader: "html-loader"
                                },
                                {
                                    loader: "ssi-loader",
                                    options: {
                                        locations: {
                                            include: "http://wqs.jd.com"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            })
        }
    }
}
```

这样就解决了本地开发调试难点，然后开开心心的进行页面开发

当页面开发完成之后，接下来遇到的问题就是如何将前端资源部署到测试和生产环境。由于现有的开发和发布流程都是基于内部已有的平台，我们临时定制一套也不现实，所以需要将它融入到 Taro 的流程中去，这里我们引入了 gulp 来整合各种构建和发布等操作，只要构建出符合发布规范的目录即可利用它的静态资源构建丶版本控制及服务器发布等能力，这样我们就打通了整个开发和发布流程。

这套拼凑出来的流程还存在不少的问题，对于新接手的同学有一点小繁琐，有着不少改善的空间，这也是接下来的重点工作方向。另外 Taro 的 H5 端之前是基于 SPA 模式，对于有着多页需求的项目来说不太友好，当时反馈给 Taro 团队负责 H5 的同学，很快得到了响应，目前 Taro 已支持 H5 多页开发模式，支持非常迅速。

### 小程序篇

由于开发完 H5 版之后，对应的业务逻辑就处理完了，接下来只需要处理小程序下的一些特殊逻辑（比如分享丶前端测速上报等）即可，差异比较大的就是开发和发布流程。

这里讲一下如何在一个原生小程序项目中使用 Taro 进行开发，因为我们的 Taro 项目跟已有的原生小程序目录是独立的两个项目，所以需要将 Taro 项目的小程序代码编译到已有的原生小程序项目目录下，第一步要做的就是调整 Taro 配置 config/index，指定编译输出目录以及禁用 app 文件输出防止覆盖已有文件

```js
const config = {
    // 自定义输出根目录
    outputRoot: process.argv[3] === "weapp" ? '../.temp' : 'dist',
    // 不输出 app.js 和 app.json 文件
    weapp: {
        appOutput: false
    }
}
```

由于京喜以前是主购小程序的一个栏目，后面独立成了独立的小程序，但是核心购物流程还是复用的小程序，所以这让情况变得更加复杂。这里还是通过 gulp 来进行繁琐的目录文件处理，比如我们的小程序页面和组件都需要继承主购小程序的 JDPage 和 JDComponent 基类，所以在进行文件复制之前需要进行代码替换，代码如下：

```js
// WEAPP
const basePath = `../.temp`
const destPaths = [`${basePath}/pages/index/`, `${basePath}/pages/components/`]
const destFiles = destPaths.map(item => `${item}**/*.js`)

/*
 * 基类替换
 */
function replaceBaseComponent (files) {
  return (
    gulp
      .src(files || destFiles, { base: basePath })
      .pipe(
        replace(
          /\b(Page|Component)(\(require\(['"](.*? "'"")\/npm\/)(.*)(createComponent.*)/,
          function(match, p1, p2, p3, p4, p5) {
            const type =
              (p5 || '').indexOf('true') != -1 ||
              (p5 || '').indexOf('!0') != -1
                ? 'Page'
                : 'Component'
            if (type == 'Page') p5 = p5.replace('))', '), true)') // 新：page.js基类要多传一个参数
            const reservedParts = p2 + p4 + p5
            // const type = p1
            // const reservedParts = p2
            const rootPath = p3

            const clsName = type == 'Page' ? 'JDPage' : 'JDComponent'
            const baseFile = type == 'Page' ? 'page.taro.js' : 'component.js'

            console.log(
              `🌝 Replace with \`${clsName}\` successfully: ${this.file.path.replace(
                /.*?wxapp\//,
                'wxapp/'
              )}`
            )
            return `new (require("${rootPath}/bases/${baseFile}").${clsName})${reservedParts}`
          }
        )
      )
      .pipe(gulp.dest(basePath))
  )
}

// 基类替换
gulp.task('replace-base-component', () => replaceBaseComponent())
```

还有很多类似这样的骚操作，虽然比较麻烦，但是只需要处理一次，后续也很少改动、

### RN 篇

对于 RN 开发，也是第一次将它落地到实际的业务项目中，所以大部分时候都是伴随着各种未知的坑不断前行，所以这里也友情提示一下，对于从未使用过的技术，还是需要一些耐心的，遇到问题勤查勤问。

由于京喜 APP 是复用京东技术栈的基础框架和 JDReact 引擎，所以整个的开发和部署都是遵循 JDReact 已有的流程，画了一张大致的流程图如下：

<img src="https://img10.360buyimg.com/ling/jfs/t1/84738/19/1551/59434/5dc02754E930f59f2/ebe7b01308771a91.png">

> JDReact 平台是在 Facebook ReactNative 开源框架基础上，进行了深度二次开发和功能拓展。不仅打通了 Android/IOS/Web 三端平台，而且对京东移动端基础业务能力进行了 SDK 级别的封装，提供了统一丶易于开发的 API。业务开发者可以通过 JDReact SDK 平台进行快速京东业务开发，并且不依赖发版就能无缝集成到客户端（android/IOS）或者转换成 Web 页面进行线上部署，真正实现了一次开发，快速部署三端

由于京喜 APP 的 JDReact 模块都是独立的 git 仓库，所以需要调整我们的 Taro 项目配置 config/index.js 的编译输出路径如下：

```js
rn: {
    outPath: '../jdreact-jsbundle-jdreactpingouindex'
}
```

这样，当我们运行 yarn run dev:rn 进行本地开发时，文件自动编译到了 JDReact 项目，接下来我们就可以用模拟器或者真机来进行预览调试了。当我们在进行本地开发调试的时候，最高效的方法还是推荐用 Taro 官方提供的 taro-native-shell 原生 React Native 壳子来哦启动我们的项目，详细的配置参考该项目的 README 进行配置即可。

由于 React Native 官方提供的 Remote Debugger 功能非常弱，推荐使用 React Native Debugger 来进行本地 RN 调试，提供了更为丰富的功能，基本接近 H5 的小程序的调试体验

<img src="https://img20.360buyimg.com/ling/jfs/t1/93257/12/1534/249244/5dc0282eE862961c6/bf7b8367ac970ecf.png">

这样我们就拥有了一个正常的开发调试环境，接下来就可以进行高效的开发了，由于我们前面在 H5 和小程序版本阶段已经完成了绝大部分的业务逻辑开发，由于我们前面在 H5 和 小程序版本阶段已经完成了绝大部分的业务逻辑开发，所以针对 RN 版本的主要工作集中在 IOS 和安卓不同机型的样式和交互上

在样式适配上这块，不得不提下 Taro 针对我们常见的场景提供了一些最佳实践，可以作为布局参考：

- 固定尺寸（按钮丶文字大小丶间距）写 PX/Px/pX
- 保持宽高比（比如 banner 图片）：Image 组件处理
- 间距固定，内容自适应（比如产品卡片宽度）：使用 flex 布局
- 按屏幕等比缩放：使用 px 单位，编译时处理（scalePx2dp 动态计算）

#### Taro RN 最佳实践集锦

在实际开发过程中也遇到不少兼容性问题，这里整理出来以供大家参考：

- 文本要用 `<text>` 标签包起来，因为 RN 没有 textNode 的概念

- 使用 Swiper 时在外面包一个 View，否则设置 margin 后会导致安卓下高度异常

- Cannot read property 'x' of undefined，Swiper 底层使用的 react-native-swiper 导致的问题，Disable Remote JS Debug 就不会出现

- 图片默认尺寸不对，RN 不会自动帮助设置图片尺寸，而是交给开发者自己处理，故意这样设计的

- Image 组件上不可以设置 onClick

- 实现基线对齐：vertical-align: baseline，用`<text>` 把需要基线对齐的组件包住即可

  ```js
  <Text>
      <Text style={{ fontSize: 20 }}>abc</Text>
   	<Text style={{ fontSize: 40 }}>123</Text>
  </Text>    
  ```

- 尽量避免使用 line-height，在安卓和 IOS 下表现不一致，而且即使设置与 fontSize 相同也会导致裁剪

- android 调试生产环境的 bundle，摇手机，选 Dev Setting，取消勾选第一项 Dev 即可

- IOS 调试生产环境的 bundle，AppDeleteagte.m 中增加一行语句关闭 dev 即可

  ```js
  [[RCTBundleURLProvider sharedSettings] setEnableDev:false];
  // 找到这行，并在它的上面增加上面这行
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  ```

- `<text> `与 `<View>` 支持的 style 属性也不相同

  ```js
  > [Text Style Props](https://facebook.github.io/react-native/docs/text-style-props "Text Style Props") & [View Style Props](https://facebook.github.io/
  ```

  react-native/docs/view-style-props)

- render 方法中不要返回空字符串

  下面的代码在 android 下会报错（empty_string 内容为空字符串）

  ```js
  <View>
    {empty_string && <Text></Text>}
  </View>
  ```

​       因为 empty_string && <Text></Text> 的返回值是空字符串，RN 尝试把字符串添加到 View 的 children 时在安卓环境下会报错

```js
Error: Cannot add a child that doesn't have a YogaNode
```

- border-radius 导致背景颜色异常，单独给某个角度设置圆角时，没有设置圆角的变块会出现一块与背景颜色相同，但半透明的色块

  - 添加外层容器设置圆角和超出隐藏
  - 全部角都设置圆角然后使用 transform: translate 藏起不想要的圆角

- 透明 View 无法点击的问题，给设置了 onClick 的元素提交透明背景色即可

  ```js
  style={{ backgroundColor: "transparent" }}
  ```

  不可以用 scss 写，只有写在 JSX 上的才有效，Taro 编译时可能把透明背景色忽略了

- 一像素缝隙问题

   可能是 RN 布局引擎的问题，或单位转换以及浏览器渲染中的精度损失问题。可以调整页面结果来绕过。或者普通粗暴一点，设置负 margin 值盖住缝隙

### 跨平台开发

#### JS 文件

**文件拆分的方式**

要完美的编译出三端代码，首先要解决的是公共类库的适配问题，好在兄弟业务团队已经沉淀有完成度比较高的三端公共库，利用 Taro 提供的跨平台开发能力，抹平三端方法名和参数不统一的情况，即可很好的解决公共类库的适配问题，如下所示：

```js
.
├── goto.h5.js
├── goto.rn.js
├── goto.weapp.js
├── request.h5.js
├── request.rn.js
├── request.weapp.js
└── ...
```

以 request 公共组件为例，三端代码如下：

**request.h5.js**

```js
import request from '@legos/request'
export { request }
```

**request.rn.js**

```js
import request from '@wqvue/jdreact-request'
export { request }
```

**request.weapp.js（由于小程序的公共组件没有发布至 npm，这里引用的本地项目源文件）**

```js
import { request } from '../../../common/request/request.js'
export { request }
```

如遇到需要适配的方法参数不一致或者增加额外处理的情况，可进行再包装确保最终输出的接口一致，如下：

goto.rn.js

```js
import jump from '@wqvue/jdreact-jump'

function goto(url, params = {}, options = {}) {
  jump(url, options.des || 'm', options.source || 'JDPingou', params)
}

export default goto
```

文件引入的时候我们正常使用就好，Taro 在编译的时候为我们编译对应的平台的文件

```js
import goto from './goto.js'
```

#### CSS 文件

以上是 JS 的代码处理方式，对于 CSS 文件及代码，同样也有类似的处理

**1. 文件拆分的方式**

比如 RN 相对于 H5 和小程序的样式就存在比较大的差异，RN 的支持的样式是 CSS 的子集，所以很多看起来很常见的样式是不支持的，可以通过以下方式进行差异化处理：

```
├── index.base.scss
├── index.rn.scss
├── index.scss
```

这里以 index.base.scss 作为三端都能兼容的公共样式（名字可以任取，不一定为 xxx.base.scss），`index.rn.scss` 则为 RN 端独特的样式，`index.scss`则为 H5 和小程序独特的样式，因为 H5 和小程序样式上基本上没有什么差异，这里合为一个文件处理。

**2. 条件编译的方式**

Taro 也支持样式文件内的条件编译，语法如下：

```js
/* #ifdef %PLATFORM% */
// 指定平台保留
/* #endif */

/* #ifndef %PLATFORM% */
// 指定平台剔除
/* #endif */
```

`%PLATFORM%` 的取值请参考 [Taro 内置环境变量](https://nervjs.github.io/taro/docs/envs.html)

以下为示例代码：

```js
.selector {
  color: #fff;
  /* #ifndef RN */
  box-shadow: 1px 1px 1px rgba(0, 0, 0, .1);
  /* #endif */
}
```

编译为 H5 和小程序的样式为：

```jks
.selector {
  color: #fff;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, .1);
}
```

RN 的样式为：

```js
.selector {
  color: #fff;
}
```

两种方式选其一即可，这样就能开开心心的编写业务代码了

有些许遗憾的是产品经理对这些新版本首页有着明确的上线优先级：先 H5 级，再微信小程序，最后是 RN 版，这就为后续 RN 版本跟 H5 和 小程序本分道扬镳埋下了伏笔，条件允许的话建议优先以 RN 版本为基准进行开发，以避免开发完成 H5 和小程序之后发现对结构和样式进行大的调整，因为 RN 对样式确实会弱些

### 性能优化

#### 图片优化

电商性质的网站，会存在大量的素材或商品图片，往往这些会对页面造成较大的性能影响。得益于京东图床服务，提供强大的图片定制功能，让我们在图片优化方面省去大量工作。以引入商品图片`"https://img10.360buyimg.com/mobilecms/s355x355_jfs/t1/55430/24/116/143859/5cd27c99E71cc323f/0e8da8810fb49796.jpg!q70.dpg.webp"`为样本，我们对图片应用做了部分优化

- 根据容器大小适当裁剪图片尺寸
- 根据网络环境设置图片品质参数
- 根据浏览器环境合理选择图片类型

为 Image 标签设置 lazyload 属性，这样可以在 H5 和小程序下获得懒加载功能

#### 接口聚拢直出

由于京喜首页的首屏数据涉及的后端接口多达 20 余个，导致整理数据返回时间较长；为了解决此项痛点，我们联合后端团队，独立开发首屏专用的聚合直出接口。一方面，将众多接口请求合并成一个，减少接口联动请求带来的性能损耗；另一方面，将复杂的业务逻辑挪移到后端处理，启动只负责视图渲染和交互即可，减少启动代码复杂度；通过此项优化，页面性能和体验得到极大改善。

#### 缓存优先策略

由于京喜业务主要围绕下沉市场，其用户群体的网络环境会更加复杂，要保障页面的性能，减少网络延时是一项重要措施

为了提升用户二次访问的加载性能，我们决定采用缓存优先策略。即用户每次访问页面时所请求的主接口数据写入本地缓存，同时用户每次访问都优先加载缓存数据，形成一套规范的数据读取机制。通过优先读取本地缓存数据，可让页面在极短时间内完成渲染；另外，本地缓存数据亦可作为页面兜底数据，在用户网络超时或故障时使用，可避免页面空窗期的情景出现。

<img src="https://img20.360buyimg.com/ling/jfs/t1/50956/35/15492/42652/5dc2eaecE30ebcffd/c7e8c52679a3f2fe.jpg">

#### 高性能瀑布流长列表

首页紧接着首屏区域的是一个支持下滑加载的瀑布流长列表，每次滑倒底部都会异步拉取 20 条数据，总计会拉取近 500 条数据，这在 IOS 下交互体验还比较正常。但是在配置较低的安卓机型下，当滑动到 2 到 3 屏之后就开始出现严重卡顿，甚至会闪退

针对这种场景也尝试用 FlatList 和 SectionList 组件来优化，但是它们都要求规则等高的列表条目，于是不得不自己来实现不规则的瀑布流无线滚动加载。其核心思想是通过判断列表的条目是否是视窗内来决定是否渲染，要优化得更彻底得话，甚至可以移除条目内所有内容只保留容器，以达到减少内容节点以及占用内容，不过在快速进行滑动时比较容易出现一片白框，算是为了性能损失一些体验，整体上来说是可以接受得

由于 RN 下在获取元素坐标偏移等数据相对于 H5 和小程序要麻烦得多，具体得实现细节看抽离

## 写在最后

<img src="https://img14.360buyimg.com/ling/jfs/t1/105266/16/1522/210358/5dc18d19E6401cb7a/ad1ab2372f08e6c4.jpg">

这篇文章从技术选型丶开发实录再到性能优化三个维度对京喜首页改版做了简单总结。整个项目实践下来，证实 Taro 开发框架已完全具备投入大型商业项目的条件。虽在多端开发适配上浪费了一些时间，但仍比各端独立开发维护工作量要少；在前端资源匮乏的今天，选择成熟的开发工具来控制成本丶提升效率，已是各团队的首要工作目标。同时，京喜作为京东战略级业务，拥有千万级的流量入口，我们对页面的体验优化和性能改进远远不止与此，希望每一次微笑的改动能为用户带来愉悦的感受，始终为用户提供优质的产品体验







# 4. 京喜小程序的高性能打造之路

## 背景

京喜小程序自从去年双十一上线微信购物一级入口后，时刻迎接着亿级用户量的挑战，细微的体验细节都有可能被无线放大，为此，”极致的页面性能“丶”友好的产品体验“和”稳定的系统服务“成为了我们开发团队的最基本执行原则

首页作为小程序的门户，其性能表现和用户留存率息息相关。因此，我们对京喜首页进行了一次全方位的升级改造，从加载丶渲染和感知体验几大维度深挖小程序的性能可塑性。

除此之外，京喜首页在微信小程序丶H5丶APP 三端都有落地场景，为了提高研发效率，我们使用了 Taro 框架实现了多端统一，因此下文中部分内容是和 Taro 框架息息相关的

## 怎么定义高性能？

提起互联网应用性能这个词，很多人在脑海中的词法解析就是，”是否足够块？“，似乎加载速度称为衡量系统性能的唯一指标。但这其实是不够准确的，试想一下，如果一个小程序加载速度非常块，用户花费很短时间就能看到页面的主体内容，但此时搜索框却无法输入内容，功能无法被流程使用，用户可能就不会关心页面渲染有多快了。所以，我们不应该单纯考虑速度指标而忽略用户感知体验，而应该全方位衡量用户在使用过程中能感知到的与应用加载相关的每个节点。

谷歌为 Web 应用定义了以用户为中心的性能指标体系，每个指标都与用户体验节点息息相关

| 体验               | 指标                                        |
| ------------------ | ------------------------------------------- |
| 页面能否正常访问？ | 首次内容绘制（First Contentful paint，FCP） |
| 页面内容是否有用？ | 首次有效绘制（First Meaningful paint，FMP） |
| 页面功能是否可用？ | 可交互时间（Time to Interactive，TTI）      |

其中，”是否有用“？这个问题是非常主观的，对于不同场景的系统可能会完全不一样的回答，所以 FMP 是一个比较模糊的概念指标，不存在规范化的数值衡量。

小程序作为一个新的内容载体，衡量指标跟 Web 应用是非常类似的。对于大多数小程序而言，上述指标对应的含义为：

- FCP：白屏加载结束
- FMP：首屏渲染完成
- TTI：所有内容加载完成

综上，我们已基本确定高性能的概念指标，接下来就是如何利用数值来描绘性能表现

### 小程序官方性能指标

小程序官方针对小程序性能表现制定了权威的数值指标，主要围绕 渲染表现，setData 数据量丶元素节点数 和 网络请求延时 这几个维度来给予定义（下面只列出部分关键指标）：

- 首屏时间不超过 5 秒
- 渲染时间不超过 500 ms
- 每秒调用 setData 的次数不超过 20 次
- setData 的数据在 JSON.stringify 后不超过 256 K
- 页面 WXML 节点少于 1000 个，节点树深度少于 30 层，子节点数不大于 60 个
- 所有网络请求都在 1 秒内返回结果

> 详见 小程序性能评分规则

我们应该把这一系类的官方指标作为小程序的性能及格线，不断地打磨和提升小程序的整体体验，降低用户流失率。另外，这些指标会直接作为小程序体验评分工具的性能评分工具规则（体验评分工具会根据这些规则的权重和求和公式计算出体验得分）

我们团队内部在官方性能指标的基础上，进一步浓缩优化指标系数，旨在对产品体验更高要求：

- 首屏时间不超过 2.5 秒、
- setData 的数据量不超过 100 kb
- 所有网络请求都在 1 秒内返回结果
- 组件滑动丶长列表滚动无卡顿感

### 体验评分工具

小程序提供了 体验评分工具（Audits 面板）来测量上述的指标数据，其集成在开发者工具中，在小程序运行时检查相关问题点，并为开发者给出优化建议

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/27/1711951220a2535c~tplv-t2oaga2asx-watermark.awebp">

体验评分工具是目前检测小程序性能问题最直接有效的途径，我们团队已经把体验评分作为页面/组件是否达到精品门槛的重要考量手段之一

### 小程序后台性能分析

我们知道，体验评分工具是在本地运行小程序代码时进行分析，但性能数据往往需要在真实环境和大数据量下更有说服力。恰巧，小程序管理平台 和 小程序助手 为开发者提供了大量的真实数据统计。其中，性能分析面板从 启动性能丶运行性能 和 网络性能 这三个维度分析数据，开发者可以根据客户端系统丶机型丶网络请求和访问来源等条件做精细化分析，非常具有考量价值。

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/27/1711951223464522~tplv-t2oaga2asx-watermark.awebp">

> 其中，启动总耗时 = 小程序环境初始化 + 代码包加载 + 代码执行 + 渲染耗时

### 第三方测速系统

很多时候，宏观的耗时统计对于性能瓶颈点分析往往是杯水车薪，作用甚少，我们需要更细微地针对某个页面某些节点作测速统计，排查出暴露性能问题地代码区块，才能更有效地针对性能优化。京喜小程序使用的是内部自研的测速系统，支持对地区丶运营商丶网络丶客户端等多条件筛选，同时也支持数据可视化丶同比分析等数据能力。京喜首页主要围绕页面  onLoad丶onReady丶数据加载完成丶首屏渲染完成丶各业务组件首次渲染完成 等几个关键节点统计测速上报，旨在全链路监控性能表现。

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/27/17119512237e55a3~tplv-t2oaga2asx-watermark.awebp">

另外，微信为开发者提供了 测速系统，也支持针对客户端系统丶网络类型丶用户地区等维度统计数据

## 了解小程序底层架构

为了更好地为小程序制定性能优化措施，我们有必要了解小程序地底层架构，以及与 Web 浏览器地差异

微信小程序是大前端跨平台技术的其中一种产物，与当下人们的技术 React Native丶Weex丶Flutter 等不同，小程序的最终渲染载体依然是浏览器内核，而不是原生客户端

而对于传统的网页来说，UI 渲染和 JS 脚本是子啊同一个线程中执行，所以经常会出现”阻塞“行为。微信小程序基于性能的考虑，启用了双线程模型

- 视图层：也就是 webview 线程，负责启用不同的 webview  来渲染不同的小程序页面
- 逻辑层：一个单独的线程执行 SJ 线程，可以控制视图层的逻辑

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/27/171195122345c534~tplv-t2oaga2asx-watermark.awebp">

> 上图来自小程序官方开发指南

然而，任何线程间的数据都是由延时的，这意味着逻辑层和视图层间的通信是异步行为。除此之外，微信小程序提供了很多客户端原生能力，在调用客户端原生能力的过程中，微信主线程和小程序双线程之间也会发生通信，这也是一种异步行为。这种异步行为的特性会使运行环境复杂化，稍不注意，就会产出效率低下的代码

作为小程序开发者，我们常常会被下面几个问题所困扰：

- 小程序启动慢
- 白屏时间长
- 页面渲染慢
- 运行内心不足

接下来，我们会结合小程序的底层架构分析出这些问题的根本原因，并针对地给出解决方案

## 小程序启动慢

小程序启动阶段，也就是如下图所示的展示加载界面的阶段

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/27/1711951223b05aa3~tplv-t2oaga2asx-watermark.awebp">

**在这个阶段（包括启动前后的时机），微信会默默完成下面几项工作：**

**1. 准备运行环境**

在小程序启动前，微信会先启动双线程环境，并在线程中完成小程序基础库的初始化和预执行

> 小程序基础库包括 WebView 基础库和 AppService 基础库，前者注入到视图层中，后者注入到逻辑层，分别为所在层级提供其运行时所需的基础框架能力

**2. 下载小程序代码包**

在小程序初次启动时，需要下载编译后的代码包到本地，如果启动了小程序分包，则只有主包的内容会被下载。另外，代码包会保留在缓存中，后续启动会优先读取缓存

**3. 加载新出现代码包**

小程序代码包下载号之后，会被加载到适当的线程中执行，基础库会完成所有页面的注册

> 在此阶段，主包内的所有页面 JS 文件及依赖文件都会被自动执行

> 在页面注册过程中，基础库会调用页面 JS 文件的 -Page 构造方法，来记录页面的基础信息（包括初始数据丶方法等）

**4. 初始化小程序首页**

在小程序代码包加载完之后，基础库会根据启动路径找到首页，根据首页的基础信息初始化一个页面示例，并把信息传递给视图层，视图层会结合 WXML 结构丶WXSS 样式和初始数据来渲染界面

综合考虑，为了节省小程序”点点点“时间（小程序的启动动画是三个圆点循环跑马灯），除了给每个用户发一台高配 5G 手机并顺带提供千兆网络之外，还可以控制 代码包大小，缩小代码包的下载时间

### 无用文件丶函数丶样式剔除

经过多次业务迭代，无可避免的会存在一些弃用的组件/页面，以及不被调用的函数，样式规则，这些冗余的代码会白白占据宝贵的代码包空间。而且。目前小程序的打包会将工程下所有文件都打入代码包内，并没有做依赖分析

因此，我们需要及时剔除不再使用的模块，以保证代码空间利用率保证在较高水平。通过一些工具化手段可以有效地辅助完成这一工作

- 文件依赖分析

在小程序中，所有页面的路径都需要在小程序代码根目录 app.json 中被声明，自定义组件也需要在页面配置文件 page.json 中被声明。另外，WXML丶WXSS 和 JS 的模块化都需要特定的关键字来声明依赖引用关系

WXML 中的 `import` 和 `include`

```js
<!-- A.wxml -->
<template name='A'>
    <text>{{ text }}</text>
</template>    

<!-- B.html -->
<import src="A.wxml" />
<template is="A" data="{{text: "B"}}">        
```

WXSS 的 `@import`

```js
@import './A.wxss'
```

JS 中的 `require/import`

```js
const A = require('./A')
```

所以，可以说小程序的所有依赖模块都是有迹可循的，我只需要利用这些关键字信息递归查询，遍历出文件依赖树，然后把这些没有的模块剔除掉

- JS丶CSS Tree-Shaking

JS Tres-Shaking 的原理就是借助 Babel 把代码编译成抽象语法树（AST），通过AST 获取到函数的调用关系，从而把未被调用的函数方法剔除掉。不过这需要依赖 ES module，而小程序最开始是遵循 CommonJS 规范的，这意味着是时候来一波“痛并快乐的改造了”

而 CSS 的 Tree-Shaking 可以利用 PurifyCSS 插件来完成。

京东的小程序团队已经把这一些系类工程化能力集成在一套 CLI 工具中，可以看看小程序工程化探索

### 减少代码包中的静态资源文件

小程序代码包最终会经过 GZIP 压缩放在 CDN 上，但 GZIP 压缩对于图片资源来说非常低，如 JPG丶PNG 等格式文件，本身已经被压缩过了，再使用 GZIP 压缩有可能体积更大，得不偿失。所以，除了部分用于容错的图片必须放在代码包（譬如网络异常提示）之外。建议开发者把图片丶适配资源都放在 CDN 上

> 需要注意，Base64 格式本质上是长字符串，和 CDN 地址比起来也会更占空间

### 逻辑后移，精简业务逻辑

这是一个”痛并快乐着“的优化措施。”痛“是因为需要给后台提改造需求，分分钟被打；”快乐“则是因为享受代码的过程，而且万一出  Bug 也不用背锅了

通过让后台承担更多的业务逻辑，可以节省小程序前端代码质量，同时线上问题还支持紧急修复，不需要经历小程序的提审丶发布线上等繁琐过程

总结出，一般不涉及前端计算的展示类逻辑，都可以适当做后移，譬如京喜首页中的弹帘弹窗（如下图）逻辑，这里共有 10+ 种弹窗类型，以前的说法是前端从接口拉取 10+ 个不同的字段，根据优先级和”是否已展示“（该状态存储再本地缓存）来决定展示哪一种，最后的代码是注意的：

```js
// 检查每种弹窗类似是否已展示
Promise.all([
    check(prop_1),
    check(prop_2)
    // ...
    check(prop_n)
]).then(result => {
    // 优先级排序
    const queue = [{
        show: result.popup_1,
        data: data.popup_1
    }, {
        show: result.popup_n
        data: data.popup_n
    }]
})
```

逻辑后移后，前端只负责拿幕帘展示就可以了，代码变成这样：

```js
this.setData({
	popup: data.popup
})
```

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/27/17119512261d1e42~tplv-t2oaga2asx-watermark.awebp">

### 复用模板插件

京喜小程序作为电商的门户，需要应对各类频繁的营销活动丶升级改版等，同时也要满足不同用户属性的界面个性化需求（俗称”千人千面“）。如何既能减少应多多样化场景而产生的代码量，又可以提升研发效率，称为燃眉之急

类似于组件复用的理念，我们需要提供更丰富的可配置能力，实现更高的代码复用度。参考小时候很喜欢的”乐高“的积木玩具，我们把首页模板的模块元素作颗粒度更细的划分，根据样式和功能抽离出一块块”积木“原料（称为插件元素）。当首页元素在处理接口数据时，会启动插件引擎逐个装载插件，最终输出个性化的模板样式，整个流程就好比堆积木。当后续产品/运营需要新增模板时，只要在插件库中挑选插件排列组件即可，不需要额外新增/修改组件内容，也更不会产生维护的 if/else 逻辑

当然，渝澳完成这样的插件化改造避免不了几个先决条件：

- 用户体验设计的统一：如果设计风格总是天差地别的，强行插件化只会称为累赘
- 服务端接口的统一：同上，如果得浪费大量得精力来兼容不同模块间的接口，将会非常蛋疼

下面为大家提供部分例子来辅助理解。其中，use 方法会接受各类处理钩子最终凭借出来一个 Function，在对应模块处理数据时会被调用

```js
// bi.helper.js

/**
* 插件引擎
* @param {function} options.formatName 标题处理钩子
* @param {function} options.validList 数据校验器钩子
*/
const use = options => data => format(data);

/**
* 预置插件
*/

nameHelpers = {
    text: data => data.text,
    icon: data => data.icon
}
listHelpers = {
    single: list => list.slice(0, 1),
    double: list => list.slice(0, 2)
}

/**
* 堆积木
*/
export default {
    1000: use({
        formatName: nameHelpers.text,
        validList: listHelpers.single
    }),
    
    1001: use({
        formatName: nameHelpers.text,
        validList: listHelpers.single
    })
}
```

```js
<!-- bi.wxml -->
<!-- 各模板节点实现 -->
<template name="renderName">
	<view wx:if="{{type === 'text'}}"> text </view>
	<view wx:else="{{type === 'icon'}}"> text </view>
</template>  

<view class="bi_name">
	<template is="renderName" data="{{...data.name}}" />
</view>
```

```j
// bi.js
Component({
	ready() {
		ready() {
			// 根据 tpl 值解析函数
			const formatData = helper[data.tpl];
			this.setData({
				data: formatData(data)
			})
		}
	}
})
```

### 分包加载

小程序启动时只会下载主包/独立分包，启动分包可以有效减少下载时间。（独立分包需要遵循一些原则，详细的可以看官方文档）

- 使用分拨
- 独立分包

### 部分页面 h5 化

小程序提供了 web-view 组件，支持在小程序环境内访问网页。当实在无法在小程序代码包中腾出多余空间时，可以考虑剪辑方案 -- 把部分页面 H5 化

> 小程序和 h5 的通信可以提供  JSSDK 或 postMessage 通道来实现

## 白屏时间过长？

白屏阶段，是指小程序包下载完成后（也就是启动界面结束）之后，页面完成首屏渲染的这一阶段，也就是 FMP（首次有效绘制）

FMP 没法用标准的指标定义，但对于大部分小程序来说，网页首屏展示的内容都需要依赖服务端的接口数据，那么影响白屏加载时间的主要由这两个元素构成：

- 网络资源加载时间
- 渲染时间

### 启动本地缓存

小程序提供了读写本地缓存的接口，数据存储在设备硬盘上。由于本地I/O 读写（毫秒级）会比网络请求（秒级）要快很多，所以在用户访问页面时，可以优先从缓存中取上一次接口调用成功的数据来渲染视图，待网络请求成功后再覆盖最新数据重新渲染。除此之外，缓存数据还可以作为兜底数据，避免出现接口请求失败页面空窗，一石二鸟。

但并非所有场景都适合缓存策略，譬如对数据即时性要求高的场景（如抢购入口）来说，展示老数据可能会引发一些问题

小程序默认会按照 不同小程序丶不同微信用户 这两个维度对缓存空间进行隔离。诸如京喜小程序首页也采用了缓存策略，进一步按照 数据版本号丶用户属性 来对缓存进行再隔离，避免信息误展示

### 数据预拉取

小程序官方为开发者提供了一个在小程序冷启动提前拉取第三方接口的能力

数据预拉取的原理其实很简单，就是在小程序启动时，微信服务器代理小程序客户端发起一个 HTTP 请求到第三方服务器来拉取数据，并且把响应数据存储在本地客户端供小程序调用。当小程序加载完成后，只需调用微信提供的 API `wx.getBackgroundFetchData` 从本地缓存获取数据即可。这种做法可以充分利用小程序启动和初始化阶段的等待时间，使更快地完成页面渲染

京喜小程序首页已经在生产环境实践过这个能力，从每日千万级的数据分析得出，预拉取使冷启动时获取到接口数据的时间节点从 2.5s 加速到 1s（提速到 60%）。虽然提升效果非常明显，但这个能力依然存在不成熟的地方

- **预拉取的数据会被强缓存**

  由于预拉取的请求最终是由微信的服务器发起的，也许是处于服务器资源限制的考虑，预拉取的数据会缓存在微信本地一段时间，缓存失败后才重新发起请求。经真机实测，在微信购入入口冷启动京喜小程序的场景下，预拉取缓存存活了 30 分钟以上，这对于数据实时性要求比较高的系统是非常致命的

- **请求体和响应体都无法被拦截**

  由于请求第三方服务器是从微信的服务器发起的，而不是从小程序客户端发起的，所以本地代理无法拦截到这一次真实请求，这会导致开发者无法通过拦截请求的方式区分线上环境和开发环境的数据，给开发调试带来麻烦

  小程序内部接口的响应主体类型都是 application/octet-stream ，即数据格式未知，使本地代理无法正确解析

- **微信服务器发起的请求没有提供区分线上版和开发版的参数，且没有提供用户 IP 等信息**

如果这几个问题点都不会影响你的场景，那么可以尝试开启预拉取能力，这对于小程序首屏渲染速度是质的提升

### 跳转时预拉取

为了尽快获取到服务端数据，比如常见的做法是在页面 onLoad 钩子被触发时发起网络请求，但其实这不是最快的方式。从发起页面跳转，到下一个页面 onLoad 的过程中，小程序需要完成一些环境初始化及页面实例化的工作，耗时 300~400 毫秒

实际上，我们可以在发起跳转前（如 wx.navigateTo 调用前），提前请求下一个页面的主接口并存储在全局 Promise 对象中，待下一个页面加载完成后从 Promise 对象中读取数据即可

这也是双线程模型所带来的优势之一，不同于多页面 web 应用在页面跳转/刷新时就销毁掉 window 对象

### 分包预下载

如果开启了分包加载能力，在用户访问到分包某个页面时，小程序才会开始下载对应的分包。当处于分包下载阶段时，页面会维持在”白屏“的启动态，这用户体验是非常糟糕的

幸好，小程序提供了 分包预下载 能力，开发者可以配置进入某个页面时预下载可能会用到的分包，避免在页面切换时僵持在”白屏“态

### 非关键渲染数据延时请求

这是关键渲染路径优化的其中一个思路，从缩短网络请求延时的角度加快首屏渲染完成时间

>  关键渲染路径 是指在完成首屏渲染的过程中必须发生的事件

以京喜小程序如此庞大的小程序项目为例，每个模块背后都可能有着海量的后台服务作为支撑，而这些后台服务间的通信和数据交互都会存在一定的延时，我们根据京喜首页的网页结构，把所有的模块划分为两类：主体模块（导航丶商品轮播丶商品豆腐块等）和非主体模块（幕帘弹窗丶右侧挂件等）

在初始化首页时，小程序会发起一个聚拢接口请求来获取主体模块的数据，而非主体模块的数据则从另一个接口获取，通过拆分的手段来降低主接口的调用延时，同时延时响应体的数据量，缩减网络传输时间

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/27/17119512544c206d~tplv-t2oaga2asx-watermark.awebp">

> 为了更好地呈现效果，上面 gif 做了降速处理

### 接口聚拢，请求合并

在小程序中，发起网络请求是通过 wx.request 这个API。我们知道，在 web 浏览器中，针对同一个域名的 HTTP 并发请求是有限制的；在小程序中也有类似的限制，但区别在于不是针对域名限制，而是针对 API 调用

- wx.request （HTTP 连接）的最大并发限制是 10 个
- wx.connectSocket（WebSocket 连接）的最大并发限制是 5 个

超出并发限制数目的是 HTTP 请求将会被阻塞，需要在队列中等待前面的请求完成，从而在一定程度上增加了请求延时。因此对于职责类似的网络请求，最好采用节流的方式，先在一定时间间隔内收集数据，再合并到一个请求中发送给服务端

### 图片资源优化

图片资源一直是移动端系统中抢占大流量的部分，尤其是对于电商系统。优化图片资源的加载可以有效地加快页面响应速度，提升首屏渲染速度

- 使用 WebP 格式

WebP 是 Google 推出的一种支持有损/无损压缩的图片文件格式，得益于更优的图像数据压缩算法，其与 JPG丶PNG 等格式相比，在肉眼无差别的图片质量前提下具有更小的图片体积（据官方说明，WebP 无损压缩体积比 PNG 小 26%，有损压缩体积比 JPEG 小 25%-34%）

> 小程序的 image 组件 支持 JPG丶PNG丶SVG丶WEBP丶GIF 等格式

- 图片裁剪&降质

鉴于移动端设备的分辨率是有上限的，很多图片的尺寸常常大于页面元素尺寸，这非常浪费网络资源（一般图片尺寸 2 倍于页面元素真实尺寸比较合适）。得益于京东内部强大的图片处理服务，我们可以通过资源的命名规则和请求参数来获取服务端优化后的图片：

裁剪成  100x100 的图片：`https://{host}/s100x100_jfs/{file_path}`；

降质 70%：`https://{href}!q70`；

- 图片懒加载丶雪碧图（CSS Sprite）优化

这两者都是比较老生常谈的图片优化技术，这里就不打算细讲

小程序的 image 组件自带 lazy-load 懒加载支持。

- 降级加载大图资源

在不得不使用大图资源的场景下，我们可以适当使用”体验换速度“的措施来提升渲染性能

小程序会把已加载的静态资源缓存在本地，在短时间内再次发起请求时会直接从缓存中取资源（与浏览器行为一致）。因此，对于大图资源，我们可以先呈现高度压缩的模糊图片，同时利用一个隐藏的 `<image>` 节点来加载原图，待原图加载完成后再转移到真实节点上渲染。整个流程，从视觉上会感知图片从模糊到高清的过程，但与对首屏渲染的提升效果相比，这点体验落地是可以接受的

下面为大家提供部分例子

```js
<!-- banner.wxml -->
<image src="{{url}}">
    
<!-- 图片加载器 -->
<image style="width: 0; height:0; display: none"
	   src="{{preloaderUrl}}"
	   bindload="omImgLoad"
	   binderror="onErrorLoad" />    
```

```js
// banner.js
Component({
    ready() {
        this.originUrl = "https://path/to/picture"; // 图片源地址
        this.setData({
            url: compress(this.originUrl); // 加载压缩降质的图片
            preloadUrl: this.originUrl // 预加载原图
        })
    },
    methods: {
        onImgLoad() {
            url: this.originUrl // 加载原图
        }
    }
})
```

> 注意，具有 display: none 样式的 <image> 标签只会加载图片资源，但不渲染

京喜首页的商品轮播图也采用了这种降级方案，在首屏渲染时只会加载第一帧降质图片。以每帧原图 20~50 的大小计算，这一措施可以在初始阶段节省几百 KB 的网络资源请求

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/27/1711951254a16945~tplv-t2oaga2asx-watermark.awebp">

> 为了更好地呈现效果，上面 gif 做了降速处理

### 骨架屏

一方面，我们可以从降低网络请求延时丶减少关键渲染地节点数这两个角度出发，缩短完成 FMP（首次有效绘制）的时间。另一方面，我们也需要从用户感知的角度优化加载体验

”白屏“的加载体验对于首次访问的用户来说是难以接受的，我们可以首页尺寸稳定的骨架屏，为辅助实现真实模块占位和瞬间加载

骨架屏目前是在业界被广泛应用，京喜首页选择使用灰色豆腐块作为骨架屏的主元素，大致勾勒出各模块主体内容的样式布局，由于微信小程序不支持 SSR（服务端渲染），使动态渲染骨架屏的方案难以实现，因此京东首页的骨架屏是通过 WXSS 样式静态渲染的

有趣的是，京喜首页的骨架屏方案经历了”统一管理“和”（组件）独立管理“两个阶段，处于避免对组件的侵入性考虑，最初的骨架屏是由一个完整的骨架屏组件统一管理的：

```js
<!-- index.wxml --->
<skeleton wx:if="{{isLoading}}"></skeleton>
<block wx:else>
	页面主体
</block>    
```

但这种做法的维护成本比较高，每次页面主体模块更新迭代，都需要在骨架屏组件中对应节点同步更新（譬如某个模块的尺寸被调整）。除此之外，感官上从骨架屏到真实模块的切换是跳跃式的，这是因为骨架组件和页面主体之间的关系是整体条件是互斥的，只有当页面主体数据 Ready（或渲染完毕）时才会把骨架屏组件销毁，渲染（或展示）主体内容

为了使用户感知体验更加湿滑，我们把骨架屏元素拆分到各个业务组件中，骨架屏元素的显示/隐藏逻辑由业务组件内部独立管理，这就可以轻松实现”谁跑得快，谁先出来“的并行加载效果。除此之外，骨架屏元素与业务组件共用一套 WXML 节点，且相关样式由公共的 sass 模块集中管理，业务组件只需要在适当的节点挂上 skeleton 和 skeleton _block 样式块即可，极大地降低了维护成本

```js
<!- banner.wxml -->
<view class="{{isLoading ? 'banner-skeleton' : ''}}>    
```

```js
// banner.scss
.banner--skeleton {
    @include_skeleton;
    .banner_wrapper {
        @include skeleton_block
    }
}
```

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/27/1711951257901917~tplv-t2oaga2asx-watermark.awebp">



> 上面的 gif 在压缩过程有些小毛病，大家可以直接访问【京喜】小程序体验骨架屏效果

## 如何提升渲染性能？

当调用 wx.navigateTo 打开一个新的小程序页面时，小程序框架会完成这几步工作：

- 准备新的 webview 线程环境，包括基础库的初始化
- 从逻辑层到视图层的初始数据通信
- 视图层根据逻辑层的数据，结合 WXML 判断构建出节点树（包括节点属性丶事件绑定等消息），最终与 WXSS 结合完成页面渲染

由于微信会提前开始准备 webview 线程环境，所以小程序的渲染损耗主要在后两者 数据通信 和 节点树创建/更新 的流程中。相对应的，比较有效的渲染性能优化方向就是：

- 降低线程间通信频次
- 减少线程间通信的数据量
- 减少 WXML 节点数据量

### 合并 setData 调用

尽可能地多次 setData 调用合并成一次

我们除了要从编码规范上践行这个原则，还可以通过一些技术手段降低 setData 地调用频次。譬如，把同一个时间片（事件循环）内的  setData 调用合并在一起，Taro 框架就使用了这个优化手段

在 Taro 框架下，调用 setData 时提供的对象会被加入到一个数组中，当下一个事件循环执行的时候再把这些对象合并在一起，通过 setData 传递给原生小程序

```js
// 小程序里的时间片 API
const nextTick = wx.nextTick ? wx.nextTick : setTimeout
```

### 只把界面渲染相关的数据放在 data 中

不难看出，setData 传输的数据量越多，线程间通信的耗时越长，渲染速度越慢。根据微信官方测得的数据，传输时间和数据量大体上呈正相关关系：

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/27/171195125a021b29~tplv-t2oaga2asx-watermark.awebp">

> 上图来自小程序官方开发指南

所以，与视图渲染无关的数据尽量不要放在 data 中，可以放在页面（组件）类的其它字段下

### 应用层的数据 diff

每当调用 setData 的更新数据时，会引起视图层的重新渲染，小程序会结合新的 data 数据和 WXML 片段构建出新的节点树，并与当前节点树进行比较得出最终需要更新的节点（属性）

即使小程序在底层框架层面已经对节点树更新进行了 diff，但我们依旧可以优化这次 diff 的性能。譬如，在调用 setData 时，提前确保传输的所有数据都是有变化的，也就是针对 data 提前做一次 diff

Taro 框架内部做了这一层优化。在每次调用原生小程序的 setData 之前，Taro 会把最新的 state 和当前页面实例的 data 做一次 diff，筛选出有必要更新的数据再执行 setData

### 去掉不必要的事件绑定

当用户事件（如 Click丶Touch 事件等）被触发时，视图层会把事件信息反馈给逻辑层，这也是线程间通信的过程。但如果没有在逻辑层绑定事件的回调函数，通信将不会被触发

所以，尽量减少不必要的事件绑定，尤其是像 onPageScroll 这种会被频繁触发的用户事件，会使通信过程频繁发生

### 去掉不必要的节点属性

组件节点支持附加自定义数据 dataset，当用户事件被触发时，视图层会把事件 target 和 dataset 数据传输给逻辑层。那么，当自定义数据量越大，事件通信的耗时就会越长，所以应该避免在自定义数据中设置太多数据

```js
<!-- wxml -->
<view data-a="A"
	  data-b="B"
	  bindtap="bindViewTap">
	Click Me!
</view>          
```

```js
// js
Page({
    bindViewTap(e) {
        console.log(e.currentTarget.dataset);
    }
})
```

### 适当的组件颗粒度

小程序的组件模型与 Web Components 标准中的 ShadowDom 非常类似，每个组件都有独立的节点树，拥有各自独立的逻辑空间（包括独立的数据丶setData 调用丶createSelectorQuery 执行域等）

不难得出，如果自定义组件的颗粒度太粗，组件逻辑过重，会影响节点树构建和新/旧节点数 diff 的效率，从而影响到组件内 setData 的性能。另外，如果组件内容使用了 createSelectorQuery 来查找节点，过于庞大的节点树结构也会影响查找效率

我们来看一个场景，京喜首页的”京东秒杀“模块涉及到一个倒计时特性，是通过 setInterval 每秒调用 setData 来更新表盘时间。我们通过把倒计时抽离出一个基础组件，可以有效地降低频繁 setData 时的性能影响

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/27/17119512596c3e55~tplv-t2oaga2asx-watermark.awebp">

适当的组件化，既可以的减少数据更新时的影响范围，又能支持复用，何乐不为？诚然，并非组件颗粒度越细越好，组件数量和小程序代码包大小是正相关的。尤其是对于使用编译型框架（如 Taro）的项目，每个组件编译后都会产生额外的运行时代码和环境 polyfill，为了代码包空间，请保持理智

### 事件总线，代替组件数据绑定的通信方式

WXML  数据绑定是小程序中父组件向子组件传递动态数据的较为常见的方式，如下面d例子所示：Component A 组件中的变量a丶b 通过组件属性传递给 Component B 组件。在此过程中，不可避免地需要经历一次 Component A 组件地 setData 调用方可完成任务，这就会产生线程间的通信。”合情合理“，但如果传递给子组件的数据只有一部分是与视图渲染有关呢

```js
<!-- Component A -->
<component-b prop-a="{{a}}" prop-b="{{b}}" />    
```

```ujs
// Component B
Component({
	properties: {
		propA: String,
		propB: String
	},
	methods: {
		onLoad: function() {
			this.data.propA,
			this.data.propB
		}
	}
})
```

推荐一种特定场景下非常便捷的做法：通过事件总线（EventBus），也就是发布/订阅模式，来完成由父向子的数据传递。其构成非常简单

- 一个全局的事件调度中心

  ```js
  class EventBus {
      constructor () {
          this.events = {};
      }
      on(key, cb) {
          this.events[key].push(cb)
      }
      trigger(key, args) {
          this.events[key].forEach(function (cb) {
              cb.call(this, ...args);
          })
      }
      remove() {}
  }
  const event = new EventBus();
  ```

- 事件订阅者

  ```js
  // 子组件
  Component({
      created() {
          event.on('data-ready', (data) => {
              this.setData({ data });
          })
      }
  })
  ```

- 事件发布者

  ```js
  // Parent
  Component({
      ready() {
          event.trigger('data-ready', data)
      }
  })
  ```

子组件被创建时事先监听数据下发事件，当父组件获取到数据后触发事件把数据传递给子组件，这整个过程都是在小程序的逻辑层里同步执行，比数据绑定的方式速度更快

但并非所有场景都适合这种做法。像京喜首页这种具有”数据单向传递“丶”展示型交互“特性丶且一级子组件数量庞大 的场景，使用事件总线的效益将会非常高；但若是频繁”双向数据流“的场景，用这种方式会导致事件交错难以维护

题外话，Taro 框架在处理父子组件间数据传递时使用的是观察者模式，通过 Object.defineProperty 绑定父子组件关系，当父组件数据发生变化时，会递归通知所有后台组件检查并更新数据。这个通知的过程会同步触发数据 diff 和一些校验逻辑，每个组件跑一遍需要 5 ~ 10 ms 的时间，所以如果组件量级，整个流程下来时间损耗还是不小的，我们依旧可以尝试事件总线的方案

### 组件层面的 diff

我们可能会遇到这样的需求，多个组件之间位置不固定，支持随时随地灵活配置，京喜首页也存在类似的诉求

京喜首页主体可被划分为若干个业务组件（如搜索框丶导航狼丶商品轮播等），这些业务组件的顺序是不固定的，今天是搜索框在最顶部，明天有可能变成导航栏在顶部。我们不可能针对多种顺序可能性提供多套实现，这就需要用到小程序的自定义模块`<template>`

实现一个支持调度所有组件业务的模板，根据后台下发的模块数组按序循环渲染模板，如下面例子所示

```js
<!-- index.wxml -->
<template name="render-component">
    <search-bar wx:if="{{compId === 'SearchBar'}}" floor-id="{{index}}">
    <nav-bar wx:if="{{compId === 'NavBar'}}" floor-id="{{index}}">
    <banner wx:if="{{compId === 'Banner'}}" flooer-id="{{index}}">
    <icon-nav wx:if="{{compId === 'IconNav'}}" floor-id="{{index}}"> 
</template> 

<view class="component-wrapper"
      wx:for="{{comps}}"
      wx:for-item="comp">
 	<template is="render-component" data="{{...comp}}" />
</view>            
```

```js
// search-bar.js
Component({
    properties: {
       floorId: Number 
    },
    created() {
        event.on('data-ready', (comps) => {
            const data = comps[this.data.floorId] // 根据楼层位置取数据
        })
    }
})
```

貌似非常轻松地完成需求，但值得思考的是：如果组件顺序调整了，所有组件的生命周期会发生什么变化？

假设，上一次渲染的组件顺序是`['search-bar', 'nav-bar, 'banner', 'icon-nav']`，现在需要把 nav-bar 组件去掉，调整为`['search-bar', 'banner', 'icon-nav']`。经实验得出，当某个组件节点发生变化时，其前面的组件不受影响，其后面的组件都会被销毁重新挂载

原理很简单，每个组件都有各自隔离的节点树（ShadowTree），页面 body 也是一个节点树。在调整组件顺序时，小程序框架会遍历比较新/旧节点树的差异，于是发现新节点树的 nav-bar 组件节点不见了，就认为该（树）分支下从 nav-bar 节点起发生了变化，往后节点都需要重渲染、

但实际上，这里的组件顺序是没有变化的，丢失的组件按道理不应该影响到其它组件的正常渲染。所以，我们在 setData 前先进行了新旧组件列表 diff：如果 newList 里面的组件是 oldList 的子集，且相对顺序没有发生变化，则所有组件不重新挂载。除此之外，我们还要在接口数据的相应位置填充上空数据，把该组件隐藏掉。

通过组件 diff 的手段，可以有效降低视图层的渲染压力，如果由类似场景的朋友，也可以参考这种方案

## 内存占用过高？

相必没有什么比小程序 Crash 更影响用户体验了

当小程序占用系统资源过高，就有可能会被系统销毁或被微信客户端主动回收。应对这种尴尬场景，除了提示用户提升硬件性能之外（譬如来京东商城买新手机），还可以通过一系列的优化手段降低小程序的内存损耗

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/27/171195128a7b909a~tplv-t2oaga2asx-watermark.awebp">

### 内存预警

小程序提供了监听内存不足告警事件的 API：[wx.onMemoryWarning](https://link.juejin.cn/?target=https%3A%2F%2Fdevelopers.weixin.qq.com%2Fminiprogram%2Fdev%2Fapi%2Fdevice%2Fperformance%2Fwx.onMemoryWarning.html)，旨在让开发者收到告警时及时释放内存资源避免小程序 Crash。然而对于小程序开发者来说，内存资源目前是无法直接触碰的，最多就是调用 wx.reLaunch 清理所有页面栈，重载当前页面，来降低内存负荷（此方案过于粗暴，别冲动，想想就好了...）

不过内存告警的信息收集倒是有意义的，我们把内存告警信息（包括页面路径丶客户端版本丶终端手机型号等）上报到日志系统，分析出哪些页面 Crash 率比较高，从而针对性做优化，降低页面复杂度等等

### 回收后台页面计时器

根据双线程模型，小程序每一个页面都会独立一个 webview 线程，但逻辑是单线程，也就是所有的 webview 线程共享一个 JS 线程。以至于当页面切换到后台态时，仍然有可能抢占到逻辑层的资源，譬如没有销毁的 setInterval 丶setTimeout 定时器

```js
// Page A
Page({
    onLoad() {
        let i = 0;
        setInterval(() => { i ++ }, 100)
    }
})
```

> 即使如小程序的 `<swiper>` 组件，在页面进入后台态时仍然是持续轮播的

正确的做法是，在页面 onHide 的时候手动把计时器清理掉，有必要时再在 onShow 阶段回复定时器。坦白讲，区区一个定时器回调函数的执行，对于系统的影响应该是微不足道的，但不容忽视的是回调函数里的代码逻辑，譬如在定时器回调持续 setData 大量数据，这就非常难受了...

避免频繁触发中重度内存操作

我们经常会遇到这样的需求：广告曝光丶图片懒加载丶导航栏吸顶等等，这些都需要我们在页面滚动事件触发实时监听元素或更新视图。在了解小程序的双线程模型之后不难发现，页面滚动时 onPageScroll 被频繁触发，会使逻辑层和视图层发生持续通信，若这时候再”火上烧油“调用 setData 传输大量数据，会导致内存使用率快速上升，使页面卡顿甚至”假死“。所以，针对频发事件的监听，我们最好遵循以下原则：

- onPageScroll 事件回调使用节流
- 避免 CPU 密集型操作，譬如复杂的计算
- 避免调用 setData，或减少 setData 的数据量
- 尽量使用 IntersectionObserver 来代替 SelectorQuery，前者对性能影响更小

### 大图丶长列表优化

根据 小程序官方文档 描述，大图片和长列表图片再 IOS 中会引起 WKWebView 的回收，导致小程序 Crash

对于大图片资源（譬如满屏的 gif 图）来说，我们只能尽可能对图片进行降质或裁剪，当然不使用是最好的

对于长列表，譬如瀑布流，这里提供了一种思路：我们可以利用 IntersectionObserver 监听长列表内组件与视窗之间的相交状态，当组件距离视窗大于某个临界点时，销毁该组件释放内存空间，并用等尺寸的骨架图占坑；当距离小于临界点，再取缓存数据重新加载该组件

然而无可避免地，当用户快速滚动长列表时，被销毁地组件可能来不及加载完，视觉上就出现短暂地白屏。我们可以适当地调整销毁阈值，或者优化骨架图的样式来尽可能地提升体验感

小程序官方提供了一个 长列表组件，可以通过 npm 包的方式引入

## 总结

综合上述的种种方法论，京喜小程序首页进行全方位升级改造给出了答卷：

- Audits 审计工具的性能等分 86
- 优化后的首屏渲染完成时间（FMP）

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/27/171195128e60511b~tplv-t2oaga2asx-watermark.awebp">

- 优化前后的测速数据对比

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/27/171195129adc7ed6~tplv-t2oaga2asx-watermark.awebp">\

然而，业务迭代再持续推进，多样化的用户场景徒增不减，性能优化将成为我们日常开发中挥之不去的原则和主题。本文以微信小程序开发中与性能相关的问题为出发点，基于小程序的底层框架原理，探究小程序性能体验提升的各种可能性，希望能为各位小程序开发者带来参考价值









小程序可以缓存多大内存？

取消请求



## 小程序工程化探索
