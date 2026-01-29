import { Laser } from './Laser.js';

/**
 * LaserManager Class
 * Manages all laser projectiles in the game
 */
export class LaserManager {
    constructor(scene) {
        this.scene = scene;
        this.lasers = [];
    }

    shoot(fromX, fromY, toX, toY) {
        const laser = new Laser(this.scene, fromX, fromY, toX, toY);
        this.lasers.push(laser);
        return laser;
    }

    update(bubbleManager) {
        // Iterate backwards to safely remove items
        for (let i = this.lasers.length - 1; i >= 0; i--) {
            const laser = this.lasers[i];

            if (!laser || !laser.isActive()) {
                this.lasers.splice(i, 1);
                continue;
            }

            // Update laser position
            const stillActive = laser.update();
            if (!stillActive) {
                this.lasers.splice(i, 1);
                continue;
            }

            // Check collision with bubbles if this laser should check collisions
            if (laser.checkCollision) {
                const hitBubble = bubbleManager.checkCollisions(laser);
                if (hitBubble) {
                    laser.disableCollision();
                    laser.destroy();
                    this.lasers.splice(i, 1);

                    // Return the hit bubble so the scene can handle it
                    return hitBubble;
                }
            }
        }

        return null;
    }

    clear() {
        this.lasers.forEach(laser => laser.destroy());
        this.lasers = [];
    }

    getLasers() {
        return this.lasers;
    }
}
