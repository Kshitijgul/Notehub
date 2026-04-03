# Section 2: JavaScript Basics — Variables, Hoisting, Types, Arrays, Operators

> Interview-focused notes with practical examples and common pitfalls

---

## 2.1 Variables

### What is a variable?
A **variable** is a named container used to store data in memory.

```javascript
let age = 25;
const name = "Alice";
var city = "Delhi";
```

### Variable lifecycle
1. **Declaration** — create a variable name
2. **Initialization** — assign first value
3. **Assignment** — change value later

```javascript
let score;        // declaration
score = 10;       // initialization
score = 20;       // assignment
```

### Why variables matter
- Store user input
- Hold API response data
- Keep state in apps
- Reuse values instead of repeating them

---

## 2.2 `var`, `let`, `const` — All Important Points

These are the three ways to declare variables in JavaScript.

| Feature | `var` | `let` | `const` |
|---|---|---|---|
| Scope | Function-scoped | Block-scoped | Block-scoped |
| Hoisted | Yes | Yes | Yes |
| Initialized during hoisting | Yes, as `undefined` | No | No |
| Redeclaration | Allowed | Not allowed in same scope | Not allowed in same scope |
| Reassignment | Allowed | Allowed | Not allowed |
| Best use | Legacy code only | Variables that change | Variables that should not be reassigned |

---

### 2.2.1 `var`
`var` is the old way to declare variables.

#### Important points
- Function-scoped, not block-scoped
- Hoisted and initialized to `undefined`
- Can be redeclared in the same scope
- Can be reassigned
- In browsers, top-level `var` becomes a property of `window`

```javascript
function demo() {
  if (true) {
    var x = 10;
  }
  console.log(x); // 10
}
demo();
```

Here, `x` is visible outside the `if` block because `var` ignores block scope.

#### Interview pitfall
```javascript
var a = 1;
var a = 2; // allowed
console.log(a); // 2
```

---

### 2.2.2 `let`
`let` is the modern way to declare variables that may change.

#### Important points
- Block-scoped
- Hoisted, but not initialized
- Cannot be redeclared in same scope
- Can be reassigned
- Safer than `var`

```javascript
if (true) {
  let age = 30;
  console.log(age); // 30
}
console.log(age); // ReferenceError
```

#### Use case
Use `let` when the value will change.

```javascript
let count = 0;
count = count + 1;
```

---

### 2.2.3 `const`
`const` declares a constant binding.

#### Important points
- Block-scoped
- Must be initialized at declaration
- Cannot be reassigned
- Hoisted, but in the **Temporal Dead Zone**
- Objects and arrays declared with `const` can still be mutated

```javascript
const pi = 3.14159;
// pi = 3.14; // TypeError
```

#### Important interview point
`const` does **not** mean the value is deeply immutable.

```javascript
const user = { name: "Alex" };
user.name = "John"; // allowed
console.log(user.name); // John
```

Same for arrays:

```javascript
const nums = [1, 2, 3];
nums.push(4); // allowed
console.log(nums); // [1, 2, 3, 4]
```

#### Use case
Use `const` by default when the variable should not be reassigned.

---

## 2.3 Hoisting

### What is hoisting?
Hoisting is JavaScript’s behavior of moving declarations to the top of their scope during compilation.

### Simple meaning
You can access some declarations before they appear in the code.

---

### 2.3.1 Hoisting with `var`
`var` declarations are hoisted and initialized with `undefined`.

```javascript
console.log(a); // undefined
var a = 10;
```

Internally, it behaves like:

```javascript
var a;
console.log(a); // undefined
a = 10;
```

---

### 2.3.2 Hoisting with `let` and `const`
`let` and `const` are also hoisted, but they are **not initialized** immediately.

They stay in the **Temporal Dead Zone (TDZ)** until the line of declaration is executed.

```javascript
console.log(b); // ReferenceError
let b = 20;
```

```javascript
console.log(c); // ReferenceError
const c = 30;
```

---

### 2.3.3 Function hoisting
Function declarations are fully hoisted.

```javascript
sayHello(); // works

function sayHello() {
  console.log("Hello");
}
```

But function expressions are not fully hoisted.

```javascript
greet(); // TypeError: greet is not a function

var greet = function () {
  console.log("Hi");
};
```

---

### Hoisting interview answer
**Hoisting is JavaScript’s mechanism where declarations are moved to the top of their scope.**
- `var` → hoisted and initialized as `undefined`
- `let`/`const` → hoisted but not initialized, so they are in TDZ
- function declarations → fully hoisted

---

### 2.3.4 Use case of hoisting
Hoisting is useful in function declarations when you want to organize code by putting helper functions later in the file.

```javascript
calculateTotal();

function calculateTotal() {
  console.log("Calculating...");
}
```

### Best practice
Do **not** rely on hoisting for variable usage. It makes code harder to read and debug.

---

## 2.4 Scope

### What is scope?
Scope decides where a variable can be accessed.

