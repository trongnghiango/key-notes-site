---
date: 2024-11-05
modified: 2025-04-14T12:00:00Z
title: Những phương thức phổ biến của Array trong Javascript
draft: true
categories:
  - javascript
  - data_structures
---

### `filter`

#### dung de loc data trong array

#### Syntax:

```js
let newArr = array.filter(callback(currentValue[, index[, array]])[, thisArg]);
```

#### Example:

```js
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Sử dụng phương thức filter để lấy các số chẵn
const evenNumbers = numbers.filter((num) => num % 2 === 0)

console.log(evenNumbers) // [2, 4, 6, 8, 10]
```

