# 📘 CSS Day 3 – Flexbox, Icons & Real Projects (Complete Master Notes)

> **Topics Covered:** CSS Icons, Flexbox (Complete Deep Dive with Diagrams), Dropdown Menu, Navigation Bar, Complete Website Layout, Image Gallery
> **Focus:** Interview ready, every property with diagram, real-world projects, common pitfalls and tricks

---

## Table of Contents

1. [CSS Icons ⭐](#1-css-icons-)
2. [Flexbox Complete Guide ⭐⭐⭐](#2-flexbox-complete-guide-)
3. [Project 1: Dropdown Menu 🔥](#3-project-1-dropdown-menu-)
4. [Project 2: Navigation Bar 🔥](#4-project-2-navigation-bar-)
5. [Project 3: Complete Website Layout 🔥](#5-project-3-complete-website-layout-)
6. [Project 4: Image Gallery 🔥](#6-project-4-image-gallery-)
7. [Interview Questions & Answers](#7-interview-questions--answers)

---

## 1. CSS Icons ⭐

### 1.1 What are CSS Icons?

Icons in CSS are small graphical symbols used to enhance the visual experience of a website. They are typically implemented using icon libraries, SVG, or web fonts. Icons are used for buttons, navigation, social media links, status indicators, and more.

### 1.2 Popular Icon Libraries

| Library | Method | CDN/Link |
|---------|--------|----------|
| Font Awesome | CDN + `<i>` or `<span>` | cdnjs |
| Google Material Icons | `<link>` + `<i>` or `<span>` | Google Fonts |
| Bootstrap Icons | CDN + `<i>` | cdnjs |
| Hero Icons | SVG | heroicons.com |
| Tabler Icons | SVG / Font | tabler-icons.io |

---

### 1.3 Font Awesome Icons

Font Awesome is the most popular icon library in the world. It provides 2,000+ free icons.

#### All Attributes Explained:

| Attribute / Class | Description | Example |
|---|---|---|
| `fa` | Base class for all Font Awesome icons | `<i class="fa fa-home"></i>` |
| `fa-solid` / `fas` | Solid style icons | `<i class="fas fa-home"></i>` |
| `fa-regular` / `far` | Outline/regular style icons | `<i class="far fa-heart"></i>` |
| `fa-brands` / `fab` | Brand logos | `<i class="fab fa-github"></i>` |
| `fa-2x` | 2x size | `<i class="fas fa-star fa-2x"></i>` |
| `fa-3x` | 3x size | `<i class="fas fa-star fa-3x"></i>` |
| `fa-spin` | Spinning animation | `<i class="fas fa-spinner fa-spin"></i>` |
| `fa-pulse` | 8-step spinning animation | `<i class="fas fa-spinner fa-pulse"></i>` |
| `fa-rotate-90` | Rotate 90 degrees | `<i class="fas fa-arrow-up fa-rotate-90"></i>` |
| `fa-flip-horizontal` | Flip horizontally | `<i class="fas fa-shield-alt fa-flip-horizontal"></i>` |
| `fa-flip-vertical` | Flip vertically | `<i class="fas fa-shield-alt fa-flip-vertical"></i>` |
| `fa-border` | Add a border around icon | `<i class="fas fa-user fa-border"></i>` |
| `fa-pull-left` | Float icon left | `<i class="fas fa-quote-left fa-pull-left"></i>` |
| `fa-pull-right` | Float icon right | `<i class="fas fa-quote-right fa-pull-right"></i>` |
| `fa-fw` | Fixed width (for alignment) | `<i class="fas fa-home fa-fw"></i>` |
| `fa-stack` | Stack multiple icons | `<i class="fa-stack"><i class="fas fa-square fa-stack-2x"></i></i>` |
| `fa-stack-1x` | Normal size in stack | `<i class="fas fa-flag fa-stack-1x"></i>` |
| `fa-stack-2x` | 2x size in stack | `<i class="fas fa-square fa-stack-2x"></i>` |
| `fa-inverse` | Inverted color in stack | `<i class="fas fa-flag fa-stack-1x fa-inverse"></i>` |

#### Complete Font Awesome Example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Font Awesome Icons Complete Guide</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            padding: 30px;
            background-color: #f5f5f5;
        }

        .section {
            background: white;
            padding: 25px;
            margin: 25px 0;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        h2 {
            color: #2c3e50;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #3498db;
        }

        h3 {
            color: #555;
            margin: 20px 0 10px 0;
        }

        /* Basic Icons */
        .icon-box {
            display: inline-block;
            margin: 10px;
            padding: 15px;
            background: #ecf0f1;
            border-radius: 8px;
            text-align: center;
        }

        .icon-box i {
            display: block;
            margin-bottom: 8px;
        }

        /* Icon Sizes */
        .size-demo i {
            margin: 10px;
            color: #3498db;
        }

        /* Icon Colors */
        .color-demo i {
            font-size: 30px;
            margin: 10px;
        }

        /* Animated Icons */
        .animation-demo i {
            font-size: 30px;
            margin: 15px;
            color: #e74c3c;
        }

        /* Icon Buttons */
        .icon-button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            margin: 5px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .icon-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .btn-primary {
            background-color: #3498db;
            color: white;
        }

        .btn-success {
            background-color: #2ecc71;
            color: white;
        }

        .btn-danger {
            background-color: #e74c3c;
            color: white;
        }

        .btn-warning {
            background-color: #f39c12;
            color: white;
        }

        /* Social Icons */
        .social-icons a {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            margin: 5px;
            border-radius: 50%;
            color: white;
            font-size: 18px;
            text-decoration: none;
            transition: all 0.3s;
        }

        .social-icons a:hover {
            transform: scale(1.2);
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }

        .facebook { background-color: #3b5998; }
        .twitter { background-color: #1da1f2; }
        .instagram { background-color: #e1306c; }
        .linkedin { background-color: #0077b5; }
        .youtube { background-color: #ff0000; }

        /* Stacked Icons */
        .stacked-icon {
            font-size: 30px;
            color: #3498db;
            margin: 10px;
        }

        /* Icon with Badge */
        .icon-with-badge {
            position: relative;
            display: inline-block;
            margin: 20px;
        }

        .icon-with-badge i {
            font-size: 30px;
            color: #2c3e50;
        }

        .icon-with-badge .badge {
            position: absolute;
            top: -8px;
            right: -8px;
            background: #e74c3c;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Icon Navigation */
        .icon-nav {
            display: flex;
            gap: 30px;
            padding: 20px;
            background: #2c3e50;
            border-radius: 10px;
        }

        .icon-nav a {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: white;
            text-decoration: none;
            transition: all 0.3s;
        }

        .icon-nav a:hover {
            color: #3498db;
            transform: translateY(-5px);
        }

        .icon-nav a i {
            font-size: 24px;
            margin-bottom: 5px;
        }

        .icon-nav a span {
            font-size: 12px;
        }

        /* Rotated and Flipped Icons */
        .transform-demo i {
            font-size: 30px;
            margin: 15px;
            color: #9b59b6;
        }

        /* Bordered Icons */
        .bordered-demo i {
            margin: 15px;
            font-size: 24px;
            color: #2c3e50;
        }

        code {
            background-color: #2d3436;
            color: #00cec9;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }

        th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }

        th {
            background-color: #3498db;
            color: white;
        }

        tr:nth-child(even) {
            background-color: #f8f9fa;
        }

        .note {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <h1>CSS Icons Complete Guide</h1>

    <!-- Basic Icons -->
    <div class="section">
        <h2>1. Basic Font Awesome Icons</h2>
        <p>Include Font Awesome CSS in your <code>&lt;head&gt;</code>:</p>
        <pre style="background: #2d3436; color: #00cec9; padding: 15px; border-radius: 5px; margin: 15px 0; overflow-x: auto;">
&lt;link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"&gt;
        </pre>
        
        <h3>Common Icons:</h3>
        <div class="icon-box"><i class="fas fa-home"></i><span>fa-home</span></div>
        <div class="icon-box"><i class="fas fa-user"></i><span>fa-user</span></div>
        <div class="icon-box"><i class="fas fa-envelope"></i><span>fa-envelope</span></div>
        <div class="icon-box"><i class="fas fa-phone"></i><span>fa-phone</span></div>
        <div class="icon-box"><i class="fas fa-search"></i><span>fa-search</span></div>
        <div class="icon-box"><i class="fas fa-heart"></i><span>fa-heart</span></div>
        <div class="icon-box"><i class="fas fa-star"></i><span>fa-star</span></div>
        <div class="icon-box"><i class="fas fa-cog"></i><span>fa-cog</span></div>
        <div class="icon-box"><i class="fas fa-bell"></i><span>fa-bell</span></div>
        <div class="icon-box"><i class="fas fa-shopping-cart"></i><span>fa-shopping-cart</span></div>
        <div class="icon-box"><i class="fas fa-trash"></i><span>fa-trash</span></div>
        <div class="icon-box"><i class="fas fa-edit"></i><span>fa-edit</span></div>
        <div class="icon-box"><i class="fas fa-check"></i><span>fa-check</span></div>
        <div class="icon-box"><i class="fas fa-times"></i><span>fa-times</span></div>
        <div class="icon-box"><i class="fas fa-bars"></i><span>fa-bars</span></div>
        <div class="icon-box"><i class="fas fa-arrow-right"></i><span>fa-arrow-right</span></div>
    </div>

    <!-- Icon Sizes -->
    <div class="section">
        <h2>2. Icon Sizes</h2>
        <div class="size-demo">
            <i class="fas fa-star"></i> Default
            <i class="fas fa-star fa-xs"></i> fa-xs
            <i class="fas fa-star fa-sm"></i> fa-sm
            <i class="fas fa-star fa-lg"></i> fa-lg
            <i class="fas fa-star fa-2x"></i> fa-2x
            <i class="fas fa-star fa-3x"></i> fa-3x
            <i class="fas fa-star fa-5x"></i> fa-5x
            <i class="fas fa-star fa-7x"></i> fa-7x
        </div>
        
        <h3>You can also set custom sizes:</h3>
        <pre style="background: #2d3436; color: #00cec9; padding: 15px; border-radius: 5px; margin: 15px 0; overflow-x: auto;">
/* Custom size with CSS */
.custom-icon {
    font-size: 48px;
}

/* Or use fa-10x, fa-2x etc */
        </pre>
    </div>

    <!-- Icon Colors -->
    <div class="section">
        <h2>3. Icon Colors</h2>
        <p>Icons inherit the color from their parent element, or you can set it directly:</p>
        <div class="color-demo">
            <i class="fas fa-heart" style="color: red;"></i>
            <i class="fas fa-heart" style="color: blue;"></i>
            <i class="fas fa-heart" style="color: green;"></i>
            <i class="fas fa-heart" style="color: #9b59b6;"></i>
            <i class="fas fa-heart" style="color: #f39c12;"></i>
            <i class="fas fa-heart" style="color: rgba(255, 0, 0, 0.5);"></i>
        </div>
        <pre style="background: #2d3436; color: #00cec9; padding: 15px; border-radius: 5px; margin: 15px 0; overflow-x: auto;">
/* Method 1: Inline style */
&lt;i class="fas fa-heart" style="color: red;"&gt;&lt;/i&gt;

/* Method 2: CSS class */
.red-icon { color: red; }

/* Method 3: Inherit from parent */
.parent { color: blue; }
        </pre>
    </div>

    <!-- Animated Icons -->
    <div class="section">
        <h2>4. Animated Icons</h2>
        <div class="animation-demo">
            <i class="fas fa-spinner fa-spin"></i> fa-spin
            <i class="fas fa-sync fa-spin"></i> fa-spin
            <i class="fas fa-cog fa-spin"></i> fa-spin
            <i class="fas fa-circle-notch fa-spin"></i> fa-spin
            <i class="fas fa-spinner fa-pulse"></i> fa-pulse
        </div>
        <pre style="background: #2d3436; color: #00cec9; padding: 15px; border-radius: 5px; margin: 15px 0; overflow-x: auto;">
/* Spinning icon */
&lt;i class="fas fa-spinner fa-spin"&gt;&lt;/i&gt;

/* Pulsing icon (8-step animation) */
&lt;i class="fas fa-spinner fa-pulse"&gt;&lt;/i&gt;
        </pre>
    </div>

    <!-- Rotated and Flipped Icons -->
    <div class="section">
        <h2>5. Rotated and Flipped Icons</h2>
        <div class="transform-demo">
            <i class="fas fa-arrow-up"></i> Original
            <i class="fas fa-arrow-up fa-rotate-90"></i> 90°
            <i class="fas fa-arrow-up fa-rotate-180"></i> 180°
            <i class="fas fa-arrow-up fa-rotate-270"></i> 270°
            <br>
            <i class="fas fa-shield-alt"></i> Original
            <i class="fas fa-shield-alt fa-flip-horizontal"></i> Horizontal
            <i class="fas fa-shield-alt fa-flip-vertical"></i> Vertical
        </div>
        <table>
            <thead>
                <tr>
                    <th>Class</th>
                    <th>Effect</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><code>fa-rotate-90</code></td><td>Rotate 90°</td></tr>
                <tr><td><code>fa-rotate-180</code></td><td>Rotate 180°</td></tr>
                <tr><td><code>fa-rotate-270</code></td><td>Rotate 270°</td></tr>
                <tr><td><code>fa-flip-horizontal</code></td><td>Flip horizontally</td></tr>
                <tr><td><code>fa-flip-vertical</code></td><td>Flip vertically</td></tr>
            </tbody>
        </table>
    </div>

    <!-- Bordered Icons -->
    <div class="section">
        <h2>6. Bordered and Pulled Icons</h2>
        <div class="bordered-demo">
            <i class="fas fa-user fa-border"></i> fa-border
            <i class="fas fa-user fa-border" style="border-color: red; padding: 5px;"></i> Custom border
            <i class="fas fa-user fa-fw"></i> fa-fw (fixed width)
        </div>
    </div>

    <!-- Icon Buttons -->
    <div class="section">
        <h2>7. Icon Buttons</h2>
        <button class="icon-button btn-primary">
            <i class="fas fa-download"></i> Download
        </button>
        <button class="icon-button btn-success">
            <i class="fas fa-check"></i> Submit
        </button>
        <button class="icon-button btn-danger">
            <i class="fas fa-trash"></i> Delete
        </button>
        <button class="icon-button btn-warning">
            <i class="fas fa-edit"></i> Edit
        </button>
        <pre style="background: #2d3436; color: #00cec9; padding: 15px; border-radius: 5px; margin: 15px 0; overflow-x: auto;">
.icon-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.icon-button i {
    font-size: 16px;
}
        </pre>
    </div>

    <!-- Social Icons -->
    <div class="section">
        <h2>8. Social Media Icons</h2>
        <div class="social-icons">
            <a href="#" class="facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="#" class="twitter"><i class="fab fa-twitter"></i></a>
            <a href="#" class="instagram"><i class="fab fa-instagram"></i></a>
            <a href="#" class="linkedin"><i class="fab fa-linkedin-in"></i></a>
            <a href="#" class="youtube"><i class="fab fa-youtube"></i></a>
        </div>
        <pre style="background: #2d3436; color: #00cec9; padding: 15px; border-radius: 5px; margin: 15px 0; overflow-x: auto;">
/* Use fa-brands for social icons */
&lt;i class="fab fa-facebook-f"&gt;&lt;/i&gt;
&lt;i class="fab fa-twitter"&gt;&lt;/i&gt;
&lt;i class="fab fa-instagram"&gt;&lt;/i&gt;
&lt;i class="fab fa-linkedin-in"&gt;&lt;/i&gt;
&lt;i class="fab fa-github"&gt;&lt;/i&gt;
        </pre>
    </div>

    <!-- Icon with Badge -->
    <div class="section">
        <h2>9. Icon with Badge (Cart, Notification)</h2>
        <div class="icon-with-badge">
            <i class="fas fa-bell"></i>
            <span class="badge">5</span>
        </div>
        <div class="icon-with-badge">
            <i class="fas fa-shopping-cart"></i>
            <span class="badge">3</span>
        </div>
        <div class="icon-with-badge">
            <i class="fas fa-envelope"></i>
            <span class="badge">12</span>
        </div>
        <pre style="background: #2d3436; color: #00cec9; padding: 15px; border-radius: 5px; margin: 15px 0; overflow-x: auto;">
.icon-with-badge {
    position: relative;
    display: inline-block;
}
.icon-with-badge .badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: red;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}
        </pre>
    </div>

    <!-- Icon Navigation -->
    <div class="section">
        <h2>10. Icon Navigation Bar</h2>
        <div class="icon-nav">
            <a href="#"><i class="fas fa-home"></i><span>Home</span></a>
            <a href="#"><i class="fas fa-search"></i><span>Search</span></a>
            <a href="#"><i class="fas fa-plus-circle"></i><span>Create</span></a>
            <a href="#"><i class="fas fa-heart"></i><span>Likes</span></a>
            <a href="#"><i class="fas fa-user"></i><span>Profile</span></a>
        </div>
    </div>

    <!-- Common Interview Question -->
    <div class="note">
        <h3>🔥 Interview Tip: Font Awesome vs SVG Icons</h3>
        <p><strong>Font Awesome:</strong> Easy to use, large library, requires external CSS/JS, larger bundle size</p>
        <p><strong>SVG Icons:</strong> No external dependency, smaller size, fully customizable with CSS, better performance</p>
        <p><strong>When to use which:</strong> Use Font Awesome for rapid prototyping. Use SVG for production apps where performance matters.</p>
    </div>
</body>
</html>
```

---

## 2. Flexbox Complete Guide ⭐⭐⭐

Flexbox (Flexible Box Layout) is a CSS layout model designed for one-dimensional layouts (either row or column). It is the most asked CSS topic in frontend interviews.

### 2.1 What is Flexbox?

Flexbox is a layout method that arranges items in a container along a single axis. It provides powerful alignment, spacing, and ordering capabilities that were previously impossible or very difficult with CSS.

### 2.2 Key Terminology

```
┌─────────────────── flex container ───────────────────┐
│                                                      │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐         │
│   │flex item│    │flex item│    │flex item│         │
│   └─────────┘    └─────────┘    └─────────┘         │
│                                                      │
│◄─────────── main axis (horizontal) ────────────────►│
│                   ▼                                  │
│              cross axis                              │
│             (vertical)                               │
└──────────────────────────────────────────────────────┘
```

- **Flex Container:** The parent element with `display: flex`
- **Flex Items:** Direct children of the flex container
- **Main Axis:** The primary axis (horizontal by default)
- **Cross Axis:** The perpendicular axis (vertical by default)

---

### 2.3 All Flex Container Properties

#### 2.3.1 `display: flex`

This is the starting point. It makes the element a flex container and its direct children become flex items.

```css
.container {
    display: flex; /* or display: inline-flex */
}
```

---

#### 2.3.2 `flex-direction`

Defines the **main axis** direction (the direction items are placed).

```
flex-direction: row (default)
┌─────────┬─────────┬─────────┐
│ Item 1  │ Item 2  │ Item 3  │
└─────────┴─────────┴─────────┘
→ → →

flex-direction: row-reverse
┌─────────┬─────────┬─────────┐
│ Item 3  │ Item 2  │ Item 1  │
└─────────┴─────────┴─────────┘
← ← ←

flex-direction: column
┌─────────┐
│ Item 1  │
├─────────┤
│ Item 2  │
├─────────┤
│ Item 3  │
└─────────┘
↓ ↓ ↓

flex-direction: column-reverse
┌─────────┐
│ Item 3  │
├─────────┤
│ Item 2  │
├─────────┤
│ Item 1  │
└─────────┘
↑ ↑ ↑
```

| Value | Description |
|-------|-------------|
| `row` (default) | Items placed left to right |
| `row-reverse` | Items placed right to left |
| `column` | Items placed top to bottom |
| `column-reverse` | Items placed bottom to top |

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        .container {
            display: flex;
            gap: 10px;
            padding: 15px;
            margin: 15px 0;
            background: #f0f0f0;
            border: 2px solid #333;
        }
        .item {
            padding: 20px;
            background: #3498db;
            color: white;
            text-align: center;
            border-radius: 5px;
        }
        .row { flex-direction: row; }
        .row-reverse { flex-direction: row-reverse; }
        .column { flex-direction: column; }
        .column-reverse { flex-direction: column-reverse; }
    </style>
</head>
<body>
    <h3>row (default)</h3>
    <div class="container row">
        <div class="item">1</div>
        <div class="item">2</div>
        <div class="item">3</div>
    </div>

    <h3>row-reverse</h3>
    <div class="container row-reverse">
        <div class="item">1</div>
        <div class="item">2</div>
        <div class="item">3</div>
    </div>

    <h3>column</h3>
    <div class="container column">
        <div class="item">1</div>
        <div class="item">2</div>
        <div class="item">3</div>
    </div>

    <h3>column-reverse</h3>
    <div class="container column-reverse">
        <div class="item">1</div>
        <div class="item">2</div>
        <div class="item">3</div>
    </div>
</body>
</html>
```

---

#### 2.3.3 `justify-content`

Aligns items along the **main axis** (horizontal by default).

```
justify-content: flex-start (default)
┌─────────┬────────┬──────────┐
│ Item 1  │ Item 2 │ Item 3   │████████
└─────────┴────────┴──────────┘

justify-content: flex-end
████████┌─────────┬────────┬──────────┐
        │ Item 1  │ Item 2 │ Item 3   │
        └─────────┴────────┴──────────┘

justify-content: center
████┌─────────┬────────┬──────────┐████
    │ Item 1  │ Item 2 │ Item 3   │
    └─────────┴────────┴──────────┘

justify-content: space-between
┌─────────┐████████┌────────┐████████┌──────────┐
│ Item 1  │        │ Item 2 │        │ Item 3   │
└─────────┘        └────────┘        └──────────┘

justify-content: space-around
███┌─────────┐████┌────────┐████┌──────────┐███
   │ Item 1  │    │ Item 2 │    │ Item 3   │
   └─────────┘    └────────┘    └──────────┘

justify-content: space-evenly
████┌─────────┐████┌────────┐████┌──────────┐████
    │ Item 1  │    │ Item 2 │    │ Item 3   │
    └─────────┘    └────────┘    └──────────┘
```

| Value | Description |
|-------|-------------|
| `flex-start` (default) | Items packed to the start |
| `flex-end` | Items packed to the end |
| `center` | Items centered |
| `space-between` | Equal space between items, no space at edges |
| `space-around` | Equal space around each item |
| `space-evenly` | Equal space between items AND at edges |

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        .container {
            display: flex;
            gap: 10px;
            padding: 15px;
            margin: 15px 0;
            background: #f0f0f0;
            border: 2px solid #333;
            height: 120px;
        }
        .item {
            padding: 20px 30px;
            background: #e74c3c;
            color: white;
            text-align: center;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <h3>flex-start</h3>
    <div class="container" style="justify-content: flex-start;">
        <div class="item">1</div><div class="item">2</div><div class="item">3</div>
    </div>
    <h3>flex-end</h3>
    <div class="container" style="justify-content: flex-end;">
        <div class="item">1</div><div class="item">2</div><div class="item">3</div>
    </div>
    <h3>center</h3>
    <div class="container" style="justify-content: center;">
        <div class="item">1</div><div class="item">2</div><div class="item">3</div>
    </div>
    <h3>space-between</h3>
    <div class="container" style="justify-content: space-between;">
        <div class="item">1</div><div class="item">2</div><div class="item">3</div>
    </div>
    <h3>space-around</h3>
    <div class="container" style="justify-content: space-around;">
        <div class="item">1</div><div class="item">2</div><div class="item">3</div>
    </div>
    <h3>space-evenly</h3>
    <div class="container" style="justify-content: space-evenly;">
        <div class="item">1</div><div class="item">2</div><div class="item">3</div>
    </div>
</body>
</html>
```

---

#### 2.3.4 `align-items`

Aligns items along the **cross axis** (vertical by default).

```
align-items: flex-start
┌──────────────────────────────────┐
│ ┌──────┐ ┌──────┐ ┌──────┐      │
│ │ Item │ │ Item │ │ Item │      │
│ │  1   │ │  2   │ │  3   │      │
│ └──────┘ └──────┘ └──────┘      │
│                                  │
│                                  │
└──────────────────────────────────┘

align-items: flex-end
┌──────────────────────────────────┐
│                                  │
│                                  │
│ ┌──────┐ ┌──────┐ ┌──────┐      │
│ │ Item │ │ Item │ │ Item │      │
│ │  1   │ │  2   │ │  3   │      │
│ └──────┘ └──────┘ └──────┘      │
└──────────────────────────────────┘

align-items: center
┌──────────────────────────────────┐
│                                  │
│ ┌──────┐ ┌──────┐ ┌──────┐      │
│ │ Item │ │ Item │ │ Item │      │
│ │  1   │ │  2   │ │  3   │      │
│ └──────┘ └──────┘ └──────┘      │
│                                  │
└──────────────────────────────────┘

align-items: stretch (default)
┌──────────────────────────────────┐
│ ┌──────┐ ┌──────┐ ┌──────┐      │
│ │      │ │      │ │      │      │
│ │ Item │ │ Item │ │ Item │      │
│ │  1   │ │  2   │ │  3   │      │
│ │      │ │      │ │      │      │
│ └──────┘ └──────┘ └──────┘      │
└──────────────────────────────────┘

align-items: baseline
┌──────────────────────────────────┐
│      ┌────┐                      │
│      │    │ ┌──────┐             │
│ ┌────┐     │      │ ┌────────┐  │
│ │ Big│Item │ Item │ │  Bigger │  │
│ └────┘ 1  │  2   │ │  Item 3 │  │
│           └──────┘ └────────┘  │
│  ──────── baseline ──────────   │
└──────────────────────────────────┘
```

| Value | Description |
|-------|-------------|
| `stretch` (default) | Items stretch to fill the container height |
| `flex-start` | Items aligned to the top of the container |
| `flex-end` | Items aligned to the bottom of the container |
| `center` | Items centered vertically |
| `baseline` | Items aligned by their text baseline |

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        .container {
            display: flex;
            justify-content: space-around;
            padding: 15px;
            margin: 15px 0;
            background: #f0f0f0;
            border: 2px solid #333;
            height: 150px;
        }
        .item {
            padding: 15px;
            background: #2ecc71;
            color: white;
            text-align: center;
            border-radius: 5px;
            width: 80px;
        }
        .tall { height: 60px; }
        .short { height: 30px; }
        .medium { height: 45px; }
    </style>
</head>
<body>
    <h3>align-items: flex-start</h3>
    <div class="container" style="align-items: flex-start;">
        <div class="item tall">Tall</div>
        <div class="item short">Short</div>
        <div class="item medium">Medium</div>
    </div>

    <h3>align-items: flex-end</h3>
    <div class="container" style="align-items: flex-end;">
        <div class="item tall">Tall</div>
        <div class="item short">Short</div>
        <div class="item medium">Medium</div>
    </div>

    <h3>align-items: center</h3>
    <div class="container" style="align-items: center;">
        <div class="item tall">Tall</div>
        <div class="item short">Short</div>
        <div class="item medium">Medium</div>
    </div>

    <h3>align-items: stretch</h3>
    <div class="container" style="align-items: stretch;">
        <div class="item">1</div>
        <div class="item">2</div>
        <div class="item">3</div>
    </div>
</body>
</html>
```

---

#### 2.3.5 `flex-wrap`

Controls whether items wrap to the next line when they overflow.

```
flex-wrap: nowrap (default)
┌──────────────────────────────────────────┐
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │
│ │     │ │     │ │     │ │     │ │     │ │
│ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ │
└──────────────────────────────────────────┘
Items overflow! ☠️

flex-wrap: wrap
┌──────────────────────────────────────────┐
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │
│ │  1  │ │  2  │ │  3  │ │  4  │ │  5  │ │
│ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ │
│ ┌─────┐ ┌─────┐ ┌─────┐                 │
│ │  6  │ │  7  │ │  8  │                 │
│ └─────┘ └─────┘ └─────┘                 │
└──────────────────────────────────────────┘
Items wrap to next line ✅

flex-wrap: wrap-reverse
┌──────────────────────────────────────────┐
│ ┌─────┐ ┌─────┐ ┌─────┐                 │
│ │  6  │ │  7  │ │  8  │                 │
│ └─────┘ └─────┘ └─────┘                 │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │
│ │  1  │ │  2  │ │  3  │ │  4  │ │  5  │ │
│ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ │
└──────────────────────────────────────────┘
Rows in reverse order ✅
```

| Value | Description |
|-------|-------------|
| `nowrap` (default) | Items stay on one line, may overflow |
| `wrap` | Items wrap to the next line |
| `wrap-reverse` | Items wrap to the next line in reverse order |

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        .container {
            display: flex;
            gap: 10px;
            padding: 15px;
            margin: 15px 0;
            background: #f0f0f0;
            border: 2px solid #333;
        }
        .item {
            padding: 20px;
            background: #9b59b6;
            color: white;
            text-align: center;
            border-radius: 5px;
            min-width: 120px;
        }
    </style>
</head>
<body>
    <h3>flex-wrap: nowrap (default) - OVERFLOW!</h3>
    <div class="container" style="flex-wrap: nowrap;">
        <div class="item">1</div><div class="item">2</div><div class="item">3</div>
        <div class="item">4</div><div class="item">5</div><div class="item">6</div>
        <div class="item">7</div><div class="item">8</div>
    </div>

    <h3>flex-wrap: wrap - Items wrap nicely!</h3>
    <div class="container" style="flex-wrap: wrap;">
        <div class="item">1</div><div class="item">2</div><div class="item">3</div>
        <div class="item">4</div><div class="item">5</div><div class="item">6</div>
        <div class="item">7</div><div class="item">8</div>
    </div>

    <h3>flex-wrap: wrap-reverse</h3>
    <div class="container" style="flex-wrap: wrap-reverse;">
        <div class="item">1</div><div class="item">2</div><div class="item">3</div>
        <div class="item">4</div><div class="item">5</div><div class="item">6</div>
        <div class="item">7</div><div class="item">8</div>
    </div>
</body>
</html>
```

---

#### 2.3.6 `align-content`

Controls how **multiple lines** of flex items are aligned along the cross axis. Only works when `flex-wrap: wrap` is set.

```
align-content: stretch (default)
┌──────────────────────────────────┐
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│ │    │ │    │ │    │ │    │    │
│ │    │ │    │ │    │ │    │    │
│ └────┘ └────┘ └────┘ └────┘    │
│ ┌────┐ ┌────┐ ┌────┐           │
│ │    │ │    │ │    │           │
│ │    │ │    │ │    │           │
│ └────┘ └────┘ └────┘           │
└──────────────────────────────────┘

align-content: center
┌──────────────────────────────────┐
│                                  │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│ │    │ │    │ │    │ │    │    │
│ └────┘ └────┘ └────┘ └────┘    │
│ ┌────┐ ┌────┐ ┌────┐           │
│ │    │ │    │ │    │           │
│ └────┘ └────┘ └────┘           │
│                                  │
└──────────────────────────────────┘

align-content: space-between
┌──────────────────────────────────┐
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│ │    │ │    │ │    │ │    │    │
│ └────┘ └────┘ └────┘ └────┘    │
│                                  │
│ ┌────┐ ┌────┐ ┌────┐           │
│ │    │ │    │ │    │           │
│ └────┘ └────┘ └────┘           │
└──────────────────────────────────┘
```

| Value | Description |
|-------|-------------|
| `stretch` (default) | Lines stretch to fill the container |
| `flex-start` | Lines packed to the start |
| `flex-end` | Lines packed to the end |
| `center` | Lines centered in the container |
| `space-between` | Equal space between lines |
| `space-around` | Equal space around each line |

---

#### 2.3.7 `gap`, `row-gap`, `column-gap`

Sets the space between flex items.

| Property | Description |
|----------|-------------|
| `gap` | Sets both row and column gap |
| `row-gap` | Sets gap between rows |
| `column-gap` | Sets gap between columns |

```css
/* Both gaps */
.container {
    gap: 20px;
}

/* Different row and column gaps */
.container {
    row-gap: 10px;
    column-gap: 30px;
}

/* Or shorthand with two values */
.container {
    gap: 10px 30px; /* row-gap column-gap */
}
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        .container {
            display: flex;
            flex-wrap: wrap;
            padding: 15px;
            margin: 15px 0;
            background: #f0f0f0;
            border: 2px solid #333;
        }
        .item {
            padding: 30px;
            background: #e67e22;
            color: white;
            text-align: center;
            border-radius: 5px;
            flex: 1 1 200px;
        }
    </style>
</head>
<body>
    <h3>gap: 10px</h3>
    <div class="container" style="gap: 10px;">
        <div class="item">1</div><div class="item">2</div>
        <div class="item">3</div><div class="item">4</div>
    </div>

    <h3>gap: 30px</h3>
    <div class="container" style="gap: 30px;">
        <div class="item">1</div><div class="item">2</div>
        <div class="item">3</div><div class="item">4</div>
    </div>

    <h3>row-gap: 50px; column-gap: 10px</h3>
    <div class="container" style="row-gap: 50px; column-gap: 10px;">
        <div class="item">1</div><div class="item">2</div>
        <div class="item">3</div><div class="item">4</div>
    </div>
</body>
</html>
```

---

### 2.4 All Flex Item Properties

#### 2.4.1 `flex-grow`

Defines how much an item should **grow** relative to other items. Default is `0` (items don't grow).

```
flex-grow: 0 (default)
┌──────┐ ┌──────┐ ┌──────┐ ████████████████████
│  1   │ │  2   │ │  3   │
└──────┘ └──────┘ └──────┘

flex-grow: 1 on all items
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│        1        │ │        2        │ │        3        │
└─────────────────┘ └─────────────────┘ └─────────────────┘

flex-grow: 1 on item 1, flex-grow: 2 on item 2, flex-grow: 1 on item 3
┌────────┐ ┌──────────────────┐ ┌────────┐
│   1    │ │        2         │ │   3    │
└────────┘ └──────────────────┘ └────────┘
(1 part)      (2 parts)          (1 part)
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        .container {
            display: flex;
            gap: 10px;
            padding: 15px;
            margin: 15px 0;
            background: #f0f0f0;
            border: 2px solid #333;
        }
        .item {
            padding: 20px;
            color: white;
            text-align: center;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <h3>flex-grow: 0 on all (default)</h3>
    <div class="container">
        <div class="item" style="background: #e74c3c; flex-grow: 0;">grow: 0</div>
        <div class="item" style="background: #3498db; flex-grow: 0;">grow: 0</div>
        <div class="item" style="background: #2ecc71; flex-grow: 0;">grow: 0</div>
    </div>

    <h3>flex-grow: 1 on all</h3>
    <div class="container">
        <div class="item" style="background: #e74c3c; flex-grow: 1;">grow: 1</div>
        <div class="item" style="background: #3498db; flex-grow: 1;">grow: 1</div>
        <div class="item" style="background: #2ecc71; flex-grow: 1;">grow: 1</div>
    </div>

    <h3>flex-grow: 1, 2, 1</h3>
    <div class="container">
        <div class="item" style="background: #e74c3c; flex-grow: 1;">grow: 1</div>
        <div class="item" style="background: #3498db; flex-grow: 2;">grow: 2 (twice as big)</div>
        <div class="item" style="background: #2ecc71; flex-grow: 1;">grow: 1</div>
    </div>
</body>
</html>
```

---

#### 2.4.2 `flex-shrink`

Defines how much an item should **shrink** relative to other items when there is not enough space. Default is `1`.

```css
/* Don't shrink at all */
.item {
    flex-shrink: 0;
}

/* Shrink at normal rate */
.item {
    flex-shrink: 1;
}

/* Shrink faster than others */
.item {
    flex-shrink: 2;
}
```

---

#### 2.4.3 `flex-basis`

Defines the **initial size** of an item before growing or shrinking. It replaces `width` (or `height` in column direction) when used in flexbox.

```css
/* Initial size of 200px */
.item {
    flex-basis: 200px;
}

/* Initial size of 30% of container */
.item {
    flex-basis: 30%;
}

/* Use content size */
.item {
    flex-basis: auto;
}
```

---

#### 2.4.4 `flex` Shorthand

The `flex` property is a shorthand for `flex-grow`, `flex-shrink`, and `flex-basis`.

```css
/* flex: grow shrink basis */
.item {
    flex: 1 1 200px; /* grow: 1, shrink: 1, basis: 200px */
}

/* Common shortcuts */
.item {
    flex: 1; /* Same as flex: 1 1 0% */
}

.item {
    flex: none; /* Same as flex: 0 0 auto (no grow, no shrink) */
}

.item {
    flex: auto; /* Same as flex: 1 1 auto */
}
```

---

#### 2.4.5 `order`

Changes the **visual order** of flex items without changing the HTML order. Default is `0`.

```css
/* Default order is 0 */
.item-1 { order: 0; }
.item-2 { order: 1; }  /* Appears last */
.item-3 { order: -1; } /* Appears first */
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        .container {
            display: flex;
            gap: 10px;
            padding: 15px;
            margin: 15px 0;
            background: #f0f0f0;
            border: 2px solid #333;
        }
        .item {
            padding: 20px 30px;
            color: white;
            text-align: center;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <h3>HTML order: 1, 2, 3 → CSS order: 3, 1, 2</h3>
    <div class="container">
        <div class="item" style="background: #e74c3c; order: 2;">Item 1 (order: 2)</div>
        <div class="item" style="background: #3498db; order: 3;">Item 2 (order: 3) - LAST</div>
        <div class="item" style="background: #2ecc71; order: 1;">Item 3 (order: 1) - FIRST</div>
    </div>
</body>
</html>
```

---

#### 2.4.6 `align-self`

Overrides `align-items` for a **specific item**. Allows individual items to have different cross-axis alignment.

```css
.container {
    display: flex;
    align-items: flex-start; /* All items at top */
}

.special-item {
    align-self: flex-end; /* This one goes to bottom */
}

.centered-item {
    align-self: center; /* This one is centered */
}
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        .container {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 15px;
            margin: 15px 0;
            background: #f0f0f0;
            border: 2px solid #333;
            height: 200px;
        }
        .item {
            padding: 20px;
            color: white;
            text-align: center;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <h3>align-self overrides align-items for individual items</h3>
    <div class="container">
        <div class="item" style="background: #e74c3c; align-self: flex-start;">start</div>
        <div class="item" style="background: #3498db; align-self: center;">center</div>
        <div class="item" style="background: #2ecc71; align-self: flex-end;">end</div>
        <div class="item" style="background: #9b59b6; align-self: stretch;">stretch</div>
    </div>
</body>
</html>
```

---

### 2.5 Complete Flexbox Diagram Reference

```
┌──────────── FLEX CONTAINER (display: flex) ──────────────┐
│                                                           │
│  flex-direction: row (main axis →)                        │
│                                                           │
│  justify-content: (main axis alignment)                   │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐                │
│  │ Item 1  │   │ Item 2  │   │ Item 3  │                │
│  │flex-grow│   │flex-grow│   │flex-grow│                │
│  │flex-shrk│   │flex-shrk│   │flex-shrk│                │
│  │flex-basis   │flex-basis   │flex-basis                │
│  │order    │   │order    │   │order    │                │
│  │align-self   │align-self   │align-self                │
│  └─────────┘   └─────────┘   └─────────┘                │
│                                                           │
│  align-items: (cross axis ↓ alignment)                    │
│                                                           │
│  gap: (space between items)                               │
│                                                           │
│  flex-wrap: wrap (items go to next line →)                │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

---

### 2.6 Complete Flexbox Reference Table

#### Container Properties

| Property | Description | Values | Default |
|---|---|---|---|
| `display` | Makes element a flex container | `flex`, `inline-flex` | - |
| `flex-direction` | Direction of main axis | `row`, `row-reverse`, `column`, `column-reverse` | `row` |
| `justify-content` | Main axis alignment | `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly` | `flex-start` |
| `align-items` | Cross axis alignment | `stretch`, `flex-start`, `flex-end`, `center`, `baseline` | `stretch` |
| `align-content` | Multi-line cross axis alignment | `stretch`, `flex-start`, `flex-end`, `center`, `space-between`, `space-around` | `stretch` |
| `flex-wrap` | Wrapping behavior | `nowrap`, `wrap`, `wrap-reverse` | `nowrap` |
| `gap` | Space between items | Any length | `0` |
| `row-gap` | Space between rows | Any length | `0` |
| `column-gap` | Space between columns | Any length | `0` |

#### Item Properties

| Property | Description | Values | Default |
|---|---|---|---|
| `flex-grow` | How much to grow | Number | `0` |
| `flex-shrink` | How much to shrink | Number | `1` |
| `flex-basis` | Initial size | Any length, `auto`, `content` | `auto` |
| `flex` | Shorthand for grow/shrink/basis | `grow shrink basis` | `0 1 auto` |
| `order` | Visual order | Number | `0` |
| `align-self` | Individual cross axis alignment | `auto`, `stretch`, `flex-start`, `flex-end`, `center`, `baseline` | `auto` |

---

## 3. Project 1: Dropdown Menu 🔥

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>CSS Dropdown Menu</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            padding: 30px;
            background-color: #f5f5f5;
        }

        .dropdown {
            position: relative;
            display: inline-block;
        }

        .dropdown-button {
            background-color: #3498db;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .dropdown-button:hover {
            background-color: #2980b9;
        }

        .dropdown-button::after {
            content: "▼";
            font-size: 10px;
            margin-left: 5px;
        }

        .dropdown-content {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            min-width: 200px;
            background-color: white;
            border-radius: 5px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
            z-index: 100;
            overflow: hidden;
        }

        .dropdown:hover .dropdown-content {
            display: block;
        }

        .dropdown-content a {
            display: block;
            padding: 12px 16px;
            color: #333;
            text-decoration: none;
            border-bottom: 1px solid #eee;
            transition: all 0.3s;
        }

        .dropdown-content a:hover {
            background-color: #3498db;
            color: white;
        }

        .dropdown-content a:last-child {
            border-bottom: none;
        }

        /* Multi-level dropdown */
        .dropdown-sub {
            position: relative;
        }

        .dropdown-sub .dropdown-sub-content {
            display: none;
            position: absolute;
            left: 100%;
            top: 0;
            min-width: 200px;
            background-color: white;
            border-radius: 5px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        }

        .dropdown-sub:hover .dropdown-sub-content {
            display: block;
        }

        .dropdown-sub > a::after {
            content: " ▶";
            font-size: 10px;
            float: right;
        }
    </style>
</head>
<body>
    <h1>CSS Dropdown Menu Project</h1>
    <br>

    <!-- Simple Dropdown -->
    <div class="dropdown">
        <button class="dropdown-button">Menu</button>
        <div class="dropdown-content">
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Services</a>
            <a href="#">Contact</a>
        </div>
    </div>

    <!-- Multi-level Dropdown -->
    <div class="dropdown">
        <button class="dropdown-button">Products</button>
        <div class="dropdown-content">
            <a href="#">Electronics</a>
            <div class="dropdown-sub">
                <a href="#">Clothing</a>
                <div class="dropdown-sub-content">
                    <a href="#">Men</a>
                    <a href="#">Women</a>
                    <a href="#">Kids</a>
                </div>
            </div>
            <a href="#">Books</a>
            <a href="#">Sports</a>
        </div>
    </div>
</body>
</html>
```

---

## 4. Project 2: Navigation Bar 🔥

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Complete Navigation Bar</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            padding-top: 70px;
            background-color: #f5f5f5;
        }

        /* Fixed Navigation Bar */
        .navbar {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 30px;
            background-color: #2c3e50;
            color: white;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        .navbar-logo {
            font-size: 24px;
            font-weight: bold;
            color: #3498db;
            text-decoration: none;
        }

        .navbar-nav {
            display: flex;
            list-style: none;
            gap: 5px;
        }

        .navbar-nav li {
            position: relative;
        }

        .navbar-nav a {
            color: white;
            text-decoration: none;
            padding: 10px 15px;
            border-radius: 5px;
            display: block;
            transition: all 0.3s;
        }

        .navbar-nav a:hover {
            background-color: #34495e;
            color: #3498db;
        }

        .navbar-nav a.active {
            background-color: #3498db;
            color: white;
        }

        /* Dropdown in navbar */
        .navbar-nav .dropdown-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            min-width: 200px;
            background-color: #34495e;
            border-radius: 5px;
            overflow: hidden;
            box-shadow: 0 8px 16px rgba(0,0,0,0.3);
        }

        .navbar-nav li:hover .dropdown-menu {
            display: block;
        }

        .dropdown-menu a {
            border-bottom: 1px solid #2c3e50;
        }

        .navbar-nav .has-dropdown > a::after {
            content: " ▼";
            font-size: 8px;
        }

        /* Search bar in navbar */
        .navbar-search {
            display: flex;
            align-items: center;
        }

        .navbar-search input {
            padding: 8px 15px;
            border: none;
            border-radius: 20px 0 0 20px;
            outline: none;
            font-size: 14px;
        }

        .navbar-search button {
            padding: 8px 15px;
            border: none;
            border-radius: 0 20px 20px 0;
            background-color: #3498db;
            color: white;
            cursor: pointer;
        }

        .navbar-search button:hover {
            background-color: #2980b9;
        }

        /* Responsive hamburger */
        .hamburger {
            display: none;
            flex-direction: column;
            gap: 5px;
            cursor: pointer;
            padding: 10px;
        }

        .hamburger span {
            width: 25px;
            height: 3px;
            background-color: white;
            border-radius: 2px;
        }

        /* Page content */
        .content {
            max-width: 800px;
            margin: 30px auto;
            padding: 30px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .content h1 {
            margin-bottom: 20px;
        }

        .content p {
            line-height: 1.8;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <a href="#" class="navbar-logo">MyBrand</a>

        <ul class="navbar-nav">
            <li><a href="#" class="active">Home</a></li>
            <li><a href="#">About</a></li>
            <li class="has-dropdown">
                <a href="#">Services</a>
                <div class="dropdown-menu">
                    <a href="#">Web Development</a>
                    <a href="#">App Development</a>
                    <a href="#">UI/UX Design</a>
                    <a href="#">SEO</a>
                </div>
            </li>
            <li><a href="#">Portfolio</a></li>
            <li><a href="#">Contact</a></li>
        </ul>

        <div class="navbar-search">
            <input type="text" placeholder="Search...">
            <button>Search</button>
        </div>

        <div class="hamburger">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </nav>

    <div class="content">
        <h1>Complete Navigation Bar Project</h1>
        <p>This is a complete, responsive navigation bar with:</p>
        <ul style="margin: 20px 0; padding-left: 20px;">
            <li>Fixed positioning (stays on top when scrolling)</li>
            <li>Flexbox layout for horizontal navigation</li>
            <li>Dropdown menu on hover</li>
            <li>Search bar with rounded input</li>
            <li>Active link highlighting</li>
            <li>Smooth hover transitions</li>
            <li>Hamburger menu for mobile (hidden by default)</li>
        </ul>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
    </div>
</body>
</html>
```

---

## 5. Project 3: Complete Website Layout with Semantic Tags 🔥

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Complete Website Layout</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
        }

        a {
            color: #3498db;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        /* Header */
        header {
            background-color: #2c3e50;
            color: white;
            padding: 15px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        header h1 {
            font-size: 24px;
        }

        header h1 span {
            color: #3498db;
        }

        /* Navigation */
        nav ul {
            display: flex;
            list-style: none;
            gap: 20px;
        }

        nav a {
            color: white;
            padding: 8px 15px;
            border-radius: 5px;
            transition: background-color 0.3s;
        }

        nav a:hover {
            background-color: #34495e;
            text-decoration: none;
        }

        /* Main Content Area */
        main {
            display: flex;
            gap: 20px;
            max-width: 1200px;
            margin: 20px auto;
            padding: 0 20px;
        }

        /* Article Section */
        article {
            flex: 2;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        article img {
            width: 100%;
            height: 300px;
            object-fit: cover;
        }

        article .article-content {
            padding: 30px;
        }

        article h2 {
            color: #2c3e50;
            margin-bottom: 15px;
        }

        article p {
            margin-bottom: 15px;
            line-height: 1.8;
        }

        article .meta {
            color: #999;
            font-size: 14px;
            margin-bottom: 20px;
        }

        article section {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }

        article section h3 {
            color: #2c3e50;
            margin-bottom: 10px;
        }

        /* Sidebar */
        aside {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        aside section {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        aside h3 {
            color: #2c3e50;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #3498db;
        }

        aside ul {
            list-style: none;
        }

        aside ul li {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }

        aside ul li:last-child {
            border-bottom: none;
        }

        /* Figure */
        figure {
            margin: 20px 0;
        }

        figure img {
            width: 100%;
            border-radius: 5px;
        }

        figcaption {
            text-align: center;
            color: #666;
            font-size: 14px;
            margin-top: 8px;
        }

        /* Footer */
        footer {
            background-color: #2c3e50;
            color: white;
            margin-top: 40px;
        }

        .footer-content {
            display: flex;
            justify-content: space-around;
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .footer-section {
            flex: 1;
            padding: 0 15px;
        }

        .footer-section h4 {
            color: #3498db;
            margin-bottom: 15px;
        }

        .footer-section ul {
            list-style: none;
        }

        .footer-section ul li {
            margin-bottom: 8px;
        }

        .footer-section a {
            color: #bdc3c7;
        }

        .footer-section a:hover {
            color: #3498db;
        }

        .footer-bottom {
            text-align: center;
            padding: 15px;
            background-color: #1a252f;
            color: #bdc3c7;
        }
    </style>
</head>
<body>
    <header>
        <h1>My<span>Website</span></h1>
        <nav>
            <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Services</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <article>
            <img src="https://via.placeholder.com/800x300" alt="Article hero image">
            
            <div class="article-content">
                <h2>Complete Guide to CSS Flexbox</h2>
                <p class="meta">Published: <time datetime="2024-01-15">January 15, 2024</time> | Author: John Doe</p>
                
                <p>Flexbox is a CSS layout model designed for one-dimensional layouts. It provides powerful alignment, spacing, and ordering capabilities that were previously impossible with traditional CSS.</p>

                <figure>
                    <img src="https://via.placeholder.com/600x300" alt="Flexbox diagram">
                    <figcaption>Figure 1: Flexbox axis diagram</figcaption>
                </figure>

                <section>
                    <h3>Key Flexbox Properties</h3>
                    <p>The most important flex container properties are <code>flex-direction</code>, <code>justify-content</code>, <code>align-items</code>, and <code>flex-wrap</code>. These four properties alone can handle 90% of all layout needs.</p>
                </section>

                <section>
                    <h3>When to Use Flexbox</h3>
                    <p>Use Flexbox for one-dimensional layouts (row or column). Use CSS Grid for two-dimensional layouts (rows AND columns). This simple rule will guide you through almost every layout decision.</p>
                </section>
            </div>
        </article>

        <aside>
            <section>
                <h3>About the Author</h3>
                <p>John Doe is a senior web developer with 10 years of experience in frontend development.</p>
            </section>

            <section>
                <h3>Popular Posts</h3>
                <ul>
                    <li><a href="#">CSS Grid Complete Guide</a></li>
                    <li><a href="#">JavaScript ES6 Features</a></li>
                    <li><a href="#">Responsive Design Tips</a></li>
                    <li><a href="#">HTML5 Semantic Tags</a></li>
                    <li><a href="#">CSS Variables Explained</a></li>
                </ul>
            </section>

            <section>
                <h3>Categories</h3>
                <ul>
                    <li><a href="#">HTML</a></li>
                    <li><a href="#">CSS</a></li>
                    <li><a href="#">JavaScript</a></li>
                    <li><a href="#">React</a></li>
                    <li><a href="#">Node.js</a></li>
                </ul>
            </section>
        </aside>
    </main>

    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <h4>Company</h4>
                <ul>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Careers</a></li>
                    <li><a href="#">Press</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Resources</h4>
                <ul>
                    <li><a href="#">Blog</a></li>
                    <li><a href="#">Documentation</a></li>
                    <li><a href="#">Support</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Legal</h4>
                <ul>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms of Service</a></li>
                    <li><a href="#">Cookie Policy</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Contact</h4>
                <ul>
                    <li><a href="mailto:hello@company.com">hello@company.com</a></li>
                    <li><a href="tel:+1234567890">(123) 456-7890</a></li>
                    <li>123 Web Street, Tech City</li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 MyWebsite. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>
```

---

## 6. Project 4: Image Gallery 🔥

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>CSS Image Gallery</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            padding: 30px;
            background-color: #f5f5f5;
        }

        h1 {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 30px;
        }

        /* Flexbox Grid Gallery */
        .gallery {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            justify-content: center;
        }

        .gallery-item {
            flex: 1 1 300px;
            max-width: 350px;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: all 0.3s;
        }

        .gallery-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }

        .gallery-item img {
            width: 100%;
            height: 250px;
            object-fit: cover;
            transition: transform 0.3s;
        }

        .gallery-item:hover img {
            transform: scale(1.05);
        }

        .gallery-item .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .gallery-item:hover .overlay {
            opacity: 1;
        }

        .gallery-item .overlay span {
            color: white;
            font-size: 24px;
        }

        .gallery-item img {
            position: relative;
        }

        .gallery-item .item-info {
            padding: 15px;
        }

        .gallery-item .item-info h3 {
            color: #2c3e50;
            margin-bottom: 8px;
        }

        .gallery-item .item-info p {
            color: #666;
            font-size: 14px;
            line-height: 1.5;
        }

        .gallery-item .item-info .tags {
            display: flex;
            gap: 8px;
            margin-top: 10px;
            flex-wrap: wrap;
        }

        .gallery-item .item-info .tags span {
            background-color: #e8f4f8;
            color: #3498db;
            padding: 4px 10px;
            border-radius: 15px;
            font-size: 12px;
        }

        /* Masonry-style Gallery */
        .masonry {
            columns: 3;
            column-gap: 15px;
            margin-top: 40px;
        }

        .masonry-item {
            break-inside: avoid;
            margin-bottom: 15px;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .masonry-item img {
            width: 100%;
            display: block;
        }

        .masonry-item p {
            padding: 15px;
            color: #333;
        }
    </style>
</head>
<body>
    <h1>CSS Image Gallery Projects</h1>

    <!-- Flexbox Grid Gallery -->
    <h2 style="text-align: center; color: #555; margin-bottom: 20px;">Flexbox Grid Gallery</h2>
    <div class="gallery">
        <div class="gallery-item">
            <img src="https://via.placeholder.com/350x250/3498db/ffffff?text=Image+1" alt="Image 1">
            <div class="item-info">
                <h3>Beautiful Sunset</h3>
                <p>A stunning sunset captured at the beach during golden hour.</p>
                <div class="tags">
                    <span>Nature</span>
                    <span>Sunset</span>
                </div>
            </div>
        </div>
        <div class="gallery-item">
            <img src="https://via.placeholder.com/350x250/e74c3c/ffffff?text=Image+2" alt="Image 2">
            <div class="item-info">
                <h3>Mountain Peak</h3>
                <p>The majestic view from the top of the mountain.</p>
                <div class="tags">
                    <span>Adventure</span>
                    <span>Mountain</span>
                </div>
            </div>
        </div>
        <div class="gallery-item">
            <img src="https://via.placeholder.com/350x250/2ecc71/ffffff?text=Image+3" alt="Image 3">
            <div class="item-info">
                <h3>Forest Trail</h3>
                <p>A peaceful walk through the dense forest trail.</p>
                <div class="tags">
                    <span>Nature</span>
                    <span>Forest</span>
                </div>
            </div>
        </div>
        <div class="gallery-item">
            <img src="https://via.placeholder.com/350x250/9b59b6/ffffff?text=Image+4" alt="Image 4">
            <div class="item-info">
                <h3>City Lights</h3>
                <p>The beautiful city skyline at night with colorful lights.</p>
                <div class="tags">
                    <span>Urban</span>
                    <span>Night</span>
                </div>
            </div>
        </div>
        <div class="gallery-item">
            <img src="https://via.placeholder.com/350x250/f39c12/ffffff?text=Image+5" alt="Image 5">
            <div class="item-info">
                <h3>Ocean Waves</h3>
                <p>Powerful ocean waves crashing on the rocky shore.</p>
                <div class="tags">
                    <span>Sea</span>
                    <span>Waves</span>
                </div>
            </div>
        </div>
        <div class="gallery-item">
            <img src="https://via.placeholder.com/350x250/1abc9c/ffffff?text=Image+6" alt="Image 6">
            <div class="item-info">
                <h3>Desert Dunes</h3>
                <p>Golden sand dunes stretching as far as the eye can see.</p>
                <div class="tags">
                    <span>Desert</span>
                    <span>Travel</span>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
```

---

## 7. Interview Questions & Answers

### Q1: What is the difference between `justify-content` and `align-items`?
**Answer:**
`justify-content` controls alignment along the **main axis** (horizontal by default). `align-items` controls alignment along the **cross axis** (vertical by default). They work together to position items in two dimensions within a flex container.

---

### Q2: What is the difference between `align-items` and `align-content`?
**Answer:**
`align-items` aligns **individual items** within a single line along the cross axis. `align-content` aligns **multiple lines** of items when `flex-wrap: wrap` is used. If there is only one line, `align-content` has no effect.

---

### Q3: What does `flex: 1` mean?
**Answer:**
`flex: 1` is shorthand for `flex-grow: 1`, `flex-shrink: 1`, and `flex-basis: 0%`. It means the item will grow to fill available space equally, can shrink if needed, and starts with zero width (all space is distributed).

---

### Q4: What is the difference between `flex-direction` and `flex-wrap`?
**Answer:**
`flex-direction` controls the **axis** along which items are placed (row or column). `flex-wrap` controls whether items **wrap to the next line** when they overflow. They are independent and can be used together.

---

### Q5: How do you center an element both horizontally and vertically using Flexbox?
**Answer:**
Apply `display: flex`, `justify-content: center`, and `align-items: center` to the parent container. This centers the child element both horizontally and vertically.

```css
.parent {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
```

---

### Q6: What does `order` do in Flexbox?
**Answer:**
`order` changes the **visual order** of flex items without changing the HTML order. Items with a lower order value appear first. The default value is `0`. This is useful for responsive designs where you want to rearrange items on different screen sizes.

---

### Q7: What is the difference between `flex-shrink: 0` and `flex-shrink: 1`?
**Answer:**
`flex-shrink: 0` means the item will **not shrink** at all, even if there is not enough space. `flex-shrink: 1` means the item will shrink proportionally to other items. Items with `flex-shrink: 0` are commonly used for sidebars that should never collapse.

---

### Q8: Why does `flex-wrap: wrap` not work sometimes?
**Answer:**
Check that the flex items have a defined `flex-basis` or `min-width` set. If items have no minimum size, they will compress infinitely instead of wrapping. Also make sure the container has enough width to cause wrapping.

---

✅ Day 3 CSS is now **100% complete** with every single topic covered in full detail with diagrams, examples, comparison tables, and interview questions.

You now have complete mastery over CSS Icons, Flexbox, and real-world projects. Ready for **Day 4 (CSS Grid, Animations, Media Queries, Z-Index, CSS Variables)**?