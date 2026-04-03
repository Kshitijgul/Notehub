# 🚀 JavaScript Deep Dive Notes — Section 3: Control Flow Structures (Conditionals + Loops)
## **100% Interview Q&A Format | Syntax → Example → Output → Gotchas → Best Practice**

> Rule you asked: **Every concept includes a “Syntax” block BEFORE the example code.**  
> Run snippets in browser console / Node.js.

---

## 📌 TOPIC 1: Conditional Statements (`if`, `else if`, `else`, nested)

---

### ❓ Q1: What is control flow in JavaScript?
**Frequency:** 🟢 99%  
✅ **Standard Answer:** Control flow determines **which block of code executes** based on conditions and repetition (conditionals + loops).

**Why asked?** Checks fundamentals and ability to reason about execution.

---

### ❓ Q2: What is the syntax of an `if` statement?
**Frequency:** 🟢 99%  
✅ **Standard Answer:** Executes a block only when condition is truthy.

**Syntax**
```js
if (condition) {
  // runs if condition is truthy
}
```

**Example**
```js
const isLoggedIn = true;

if (isLoggedIn) {
  console.log("Show dashboard");
}
```

**Output**
```
Show dashboard
```

**Gotcha:** Condition uses **truthy/falsy** rules (not strictly boolean).  
**Best Practice:** Keep conditions simple; extract complex checks into helper functions.

---

### ❓ Q3: `if...else` syntax and real-world use case?
**Frequency:** 🟢 99%  
✅ **Answer:** Choose between two paths.

**Syntax**
```js
if (condition) {
  // true branch
} else {
  // false branch
}
```

**Example (Authentication UI)**
```js
const token = "";

if (token) {
  console.log("Fetch user profile");
} else {
  console.log("Redirect to login");
}
```

**Output**
```
Redirect to login
```

**Gotcha:** Empty string `""` is falsy.  
**Best Practice:** For auth tokens, prefer explicit checks (e.g., token length / validation).

---

### ❓ Q4: How does `else if` chain work? (Order matters)
**Frequency:** 🟢 99%  
✅ **Answer:** First matching condition runs; remaining blocks are skipped.

**Syntax**
```js
if (cond1) {
} else if (cond2) {
} else {
}
```

**Example (Grading)**
```js
const score = 82;

if (score >= 90) console.log("A");
else if (score >= 75) console.log("B");
else if (score >= 60) console.log("C");
else console.log("Fail");
```

**Output**
```
B
```

**Gotcha:** Put **most specific / highest priority** checks first.  
**Best Practice:** Avoid deeply complex chains; consider `switch` or lookup maps for fixed categories.

---

### ❓ Q5: Nested `if...else` — when used and when avoided?
**Frequency:** 🟡 70%  
✅ **Answer:** Used when conditions depend on earlier decisions; avoided if it reduces readability.

**Syntax**
```js
if (cond1) {
  if (cond2) {
  } else {
  }
} else {
}
```

**Example (Permissions)**
```js
const isLoggedIn = true;
const role = "admin";

if (isLoggedIn) {
  if (role === "admin") console.log("Show admin panel");
  else console.log("Show user home");
} else {
  console.log("Redirect to login");
}
```

**Output**
```
Show admin panel
```

**Gotcha:** Nested conditions become hard to read (“arrow code”).  
✅ **Best Practice (Interview-friendly): use Guard Clauses / early return**
```js
function routeUser(isLoggedIn, role) {
  if (!isLoggedIn) return "login";
  if (role === "admin") return "admin";
  return "home";
}
console.log(routeUser(true, "user")); // home
```

---

## 📌 TOPIC 2: Ternary Operator (`?:`)

---

### ❓ Q6: What is the ternary operator and when should you use it?
**Frequency:** 🟢 99%  
✅ **Answer:** Short form of `if...else` that returns a value.

**Syntax**
```js
condition ? exprIfTrue : exprIfFalse
```

**Example**
```js
const age = 17;
const access = age >= 18 ? "Allowed" : "Denied";
console.log(access);
```

