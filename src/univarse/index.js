import "three-orbitcontrols"
import * as THREE from 'three';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {FirstPersonControls} from 'three/examples/jsm/controls/FirstPersonControls'
// import {FirstPersonControls} from '@types/three/examples/jsm/controls/FirstPersonControls'
import Hls from 'hls.js'
import 'three-orbitcontrols'
export default class Universe {
   renderer = null;
   camera;
   scene;
   activeCamera;
   player;
   hls;
  clock;
  FirstPersonControls; //第一视角
  joystick;
  constructor() {
    this.init()

  }

  animate() {
    const animate = () => {

      requestAnimationFrame(animate);

      //更新控制器
      this.FirstPersonControls.update(this.clock .getDelta());
      this.renderer.render(this.scene, this.camera);


    }

    animate()

  }

  init() {

    this.createScene()
    // createObjects()
    // this.createColliders()
    this.loadModel();
    this.createPlayer()
    this.createCamera()
    this.createLights()
    this.clock = new THREE.Clock();

    this.animate()
    this.setControls();

  }

  setControls() {
    // let controls = new OrbitControls(this.camera, this.renderer.domElement);
    //设置控制器的中心点
    // controls.target.set( 0, 5, 0 );
    // // 如果使用animate方法时，将此函数删除
    // //controls.addEventListener( 'change', render );
    // // 使动画循环使用时阻尼或自转 意思是否有惯性
    // controls.enableDamping = true;
    // //动态阻尼系数 就是鼠标拖拽旋转灵敏度
    // //controls.dampingFactor = 0.25;
    // //是否可以缩放
    // controls.enableZoom = true;
    // //是否自动旋转
    // controls.autoRotate = false;
    // controls.autoRotateSpeed = 0.5;
    // //设置相机距离原点的最远距离
    // controls.minDistance = 1;
    // //设置相机距离原点的最远距离
    // controls.maxDistance = 2000;
    // //是否开启右键拖拽
    // controls.enablePan = true;
    // @ts-ignore
   // let controls = new FirstPersonControls(this.camera);
   //  controls.lookSpeed = 0.2; //鼠标移动查看的速度
   //  // @ts-ignore
   //  controls.movementSpeed = 20; //相机移动速度
   //  controls.noFly = true;
   //  controls.constrainVertical = true; //约束垂直
   //  controls.verticalMin = 1.0;
   //  controls.verticalMax = 2.0;
   //  controls.lon = -100; //进入初始视角x轴的角度
   //  controls.lat = 0; //初始视角进入后y轴的角度
   //  this.scene.add(controls);

  }

  loadModel() {

    const loader = new FBXLoader();
    loader.load('../House.FBX', (object) => {

      object.traverse((child) => {
        console.log(child, 120)
        if (child.isMesh) {

          child.castShadow = true;
          child.receiveShadow = true;
          child.frustumCulled = false;
          //模型阴影
          child.castShadow = true;
          //模型自发光
          // @ts-ignore
          child.material.emissive =  child.material.color;
          // @ts-ignore
          child.material.emissiveMap = child.material.map ;
        }
        if (child.name.includes('photo1')) {
          this.initWalls(child)
          // child.material= this.addVideo();
        }
      });

      this.scene.add(object);
      // this.getHLS('https://etlive-mediapackage-fastly.cbsaavideo.com/dvr/manifest.m3u8',document.querySelector('video'))
    });
  }

  initWalls(child) {
    const texture = new THREE.TextureLoader().load('tex/TexturesCom_Wall_Cement1B_2.4x2.4_1K_normal.png')
    texture.encoding = THREE.sRGBEncoding
    texture.flipY = false
    child.material = new THREE.MeshStandardMaterial({
      map: texture
    })
    child.material.roughness = 0.5
    child.material.metalness = 0.6
  }



  createScene() {
    const container = document.getElementById('three');
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xa0a0a0);
    // this.scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

