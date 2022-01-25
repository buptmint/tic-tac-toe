<template>
    <div ref="magicBox"></div>
</template>

<script>
import * as Three from 'three';
import { OrbitControls } from "../utils/OrbitControls";
import  BasicRubik from '../utils/rubik'

export default {
    name: 'MagicBox',
    data() {
        return {
            lineMaterial: { 
                color : 0xFD802D
            },
            width: 1024,
            height: 768,
            fov: 45,//视角角度
            nearFlat: 1,
            farFlat: 1500
        }
    },
    methods: {
        initRender() {
            // 创建渲染器对象 & 抗锯齿
            this.renderer = new Three.WebGLRenderer({
                antialias : true
            });
            this.renderer.setSize(this.width, this.height);
            // 背景色
            this.renderer.setClearColor('#F26B60',1.0);
            // 设置分辨率
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.$refs.magicBox.appendChild(this.renderer.domElement);
        },
        initCamera() {
            this.camera = new Three.PerspectiveCamera( this.fov, this.width / this.height, this.nearFlat, this.farFlat);
            // 视角点位置
            this.camera.position.set( 0, 0, 300 / this.camera.aspect );
            // 相机正方向
            this.camera.up.set( 0, 1, 0 );
            // 相机朝向（ 视点 / 焦点 ）
            this.camera.lookAt( this.viewCenter );

            // 轨道视角布置器
            this.orbitController = new OrbitControls( this.camera, this.renderer.domElement );
            this.orbitController.enableZoom = false;
            this.orbitController.rotateSpeed = 2;
            this.orbitController.target = this.viewCenter;
        },
        initScene() {
            this.scene = new Three.Scene();
        },
        initLight() {
            this.light = new Three.AmbientLight(0xfefefe);
            this.scene.add(this.light);
        },
        initObject() {
            const rubik = new BasicRubik(this);
            rubik.model();
        },
        render() {
            this.renderer.render(this.scene,this.camera);
            requestAnimationFrame( this.render.bind(this) )
        }
    },
    mounted() {
        this.viewCenter = new Three.Vector3( 0, 0, 0 );
        this.initRender();
        this.initCamera();
        this.initScene();
        this.initLight();
        this.initObject();
        this.render()
    },
    beforeDestroy() {
        this.scene = null;
        this.renderer = null;
        this.camera = null;
    }
}
</script>