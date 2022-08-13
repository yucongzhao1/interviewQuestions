

/**
 * url中的参数转为json
 * @param {*} request 
 * @returns 
 */
function queryString(request){
  let params = request.split('?')[1];
  let param = params.split('&');
  let obj = {};
  for (let i = 0;i<param.length;i++){
      let paramsA = param[i].split('=');
      let key = paramsA[0];
      let value = paramsA[1];
      if(obj[key]){
          obj[key] = Array.isArray(obj[key])?obj[key]:[obj[key]];
          obj[key].push(value);
      }else{
          obj[key] = value;
      }
  }
  return obj;
}

let urlStr = 'http://my.oschina.net?name=judy&study=js&study=node'
console.log(queryString(urlStr)); 


/**
 * 从数组中找出三数之和为n
 * @param {*} str 
 * @returns 
 */


/**
 * 统计字符串中次数最多的字母
 * @param {*} str 
 * @returns 
 */
function maxStr(str){
    if(str.length <=1) return str;
    let obj={}
    for(let i=0 ;i<str.length;i++){
        if(!obj[str.charAt(i)]){
            obj[str.charAt(i)] = 1;
        }else{
            obj[str.charAt(i)] +=1;
        }
    }

    var max = 0;
    for( var i in obj){
        max = Math.max(max, obj[i]);
    }

    return max;

}
let str ='1rwertdfesdsdsdsss'
// console.log("maxS",maxStr(str))

/**
 * 顺时针打印矩阵
 * @param {*} matrix 
 * @returns 
 */
 var spiralOrder = function(matrix) {
    // !解题核心：本题存在一个路径上的循环：
    // 循环（左 ——> 右，上 ——> 下，右 ——> 左，下 ——> 上）
    // 如果是空数组
    if (matrix.length === 0) return [];
    // 定义四个指针
    let top = 0;
    let bottom = matrix.length - 1;
    let left = 0;
    let right = matrix[0].length - 1;
    // 定义存储最终结果的数组
    let res = [];
    // 最外边的循环是控制 顺时针圈数的循环
    while (1) {
        // 左 ——> 右
        for (let i = left; i <= right; i++) {
            res.push(matrix[top][i]);
        }
        top++;
        if (top > bottom) break;
        // 上 ——> 下
        for (let i = top; i <= bottom; i++) {
            res.push(matrix[i][right]);
        }
        right--;
        if (right < left) break;
        // 右 ——> 左
        for (let i = right; i >= left; i--) {
            res.push(matrix[bottom][i]);
        }
        bottom--;
        if (bottom < top) break;
        // 下 ——> 上
        for (let i = bottom; i >= top; i--) {
            res.push(matrix[i][left]);
        }
        left++;
        if (left > right) break;
    }
    return res
};


var matrix = [[1,2,3],[4,5,6],[7,8,9]]
console.log("---",spiralOrder(matrix))

/***
 * 洗牌算法
 */
