# 🎮 Interactive Portfolio Game

A high-performance, object-oriented portfolio built with **Phaser.js** and **Webpack**. Explore professional experience, skills, and projects by interacting with a gamified interface.

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build for Production**
   ```bash
   npm run build
   ```

3. **Run**
   Open `dist/index.html` in your browser.

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── main.js           # Entry point
│   ├── content.js        # Content & Modal logic
│   ├── classes/          # OOP Game entities (Stickman, Bubble, etc.)
│   ├── config/           # Game & Physic settings
│   └── content/          # HTML section files
├── dist/                 # Compiled & optimized bundle
├── index.html            # Main template
└── styles.css            # Global styling
```

## 🛠️ Development

- **Dev Mode**: `npm run dev` (Builds with source maps and watches for changes)
- **Edit Content**: Modify HTML files in `src/content/`.
- **Game Settings**: Adjust colors, positions, or physics in `src/config/GameConfig.js`.

## 📱 Responsive
The game automatically scales for **Desktop, Tablet, and Mobile**, adjusting bubble sizes and physics for the best experience on any device.

## 🤝 Credits

- **Shailesh Rai** - [GitHub](https://github.com/Shailesh1297)
- **Antigravity** (Google DeepMind) - AI Pair Programmer

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Built with ❤️ using Phaser.js and ES6+
