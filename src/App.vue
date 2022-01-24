<template>
<div class="wrapper">
  <div class="page-text">ThreeJs Show Project</div>
  <p>Rotation Cube</p>
  <div>
    <div class="svg-place" ref="placement"></div>
  </div>
  <p>Draw an Arrow</p>
  <draw-line></draw-line>
  <p>Tic Tac Toe Background Box</p>
  <p style="font-size:24px">OrbitControls Available</p>
  <magic-box></magic-box>
  <p>Tic Tac Toe Box</p>
  <tic-game></tic-game>
</div>

</template>

<script>
import * as Three from 'three';
import DrawLine from './views/DrawLine.vue'
import MagicBox from './views/MagicBox.vue'
import TicGame from './views/TicGame.vue'

export default {
  name: 'App',
  components: { DrawLine, MagicBox, TicGame },
  data() {
    return {
      colorMaterial: {
        color: 0xFD802D
      }
    }
  },
  methods: {
    setPlace() {
      this.renderer.setSize( 1024, 768 );
      this.$refs.placement.appendChild( this.renderer.domElement );
    },
    setGeometry() {
      this.scene.add(this.cube);
      this.camera.position.z = 5;
    },
    animate() {
      requestAnimationFrame( this.animate );
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;
      this.renderer.render( this.scene, this.camera )
    }
  },
  mounted() {
    this.scene = new Three.Scene();
    this.camera = new Three.PerspectiveCamera( 75, 1024 / 768, 0.1, 1000);
    this.renderer = new Three.WebGLRenderer();
    this.setPlace();
    this.geometry = new Three.BoxGeometry();
    this.material = new Three.MeshBasicMaterial( this.colorMaterial );
    this.cube = new Three.Mesh( this.geometry, this.material);
    this.setGeometry();
    this.animate();
  },
  beforeDestroy() {
    this.scene = null;
    this.renderer = null;
    this.camera = null;
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
p {
  font-weight: 500;
  font-size: 32px;
  font-family: 'Times New Roman', Times, serif;
  margin-block: 0.3em;
}
.page-text {
  font-weight: 600;
  font-size: 48px;
  font-family: 'Times New Roman', Times, serif;
}
.svg-place {
  margin-top: 20px;
}
</style>