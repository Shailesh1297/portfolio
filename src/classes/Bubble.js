import Phaser from 'phaser';
import { portfolioContent } from '../content.js';

/**
 * Bubble Class
 * Represents an interactive bubble that can be clicked/shot
 */
export class Bubble {
    constructor(scene, x, y, color, key) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.baseY = y;
        this.color = color;
        this.key = key;
        this.active = true;
        this.sprite = null;
        this.create();
    }

    create() {
        // Create bubble container
        this.sprite = this.scene.add.container(this.x, this.y);

        // Draw bubble (responsive size based on screen)
        const graphics = this.scene.add.graphics();

        // Calculate responsive bubble radius
        const screenWidth = this.scene.scale.width;
        const isMobile = screenWidth < 768;
        const isSmallMobile = screenWidth < 480;

        let bubbleRadius;
        if (isSmallMobile) {
            bubbleRadius = 45; // Small phones
        } else if (isMobile) {
            bubbleRadius = 55; // Tablets
        } else {
            bubbleRadius = 70; // Desktop
        }

        this.radius = bubbleRadius;

        // Create glow graphics (behind the bubble)
        this.glow = this.scene.add.graphics();
        this.glow.fillStyle(this.color, 0.3);
        this.glow.fillCircle(0, 0, bubbleRadius + 15);
        this.glow.setAlpha(0);
        this.sprite.add(this.glow);

        // Outer bubble with transparent color tint
        graphics.fillStyle(this.color, 0.15);
        graphics.fillCircle(0, 0, bubbleRadius);

        // Bubble border/rim with color
        graphics.lineStyle(3, this.color, 0.4);
        graphics.strokeCircle(0, 0, bubbleRadius);

        // Inner glow effect
        graphics.fillStyle(this.color, 0.08);
        graphics.fillCircle(0, 0, bubbleRadius - 10);

        // Glossy highlight (top-left) - scaled
        const highlightSize = bubbleRadius * 0.35;
        graphics.fillStyle(0xffffff, 0.4);
        graphics.fillCircle(-bubbleRadius * 0.28, -bubbleRadius * 0.28, highlightSize);

        // Secondary highlight (smaller) - scaled
        const secondaryHighlight = bubbleRadius * 0.17;
        graphics.fillStyle(0xffffff, 0.25);
        graphics.fillCircle(-bubbleRadius * 0.35, -bubbleRadius * 0.35, secondaryHighlight);

        // Shimmer effect (bottom-right) - scaled
        const shimmerSize = bubbleRadius * 0.25;
        graphics.fillStyle(0xffffff, 0.15);
        graphics.fillCircle(bubbleRadius * 0.35, bubbleRadius * 0.35, shimmerSize);

        this.sprite.add(graphics);

        // Add text label with responsive font size
        const fontSize = isSmallMobile ? '12px' : (isMobile ? '14px' : '16px');
        const label = this.scene.add.text(0, 0, portfolioContent[this.key].title, {
            fontSize: fontSize,
            fontFamily: 'Outfit, sans-serif',
            color: '#ffffff',
            fontStyle: 'bold',
            align: 'center',
            stroke: '#000000',
            strokeThickness: isSmallMobile ? 2 : 3
        });
        label.setOrigin(0.5);
        this.sprite.add(label);

        // Make container interactive with circular hit area
        this.sprite.setInteractive(
            new Phaser.Geom.Circle(0, 0, bubbleRadius),
            Phaser.Geom.Circle.Contains
        );

        // Hover effects
        this.sprite.on('pointerover', () => {
            if (!this.active) return;
            this.scene.tweens.add({
                targets: this.sprite,
                scale: 1.1,
                duration: 200,
                ease: 'Power2'
            });
            this.scene.tweens.add({
                targets: this.glow,
                alpha: 1,
                duration: 200,
                ease: 'Power2'
            });
            document.body.style.cursor = 'pointer';
        });

        this.sprite.on('pointerout', () => {
            if (!this.active) return;
            this.scene.tweens.add({
                targets: this.sprite,
                scale: 1,
                duration: 200,
                ease: 'Power2'
            });
            this.scene.tweens.add({
                targets: this.glow,
                alpha: 0,
                duration: 200,
                ease: 'Power2'
            });
            document.body.style.cursor = 'default';
        });
    }

    animate(time, index) {
        if (this.active && this.sprite) {
            const offset = Math.sin(time / 1000 + index) * 15;
            this.sprite.y = this.baseY + offset;
        }
    }

    pop(onComplete) {
        if (!this.active) {
            console.log(`Bubble ${this.key} already inactive, skipping pop`);
            return;
        }

        console.log(`Popping bubble: ${this.key}`);
        this.active = false;

        // Pop animation with particles
        const particles = this.scene.add.particles(this.sprite.x, this.sprite.y, 'white', {
            speed: { min: 100, max: 200 },
            scale: { start: 1, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 600,
            quantity: 20,
            tint: portfolioContent[this.key].color.replace('#', '0x')
        });

        // Balloon pop tween
        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: 1.5,
            scaleY: 0.5,
            alpha: 0,
            duration: 200,
            ease: 'Power2',
            onComplete: () => {
                this.sprite.setVisible(false);
                particles.destroy();
                if (onComplete) onComplete();
            }
        });
    }

    respawn() {
        console.log(`Respawning bubble: ${this.key}`);

        // Respawn animation
        this.sprite.setVisible(true);
        this.sprite.alpha = 0;
        this.sprite.scaleX = 0;
        this.sprite.scaleY = 0;

        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            duration: 400,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.active = true;
                console.log(`Bubble ${this.key} respawned and active`);
            }
        });
    }

    checkCollision(laser) {
        if (!this.active || !this.sprite || !this.sprite.visible) {
            return false;
        }

        const dx = laser.x - this.sprite.x;
        const dy = laser.y - this.sprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < this.radius;
    }
}
