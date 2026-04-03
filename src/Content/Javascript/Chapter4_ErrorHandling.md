# 🚀 JavaScript Deep Dive Notes - Section 4: Error Handling
## ✅ Official Interview Question Bank (Merged Ultimate Edition)

> **100% Interview Q&A Format** — Error handling separates junior developers (who let apps crash) from senior developers (who build resilient systems). This section covers core mechanics, JS-specific quirks, modern ES features, and real-world API error handling. 90% of candidates can write `try/catch`, but fail when asked how it actually works under the hood.
>
> **Study Hack**: Pay special attention to the "Async Errors" and "Division by Zero" topics. They are guaranteed FAANG interview questions.

| 🔥 Frequency Rating | Meaning |
|---|---|
| 🟢 99% | Asked at nearly every mid-level JS interview |
| 🟡 70% | Very common filter question |
| 🟠 40% | Moderately common |
| 🔴 20% | Senior level / Occasional trick question |

---

## 📌 TOPIC 1: Core Concepts & Mechanics (`try...catch...finally`)

### ❓ Q1: What is error handling? Why is it important?
**Frequency**: 🟢 99%

✅ **Standard Answer**: Error handling is the mechanism to gracefully handle and recover from unexpected runtime failures. Without proper error handling, a single failure will crash your entire application.
> *Interview Note*: Good error handling is the single biggest difference between hobby code and production-ready code.

---

### ❓ Q2: Explain the execution flow and syntax of `try...catch...finally`.
**Frequency**: 🟢 99%

✅ **Standard Answer**:
| Block | Purpose | Runs when |
|---|---|---|
| `try` | Contains code that might fail/throw an error | Always runs first |
| `catch` | Handles the error | Only if an error is thrown inside `try` |
| `finally` | Cleanup code (close DBs, hide spinners) | **ALWAYS runs, no exceptions** |

🧪 **Syntax & Code**:
```javascript
try {
  console.log("1. Executing Try");
  // riskyCode(); // Uncomment to trigger catch
  console.log("2. End of Try");
} catch (error) {
  console.log("3. Caught an error:", error.message);
} finally {
  console.log("4. Finally always runs"); // Cleanup happens here
}
```

---

### ❓ Q3: Famous interview trick question. What is the output if you `return` inside `try`?
**Frequency**: 🟢 99% (Classic Senior Filter — 90% answer this incorrectly)

✅ **Answer**: **Yes, `finally` always runs.** The `finally` block will intercept the flow *before* the function actually returns. Even if you `return`, `break`, or `throw` inside `try` or `catch`. If the `finally` block *also* contains a `return` statement, it will **overwrite** the return value from the `try` block!

🧪 **Code**:
```javascript
function testFinally() {
  try {
    console.log("try");
    return 1;
  } catch (e) {
    console.log("catch");
    return 2;
  } finally {
    console.log("finally");
    return 3; // This overrides the 'return 1' from try!
  }
}

console.log(testFinally()); 
```
✅ **Output**:
```text
try
finally
3
```

---

### ❓ Q4: Can you have `try` without `catch`?
**Frequency**: 🟡 70%

✅ **Answer**: Yes. But only if you have a `finally` block. Any error will still be thrown and propagate up the call stack, but the cleanup code will run first.

🧪 **Code**:
```javascript
// This is perfectly valid
try {
  doSomethingRisky();
} finally {
  cleanupResources();
}
```

---

### ❓ Q5: What is "Optional Catch Binding"?
**Frequency**: 🟠 40%

✅ **Answer**: Since ES2019, you can omit the error variable in the `catch` block if you don't need to use it.

🧪 **Code**:
```javascript
try {
  JSON.parse(input);
} catch { // Notice: no (e) or (error)
  console.log("Invalid JSON. Falling back to default.");
}
```

---

## 📌 TOPIC 2: Throwing & The `Error` Object

### ❓ Q6: What does the `throw` statement do? What *can* you throw?
**Frequency**: 🟢 99%

✅ **Answer**: `throw` generates a custom error and immediately stops execution of the current block, propagating the error up the call stack until it is caught by a `catch` block. You can technically throw **anything** (a string, a number, an object), but **best practice** is to always throw an instance of the `Error` object.

🧪 **Code**:
```javascript
// ❌ Bad Practice (Throwing primitive)
throw "Something broke"; // Loses stack trace! Impossible to debug.

// ✅ Best Practice (Throwing Error object)
throw new Error("Something broke"); 
```

---

### ❓ Q7: What are the main properties of the built-in `Error` object?
**Frequency**: 🟡 70%

✅ **Answer**:
1. `name`: The type of error (e.g., "Error", "TypeError", "ReferenceError").
2. `message`: The human-readable description provided when creating the error.
3. `stack`: A string showing the execution path (Call Stack) that led to the error. Crucial for debugging.

🧪 **Code**:
```javascript
try {
  throw new TypeError("Expected a string");
} catch (err) {
  console.log(err.name);    // "TypeError"
  console.log(err.message); // "Expected a string"
  console.log(err.stack);   // "TypeError: Expected a string at <file_path:line>"
}
```