    this.renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);
    window.addEventListener('resize', this.onResize);

  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    this.camera.position.set(100, 200, 300);
    let controls = new FirstPersonControls(this.camera);
    controls.lookSpeed = 0.2; //鼠标移动查看的速度
    // @ts-ignore
    controls.movementSpeed = 200; //相机移动速度
    controls.noFly = true;
    controls.constrainVertical = true; //约束垂直
    controls.verticalMin = 1.0;
    controls.verticalMax = 2.0;
    controls.lon = -100; //进入初始视角x轴的角度
    controls.lat = 0; //初始视角进入后y轴的角度
    this.FirstPersonControls=controls
  }

  createPlayer() {
    const geometry = new THREE.BoxGeometry(1, 2, 1)
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true
    })
    this.player = new THREE.Mesh(geometry, material)
    this.player.name = 'player'
    geometry.translate(0, 1, 0)
    this.player.position.set(-5, 0, 5)
    this.scene.add(this.player)
  }
   createJoyStick() {

    this.joystick = new JoyStick({
      onMove: function(forward, turn) {
        turn = -turn
        if(Math.abs(forward) < 0.3) forward = 0
        if(Math.abs(turn) < 0.1) turn = 0
        move.forward = forward
        move.turn = turn
      }
    })
  }
  createLights() {

    //给场景增加环境光
    let Ambient = new THREE.AmbientLight(0x404040, 1);
    this.scene.add(Ambient);

    //给场景添加太阳光
    let Sun = new THREE.DirectionalLight(0xffffff, 1);
    Sun.position.set(20, 20, 20);
    // Sun.castShadow = true;

    // //设置相机渲染面积
    // Sun.shadow.camera.near = 0.01;
    // Sun.shadow.camera.far = 60;
    // Sun.shadow.camera.top = 22;
    // Sun.shadow.camera.bottom = -22;
    // Sun.shadow.camera.left = -35;
    // Sun.shadow.camera.right = 35;
    // // //设置阴影分辨率
    // Sun.shadow.mapSize.width = 2048;  // default
    // Sun.shadow.mapSize.height = 2048; // default
    // //阴影限制
    // Sun.shadow.radius = 1;
    this.scene.add(Sun);
  }

  // streemVideo(child) {
  //
  //   // Video material
  //   var video = document.querySelector('video');
  //
  //   let texture = new THREE.VideoTexture(video)
  //   let material = new THREE.MeshPhongMaterial({
  //     map: texture, // 设置纹理贴图
  //   }); //材质对象Material/
  //   child.material = material
  //   var htmlVideo = texture.video;
  //
  //   //   if (Hls.isSupported()) {
  //   //       var hls = new Hls();
  //   //       hls.loadSource(stream1);
  //   //       hls.attachMedia(video);
  //   //       engine.hideLoadingUI();
  //   //       hls.on(Hls.Events.MANIFEST_PARSED,function() {
  //   //         TV.actionManager.registerAction(
  //   //           new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger,
  //   //             function(event) {
  //   //               htmlVideo.play();
  //   //             })
  //   //         );
  //   //       });
  //   //     } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
  //   //       video.src = stream1;
  //   //       engine.hideLoadingUI();
  //   //       video.addEventListener('loadedmetadata',function() {
  //   //         TV.actionManager.registerAction(
  //   //           new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger,
  //   //             function(event) {
  //   //               htmlVideo.play();
  //   //             })
  //   //         );
  //   //       });
  //   //     }
  //   //
  //   //   return scene;
  //   // };
  // }

  // getHLS(sourceURL, el) {
  //   if (Hls.isSupported()) {
  //     this.hls = new Hls()
  //     this.hls.loadSource(sourceURL)
  //     this.hls.attachMedia(el)
  //     this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
  //       console.log('加载成功')
  //     })
  //     this.hls.on(Hls.Events.ERROR, (event, data) => {
  //       throw new Error(data.response.code + ' ' + data.response.text)
  //     })
  //   }
  //   this.player = el
  // }
}

