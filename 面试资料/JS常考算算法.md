# 1. 排序算法

<img src="https://upload-images.jianshu.io/upload_images/5959612-ca6309e099dc2eaf.png?imageMogr2/auto-orient/strip|imageView2/2/w/594/format/webp">

## 思想

- 在收据集中，选择一个元素作为 基准
- 所有小于 基准 的元素，都移到 基准 的左边；所有大于 基准 的元素，都移到 基准 的右边
- 对于 基准 左边和右边的两个子集，不断重复第一步和第二步，直到所有子集只剩下一个元素为止

## 复杂度

- 时间复杂度：平均情况是O(nlgn)，最坏情况是 **n2**
- 空间复杂度：由于递归调用 O(lgn)

## 使用场景

数据量大的时候效果明显

## 源码实现

```js\
var quickSort = function(arr) {
	if(arr.length <= 1) {
		return arr;
	}
	var pivotIndex = Math.floor(arr.length / 2);
	var pivot = arr.splice(pivotIndex, 1)[0];
	var left = [];
	var right = [];
	for(var i = 0; i < arr.length; i++) {
		if(arr[i] < pivot) {
			left.push(arr[i]);
		}else {
			right.push(arr[i]);
		}
	}
	return quickSort(left).concat([pivot], quickSort(right));
}
```





# 2. 字符串反转

```js
function reverseString(str) {
    return str.split("").reverse().join("");
}
```





# 3. Top K问题

## 什么是 Top K 问题

简答来说就是在一组数据里面找到频率出现最高的前 K 个数，或前 K 大（当然也可以是前 K 小）的数。

经典的 Top K 问题有：最大（小）K个数丶前 K 个高频元素，第 K 个最大（小）元素



# 1块、4块、5块，求总数n块的最少硬币数

- 1、1、2、3、5、8...计算第n个数的值（斐波那契数列）





柯里化通用实现和two-sum问题。



1. 算法：实现setter(obj, 'a.b.c' ,val)
2. 冒泡排序

