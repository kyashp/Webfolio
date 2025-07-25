import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { MeshLine, MeshLineGeometry, MeshLineMaterial } from "./MeshLine/index.js";
import { UnrealBloomPass } from 'jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'jsm/postprocessing/RenderPass.js';

let scene, renderer, camera, osphere;
const container = document.getElementById('effect-container');
const w= container.clientWidth;
const h=container.clientHeight;
let bgColor = new THREE.Color("rgb(255, 255, 255)");

scene=new THREE.Scene();
scene.background = new THREE.Color(bgColor);

document.getElementById('mode').addEventListener('click',()=>{
    bgColor=getComputedStyle(document.body).backgroundColor;
    scene.background = new THREE.Color(bgColor);
});

camera= new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
camera.position.z=1;
camera.position.y=0;
camera.position.x=0;

renderer= new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(w,h);

container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

// bloom UnrealBloomPass  
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 0.85);
// bloomPass.threshold = 0.1;
// bloomPass.strength = 1.5;
// bloomPass.radius = 0.1;
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);


const texLoader = new THREE.TextureLoader();
const linesGroup = new THREE.Group();
linesGroup.userData.update = function (t) {
linesGroup.children.forEach((line) => line.userData.update(t));
}
scene.add(linesGroup);

function getMeshLine(index) {
    const points = [];
    const numPoints = 300;
    for (let j = 0; j < numPoints; j += 1) {
        let x = -7.5 + j * 0.05;
        let y = Math.sin(j * 0.075);
        points.push(x, y, 0);
    }
    const geometry = new MeshLineGeometry();
    geometry.setPoints(points);
    const hue = 0.75 - index * 0.02;
    const lightness = 0.5 - index * 0.02;
    const color = new THREE.Color().setHSL(hue, 1.0, lightness);
    const material = new MeshLineMaterial({
        color,
        map: texLoader.load("./assets/strokes/stroke-00.png"),
        useMap: true,
        alphaTest: 0.5,
        transparent: true,
        resolution: new THREE.Vector2(w, h),
        lineWidth: 0.5,
        blending: THREE.NormalBlending,
    });

    const meshLine = new MeshLine(geometry, material);
    const offset = index * 10;
    const amplitude = 1;
    const waveLength = 0.015;
    meshLine.userData.update = function(t) {
        for (let p = 0, len = points.length; p < len; p += 3) {
        points[p + 1] = Math.sin((p - t + offset) * waveLength) * amplitude; // update y position only
        }
        geometry.setPoints(points, (p) => 1);
    };
    return meshLine;
}
const numLines = 15;
for (let i = 0; i < numLines; i += 1) {
    const line = getMeshLine(i);
    line.position.y = i * 0.1;
    line.position.z = i * -0.3;
    linesGroup.add(line);
}

    

function handleWindowResize() {
    const neww= container.clientWidth;
    const newh=container.clientHeight;
    camera.aspect = neww / newh;
    camera.updateProjectionMatrix();
    renderer.setSize(neww, newh);
}

function animate(t=0){
    requestAnimationFrame(animate);
    linesGroup.userData.update(t * 0.1);
    composer.render(scene, camera);
    controls.update();
}
window.addEventListener('resize', handleWindowResize, false);
animate();