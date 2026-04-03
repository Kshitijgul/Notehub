# Frontend Development Interview Notes

## Day 1 -- HTML Basics

------------------------------------------------------------------------

## 1. DOCTYPE in HTML

**Definition:**\
`<!DOCTYPE html>` is a declaration that tells the browser the document
type and HTML version so the webpage is rendered correctly.

**Syntax**

``` html
<!DOCTYPE html>
```

**Key Points** - Must be written at the **top of the HTML document** -
Declares the document as **HTML5** - Forces the browser to run in
**Standards Mode** - Prevents **Quirks Mode rendering issues**

**Interview Question** - What is DOCTYPE in HTML? - Why is DOCTYPE
important?

------------------------------------------------------------------------

# 2. Headings (h1 to h6)

HTML provides **6 levels of headings**.

``` html
<h1>Main Heading</h1>
<h2>Sub Heading</h2>
<h3>Section</h3>
<h4>Sub Section</h4>
<h5>Minor Heading</h5>
<h6>Smallest Heading</h6>
```

**Key Points** - `<h1>` is the **largest and most important** - `<h6>`
is the **smallest** - Used for **SEO and page structure**

**Interview Question** - What are heading tags in HTML? - How many
heading tags are there in HTML?

------------------------------------------------------------------------

# 3. Paragraph Tag

Used to define a paragraph.

``` html
<p>This is a paragraph</p>
```

**Interview Question** - What is the `<p>` tag used for?

------------------------------------------------------------------------

# 4. Line Break Tag

Creates a **line break** in text.

``` html
<br>
```

**Key Points** - Self-closing tag - No closing tag required

**Interview Question** - What is the `<br>` tag?

------------------------------------------------------------------------

# 5. Horizontal Rule

Creates a **horizontal line**.

``` html
<hr>
```

Used to separate content.

------------------------------------------------------------------------

# 6. Pre Tag

Displays text exactly as written.

``` html
<pre>
Hello
   World
</pre>
```

**Key Points** - Preserves **spaces and line breaks**

**Interview Question** - What is the `<pre>` tag used for?

------------------------------------------------------------------------

# 7. Comments

Used to add notes inside HTML code.

``` html
<!-- This is a comment -->
```

**Interview Question** - How do you write comments in HTML?

------------------------------------------------------------------------

# 8. Hyperlinks

Used to navigate between pages.

``` html
<a href="https://example.com">Visit Site</a>
```

## href Attribute

Defines the **URL of the page**.

Example

``` html
<a href="https://google.com">Google</a>
```

## target Attribute

Specifies where the link opens.

``` html
<a href="https://google.com" target="_blank">Open Google</a>
```

Common values: - `_self` → same tab - `_blank` → new tab

## title Attribute

Shows tooltip when hovering.

``` html
<a href="https://google.com" title="Go to Google">Google</a>
```

**Interview Questions** - What is a hyperlink? - What is the `href`
attribute? - What does `target="_blank"` do?

------------------------------------------------------------------------

# 9. Images

Used to display images.

``` html
<img src="image.jpg" alt="Example image">
```

## Important Attributes

**src** - Image path

**alt** - Alternative text if image fails

**width / height** - Control image size

**Example**

``` html
<img src="cat.jpg" alt="cat image" width="300">
```

**Interview Questions** - What is the `<img>` tag? - What is the purpose
of the `alt` attribute?

------------------------------------------------------------------------

# 10. Audio

Used to embed audio files.

``` html
<audio src="song.mp3" controls></audio>
```

## Attributes

**controls** - Shows play/pause buttons

**autoplay** - Automatically plays audio

**muted** - Starts audio muted

**loop** - Repeats audio continuously

Example

``` html
<audio src="song.mp3" controls autoplay muted loop></audio>
```

**Interview Question** - What attributes are used in the audio tag?

------------------------------------------------------------------------

# 11. Video

Used to embed videos.

``` html
<video src="video.mp4" controls></video>
```

Common Attributes

-   `controls`
-   `autoplay`
-   `muted`
-   `loop`

Example

``` html
<video src="video.mp4" controls autoplay muted></video>
```

**Interview Question** - What is the video tag used for?

------------------------------------------------------------------------

# 12. Favicon

A small icon displayed in the browser tab.

Example

``` html
<link rel="icon" href="favicon.ico">
```

**Interview Question** - What is a favicon?

------------------------------------------------------------------------

# 13. Text Formatting Tags

Common formatting tags:

``` html
<b>Bold</b>
<strong>Important</strong>
<i>Italic</i>
<em>Emphasis</em>
<u>Underline</u>
<mark>Highlight</mark>
<small>Small text</small>
<del>Deleted text</del>
<ins>Inserted text</ins>
<sub>Subscript</sub>
<sup>Superscript</sup>
```

**Interview Question** - Difference between `<b>` and `<strong>`?

------------------------------------------------------------------------

# 14. Span vs Div vs P

## div

Block-level container.

``` html
<div>Content</div>
```

## span

Inline container.

``` html
<span>Inline text</span>
```

## p

Paragraph element.

``` html
<p>Paragraph text</p>
```

**Difference**

  Tag    Type     Usage
  ------ -------- ---------------------
  div    Block    Layout container
  span   Inline   Styling small parts
  p      Block    Paragraph text

**Interview Questions** - Difference between div and span? - Is span
inline or block?

------------------------------------------------------------------------

# 15. Lists

## Unordered List

``` html
<ul>
<li>Apple</li>
<li>Mango</li>
<li>Banana</li>
</ul>
```

## Ordered List

``` html
<ol>
<li>Step 1</li>
<li>Step 2</li>
</ol>
```

## Description List

``` html
<dl>
<dt>HTML</dt>
<dd>HyperText Markup Language</dd>
</dl>
```

**Interview Questions** - Difference between `ul`, `ol`, and `dl`?

------------------------------------------------------------------------

# 16. Tables

Used to display tabular data.

Example

``` html
<table border="1">
<tr>
<th>Name</th>
<th>Age</th>
</tr>
<tr>
<td>Aadi</td>
<td>22</td>
</tr>
</table>
```

## Table Tags

  Tag     Meaning
  ------- -----------------
  table   Table container
  tr      Table row
  th      Table header
  td      Table data

## Common Attributes

-   `border`
-   `cellpadding`
-   `cellspacing`
-   `colspan`
-   `rowspan`

**Interview Questions** - Difference between `<th>` and `<td>`? - What
is `colspan` and `rowspan`?

------------------------------------------------------------------------

# Quick Interview Revision

**Basic HTML Questions**

-   What is HTML?
-   What is DOCTYPE?
-   Difference between inline and block elements?
-   Difference between div and span?
-   What are semantic tags?
-   What is favicon?
-   Difference between `b` and `strong`?
-   Difference between `i` and `em`?