---

### Types of scope

#### 1. Global scope
Accessible everywhere in the file/module.

```javascript
let appName = "ShopApp";
```

#### 2. Function scope
Variables declared inside a function are available only inside that function.

```javascript
function test() {
  var x = 10;
  console.log(x);
}
```

#### 3. Block scope
Variables declared inside `{}` are only accessible inside that block.

```javascript
if (true) {
  let y = 20;
  const z = 30;
}
```

#### 4. Lexical scope
Inner functions can access variables from outer functions.

```javascript
function outer() {
  let name = "Alex";

  function inner() {
    console.log(name); // accessible
  }

  inner();
}
outer();
```

---

### Scope and `var` / `let` / `const`
- `var` → function scope
- `let` and `const` → block scope

```javascript
function example() {
  if (true) {
    var a = 1;
    let b = 2;
    const c = 3;
  }

  console.log(a); // 1
  // console.log(b); // Error
  // console.log(c); // Error
}
```

---

### Interview use case
Block scope is important in loops and conditionals.

```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// 0, 1, 2
```

If `var` were used, all callbacks would print `3`.

---

## 2.5 Declaration, Hoisting, Scope — Combined View

### Key idea
These three concepts are connected:

- **Declaration** creates the variable name
- **Hoisting** affects when the declaration becomes available
- **Scope** decides where the variable is accessible

### Example
```javascript
function demo() {
  console.log(x); // undefined
  var x = 5;

  if (true) {
    let y = 10;
    const z = 20;
  }
}
```

### Interview note
- `var x` is hoisted to the top of function scope
- `let y` and `const z` are block-scoped and hoisted but in TDZ

---

## 2.6 Built-in Types in JavaScript

JavaScript has **primitive types** and **reference types**.

---

### 2.6.1 Primitive types
These are immutable values:

1. `number`
2. `string`
3. `boolean`
4. `null`
5. `undefined`
6. `bigint`
7. `symbol`

---

### 2.6.2 Reference types
These are objects:

- `object`
- `array`
- `function`
- `Date`
- `RegExp`

---

### 2.6.3 Types you asked for

#### `number`
Used for integers and decimals.

```javascript
let price = 99.99;
let count = 10;
```

**Important points**
- All numbers are floating-point based (`IEEE 754`)
- `NaN` means “Not a Number” but its type is still `"number"`

```javascript
console.log(typeof NaN); // number
```

---

#### `string`
Used for text.

```javascript
let firstName = "John";
let message = 'Hello';
let quote = `Hi ${firstName}`;
```

**Important points**
- Strings are immutable
- Template literals use backticks

```javascript
let str = "hello";
str[0] = "H"; // does not change original string
console.log(str); // hello
```

---

#### `boolean`
Only two values:
- `true`
- `false`

```javascript
let isLoggedIn = true;
```

Used heavily in conditions and feature flags.

---

#### `null`
Represents an intentional empty value.

```javascript
let user = null;
```

**Important points**
- Means “nothing here on purpose”
- Often used to reset a variable
- `typeof null` is `"object"` — this is a long-standing JavaScript bug

```javascript
console.log(typeof null); // object
```

---

#### `undefined`
Means a value has not been assigned yet.

```javascript
let x;
console.log(x); // undefined
```

Also returned when accessing missing object properties.

```javascript
let obj = {};
console.log(obj.name); // undefined
```

---

#### `object`
Used for key-value data structures.

```javascript
let person = {
  name: "Alex",
  age: 25
};
```

Objects are mutable and commonly used for API data, configs, and structured records.

---

#### `array`
Arrays are ordered lists of values.

```javascript
let fruits = ["apple", "banana", "mango"];
```

**Important point:** Arrays are actually objects.

```javascript
console.log(typeof fruits); // object
console.log(Array.isArray(fruits)); // true
```

---

## 2.7 `null` vs `undefined`

This is a very common interview question.

| Feature | `null` | `undefined` |
|---|---|---|
| Meaning | Intentionally empty | Not assigned / missing |
| Set by | Developer | JavaScript engine or missing assignment |
| Type | object (bug) | undefined |
| Use case | Reset a value | Variable declared but not assigned |

### Example
```javascript
let a;
let b = null;

console.log(a); // undefined
console.log(b); // null
```

---

## 2.8 Arrays in Detail

### What is an array?
An array stores multiple values in one variable, in order.

```javascript
const colors = ["red", "green", "blue"];
```

---

### Array key features
- Zero-based indexing
- Dynamic size
- Can store mixed data types
- Arrays are objects
- Have many built-in methods

```javascript
const mixed = [1, "hello", true, null, { id: 1 }];
```

---

### 2.8.1 Array indexing
Arrays start at index `0`.

```javascript
const nums = [10, 20, 30];
console.log(nums[0]); // 10
console.log(nums[1]); // 20
console.log(nums[2]); // 30
```

Out of bounds gives `undefined`:

