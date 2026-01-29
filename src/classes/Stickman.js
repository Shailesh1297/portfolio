/**
 * Stickman Class
 * Represents the player character with laser gun
 */
export class Stickman {
    constructor(scene) {
        this.scene = scene;
        this.container = null;
        this.armsContainer = null;
        this.gun = null;
        this.create();
    }

    create() {
        const x = this.scene.scale.width / 2;
        const y = this.scene.scale.height - 30; // Much lower position

        // Create main stickman container
        this.container = this.scene.add.container(x, y);

        // Draw static body parts (head, body, legs)
        const bodyGraphics = this.scene.add.graphics();

        // Head
        bodyGraphics.lineStyle(3, 0xffffff, 1);
        bodyGraphics.strokeCircle(0, -60, 15);

        // Body
        bodyGraphics.lineBetween(0, -45, 0, -10);

        // Legs
        bodyGraphics.lineBetween(0, -10, -15, 20);  // Left leg
        bodyGraphics.lineBetween(0, -10, 15, 20);   // Right leg

        this.container.add(bodyGraphics);

        // Create arms and gun container (this will rotate)
        this.armsContainer = this.scene.add.container(0, -35); // Position at shoulder level

        // Draw arms
        const armsGraphics = this.scene.add.graphics();
        armsGraphics.lineStyle(3, 0xffffff, 1);
        armsGraphics.lineBetween(0, 0, -25, 5);  // Left arm
        armsGraphics.lineBetween(0, 0, 25, 5);   // Right arm

        this.armsContainer.add(armsGraphics);

        // Create laser gun
        this.gun = this.scene.add.graphics();

        // Gun barrel (cyan/blue color for sci-fi look)
        this.gun.fillStyle(0x00d9ff, 1);
        this.gun.fillRect(20, 0, 35, 8);

        // Gun body/grip
        this.gun.fillStyle(0x4a5568, 1);
        this.gun.fillRect(10, -5, 15, 18);

        // Energy core (glowing part)
        this.gun.fillStyle(0x00ffff, 1);
        this.gun.fillCircle(18, 4, 4);

        // Gun details/accents
        this.gun.lineStyle(2, 0x00d9ff, 1);
        this.gun.strokeRect(20, 0, 35, 8);

        // Muzzle glow
        this.gun.fillStyle(0x00ffff, 0.6);
        this.gun.fillCircle(55, 4, 3);

        this.armsContainer.add(this.gun);

        // Add arms container to stickman
        this.container.add(this.armsContainer);
    }

    aimAt(pointer) {
        if (!this.armsContainer) return;

        // Calculate angle from stickman shoulder to cursor
        const shoulderWorldX = this.container.x;
        const shoulderWorldY = this.container.y - 35; // Shoulder position

        const dx = pointer.x - shoulderWorldX;
        const dy = pointer.y - shoulderWorldY;
        const angle = Math.atan2(dy, dx);

        // Rotate arms container to aim at cursor (full 360° rotation)
        this.armsContainer.rotation = angle;
    }

    getPosition() {
        return {
            x: this.container.x,
            y: this.container.y
        };
    }

    getMuzzlePosition() {
        return {
            x: this.container.x,
            y: this.container.y - 30
        };
    }

    playShootAnimation() {
        // Gun recoil animation
        this.scene.tweens.add({
            targets: this.gun,
            x: -5,
            duration: 50,
            yoyo: true,
            ease: 'Power2'
        });

        // Muzzle flash effect
        const flash = this.scene.add.graphics();
        flash.fillStyle(0x00ffff, 0.8);
        flash.fillCircle(this.container.x + 55, this.container.y - 30, 8);
        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            scaleX: 2,
            scaleY: 2,
            duration: 100,
            onComplete: () => flash.destroy()
        });
    }
}
