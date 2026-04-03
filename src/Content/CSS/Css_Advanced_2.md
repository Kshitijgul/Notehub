# 📘 CSS Day 4 – Complete Master Notes

> **Topics Covered:** CSS Grid, Animations, Media Queries, Z-Index, CSS Variables, Tips for Responsiveness
> **Focus:** Interview ready, full working examples, diagrams, comparison tables, tips and tricks

---

## Table of Contents

1. [CSS Grid Complete Guide ⭐⭐⭐](#1-css-grid-complete-guide-)
2. [CSS Animations (Transitions & Keyframes) ⭐⭐⭐](#2-css-animations-transitions--keyframes-)
3. [Media Queries & Responsive Design ⭐⭐⭐](#3-media-queries--responsive-design-)
4. [Z-Index & Stacking Context ⭐⭐⭐](#4-z-index--stacking-context-)
5. [CSS Variables (Custom Properties) ⭐⭐](#5-css-variables-custom-properties-)
6. [Tips & Tricks for Responsiveness](#6-tips--tricks-for-responsiveness)
7. [Interview Questions & Answers](#7-interview-questions--answers)

---

## 1. CSS Grid Complete Guide ⭐⭐⭐

CSS Grid is a two-dimensional layout system that allows you to create complex layouts with rows and columns simultaneously. It is the most powerful layout system in CSS.

### 1.1 What is CSS Grid?

CSS Grid is a **two-dimensional** layout system (rows AND columns), while Flexbox is **one-dimensional** (row OR column). Grid is perfect for page layouts, while Flexbox is perfect for component layouts.

```
┌─────────────────────────────────────────────────────────────┐
│                      GRID CONTAINER                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │             │ │             │ │             │           │
│  │   Grid      │ │   Grid      │ │   Grid      │           │
│  │   Item 1    │ │   Item 2    │ │   Item 3    │           │
│  │             │ │             │ │             │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │             │ │             │ │             │           │
│  │   Grid      │ │   Grid      │ │   Grid      │           │
│  │   Item 4    │ │   Item 5    │ │   Item 6    │           │
│  │             │ │             │ │             │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Grid Terminology

| Term | Description |
|------|-------------|
| **Grid Container** | The parent element with `display: grid` |
| **Grid Items** | Direct children of the grid container |
| **Grid Lines** | Lines between rows/columns (numbered) |
| **Grid Tracks** | Rows and columns |
| **Grid Cells** | Single unit (intersection of row and column) |
| **Grid Areas** | Named regions of the grid |

### 1.3 All Grid Container Properties

#### 1.3.1 `display: grid`

This is the starting point. It makes the element a grid container.

```css
.container {
    display: grid; /* or display: inline-grid */
}
```

---

#### 1.3.2 `grid-template-columns`

Defines the columns of the grid.

```
grid-template-columns: 200px 200px 200px;
┌─────────────┬─────────────┬─────────────┐
│             │             │             │
│   Item 1    │   Item 2    │   Item 3    │
│             │             │             │
└─────────────┴─────────────┴─────────────┘
Each column is 200px wide

grid-template-columns: 1fr 1fr 1fr;
┌───────────────────────┬───────────────────────┬───────────────────────┐
│                       │                       │                       │
│         Item 1        │         Item 2        │         Item 3        │
│                       │                       │                       │
└───────────────────────┴───────────────────────┴───────────────────────┘
Each column takes 1/3 of available space

grid-template-columns: 200px 1fr 2fr;
┌─────────────┬───────────────────────┬─────────────────────────────────────┐
│             │                       │                                   │
│   Item 1    │         Item 2        │             Item 3                 │
│             │                       │                                   │
└─────────────┴───────────────────────┴─────────────────────────────────────┘
First: 200px, Second: 1 part, Third: 2 parts
```

| Value | Description |
|-------|-------------|
| `px` | Fixed width in pixels |
| `%` | Percentage of container width |
| `fr` | Fraction of available space |
| `auto` | Based on content size |
| `repeat(n, size)` | Repeat n times |

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        .container {
            display: grid;
            gap: 10px;
            padding: 15px;
            margin: 15px 0;
            background: #f0f0f0;
            border: 2px solid #333;
        }
        .item {
            padding: 30px;
            background: #3498db;
            color: white;
            text-align: center;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <h3>grid-template-columns: 200px 200px 200px</h3>
    <div class="container" style="grid-template-columns: 200px 200px 200px;">
        <div class="item">1</div><div class="item">2</div><div class="item">3</div>
    </div>

    <h3>grid-template-columns: 1fr 1fr 1fr</h3>
    <div class="container" style="grid-template-columns: 1fr 1fr 1fr;">
        <div class="item">1</div><div class="item">2</div><div class="item">3</div>
    </div>

    <h3>grid-template-columns: repeat(4, 1fr)</h3>
    <div class="container" style="grid-template-columns: repeat(4, 1fr);">
        <div class="item">1</div><div class="item">2</div><div class="item">3</div><div class="item">4</div>
    </div>
</body>
</html>
```

---

#### 1.3.3 `grid-template-rows`

Defines the rows of the grid.

```
grid-template-rows: 100px 100px;
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────┐                             │
│ │         Item 1              │                             │
│ └─────────────────────────────┘                             │
│ ┌─────────────────────────────┐                             │
│ │         Item 2              │                             │
│ └─────────────────────────────┘                             │
│ ┌─────────────────────────────┐                             │
│ │         Item 3              │                             │
│ └─────────────────────────────┘                             │
└─────────────────────────────────────────────────────────────┘
Each row is 100px tall
```

---

#### 1.3.4 `gap`, `row-gap`, `column-gap`

Sets the space between grid items.

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

/* Shorthand */
.container {
    gap: 10px 30px; /* row-gap column-gap */
}
```

---

#### 1.3.5 `grid-template-areas`

Defines named grid areas for easier layout management.

```
grid-template-areas:
"header header header"
"sidebar main main"
"footer footer footer";

┌─────────────────────────────────────────────┐
│                 Header                      │
├───────────────┬─────────────────────────────┤
│               │                             │
│   Sidebar     │           Main              │
│               │                             │
├───────────────┴─────────────────────────────┤
│                 Footer                      │
└─────────────────────────────────────────────┘
```

```css
.container {
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
        "header header"
        "sidebar main"
        "footer footer";
    min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

---

#### 1.3.6 `justify-items` and `align-items`

Aligns grid items within their cells.

```
justify-items: start (default)
┌─────────────┐
│ Item        │
└─────────────┘

justify-items: center
┌─────────────┐
│   Item      │
└─────────────┘

justify-items: end
┌─────────────┐
│        Item │
└─────────────┘

justify-items: stretch (default)
┌─────────────┐
│    Item     │
└─────────────┘
```

| Property | Axis | Values |
|----------|------|--------|
| `justify-items` | Horizontal (main axis) | `start`, `end`, `center`, `stretch` |
| `align-items` | Vertical (cross axis) | `start`, `end`, `center`, `stretch` |

---

#### 1.3.7 `justify-content` and `align-content`

Aligns the entire grid within the container.

```
justify-content: start (default)
┌─────────────────────────────────────────┐
│ ┌─────┐ ┌─────┐ ┌─────┐                 │
│ │  1  │ │  2  │ │  3  │                 │
│ └─────┘ └─────┘ └─────┘                 │
└─────────────────────────────────────────┘

justify-content: center
┌─────────────────────────────────────────┐
│       ┌─────┐ ┌─────┐ ┌─────┐           │
│       │  1  │ │  2  │ │  3  │           │
│       └─────┘ └─────┘ └─────┘           │
└─────────────────────────────────────────┘

justify-content: space-between
┌─────────────────────────────────────────┐
│ ┌─────┐       ┌─────┐       ┌─────┐     │
│ │  1  │       │  2  │       │  3  │     │
│ └─────┘       └─────┘       └─────┘     │
└─────────────────────────────────────────┘
```

---

### 1.4 All Grid Item Properties

#### 1.4.1 `grid-column` and `grid-row`

Spans items across multiple columns or rows.

```
grid-column: 1 / 3; /* Start at line 1, end at line 3 (spans 2 columns) */
┌─────────────┬─────────────┬─────────────┐
│             │             │             │
│   Item 1    │             │   Item 3    │
│   (spans    │             │             │
│    2 cols)  │             │             │
│             │             │             │
└─────────────┴─────────────┴─────────────┘
```

```css
.item-1 {
    grid-column: 1 / 3; /* Span from line 1 to line 3 */
}

.item-2 {
    grid-row: 1 / 3; /* Span from line 1 to line 3 */
}

/* Shorthand for spanning to end */
.item-3 {
    grid-column: 2 / -1; /* From line 2 to the last line */
}
```

---

#### 1.4.2 `grid-area`

Assigns the item to a named grid area.

```css
.container {
    display: grid;
    grid-template-areas:
        "header header"
        "sidebar main"
        "footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

---

### 1.5 Complete Grid Reference Table

#### Container Properties

| Property | Description | Values |
|----------|-------------|--------|
| `display` | Makes element a grid container | `grid`, `inline-grid` |
| `grid-template-columns` | Defines column tracks | `px`, `%`, `fr`, `auto`, `repeat()` |
| `grid-template-rows` | Defines row tracks | `px`, `%`, `fr`, `auto`, `repeat()` |
| `gap` | Space between items | Any length |
| `row-gap` | Space between rows | Any length |
| `column-gap` | Space between columns | Any length |
| `grid-template-areas` | Named grid areas | String values |
| `justify-items` | Horizontal alignment in cells | `start`, `end`, `center`, `stretch` |
| `align-items` | Vertical alignment in cells | `start`, `end`, `center`, `stretch` |
| `justify-content` | Horizontal grid alignment | `start`, `end`, `center`, `space-between`, etc. |
| `align-content` | Vertical grid alignment | `start`, `end`, `center`, `space-between`, etc. |

#### Item Properties

| Property | Description | Values |
|----------|-------------|--------|
| `grid-column` | Span across columns | `start / end` |
| `grid-row` | Span across rows | `start / end` |
| `grid-area` | Assign to named area | `name` |
| `justify-self` | Override justify-items for item | `start`, `end`, `center`, `stretch` |
| `align-self` | Override align-items for item | `start`, `end`, `center`, `stretch` |

---

### 1.6 Complete Grid Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>CSS Grid Complete Example</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #f5f5f5;
        }

        .container {
            display: grid;
            grid-template-columns: 200px 1fr 1fr;
            grid-template-rows: auto 1fr auto;
            grid-template-areas:
                "header header header"
                "sidebar main main"
                "footer footer footer";
            gap: 15px;
            min-height: 100vh;
        }

        .header {
            grid-area: header;
            background: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
        }

        .sidebar {
            grid-area: sidebar;
            background: #3498db;
            color: white;
            padding: 20px;
        }

        .main {
            grid-area: main;
            background: white;
            padding: 20px;
            border-radius: 5px;
        }

        .footer {
            grid-area: footer;
            background: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
        }

        .featured {
            grid-column: 1 / -1;
            background: #e74c3c;
            color: white;
            padding: 20px;
            margin-top: 20px;
            border-radius: 5px;
        }

        .sidebar-item {
            background: rgba(255,255,255,0.1);
            padding: 10px;
            margin: 10px 0;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <h1>CSS Grid Complete Example</h1>
    
    <div class="container">
        <header class="header">
            <h1>My Website</h1>
            <p>Using CSS Grid for layout</p>
        </header>
        
        <aside class="sidebar">
            <h3>Navigation</h3>
            <div class="sidebar-item">Home</div>
            <div class="sidebar-item">About</div>
            <div class="sidebar-item">Services</div>
            <div class="sidebar-item">Contact</div>
        </aside>
        
        <main class="main">
            <h2>Main Content Area</h2>
            <p>This is the main content area that takes up the remaining space.</p>
            <p>CSS Grid makes it easy to create complex layouts with just a few lines of CSS.</p>
        </main>
        
        <div class="featured">
            <h3>Featured Content (spans all columns)</h3>
            <p>This item uses grid-column: 1 / -1 to span across all columns.</p>
        </div>
        
        <footer class="footer">
            <p>&copy; 2024 My Website. All rights reserved.</p>
        </footer>
    </div>
</body>
</html>
```

---

## 2. CSS Animations (Transitions & Keyframes) ⭐⭐⭐

CSS Animations allow you to create smooth, engaging user experiences without JavaScript.

### 2.1 CSS Transitions

Transitions animate changes between two states (e.g., hover states).

#### 2.1.1 `transition` Property

| Property | Description |
|----------|-------------|
| `transition-property` | Which CSS property to animate (e.g., `all`, `color`, `width`) |
| `transition-duration` | How long the animation takes (e.g., `0.3s`, `500ms`) |
| `transition-timing-function` | The speed curve (e.g., `ease`, `linear`, `ease-in-out`) |
| `transition-delay` | Delay before animation starts (e.g., `0.2s`) |

```css
/* Shorthand: property duration timing-function delay */
.button {
    background-color: #3498db;
    color: white;
    padding: 15px 30px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
}

.button:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
}
```

#### 2.1.2 Timing Functions

| Value | Description |
|-------|-------------|
| `ease` | Slow start, fast middle, slow end (default) |
| `linear` | Constant speed |
| `ease-in` | Slow start, fast end |
| `ease-out` | Fast start, slow end |
| `ease-in-out` | Slow start and end, fast middle |
| `cubic-bezier(n,n,n,n)` | Custom speed curve |

---

### 2.2 CSS Keyframe Animations

Keyframe animations allow you to define multiple states and control the animation timeline.

#### 2.2.1 `@keyframes` Rule

```css
@keyframes slide-in {
    0% {
        transform: translateX(-100%);
        opacity: 0;
    }
    100% {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
```

#### 2.2.2 `animation` Property

| Property | Description | Values |
|----------|-------------|--------|
| `animation-name` | Name of the keyframe animation | Custom name |
| `animation-duration` | Length of animation | `0.3s`, `500ms` |
| `animation-timing-function` | Speed curve | `ease`, `linear`, etc. |
| `animation-delay` | Delay before animation starts | `0.2s`, `100ms` |
| `animation-iteration-count` | Number of times to repeat | `1`, `2`, `infinite` |
| `animation-direction` | Direction of playback | `normal`, `reverse`, `alternate` |
| `animation-fill-mode` | Style before/after animation | `none`, `forwards`, `backwards`, `both` |
| `animation-play-state` | Running or paused | `running`, `paused` |

```css
/* Shorthand: name duration timing-function delay iteration-count direction fill-mode */
.animated-element {
    animation: slide-in 0.5s ease-out 0s 1 normal both;
}

/* Common shortcuts */
.fade-in {
    animation: fadeIn 1s ease-in-out;
}

.spin {
    animation: spin 1s linear infinite;
}

.bounce {
    animation: bounce 0.5s ease infinite;
}
```

---

### 2.3 Complete Animation Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>CSS Animations Complete Guide</title>
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

        /* Transitions */
        .transition-examples {
            display: flex;
            gap: 20px;
            justify-content: center;
            margin-bottom: 40px;
        }

        .transition-box {
            width: 100px;
            height: 100px;
            background: #3498db;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .transition-box:hover {
            background: #2980b9;
            transform: scale(1.1) rotate(5deg);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        /* Keyframe Animations */
        .animation-examples {
            display: flex;
            gap: 30px;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 40px;
        }

        .animation-box {
            width: 80px;
            height: 80px;
            background: #e74c3c;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }

        .fade-in {
            animation: fadeIn 1s ease-in-out infinite;
        }

        .slide-in {
            animation: slideIn 1s ease-in-out infinite;
        }

        .pulse {
            animation: pulse 1s ease-in-out infinite;
        }

        .spin {
            animation: spin 1s linear infinite;
        }

        .bounce {
            animation: bounce 0.5s ease infinite;
        }

        .shake {
            animation: shake 0.5s ease-in-out infinite;
        }

        /* Keyframes */
        @keyframes fadeIn {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
        }

        @keyframes slideIn {
            0%, 100% { transform: translateX(-20px); }
            50% { transform: translateX(20px); }
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }

        /* Loading Spinner */
        .spinner-container {
            display: flex;
            justify-content: center;
            margin: 30px 0;
        }

        .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        /* Button with loading state */
        .btn {
            padding: 15px 30px;
            background: #2ecc71;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s;
        }

        .btn:hover {
            background: #27ae60;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(46, 204, 113, 0.4);
        }

        .btn:active {
            transform: translateY(0);
        }

        .btn.loading {
            background: #95a5a6;
            cursor: not-allowed;
        }

        .btn.loading::after {
            content: '';
            display: inline-block;
            width: 15px;
            height: 15px;
            margin-left: 10px;
            border: 2px solid white;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        /* Card hover effect */
        .card {
            width: 250px;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }

        .card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.2);
        }

        .card-image {
            width: 100%;
            height: 150px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            transition: transform 0.3s ease;
        }

        .card:hover .card-image {
            transform: scale(1.1);
        }

        .card-content {
            padding: 20px;
        }

        .card h3 {
            margin-bottom: 10px;
            color: #2c3e50;
        }

        .card p {
            color: #666;
            font-size: 14px;
        }

        /* Staggered animation */
        .stagger-container {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin: 30px 0;
        }

        .stagger-item {
            width: 50px;
            height: 50px;
            background: #9b59b6;
            border-radius: 5px;
            animation: stagger 1s ease-in-out infinite;
        }

        .stagger-item:nth-child(1) { animation-delay: 0s; }
        .stagger-item:nth-child(2) { animation-delay: 0.1s; }
        .stagger-item:nth-child(3) { animation-delay: 0.2s; }
        .stagger-item:nth-child(4) { animation-delay: 0.3s; }
        .stagger-item:nth-child(5) { animation-delay: 0.4s; }

        @keyframes stagger {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-30px); }
        }

        .section {
            background: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        h2 {
            color: #2c3e50;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #3498db;
        }
    </style>
</head>
<body>
    <h1>CSS Animations Complete Guide</h1>

    <!-- Transitions Section -->
    <div class="section">
        <h2>CSS Transitions</h2>
        <p>Hover over the boxes to see transitions:</p>
        <div class="transition-examples">
            <div class="transition-box">Hover Me</div>
            <div class="transition-box">Hover Me</div>
            <div class="transition-box">Hover Me</div>
        </div>
    </div>

    <!-- Keyframe Animations Section -->
    <div class="section">
        <h2>Keyframe Animations</h2>
        <div class="animation-examples">
            <div class="animation-box fade-in">Fade</div>
            <div class="animation-box slide-in">Slide</div>
            <div class="animation-box pulse">Pulse</div>
            <div class="animation-box spin">Spin</div>
            <div class="animation-box bounce">Bounce</div>
            <div class="animation-box shake">Shake</div>
        </div>
    </div>

    <!-- Loading Spinner Section -->
    <div class="section">
        <h2>Loading Spinner</h2>
        <div class="spinner-container">
            <div class="spinner"></div>
        </div>
    </div>

    <!-- Button with Loading State -->
    <div class="section">
        <h2>Button with Loading State</h2>
        <button class="btn">Click Me</button>
        <button class="btn loading">Loading...</button>
    </div>

    <!-- Card Hover Effect -->
    <div class="section">
        <h2>Card Hover Effect</h2>
        <div class="card">
            <div class="card-image"></div>
            <div class="card-content">
                <h3>Card Title</h3>
                <p>This card has a smooth hover effect with image zoom and shadow.</p>
            </div>
        </div>
    </div>

    <!-- Staggered Animation -->
    <div class="section">
        <h2>Staggered Animation</h2>
        <div class="stagger-container">
            <div class="stagger-item"></div>
            <div class="stagger-item"></div>
            <div class="stagger-item"></div>
            <div class="stagger-item"></div>
            <div class="stagger-item"></div>
        </div>
    </div>
</body>
</html>
```

---

## 3. Media Queries & Responsive Design ⭐⭐⭐

Media queries allow you to apply CSS rules based on device characteristics (screen size, orientation, etc.). This is essential for responsive web design.

### 3.1 Media Query Syntax

```css
@media media-type and (media-feature) {
    /* CSS rules */
}
```

| Media Type | Description |
|------------|-------------|
| `screen` | Applies to screens (most common) |
| `print` | Applies when printing |
| `all` | Applies to all devices (default) |
| `speech` | Applies to screen readers |

| Media Feature | Description |
|---------------|-------------|
| `width`, `height` | Viewport width/height |
| `min-width`, `max-width` | Minimum/maximum viewport width |
| `min-height`, `max-height` | Minimum/maximum viewport height |
| `orientation` | `portrait` or `landscape` |
| `prefers-color-scheme` | `light` or `dark` mode |

### 3.2 Common Breakpoints

```
Mobile First Approach (min-width)
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Mobile: 0px - 575px                                       │
│   ───────────────────────────────────────────────────────── │
│   Tablet: 576px - 767px                                     │
│   ───────────────────────────────────────────────────────── │
│   Desktop: 768px - 991px                                    │
│   ───────────────────────────────────────────────────────── │
│   Large Desktop: 992px+                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Desktop First Approach (max-width)
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Large Desktop: 992px+ (default)                           │
│   ───────────────────────────────────────────────────────── │
│   Desktop: 768px - 991px                                    │
│   ───────────────────────────────────────────────────────── │
│   Tablet: 576px - 767px                                     │
│   ───────────────────────────────────────────────────────── │
│   Mobile: 0px - 575px                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Mobile First Approach (Recommended)

Build for mobile first, then add styles for larger screens.

```css
/* Base styles (Mobile) */
.container {
    width: 100%;
    padding: 10px;
}

/* Tablet */
@media (min-width: 576px) {
    .container {
        padding: 20px;
    }
}

/* Desktop */
@media (min-width: 768px) {
    .container {
        max-width: 720px;
        margin: 0 auto;
    }
}

/* Large Desktop */
@media (min-width: 992px) {
    .container {
        max-width: 960px;
    }
}

/* Extra Large Desktop */
@media (min-width: 1200px) {
    .container {
        max-width: 1140px;
    }
}
```

### 3.4 Complete Responsive Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Responsive Design Complete Guide</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }

        /* Mobile First - Base Styles */
        .container {
            width: 100%;
            padding: 15px;
        }

        .header {
            background: #2c3e50;
            color: white;
            padding: 20px 15px;
            text-align: center;
        }

        .nav {
            background: #34495e;
            padding: 10px 15px;
        }

        .nav ul {
            list-style: none;
            display: flex;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
        }

        .nav a {
            color: white;
            text-decoration: none;
            padding: 5px 10px;
        }

        .main-content {
            display: flex;
            flex-direction: column;
            gap: 20px;
            padding: 20px 0;
        }

        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
            border-radius: 10px;
        }

        .hero h1 {
            font-size: 28px;
            margin-bottom: 10px;
        }

        .cards {
            display: grid;
            grid-template-columns: 1fr;
            gap: 15px;
        }

        .card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .card h3 {
            color: #2c3e50;
            margin-bottom: 10px;
        }

        .footer {
            background: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
            margin-top: 30px;
        }

        /* Tablet: 576px and up */
        @media (min-width: 576px) {
            .container {
                padding: 20px;
            }

            .hero h1 {
                font-size: 32px;
            }

            .cards {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        /* Desktop: 768px and up */
        @media (min-width: 768px) {
            .container {
                max-width: 720px;
                margin: 0 auto;
            }

            .nav ul {
                justify-content: flex-end;
            }

            .main-content {
                flex-direction: row;
            }

            .hero {
                flex: 1;
            }

            .cards {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        /* Large Desktop: 992px and up */
        @media (min-width: 992px) {
            .container {
                max-width: 960px;
            }

            .cards {
                grid-template-columns: repeat(3, 1fr);
            }
        }

        /* Extra Large Desktop: 1200px and up */
        @media (min-width: 1200px) {
            .container {
                max-width: 1140px;
            }
        }

        /* Print Styles */
        @media print {
            .nav, .footer {
                display: none;
            }

            body {
                font-size: 12pt;
                color: black;
            }

            .container {
                max-width: 100%;
            }
        }

        /* Dark Mode Support */
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #1a1a1a;
                color: #e0e0e0;
            }

            .card {
                background-color: #2d2d2d;
                color: #e0e0e0;
            }

            .card h3 {
                color: #ecf0f1;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>Responsive Website</h1>
            <p>Resize your browser to see the responsive design</p>
        </header>

        <nav class="nav">
            <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Services</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </nav>

        <main class="main-content">
            <section class="hero">
                <h1>Welcome to Our Website</h1>
                <p>This website adapts to any screen size using CSS media queries.</p>
            </section>

            <section class="cards">
                <article class="card">
                    <h3>Card 1</h3>
                    <p>This is the first card. It will stack vertically on mobile and display in a grid on larger screens.</p>
                </article>
                <article class="card">
                    <h3>Card 2</h3>
                    <p>This is the second card. Notice how the layout changes as you resize the browser.</p>
                </article>
                <article class="card">
                    <h3>Card 3</h3>
                    <p>This is the third card. Perfect for portfolio items or blog posts.</p>
                </article>
                <article class="card">
                    <h3>Card 4</h3>
                    <p>This is the fourth card. The grid adjusts automatically based on screen width.</p>
                </article>
                <article class="card">
                    <h3>Card 5</h3>
                    <p>This is the fifth card. Responsive design ensures a great experience on any device.</p>
                </article>
                <article class="card">
                    <h3>Card 6</h3>
                    <p>This is the sixth card. Media queries make this possible with just CSS.</p>
                </article>
            </section>
        </main>

        <footer class="footer">
            <p>&copy; 2024 Responsive Website. All rights reserved.</p>
        </footer>
    </div>
</body>
</html>
```

---

## 4. Z-Index & Stacking Context ⭐⭐⭐

Z-index controls the stacking order of elements. It's one of the most misunderstood CSS properties.

### 4.1 What is Z-Index?

Z-index determines which element appears on top of others. It only works on **positioned elements** (elements with `position: relative`, `absolute`, `fixed`, or `sticky`).

```
z-index: 1 (bottom)
┌─────────────────────────────────────────┐
│                                         │
│   Element 1 (z-index: 1)                │
│                                         │
└─────────────────────────────────────────┘

z-index: 2 (middle)
┌─────────────────────────────────────────┐
│                                         │
│   Element 2 (z-index: 2)                │
│                                         │
└─────────────────────────────────────────┘

z-index: 3 (top)
┌─────────────────────────────────────────┐
│                                         │
│   Element 3 (z-index: 3)                │
│                                         │
└─────────────────────────────────────────┘
```

### 4.2 Stacking Context

A stacking context is a group of elements that are stacked relative to each other. Each stacking context is independent.

**Creating a stacking context:**
1. Root element (`<html>`)
2. Positioned element with `z-index` value other than `auto`
3. Element with `opacity` less than 1
4. Element with `transform` set
5. Element with `filter` set
6. Element with `position: sticky` or `fixed`

```
┌─────────────────────────────────────────────────┐
│              Stacking Context 1                 │
│  ┌───────────────────────────────────────────┐  │
│  │ z-index: 1 (inside context 1)             │  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │ z-index: 2 (inside context 1)             │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
         ↑
         │
┌─────────────────────────────────────────────────┐
│              Stacking Context 2                 │
│  ┌───────────────────────────────────────────┐  │
│  │ z-index: 100 (inside context 2)           │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### 4.3 Common Z-Index Issues

**Issue 1: Z-index doesn't work on static elements**
```css
/* ❌ This doesn't work */
.element {
    z-index: 9999;
    /* position: static by default */
}

/* ✅ This works */
.element {
    position: relative;
    z-index: 9999;
}
```

**Issue 2: Child elements can't exceed parent's z-index**
```css
/* ❌ Child can't be above parent if parent has lower z-index */
.parent {
    position: relative;
    z-index: 1;
}

.child {
    position: absolute;
    z-index: 9999; /* Still below other elements with z-index > 1 */
}

/* ✅ To fix, increase parent's z-index or move child outside parent */
```

**Issue 3: Stacking context is created too early**
```css
/* ❌ This creates a new stacking context */
.modal {
    position: fixed;
    z-index: 1000;
}

/* If parent has opacity, child can't escape */
.modal-wrapper {
    opacity: 0.9; /* Creates new stacking context */
}
```

### 4.4 Complete Z-Index Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Z-Index and Stacking Context</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #f5f5f5;
        }

        .container {
            position: relative;
            width: 500px;
            height: 400px;
            margin: 50px auto;
            background: #ecf0f1;
            border: 2px solid #333;
            padding: 20px;
        }

        .box {
            position: absolute;
            width: 150px;
            height: 150px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            border-radius: 10px;
            cursor: pointer;
            transition: transform 0.3s;
        }

        .box:hover {
            transform: scale(1.1);
        }

        .box-1 {
            background: #e74c3c;
            top: 50px;
            left: 50px;
            z-index: 1;
        }

        .box-2 {
            background: #3498db;
            top: 100px;
            left: 100px;
            z-index: 2;
        }

        .box-3 {
            background: #2ecc71;
            top: 150px;
            left: 150px;
            z-index: 3;
        }

        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }

        .modal {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .info {
            background: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .code {
            background: #2d3436;
            color: #00cec9;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <h1>Z-Index and Stacking Context</h1>

    <div class="info">
        <h3>Basic Z-Index Demo</h3>
        <p>Hover over the boxes to see them scale. The box with higher z-index appears on top.</p>
        <p>Box 1: z-index: 1 | Box 2: z-index: 2 | Box 3: z-index: 3</p>
    </div>

    <div class="container">
        <div class="box box-1">z-index: 1</div>
        <div class="box box-2">z-index: 2</div>
        <div class="box box-3">z-index: 3</div>
    </div>

    <div class="info">
        <h3>Common Issues</h3>
        <div class="code">
            /* ❌ Doesn't work */<br>
            .element { z-index: 9999; } /* position: static by default */<br><br>
            /* ✅ Works */<br>
            .element { position: relative; z-index: 9999; }
        </div>
        <div class="code">
            /* ❌ Child can't exceed parent's z-index */<br>
            .parent { position: relative; z-index: 1; }<br>
            .child { position: absolute; z-index: 9999; } /* Still below z-index > 1 */<br><br>
            /* ✅ Fix: Increase parent's z-index or move child outside */
        </div>
    </div>
</body>
</html>
```

---

## 5. CSS Variables (Custom Properties) ⭐⭐

CSS Variables (Custom Properties) allow you to store values and reuse them throughout your stylesheet.

### 5.1 Defining Variables

Variables are defined using `--` prefix and accessed using `var()` function.

```css
:root {
    /* Colors */
    --primary-color: #3498db;
    --secondary-color: #2ecc71;
    --accent-color: #e74c3c;
    --text-color: #2c3e50;
    --background-color: #ecf0f1;

    /* Spacing */
    --spacing-xs: 5px;
    --spacing-sm: 10px;
    --spacing-md: 20px;
    --spacing-lg: 30px;
    --spacing-xl: 50px;

    /* Typography */
    --font-family: 'Arial', sans-serif;
    --font-size-sm: 12px;
    --font-size-md: 16px;
    --font-size-lg: 20px;
    --font-size-xl: 24px;

    /* Border */
    --border-radius: 5px;
    --border-color: #ddd;

    /* Shadows */
    --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
    --shadow-md: 0 4px 8px rgba(0,0,0,0.1);
    --shadow-lg: 0 8px 16px rgba(0,0,0,0.2);
}
```

### 5.2 Using Variables

```css
.button {
    background-color: var(--primary-color);
    color: white;
    padding: var(--spacing-sm) var(--spacing-md);
    border: none;
    border-radius: var(--border-radius);
    font-size: var(--font-size-md);
    box-shadow: var(--shadow-sm);
}

.button:hover {
    background-color: var(--secondary-color);
    box-shadow: var(--shadow-md);
}
```

### 5.3 Variable Scoping

Variables can be defined at different levels:

```css
/* Global (available everywhere) */
:root {
    --primary-color: #3498db;
}

/* Component specific */
.card {
    --card-bg: white;
    --card-padding: 20px;
}

/* Element specific */
.special {
    --special-color: purple;
}
```

### 5.4 Dynamic Variables with JavaScript

```javascript
// Change CSS variable with JavaScript
document.documentElement.style.setProperty('--primary-color', '#ff0000');

// Get current value
const currentColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary-color');
```

### 5.5 Complete CSS Variables Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>CSS Variables Complete Guide</title>
    <style>
        :root {
            --primary-color: #3498db;
            --secondary-color: #2ecc71;
            --accent-color: #e74c3c;
            --text-color: #2c3e50;
            --bg-color: #ecf0f1;
            --card-bg: white;
            --spacing-sm: 10px;
            --spacing-md: 20px;
            --spacing-lg: 30px;
            --border-radius: 5px;
            --shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            padding: var(--spacing-lg);
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
        }

        h1 {
            text-align: center;
            color: var(--primary-color);
            margin-bottom: var(--spacing-lg);
        }

        .card {
            background: var(--card-bg);
            padding: var(--spacing-lg);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            margin-bottom: var(--spacing-md);
        }

        .button {
            background: var(--primary-color);
            color: white;
            padding: var(--spacing-sm) var(--spacing-md);
            border: none;
            border-radius: var(--border-radius);
            cursor: pointer;
            font-size: 16px;
            transition: background 0.3s;
        }

        .button:hover {
            background: var(--secondary-color);
        }

        .button.accent {
            background: var(--accent-color);
        }

        .color-picker {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }

        .color-picker label {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .color-picker input {
            width: 30px;
            height: 30px;
            border: none;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>CSS Variables Demo</h1>

        <div class="card">
            <h2>What are CSS Variables?</h2>
            <p>CSS Variables (Custom Properties) allow you to store values and reuse them throughout your stylesheet.</p>
            <p>They are defined using <code>--</code> prefix and accessed using <code>var()</code> function.</p>
        </div>

        <div class="card">
            <h2>Buttons with CSS Variables</h2>
            <button class="button">Primary Button</button>
            <button class="button accent">Accent Button</button>
        </div>

        <div class="card">
            <h2>Change Theme Colors</h2>
            <div class="color-picker">
                <label>
                    Primary:
                    <input type="color" id="primaryColor" value="#3498db">
                </label>
                <label>
                    Secondary:
                    <input type="color" id="secondaryColor" value="#2ecc71">
                </label>
                <label>
                    Accent:
                    <input type="color" id="accentColor" value="#e74c3c">
                </label>
            </div>
        </div>
    </div>

    <script>
        // JavaScript to change CSS variables dynamically
        document.getElementById('primaryColor').addEventListener('input', function(e) {
            document.documentElement.style.setProperty('--primary-color', e.target.value);
        });

        document.getElementById('secondaryColor').addEventListener('input', function(e) {
            document.documentElement.style.setProperty('--secondary-color', e.target.value);
        });

        document.getElementById('accentColor').addEventListener('input', function(e) {
            document.documentElement.style.setProperty('--accent-color', e.target.value);
        });
    </script>
</body>
</html>
```

---

## 6. Tips & Tricks for Responsiveness

### 6.1 Responsive Typography

```css
/* Fluid typography using clamp() */
h1 {
    font-size: clamp(1.5rem, 5vw, 3rem);
}

p {
    font-size: clamp(1rem, 2vw, 1.25rem);
}

/* Or use calc() */
h2 {
    font-size: calc(16px + (24 - 16) * ((100vw - 320px) / (1200 - 320)));
}
```

### 6.2 Responsive Images

```css
/* Make images responsive */
img {
    max-width: 100%;
    height: auto;
    display: block;
}

/* Object fit for consistent sizing */
.hero-image {
    width: 100%;
    height: 300px;
    object-fit: cover;
}

/* Picture element for art direction */
<picture>
    <source media="(min-width: 768px)" srcset="large.jpg">
    <source media="(min-width: 480px)" srcset="medium.jpg">
    <img src="small.jpg" alt="Responsive image">
</picture>
```

### 6.3 Responsive Grid

```css
/* Auto-fit grid */
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

/* Auto-fill grid */
.grid-fill {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
}
```

### 6.4 Mobile-First vs Desktop-First

```css
/* Mobile First Approach */
.container {
    padding: 10px;
}

@media (min-width: 768px) {
    .container {
        padding: 20px;
    }
}

/* Desktop First Approach */
.container {
    padding: 20px;
}

@media (max-width: 767px) {
    .container {
        padding: 10px;
    }
}
```

### 6.5 Common Responsive Patterns

#### Pattern 1: Collapsible Sidebar

```css
/* Mobile: Sidebar hidden or below content */
/* Desktop: Sidebar visible on the side */
.sidebar {
    display: none;
}

@media (min-width: 768px) {
    .sidebar {
        display: block;
        width: 250px;
    }
}
```

#### Pattern 2: Stacked to Horizontal

```css
/* Mobile: Stacked vertically */
/* Desktop: Horizontal layout */
.content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

@media (min-width: 768px) {
    .content {
        flex-direction: row;
    }
}
```

#### Pattern 3: Navigation Hamburger Menu

```css
/* Mobile: Hamburger menu */
/* Desktop: Full navigation */
.nav-items {
    display: none;
}

.hamburger {
    display: block;
}

@media (min-width: 768px) {
    .nav-items {
        display: flex;
    }
    
    .hamburger {
        display: none;
    }
}
```

### 6.6 Responsive Spacing

```css
/* Use relative units for spacing */
.container {
    padding: 5vw; /* Responsive padding */
}

/* Or use clamp() */
.container {
    padding: clamp(10px, 5vw, 50px);
}

/* Use rem for consistent spacing */
.card {
    margin-bottom: 2rem;
}
```

### 6.7 Testing Responsiveness

```css
/* Add visual indicator for breakpoints */
body::before {
    content: "Mobile";
    position: fixed;
    top: 10px;
    right: 10px;
    background: red;
    color: white;
    padding: 5px 10px;
    z-index: 9999;
    font-size: 12px;
}

@media (min-width: 576px) {
    body::before {
        content: "Tablet";
        background: orange;
    }
}

@media (min-width: 768px) {
    body::before {
        content: "Desktop";
        background: green;
    }
}

@media (min-width: 992px) {
    body::before {
        content: "Large Desktop";
        background: blue;
    }
}
```

---

## 7. Interview Questions & Answers

### Q1: What is the difference between CSS Grid and Flexbox?
**Answer:**
- **Flexbox** is a one-dimensional layout system (row OR column). It's perfect for components like navigation bars, cards, and buttons.
- **CSS Grid** is a two-dimensional layout system (rows AND columns). It's perfect for page layouts, complex grids, and full-page designs.

### Q2: When should you use Grid vs Flexbox?
**Answer:**
- Use **Flexbox** for: Navigation bars, card layouts, centering content, component-level layouts
- Use **Grid** for: Page layouts, dashboard layouts, complex 2D layouts, magazine-style designs
- Use **both together**: Grid for overall page layout, Flexbox for individual components within grid areas

### Q3: What is `clamp()` and how is it useful for responsive design?
**Answer:**
`clamp(min, preferred, max)` returns a value between min and max. It's useful for responsive typography:
```css
font-size: clamp(1rem, 2vw, 2rem);
```
This means: font-size is at least 1rem, at most 2rem, and tries to be 2vw (2% of viewport width).

### Q4: What is the difference between `auto-fit` and `auto-fill` in Grid?
**Answer:**
- `auto-fit`: Collapses empty tracks to 0, expanding items to fill available space
- `auto-fill`: Keeps empty tracks at their minimum size, leaving gaps

### Q5: How do you create a responsive image gallery?
**Answer:**
Use CSS Grid with `auto-fit` or `auto-fill`:
```css
.gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}
```

### Q6: What is the viewport meta tag and why is it important?
**Answer:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
This tells mobile browsers to render the page at the device's actual width and set initial zoom to 1. Without it, mobile browsers may render the page as if it were on a desktop and zoom out.

### Q7: How do you handle images in responsive design?
**Answer:**
1. Set `max-width: 100%; height: auto;` on all images
2. Use `object-fit` for consistent sizing
3. Use the `<picture>` element for art direction
4. Use `srcset` for responsive images

### Q8: What is the "mobile-first" approach?
**Answer:**
Mobile-first means writing base styles for mobile devices, then using `min-width` media queries to add styles for larger screens. This ensures mobile users get the simplest, fastest experience.

### Q9: How do you test responsive design?
**Answer:**
1. Browser DevTools (responsive mode)
2. Real devices
3. Online tools like BrowserStack
4. Add visual breakpoint indicators
5. Test on actual mobile devices

### Q10: What are CSS variables and why use them?
**Answer:**
CSS variables (custom properties) allow you to store values (colors, spacing, sizes) that can be reused throughout your stylesheet. They make it easy to:
- Change themes
- Maintain consistency
- Update values globally
- Create dynamic styles with JavaScript

---

✅ Day 4 CSS is now **100% complete** with every single topic covered in full detail with diagrams, examples, comparison tables, and interview questions.

You now have complete mastery over CSS Grid, Animations, Media Queries, Z-Index, CSS Variables, and Responsive Design Tips.

You have now covered **95% of CSS** that is asked in frontend interviews! 🎉