```javascript
console.log(nums[5]); // undefined
```

Negative indexing does **not** work like Python:

```javascript
console.log(nums[-1]); // undefined
```

Use `at()` if available:

```javascript
console.log(nums.at(-1)); // 30
```

---

### 2.8.2 `length` property
`length` is a **property**, not a function.

```javascript
const arr = [1, 2, 3];
console.log(arr.length); // 3
```

#### Important points
- `length` is always one more than the highest index
- Changing `length` can shrink or expand the array

```javascript
const a = [1, 2, 3, 4];
a.length = 2;
console.log(a); // [1, 2]
```

Expanding creates empty slots:

```javascript
const b = [1, 2];
b.length = 5;
console.log(b); // [1, 2, empty × 3]
```

---

## 2.8.3 Common Array Methods

Below are the most important array methods for interviews and practical coding.

---

### A. Methods that mutate the original array

#### `push()`
Adds item(s) to the end.

```javascript
const arr = [1, 2];
arr.push(3);
console.log(arr); // [1, 2, 3]
```

#### `pop()`
Removes the last item.

```javascript
const arr = [1, 2, 3];
arr.pop();
console.log(arr); // [1, 2]
```

#### `unshift()`
Adds item(s) to the start.

```javascript
const arr = [2, 3];
arr.unshift(1);
console.log(arr); // [1, 2, 3]
```

#### `shift()`
Removes the first item.

```javascript
const arr = [1, 2, 3];
arr.shift();
console.log(arr); // [2, 3]
```

#### `splice()`
Adds/removes/replaces items at any position.

```javascript
const arr = [1, 2, 3, 4];
arr.splice(1, 2, "A", "B");
console.log(arr); // [1, "A", "B", 4]
```

#### `sort()`
Sorts items in place.

```javascript
const nums = [10, 2, 5];
nums.sort();
console.log(nums); // [10, 2, 5]  (string sorting)
```

Proper numeric sort:

```javascript
nums.sort((a, b) => a - b);
console.log(nums); // [2, 5, 10]
```

#### `reverse()`
Reverses the array in place.

```javascript
const arr = [1, 2, 3];
arr.reverse();
console.log(arr); // [3, 2, 1]
```

#### `fill()`
Fills array with a static value.

```javascript
const arr = new Array(3).fill(0);
console.log(arr); // [0, 0, 0]
```

#### `copyWithin()`
Copies part of the array into another location.

```javascript
const arr = [1, 2, 3, 4];
arr.copyWithin(1, 3);
console.log(arr); // [1, 4, 3, 4]
```

---

### B. Methods that do not mutate the original array

#### `slice()`
Returns a shallow copy of part of the array.

```javascript
const arr = [1, 2, 3, 4];
const part = arr.slice(1, 3);
console.log(part); // [2, 3]
console.log(arr);  // unchanged
```

#### `concat()`
Combines arrays.

```javascript
const a = [1, 2];
const b = [3, 4];
console.log(a.concat(b)); // [1, 2, 3, 4]
```

#### `join()`
Converts array elements to a string.

```javascript
const arr = ["a", "b", "c"];
console.log(arr.join("-")); // a-b-c
```

#### `includes()`
Checks if a value exists.

```javascript
const arr = [1, 2, 3];
console.log(arr.includes(2)); // true
```

#### `indexOf()`
Returns index of first match.

```javascript
console.log([1, 2, 3].indexOf(2)); // 1
```

#### `lastIndexOf()`
Returns last index of match.

```javascript
console.log([1, 2, 2, 3].lastIndexOf(2)); // 2
```

#### `at()`
Supports negative indexing.

```javascript
const arr = [10, 20, 30];
console.log(arr.at(-1)); // 30
```

---

### C. Iteration methods

#### `forEach()`
Runs a function for each item.

```javascript
[1, 2, 3].forEach(n => console.log(n));
```

#### `map()`
Transforms each item and returns a new array.

```javascript
const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2);
console.log(doubled); // [2, 4, 6]
```

#### `filter()`
Keeps items that match a condition.

```javascript
const nums = [1, 2, 3, 4];
const evens = nums.filter(n => n % 2 === 0);
console.log(evens); // [2, 4]
```

#### `reduce()`
Combines array values into one result.

```javascript
const nums = [1, 2, 3, 4];
const sum = nums.reduce((acc, n) => acc + n, 0);
console.log(sum); // 10
```

#### `some()`
Checks whether at least one item matches.

```javascript
const hasEven = [1, 3, 5, 6].some(n => n % 2 === 0);
console.log(hasEven); // true
```

#### `every()`
Checks whether all items match.

```javascript
const allPositive = [1, 2, 3].every(n => n > 0);
console.log(allPositive); // true
```

#### `find()`
Returns first matching item.

```javascript
const users = [{ id: 1 }, { id: 2 }];
console.log(users.find(u => u.id === 2)); // { id: 2 }
```

#### `findIndex()`
Returns index of first matching item.

