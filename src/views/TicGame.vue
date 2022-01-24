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
import {ElMessage} from 'element-plus'
import checkUrl from '../assets/check.png'
import crossUrl from '../assets/cross.png'

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
        this.successMessage('圆圈获胜','success');
      }
      if(val ===1){
        this.successMessage('叉叉获胜','success');
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
      this.checkCircleWin('circle')
    },
    // 叉叉落子
    crossFall(index) {
      this.crossList.push(index);
      this.boxArr[index] = 2;
      this.checkCrossWin('cross')
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
      const str = this.checkList.join('')
      // 判断行是否获胜
      if(str.indexOf('012')!==-1 || str.indexOf('345')!==-1 || str.indexOf('678')!==-1){
        this.win = 0;
      }
      // 判断列是否获胜
    },
    // 处理叉叉是否获胜
    checkCrossWin() {
      const params = this.crossList.sort((a,b)=>a-b);
      const str = this.crossList.join('')
      // 判断行是否获胜
      if(str.indexOf('012')!==-1 || str.indexOf('345')!==-1 || str.indexOf('678')!==-1){
        this.win = 1;
      }
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