**Output**
```
Denied
```

**Gotcha:** Don’t nest ternaries in production (readability).  
✅ **Best Practice:** Use ternary for **simple value assignment**, not multi-step logic.

**Bad**
```js
// Hard to read
const label = score > 90 ? "A" : score > 75 ? "B" : "C";
```

---

## 📌 TOPIC 3: `switch` Statement (`case`, `break`, `default`)

---

### ❓ Q7: When do you prefer `switch` over `if...else`?
**Frequency:** 🟡 70%  
✅ **Answer:** Use `switch` when you compare **one expression** against many discrete values (menus/status codes).  
For ranges/complex boolean logic, prefer `if...else`.

---

### ❓ Q8: `switch` syntax + role-based routing use case
**Frequency:** 🟡 70%  

**Syntax**
```js
switch (expression) {
  case value1:
    // code
    break;
  case value2:
    // code
    break;
  default:
    // fallback
}
```

**Example**
```js
const role = "editor";

switch (role) {
  case "admin":
    console.log("Full access");
    break;
  case "editor":
    console.log("Edit access");
    break;
  case "viewer":
    console.log("Read-only access");
    break;
  default:
    console.log("No access");
}
```

**Output**
```
Edit access
```

**Gotcha:** Without `break`, execution “falls through” to the next case.  
✅ **Best Practice:** Always include `break` (or `return`) unless you intentionally want fallthrough.

---

### ❓ Q9: Demonstrate switch fallthrough (intentional)
**Frequency:** 🟠 40%

**Syntax**
```js
switch (x) {
  case a:
  case b:
    // shared logic
    break;
}
```

**Example (Multiple cases same behavior)**
```js
const httpStatus = 201;

switch (httpStatus) {
  case 200:
  case 201:
  case 204:
    console.log("Success");
    break;
  case 400:
  case 404:
    console.log("Client error");
    break;
  default:
    console.log("Other");
}
```

**Output**
```
Success
```

---

### ❓ Q10: What is `default` in a switch?
**Frequency:** 🟢 99%  
✅ **Answer:** Fallback branch when no case matches.

**Gotcha:** `default` can appear anywhere, but typically last for readability.  
✅ **Best Practice:** Always include `default` to handle unexpected values.

---

## 📌 TOPIC 4: Loops (5 types) + Real Use Cases

> **5 core loop types (interview standard):**  
> 1) `for` 2) `while` 3) `do...while` 4) `for...of` 5) `for...in`

---

### ❓ Q11: Which loop should you use most often and why?
**Frequency:** 🟡 70%  
✅ **Answer:**  
- Use `for...of` for iterating values in arrays/strings (clean + safe)  
- Use `for` for indexed loops/performance  
- Use `while` when the number of iterations is unknown

---

## 4.1 `for` loop

### ❓ Q12: `for` loop syntax + best use case?
**Frequency:** 🟢 99%  
✅ **Answer:** Best when you know iteration count or need index.

**Syntax**
```js
for (initialization; condition; increment) {
  // body
}
```

**Example (Countdown - synchronous)**
```js
for (let i = 5; i >= 1; i--) {
  console.log(i);
}
console.log("GO!");
```

**Output**
```
5
4
3
2
1
GO!
```

**Gotcha:** This is not a real “timer”; it runs immediately (JS is single-threaded).  
✅ **Real timer scenario uses `setInterval`**
```js
let i = 5;
const id = setInterval(() => {
  console.log(i);
  i--;
  if (i === 0) {
    console.log("GO!");
    clearInterval(id);
  }
}, 1000);
```

---

## 4.2 `while` loop

### ❓ Q13: `while` loop syntax + practical use case?
**Frequency:** 🟡 70%  
✅ **Answer:** Use when repetitions depend on a condition and count is unknown (retry, polling, reading input).

**Syntax**
```js
while (condition) {
  // body
}
```

**Example (Retry API simulation)**
```js
let attempts = 0;
let success = false;

while (!success && attempts < 3) {
  attempts++;
  // simulate success on 3rd attempt
  success = attempts === 3;
  console.log("Attempt:", attempts, "Success:", success);
}
```

