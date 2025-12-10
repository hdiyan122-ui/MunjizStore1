/**
 * 3D Engine Module
 * Handles Three.js 3D animations and effects
 */

class ThreeJSEngine {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.canvas = document.getElementById('canvas3d');
        this.objects = [];
        this.animationFrameId = null;
        
        this.init();
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createLights();
        this.createObjects();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        this.scene.fog = new THREE.Fog(0x000000, 1000, 10000);
    }

    createCamera() {
        const aspect = this.width / this.height;
        this.camera = new THREE.PerspectiveCamera(
            75,
            aspect,
            0.1,
            1000
        );
        this.camera.position.z = 30;
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
    }

    createLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xff0000, 0.3);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xff0000, 0.6);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Point lights for glow effect
        const pointLight1 = new THREE.PointLight(0xff0000, 0.8, 100);
        pointLight1.position.set(20, 20, 20);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xff0000, 0.5, 80);
        pointLight2.position.set(-20, -20, 20);
        this.scene.add(pointLight2);
    }

    createObjects() {
        // Floating cubes
        for (let i = 0; i < 5; i++) {
            const geometry = new THREE.BoxGeometry(2, 2, 2);
            const material = new THREE.MeshStandardMaterial({
                color: 0xff0000,
                metalness: 0.7,
                roughness: 0.2,
                emissive: 0x330000,
                emissiveIntensity: 0.5
            });
            const cube = new THREE.Mesh(geometry, material);
            
            cube.position.set(
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 60
            );
            
            cube.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            cube.castShadow = true;
            cube.receiveShadow = true;
            
            cube.userData = {
                rotationSpeed: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01
                ),
                originalPosition: cube.position.clone(),
                floatAmount: Math.random() * 10 + 5,
                floatSpeed: Math.random() * 0.02 + 0.01,
                time: Math.random() * Math.PI * 2
            };
            
            this.scene.add(cube);
            this.objects.push(cube);
        }

        // Floating spheres
        for (let i = 0; i < 3; i++) {
            const geometry = new THREE.SphereGeometry(1.5, 32, 32);
            const material = new THREE.MeshStandardMaterial({
                color: 0xff3333,
                metalness: 0.8,
                roughness: 0.1,
                wireframe: false,
                emissive: 0x660000,
                emissiveIntensity: 0.6
            });
            const sphere = new THREE.Mesh(geometry, material);
            
            sphere.position.set(
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 60
            );
            
            sphere.castShadow = true;
            sphere.receiveShadow = true;
            
            sphere.userData = {
                rotationSpeed: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.005,
                    (Math.random() - 0.5) * 0.005,
                    (Math.random() - 0.5) * 0.005
                ),
                originalPosition: sphere.position.clone(),
                floatAmount: Math.random() * 15 + 8,
                floatSpeed: Math.random() * 0.015 + 0.005,
                time: Math.random() * Math.PI * 2
            };
            
            this.scene.add(sphere);
            this.objects.push(sphere);
        }

        // Floating tetrahedron
        const tetraGeometry = new THREE.TetrahedronGeometry(3, 0);
        const tetraMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            metalness: 0.9,
            roughness: 0.05,
            wireframe: false,
            emissive: 0xff0000,
            emissiveIntensity: 0.3
        });
        const tetrahedron = new THREE.Mesh(tetraGeometry, tetraMaterial);
        
        tetrahedron.position.set(0, 0, -10);
        tetrahedron.castShadow = true;
        tetrahedron.receiveShadow = true;
        
        tetrahedron.userData = {
            rotationSpeed: new THREE.Vector3(0.01, 0.015, 0.005),
            originalPosition: tetrahedron.position.clone(),
            floatAmount: 5,
            floatSpeed: 0.02,
            time: 0
        };
        
        this.scene.add(tetrahedron);
        this.objects.push(tetrahedron);

        // Wireframe background
        this.createWireframeBackground();
    }

    createWireframeBackground() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        
        for (let i = 0; i < 100; i++) {
            vertices.push(
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 100
            );
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        
        const material = new THREE.PointsMaterial({
            color: 0xff0000,
            size: 0.5,
            sizeAttenuation: true,
            opacity: 0.2
        });
        
        const points = new THREE.Points(geometry, material);
        this.scene.add(points);
    }

    animate() {
        this.animationFrameId = requestAnimationFrame(() => this.animate());

        // Update objects
        this.objects.forEach(obj => {
            // Rotation
            obj.rotation.x += obj.userData.rotationSpeed.x;
            obj.rotation.y += obj.userData.rotationSpeed.y;
            obj.rotation.z += obj.userData.rotationSpeed.z;

            // Floating animation
            obj.userData.time += obj.userData.floatSpeed;
            const floatingY = Math.sin(obj.userData.time) * obj.userData.floatAmount;
            const floatingX = Math.cos(obj.userData.time * 0.5) * (obj.userData.floatAmount * 0.5);
            
            obj.position.y = obj.userData.originalPosition.y + floatingY;
            obj.position.x = obj.userData.originalPosition.x + floatingX;
        });

        this.renderer.render(this.scene, this.camera);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    onWindowResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.width, this.height);
    }

    onMouseMove(event) {
        const mouseX = (event.clientX / this.width) * 2 - 1;
        const mouseY = -(event.clientY / this.height) * 2 + 1;

        // Subtle camera movement
        this.camera.position.x = mouseX * 2;
        this.camera.position.y = mouseY * 2;
        this.camera.lookAt(0, 0, 0);
    }

    dispose() {
        cancelAnimationFrame(this.animationFrameId);
        this.renderer.dispose();
        this.objects.forEach(obj => {
            obj.geometry.dispose();
            obj.material.dispose();
        });
    }
}

// Initialize 3D engine when page loads
let threeJSEngine = null;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        threeJSEngine = new ThreeJSEngine();
    });
} else {
    threeJSEngine = new ThreeJSEngine();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (threeJSEngine) {
        threeJSEngine.dispose();
    }
});
