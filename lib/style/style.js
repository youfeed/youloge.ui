let sheet = document.querySelector('style').sheet,span = Array.from(new Array(24),(val,index)=>index+1);
let size = {xs:640,sm:768,md:992,lg:1200,xl:1920}
let round = {}
let border = {small:2,base:4,round:20} // solid dashed
let shadow  = {lights:'0px 12px 32px 4px #0000000a, 0px 8px 20px #00000014',light:'0px 0px 12px #0000001f',lighter:'0px 0px 6px #0000001f',dark:'0px 16px 48px 16px #00000014, 0px 12px 32px #0000001f, 0px 8px 16px -8px #00000029'}
let color = {default:'606266',primary:'409EFF',success:'67C23A',warning:'E6A23C',danger:'F56C6C',info:'909399'}


let justify = ['start','center','end','space-around','space-between','space-evenly'];
let position = ['absolute','fixed','relative','sticky'];
let style = [
  `*{padding:0;margin:0;box-sizing: border-box;}`,
  `.y-row{display: flex;flex-wrap: wrap;position: relative;}`,
  `.y-col{border-radius: 4px;}`,
  `::-webkit-scrollbar {width: 6px;}`,
  `::-webkit-scrollbar-thumb {background-color: #0003; border-radius: 10px; transition: all .2s ease-in-out;}`,
  `::-webkit-scrollbar-track {border-radius: 10px;}`,
];
// round redis bg shadow position 16by9 5by4 1by1
// select[all,none] position[] float[left,right] flex[reverse column]
// 响应式
//  underline y-underline:hover:after content: ""; position: absolute; left: 0; right: 0; height: 0; bottom: 0; border-bottom: 1px solid #409eff;
// 'span', 'offset', 'pull', 'push'
justify.forEach(i=>{
  style.push(`
    .y-justify-${i}{
      justify-content:${i}
    }
  `)
})
position.forEach(i=>{
  style.push(`
    .y-position-${i}{
      position:${i}
    }
  `)
})
span.forEach(i=>{
  ['','push','offset','pull','hide']
  style.push(`
  .y-col-${i}{
    max-width: calc(100% / 24 * ${i});
    flex: 0 0 calc(100% / 24 * ${i});
  }
  .y-col-offset-${i} {
    margin-left: calc(100% / 24 * ${i});
  }
  `)
});

// color.forEach((k,v)=>{
//   style.push(`
//     .y-link-${k}{
//       color:#${v};
//     }
//   `)
// });
Object.entries({xs:640,sm:768,md:992,lg:1200,xl:1920}).forEach(([midia,pixel])=>{
  let style = span.map(i=>{
    return `
    .y-col-${midia}-${i}{
      max-width: calc(100% / 24 * ${i});
      flex: 0 0 calc(100% / 24 * ${i});
    }
    
    `
  }).join('').concat(`
  .y-col-${midia}-hide{
    display:none;
  }`)
  sheet.insertRule(`@media screen and (max-width: ${pixel}px){ ${style} }`)
})
// 主色
Object.entries({primary:'409EFF',success:'67C23A',info:'E6A23C',warning:'F56C6C',danger:'909399',text:'409eff'}).forEach(([type,hex])=>{
  sheet.insertRule(`
    .y-button-${type}{
      cursor: pointer;
      user-select: none;
      outline: none;
      transition: 0.1s;
      border-radius: 4px;
      color: #fff;
      background-color: #${hex};
    }
  `)
  sheet.insertRule(`
    .y-button-${type}:focus,.y-button-${type}:hover{
      opacity: .7;
    }
  `)

})
// {large:14,small:12}
style.push(`
  .y-button-disabled{
    cursor: not-allowed;
  }
`)

sheet.insertRule(`@media all{ ${style.join('')} }`)
// console.log(sheet)

// $xs: 640px;
// $sm: 768px;
// $md: 992px;
// $lg: 1200px;
// $xl: 1920px;

// document.querySelector('style').sheet.insertRule(style, 0)
// sheet.insertRule('.ad{display:flex;}')
// sheet.insertRule('.ads{color:red}', 0)
// let sheets = document.styleSheets,len = sheets.length;