```javascript
console.log(users.findIndex(u => u.id === 2)); // 1
```

#### `findLast()` and `findLastIndex()`
Search from the end.

```javascript
const arr = [1, 2, 3, 2];
console.log(arr.findLast(n => n === 2)); // 2
console.log(arr.findLastIndex(n => n === 2)); // 3
```

---

### D. Array creation methods

#### `Array.isArray()`
Checks whether value is an array.

```javascript
Array.isArray([]); // true
Array.isArray({}); // false
```

#### `Array.from()`
Creates an array from iterable or array-like values.

```javascript
Array.from("hello"); // ["h", "e", "l", "l", "o"]
```

#### `Array.of()`
Creates an array from arguments.

```javascript
Array.of(5); // [5]
Array.of(1, 2, 3); // [1, 2, 3]
```

---

## 2.8.4 Common array use cases

### 1. Storing lists
```javascript
const todos = ["study", "exercise", "sleep"];
```

### 2. Rendering UI
```javascript
const items = ["A", "B", "C"];
items.map(item => `<li>${item}</li>`);
```

### 3. Processing API data
```javascript
const users = [
  { name: "A", active: true },
  { name: "B", active: false }
];

const activeUsers = users.filter(user => user.active);
```

### 4. Aggregating values
```javascript
const cart = [100, 200, 300];
const total = cart.reduce((sum, price) => sum + price, 0);
```

---

## 2.9 Comments in JavaScript

Comments are used to explain code and improve readability.

---

### 1. Single-line comments
```javascript
// This is a single-line comment
let x = 10;
```

### 2. Multi-line comments
```javascript
/*
  This is a multi-line comment
  Useful for longer explanations
*/
```

### 3. JSDoc comments
Used for documentation and editor hints.

```javascript
/**
 * Adds two numbers
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function add(a, b) {
  return a + b;
}
```

### Best practices
- Use comments to explain **why**, not obvious **what**
- Avoid outdated comments
- Remove commented-out dead code

---

## 2.10 JavaScript Pros and Cons

### Pros

#### 1. Runs everywhere
Works in browsers and on servers.

#### 2. Easy to learn and start
Simple syntax and immediate feedback.

#### 3. Huge ecosystem
NPM has millions of packages.

#### 4. Great for web development
Best language for interactive UI.

#### 5. Full-stack capability
Same language for frontend and backend.

#### 6. Async support
Excellent for event-driven applications.

---

### Cons

#### 1. Dynamic typing can cause bugs
```javascript
"5" + 1; // "51"
"5" - 1; // 4
```

#### 2. Type coercion can be confusing
```javascript
[] == false; // true
```

#### 3. Single-threaded
Heavy CPU work can block the UI or event loop.

#### 4. Browser differences existed historically
Modern engines are much more consistent, but legacy issues remain in older environments.

#### 5. Security risks in browser context
Code runs on the client side and can be inspected.

---

## 2.11 All Types of Operators

Operators perform operations on values.

---

### 2.11.1 Arithmetic operators
- `+` addition
- `-` subtraction
- `*` multiplication
- `/` division
- `%` modulus
- `**` exponentiation

```javascript
10 + 5;  // 15
10 % 3;  // 1
2 ** 3;  // 8
```

---

### 2.11.2 Assignment operators
- `=`
- `+=`
- `-=`
- `*=`
- `/=`
- `%=`
- `**=`

```javascript
let x = 10;
x += 5; // 15
```

---

### 2.11.3 Comparison operators
- `==` loose equality
- `===` strict equality
- `!=`
- `!==`
- `>`
- `<`
- `>=`
- `<=`

```javascript
5 > 3; // true
5 <= 5; // true
```

---

### 2.11.4 Logical operators
- `&&` AND
- `||` OR
- `!` NOT
- `??` nullish coalescing

```javascript
true && false; // false
true || false; // true
!true; // false
```

---

### 2.11.5 Unary operators
- `typeof`
- `delete`
- `void`
- `++`
- `--`
- unary `+`
- unary `-`

```javascript
typeof 5; // "number"
+ "10";   // 10
- "10";   // -10
```

---

### 2.11.6 Bitwise operators
- `&`
- `|`
- `^`
- `~`
- `<<`
- `>>`
- `>>>`

Used in low-level operations, flags, and performance-sensitive logic.

```javascript
5 & 1; // 1
5 | 1; // 5
```

---

### 2.11.7 Ternary operator
A short form of `if-else`.

```javascript
const result = age >= 18 ? "Adult" : "Minor";
```

---

### 2.11.8 Comma operator
Evaluates multiple expressions, returns the last one.

```javascript
let x = (1, 2, 3);
console.log(x); // 3
```

Rarely used.

---

### 2.11.9 Optional chaining
Useful when nested objects may be missing.

```javascript
user.profile?.address?.city;
```

---

### 2.11.10 `in` operator
Checks whether a property exists in an object.

