## 1. 什么是WebGL，它有什么缺点？
WebGL`(全称Web Graphics  Library)`是一种3D绘图标准，这种绘图技术标准许把`JavaScript`和`OpenGL ES 2.0`结合在一起，通过增加`OpenGL ES 2.0`的一个`JavaScript绑定`，WebGL可以为`HTML5 Canvas`提供`硬件3D加速渲染`，这样Web开发人员就可以借助`系统显卡`来在浏览器里`更流畅地展示3D场景和模型`了，还能`创建更加复杂的导航和数据视觉化`。显然，WebGL技术标准免去了`开发网页专用渲染插件`的麻烦，可被用于`创建具有复杂3D结构的网站首页`，甚至可以用来`设计3D网页游戏`等等。

WebGL完美解决了现有的Web交互式三维动画的两个问题
- 它通过`HTML脚本`本身实现了`Web交互式三维动画的制作`，无需`任何浏览器插件支持`
- 它利用`底层的图形硬件加速功能`进行的`图形渲染`，是通过`统一的`丶`标准的`丶`跨平台的OpenGL接口`    实现的        

通俗讲WebGL中canvas绘图中的3D版本。因为原生的WebGL很复杂，我们经常会使用一些三方的库，如three.js等，这些库多数用于HTML5游戏开发。




## 2. 什么是Three.js    
`OpenGL`: 是最常用的跨平台图形处理开源库

`WebGL`：就是基于OpenGL设计的面向Web的3D图形标准，它提供了一系列的    JavaScript API，提供这些API进行图形渲染，系统硬件会加速3D渲染，从而获得较高性能。

`Three.js`：是JavaScript编写的WebGL第三方库，提供对WebGL接口的封装与简化而形成的一个易用的图形库


#### WebGL与Three.js对比
WebGL门槛相对较高，计算机图形学需要较多的数学知识。一个前端程序员或许还熟悉解析几何，但是还熟悉线性代数的寥寥无几

于是three.js对WebGL提供的接口进行了非常好的封装，简化了很多细节，大大降低了学习成本。并且，几乎没有损失WebGL的灵活性。


#### Three.js中的一些概念

想在屏幕上展示3D物体，大体的思路是这样的：
- 创建一个三维空间，`Three.js`称之为场景`（Scene）`
- 确定一个观察点，并设置`观察的方向和角度`，Three.js称之为相机`（Camera）`
- 在场景中添加供观察的物体，Three.js中有很多物体，如`Mesh`丶`Group`丶`Line`等 ，它们都继承自`Object3D`类
- 最后我们需要把所有的东西渲染到屏幕上，这就是Three.js中的`Render`的作用


**Scene**：放置所有物体的空间容器，对应现实的三维空间。创建一个场景也很简单，只需new一个Sence类即可

**Camera**：相机就当于我们的眼睛，为了观察这个世界，我们需要描述某个物体的位置。描述物体位置需要用到坐标系。常用的坐标系有左手坐标系和右手坐标系。      

**三维投影**：正投影相机`THREE.OrthographicCamera`和透视投影相机`THREE.PerspectiveCamera`，对应的是三维投影中的`正交投影`和`透视投影`。

`正交投影`：物体反射的光平行投射到屏幕上，其大小始终不变，所以远近物体大小一样，在渲染一些2D效果和UI元素的时候会用到。

`透视投影`：符合我们平时看东西的感觉，近大远小，经常用在3D场景中  

**视景图**：它是指成像景物所在空间的集合。简单点说，视景体是一个几何体，只有在视景体内的物体才会被我们看到，视景体之外的物体将被裁剪掉。通过变换视景图，我们就得到不同的相机。

正交投影相机`OthergraphicCamera`的视景体：是一个长方形，其构造函数为`OthergraphicCamera(left, right, top, bottom, near, far)`。把Camera看作一个点，`left`则表示视景体左平面在左右方向上与Camera的距离，另外几个参数同理。于是六个参数分别定义了视景体六个面的位置。我们可以近似地认为，视景体的物体平行投影到近平面上，然后近平面上的图像被渲染到屏幕上。 
<img src="https://pic2.zhimg.com/80/v2-bcbb6ddc4bb2394c42b8b4e3f9955e09_1440w.png">

透视投影相机`PerspectiveCamera`的视景体：是一个四棱台，其构造函数为`PerspectiveCamera(for, aspect, near, far)`。for即`filed of view`，即`视野`，对应图中的视角，是上下两面的`夹角`。`aspect`是`近平面的宽高比`。再加上近平面距离near，远平面距离far，就可以确定这个视景体了。
<img src="https://pic4.zhimg.com/80/v2-405ebb449d83347ec3ed4c75c2b22a13_1440w.png">

**Objects**：就是三维空间里的物体。Three.js中提供了很多类型的物体，它们都继承自`Object3D`类，这里我们只看Mesh。

