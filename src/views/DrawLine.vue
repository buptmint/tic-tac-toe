<template>
    <div ref="linePlace"></div>
</template>

<script>
import * as Three from 'three';

export default {
    name: 'DrawLine',
    data() {
        return {
            lineMaterial: { 
                color : 0xFD802D
            }
        }
    },
    methods: {
        setPlace() {
            this.renderer.setSize( 1024, 768 );
            this.$refs.linePlace.appendChild( this.renderer.domElement );
        },
        replaceCamera() {
            this.camera.position.set( 0, 0, 100 );
            this.camera.lookAt( 0, 0, 0 )
        },
        geometryInit() {
            this.points.push( new Three.Vector3( -10, 0, 0 ) );
            this.points.push( new Three.Vector3( 0, 10, 0 ) );
            this.points.push( new Three.Vector3( 10, 0, 0 ) );
        },
        addScene() {
            this.scene.add(this.line);
            this.renderer.render( this.scene, this.camera )
        }
    },
    mounted() {
        this.scene = new Three.Scene();
        this.camera = new Three.PerspectiveCamera( 45, 1024 / 768, 1, 500);
        this.renderer = new Three.WebGLRenderer();
        this.setPlace();
        this.material = new Three.LineBasicMaterial( this.lineMaterial )
        this.replaceCamera();
        this.points = [];
        this.geometryInit();
        this.geometry = new Three.BufferGeometry().setFromPoints( this.points );
        this.line = new Three.Line( this.geometry, this.material );
        this.addScene();
    },
    beforeDestroy() {
        this.scene = null;
        this.renderer = null;
        this.camera = null;
    }
}
</script>