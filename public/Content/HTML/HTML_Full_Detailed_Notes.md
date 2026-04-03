# 📘 HTML Day 1 Notes

> **Topics Covered:** Doctype, HTML Boilerplate, Text Elements, Hyperlinks, Images, Media, Text Formatting, Span & Div, Lists, Tables, Interview Questions
> **Date:** Day 1 of HTML Learning Series


---

## Table of Contents

1. [HTML Document Structure](#1-html-document-structure)
2. [Text Elements](#2-text-elements)
3. [Hyperlinks](#3-hyperlinks)
4. [Images](#4-images)
5. [Media Elements](#5-media-elements)
6. [Text Formatting](#6-text-formatting)
7. [Span and Div](#7-span-and-div)
8. [Lists](#8-lists)
9. [Tables](#9-tables)
10. [Interview Questions & Answers](#10-interview-questions--answers)


---

## 1. HTML Document Structure

### 1.1 Doctype Declaration

The doctype is the very first line of any HTML document. It tells the browser which version of HTML to use to render the page.

```html
<!-- HTML5 Doctype (the only one you need to know) -->
<!DOCTYPE html>
```

**What it does:**
- Triggers standards mode in browsers
- Prevents browsers from using "quirks mode" which renders pages incorrectly
- Case insensitive, but always written as `<!DOCTYPE html>` by convention

> ❌ If you omit the doctype, browsers will render the page in quirks mode, which can cause unexpected layout and behavior issues.


---

### 1.2 Complete HTML5 Boilerplate Explained

```html
<!DOCTYPE html>                 <!-- Tells browser to use HTML5 standards mode -->
<html lang="en">                <!-- Root element of the page, lang attribute for accessibility and SEO -->
<head>                          <!-- Contains metadata about the document (not visible to user) -->
  <meta charset="UTF-8">        <!-- Character encoding for the document (UTF-8 supports all languages) -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">  <!-- Makes page responsive on mobile -->
  <title>Page Title</title>     <!-- Title that appears in browser tab and search results -->
  <link rel="icon" href="favicon.ico"> <!-- Favicon for the page -->
</head>
<body>                          <!-- Contains all visible content of the page -->
  <!-- Page content goes here -->
</body>
</html>
```

#### Boilerplate Line by Line Explanation:

| Line | Purpose |
|------|---------|
| `<!DOCTYPE html>` | Triggers standards mode |
| `<html lang="en">` | Root element, `lang` attribute is critical for screen readers and SEO |
| `<head>` | Container for metadata, links, scripts, styles |
| `<meta charset="UTF-8">` | Defines character encoding, should always be UTF-8 |
| `<meta name="viewport">` | Enables responsive design, absolutely required for mobile |
| `<title>` | Page title, one of the most important elements for SEO |
| `<body>` | Contains all visible content of the page |


---

## 2. Text Elements

### 2.1 Headings (h1 - h6)

Headings are semantic elements that define the hierarchy of your content.

```html
<!-- Heading levels from most important to least important -->
<h1>Main Page Title (only one per page)</h1>
<h2>Section Title</h2>
<h3>Sub-section Title</h3>
<h4>Sub-sub-section Title</h4>
<h5>Minor Heading</h5>
<h6>Least Important Heading</h6>
```

**Best Practices:**
- Only use **one h1 per page** (it represents the main topic of the page)
- Don't skip heading levels (don't go from h1 to h3)
- Use headings for semantic hierarchy, not just for font size
- Search engines use headings to understand the structure of your page


---

### 2.2 Paragraph Tag (p)

The paragraph tag is used for blocks of text.

```html
<p>This is a paragraph of text. Browsers will automatically add vertical space before and after each paragraph.</p>

<p>This is a second paragraph. You cannot put block elements like div or other p tags inside a p tag.</p>
```

> ❌ Common Mistake: You cannot nest block elements inside a `<p>` tag. Browsers will automatically close the p tag if you try.


---

### 2.3 Line Break (br)

A self-closing tag that inserts a single line break.

```html
<p>This is the first line.<br>This is the second line.</p>
```

**Best Practices:**
- Only use `<br>` for line breaks that are part of the content (like addresses or poems)
- Never use multiple `<br>` tags to create spacing - use CSS margin/padding instead


---

### 2.4 Horizontal Rule (hr)

A self-closing tag that represents a thematic break between sections of content.

```html
<p>First section of content.</p>
<hr>
<p>Second section of content, thematically separate from the first.</p>
```

> 💡 Note: While it renders as a horizontal line, its semantic meaning is a thematic break, not just a line.


---

### 2.5 Preformatted Text (pre)

The pre tag preserves whitespace, line breaks, and indentation exactly as it is written in the HTML.

```html
<pre>
function hello() {
  console.log("Hello, World!");
}
</pre>
```

This will render exactly as written, preserving the indentation and line breaks. Perfect for code examples.


---

### 2.6 Comments

Comments are notes in your code that are not rendered by the browser.

```html
<!-- This is a single line comment -->

<!-- 
This is a multi-line comment
It can span multiple lines
-->

<!-- ❌ Bad: Don't leave commented out code in production -->
<!-- <p>This is old code</p> -->
```


---

## 3. Hyperlinks

The anchor tag (`<a>`) is used to create links to other pages, files, or locations on the same page.

```html
<!-- Basic Link -->
<a href="https://www.google.com">Visit Google</a>

<!-- Link that opens in a new tab -->
<a href="https://www.google.com" target="_blank" rel="noopener noreferrer">Visit Google</a>

<!-- Link to a page on the same site (relative URL) -->
<a href="/about.html">About Us</a>

<!-- Link to a specific section on the same page (fragment identifier) -->
<a href="#section-2">Jump to Section 2</a>

<!-- Email link -->
<a href="mailto:info@example.com">Email Us</a>

<!-- Phone link -->
<a href="tel:+1234567890">Call Us</a>

<!-- Link with title attribute (tooltip) -->
<a href="/about" title="Learn more about our company">About Us</a>
```

### Important Attributes:

| Attribute | Values | Description |
|-----------|--------|-------------|
| `href` | URL | The destination of the link |
| `target` | `_self`, `_blank`, `_parent`, `_top` | Where to open the link |
| `title` | text | Tooltip text that appears on hover |
| `rel` | `noopener`, `noreferrer` | Security attributes for external links |

> ⚠️ Security Note: Always add `rel="noopener noreferrer"` when using `target="_blank"` to prevent security vulnerabilities.


---

## 4. Images

The image tag (`<img>`) is used to embed images in a page. It is a self-closing tag.

```html
<!-- Basic Image -->
<img src="cat.jpg" alt="A cute orange cat sitting on a couch">

<!-- Image with all attributes -->
<img 
  src="cat.jpg" 
  alt="A cute orange cat sitting on a couch"
  width="400"
  height="300"
  loading="lazy"
  title="My cat Garfield"
>
```

### Important Attributes:

| Attribute | Description |
|-----------|-------------|
| `src` | The path to the image file |
| `alt` | Alternative text for accessibility and SEO. **Required for all images.** |
| `width` / `height` | Dimensions of the image (prevents layout shift) |
| `loading` | `lazy` - Loads the image only when it's about to enter the viewport |
| `title` | Tooltip text on hover |

> 💡 Alt Text Best Practices:
> - Describe the image accurately and concisely
> - If the image is purely decorative, use an empty alt: `alt=""`
> - Never use "image of" or "picture of" - screen readers already announce it's an image


---

## 5. Media Elements

### 5.1 Audio

The audio tag is used to embed audio content.

```html
<!-- Basic Audio -->
<audio src="audio.mp3" controls></audio>

<!-- Audio with all attributes -->
<audio 
  src="audio.mp3" 
  controls 
  autoplay 
  muted 
  loop
  preload="metadata"
>
  Your browser does not support audio.
</audio>
```

### 5.2 Video

The video tag is used to embed video content.

```html
<!-- Basic Video -->
<video src="video.mp4" controls></video>

<!-- Video with all attributes -->
<video 
  src="video.mp4" 
  controls 
  autoplay 
  muted 
  loop
  poster="thumbnail.jpg"
  width="640"
  height="360"
>
  Your browser does not support video.
</video>
```

### 5.3 Favicon

A favicon is the small icon that appears in the browser tab.

```html
<!-- Basic Favicon -->
<link rel="icon" href="favicon.ico">

<!-- Modern Favicon for all devices -->
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
```


---

## 6. Text Formatting

HTML has two types of text formatting tags: semantic (meaning) and presentational (appearance).

### Semantic Formatting Tags (Preferred)

| Tag | Purpose |
|-----|---------|
| `<strong>` | Important text (bold) |
| `<em>` | Emphasized text (italic) |
| `<mark>` | Highlighted text |
| `<small>` | Small print, legal text |
| `<sub>` | Subscript |
| `<sup>` | Superscript |
| `<del>` | Deleted text |
| `<ins>` | Inserted text |

### Presentational Formatting Tags (Avoid)

| Tag | Purpose |
|-----|---------|
| `<b>` | Bold text (no semantic meaning) |
| `<i>` | Italic text (no semantic meaning) |
| `<u>` | Underlined text |
| `<s>` | Strikethrough text |

```html
<!-- Semantic vs Presentational -->
<p><strong>This is important text</strong></p> <!-- Preferred -->
<p><b>This is just bold text</b></p>          <!-- Avoid -->

<p><em>This is emphasized text</em></p>       <!-- Preferred -->
<p><i>This is just italic text</i></p>        <!-- Avoid -->

<p>H<sub>2</sub>O is water. E = mc<sup>2</sup></p>
<p><mark>This text is highlighted</mark></p>
<p><del>This text is deleted</del> <ins>This text is inserted</ins></p>
```


---

## 7. Span and Div

Span and div are generic container elements with no semantic meaning. They are used for grouping content for styling or scripting.

| `<div>` | `<span>` |
|---------|----------|
| Block level element | Inline element |
| Takes up full width of its parent | Takes up only as much width as its content |
| Starts on a new line | Does not start on a new line |
| Used for grouping larger sections of content | Used for grouping small pieces of text or inline content |

```html
<!-- Div - Block level container -->
<div class="card">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>

<!-- Span - Inline container -->
<p>My favorite color is <span style="color: red;">red</span>.</p>
```


---

## 8. Lists

HTML has three types of lists: unordered, ordered, and description.

### 8.1 Unordered List (ul)

Used for lists of items where the order does not matter.

```html
<ul>
  <li>Apples</li>
  <li>Bananas</li>
  <li>Oranges</li>
</ul>
```

### 8.2 Ordered List (ol)

Used for lists of items where the order does matter.

```html
<ol>
  <li>Preheat oven to 350°F</li>
  <li>Mix dry ingredients</li>
  <li>Add wet ingredients</li>
  <li>Bake for 25 minutes</li>
</ol>

<!-- Ordered List with Attributes -->
<ol type="I" start="5" reversed>
  <li>Fifth item</li>
  <li>Fourth item</li>
  <li>Third item</li>
</ol>
```

#### Ordered List Type Values:
- `1` - Numbers (default)
- `A` - Uppercase letters
- `a` - Lowercase letters
- `I` - Uppercase Roman numerals
- `i` - Lowercase Roman numerals

### 8.3 Description List (dl)

Used for lists of terms and their descriptions.

```html
<dl>
  <dt>HTML</dt>
  <dd>HyperText Markup Language, the standard markup language for web pages.</dd>
  
  <dt>CSS</dt>
  <dd>Cascading Style Sheets, used for styling web pages.</dd>
  
  <dt>JavaScript</dt>
  <dd>A programming language used to add interactivity to web pages.</dd>
</dl>
```

### Nested Lists

You can nest lists inside other lists:

```html
<ul>
  <li>Fruits
    <ul>
      <li>Apples</li>
      <li>Bananas</li>
    </ul>
  </li>
  <li>Vegetables
    <ul>
      <li>Carrots</li>
      <li>Broccoli</li>
    </ul>
  </li>
</ul>
```


---

## 9. Tables

Tables are used to display tabular data.

```html
<!-- Complete Semantic Table -->
<table>
  <caption>Employee Directory</caption>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Position</th>
      <th scope="col">Department</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>Developer</td>
      <td>Engineering</td>
    </tr>
    <tr>
      <td>Jane Smith</td>
      <td>Designer</td>
      <td>Design</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="3">Total Employees: 2</td>
    </tr>
  </tfoot>
</table>
```

### Table Elements:

| Element | Purpose |
|---------|---------|
| `<table>` | The table container |
| `<caption>` | Table title (accessibility) |
| `<thead>` | Header section of the table |
| `<tbody>` | Body section of the table |
| `<tfoot>` | Footer section of the table |
| `<tr>` | Table row |
| `<th>` | Table header cell |
| `<td>` | Table data cell |

### Table Attributes:

| Attribute | Purpose |
|-----------|---------|
| `colspan` | Number of columns a cell should span |
| `rowspan` | Number of rows a cell should span |
| `scope` | `col` or `row` - Defines what the header cell applies to (accessibility) |


---

## 10. Interview Questions & Answers


---

### Question 1: What is the purpose of the doctype declaration? What happens if you omit it?

**Answer:**

The doctype declaration tells the browser which version of HTML to use to render the page. In HTML5, it is simply `<!DOCTYPE html>`.

If you omit the doctype, browsers will render the page in "quirks mode", which is a backwards compatibility mode that emulates the behavior of very old browsers. This can cause unexpected layout issues, broken CSS, and inconsistent behavior across different browsers.

```html
<!-- Correct -->
<!DOCTYPE html>

<!-- Incorrect - will trigger quirks mode -->
<html>
  <head>...</head>
  <body>...</body>
</html>
```


---

### Question 2: What is the difference between `<strong>` and `<b>`, and between `<em>` and `<i>`?

**Answer:**

`<strong>` and `<em>` are semantic tags, while `<b>` and `<i>` are presentational tags.

- `<strong>` indicates that the content is important, and will be rendered as bold by default. Screen readers will emphasize the content.
- `<b>` is purely presentational, it only makes text bold with no semantic meaning.
- `<em>` indicates that the content should be emphasized, and will be rendered as italic by default. Screen readers will emphasize the content.
- `<i>` is purely presentational, it only makes text italic with no semantic meaning.

You should always prefer `<strong>` and `<em>` for accessibility and semantic meaning.

```html
<!-- Good - Semantic -->
<p><strong>Warning:</strong> This is dangerous.</p>
<p>I <em>really</em> like ice cream.</p>

<!-- Bad - Presentational only -->
<p><b>Warning:</b> This is dangerous.</p>
<p>I <i>really</i> like ice cream.</p>
```


---

### Question 3: What is the difference between a block element and an inline element? Give examples.

**Answer:**

| Block Elements | Inline Elements |
|----------------|-----------------|
| Take up the full width of their parent | Take up only as much width as their content |
| Start on a new line | Do not start on a new line |
| Can contain other block elements and inline elements | Can only contain other inline elements and text |
| Examples: `<div>`, `<p>`, `<h1>`, `<ul>`, `<table>` | Examples: `<span>`, `<a>`, `<strong>`, `<em>`, `<img>` |

```html
<!-- Block elements stack vertically -->
<div>First div</div>
<div>Second div</div>

<!-- Inline elements sit next to each other -->
<span>First span</span>
<span>Second span</span>
```


---

### Question 4: What is the difference between `<div>` and `<span>`? When would you use each?

**Answer:**

`<div>` is a block level container, while `<span>` is an inline container. Neither has any semantic meaning.

Use `<div>` when you need to group larger sections of content, or when you want the container to take up the full width.

Use `<span>` when you need to group small pieces of text or inline content, or when you don't want the container to break the flow of text.

```html
<!-- Use div for larger sections -->
<div class="card">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>

<!-- Use span for inline content -->
<p>My favorite color is <span style="color: red;">red</span>.</p>
```


---

### Question 5: Why is the alt attribute important for images? What are the best practices for writing alt text?

**Answer:**

The alt attribute is important for three main reasons:
1. **Accessibility:** Screen readers use alt text to describe images to visually impaired users
2. **SEO:** Search engines use alt text to understand what the image is about
3. **Fallback:** If the image fails to load, the alt text is displayed instead

Best practices for alt text:
- Be descriptive and accurate
- Keep it concise (125 characters or less)
- Don't use "image of" or "picture of"
- For purely decorative images, use an empty alt: `alt=""`
- Don't include text that is already in the surrounding content

```html
<!-- Good alt text -->
<img src="cat.jpg" alt="A cute orange cat sitting on a couch">

<!-- Bad alt text -->
<img src="cat.jpg" alt="Image of a cat">
<img src="cat.jpg" alt="cat.jpg">
```


---

### Question 6: What are the security considerations when using `target="_blank"` on links?

**Answer:**

When you use `target="_blank"` to open a link in a new tab, the new page has access to the original page's `window.opener` object. This can be used for malicious purposes, such as phishing attacks.

To prevent this, you should always add `rel="noopener noreferrer"` to any link that uses `target="_blank"`.

```html
<!-- Bad - Security vulnerability -->
<a href="https://malicious.com" target="_blank">Click here</a>

<!-- Good - Secure -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">Click here</a>
```


---

### Question 7: What is the difference between an unordered list, ordered list, and description list? When would you use each?

**Answer:**

- **Unordered List (`<ul>`):** Used for lists of items where the order does not matter. Example: a list of ingredients.
- **Ordered List (`<ol>`):** Used for lists of items where the order does matter. Example: a recipe with steps.
- **Description List (`<dl>`):** Used for lists of terms and their descriptions. Example: a glossary.

```html
<!-- Unordered list -->
<ul>
  <li>Flour</li>
  <li>Sugar</li>
  <li>Eggs</li>
</ul>

<!-- Ordered list -->
<ol>
  <li>Mix flour and sugar</li>
  <li>Add eggs</li>
  <li>Bake for 25 minutes</li>
</ol>

<!-- Description list -->
<dl>
  <dt>Flour</dt>
  <dd>A powder made by grinding raw grains.</dd>
  <dt>Sugar</dt>
  <dd>A sweet crystalline substance.</dd>
</dl>
```


---

Would you like me to adjust any part of these notes or add any additional topics?