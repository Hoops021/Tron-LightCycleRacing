/**
 * @author Troy Ferrell & Yang Su
 */

function Player(scene, glowscene) {
    this.scene = scene;
    this.glowScene = glowscene;

    this.trail = new Trail(this.scene, this.glowScene);

    this.position = CONFIG.playerPos.clone();
    this.velocity = CONFIG.playerDefaulVel.clone();
    this.targetVelocity = CONFIG.playerDefaulVel.clone();
    this.targetRotation = 0;

    this.isAlive = true;
    this.score = 0;
    this.boosterMultiplier = 1;
    this.DerezzEffect = null;
    this.isJumping = false;

    //this.material = CONFIG.playerMaterial;
    this.glowMaterial = CONFIG.playerGlowMaterial;

    /*
    this.mesh = new THREE.Mesh(CONFIG.playerGeometry, this.material);
    this.mesh.scale.set(CONFIG.playerScale, CONFIG.playerScale, CONFIG.playerScale);
    
    this.mesh = CONFIG.playerMesh;
    this.mesh.geometry.computeBoundingBox();
    this.boundingBox = this.mesh.geometry.boundingBox;
    */

    this.player = CONFIG.playerColladaScene;
    this.boundingBox = CONFIG.playerBoundingBox;

    var box = this.boundingBox,
        temp = box.max.clone().sub(box.min),
        radius = Math.max(temp.x, temp.y) / 2;
    this.boundingSphere = {
        radius: radius,
        offset: temp.z * CONFIG.playerScale - radius
    };

    this.boundingCylinder = {
        minz : box.min.z * CONFIG.playerScale,
        maxz : box.max.z * CONFIG.playerScale,
        radius : radius
    };

    this.scene.add(this.player);

    this.glowMesh = new THREE.Mesh(CONFIG.playerGeometry, this.glowMaterial);
    this.glowMesh.scale = this.player.scale;
    this.glowMesh.overdraw = true;
    this.glowScene.add(this.glowMesh);

    this.updatePosition();
}

Player.prototype.reset = function () {
    this.isAlive = true;
    this.score = 0;
    this.boosterMultiplier = 1;

    this.position = CONFIG.playerPos.clone();
    this.velocity = CONFIG.playerDefaulVel.clone();
    this.targetVelocity = CONFIG.playerDefaulVel.clone();
    this.targetRotation = 0;

    this.updatePosition();

    this.trail.reset();

    if (this.DerezzEffect) {
        this.DerezzEffect.remove();
    }
    this.DerezzEffect = null;

    //Ensure scenes have only one copy of meshes
    this.scene.remove(this.player);
    this.glowScene.remove(this.glowMesh);

    this.scene.add(this.player);
    this.glowScene.add(this.glowMesh);
};

Player.prototype.Derezz = function () {
    if (this.isAlive) {
        // Remove mesh & glow mesh from respective scenes
        this.scene.remove(this.player);
        this.glowScene.remove(this.glowMesh);

        // Kill player
        this.isAlive = false;

         // Transform vertices into current position points;
        var particles = new THREE.Geometry(),
            positionVector = this.position.convertToCartesian();

        _.each(this.player.geometry.vertices, function (vertex) {
            var newVertex = vertex.clone();
            newVertex.position.multiplyScalar(3);
            newVertex.position.addSelf(positionVector);
            particles.vertices.push(newVertex);
        });

        // Create effect
        this.DerezzEffect = new Derezz(this.scene, particles);
    }
};

Player.prototype.getPosition = function () {
    return this.position;
};

Player.prototype.getRotation = function () {
    return this.player.rotation;
};

Player.prototype.move = function (dt) {
    // Forward movement
    this.velocity.z += (this.targetVelocity.z - this.velocity.z) * CONFIG.playerForwardVelMultiplier;
    this.position.z += this.velocity.z  * dt;

    // Lateral movement
    this.velocity.theta += (this.targetVelocity.theta - this.velocity.theta) * CONFIG.playerLateralVelMultiplier;
    this.position.theta += this.velocity.theta * dt;

    // Jumping movement
    if (!(this.position.radius >= CONFIG.playerPos.radius && this.velocity.radius > 0)) {
        this.velocity.radius += CONFIG.playerGravityAcceleration * dt;
        this.position.radius += this.velocity.radius * dt;
        if (this.position.radius > CONFIG.playerPos.radius) {
            this.isJumping = false;
            this.position.radius = CONFIG.playerPos.radius;
        }
    }

    // Update Rotation
    this.targetRotation += this.velocity.theta * dt;
    this.player.rotation.z += (this.targetRotation - this.player.rotation.z) * CONFIG.playerRotationMultiplier;

    this.updatePosition();
};

Player.prototype.updatePosition = function () {
    if (this.player !== null) {
        var newPos = this.position.convertToCartesian();
        this.player.position.set(newPos.x, newPos.y, newPos.z);
        
        // Update Glow Mesh
        this.glowMesh.rotation = this.player.rotation;
        this.glowMesh.position = this.player.position;
    }
};

Player.prototype.accelerateLeft = function () {
    this.targetVelocity.theta = -CONFIG.playerMaxLateralVel;
};

Player.prototype.accelerateRight = function () {
    this.targetVelocity.theta = CONFIG.playerMaxLateralVel;
};

Player.prototype.accelerate = function () {
    this.targetVelocity.z = this.boosterMultiplier * CONFIG.playerMaxForwardVel;
};

Player.prototype.decelerate = function () {
    this.targetVelocity.z = this.boosterMultiplier * CONFIG.playerMinForwardVel;
};

Player.prototype.boost = function () {
    if (this.boosterMultiplier < CONFIG.playerBoosterLimit) {
        this.boosterMultiplier += 1;
    }

    this.accelerate();
};

Player.prototype.jump = function () {
    if(!this.isJumping)
    {
        this.isJumping = true;
        this.velocity.radius = CONFIG.defaultPlayerJumpVel;
    }
};

Player.prototype.resetForwardAcceleration = function () {
    this.targetVelocity.z = CONFIG.playerDefaultForwardVel;
};

Player.prototype.resetLateralAcceleration = function () {
    this.targetVelocity.theta = 0;
};

Player.prototype.update = function (dt) {
    if (this.isAlive) {
        this.move(dt);
        
        this.trail.update(this.position.clone());
    } else {
        this.DerezzEffect.update(dt);
    }
};