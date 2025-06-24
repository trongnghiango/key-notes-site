---
date: 2024-11-07
modified: 2024-10-07T07:28:37Z
title: Những thay đổi của Javascript trong bản cập nhật ES13 (es2022)
draft: true
categories:
  - javascript
  - syntax
---

- [ ] Phương thức `hasOwnProperty('key')` có thể không còn phù hợp.
- [ ] Thay vào đó ta có `Object.hasOwn(obj, 'key')`
- [ ] cập nhật phương thức `arr.at(index)` trong `array`
```js
const arr = [1, 2, 3, 4, 5]
console.log(arr[0])  //sẽ tương đương với
console.log(arr.at(0))
```
- [ ] ...
