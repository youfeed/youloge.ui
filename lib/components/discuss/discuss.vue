<template>
  <div class="y-discuss" ref="ref">
    <div class="format">
      <div>评论 {{count}}</div>
      <div>
        <select list="sort" value="最新评论">
          <option value="最新评论">最新评论</option>
          <option value="精选评论">精选评论</option>
          <option value="拉黑评论">拉黑评论</option>
          <option value="置顶评论">置顶评论</option>
        </select>
      </div>
    </div>
    <div class="judge">
      <div class="avatar">
        <img :src="`https://img.youloge.com/${profile.avatar}!80`" />
      </div>
      <div class="textarea">
        <div class="editor" contenteditable="plaintext-only" :data-placeholder="placeholder" ref="editor" v-html="richtext" @blur="onChange"></div>
        <div class="emoji">
          <img class="icon" @click="onMainfest" tabindex="0" src="https://open.youloge.com/sticker/default/default!0">
          <div class="sticker" tabindex="0">
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
        </div>
        <div class="submit" tabindex="0" v-login="onSubmit">评论</div>
      </div>
    </div>
    <div class="comment">
      <template v-for="(item,index) in review" :key="index">
        <div class="review">
          <div class="avatar" @click="onNavigate(item.profile)">
            <img :src="`https://img.youloge.com/${item.profile.avatar}!80`" />
          </div>
          <div class="comment">
            <div class="title"><div class="name" @click="onNavigate(item.profile)">{{item.profile.name}} {{ item.profile.nick ? `@${item.profile.nick}` : '' }} </div><div class="onReport"></div></div>
            <div class="content">
              <template v-for="temp in item.content" :key="temp.uuid">
                <template v-if="temp.type == 'text'">
                  {{temp.data}}
                </template>
                <template v-if="temp.type == 'sticker'">
                  <img :src="`https://img.youloge.com/sticker/${temp.emoji}/${temp.uuid}!emoji`">
                </template>
              </template>
            </div>
            <div class="mutual">
              <!-- <div>回复</div> -->
              <div class="created">{{item.created}}</div>
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
                    <div></div>
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
import { computed, onMounted, reactive, toRefs } from 'vue';import {apiFetch,vipFetch,useStorage} from "../../utils";
const props = defineProps({ uuid:String }),emit = defineEmits(['navigate']);
const state = reactive({ 
  uuid:null,
  ref:null,
  src:null,
  editor:null,
  range:null,
  richtext:'',
  count:0,
  limit:10,
  offset:0,
  plaintext:null,
  placeholder:'善人结人心 恶语伤人心',
  // placeholder:'只能发表一次评论~',
  // placeholder:'回复 惺惺惜惺惺@25489654',
  profile:{
    uuid:'',
    avatar:'FjjHFE7RwJqfjiwM9aqL4G53kPv3'
  },
  review:[],
  emoji:'emoticon',
  mainfest:[],
  sticker:{}
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
  let io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        onReady()
      }
    });
  });
  io.observe(state.ref);
  // onReview();onMainfest();onSticker();onProfile()
  // window.addEventListener("storage", (e) => onProfile());
})
// 准备完成
const onReady = ()=>{
  onProfile();
  onReview();
}
// 处理登录
const onProfile = ()=>{
  let {uuid,avatar} = useStorage();
  state.profile.uuid = uuid
  state.profile.avatar = avatar
  console.log('onProfile',)
}
const onReview = ()=>{
  let {uuid,limit,offset} = state
  apiFetch('discuss','review',{uuid:uuid,limit:limit,offset:offset}).then(res=>{
    state.review = res.data;
    console.log(res)
  })
}
const onReplys = (item)=>{
  let {uuid,limit,offset} = item
  apiFetch('discuss','replys',{uuid:uuid,limit:limit,offset:offset}).then(res=>{
    console.log(res)
  })
}
// 路由跳转
const onNavigate = (profile)=>{
  emit('navigate',profile)
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
  let {uuid,editor} = state;let html = [];
  editor.childNodes.forEach((is)=>{
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
  if(html.length == 0){ return false }
  // uuid 必须
  // review 不为null 表示新评论
  // replys 不为null 表示回复xxx评论
  vipFetch('discuss','submit',{uuid:uuid,html:html}).then(res=>{
    console.log(res)
    onReview()
  }).catch(err=>{
    console.log(err)
  })
  editor.innerHTML = ''
}
// 加载表情包
const onMainfest = ()=>{
  let [frist] = state.mainfest;
  if(frist == undefined){
    fetch('https://open.youloge.com/sticker/mainfest.json').then(r=>r.json()).then(res=>{
      state.mainfest = res.data;
      onSticker()
    })
  }
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
  let {emoji,range} = state;
  var fragment = range.createContextualFragment(`<img src="https://img.youloge.com/sticker/${emoji}/${uuid}!emoji" data-emoji="${emoji}" data-uuid="${uuid}">`)
  range.insertNode(fragment.lastChild)
  range.setStart(range.startContainer,range.endOffset);
}
const {ref,editor,src,count,richtext,placeholder,profile,review,emoji,mainfest,sticker} = toRefs(state)
</script>
<style lang="scss">
.y-discuss{
  border: 1px solid #eee;
  border-radius: 5px;
  margin: 10px 0;
  .format{
    font-size: 20px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .dot-r{
      height: 2px;
      width: 2px;
      background: #f00;
    }
  }
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
        min-height: 120px;
        box-shadow: 1px 1px 4px #acacac;
      }
      &:focus-within .emoji,&:focus-within .submit{
        display: block;
      }
      .editor{
        height: 100%;
        width: 100%;
        outline: 0;
        padding-bottom: 20px;
        &:empty:before {
          content: attr(data-placeholder);
          color: #acacac;
        }
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
      .submit{
        display: none;
        position: absolute;
        bottom: 5px;
        right: 5px;
        cursor: pointer;
        color: #eee;
        background: #2196F3;
        border-radius: 5px;
        padding: 2px 10px;
      }
    }
  }
  .comment{
    max-height: 400px;
    overflow-y: auto;
  }
  .review{
    padding: 10px;
    display: flex;
    margin-bottom: 20px;
    &:hover{
      background: #f2f2f2;
    }
    .comment{
      flex: 1;
      white-space: pre-line;
      .title{
        display: flex;
        align-items: center;
        justify-content: space-between;
        .name{
          cursor: pointer;
        }
      }
      .content{
        padding: 5px 0;
        img{
          display: inline;
        }
      }
    }
    .avatar{
      width: 60px;
      height: 60px;
      margin-right: 10px;
      cursor: pointer;
    }
    .mutual{
      display: flex;
      align-items: center;
      gap: 10px;
      .created{
        font-size: 14px;
        color: #999;
      }
      // justify-content: space-between;
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