```javascript
const obj = { name: "Alex" };
console.log("name" in obj); // true
```

---

## 2.12 `==` vs `===`

This is a very common interview question.

---

### `==` loose equality
Compares values after type conversion.

```javascript
"5" == 5; // true
0 == false; // true
null == undefined; // true
```

### `===` strict equality
Compares both value and type.

```javascript
"5" === 5; // false
0 === false; // false
null === undefined; // false
```

---

### Why `===` is preferred
Because it avoids unexpected type coercion.

```javascript
[] == false; // true
[] === false; // false
```

### Best practice
Use `===` in almost all cases.

---

## 2.13 Combining Multiple Conditions

JavaScript uses logical operators to combine conditions.

---

### 1. AND `&&`
Both conditions must be true.

```javascript
if (age >= 18 && hasId) {
  console.log("Allowed");
}
```

### 2. OR `||`
At least one condition must be true.

```javascript
if (isAdmin || isOwner) {
  console.log("Access granted");
}
```

### 3. NOT `!`
Reverses the boolean value.

```javascript
if (!isLoggedIn) {
  console.log("Please login");
}
```

---

### Short-circuit behavior

#### `&&`
Stops as soon as one value is false.

```javascript
false && console.log("Won't run");
```

#### `||`
Stops as soon as one value is true.

```javascript
true || console.log("Won't run");
```

---

### Practical use cases

#### Form validation
```javascript
if (email && password && password.length >= 8) {
  console.log("Valid input");
}
```

#### Default values
```javascript
const username = inputValue || "Guest";
```

#### Better default for `null` or `undefined`
```javascript
const username = inputValue ?? "Guest";
```

---

### Important: `||` vs `??`
- `||` treats `false`, `0`, `""`, `NaN` as fallback cases
- `??` only treats `null` and `undefined` as fallback cases

```javascript
0 || 10;   // 10
0 ?? 10;   // 0
```

---

## 2.14 Increment and Decrement on Non-Numeric Values

`++` and `--` convert the value to a number first.

---

### Important: literals like `null++` are invalid
This is because you cannot increment a literal directly.

```javascript
// null++; // SyntaxError
```

But if stored in a variable:

```javascript
let x = null;
x++;
console.log(x); // 1
```

### Why?
Because:
- `null` becomes `0`
- then `0 + 1 = 1`

---

### Conversion examples

```javascript
let a = "5";
a++;
console.log(a); // 6

let b = true;
b++;
console.log(b); // 2

let c = undefined;
c++;
console.log(c); // NaN

let d = "hello";
d++;
console.log(d); // NaN
```

---

### More examples
```javascript
let e = [];
e++;
console.log(e); // 1

let f = [1];
f++;
console.log(f); // 2
```

---

### Postfix vs prefix

#### Postfix
Returns old value first, then increments.

```javascript
let n = 5;
console.log(n++); // 5
console.log(n);   // 6
```

#### Prefix
Increments first, then returns new value.

```javascript
let m = 5;
console.log(++m); // 6
console.log(m);   // 6
```

---

### Interview advice
Do **not** use `++` or `--` on non-numeric values in real projects. It leads to confusing coercion bugs.

---

## 2.15 Array Indexing — Important Notes

### Zero-based indexing
First item is at index `0`.

```javascript
const arr = ["a", "b", "c"];
console.log(arr[0]); // "a"
console.log(arr[2]); // "c"
```

### Updating by index
```javascript
arr[1] = "x";
console.log(arr); // ["a", "x", "c"]
```

### Reading out of range
```javascript
console.log(arr[100]); // undefined
```

### Negative index
Not supported with standard bracket syntax:

```javascript
console.log(arr[-1]); // undefined
```

Use `.at(-1)` instead:

```javascript
console.log(arr.at(-1)); // "c"
```

---

## 2.16 Array vs Object Quick Difference

| Feature | Array | Object |
|---|---|---|
| Purpose | Ordered list | Key-value data |
| Access | Index-based | Key-based |
| Order | Yes | Usually insertion order, but not for all cases |
| Example | `["a", "b"]` | `{ name: "Alex" }` |

---

## 2.17 Interview Cheat Sheet

### Variables
- Prefer `const`
- Use `let` when reassignment is needed
- Avoid `var` in modern code

### Hoisting
- `var` → `undefined`
- `let/const` → TDZ
- function declarations are hoisted

### Types
- Primitives: number, string, boolean, null, undefined, bigint, symbol
- Arrays are objects
- `typeof null` is `"object"`

### Arrays
- Zero-based
- `length` is a property
- Use `Array.isArray()` to check arrays
- Learn `push`, `pop`, `map`, `filter`, `reduce`, `slice`, `splice`

### Operators
- Use `===` instead of `==`
- Use `&&`, `||`, `??` carefully
- Be aware of type coercion

### Increment/decrement
- Works on variables holding numeric-like values
- Avoid on strings/objects/non-numeric values

