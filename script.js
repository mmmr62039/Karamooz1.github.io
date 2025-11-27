// صحنه و دوربین
let scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);

let camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(5, 10, 10);

// رندر
let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// کنترل دوربین
let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(3.5,0,3.5);
controls.update();

// نورپردازی
let light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// ساخت بورد شطرنج 8x8
let board = new THREE.Group();
for(let i=0;i<8;i++){
    for(let j=0;j<8;j++){
        let color = (i+j)%2==0 ? 0xffffff : 0x333333;
        let geometry = new THREE.BoxGeometry(1, 0.2, 1);
        let material = new THREE.MeshStandardMaterial({color: color});
        let cube = new THREE.Mesh(geometry, material);
        cube.position.set(i, 0, j);
        board.add(cube);
    }
}
scene.add(board);

// لود مدل GLB
let mixer;
let loader = new THREE.GLTFLoader();
loader.load('models/character.glb', function(gltf){
    let model = gltf.scene;
    model.scale.set(0.5,0.5,0.5);
    model.position.set(0,0.2,0); // خانه اولیه
    scene.add(model);

    mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach(clip => {
        mixer.clipAction(clip).play();
    });
});

// رندر و انیمیشن
let clock = new THREE.Clock();
function animate(){
    requestAnimationFrame(animate);
    if(mixer) mixer.update(clock.getDelta());
    renderer.render(scene, camera);
}
animate();