---

### ❓ Q8: What is "Error Cause" (ES2022)?
**Frequency**: 🟠 40%

✅ **Answer**: It is the modern way to wrap and preserve original error stack traces when rethrowing errors. It is the single best improvement to error handling in 10 years.

🧪 **Code**:
```javascript
try {
  await fetch("/api/user");
} catch (e) {
  // We wrap the original error 'e' inside the cause property
  throw new Error("Could not load profile page", { cause: e });
}
```
✅ **Best Practice**: Always include the original error as `cause` when rethrowing to prevent losing the original context.

---

## 📌 TOPIC 3: Built-in Error Types & Custom Errors

JavaScript has 7 standard built-in error types. You should always use the most specific one.

| Error Type | Use case |
|---|---|
| `Error` | Generic base error |
| `TypeError` | Wrong type, e.g., calling `null` as a function |
| `ReferenceError` | Accessing a variable that does not exist (not declared) |
| `SyntaxError` | Invalid syntax (code won't even parse) |
| `RangeError` | Value out of valid range |
| `URIError` | Invalid `encodeURI` / `decodeURI` |
| `AggregateError` | Multiple errors wrapped into one (e.g., `Promise.any()`) |

### ❓ Q9: Provide common examples of these built-in errors.
**Frequency**: 🟡 70%

🧪 **Code**:
```javascript
console.log(doesNotExist); // ReferenceError

null.toString();           // TypeError

(10).toString(100);        // RangeError (radix must be 2-36)

JSON.parse("bad json");    // SyntaxError
```

---

### ❓ Q10: How do you create and use Custom Error Classes?
**Frequency**: 🟡 70% (Senior Level)

✅ **Answer**: You extend the built-in `Error` class. This allows you to create specific error types and use the `instanceof` operator in your `catch` block to handle different errors in different ways.

🧪 **Code**:
```javascript
// 1. Create Custom Error
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

// 2. Use it
function validateEmail(email) {
  if (!email.includes("@")) {
    throw new ValidationError("Invalid email format");
  }
  if (email === "admin@system.com") {
    throw new Error("System error occurred"); // Standard generic error
  }
}

// 3. Handle specific errors
try {
  validateEmail("bademail.com");
} catch (error) {
  if (error instanceof ValidationError) {
    console.log("User Mistake:", error.message); // Show to user in UI
  } else {
    console.log("System Crash:", error);         // Send to Datadog/Sentry
  }
}
```

---

## 📌 TOPIC 4: Async Error Handling & Syntax Errors

### ❓ Q11: Can `try...catch` catch Syntax Errors or Async Errors (like `setTimeout`)?
**Frequency**: 🟢 99%

✅ **Answer**: **NO to both**.
1. **Syntax Errors**: If the code is structurally invalid (missing a `}`), the engine fails during the parsing phase. The code never executes, so `try/catch` cannot run.
2. **Async Errors (`setTimeout`)**: The `try...catch` block executes synchronously. By the time `setTimeout` runs its callback, the `try/catch` has already finished and left the call stack.

🧪 **Code (The Async Trap)**:
```javascript
// ❌ WRONG: Catch will NOT trigger
try {
  setTimeout(() => {
    throw new Error("Async boom!"); 
  }, 1000);
} catch (e) {
  console.log("Caught:", e); // Never runs. App crashes!
}

// ✅ RIGHT: Put try/catch INSIDE the async callback
setTimeout(() => {
  try {
    throw new Error("Async boom!");
  } catch (e) {
    console.log("Safely caught:", e.message);
  }
}, 1000);
```

---

### ❓ Q12: Correct error handling for modern `async/await`?
**Frequency**: 🟢 99%

✅ **Answer**: Unlike standard Promises which use `.catch()`, `async/await` allows you to handle asynchronous errors using standard, synchronous-looking `try...catch` blocks. Uncaught promise rejections will crash your entire application.

🧪 **Code**:
```javascript
async function loadUser() {
  try {
    const res = await fetch("/api/user");
    return await res.json();
  } catch (e) {
    console.error("Failed to load user", e);
    return null;
  }
}
```

---

## 📌 TOPIC 5: JavaScript Specific Quirks (Division By Zero)

### ❓ Q13: How does JavaScript handle Division by Zero? Does it throw an error?
**Frequency**: 🟢 99% (Trick Question)

✅ **Answer**: **NO. JavaScript does NOT throw an error when dividing by zero.** 
Because JS uses the IEEE 754 standard for math, dividing by zero returns `Infinity` (or `-Infinity`). Dividing `0 / 0` returns `NaN`.

This is a massive source of silent bugs. You must manually check and throw an error if you want division by zero to fail.

🧪 **Code**:
```javascript
console.log(10 / 0);  // Output: Infinity (❌ No error thrown)
console.log(-10 / 0); // Output: -Infinity
console.log(0 / 0);   // Output: NaN

// ✅ Real-world use case: Manual Guard Clause
function safeDivide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero is not allowed.");
  }
  return a / b;
}

try {
  console.log(safeDivide(10, 0));
} catch (err) {
  console.log("Handled:", err.message); // Handled safely!
}
```

---

## 📌 TOPIC 6: Real-World Use Cases & Advanced Patterns

### 1. Safe JSON Parse
`JSON.parse()` is a synchronous method that completely crashes your app if it receives invalid syntax. Always wrap it.
```javascript
function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error("Invalid JSON format");
    return fallback;
  }
}
```

### 2. The `fetch` API Error Trap (Crucial for Frontend)
The `fetch` API **only throws an error on network failures** (no internet). It **DOES NOT** throw an error for HTTP response errors like 404 or 500. You must manually check `response.ok`.
```javascript
async function getUser(id) {
  try {
    const response = await fetch(`https://api.example.com/users/${id}`);
    
    // ⚠️ CRITICAL: Manual check for HTTP errors
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return await response.json();
    
  } catch (error) {
    console.error("Failed to fetch user:", error.message);
  }
}
```

### 3. Retry Pattern (Network Resilience)
```javascript
async function fetchWithRetry(url, retries = 3) {
  try {
    return await fetch(url);
  } catch (e) {
    if (retries > 0) {
      console.log(`Retrying... (${retries} left)`);
      return fetchWithRetry(url, retries - 1);
    }
    throw e; // Out of retries, propagate error
  }
}
```

### 4. Global Unhandled Error Catching
If an error slips past all `try...catch` blocks, you need a global safety net.
```javascript
// Browser Environment
window.addEventListener("error", (e) => console.error("Global Sync Error:", e.message));
window.addEventListener("unhandledrejection", (e) => console.error("Unhandled Promise:", e.reason));

