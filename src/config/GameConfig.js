import Phaser from 'phaser';

/**
 * Game Configuration
 * Contains all configuration settings for the Phaser game
 */
export class GameConfig {
    static getPhaserConfig() {
        return {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: 'phaser-game',
            backgroundColor: 'transparent',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: '100%',
                height: '100%'
            },
            input: {
                activePointers: 3, // Support multi-touch
                touch: true,
                mouse: true
            }
        };
    }

    static getBalloonData() {
        return [
            { key: 'about', color: 0x6366f1, x: 0.2, y: 0.3 },
            { key: 'skills', color: 0xec4899, x: 0.4, y: 0.25 },
            { key: 'projects', color: 0x8b5cf6, x: 0.5, y: 0.35 },
            { key: 'experience', color: 0x14b8a6, x: 0.6, y: 0.28 },
            { key: 'contact', color: 0xf59e0b, x: 0.8, y: 0.32 }
        ];
    }

    static getResponsiveBubbleRadius(screenWidth) {
        if (screenWidth < 480) return 45; // Small phones
        if (screenWidth < 768) return 55; // Tablets
        return 70; // Desktop
    }
}
