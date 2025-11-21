/*
* 字节转 KB MB GB TB
*/
export default (size)=>{
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let index = 0;
    while (size >= 1024 && index < units.length - 1) {
        size /= 1024;
        index++;
    }
    return `${index === 0 ? size : size.toFixed(2)} ${units[index]}`;
}