**Output**
```
Attempt: 1 Success: false
Attempt: 2 Success: false
Attempt: 3 Success: true
```

**Gotcha:** Risk of infinite loop.  
✅ **Best Practice:** Ensure loop modifies condition.

---

## 4.3 `do...while` loop

### ❓ Q14: Why use `do...while`?
**Frequency:** 🟠 40%  
✅ **Answer:** It guarantees the loop runs **at least once** (menus, prompting user).

**Syntax**
```js
do {
  // body
} while (condition);
```

**Example (Menu simulation)**
```js
let choice;
let tries = 0;

do {
  tries++;
  choice = tries === 2 ? "exit" : "continue";
  console.log("User choice:", choice);
} while (choice !== "exit");
```

**Output**
```
User choice: continue
User choice: exit
```

---

## 4.4 `for...of` loop (iterate values)

### ❓ Q15: Why prefer `for...of` over `for...in` for arrays?
**Frequency:** 🟢 99%  
✅ **Answer:** `for...of` iterates **values** safely. `for...in` iterates **keys** and can include inherited properties.

**Syntax**
```js
for (const value of iterable) {
  // body
}
```

**Example (Sum values in cart)**
```js
const cart = [99, 199, 50];
let total = 0;

for (const price of cart) {
  total += price;
}
console.log(total);
```

**Output**
```
348
```

**Gotcha:** `for...of` works on iterables (arrays, strings, maps, sets). Not plain objects.  
✅ **Best Practice:** Use `for...of` for arrays/strings.

---

## 4.5 `for...in` loop (iterate keys)

### ❓ Q16: When should you use `for...in`?
**Frequency:** 🟡 70%  
✅ **Answer:** Use for iterating keys of plain objects (with safety checks).

**Syntax**
```js
for (const key in object) {
  // body
}
```

**Example (Iterate object config)**
```js
const config = { theme: "dark", lang: "en", debug: true };

for (const key in config) {
  console.log(key, "=>", config[key]);
}
```

**Output**
```
theme => dark
lang => en
debug => true
```

**Gotcha:** Can iterate inherited enumerable properties.  
✅ **Best Practice (safer):**
```js
for (const key in config) {
  if (Object.prototype.hasOwnProperty.call(config, key)) {
    console.log(key, config[key]);
  }
}
```

---

## 📌 TOPIC 5: Advanced Loop Controls (`break`, `continue`, nested loops)

---

### ❓ Q17: What does `break` do in loops?
**Frequency:** 🟢 99%  
✅ **Answer:** Immediately exits the loop.

**Syntax**
```js
break;
```

**Example (Search and stop early)**
```js
const nums = [3, 7, 9, 12, 15];
let found = null;

for (const n of nums) {
  if (n % 4 === 0) {
    found = n;
    break;
  }
}
console.log(found);
```

**Output**
```
12
```

**Why asked?** Shows efficiency (stop early) and understanding of control flow.

---

### ❓ Q18: What does `continue` do?
**Frequency:** 🟡 70%  
✅ **Answer:** Skips current iteration and moves to next.

**Syntax**
```js
continue;
```

**Example (Skip invalid records)**
```js
const inputs = ["10", "", "5", "abc", "20"];
let sum = 0;

for (const s of inputs) {
  if (s === "" || Number.isNaN(Number(s))) continue;
  sum += Number(s);
}
console.log(sum);
```

**Output**
```
35
```

**Best Practice:** Use `continue` to reduce nesting and keep code flat.

---

### ❓ Q19: Nested loops — real use case and common mistake?
**Frequency:** 🟠 40%  
✅ **Answer:** Used for matrices/grids, combinations, pattern problems. Main risk: complexity (O(n²)).

**Syntax**
```js
for (...) {
  for (...) {
  }
}
```

