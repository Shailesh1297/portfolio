import Phaser from 'phaser';
import { Stickman } from './Stickman.js';
import { BubbleManager } from './BubbleManager.js';
import { LaserManager } from './LaserManager.js';

/**
 * GameScene Class
 * Main game scene that orchestrates all game objects
 */
export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.stickman = null;
        this.bubbleManager = null;
        this.laserManager = null;
        this.hasShot = false;
    }

    preload() {
        // Create a simple white pixel texture for particles
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff, 1);
        graphics.fillRect(0, 0, 4, 4);
        graphics.generateTexture('white', 4, 4);
        graphics.destroy();
    }

    create() {
        console.log('Game scene created');

        // Create game objects
        this.stickman = new Stickman(this);
        this.bubbleManager = new BubbleManager(this);
        this.laserManager = new LaserManager(this);

        // Setup input handlers
        this.setupInputHandlers();

        // Handle window resize
        this.scale.on('resize', this.handleResize, this);

        // Set up modal callback
        if (window.modalManager) {
            window.modalManager.setOnCloseCallback(() => this.onModalClosed());
        }
    }

    setupInputHandlers() {
        // Mouse/touch move for aiming
        this.input.on('pointermove', (pointer) => {
            this.stickman.aimAt(pointer);
        });

        // Click/tap to shoot
        this.input.on('pointerdown', (pointer) => {
            this.shootLaser(pointer.x, pointer.y);
            this.hideSubtitleAfterFirstShot();
        });
    }

    shootLaser(targetX, targetY) {
        const muzzlePos = this.stickman.getMuzzlePosition();
        this.laserManager.shoot(muzzlePos.x, muzzlePos.y, targetX, targetY);
        this.stickman.playShootAnimation();
    }

    hideSubtitleAfterFirstShot() {
        if (!this.hasShot) {
            this.hasShot = true;
            const subtitle = document.querySelector('.game-subtitle');
            if (subtitle) {
                subtitle.style.transition = 'opacity 0.5s ease-out';
                subtitle.style.opacity = '0';
                setTimeout(() => {
                    subtitle.style.display = 'none';
                }, 500);
            }
        }
    }

    update(time, delta) {
        // Update bubbles (floating animation)
        this.bubbleManager.update(time);

        // Update lasers and check collisions
        const hitBubble = this.laserManager.update(this.bubbleManager);
        if (hitBubble) {
            this.handleBubbleHit(hitBubble);
        }
    }

    handleBubbleHit(bubble) {
        this.bubbleManager.popBubble(bubble, () => {
            // Open modal
            if (window.modalManager) {
                window.modalManager.open(bubble.key);
            }
        });
    }

    onModalClosed() {
        this.bubbleManager.respawnAll();
    }

    handleResize(gameSize) {
        const width = gameSize.width;
        const height = gameSize.height;

        // Update camera
        this.cameras.resize(width, height);

        console.log(`Game resized to ${width}x${height}`);
    }
}
