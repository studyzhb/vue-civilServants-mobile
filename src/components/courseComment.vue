/**
* 课程评论
*/
<template>
  <div class="evaluate">
    <div class="course_judge_tag" @click="openEvaluateModel">
      <p class="title">评价该课程</p>
      <p class="judge">
        <star v-model="commentCredit" disabled></star>
      </p>
    </div>
    <div class="split"></div>
    <div class="course_comment">
      <h1>评价详情 <span class="course_comment_count">（{{commentCount}}个评价）</span></h1>
      <section v-infinite-scroll="getCommentList"
               infinite-scroll-immediate-check="immediate"
               infinite-scroll-disabled="loading"
               infinite-scroll-distance="10">
        <div class="course_comment_item" v-for="(item) in commentList" :key="item.CommentId">
          <div class="left_avatar"><img src="../assets/male.png" alt=""/></div>
          <div class="right_content">
            <p class="name">
              <span>{{item.UserName}}</span>
              <star v-model="item.Score" size="small" disabled></star>
            </p>
            <p class="date">{{item.PostDate}}</p>
            <p class="content">{{item.Content}}</p>
          </div>
        </div>
      </section>
      <div class="no-data" v-if="noData">没有更多评论了...</div>
    </div>
    <!--添加评论-->
    <mb-model :is-show.sync="isShowModel">
      <div slot class="addEvaluate">
        <star v-model="addCourseData.Score" show-text></star>
        <textarea v-model="addCourseData.Content" type="text" placeholder="评论，100以内"></textarea>
        <a @click.prevent="addComment" class="submit">提交</a>
      </div>
    </mb-model>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { Toast, MessageBox, InfiniteScroll } from 'mint-ui'
  import mbModel from './mbModel.vue'
  import star from './star.vue'
  import { getCourseCommentList, AddCourseComment } from '../service/getData'

  Vue.use(InfiniteScroll)
  export default {
    data () {
      return {
        isShowModel: false,
        noData: false,
        immediate: false,
        loading: false,
        page: 1,
        commentList: [],
        commentCount: [],
        addCourseData: {
          CourseId: this.courseId,
          Content: '',
          Score: 5,
        }
      }
    },
    props: ['courseId', 'commentCredit'],
    components: {
      mbModel,
      star,
    },
    mounted () {
      this.getCommentList()
    },
    methods: {
      //课程评论列表
      async getCommentList () {
        this.noData = false
        this.loading = true
        let data = await getCourseCommentList({CourseId: this.courseId, Page: this.page})
        if (data.Type == 1) {
          let list = data.Data.List
          this.commentCount = data.Data.TotalCount
          if (list.length == 0) {
            this.noData = true
            return
          }
          this.commentList = this.commentList.concat(list)
          this.loading = false
          this.page += 1
        }
      },
      //添加课程评论
      async addComment () {
        if (this.addCourseData.Content.length > 0 && this.addCourseData.Content.length <= 100) {
          let data = await AddCourseComment(this.addCourseData)
          if (data.Type == 1) {
            Toast({message: data.Message, position: 'bottom'})
          } else if (data.Type != 401) {
            MessageBox('警告', data.Message)
          }
          this.isShowModel = false
        } else {
          Toast({message: '评论内容不能超过100字！', position: 'bottom'})
        }
      },
      openEvaluateModel () {
        this.isShowModel = true
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/mixin";

  .evaluate {
    background-color: $fill-base;
    .course_judge_tag {
      .title {
        @include ht-lineHt(112px);
        text-align: center;
        font-size: 15px;
      }
      .judge {
        width: 4.146667rem;
        height: 0.4rem;
        /*background: url(../assets/bigStar.png) no-repeat 0 0;*/
        /*background-size: 4.146667rem 4.4rem;*/
        margin: 0 auto toRem(30px);
      }
    }
    .addEvaluate {
      padding: toRem(20px) toRem(20px) 0 toRem(20px);
      text-align: center;
      .rate_text {
        display: block;
        color: $color-text-base;
        margin-top: toRem(10px);
      }
      textarea {
        display: block;
        resize: none;
        width: 100%;
        height: toRem(250px);
        font-size: 13px;
        background: #f7f9fc;
        padding: toRem(10px);
      }
      .submit {
        display: block;
        width: 100%;
        height: 1.4rem;
        line-height: 1.4rem;
        text-align: center;
        background: #fff;
        color: $brand-primary;
        font-size: 13px;
      }
    }
    .course_comment {
      padding: 0 toRem(30px);
      h1 {
        font-size: 14px;
        line-height: toRem(60px);
      }
      .course_comment_count {
        color: $color-text-thirdly;
      }
    }
    .course_comment_item {
      @extend %clearFix;
      padding: toRem(20px) 0 toRem(30px);
      border-bottom: 1px solid $border-color-light;
      .left_avatar {
        @extend %pull-left;
        width: toRem(80px);
        img {
          width: toRem(65px);
        }
      }
      .right_content {
        @extend %pull-left;
        width: toRem(600px);
        .name {
          font-size: 14px;
          font-weight: 600;
        }
        .star_grade {
          @extend %pull-right;
        }
        .date {
          color: $color-text-thirdly;
          padding: toRem(10px) 0;
        }
        .content {
          color: $color-text-secondary;
        }
      }
    }
    .split {
      display: block;
      height: toRem(20px);
      background-color: $fill-body;
    }
  }
</style>