**Example (2D grid scan)**
```js
const grid = [
  [1, 2, 3],
  [4, 0, 6],
  [7, 8, 9]
];

let zeroPos = null;

for (let r = 0; r < grid.length; r++) {
  for (let c = 0; c < grid[r].length; c++) {
    if (grid[r][c] === 0) {
      zeroPos = { r, c };
      break;
    }
  }
  if (zeroPos) break;
}

console.log(zeroPos);
```

**Output**
```
{ r: 1, c: 1 }
```

**Gotcha:** `break` breaks only the **inner** loop.  
✅ **Best Practice:** Use a flag (as above) or **labeled break** when appropriate.

---

### ❓ Q20: What is a labeled `break` and when is it useful?
**Frequency:** 🔴 20% (but impressive)  
✅ **Answer:** Breaks an outer loop directly (rare but sometimes clean).

**Syntax**
```js
labelName: for (...) {
  for (...) {
    break labelName;
  }
}
```

**Example**
```js
const grid = [
  [1, 2],
  [3, 4]
];

let pair = null;

outer: for (let r = 0; r < grid.length; r++) {
  for (let c = 0; c < grid[r].length; c++) {
    if (grid[r][c] === 3) {
      pair = [r, c];
      break outer;
    }
  }
}

console.log(pair);
```

**Output**
```
[1, 0]
```

---

## ✅ Loop Selection Summary (Very Interview-Friendly)

### ❓ Q21: Which loop should be used where?
**Frequency:** 🟢 99%

| Loop | Best for | Example scenario |
|---|---|---|
| `for` | Known count, need index | Pagination, countdown, array index operations |
| `while` | Unknown count until condition changes | Retry, polling, reading stream until end |
| `do...while` | Must execute at least once | Menu prompt, retry at least once |
| `for...of` | Iterate values in iterable | Sum cart, process array items |
| `for...in` | Iterate object keys | Config, settings, key-value processing |

✅ **Best Practice default:**
- Arrays/strings → `for...of` (clean)
- Objects → `Object.keys(obj)` + `for...of` OR safe `for...in`
- Performance/index needed → classic `for`

---

## 🎯 Extra Real-World Scenarios (Quick Practice)

### Scenario A: Validate form fields (conditional + short-circuit)
```js
const email = "a@b.com";
const password = "12345678";

if (email && password && password.length >= 8) {
  console.log("Valid");
} else {
  console.log("Invalid");
}
```

### Scenario B: Map HTTP status to message (`switch`)
```js
const status = 404;

switch (status) {
  case 200: console.log("OK"); break;
  case 401: console.log("Unauthorized"); break;
  case 404: console.log("Not Found"); break;
  default: console.log("Unknown");
}
```

### Scenario C: Find first match and stop (`break`)
```js
const users = ["a", "b", "admin", "c"];
let isAdmin = false;

for (const u of users) {
  if (u === "admin") { isAdmin = true; break; }
}
console.log(isAdmin);
```

---
# 🚀 JavaScript Deep Dive Notes — Section 3 Part 2: Advanced Control Flow
## ✅ Interview Filter Questions | 90% of candidates get at least one wrong here

> This section contains the trick questions that interviewers use to separate junior developers from people who actually understand JavaScript. All questions below are actively asked at FAANG, unicorns and top startups.
>
> 🎯 Rule: Every question includes syntax, runnable example, output, gotcha and the exact answer interviewers want to hear.

| 🔥 Frequency Rating | Meaning |
|---|---|
| 🟢 99% | Asked at nearly every mid level JS interview |
| 🟡 70% | Very common filter question |
| 🟠 40% | Moderately common |
| 🔴 20% | Senior level trick question |

---

## 📌 TOPIC 1: Truthy / Falsy Deep Rules

This is the single most common source of trick questions about conditionals. Almost every candidate gets at least one edge case wrong.

---

### ❓ Q22: What are all falsy values in JavaScript?
🔥 Frequency: 🟢 99%

✅ Standard Answer:
There are exactly and only 6 falsy values. **Everything else in JavaScript is truthy.**
```
false, 0, "", null, undefined, NaN
```

⚠️ Gotcha: This is the complete list. There are no others.
❌ 80% of candidates incorrectly say `[]` or `{}` are falsy. They are 100% truthy.

