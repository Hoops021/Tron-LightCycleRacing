var CONFIG = {
    // Renderer Settings
    'renderer' : {
        antialias: true,
        maxLights: 20
        //antialias: true,	// to get smoother output
    },
    'background' : 0x000000,

    // Camera Settings
    'cameraAngle' : 75,
    'cameraNear' : 0.1,
    'cameraFar' : 100000,
    'cameraPos' : UTIL.v3(-15, 0, 200),
    'cameraVel' : UTIL.v3c(0, 0, -150),

    'viewDistance' : 1000,

    // Player Settings
    'playerScale' : 3,
    'playerForwardVelMultiplier' : 0.05,
    'playerDefaultForwardVel' : -150,
    'playerMaxForwardVel' : -600,
    'playerMinForwardVel' : 0,
    'playerLateralVelMultiplier' : 0.25,
    'playerMaxLateralVel' : Math.PI,
    'playerPos' : UTIL.v3c(75, 1.5 * Math.PI, 0),
    'playerDefaulVel' : UTIL.v3c(1, 0, -150),
    'playerDefaulTargetVel' : UTIL.v3c(0, 0, -150),
    'defaultPlayerJumpVel' : -450,
    'playerGravityAcceleration' : 850,

    // Tunnel Settings
    'tunnelRadius' : 100,
    'tunnelSegmentDepth' : 10,
    'tunnelSegmentPerSection' : 10,
    'tunnelResolution' : 16,
    'tunnelMaterial' : {
        color : 0x47C5D8,
        ambient : 0x47C5D8,
        wireframe : true
    },
    'tunnelLiveSections' : 15, // should be 1 + cameraFar/(segdepth * seg/sec)

    // Trail Settings
    'trailMeshOffest' : 45,
    'trailLiveSections' : 35,
    'trailHeight' : 5,

    // Light Ring Settings
    'lightRingCount' : 8,
    'lightColor' : 0xFFFFFF,
    'lightIntensity' : 0.55,
    'lightRange' : 800,
    'lightIntensityStep' : 0.05
};