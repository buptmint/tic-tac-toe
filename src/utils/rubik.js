import * as Three from 'three'

// 基础模型参数
const BasicParams = {
    x: 0,
    y: 0,
    z: 0,
    num: 3,
    len: 25,
    // 六个面的颜色
    colors: [
        '#ff6b02',
        '#dd422f',
        '#ffffff',
        '#fdcd02',
        '#3d81f7',
        '#019d53'
    ]
};

function faces(rgbaColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    // 返回 CanvasRenderingContext2D 二维渲染上下文
    let context = canvas.getContext('2d');
    context.fillStyle = 'rgba(0, 0, 0, 1)';
    context.fillRect( 0, 0, 256, 256 );
    context.rect( 16, 16, 224, 224 );
    context.lineJoin = 'round';
    context.lineWidth = 16;
    context.fillStyle = rgbaColor;
    context.strokeRect = rgbaColor;
    context.stroke();
    context.fill();
    return canvas
}

// x,y,z 魔方中心点坐标
// num 魔方阶数
// len 小方块宽高
// colors 魔方六面体颜色
function SimpleCube( {x, y, z, num, len, colors} ){
    let [ leftUpX, leftUpY, leftUpZ ] = [ x-num/2*len, y+num/2*len, z+num/2*len ];
    const cubes = [];
    for( let i=0; i<num; i++ ) {
        for( let j=0; j<num*num; j++ ) {
            const myFaces = [];
            for( let k=0; k<6; k++ ) {
                myFaces[k] = faces(colors[k]);
            }
            const materials = [];
            for( let k=0; k<6; k++ ) {
                let texture = new Three.Texture(myFaces[k]);
                texture.needsUpdate = true;
                materials.push(new Three.MeshLambertMaterial({ map: texture }));
            }
            let cubeGeo = new Three.BoxGeometry(len, len, len);
            let cube = new Three.Mesh(cubeGeo, materials);

            // 依次计算小方块的中心点坐标
            cube.position.x = (leftUpX + len / 2) + (j % num) * len;
            cube.position.y = (leftUpY - len / 2) - parseInt(j / num) * len;
            cube.position.z = (leftUpZ - len / 2) - i * len;
            cubes.push( cube )
        }
    }
    return cubes;
}

export default class Rubik {
    constructor( main ) {
        this.main = main;
    }
    model() {
        this.cubes = SimpleCube( BasicParams ); //生成魔方
        for( let i = 0; i<this.cubes.length; i++ ){
            let item = this.cubes[i];
            this.main.scene.add(item);
        }
    }
}