// Node.js Environment
process.on('uncaughtException', (err) => {
  console.error('CRITICAL: Uncaught Exception:', err);
  process.exit(1); // Usually best practice to restart the server
});
```

---

## 📌 TOPIC 7: Best Practices & Anti-Patterns

### ✅ Good Patterns
1. **Fail fast**: Throw early and explicitly instead of returning invalid values.
2. **Handle specific errors**: Use custom errors and `instanceof`. Never catch all errors unless you absolutely have to.
3. **Always add context**: `throw new Error(\`Failed to load user ${userId}\`, { cause: e });`
4. **Cleanup in finally**: Close connections, remove event listeners, release locks.

### ❌ Worst Anti-Patterns
1. **Empty catch block** ❌
   ```javascript
   try { doSomething(); } catch (e) {} 
   ```
   *Why?* The single worst thing you can do. Errors are silently swallowed. You will never be able to debug anything.
2. **Catch and log only** ❌
   ```javascript
   catch (e) { console.log(e); } 
   ```
   *Why?* Almost as bad. Error is logged but the app continues in an invalid, corrupted state.
3. **Throw strings** ❌
   ```javascript
   throw "error"; 
   ```
   *Why?* No stack trace.
4. **Overly broad catch-all** ❌
   ```javascript
   catch (e) { return null; } 
   ```
   *Why?* Hides all bugs, including your own typos and `TypeErrors`.

---

## 🎯 10 Common Interview Trick Questions Cheat Sheet

| Question / Code | Output / Answer |
|---|---|
| Does `finally` run after a `return` in `try`? | ✅ Yes, always. |
| Is `try {} finally {}` valid without `catch`? | ✅ Yes. |
| Does division by zero throw an error? | ❌ No, returns `Infinity`. |
| Does `throw "string"` provide a stack trace? | ❌ No. Always use `new Error()`. |
| Does `try/catch` catch `setTimeout` errors? | ❌ No. Callbacks run in a different stack. |
| Can you rethrow an error inside `catch`? | ✅ Yes. |
| Does `catch (e) { throw e }` preserve the stack? | ✅ Yes. |
| Can you have multiple catch blocks in JS? | ❌ No. You must use `if/else` inside one catch. |
| What error does `null.toString()` throw? | `TypeError` |
| What error does `JSON.parse("")` throw? | `SyntaxError` |

---

## 🔥 Section 4 Mega Cheat Sheet Summary

1. **Flow**: `try` (attempts) ➡️ `catch` (if error) ➡️ `finally` (always).
2. **Return Override**: `return` in `finally` overrides `return` from `try`.
3. **Always Throw Objects**: Never throw strings. Always `throw new Error("msg")`.
4. **No Empty Catch**: Never swallow errors silently.
5. **Async Trap**: `try/catch` cannot catch async callback errors (unless inside the callback) or syntax errors.
6. **Async/Await**: Always wrap `await` in `try/catch` to prevent unhandled rejections.
7. **Error Cause**: Use `{ cause: originalError }` when rethrowing (ES2022).
8. **Math Quirks**: Division by zero returns `Infinity`. Manually check `b === 0`.
9. **JSON & Fetch**: Always wrap `JSON.parse()`. Manually check `!response.ok` for `fetch()`.
10. **Fail Fast**: Handle specific errors, add context, and don't catch everything blindly.