# 🚀 JavaScript Deep Dive Notes - Section 2: JavaScript Basics
## ✅ Fully Merged Final Version | 100% Interview Optimized

> This document combines the best parts of both drafts, all duplicates removed, ordered by interview frequency.
>
> Includes: official accepted answer ✅, runnable code example 🧪, output, gotchas ⚠️, and why interviewers ask this question.
>
> 🎯 Study Hack: Cover the answer, predict output, then verify. Practice explaining every answer out loud in 30 seconds or less.

| 🔥 Frequency Rating | Meaning |
|---|---|
| 🟢 99% | Asked at nearly every JavaScript interview |
| 🟡 70% | Very common question |
| 🟠 40% | Moderately common |
| 🔴 20% | Occasional trick question |


---

## 📌 TOPIC 1: Variables & Declarations


---

### ❓ Question: Explain the difference between `var`, `let` and `const`
🔥 Frequency: 🟢 99%

✅ Standard accepted answer:
| Feature | `var` | `let` | `const` |
|---|---|---|---|
| Scope Rule | Function scoped only | Block scoped | Block scoped |
| Hoisting behavior | Yes, initialized to `undefined` | Yes, stays in Temporal Dead Zone | Yes, stays in Temporal Dead Zone |
| Can be redeclared in same scope | ✅ Yes | ❌ No | ❌ No |
| Can be reassigned | ✅ Yes | ✅ Yes | ❌ No |
| Attaches to global `window` object | ✅ Yes | ❌ No | ❌ No |

> Additional note: `let` and `const` were added in ES6 specifically to fix the well known design flaws in `var`.

✅ Industry Best Practice: Use `const` by default for all variables. Only use `let` when you explicitly need to reassign a value. Never use `var` in modern code.

🧪 Code example:
```javascript
var g1 = 1; console.log(window.g1); // 1
let g2 = 2; console.log(window.g2); // undefined
```

⚠️ Gotcha: `const` does NOT make values immutable, only prevents reassignment.


---

### ❓ Question: Explain the famous loop timeout example. Why is the output different?
🔥 Frequency: 🟢 99%
> #1 most asked junior JavaScript question of all time.

🧪 Code:
```javascript
for(var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Output: 3, 3, 3
```
```javascript
for(let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Output: 0, 1, 2
```

✅ Correct Answer:
This is the classic demonstration of block scope vs function scope:
- In the first case `var i` is function scoped. There is only one single `i` variable shared by all 3 callbacks. By the time the timeout runs, the loop has already finished and `i` is already 3.
- In the second case `let i` is block scoped. A brand new separate `i` variable is created for every single iteration of the loop. Each callback gets its own private copy.

Why asked: Tests understanding of scope, closures and the event loop.


---

### ❓ Question: Does `const` make a value immutable?
🔥 Frequency: 🟢 99%
> ⚠️ 60% of candidates answer this incorrectly

✅ Correct Answer:
**No.** This is the single biggest misconception about const.
`const` only creates an immutable binding. That means you cannot reassign the variable name to point to a different value.
But if the value itself is mutable like an object or array, you can still freely modify its contents.

🧪 Code example:
```javascript
const user = {name: "Alex"};
user.name = "Bob"; // ✅ ALLOWED: This is mutation, NOT reassignment
user = {};         // ❌ TYPE ERROR: This is reassignment

const arr = [1];
arr.push(2);       // ✅ [1, 2] Mutation allowed
arr = [3];         // ❌ Error Reassignment blocked
```


---

### Common edge case questions
🔥 Frequency: 🟡 70%

| Code | Output | Explanation |
|---|---|---|
| `var x=1; var x=2; console.log(x)` | `2` | var allows silent redeclaration |
| `let x=1; let x=2;` | `SyntaxError` | let / const blocks redeclaration |
| `for(const i=0;i<3;i++){}` | `TypeError` | Loop counter requires reassignment |
| `switch` statement `var` | ✅ Leaks across all cases | var ignores block scope |


---

## 📌 TOPIC 2: Hoisting & Temporal Dead Zone


---

### ❓ Question: Are `let` and `const` hoisted?
🔥 Frequency: 🟢 99%
> ⚠️ #1 filter question. 75% of all candidates give the wrong answer here.

❌ Wrong answer: No
✅ Correct Answer:
**Yes. All declarations in JavaScript are hoisted, including let and const.**
The only difference is initialization behavior:
- `var` is hoisted and immediately initialized to `undefined`
- `let` and `const` are hoisted, but they are NOT initialized. They remain in the Temporal Dead Zone until execution reaches the line they are declared on. Any attempt to access them while in TDZ throws a ReferenceError.

🧪 Code demonstration:
```javascript
console.log(a); // undefined
var a = 10;

console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 20;
```


---

### ❓ Question: What is hoisting?
🔥 Frequency: 🟢 99%

✅ Standard accepted answer:
Hoisting is a phase of JavaScript compilation where all declarations are registered at the top of their scope, before any line of code is executed. JavaScript always runs in two phases: Compile phase first, then Execution phase.

