## 1. nodejs内置模块有哪些？

> nodejs内置模块指的是默认提供的语法之外，无需下载，直接引入，引入只写名称即可

nodejs内置模块

####  1. path模块
用于处理文件路径
```js
path.normalize(路径解析，得到规范路径);
path.join(路径合并);
path.resolve(获取绝对路径);
path.relative(获取相对路径);
```

#### 2. until模块
弥补js功能不足，新增API
```js
util.format(格式化输出字符串);
util.isArray(检查是否为数组);
util.RegExp(是不是正则);
util.isData(是不是日期型);
util.inherits(child, parent); 实现继承
```

#### 3. fs模块
文件操作系统的API
```js
fs.readFile(filename, [options], callback); // 读取文件
fs.writeFile(filename, data, [options], callback); // 写文件
fs.appendFile(filename, data, [options], callback) // 以追加的方式写文件
fs.open(filename, flags, [mode], callback); // 打开文件

// filename: 文件名，必须 
// data: 写入的数据或者buffer流
// flags: 操作标识，打开方式, r w
// [options]: 指定权限，读丶写丶执行。是否可续写
// callback:读取文件后的回调函数，function(err, data);

fs.mkdir(path, [mode], callback); // 创建目录
fs.readdir(path, callback); // 读取目录
fs.exists(path, callback); // 查看文件还与目录是否存在
fs.utimes(path, atimem, mtime, callback); // 修改文件的访问和修改时间
fs.rename(oldfilename, newfilename, callback); // 重命名文件名称或者目录
fa.rmdir(path, callback); // 删除空目录

// path: 被创建目录的完整路径以及目录名
// [mode]: 目录权限，默认0777 (可读可写可执行)
// atime: 新得访问时间
// ctime: 新得修改时间
// oldfilename丶newfilename 旧名字和新名字
// callback: 创建完目录后的回调函数     
```

#### 4. events模块


#### 5. http模块
```js
http.createServer(funciton () {}); // 创建服务器
http.get('路径', callback); // 发送get请求
http.request(options, callback); // 发送请求

// options: options是一个类似数组的对象，表示请求的参数，callback作为回调函数，需要传递一个参数
// options常用的参数有host丶post(默认为80)丶method(默认为GET)丶path(请求的相对于根的路径，默认是"/")
```

**get请求**
```js
var http = require("http");
var options = {
    hostname: "cn.bing.com",
    port: 80
}

var req = http.request(options, function(res) {
    res.setEncoding("utf-8");
    res.on("data", function(chunk) {
        console.log(chunk.toString());
    });
    console.log(res.statusCode);
});
req.on("error", function() {
    console.log(err.message);
});
req.end();
```

**post请求**
```js
var http = require("http");
var querystring = require("querystring");

var postData = querystring.stringify({
    "content": "我真得只是测试一下",
    "mid": 8837
});

var options = {
    hostname: "ww.imooc.com",
    post: 80,
    path: "/course/document",
    method: "POST",
    header: {
        // ...
    }
}

var req = http.request(options, function (res) {
    res.on("data", function (chunk) {
        console.log(chunk);
    });
    res.on("end", function () {
        console.log("评论完毕");
    });
    console.log(res.statusCode);
});

req.on("error", function() {
    console.log(err.message);
});
req.on('error', function() {
    console.log(err.message);
})
req.write(postData);
req.end();
```


