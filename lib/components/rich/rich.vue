<template>
  <div class="y-rich">
    <div v-html="html"></div>
  </div>
</template>
<script>
export default {name:'yRich'}
</script>
<script setup>
import { computed, reactive, toRefs } from 'vue';
const props = defineProps({
  data: {type: Array, default: []}
})
const toRender = (json,root='',block=false)=>{
  let {type,children,text,color,bgColor,fontSize,fontFamily,lineHeight,bold,underline,italic,through,ordered,src,url,sup,sub} = json;
  let childrens = children instanceof Array ? children.map(item=>{ return toRender(item,'',type==='list-item') }).join('') : text;
  switch (type) {
    case 'header1':
      root = `<h1>${childrens}</h1>`
    break;
    case 'header2':
      root = `<h2>${childrens}</h2>`
    break;
    case 'header3':
      root = `<h3>${childrens}</h3>`
    break;
    case 'header4':
      root = `<h4>${childrens}</h4>`
    break;
    case 'header5':
      root = `<h5>${childrens}</h5>`
    break;
    case 'header6':
      root = `<h6>${childrens}</h6>`
    break;
    case 'blockquote':
      root = `<blockquote>${childrens}</blockquote>`
    break;
    case 'paragraph':
      root = `<p>${childrens}</p>`
    break;
    case 'list-item':
      root = ordered ? `<ol>${childrens}</ol>` : `<ul>${childrens}</ul>`;
    break;
    case 'table-cell':
     let {isHeader} = json
      root = isHeader ? `<th>${childrens}</<th>` : `<td>${childrens}</<td>`;
    break;
    case 'table-row':
      root = `<tr>${childrens}</<tr>`;
    break;
    case 'table':
      root = `<table>${childrens}</table>`;
    break;
    case 'image':
      root = `<img src="${src}" alt="" data-href="href">`
    break;
    case 'video':
      root = `<video src="${src}" poster="" data-href="href"></video>`
    break;
    case 'code':
      let {language} = json;
      root = `<code class="language-${language}">${childrens}</<code>`
    break;
    case 'pre':
      root = `<pre>${childrens}</<pre>`
    break;
    case 'divider':
      root = `<hr/>`
    break;
    case 'link':
      root = `<a href="${url}" target="_blank">${childrens}</a>`
    break;
    default:
      root = text;
      through && (root = `<s>${root}</s>`);
      italic && (root = `<em>${root}</em>`);
      underline && (root = `<u>${root}</u>`);
      bold && (root = `<strong>${root}</strong>`);
      bold && (root = `<strong>${root}</strong>`);
      sub && (root = `<sub>${root}</sub>`);
      sup && (root = `<sup>${root}</sup>`);
      if(bgColor || color || fontSize){
        let style = '';
        color && (style = `color: ${color};`)
        fontSize && (style = `font-size: ${fontSize};`)
        fontFamily && (style = `font-family: ${fontFamily};`)
        lineHeight && (style = `line-height: ${lineHeight};`)
        bgColor && (style = `background-color: ${bgColor};`)
        root = `<span style="${style}">${root}<span>`
      }
      root = bold ? `<strong>${text}</strong>` : text;
    break;
  }
  return root
}
const html = computed(()=>{
  return props.data.map(item=>toRender(item)).join('')
})
</script>
<style lang="scss">
.y-rich{
  font-family: 'Courier New', Courier, monospace;
  img{
    max-width: 100% !important;
  }
}
</style>