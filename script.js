document.addEventListener('DOMContentLoaded', () => {

    // --- Three.js Scene Setup ---
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // --- Lights ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // Confetti + Sound button
        document.getElementById('confetti-btn').addEventListener('click', () => {
            // Play sound
            const audio = document.getElementById('birthday-audio');
            audio.currentTime = 0;
            audio.play();

            // Confetti celebration
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff0000', '#ff69b4', '#ff1493', '#ffc0cb']
            });

            setTimeout(() => {
                confetti({
                    particleCount: 30,
                    spread: 60,
                    origin: { y: 0.5 },
                    shapes: ['heart'],
                    colors: ['#ff0000', '#ff69b4']
                });
            }, 300);

            setTimeout(() => {
                confetti({
                    particleCount: 20,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    shapes: ['heart'],
                    colors: ['#ff0000', '#ff69b4']
                });

                confetti({
                    particleCount: 20,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    shapes: ['heart'],
                    colors: ['#ff0000', '#ff69b4']
                });
            }, 600);
        });

    // --- Heart Geometry ---
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0.25, 0.25);
    heartShape.bezierCurveTo(0.25, 0.25, 0.2, 0, 0, 0);
    heartShape.bezierCurveTo(-0.3, 0, -0.3, 0.35, -0.3, 0.35);
    heartShape.bezierCurveTo(-0.3, 0.55, -0.1, 0.77, 0.25, 0.95);
    heartShape.bezierCurveTo(0.6, 0.77, 0.8, 0.55, 0.8, 0.35);
    heartShape.bezierCurveTo(0.8, 0.35, 0.8, 0, 0.5, 0);
    heartShape.bezierCurveTo(0.35, 0, 0.25, 0.25, 0.25, 0.25);
    const extrudeSettings = { depth: 0.2, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);

    const hearts = [];
    const colors = [0xff6b6b, 0xf43f5e, 0xec4899, 0xf9a8d4, 0xdb2777];
    for (let i = 0; i < 30; i++) {
        const material = new THREE.MeshPhongMaterial({ color: colors[Math.floor(Math.random() * colors.length)], shininess: 80, transparent: true, opacity: 0.9 });
        const heart = new THREE.Mesh(heartGeometry, material);
        heart.position.set((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 50);
        const scale = Math.random() * 2 + 1;
        heart.scale.set(scale, scale, scale);
        heart.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        heart.userData = { rotationSpeed: Math.random() * 0.01, originalY: heart.position.y, floatAmplitude: Math.random() * 2 + 1 };
        scene.add(heart);
        hearts.push(heart);
    }

    // --- Animation Loop ---
    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.0005;
        hearts.forEach(heart => {
            heart.rotation.y += heart.userData.rotationSpeed;
            heart.position.y = heart.userData.originalY + Math.sin(time + heart.position.x) * heart.userData.floatAmplitude;
        });
        renderer.render(scene, camera);
    }
    animate();

    // --- Handle Window Resize ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- UI Navigation & Logic ---
    let currentStep = 1;
    const totalSteps = 5;
    const clickSound = document.getElementById('click-sound');
    const progressBar = document.getElementById('progress-bar');
    
    function showStep(stepNumber) {
        document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
        document.getElementById(`step${stepNumber}`)?.classList.add('active');
        currentStep = stepNumber;
        const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
        if (progressBar) progressBar.style.width = `${progress}%`;
    }

    function playSound() {
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.warn("Audio play prevented.", e));
        }
    }

    // --- Event Listeners ---
    document.getElementById('start-btn')?.addEventListener('click', () => { playSound(); showStep(2); });
    document.getElementById('next-btn-2')?.addEventListener('click', () => showStep(3));
    document.getElementById('next-btn-3')?.addEventListener('click', () => showStep(4));
    document.getElementById('next-btn-4')?.addEventListener('click', () => showStep(5));
    document.getElementById('confetti-btn')?.addEventListener('click', () => {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
        const confettiColors = ['#ec4899', '#f43f5e', '#f9a8d4', '#ffffff'];
        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            const randomInRange = (min, max) => Math.random() * (max - min) + min;
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: confettiColors });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: confettiColors });
        }, 250);
    });

    // Initialize first step
    showStep(1);
});