-  Mesh：

在计算机的世界里，一条弧度是由有限个点构成的有限条段连接得到的。当线段数量越多，长度越短，当达到你无法察觉这是线段时，一条平滑的弧线就出现了。

计算机的三维模型也是类似的，只不过线段变成了平面，`普遍用三角形组成的网络来描述。我们把这种模型称之为Mesh模型`。

这就是在3D图形处理中，与图像处理领域的lena图齐名的斯坦福兔子。随着三角形数量的增加，它的表面将会越来越平滑。

在Three.js中，Mesh的构造函数为`Mesh(geometry, material)`。geometry是它的形状，material是它的材质。

- Geometry

Three.js中有很多种形状`geometry`，立方体丶平面丶球体丶图形丶圆柱丶圆台等许多基本形状。Geometry通过存储模型中的点集和点空间关系（哪些点构成一个三角形）来描述物体形状。因此我们也可以通过自己定义每个点的位置来构造形状。我们还可以通过导入外部的模型文件来构造更加复杂的形状。

- Material

这里的材质  不仅仅指物体纹理，而是物体表面除了形状以外所有可视化属性的集合，例如色彩丶纹理丶光滑度丶反射率丶折射率丶发光度丶贴图（Map）丶纹理（Texture）

贴图：它包括了图片和图片应当贴到什么位置

纹理 就是图

- Light

光影效果可以让画面更丰富

Three.js提供了包括环境光丶点光源丶聚光灯丶方向光丶半球光等多种光源

只要在场景中添加需要的光源就好了


> **光源**：前面提到的光敏材质需要点光源来渲染出3D效果，在使用时需要将创建的光源添加到场景中，否则无法产生光照效果

- 点电源

假如点光源在接近地面的位置，物体底部离点电源近，物体顶部离点光源远，照到物体顶部的光就弱些，所以顶部会比底部暗些。
<img src="https://user-gold-cdn.xitu.io/2019/11/28/16eafbae2a013bf0?imageView2/0/w/1280/h/960/format/webp/ignore-error/1">

- 平行光

模拟的是太阳光，光源发出的所有光线都是相互平行的，平行光没有衰弱，被平行光照亮的整个区域接受的光强是一样的。
<img src="https://user-gold-cdn.xitu.io/2019/11/28/16eafbafea838e98?imageView2/0/w/1280/h/960/format/webp/ignore-error/1">

- 聚光灯

类似舞台上的聚光灯效果，光源的光线从一个锥体中射出，在被照射的物体上产生聚光的效果。聚光灯在传播过程也有衰弱的

<img src="https://user-gold-cdn.xitu.io/2019/11/28/16eafbae2dab87c9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1">

- 环境光

环境光是经过多次发射而来的光，环境光源放出的光线被认为来自任何方向，物体无论法向量如何，都将表现为同样的明暗程度
<img src="https://user-gold-cdn.xitu.io/2019/11/28/16eafbae31063ecc?imageView2/0/w/1280/h/960/format/webp/ignore-error/1">

环境光通常不会单独使用，通过使用多种光源能够实现更真实的光效，下图是将环境光和点光源混合后实现的效果，物体的背光面不像点光源那样是黑色的，而是呈现出深褐色，更自然。
<img src="https://user-gold-cdn.xitu.io/2019/11/28/16eafbae3becdf97?imageView2/0/w/1280/h/960/format/webp/ignore-error/1">



> **纹理**：在生活中纯色的物体还是比较少的，更多的是凹凸不平的纹路和图案的物体，需要使用纹理贴图实现。3D世界的纹理是由图片实现的，将纹理添加在材质上以一定的规则映射到几何上，几何体就有了带纹理的皮肤。

- 普通纹理贴图
<img src="https://user-gold-cdn.xitu.io/2019/11/28/16eafbaefb236ae8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1">

```js
function createGeom() {
    // 球体
    var geom = new THREE.SphereGeometry(1, 64, 64);
    // 纹理
    var loader = new THREE.TextureLoader();
    var texture = loader.load('./eatch.jpg');
    // 材质
    var material = new THREE.MeshLambertMaterial({
        map: texture
    });
    var earth = new THREE.Mesh(geom, material);
    return earch;
}
```

- 反面贴图实现全景视图
 
这个例子是通过在球体几何体的反面进行纹理贴图实现的全景视图，实现原理是这样的：创建一个球体构成球形的空间，把相机放在球体的中心，相机就像在一个球形的房间中，在球体的里面贴上图片，通过改变相机摄影的方向，就能看到全景视图了。
```js
// 创建反面贴图的球形
// 球形
var geo = new THREE.SphereGeometry(500, 64, 64);
// 纹理
var loader = new THREE.TextureLoader();
var texture = loader.load('./panorama.jpg');
// 材质
var material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide
});
var panorama = new THREE.Mesh(geom, material);
```
<img src="https://user-gold-cdn.xitu.io/2019/11/28/16eafbaf0753b2e1?imageView2/0/w/1280/h/960/format/webp/ignore-error/1">

