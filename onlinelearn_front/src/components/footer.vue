<template>
  <div class="foot-wrapper">
    <div class="container">
      <el-row class="list-item">
        <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
          <div class="container-block">
            <p>拓展工具</p>
            <ul class="list-text">
              <li>
                <a href="https://www.sassmeister.com/" target="_blank" class="link-url">
                  <span>
                    <img src="../assets/imgs/sassmeister.png" alt="sassmeister logo" class="link-icon">CSS转预处理语言
                  </span>
                </a>
              </li>
              <li>
                <a href="http://www.animate.net.cn/" target="_blank">
                  <span>
                    <img src="../assets/imgs/animate.png" alt="animate logo" class="link-icon">Animate.css库动画演示
                  </span>
                </a>
              </li>
              <li>
                <a href="https://codepen.io/pen/" target="_blank">
                  <span>
                    <img src="../assets/imgs/codepen.png" alt="codepen logo" class="link-icon">Codepen在线代码
                  </span>
                </a>
              </li>
              <li>
                <a href="https://jsbin.com/?html,css,js,console,output" target="_blank">
                  <span>
                    <img src="../assets/imgs/jsbin.png" alt="jsbin logo" class="link-icon">Jsbin在线代码
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
          <div class="container-block">
            <p>网站推荐</p>
            <ul class="list-text">
              <li>
                <a href="https://github.com/" target="_blank">
                  <span>
                    <img src="../assets/imgs/github.png" alt="github logo" class="link-icon">GitHub
                  </span>
                </a>
              </li>
              <li>
                <a href="https://gitee.com/" target="_blank">
                  <span>
                    <img src="../assets/imgs/gitee.png" alt="gitee logo" class="link-icon">码云
                  </span>
                </a>
              </li>
              <li>
                <a href="https://lanhuapp.com/" target="_blank">
                  <span>
                    <img src="../assets/imgs/lanhu.png" alt="lanhu logo" class="link-icon">蓝湖平台
                  </span>
                </a>
              </li>
              <li>
                <a href="https://www.nowcoder.com/" target="_blank">
                  <span>
                    <img src="../assets/imgs/newcoder.png" alt="newcoder logo" class="link-icon">牛客网
                  </span>
                </a>
              </li>
              <li>
                <a href="https://leetcode-cn.com/" target="_blank">
                  <span>
                    <img src="../assets/imgs/leetcode.png" alt="leetcode logo" class="link-icon">力扣网
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
          <div class="container-block">
            <p>网站信息</p>
            <ul class="list-text">
              <li><router-link to="/about/contactUs"><i class="el-icon-suitcase site-icon"></i>合作联系</router-link></li>
              <li>
                <el-link
                  class="item-link"
                  type="primary"
                  href="https://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=amsuperking@qq.com"
                  target="_blank"
                >
                  <i class="el-icon-chat-line-square site-icon"></i>意见反馈
                </el-link>
              </li>
              <li><router-link to="/about/aboutUs"><i class="el-icon-s-custom site-icon"></i>关于我们</router-link></li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="copy-wrapper">
      <p class="copy-content">
        <b>声明：</b>本站旨在为广大用户提供一个良好的交流学习环境，我们不违法盗取使用任何资源获取利益，站点所有源均转载自互联网公开渠道。
        仅供网友交流学习使用，请勿用作商业用途，支持正版！本站严格遵守国家法律法规。如无意中侵犯了您的权益，请联系我们及时处理。
        意见反馈邮箱：<el-link href="mailto:amsuperking@qq.com" class="mail-address"><span style="color: #f09622;">amsuperking@qq.com</span></el-link>
      </p>
      <hr>
      <p class="copy-text">2021 - onlinelearn.com</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.foot-wrapper {
  background-color: #f0f0f0;
  border-top: 1px solid#9c9c9c;
}
.container {
  display: flex;
  // justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 40px;
  padding-left: 30px;
  border-top: 1px solid#3CB371;
  border-bottom: 1px solid#3CB371;
  background-color: #fff;
}
.list-item {
  width: 100%;
  padding-top: 5px;
}
.container-block {
  margin: 10px;
  font-size: 14px;
  color: #6d6d6d;
}
.list-text > li{
  margin: 10px 0;
  width: 100%;
}
.list-text > li > a{
  color: #6d6d6d;
  display: inline-block;
}
.link-icon {
  width: 20px;
  height: 20px;
  margin-right: 6px;
}
.item-link {
  text-decoration: none;
}
.site-icon {
  font-size: 20px;
  color: #276acf;
  margin-right: 6px;
}
.copy-wrapper {
  width: 73%;
  margin: 0 auto;
  padding: 10px 0;
  font-size: 13px;
  color: #6d6d6d;
}
.copy-content {
  text-align: justify;
  font-size: 13px;
}
.mail-address {
  text-decoration: none;
}
.copy-text {
  text-align: center;
}
</style>
