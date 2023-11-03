<template>
  <div class="y-discuss">
    <div>0 条评论 · 0 条精选  </div>
    <div class="judge">
      <div class="avatar">
        <img :src="`https://img.youloge.com/${profile.avatar}!80`" />
      </div>  
      <div class="textarea">
        <div class="editor" contenteditable="plaintext-only" ref="ref" v-html="richtext" @blur="onChange"></div>
        <div class="emoji" tabindex="0">
          <img class="icon" src="https://open.youloge.com/sticker/default/default!0">
          <div class="sticker">
            <div class="name">{{  sticker[emoji]?.msg || '' }}</div>
            <div class="icons">
              <template v-for="item in sticker[emoji]?.data" :key="item.uuid">
                <img :src="`https://img.youloge.com/sticker/${emoji}/${item.uuid}!emoji`" :title="item.name" @click="addEmoji(item)">
              </template>
            </div>
            <div class="tabar">
              <ul>
                <li v-for="item in mainfest" :key="item.uuid" :class="{active:item.uuid == emoji}" @click="tabMainfest(item)">
                  <img :src="`https://img.youloge.com/sticker/${item.uuid}/iconfont!emoji`" :title="item.name">
                </li>
              </ul>
            </div>
          </div>
          <div class="submit" tabindex="-1" v-login="onSubmit">评论</div>
        </div>
      </div>
      <!-- <div>善人结善语 恶语伤人心</div> -->
    </div>
    <div class="comment">
      <template v-for="(item,index) in review" :key="index">
        <div class="review">
          <div class="avatar">
            <img :src="`https://img.youloge.com/${item.profile.avatar}!80`" />
          </div>
          <div class="comment">
            <div class="title"><div class="name">@{{item.profile.name}} </div><div class="onReport">x</div></div>
            <div class="content">{{item.content}}</div>
            <div class="mutual">
              <div>回复</div>
              <div>{{item.created}}</div>
              <div v-if="item.reply">查看{{item.reply}}条回复</div>
            </div>
            <div class="reply" v-if="item.replys">
              <template v-for="(items,index) in item.replys" :key="index">
                <div class="avatar">
                  <img :src="`https://img.youloge.com/${items.profile.avatar}!80`" />
                </div>
                <div class="comment">
                  <div class="title">
                    <div class="name">@{{items.profile.name}} 回复 @{{ items.quote.name }}</div>
                    <div>x</div>
                  </div>
                  <div class="content">{{items.content}}</div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>
    </div>
    <!-- <iframe ref="ref" :src="src"></iframe> -->
  </div>
</template>
<script setup>
defineOptions({ name: 'y-discuss',inheritAttrs:false });
import { computed, onMounted, reactive, toRefs } from 'vue';import {apiFetch,vipFetch} from "../../utils";
const props = defineProps({ uuid:String })
const state = reactive({ 
  uuid:null,
  ref:null,
  src:null,
  range:null,
  richtext:'',
  count:0,
  limit:10,
  offset:0,
  profile:{
    uuid:'',
    avatar:'FjjHFE7RwJqfjiwM9aqL4G53kPv3'
  },
  review:[
    {
      uuid:'子评论UUID',
      profile:{
        name:'152',
        avatar:'FjjHFE7RwJqfjiwM9aqL4G53kPv3'
      },
      like:2,
      content:'233',
      created:'2023-10-15 14:46:33'
    },
    {
      uuid:'子评论UUID',
      profile:{
        name:'152',
        avatar:'FjjHFE7RwJqfjiwM9aqL4G53kPv3'
      },
      content:'233',
      created:'2023-10-15 14:46:33',
      reply:1,
      replys:[
        {
          profile:{
            name:'152',
            avatar:'FjjHFE7RwJqfjiwM9aqL4G53kPv3'
          },
          quote:{
            name:'594415',
            avatar:'FjjHFE7RwJqfjiwM9aqL4G53kPv3'
          },
          content:'ssss',
          like:0,
          created:'2023-10-15 14:46:33'
        }
      ]
    },
  ],
  emoji:'emoticon',
  mainfest:{},
  sticker:[]
})
/**
 * 1. 根据UUID 获取评论数据
 * 2. 渲染评论数据
 * 3. 渲染评论组件 - 已登录加载已评论
 * 4. 加载Emoji 
 * https://open.youloge.com/sticker/mainfest.json
 * https://open.youloge.com/sticker/emoticon.json
 * https://open.youloge.com/sticker/doge.json
 */
