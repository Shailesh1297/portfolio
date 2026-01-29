import Phaser from 'phaser';
import { GameConfig } from './config/GameConfig.js';
import { GameScene } from './classes/GameScene.js';

/**
 * Main Game Entry Point
 * Initializes and starts the Phaser game
 */
class PortfolioGame {
    constructor() {
        this.game = null;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    start() {
        console.log('Starting Portfolio Game...');

        // Get Phaser configuration
        const config = GameConfig.getPhaserConfig();

        // Add the game scene
        config.scene = GameScene;

        // Create game instance
        this.game = new Phaser.Game(config);

        // Hide loading screen
        this.hideLoadingScreen();

        // Store game instance globally for debugging
        window.portfolioGame = this;
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, 500);
    }

    destroy() {
        if (this.game) {
            this.game.destroy(true);
        }
    }
}

// Initialize the game
new PortfolioGame();
