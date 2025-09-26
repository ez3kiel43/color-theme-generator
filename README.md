# 🎨 Accessible Color Palette Generator

A simple web app (written in **TypeScript + vanilla JS**) that generates an **accessible color palette** from a base color.  
It checks contrast ratios against [WCAG standards](https://www.w3.org/WAI/WCAG2AA-Conformance) and lets users tweak the results interactively.

---

## ✨ Features
- Generate a palette starting from a single base color.
- Automatically ensure color contrast meets accessibility guidelines.
- Live preview with swatches.
- Adjust colors and re-check accessibility.
- Offline support with `localStorage` (planned).

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm or yarn

### Install & Run

# Start the dev server
npm run dev
Then open [Local Host](http://localhost:5173) in your browser.

## 🛠️ Tech Stack
 - **TypeScript** – type safety and modern ES features
 - **Vite** – lightning-fast dev server
 - **Vanilla JS/DOM APIs** – no frameworks

## 📚 Roadmap
 - Allow user to input a custom base color
 - WCAG contrast checking
 - Save Palettes offline
 - Export Palettes to JSON/CSS variables

## 🤝 Contributing

Contributions are welcome!
If you’d like to help:
 1. Fork this repo
 2. Create a new branch (git checkout -b feature-name)
 3. Commit changes (git commit -m "Add feature X")
 4. Push the branch (git push origin feature-name)
 5. Open a pull request

## 📄License
MIT License – feel free to use and modify for your own projects.
