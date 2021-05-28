<template>
  <div class="card-box">
    <div class="card-stick"></div>
    <div class="recword-wrapper">
      <p class="rec-word-title">一言</p>
      <p class="rec-word-content">{{currWord.content}}</p>
      <p class="rec-word-author">——{{currWord.author}}</p>
    </div>
  </div>
</template>

<script>
import { recWord } from '@/api/recWord'

export default {
  name: 'RecWord',
  data () {
    return {
      currWord: {},
      wordArr: ''
    }
  },
  mounted () {
    setInterval(this.getRecWord(), 120000)
  },
  methods: {
    getRecWord () {
      if (this.wordArr.length === 0) {
        this.getWordArr()
      } else {
        var len = this.wordArr.length
        var ranNum = Math.floor(Math.random() * len)
        this.currWord = this.wordArr[ranNum]
      }
    },
    getWordArr () {
      recWord
        .getRecWord()
        .then(res => {
          this.wordArr = res.data
          var len = this.wordArr.length
          var ranNum = Math.floor(Math.random() * len)
          this.currWord = this.wordArr[ranNum]
        })
        .catch(e => {
          this.$message.error(e)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.card-box {
  position: relative;
  display: flex;
  justify-content: center;
}
.card-stick {
  position: absolute;
  top: -8px;
  width: 40px;
  height: 15px;
  background: rgba(255, 255, 255, .2);
  border: 1px solid #bfbfbf;
  transform: rotate(-45deg);
}
.recword-wrapper {
  padding: 15px;
  background-color: #F5F5DC;
  border-radius: 8px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}
.rec-word-title {
  font-weight: bold;
  font-size: 14px;
  color: rgb(151, 151, 151);
}
.rec-word-content {
  text-indent: 2em;
  justify-content: center;
  font-size: 14px;
  color: #aaa;
}
.rec-word-author {
  text-align: right;
  font-size: 14px;
  color: #aaa;
}
</style>
