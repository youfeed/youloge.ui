let sheet = document.querySelector('style').sheet,span = Array.from(new Array(24),(val,index)=>index+1);
// 'span', 'offset', 'pull', 'push'
let color = {default:'409EFF',success:'67C23A',warning:'E6A23C',danger:'F56C6C',info:'909399'}
// rounded redis bg shadow position 16by9 5by4 1by1
// select[all,none] position[] float[left,right] flex[reverse column]
Object.entries({xs:640,sm:768,md:992,lg:1200,xl:1920}).forEach(([midia,pixel])=>{
  let style = span.map(i=>{
    return `
    .y-col-${midia}-${i}{
      max-width: calc(100% / 24 * ${i});
      flex: 0 0 calc(100% / 24 * ${i});
    }
    .y-col-offset-${i} {
      margin-left: calc(100% / 24 * ${i});
    }
    `
  }).join('').concat(`
  .y-col-${midia}-hide{
    display:none;
  }`)
  sheet.insertRule(`@media screen and (max-width: ${pixel}px){ ${style} }`)
})
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
sheet.insertRule(`
  .y-button-disabled{
    cursor: not-allowed;
  }
`)

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