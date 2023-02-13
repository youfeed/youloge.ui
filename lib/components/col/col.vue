<template>
  <div :class="cls" ><slot></slot></div>
</template>
<script>
import { computed, ref } from 'vue'
export default { name:'yCol'}
</script>
<script setup>
// 'xs', 'sm', 'md', 'lg', 'xl' 'span', 'offset', 'pull', 'push'
const props = defineProps({
  span:{
    type:String,
    default:24
  },
  offset:String,
  pull:String,
  push:String,
  xs:String,
  sm:String,
  md:String,
  lg:String,
  xl:String,
})

console.log(props)
const cls = computed(()=>{
  let kind = ['y-col'];
  ['xs','sm','md','lg','xl'].forEach(size=>{
    props[size] && kind.push(`y-${size}-${props[size]}`)
  })
  return kind
})
const width = ref(props.span<=24?props.span%1==0?(100/24)*props.span+'%':'':'')
const offset = ref(props.offset<=24?props.offset%1==0?(100/24)*props.offset+'%':'':'')
</script>
<style lang="scss">
.y-col{
  display: flex;
  width:v-bind(width);
  float: left;
  margin-left:v-bind(offset)
}

$xs: 640px;
$sm: 768px;
$md: 992px;
$lg: 1200px;
$xl: 1920px;
// $list: 640px 768px 992px 1200px 1920px;
// @mixin layout {
//   @each $media in $list {
//     @media (min-width: #{$media}) { 
//       @for $i from 1 through 24 {
//         .y-col-#{$media}-#{$i} { 
//           max-width: calc(100 / 24 * $i);
//           flex: 0 0 calc(100 / 24 * $i);
//         }
//       }
//     }
//   }
// }
// xs
@media (max-width: #{$xs}) {
  @for $i from 1 through 24 {
    .y-col-sm-#{$i}{
      max-width: calc(100 / 24 * $i);
      flex: 0 0 calc(100 / 24 * $i);
    }
  }
 }
// // xs
@media screen and (max-width: 640px) {
  .y-col-sm-24{
    max-width: 200px;
    flex: 0 0 10%;
  }
}

// // sm
// @media (min-width: 768px) {  }
// // md
// @media (min-width: 992px) {  }
// // lg
// @media (min-width: 1200px) {  }
// // xl
// @media (min-width: 1920px) {  }
</style>