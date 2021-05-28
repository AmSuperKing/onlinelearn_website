<template>
  <div class="source-wrapper">
    <div>
      <el-row
        class="list-item"
        v-for="item of sourceList" :key="item.source_index"
      >
        <el-col :sm="24" :md="24" :lg="18" :xl="18"
          class="item-box"
        >
          <el-row class="info-wrapper">
            <div class="content-info-box" @click="handleResource(item)">
              <div  class="img-box">
                <el-image
                  :src="require('../../../assets/icons/'+matchIcon(item.source_type)+'.png')"
                  class="file-icon"
                  fit="cover"
                ></el-image>
              </div>
              <div class="content-box">
                <p class="source-title">{{item.source_name}}</p>
                <p class="source-sub-info">
                  <span class="source-info">{{item.source_type}}</span>
                  <span class="source-info">{{item.add_time}}</span>
                  <span class="source-info">{{item.count_num}} 人次查看</span>
                  <span class="view-source"><i class="el-icon-view"></i> 查看</span>
                </p>
              </div>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { courseInfoApi } from '@/api/courseInfoApi'
import download from 'downloadjs' // 引用插件

export default {
  name: 'ResourceComponent',
  data () {
    return {
      sourceList: [{
        source_name: '暂无资源',
        source_type: '',
        add_time: '',
        count_num: 0
      }]
    }
  },
  mounted () {
  },
  methods: {
    getSourceList () {
      const param = {
        course: this.$route.params.type
      }
      courseInfoApi
        .getCourseResource(param)
        .then(res => {
          // console.log(res.data)
          if (res.data.data.length) {
            this.sourceList = res.data.data
          }
        })
        .catch((e) => {
          // console.log(e)
        })
    },
    matchIcon (type) {
      if (type === 'doc' || type === 'docx') {
        return 'doc'
      } else if (type === 'ppt' || type === 'pptx') {
        return 'ppt'
      } else if (type === 'xls' || type === 'xlsx') {
        return 'xls'
      } else if (type === 'pdf') {
        return 'pdf'
      } else if (type === 'txt') {
        return 'txt'
      } else if (type === 'md') {
        return 'md'
      } else if (type === '7z' || type === 'rar' || type === 'zip') {
        return 'zip'
      } else if (type === 'gif' || type === 'jpg' || type === 'jpeg' || type === 'png') {
        return 'image'
      } else if (type === 'mp4' || type === 'flv' || type === 'ogg') {
        return 'video'
      } else if (type === 'mp3' || type === 'wav') {
        return 'audio'
      } else if (type === 'htm' || type === 'html' || type === 'css' || type === 'js') {
        return 'web'
      } else if (type === 'xml') {
        return 'xml'
      } else if (type === 'java') {
        return 'java'
      } else if (type === 'apk') {
        return 'apk'
      } else if (type === 'iso') {
        return 'iso'
      } else {
        return 'other'
      }
    },
    handleResource (item) {
      // console.log('handleResource item', item)
      const params = {
        name: item.name,
        source_name: item.source_name
      }
      courseInfoApi
        .updateFileCountNum(params)
        .then(res => {
          // console.log(res.data.message)
        })
        .catch((e) => {
          // console.log(e)
        })
      if (item.source_type === 'mp4' || item.source_type === 'flv') {
        window.open('/#' + this.$route.path + '/video/' + item.source_name.split('.')[0])
      } else if (item.source_type === 'pdf') {
        window.open('/#' + this.$route.path + '/pdf/' + item.source_name.split('.')[0] + '/1')
      } else {
        download(item.source_path)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$theme-color: #3CB371;
.source-wrapper {
  background-color: #f8f8f8;
}
.list-item {
  min-height: 100px;
  display: flex;
  justify-content: center;
}
.item-box {
  background-color: #fff;
  padding: 20px 0;
  margin: 10px;
  border: 1px solid rgba(60, 179, 113, .3);
}
.item-box:hover {
  border: 1px solid $theme-color;
  background-color: rgba(60, 179, 113, .1);
}
.info-wrapper {
  text-align: left;
}
.info-wrapper {
  cursor: pointer;
}
.content-info-box {
  display: flex;
  align-items: center;
}
.img-box {
  width: 70px;
}
.file-icon {
  width: 60px;
  height: 60px;
  margin: 10px;
}
.content-box {
  display: inline-block;
  width: 100%;
  padding-left: 10px;
}
.source-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}
.source-sub-info {
  position: relative;
}
.source-sub-info span:nth-child(3) {
  border-right: 0;
}
.source-info {
  display: inline-block;
  padding: 0 10px;
  font-size: 12px;
  color: rgb(155, 155, 155);
  border-right: 1px solid rgb(180, 180, 180);
}
.source-info:first-child {
  padding-left: 0;
}
.view-source {
  display: inline-block;
  position: absolute;
  top: -30px;
  right: 10px;
  padding: 0 10px;
  font-size: 12px;
  color: rgb(155, 155, 155);
}
.view-source:hover {
  color: #3CB371;
  font-weight: bold;
}
</style>
