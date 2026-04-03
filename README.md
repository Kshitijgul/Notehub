# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




#COMPLETE STARTING 

# Notes Website
A full-stack notes viewer built with **React + Vite** on the frontend and **Node.js + Express + WebSocket** on the backend.
It shows Markdown notes in a **VS Code-style UI**, supports **Mermaid diagrams**, **code highlighting**, **GitHub-flavored Markdown**, and can load notes either from:
1. a **local Content folder**
2. a **GitHub repository**
---
## Table of Contents
1. [Project Goal](#project-goal)
2. [How the Project Works at High Level](#how-the-project-works-at-high-level)
3. [Architecture Diagram](#architecture-diagram)
4. [Current Project Structure](#current-project-structure)
5. [Build This Project From Scratch - Flow](#build-this-project-from-scratch---flow)
6. [File-by-File Explanation](#file-by-file-explanation)
7. [Frontend Concepts](#frontend-concepts)
8. [Backend Concepts](#backend-concepts)
9. [Markdown Rendering Pipeline](#markdown-rendering-pipeline)
10. [How GitHub Mode Works](#how-github-mode-works)
11. [How to Run the Project](#how-to-run-the-project)
12. [Packages Used and Why](#packages-used-and-why)
13. [Common Problems and Fixes](#common-problems-and-fixes)
14. [How to Explain This Project in an Interview](#how-to-explain-this-project-in-an-interview)
15. [Future Enhancements](#future-enhancements)
---
## Project Goal
The goal of this project is to build a **developer-style notes website** where notes are written in `.md` files and displayed in a professional UI.
### Main requirements this project solves
- Read markdown files from a structured folder
- Show folders and files in a sidebar
- Open notes in tabs
- Render markdown beautifully
- Support code blocks
- Support Mermaid diagrams like flowcharts
- Auto-refresh when content changes
- Support storing notes locally or on GitHub
---
## How the Project Works at High Level
This project has **2 main parts**:
### 1. Frontend
Built in **React**.
Its job is to:
- show the explorer/sidebar
- show tabs
- show the selected markdown file
- connect to the backend
- update UI when notes change
### 2. Backend
Built in **Node.js + Express**.
Its job is to:
- give the frontend the file tree
- give the frontend file content
- notify frontend when content changes
- fetch notes either from local folder or GitHub repo
---
## Architecture Diagram
### Overall Architecture
```text
┌─────────────────────────────────────────────────────────────────────┐
│                            FRONTEND                                │
│                      React + Vite Application                      │
│                                                                     │
│  ┌──────────────┐   ┌──────────────┐   ┌─────────────────────────┐  │
│  │   Sidebar    │   │   Tab Bar    │   │   Markdown Renderer     │  │
│  │ Folder Tree  │   │ Open Files   │   │ Markdown / Code / SVG   │  │
│  └──────┬───────┘   └──────┬───────┘   └────────────┬────────────┘  │
│         │                  │                        │               │
│         └──────────────────┴──────────────┬─────────┘               │
│                                           │                         │
│                                 useContentWatcher Hook              │
│                                           │                         │
└───────────────────────────────────────────┼─────────────────────────┘
                                            │
                  HTTP API + WebSocket      │
                                            │
┌───────────────────────────────────────────┼─────────────────────────┐
│                            BACKEND                                 │
│                    Node.js + Express + WS                          │
│                                                                     │
│   ┌──────────────────────┐      ┌───────────────────────────────┐   │
│   │      REST API        │      │       WebSocket Server        │   │
│   │   /api/tree          │      │  sends TREE_UPDATED etc.      │   │
│   │   /api/file          │      │                               │   │
│   └──────────┬───────────┘      └───────────────┬───────────────┘   │
│              │                                  │                   │
│              └──────────────────┬───────────────┘                   │
│                                 │                                   │
│                      Content Source Layer                           │
│                                 │                                   │
│               ┌─────────────────┴─────────────────┐                 │
│               │                                   │                 │
│      Local Folder Mode                    GitHub Repo Mode         │
│      public/Content/                      owner/repo branch        │
│      fs / chokidar                        Octokit API + polling    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```
### Request Flow
```text
User clicks markdown file
        ↓
React calls fetchFile(path)
        ↓
Frontend requests GET /api/file?path=...
        ↓
Backend reads file content
   ├─ from local folder OR
   └─ from GitHub repo
        ↓
Backend returns markdown text
        ↓
React stores content in cache
        ↓
MarkdownRenderer converts markdown → HTML/UI
        ↓
User sees rendered note
```
### Update Flow
```text
Note changes in source
        ↓
Backend detects change
   ├─ local: file watcher
   └─ GitHub: polling compare
        ↓
Backend broadcasts WebSocket event
        ↓
useContentWatcher receives event
        ↓
React updates tree/file cache
        ↓
UI refreshes automatically
```
---
## Current Project Structure
```text
my-learn/
├── public/
│   └── Content/
│       ├── CSS/
│       ├── HTML/
│       ├── JAVA/
│       └── Javascript/
│
├── server/
│   └── index.js
│
├── src/
│   ├── components/
│   │   └── MarkdownRenderer.jsx
│   ├── hooks/
│   │   └── useContentWatcher.js
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── markdown.css
│   └── markdown-mermaid.css
│
├── .env.example
├── index.html
├── package.json
├── vite.config.js
└── README.md
```
> Note: You also mentioned a separate `Backend/server.js` GitHub-specific server in your local setup. This README explains the architecture in a way that supports both local and GitHub source modes.
---
## Build This Project From Scratch - Flow
If you want to build this project again from zero, follow this order.
---
### Step 1: Create frontend app
Create a React project using Vite.
What we need first:
- `index.html`
- `src/main.jsx`
- `src/App.jsx`
At this stage, app can just show a simple page.
---
### Step 2: Design the app layout
Before loading real files, design the UI structure.
Main sections:
- left activity bar
- sidebar explorer
- top tab bar
- breadcrumb bar
- content viewer
- bottom status bar
This is all handled mainly in **`src/App.jsx`**.
---
### Step 3: Create a backend server
Create an Express backend.
Initial responsibilities:
- return file tree
- return file content
Endpoints:
- `GET /api/tree`
- `GET /api/file?path=...`
This is handled by **`server/index.js`**.
---
### Step 4: Connect frontend to backend
Frontend needs a reusable way to:
- fetch file tree
- fetch content
- connect WebSocket
- reconnect when connection breaks
So we create a custom React hook:
- **`src/hooks/useContentWatcher.js`**
This is the communication layer between frontend and backend.
---
### Step 5: Render markdown
Now backend gives markdown text, but React still needs to render it as formatted output.
So we create:
- **`src/components/MarkdownRenderer.jsx`**
This file converts raw markdown into rendered UI.
It also adds support for:
- GitHub-flavored markdown
- raw HTML in markdown
- heading IDs
- syntax-highlighted code blocks
- Mermaid diagrams
---
### Step 6: Add real-time updates
To avoid manual refresh:
- backend sends WebSocket messages
- frontend listens and updates state
This makes the app feel live.
---
### Step 7: Add caching and better UX
Improve frontend with:
- file content cache
- loading states
- toast notifications
- connection status
- file search
- tabs
- breadcrumbs
This is mostly implemented in **`src/App.jsx`** and **`src/hooks/useContentWatcher.js`**.
---
### Step 8: Add GitHub mode
If notes are moved from local folder to GitHub:
- backend fetches tree from GitHub API
- backend fetches markdown content from GitHub
- frontend remains almost unchanged
This is a strong design because the frontend depends only on the backend API, not directly on the source of data.
---
## File-by-File Explanation
## 1. `index.html`
### Purpose
This is the root HTML page where the React app mounts.
### Important logic
- creates `<div id="root"></div>`
- loads `src/main.jsx`
- sets page title
### Why it matters
Without this file, React has no HTML container to render into.
---
## 2. `src/main.jsx`
### Purpose
This is the React entry point.
### What it does
- imports React
- imports ReactDOM
- imports global CSS
- renders `<App />` into `#root`
### Why it matters
This is the bridge between plain HTML and your React application.
---
## 3. `src/App.jsx`
### Purpose
This is the **main UI file**.
It controls almost the entire screen layout and user interaction.
### Main responsibilities
- render the VS Code-like interface
- show sidebar file tree
- show tabs for opened files
- show selected markdown note
- manage search
- manage selected file
- manage expanded folders
- manage active tab
- show toast notifications
- show live connection status
### Main React states in this file
- `sidebarOpen` → whether sidebar is visible
- `expandedIds` → which folders are expanded
- `selectedId` → which file is selected in explorer
- `tabs` → list of currently opened files
- `activeTab` → current open tab
- `searchQuery` → search text in sidebar
- `activeContent` → markdown content of selected file
- `loadingFile` → loading spinner state
- `toast` → live event toast message
### Important helper functions inside this file
#### `flattenFiles(nodes)`
Converts nested folder tree into a flat list of files.
Used for:
- search
- quick open cards
- total file count
#### `findPath(nodes, targetId)`
Finds breadcrumb path for selected file.
Example:
```text
JAVA > DSA_in_Java.md
```
#### `handleSelectFile(node)`
When user clicks a file:
1. select file
2. add tab if not already open
3. make it active
4. fetch content from backend
5. display content
#### `handleSwitchTab(node)`
When user changes tab:
- switch active tab
- restore cached content if available
- otherwise fetch file again
#### `handleCloseTab(id)`
When user closes a tab:
- remove tab
- if closed tab was active, select next suitable tab
#### `handleToggleFolder(id)`
Expand/collapse folder in explorer.
### Components defined inside `App.jsx`
- icon components
- `StatusDot`
- `Toast`
- `TreeNode`
### Why `TreeNode` is important
This is a recursive component.
That means a folder can render its children, and children can render their children.
This is how nested file explorers are built.
---
## 4. `src/hooks/useContentWatcher.js`
### Purpose
This file centralizes all backend communication logic.
### Why we use a custom hook
Instead of writing fetch/WebSocket logic directly inside `App.jsx`, we keep it separate.
Benefits:
- cleaner `App.jsx`
- reusable logic
- easier testing and maintenance
### Main responsibilities
- connect to backend WebSocket
- fetch initial file tree
- fetch markdown file content
- cache file content
- reconnect on disconnect
- receive live update messages
### Main state stored in the hook
- `tree`
- `fileCache`
- `status`
- `lastEvent`
### Important functions
#### `fetchTree()`
Calls:
```text
GET /api/tree
```
Stores returned tree in React state.
#### `fetchFile(filePath)`
Calls:
```text
GET /api/file?path=...
```
If file content already exists in cache, it returns cached data.
This reduces repeated network requests.
#### `connect()`
Creates WebSocket connection.
Handles:
- `onopen`
- `onmessage`
- `onclose`
- `onerror`
### WebSocket messages handled
- `FILE_ADDED`
- `FILE_CHANGED`
- `FILE_DELETED`
- `DIR_ADDED`
- `DIR_DELETED`
- `TREE_UPDATED`
### Why this hook is important architecturally
It acts like a **data controller** for the frontend.
`App.jsx` focuses on UI.
`useContentWatcher.js` focuses on data flow.
That separation is very important in real projects.
---
## 5. `src/components/MarkdownRenderer.jsx`
### Purpose
This file converts raw markdown text into rich rendered content.
### Main responsibilities
- render markdown headings, lists, tables, links
- support GFM tables/checklists
- render inline HTML from markdown
- generate heading IDs
- render syntax-highlighted code blocks
- detect Mermaid diagrams and render them
- support internal links like `#section-name`
### Main parts inside this file
#### A. `loadMermaid()`
Loads Mermaid library dynamically from CDN.
### Why load from CDN instead of bundling?
Because Mermaid is large.
If bundled directly, build size becomes much heavier.
#### B. `MermaidDiagram`
This is a React component that:
1. receives Mermaid text
2. asks Mermaid to render SVG
3. stores generated SVG
4. displays loading/error state if needed
#### C. `remarkMermaid`
Custom plugin that scans markdown code blocks.
It checks if the block looks like Mermaid syntax.
Example patterns:
- `flowchart`
- `graph`
- `sequenceDiagram`
- `%%{init: ... }%%`
If detected, it marks the code block as Mermaid.
#### D. `handleLinkClick()`
Handles internal hash links like:
```md
[Go to Top](#top)
```
Instead of full page reload, it smoothly scrolls to that heading.
#### E. Custom `code` renderer
When markdown contains code block:
- if it is Mermaid → render diagram
- else if it has language → syntax highlight
- else → plain code block
### Why this file is important
Without this file, notes would only show as plain text.
This file is responsible for the rich documentation-like reading experience.
---
## 6. `src/index.css`
### Purpose
Global styles for the app.
### Typical role
- Tailwind/base imports if used
- root styling
- animations
- common UI look
---
## 7. `src/markdown.css`
### Purpose
Styles normal markdown output.
Examples:
- headings
- tables
- paragraphs
- code blocks
- blockquotes
- links
This makes markdown look polished and readable.
---
## 8. `src/markdown-mermaid.css`
### Purpose
Styles Mermaid-specific output.
Examples:
- diagram container
- loading state
- error message box
- SVG overflow handling
---
## 9. `server/index.js`
### Purpose
This is the backend server.
### Main responsibilities
- create Express server
- expose APIs for tree and file content
- start WebSocket server
- fetch markdown source from GitHub
- periodically check for content changes
- notify all connected clients
### Main sections inside the file
#### A. Environment config
Reads:
- `GITHUB_TOKEN`
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH`
- `GITHUB_CONTENT_PATH`
- `PORT`
#### B. `ensureConfig()`
Checks required GitHub environment variables exist.
#### C. `getGithubContent(targetPath)`
Makes GitHub API request using Octokit.
This is the low-level GitHub fetch function.
#### D. `buildGithubTree(relativePath)`
Recursively reads GitHub folders and returns app-friendly tree structure.
This is similar to local file recursion, but instead of `fs.readdir`, it uses GitHub API.
#### E. `readMarkdownFile(relativePath)`
Fetches specific markdown file from GitHub.
If GitHub returns base64 content, it decodes it.
#### F. `/api/tree`
Returns full tree to frontend.
#### G. `/api/file`
Returns markdown content of one file.
#### H. WebSocket setup
Stores clients in a `Set` and broadcasts updates.
#### I. `pollGithubTree()`
Checks GitHub content every 30 seconds.
How it works:
1. fetch latest tree
2. convert tree to JSON string
3. compare with previous version
4. if different, broadcast `TREE_UPDATED`
### Why this backend design is good
Because frontend does not care whether source is:
- local folder
- GitHub repo
- future database
Frontend only depends on the same API contract.
That is a clean architecture decision.
---
## Frontend Concepts
### 1. Component-based UI
The UI is split into logical pieces.
Even if some helper components live inside `App.jsx`, they still behave like isolated view units.
### 2. State management with hooks
Using `useState`, `useEffect`, `useCallback`, `useRef`.
### 3. Recursive rendering
The explorer tree uses recursion to render nested folders.
### 4. Derived data
Examples:
- breadcrumb from tree
- filtered files from search query
- active node from active tab
### 5. Caching
File content is cached in `fileCache` so repeated tab switching is fast.
### 6. Real-time UI sync
WebSocket events update frontend state without refresh.
---
## Backend Concepts
### 1. REST API
Simple endpoints for:
- tree
- file content
### 2. WebSocket
Used for push-based updates.
Why not only HTTP?
Because HTTP alone would require repeated polling from frontend.
WebSocket allows backend to push changes immediately or near-immediately.
### 3. Recursive traversal
Used to build nested tree structures from directories or GitHub repo contents.
### 4. Environment variables
Used to keep secrets/config outside code.
### 5. Adapter thinking
Current backend acts like an adapter between frontend and content source.
Today source = GitHub.
Tomorrow source can be local files, Google Drive, S3, database, CMS.
---
## Markdown Rendering Pipeline
Here is the rendering flow inside `MarkdownRenderer.jsx`:
```text
Raw markdown text
      ↓
ReactMarkdown
      ↓
remark-gfm
      ↓
remarkMermaid custom detection
      ↓
rehype-raw
      ↓
rehype-slug
      ↓
Custom code/link renderers
      ↓
Final UI
```
### What each layer does
#### `react-markdown`
Base markdown renderer.
#### `remark-gfm`
Adds GitHub Flavored Markdown support:
- tables
- task lists
- strikethrough
#### `remarkMermaid`
Custom logic to detect Mermaid blocks.
#### `rehype-raw`
Allows raw HTML inside markdown.
Example:
```html
<a id="top"></a>
```
#### `rehype-slug`
Automatically adds `id` to headings.
Example:
```md
## My Heading
```
becomes targetable by:
```md
[Go](#my-heading)
```
#### custom `code` renderer
Determines whether block is:
- Mermaid
- syntax-highlighted code
- plain code
---
## How GitHub Mode Works
In GitHub mode, notes are stored in a GitHub repository.
### Example repo structure
```text
Notes/
├── CSS/
├── HTML/
├── JAVA/
└── Javascript/
```
### Important env variables
```env
GITHUB_TOKEN=your_token
GITHUB_OWNER=your_username
GITHUB_REPO=Notes
GITHUB_BRANCH=main
GITHUB_CONTENT_PATH=
PORT=3001
```
### Why `GITHUB_CONTENT_PATH` can be empty
If your folders are directly at repo root, then path is empty.
If repo looked like this:
```text
repo/
└── Content/
    ├── CSS/
```
then:
```env
GITHUB_CONTENT_PATH=Content
```
### GitHub update detection
Since GitHub is remote, backend cannot use local filesystem watcher directly.
So current strategy is:
- poll GitHub tree every 30 seconds
- compare with previous tree
- if changed, broadcast `TREE_UPDATED`
---
## How to Run the Project
## Install dependencies
```bash
npm install
```
## Create environment file
Create `.env` in root:
```env
GITHUB_TOKEN=your_token_here
GITHUB_OWNER=your_username
GITHUB_REPO=your_repo_name
GITHUB_BRANCH=main
GITHUB_CONTENT_PATH=
PORT=3001
```
## Run backend
```bash
node server/index.js
```
## Run frontend
```bash
npm run dev
```
---
## Packages Used and Why
### Frontend
#### `react`, `react-dom`
Core React app.
#### `react-markdown`
Renders markdown content.
#### `remark-gfm`
Adds GitHub flavored markdown support.
#### `rehype-raw`
Allows HTML inside markdown.
#### `rehype-slug`
Adds IDs to headings.
#### `react-syntax-highlighter`
Renders code blocks beautifully.
#### `lucide-react`
Useful icon package.
### Backend
#### `express`
Creates backend server and APIs.
#### `ws`
WebSocket server for live updates.
#### `cors`
Allows frontend and backend to communicate across ports.
#### `dotenv`
Loads environment variables from `.env`.
#### `@octokit/rest`
Official GitHub API SDK.
### Styling / Build
#### `vite`
Frontend dev server and bundler.
#### `tailwindcss`
Utility-first CSS support.
---
## Common Problems and Fixes
### Problem: GitHub repo returns 404
Check:
- owner name
- repo name
- branch name
- token permissions
### Problem: Mermaid not rendering
Check if the markdown block is valid Mermaid syntax.
### Problem: internal links not working
Need `rehype-slug` and proper heading IDs.
### Problem: frontend says disconnected
Check backend is running on correct port.
### Problem: tree not loading
Check `/api/tree` works in browser or Postman.
---
## How to Explain This Project in an Interview
You can explain it like this:
> This is a full-stack notes viewer where notes are written as Markdown files and displayed in a VS Code-like interface. The frontend is built in React and the backend is built in Node.js with Express. The frontend does not directly access files. Instead, it talks to a backend API that provides a file tree and file content. The backend can use different content sources, such as a local folder or a GitHub repository. For real-time updates, the backend uses WebSockets to notify the frontend when content changes. Markdown is rendered using react-markdown with plugins for GitHub-flavored markdown, raw HTML, heading IDs, syntax highlighting, and Mermaid diagrams.
### Strong architecture point
A very good interview point is this:
> I designed the frontend to depend only on API contracts, not on the storage source. So I could move content from local files to GitHub without rewriting the UI.
### If interviewer asks “what is the hardest part?”
Good answer:
- keeping the UI responsive while loading files
- handling recursive folder rendering
- supporting Mermaid and internal markdown links correctly
- moving from local filesystem to GitHub source cleanly
---
## Future Enhancements
This project can be improved a lot in the future.
### 1. GitHub Webhooks
Instead of polling every 30 seconds, GitHub can call a webhook instantly when repo changes.
### 2. Full-text search
Search inside note content, not just filenames.
### 3. Authentication
Allow private personal notes with login.
### 4. Note metadata
Support frontmatter like:
```md
---
title: Java Basics
tags: [java, basics]
level: beginner
---
```
### 5. Tags and categories
Filter notes by topic, tags, difficulty.
### 6. Recent notes / favorites
Add note bookmarking and recent history.
### 7. Edit mode
Add markdown editor inside app.
### 8. GitHub webhook live updates
Instant repo sync without polling.
### 9. Image and asset support
Better relative image support from GitHub and local sources.
### 10. Theme switching
Add light theme and custom themes.
### 11. Mobile layout improvements
Improve sidebar and reading experience on smaller screens.
### 12. Search indexing
Pre-index markdown for faster content search.
### 13. Table of contents panel
Auto-generate note outline from headings.
### 14. Multi-source support
Add Google Drive, S3, database, Notion, or CMS adapters.
### 15. Offline mode
Cache notes using service workers for offline reading.
---
## Final Summary
This project is a strong example of a **real-world full-stack application** because it includes:
- frontend UI architecture
- backend API design
- real-time communication
- recursive data structures
- markdown rendering pipeline
- external API integration with GitHub
- future-friendly architecture
If you continue improving this project with search, auth, metadata, and webhook-based syncing, it can become a very strong portfolio project.