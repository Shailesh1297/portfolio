import { Bubble } from './Bubble.js';
import { GameConfig } from '../config/GameConfig.js';

/**
 * BubbleManager Class
 * Manages all bubbles in the game
 */
export class BubbleManager {
    constructor(scene) {
        this.scene = scene;
        this.bubbles = [];
        this.createBubbles();
    }

    createBubbles() {
        const balloonData = GameConfig.getBalloonData();
        const screenWidth = this.scene.scale.width;
        const screenHeight = this.scene.scale.height;
        const isMobile = screenWidth < 768;
        const isSmallMobile = screenWidth < 480;

        balloonData.forEach((data, index) => {
            let x, y;

            if (isSmallMobile) {
                // Zigzag layout for small phones to prevent overlapping and improve accessibility
                const xOffset = screenWidth * 0.22; // Offset from center
                x = (screenWidth / 2) + (index % 2 === 0 ? -xOffset : xOffset);
                y = (screenHeight * 0.15) + (index * (screenHeight * 0.16));
            } else if (isMobile) {
                // Two column layout for tablets
                const col = index % 2;
                const row = Math.floor(index / 2);
                x = this.scene.scale.width * (col === 0 ? 0.3 : 0.7);
                y = (this.scene.scale.height * 0.2) + (row * (this.scene.scale.height * 0.2));
            } else {
                // Desktop - use original positions
                x = this.scene.scale.width * data.x;
                y = this.scene.scale.height * data.y;
            }

            const bubble = new Bubble(this.scene, x, y, data.color, data.key);
            this.bubbles.push(bubble);
        });
    }

    update(time) {
        this.bubbles.forEach((bubble, index) => {
            bubble.animate(time, index);
        });
    }

    checkCollisions(laser) {
        for (let bubble of this.bubbles) {
            if (bubble.checkCollision(laser.getPosition())) {
                console.log(`Hit detected on bubble: ${bubble.key}`);
                return bubble;
            }
        }
        return null;
    }

    popBubble(bubble, onComplete) {
        bubble.pop(onComplete);
    }

    respawnAll() {
        console.log('Modal closed, respawning bubbles...');
        this.bubbles.forEach(bubble => {
            if (!bubble.active) {
                bubble.respawn();
            }
        });
    }

    getBubbles() {
        return this.bubbles;
    }
}
