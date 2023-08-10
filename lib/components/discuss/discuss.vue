<template>
  <div class="y-discsss" ref="target">
    <div>0 条评论</div>
    <div>
      <div class="y-comment" v-login="onComment">
        <div>头像</div>
        <div>
          <div>是否引用</div>
          <div ref="input" aria-label="添加评论…">
            <div contenteditable>
              输入框
            </div>
          </div>
        </div>
        <div>发布</div>
      </div>
    </div>
    <div>
      <template v-for="(item,index) in review" :key="index">
        <div class="y-review">
          <div>
            {{ item.uuid }}
            {{ item.name }} + {{ item.name }} 
          </div>
          <template v-for="(items,indexs) in item.replys" :key="indexs">
            <div class="y-reply">
              {{ items.uuid }} 条回复
            </div>
          </template>
          <template v-if="items.replys">
            <span>{{ items.reply }}</span>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
export default {name:'yDiscuss'}
</script>
<script setup>
import { inject, onMounted, reactive, toRefs } from 'vue'
const useFetch = inject('useFetch')
const props = defineProps({
  uuid:String,
})
const state = reactive({
  target:null,
  comment:'',
  showComments:true,
  context:[],
  review:[]
})
onMounted(()=>{
  var io = new IntersectionObserver(([{isIntersecting}])=>{
    isIntersecting && getReview()
  }, {rootMargin: "200px 0px"});
  io.observe(state.target)
})
// 懒加载评论
const getReview = (offset=0)=>{
  useFetch().api('discuss','review',{uuid:props.uuid,offset:offset}).then(res=>{
    console.log(res)
  })
}
// 慢加载回复
const getReply = (offset=0)=>{
  useFetch().api('discuss','reply',{uuid:props.uuid,offset:offset}).then(res=>{
    console.log(res)
  })
}
const {target,review} = toRefs(state)
</script>
<style lang="scss">
.y-discsss{
  min-height: 200px;
}
</style>