---

### ❓ Q23: Complete truthy/falsy reference table
🔥 Frequency: 🟢 99%

| Value | Falsy? |
|---|---|
| `false` | ✅ Yes |
| `0` | ✅ Yes |
| `""` | ✅ Yes |
| `null` | ✅ Yes |
| `undefined` | ✅ Yes |
| `NaN` | ✅ Yes |
| `-0` | ✅ Yes |
| `0n` | ✅ Yes |
| `[]` | ❌ No |
| `{}` | ❌ No |
| `"0"` | ❌ No |
| `"false"` | ❌ No |
| `Infinity` | ❌ No |
| `-Infinity` | ❌ No |

---

### ❓ Q24: What is the output?
🔥 Frequency: 🟢 99%
```javascript
if ([]) console.log("A");
if ({}) console.log("B");
if ("0") console.log("C");
if (NaN) console.log("D");
```

✅ Output:
```
A
B
C
```

> 🤯 Interviewer Trap: This question eliminates more candidates than any other single question on conditionals.

---

### ❓ Q25: What is the difference between `if(x)` and `if(x == true)`?
🔥 Frequency: 🟡 70%

✅ Answer:
- `if(x)` checks if x is truthy
- `if(x == true)` applies full type coercion rules

They are not the same:
```javascript
const x = [];

if (x) console.log("Runs"); // ✅ Runs
if (x == true) console.log("Runs"); // ❌ Does NOT run
```

✅ Best Practice: Never rely on implicit truthiness for non-boolean values. Always use explicit checks.

---

## 📌 TOPIC 2: `switch(true)` Pattern

---

### ❓ Q26: What is the `switch(true)` pattern? When would you use it?
🔥 Frequency: 🟡 70%

✅ Answer:
A professional clean alternative to long messy `else if` chains. Allows you to match against conditions instead of exact values. This is one of the most underused and most useful patterns in JavaScript.

**Syntax**
```javascript
switch (true) {
  case condition1:
    // runs if condition1 is true
    break;
  case condition2:
    // runs if condition2 is true
    break;
  default:
    // fallback
}
```

**Example**
```javascript
const score = 87;

switch (true) {
  case score >= 90: console.log("A"); break;
  case score >= 75: console.log("B"); break;
  case score >= 60: console.log("C"); break;
  default: console.log("F");
}
```

✅ Output: `B`

✅ Advantages over else if:
1. Perfect flat indentation, no arrow code
2. Very easy to reorder conditions
3. Supports intentional fallthrough
4. Much cleaner for 3+ conditions

✅ Best Practice: Use this pattern for any chain longer than 2 `else if` statements.

---

### ❓ Q27: Why does `switch(true)` even work?
🔥 Frequency: 🟠 40%

✅ Answer:
Switch uses strict equality comparison between the switch expression and each case expression. So each case is evaluated, and the first one that equals `true` runs.

---

## 📌 TOPIC 3: Async Loop Pitfalls

> ⚠️ #1 Mid Level Filter Question. If you can answer this correctly you immediately pass 80% of all mid level JavaScript interviews.

---

### ❓ Q28: What is the output of this code? And why?
🔥 Frequency: 🟢 99%

```javascript
const urls = ["/a", "/b", "/c"];

async function fetchAll() {
  urls.forEach(async (url) => {
    await fetch(url);
    console.log("Fetched", url);
  });

  console.log("All done");
}

fetchAll();
```

✅ Output:
```
All done
Fetched /a
Fetched /b
Fetched /c
```

✅ Correct Explanation:
`forEach` does NOT understand promises or await at all. It just fires all async functions immediately and moves on. There is no way, at all, to make `forEach` wait for async operations.

⚠️ Gotcha: This is the single most common bug in modern async JavaScript. 90% of professional developers have made this mistake at least once.

---

### ❓ Q29: How do you correctly await inside a loop?
🔥 Frequency: 🟢 99%

✅ Answer: Use `for...of` loop. It correctly awaits each iteration.