onMounted(()=>{
  state.uuid = props.uuid
  state.src = `https://open.youloge.com/discuss`;
  onReview();onMainfest();onSticker()
})
const onReview = ()=>{
  let {uuid,limit,offset} = state
  apiFetch('discuss','review',{uuid:uuid,limit:limit,offset:offset}).then(res=>{
    console.log(res)
  })
}
const onReplys = (item)=>{
  let {uuid,limit,offset} = item
  apiFetch('discuss','replys',{uuid:uuid,limit:limit,offset:offset}).then(res=>{
    console.log(res)
  })
}
// 保存光标
const onChange = (e)=>{
  var selection = window.getSelection()
  state.range = selection.getRangeAt(0)
  console.log(e,state.range)
}
// 举报评论
const onReport = (item)=>{

}
// 提交评论 
const onSubmit = (e)=>{
  let {uuid,ref} = state;let html = [];
  const list = ref.childNodes;
  ref.childNodes.forEach((is)=>{
    let type = is.nodeName.replace('#','').toLowerCase();
    let action = {
      'text':()=>{
        html.push({type:'text',data:is.data})
      },
      'img':()=>{
        let {emoji,uuid} = is.dataset;
        html.push({type:'sticker',emoji:emoji,uuid:uuid})
      }
    }
    action[type] && action[type]();
  });
  // uuid 必须
  // review 不为null 表示新评论
  // replys 不为null 表示回复xxx评论 
  vipFetch('discuss','submit',{uuid:uuid,html:html}).then(res=>{
    console.log(res)
  }).catch(err=>{
    console.log(err)
  })
  console.log(html);
}
// 加载表情包
const onMainfest = ()=>{
  fetch('https://open.youloge.com/sticker/mainfest.json').then(r=>r.json()).then(res=>{
    state.mainfest = res.data;
  })
}
// 表情包详情
const onSticker = ()=>{
  let {emoji} = state
  fetch(`https://open.youloge.com/sticker/${emoji}.json`).then(r=>r.json()).then(res=>{
    state.sticker[emoji] = res;
  })
}

// 切换表情包
const tabMainfest= (item) =>{
  state.emoji = item.uuid;
  onSticker();
}
// 添加表情
const addEmoji = (item) =>{
  let {uuid,text} = item
  let {ref,emoji,range} = state;
  // ref.focus();
  console.log(item,range)
  // 返回插入符号当前位置的selection对象
  // var selection = window.getSelection()
  // 获取包含当前节点的文档片段
  // var range = selection.getRangeAt(0)
  // 创建需追加到光标处节点的文档片段
  var fragment = range.createContextualFragment(`<img src="https://img.youloge.com/sticker/${emoji}/${uuid}!emoji" data-emoji="${emoji}" data-uuid="${uuid}">`)
  // 将创建的文档片段插入到光标处
  range.insertNode(fragment.lastChild)
  range.setStart(ref,range.endOffset);
}
const {ref,src,richtext,profile,review,emoji,mainfest,sticker} = toRefs(state)
</script>
<style lang="scss">
.y-discuss{
  border: 1px solid #eee;
  border-radius: 5px;
  .judge{
    padding: 10px;
    display: flex;
    margin-bottom: 20px;
    .avatar{
      width: 60px;
      height: 60px;
      margin-right: 10px;
    }
    .textarea{
      flex: auto;
      background: #f2f2f2;
      height: auto;
      width: 100%;
      position: relative;
      padding: 5px;
      border-radius: 5px;
      &:focus-within{
        box-shadow: 1px 1px 4px #acacac;
      }
      &:focus-within .emoji{
        display: block;
      }
      .editor{
        height: 100%;
        width: 100%;
        outline: 0;
        padding-bottom: 20px;
        img{
          display: inline;
        }
      }
      .emoji{
        display: none;
        position: absolute;
        bottom: 5px;
        left: 5px;
        right: 5px;
        &:focus-within .sticker{
          display: block;
        }
        img{
          cursor: pointer;
        }
        .icon{
          height: 18px;
          width: 18px;
        }
        .submit{
          position: absolute;
          bottom: 0;
          right: 0;
          cursor: pointer;
          color: #eee;
          background: #4CAF50;
          border-radius: 5px;
          padding: 5px 10px;
        }
        .sticker{
          display: none;
          position: absolute;
          background: #f2f2f2;
          top: 25px;
          padding: 5px;
          left: -5px;
          border-radius: 5px;
          width: 320px;
          
          .name{
            color: #333;
            font-size: 14px;
          }
          .icons{
            display: flex;
            margin: 10px 0;
            flex-wrap: wrap;
            gap: 5px;
            justify-content: space-around;
          }
          .tabar{
            padding-top: 5px;
            border-top: 1px solid #ddd;
            ul{
              display: flex;
              gap: 10px;
              li.active{
                border: 1px solid #636363;
                border-radius: 5px;
              }
            }
          }
        }
      }
    }
  }
  .review{
    padding: 10px;
    display: flex;
    margin-bottom: 20px;
    &:hover{
      background: #f2f2f2;
    }
    .comment{
      flex: auto;
    }
    .avatar{
      width: 60px;
      height: 60px;
      margin-right: 10px;
    }
    .title{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .mutual{
      display: flex;
      align-items: center;
      // justify-content: space-between;
      gap: 10px;
    }
  }
  .reply{
    display: flex;
    .avatar{
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }
  }
  iframe{
    width: 100%;
    min-height: 320px;
    height: auto;
  }
}
</style>