- 凹凸纹理贴图

凹凸纹理利用黑色和白色值映射到与光照相关的感知深度，不会影响对象的几何形状，只影响光照，用于光敏材质。
```js
// 纹理加载器
var loader = new THREE.TextureLoader();
// 纹理
var texture = loader.load('./stone.jpg');
// 凹凸纹理 
var bumpTexture = loader.load('.stone-bump.jpg');
// 材质
var material = new THREE.MeshPhongMaterial({
    map: texture,
    bumpMap: bumpTexture
})
```
<img src="https://user-gold-cdn.xitu.io/2019/11/28/16eafbae52c35df8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1">

- 法线纹理贴图

法线纹理也是通过影响光照实现凹凸不平视觉效果的，并不会影响物体的几何形状，用于光敏材质。
```js
// 纹理
var texture = loader.load('./matal.jpg');
// 法线纹理
var normalTexture = loader.load('./metal-nomal.jpg');
var material = new THREE.MeshPhongMaterial({
    map: texture,
    normalMap: normalTexture
})
```
<img src="https://user-gold-cdn.xitu.io/2019/11/28/16eafbaf079d67da?imageView2/0/w/1280/h/960/format/webp/ignore-error/1">


- 环境贴图

环境贴图是将当前环境作为纹理进行贴图，能够模拟镜面的反光效果。在进行环境贴图时需要使用立方体相机在当前场景中进行拍摄，从而获得当前环境的纹理。立方体相机在拍摄环境纹理时，为避免反光效果的小球出现在环境纹理的画面上，需要将小球设为不可见。
```js
// 立方相机
var cubeCamera = new THREE.CubeCamera(1, 10000, 128);
// 材质
var material = new THREE.MeshBasicMaterial({
    envMap: cubeCamera.renderTarget.texture 
})
// 镜面反光的球体
var geom = new THREE.SphereBufferGeometry(10, 32, 16);
var ball = new THREE.Mesh(geom, material);
// 将立方相机添加到球体
ball.add(cubeCamera);
scene.add(ball);
// 立方相机生成环境纹理前将反光小球隐藏
ball.visible = false;
// 更新立方相机，生成环境纹理
cubeCamera.update(renderer, scene);
balls.visible = true;

// 渲染
renderer.render(scene, camera);
```
<img src="https://user-gold-cdn.xitu.io/2019/11/28/16eafbae580bf317?imageView2/0/w/1280/h/960/format/webp/ignore-error/1">


> **加载外部3D模型**：Thress.js已经内置了很多常用的几何体，如：球体丶立方体丶圆柱体等等，但是在实际使用中往往需要用到一些特殊形状的几何体，这时可以使用3D建模软件制作出3D模型，导出obj丶json丶gltf等格式的文件，然后再加载到Three.js渲染出效果
<img src="https://user-gold-cdn.xitu.io/2019/11/28/16eafbafeaab2cc8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1">

上图的椅子是在3D制图文件绘制出来的，chair.mtl是导出的材质文件，chair.obj是导出的几何体文件，使用材质加载器加载材质文件，加载完成后得到材质对象，给几何体加载设置材质，加载后得到几何体对象，然后再创建场景丶光源丶审计丶摄像机丶渲染器等进行渲染。
```js
// .mtl材质文件加载器
var mtlLoader = new THREE.MTLLoader();
// .obj几何体文件加载器
var objLoader = new THREE.OBJLoader();

mtLoader.loader('./chair.mtl', function(materials   ) {
    objLoader.setMaterials(materials)
        .load('./chair.obj', function(obj) {
            scene.add(obj);
            // ...
        })
})
```


---


## 6.threejs组成一个场景需要上面元素？

## 7.threejs中怎样让一个物体不受光照的影响。

方法1：设置环境光为白色，emmissive也为白色。

方法2：设置其他光线与物体的夹角为0.，怎么计算法向量？怎么计算夹角？

## 8.webGL中，生成一个模型，比如立方体，八个顶点各自都是三个面公用的，怎么计算？

## 9.讲讲片元着色器和和顶点着色器，以及一个object的渲染过程。

## 10.怎么把屏幕坐标系转换为webgl坐标系？世界坐标系、本地坐标系、视觉坐标系之间的转换方法？还有什么坐标系？

## 11.threejs的raycaster的原理是什么，除了intersect[ ]数组之外还会返回那些值？

## 12.怎么优化3D页面的加载或者渲染速度？加载不出来怎么办？


## 14.webgl怎么生成一个模型？具体怎么实现？怎么定义坐标？index？着色器？

## 15.3D裁切是什么？

## 16.一个三维立方体其实都是由三角形拼起来的
