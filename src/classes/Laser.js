/**
 * Laser Class
 * Represents a laser projectile fired by the player
 */
export class Laser {
    constructor(scene, x, y, targetX, targetY) {
        this.scene = scene;
        this.sprite = null;
        this.checkCollision = true;
        this.create(x, y, targetX, targetY);
    }

    create(x, y, targetX, targetY) {
        // Create laser beam graphics
        const laserGraphics = this.scene.add.graphics();

        // Main laser beam (glowing cyan)
        laserGraphics.fillStyle(0x00ffff, 1);
        laserGraphics.fillRect(0, -2, 30, 4);

        // Outer glow
        laserGraphics.fillStyle(0x00ffff, 0.3);
        laserGraphics.fillRect(-2, -4, 34, 8);

        // Core bright line
        laserGraphics.fillStyle(0xffffff, 0.8);
        laserGraphics.fillRect(5, -1, 20, 2);

        // Convert graphics to sprite
        this.sprite = this.scene.add.container(x, y);
        this.sprite.add(laserGraphics);

        // Enable physics
        this.scene.physics.world.enable(this.sprite);

        // Calculate velocity
        const angle = Math.atan2(targetY - y, targetX - x);
        const speed = 800;
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;

        this.sprite.body.setVelocity(velocityX, velocityY);
        this.sprite.rotation = angle;

        // Add particle trail
        this.addTrail();
    }

    addTrail() {
        const trail = this.scene.add.particles(this.sprite.x, this.sprite.y, 'white', {
            speed: 0,
            scale: { start: 0.4, end: 0 },
            alpha: { start: 0.6, end: 0 },
            lifespan: 200,
            tint: 0x00ffff,
            frequency: 20
        });

        // Make trail follow laser
        trail.startFollow(this.sprite);

        // Store trail reference for cleanup
        this.trail = trail;
    }

    update() {
        if (!this.sprite || !this.sprite.active) {
            return false;
        }

        // Rotate laser to face direction of movement
        if (this.sprite.body && this.sprite.body.velocity) {
            const angle = Math.atan2(this.sprite.body.velocity.y, this.sprite.body.velocity.x);
            this.sprite.rotation = angle;
        }

        // Check if off screen
        const bounds = this.scene.scale;
        if (this.sprite.x < -100 || this.sprite.x > bounds.width + 100 ||
            this.sprite.y < -100 || this.sprite.y > bounds.height + 100) {
            this.destroy();
            return false;
        }

        return true;
    }

    destroy() {
        if (this.trail) {
            this.trail.destroy();
        }
        if (this.sprite) {
            this.sprite.destroy();
        }
    }

    getPosition() {
        return {
            x: this.sprite.x,
            y: this.sprite.y
        };
    }

    disableCollision() {
        this.checkCollision = false;
    }

    isActive() {
        return this.sprite && this.sprite.active;
    }
}