**Syntax**
```javascript
async function fetchAllSequential() {
  for (const url of urls) {
    await fetch(url);
    console.log("Fetched", url);
  }

  console.log("All done");
}
```

✅ Output:
```
Fetched /a
Fetched /b
Fetched /c
All done
```

---

### ❓ Q30: What if I want to run them in parallel?
🔥 Frequency: 🟡 70%

✅ Answer: Use `Promise.all()`

```javascript
async function fetchAllParallel() {
  const promises = urls.map(url => fetch(url));
  const responses = await Promise.all(promises);
  console.log("All done");
}
```

---

### ✅ Async Loop Decision Table
Memorize this table:

| Method | Execution | When to use |
|---|---|---|
| `forEach` + await | Parallel, unwaited | ❌ NEVER USE. Always a bug. |
| `for...of` + await | Sequential one after another | Dependent calls, rate limits, retries |
| `Promise.all()` | Parallel all at once | Independent calls, maximum speed |
| `for await...of` | Sequential async iterable | Streams, paginated APIs |

---

## 📌 TOPIC 4: Advanced Break / Continue / Labels

---

### ❓ Q31: What does `break` do inside a switch?
🔥 Frequency: 🟡 70%

✅ Answer: `break` only exits the switch, not any outer loop.

```javascript
for (let i = 0; i < 3; i++) {
  console.log("Loop", i);
  switch (i) {
    case 1:
      break;
  }
}
```

✅ Output:
```
Loop 0
Loop 1
Loop 2
```

---

### ❓ Q32: What does `continue` do inside a switch?
🔥 Frequency: 🟠 40%

✅ Answer: `continue` continues the outer loop. This is an extremely useful and almost unknown pattern.

```javascript
for (let i = 0; i < 5; i++) {
  switch (i) {
    case 2:
    case 3:
      continue;
  }
  console.log(i);
}
```

✅ Output:
```
0
1
4
```

This is much cleaner than setting flags and breaking.

---

### ❓ Q33: Can you break out of nested loops without a flag variable?
🔥 Frequency: 🟡 70%

✅ Answer: Yes. Use a labeled break.

**Syntax**
```javascript
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) {
      break outer;
    }
  }
}
```

---

## 🎯 15 Common Output Trick Questions
These exact snippets are used in interviews every single day. Cover the output, predict, then verify.

| Code | Output | Explanation |
|---|---|---|
| `if (-0) console.log("A")` | Nothing | `-0` is falsy |
| `if (0n) console.log("A")` | Nothing | BigInt zero is falsy |
| `if ([]) console.log("A")` | A | Empty array is truthy |
| `if ([] == false) console.log("A")` | A | Coercion makes this true |
| `if ("false") console.log("A")` | A | Any non empty string is truthy |
| `if ("0") console.log("A")` | A | String "0" is truthy |
| `do { console.log(1) } while(false)` | 1 | do while always runs once |
| `switch(1) { case 1: console.log(1); case 2: console.log(2) }` | 1, 2 | No break fallthrough |
| `switch(2) { default: console.log(3); case 1: console.log(1) }` | 3, 1 | Default can be anywhere |
| `for(let i=0;i<3;i++) { if(i===1) continue; console.log(i) }` | 0, 2 | |
| `for(let i=0;i<3;i++) { if(i===1) break; console.log(i) }` | 0 | |

---

## ❌ Answers You Should Never Give In An Interview
1. ❌ "Empty array is falsy"
2. ❌ "You can use await inside forEach"
3. ❌ "switch can only compare exact values"
4. ❌ "break breaks all outer loops"
5. ❌ "do while is useless"

---

## 🔥 Section 3 Mega Cheat Sheet
1. Exactly 6 falsy values. Everything else is truthy
2. `[]` and `{}` are always truthy
3. Never ever use `await` inside `forEach`. Ever.
4. Use `for...of` for sequential await, `Promise.all` for parallel
5. Use `switch(true)` instead of long `else if` chains
6. `break` only breaks the innermost structure
7. `continue` inside switch continues the outer loop
8. Use labeled break for nested loops

---
