<template>
    <div class="tic-game">
        <p class="title">Chessboard</p>
        <div class="chess-background">
            <div 
                class="unit-box"
                v-for="(item, index) in boxArr"
                :key="item"
                :index="index"
            >

            </div>
        </div>
        
    </div>
</template>

<script>
export default {
    name: 'ticGame',
    data() {
        return {
            dialogVisible : false,
        }
    },
    methods: {
        // 创造井字棋盘数组, 状态机 0未输入， 1黑方落子， 2白方落子
        createCheckerBox() {
            this.boxArr = [];
            this.boxArr.length = 9;
            this.boxArr.fill(0);
        },

    },
    created() {
        this.createCheckerBox();
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
        }
    }
}
</style>