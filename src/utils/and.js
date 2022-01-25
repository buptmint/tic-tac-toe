export default function and( str1, str2 ){
    let newStr=''
    for(let i=0;i<str1.length;i++){
        if(str1[i] & str2[i]){
            newStr+='1'
        }else{
            newStr+='0'
        }
    }
    return newStr
}