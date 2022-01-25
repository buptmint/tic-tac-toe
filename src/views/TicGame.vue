<template>
  <div class="tic-game">
    <p class="title">Chessboard</p>
    <el-button @click="startGame" type="primary" class="begin" :disabled="buttonBroke">开始游戏</el-button>
    <div class="chess-background">
      <div
          class="unit-box"
          v-for="(item, index) in boxArr"
          :key="item"
          :index="index"
          @click="handleClick(index)"
      >
        <el-image
            v-if="boxArr[index]===1"
            :src="checkUrl"
        ></el-image>
        <el-image
            v-else-if="boxArr[index]===2"
            :src="crossUrl"
        >
        </el-image>
      </div>
    </div>
    <el-dialog
        v-model="dialogVisible"
        title="决定是谁先行"
    >
      <div>
        <el-button type="success" size="large" round @click="circleFirst">圆圈先行</el-button>
        <el-button type="warning" size="large" round @click="crossFirst">叉叉先行</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import and from '../utils/and'
import {ElMessage, ElMessageBox} from 'element-plus'
import checkUrl from '../assets/check.png'
import crossUrl from '../assets/cross.png'

const winList=[
  '111000000',
  '000111000',
  '000000111',
  '100100100',
  '010010010',
  '001001001',
  '100010001',
  '001010100',
]

export default {
  name: 'ticGame',
  data() {
    return {
      checkUrl: checkUrl,
      crossUrl: crossUrl,
      buttonBroke: false,// 按钮是否不可用
      dialogVisible: false,// 先行选择对话框
      goFirst: -1,// 状态机： 0圆形先行， 1叉叉先行
      checkList: [],// 圆圈落子数组
      crossList: [],// 叉叉落子数组
      boxArr: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      win: -1,// 0圆圈获胜，1对钩获胜
    }
  },
  watch: {
    win:function (val){
      if(val ===0){
        ElMessageBox.confirm(
          '对钩已经取得胜利，是否继续',
          '提示',
          {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(()=>{
          this.reset();
        })
      }
      if(val ===1){
        ElMessageBox.confirm(
          '叉叉已经取得胜利，是否继续',
          '提示',
          {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(()=>{
          this.reset();
        })
      }
    }
  },
  methods: {
    // 打开对话框决定圈叉是谁先行
    decideGoFirst() {
      this.dialogVisible = true;
    },
    // 开始游戏按钮绑定事件
    startGame() {
      this.decideGoFirst();
    },
    // 弹窗公用事件
    successMessage(message, type) {
      ElMessage({
        type: type,
        message: message
      })
    },
    // 圆圈先行
    circleFirst() {
      this.dialogVisible = false;
      this.goFirst = 0;
      this.successMessage('已选择圆圈先行', 'success');
      this.buttonBroke = true;
    },
    // 叉叉先行
    crossFirst() {
      this.dialogVisible = false;
      this.goFirst = 1;
      this.successMessage('已选择叉叉先行', 'success');
      this.buttonBroke = true;
    },
    // 处理按钮的逻辑
    handleClick(index) {
      // 若尚未选择先行方
      if (this.goFirst === -1) this.decideGoFirst();
      else if(this.win!==-1){
        this.successMessage('游戏已经出现了胜利者','error')
      }
      else {
        // 若已经选择先行方继续之后的逻辑,若该格子已经落子,即boxArr的值为1或者2
        if (this.boxArr[index]) {
          this.successMessage('该格子已经落子，请选择别的格子', 'error')
        } else {
          this.handleFall(index);
        }
      }
    },
    // 圆圈落子
    circleFall(index) {
      this.checkList.push(index);
      this.boxArr[index] = 1;
      if(this.checkList.length>=3){
        this.checkCircleWin()
      }
      if( this.checkList.length===5 && this.win===-1 ){
        ElMessageBox.confirm(
          '和棋!',
          '提示',
          {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(()=>{
          this.reset();
        })
      }
    },
    // 叉叉落子
    crossFall(index) {
      this.crossList.push(index);
      this.boxArr[index] = 2;
      if(this.crossList.length>=3){
        this.checkCrossWin()
      }
      if( this.crossList.length===5 && this.win===-1 ){
        ElMessageBox.confirm(
          '和棋!',
          '提示',
          {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(()=>{
          this.reset();
        })
      }
    },
    // 处理落子逻辑
    handleFall(index) {
      // 若两数组长度相等
      if (this.checkList.length === this.crossList.length) {
        if (this.goFirst === 0) {
          this.circleFall(index)
        } else if (this.goFirst === 1) {
          this.crossFall(index)
        }
      } else {
        // 若长度不相等
        if (this.checkList.length < this.crossList.length) {
          this.circleFall(index)
        } else {
          this.crossFall(index)
        }
      }
    },
    //处理圆圈是否获胜
    checkCircleWin() {
      this.checkList.sort((a,b)=>a-b);
      const arr = [];
      arr.length=9;
      arr.fill( 0 );
      for( let i=0; i<9; i++ ) {
        if( this.checkList.indexOf(i) !== -1 ){
          arr[i]=1;
        }
      }
      const str = arr.join('');
      for(let i=0;i<winList.length;i++){
        if(and(str,winList[i])===winList[i]){
          this.win=0;
        }
      }
    }, 
    // 处理叉叉是否获胜
    checkCrossWin() {
      this.crossList.sort((a,b)=>a-b);
      const arr = [];
      arr.length=9;
      arr.fill( 0 );
      for( let i=0; i<9; i++ ) {
        if( this.crossList.indexOf(i) !== -1 ){
          arr[i]=1;
        }
      }
      const str = arr.join('')
      for(let i=0;i<winList.length;i++){
        if(and(str,winList[i])===winList[i]){
          this.win=1;
        }
      }
    },
    // 重置棋盘状态
    reset() {
      this.goFirst=-1;
      for(let i=0;i<this.boxArr.length;i++){
        this.boxArr[i]=0;
      }
      this.win=-1;
      this.crossList=[];
      this.checkList=[];
      this.buttonBroke=false;
      console.log(this.boxArr)
    }
  }
}
</script>

<style lang="scss" scoped>
.tic-game {
  width: 1024px;
  height: 768px;
  background: #FFECEC;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .begin {
    margin: 10px;
  }

  .title {
    font-size: 20px;
  }

  .chess-background {
    height: 600px;
    width: 600px;
    border: solid 2px black;
    display: flex;
    flex-wrap: wrap;

    .unit-box {
      width: 198px;
      height: 198px;
      border: 1px solid black;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }

  .el-dialog {
    .el-button {
      margin: 50px;
    }
  }
}
</style>