Hoisting order priority:
1. Function Declarations (fully hoisted)
2. `var` declarations
3. `let` / `const` declarations


---

### ❓ Question: What is the difference between function declaration and function expression hoisting?
🔥 Frequency: 🟡 70%

✅ Correct Answer:
```javascript
// Function Declaration
hello(); // ✅ Works perfectly
function hello() { console.log("hi") }
```
Function declarations are fully hoisted, including their actual value.

```javascript
// Function Expression
greet(); // ❌ TypeError: greet is not a function
var greet = function() {}
```
Only the variable part is hoisted, the function value itself is not.

✅ Valid use case for hoisting: Call helper functions before their definition to improve code readability.


---

## 📌 TOPIC 3: Scope


---

### ❓ Question: What are the 4 types of scope in JavaScript?
🔥 Frequency: 🟡 70%
✅ Answer: Global Scope, Module Scope, Function Scope, Block Scope

### ❓ Question: Explain lexical scope
🔥 Frequency: 🟡 70%
✅ Answer: Inner functions always have access to variables declared in outer scopes. This is the foundation of closures.

🧪 Code example:
```javascript
function outer(x){
  return function inner(){ return x; }
}
const fn = outer(10);
fn(); // 10
```

Common use cases: Private state, counters, callbacks.


---

## 📌 TOPIC 4: Data Types


---

### ❓ Question: What is the difference between `null` and `undefined`?
🔥 Frequency: 🟢 99%
> Asked in literally every JavaScript interview ever.

✅ Correct Answer:

| | `null` | `undefined` |
|---|---|---|
| Meaning | Intentionally empty value | Value was never assigned / does not exist |
| Set by | Always explicitly set by developer | Always set automatically by JavaScript engine |
| `typeof` result | `"object"` (famous 28 year old unfixed language bug) | `"undefined"` |

> Best Practice: Use `null` when you want to intentionally clear or reset a value. Never intentionally assign `undefined` in your code.


---

### ❓ Question: How do you properly check if a value is an array?
🔥 Frequency: 🟢 99%

✅ Correct Answer: `Array.isArray(value)`

❌ All common wrong answers:
- `typeof value === 'object'` ❌ returns true for objects, dates, regex etc
- `value instanceof Array` ❌ fails across iframe / realm boundaries

> Important note: Arrays are a special subtype of object. That is why `typeof []` returns `"object"`. This is the most common mistake junior developers make.


---

### ❓ Question: Primitive vs Reference types
🔥 Frequency: 🟡 70%
✅ Answer:
- Primitives: passed and copied by value, immutable
- References: passed and copied by pointer, mutable

Complete list of 7 primitive types:
`number`, `string`, `boolean`, `null`, `undefined`, `bigint`, `symbol`


---

## 📌 TOPIC 5: Arrays


---

### ❓ Question: Which array methods mutate the original array, and which return a new array?
🔥 Frequency: 🟡 70%

✅ Memorize this table:
| ❌ Mutates original array | ✅ Returns new array |
|---|---|
| `push()`, `pop()` | `slice()` |
| `unshift()`, `shift()` | `map()` |
| `splice()` | `filter()` |
| `sort()` | `reduce()` |
| `reverse()` | `concat()` |
| `fill()` | `includes()`, `find()` |

> ⚠️ Interviewer Trap: Almost every candidate forgets that `sort()` and `reverse()` mutate the array. This is also the #1 cause of subtle production bugs.


---

### ❓ Question: Explain common array indexing edge cases
🔥 Frequency: 🟠 40%

| Code | Output | Explanation |
|---|---|---|
| `[1,2,3][5]` | `undefined` | Out of bounds index never throws an error |
| `[1,2,3][-1]` | `undefined` | Bracket syntax does NOT support negative indexing |
| `[1,2,3].at(-1)` | `3` | `at()` added in ES2022 properly supports negative index |
| `const arr = []; arr[10] = 5; arr.length` | `11` | Array length is always highest index + 1 |


---

### Most common array method questions
🔥 Frequency: 🟡 70%

✅ Holy trinity of iteration:
```javascript
[1,2,3]
 .map(x => x * 2)                         // [2,4,6] Transform
 .filter(x => x > 3)                      // [4,6] Select
 .reduce((sum, n) => sum + n, 0);         // 10 Aggregate
```

⚠️ `sort()` pitfall:
```javascript
[40, 100, 2].sort()                      // [100, 2, 40] ❌ Default string sort
[40, 100, 2].sort((a,b) => a - b)        // [2, 40, 100] ✅ Correct numeric sort
```


---

## 📌 TOPIC 6: Operators


---

### ❓ Question: What is the difference between `==` and `===` ?
🔥 Frequency: 🟢 99%

✅ Standard accepted answer:
- `==` loose equality: It will automatically convert both sides to the same type first, then compare only the value
- `===` strict equality: It compares both value AND type. No automatic type conversion is performed.

