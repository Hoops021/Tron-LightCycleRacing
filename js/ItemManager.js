/**
 * @author Troy Ferrell
 */

function ItemManager(scene){
    
    this.gameItems = [];
    
    // Test
    var pu = new PowerUp();
    this.gameItems.push(pu);
    
    function PowerUp(){
        
        var loader = new THREE.JSONLoader();
        loader.load( "obj/LightDisk.js", loadObj);
        
        this.powerUpMesh = null;
        var __self = this;
        function loadObj(geometry){
            // select texture based on type
            var texture = THREE.ImageUtils.loadTexture('img/LightDisk.png');
            //texture.wrapT = THREE.RepeatWrapping;
            var material = new THREE.MeshLambertMaterial({
                map: texture,
                transparent : false});
    
            __self.powerUpMesh = new THREE.Mesh(geometry, material);
            __self.powerUpMesh.scale.set(2, 2, 2);
            __self.powerUpMesh.position = CONFIG.playerPos.convertToCartesian();
            __self.powerUpMesh.position.z -= CONFIG.cameraFar;
            __self.powerUpMesh.rotation.x = Math.PI/2;
            
            window.scene.add(__self.powerUpMesh);
        }
    }
    
    PowerUp.prototype.update = function(){
        this.powerUpMesh.rotation.z += 0.05;   
    }
    
    // Item - super class???
    // Booster portals
    // tron disk power-ups -> different colors 
    // Credit(W/ Curves)
}

ItemManager.prototype.update = function(){
    // update all items
    _.each(this.gameItems, function (item) {
        item.update();
    });
    
    // update any new creation of items based on randomization or file
    
    // delete past items too far back 
    
    //(TEST collision with items????)
}