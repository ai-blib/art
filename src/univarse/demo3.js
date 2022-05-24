import 'three-orbitcontrols'
import * as THREE from 'three'
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js'


import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

let camera, scene, renderer, controls, loadingProcessTimeout;


export default function init() {

  const container = document.getElementById('three')
  camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 20000)
  camera.position.set(30, 0.7, 1.25)

  scene = new THREE.Scene()

  // model
  // 模型加载进度管理
  const manager = new THREE.LoadingManager();
  manager.onStart = (url, loaded, total) => {
  };
  manager.onLoad = () => {
  };
  manager.onProgress = async (url, loaded, total) => {
    console.log(total)
    if (Math.floor(loaded / total * 100) === 100) {
      loadingProcessTimeout && clearTimeout(loadingProcessTimeout);
      loadingProcessTimeout = setTimeout(() => {
        // _this.setState({loadingProcess: Math.floor(loaded / total * 100)});
        document.getElementById('progress').innerHTML = (Math.floor(loaded / total * 100))
        // Animations.animateCamera(camera, controls, { x: 0, y: 5, z: 21 }, {x: 0, y: 0, z: 0 }, 2400, () => {});
      }, 800);
    } else {
      document.getElementById('progress').innerHTML = (Math.floor(loaded / total * 100))
    }
  };
  new GLTFLoader()
    .load('https://nft-ic.oss-cn-shanghai.aliyuncs.com/collection.glb', function (gltf) {
      gltf.scene.traverse((child) => {
        child.frustumCulled = true
        //模型阴影
        child.castShadow = true
        //模型自发光
        // @ts-ignore
        // child.material.emissive = child.material.color
        // @ts-ignore
        // child.material.emissiveMap = child.material.map
      })
      scene.add(gltf.scene)


    })

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  renderer.outputEncoding = THREE.sRGBEncoding
  container.appendChild(renderer.domElement)

  const environment = new RoomEnvironment()
  const pmremGenerator = new THREE.PMREMGenerator(renderer)

  // scene.background = new THREE.Color( 0xbbbbbb );
  // scene.environment = pmremGenerator.fromScene( environment ).texture;

  controls = new OrbitControls(camera, renderer.domElement)
  controls.listenToKeyEvents(window); // optional

  //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

  controls.enableDamping = false; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = false;
  controls.panSpeed = 100
  controls.screenSpacePanning = false;


  controls.maxPolarAngle = Math.PI / 2;
  const dirLight1 = new THREE.DirectionalLight(0xffffff);
  dirLight1.position.set(1, 1, 1);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x002288);
  dirLight2.position.set(-1, -1, -1);
  scene.add(dirLight2);

  const ambientLight = new THREE.AmbientLight(0x222222);
  scene.add(ambientLight);
  // createLights()
  window.addEventListener('resize', onWindowResize)
  animate()
  createLights();
}

function createLights() {
  const ambientLight = new THREE.AmbientLight(0xe0ffff, 0.6)
  scene.add(ambientLight)

  const pointLight1 = new THREE.PointLight(0xe0ffff, 0.1, 20)
  pointLight1.position.set(-2, 3, 2)

  scene.add(pointLight1)

  const pointLight2 = new THREE.PointLight(0xe0ffff, 0.1, 20)
  pointLight2.position.set(0, 3, -6)
  scene.add(pointLight2)

  const pointLight3 = new THREE.PointLight(0xe0ffff, 0.1, 20)
  pointLight3.position.set(-12, 3, 6)
  scene.add(pointLight3)

  const pointLight4 = new THREE.PointLight(0xe0ffff, 0.1, 20)
  pointLight4.position.set(-12, 4, -4)
  scene.add(pointLight4)

  const pointLight5 = new THREE.PointLight(0xe0ffff, 0.1, 20)
  pointLight5.position.set(12, 4, -8)
  scene.add(pointLight5)

  const pointLight6 = new THREE.PointLight(0xe0ffff, 0.1, 20)
  pointLight6.position.set(12, 4, 0)
  scene.add(pointLight6)

  const pointLight7 = new THREE.PointLight(0xe0ffff, 0.1, 20)
  pointLight7.position.set(12, 4, 8)
  scene.add(pointLight7)
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)

}

//

function animate() {

  requestAnimationFrame(animate)

  controls.update() // required if damping enabled

  render()

}

function render() {

  renderer.render(scene, camera)

}