✅ Best Practice: Always use `===` in all code. The only widely accepted exception is `x == null` which conveniently checks for both null AND undefined in one operation.


---

### ❓ Question: Famous trick question: What is the output and why?
🔥 Frequency: 🟡 70%
```javascript
console.log([] == ![]);
```

🤯 Output: `true`

✅ Correct Answer:
This is the most famous demonstration of broken type coercion rules. This is exactly the reason we almost always avoid using `==`. The coercion rules produce completely unintuitive results that no reasonable developer would expect.


---

### ❓ Question: What is the difference between `||` and `??` operators?
🔥 Frequency: 🟢 99%
> Most asked operator question added after ES2020

✅ Correct Answer:
- `||` OR operator falls back on ANY falsy value: `false`, `0`, `""`, `NaN`, `null`, `undefined`
- `??` Nullish coalescing operator falls back ONLY on `null` and `undefined`

Direct comparison:
| Code | `||` result | `??` result |
|---|---|---|
| `0 || 10` | `10` | `0` |
| `"" || "default"` | `"default"` | `""` |
| `false || true` | `true` | `false` |
| `null || 10` | `10` | `10` |

✅ Best Practice: Use `??` for default values. Use `||` only when you explicitly want to fallback on empty string, zero and false.


---

### ❓ Question: Explain increment operator behavior on non numeric values
🔥 Frequency: 🟡 70%

✅ Rule: `++` and `--` always convert the value to number first. Also you can only increment variables, not literals.

| Code | Output |
|---|---|
| ```let x = null; x++;``` | `1` |
| ```let x = true; x++;``` | `2` |
| ```let x = false; x++;``` | `1` |
| ```let x = "5"; x++;``` | `6` |
| ```let x = undefined; x++;``` | `NaN` |
| ```null++``` | SyntaxError |

✅ Best Practice: Never ever use the increment operator on non numeric values in real code. This feature exists only for interview trick questions.


---

### ❓ Question: What is the difference between prefix `++` and postfix `++` ?
🔥 Frequency: 🟡 70%

✅ Correct Answer:
```javascript
let a = 5;
console.log(a++); // 5  -> Postfix: returns old value first, then increments
console.log(a);   // 6

let b = 5;
console.log(++b); // 6  -> Prefix: increments first, then returns new value
console.log(b);   // 6
```


---

### ❓ Question: Explain short circuit behavior of logical operators
🔥 Frequency: 🟡 70%

✅ Correct Answer:
- `&&` stops evaluation immediately as soon as it finds the first falsy value
- `||` stops evaluation immediately as soon as it finds the first truthy value

Code example:
```javascript
false && console.log("This will never run");
true || console.log("This will never run");
```


---

## 📌 TOPIC 7: Comments
### ❓ Question: Types and best practice?
🔥 Frequency: 🟠 40%
✅ **// /** /* */ /**JSDoc */**. WHY not WHAT. No dead code/JSDoc types.

## 📌 TOPIC 8: JS Pros/Cons
### ❓ Question: Top pros/cons + fixes?
🔥 Frequency: 🟡 70%
✅ **Pros**: Everywhere/ecosystem/async. **Cons**: Typing(TS)/coerce(===)/thread(Workers).

---

## ❌ Answers You Should Never Give In An Interview
These are extremely common wrong answers that will immediately get you rejected:
1. ❌ "let and const are not hoisted"
2. ❌ "const makes objects immutable"
3. ❌ "`==` is always evil and has zero valid use cases"
4. ❌ "Arrays are not objects"
5. ❌ "JavaScript is purely interpreted"


---

## 🔥 TOP 20 Interview Questions Mega-Cheat Sheet
Drill these until you can answer them instantly:

1. Hoisting `var/let` output? → `undefined` / ReferenceError
2. Loop setTimeout fix? → use `let`
3. const mutate objects? → Yes
4. `typeof null`? → `"object"` ancient bug
5. `[] == false`? → true
6. Complete list of falsy values? → 6 items
7. Correct numeric array sort? → `.sort((a,b) => a-b)`
8. `let n=null; n++`? → 1
9. Array check? → `Array.isArray()`
10. `||` vs `??` on 0? → `??` preserves 0
11. Global `let` on window? → No
12. TDZ definition? → `let/const` pre-declaration zone
13. `NaN === NaN`? → false
14. `at(-1)` use? → Get last array element
15. Which methods mutate array? → push / sort / reverse / splice
16. `x == null` checks for? → both null AND undefined
17. Closure counter pattern? → return inner function
18. Variable shadowing? → inner blocks hide outer variables
19. `var` scope rule? → function scope only
20. Function expression vs declaration hoisting? → only declarations are fully hoisted


---

> 🎯 Final Note:
> If you can confidently answer every single question on this page, you will get 100% of the points for Section 2 topics in any JavaScript interview. There are no other common questions on these topics.

---
