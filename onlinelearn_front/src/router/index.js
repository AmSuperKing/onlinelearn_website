import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index',
    hidden: true,
    component: () => import('@/views/index/index')
  },
  {
    path: '/index',
    name: '主页',
    component: () => import('@/views/index/index')
  },
  // document 电子文档
  {
    path: '/document',
    name: '电子文档',
    component: () => import('@/views/document/document')
  },
  {
    path: '/document/:documentName',
    name: '电子文档详情',
    component: () => import('@/views/document/components/documentInfo')
  },
  {
    path: '/document/:documentName/:section',
    name: '电子文档阅读',
    component: () => import('@/views/document/components/documentDetail')
  },
  // 视频模块
  {
    path: '/videos',
    name: '视频教程',
    component: () => import('@/views/videos/videos')
  },
  {
    path: '/videos/:videoName',
    name: '视频详情',
    component: () => import('@/views/videos/videoDetail')
  },
  {
    path: '/videos/:videoName/:videoPlay',
    name: '视频播放页',
    component: () => import('@/views/videos/videoPlay')
  },
  // 电子书模块
  {
    path: '/ebooks',
    name: '电子书籍',
    component: () => import('@/views/ebooks/ebooks')
  },
  {
    path: '/ebooks/:ebookName',
    name: '电子书籍详情',
    component: () => import('@/views/ebooks/ebookDetail')
  },
  {
    path: '/ebooks/:ebookName/:pageNum',
    name: '电子书在线阅读',
    component: () => import('@/views/ebooks/ebookRead')
  },
  // 课程模块
  {
    path: '/course',
    name: '课程专区',
    component: () => import('@/views/course/course')
  },
  {
    path: '/course/:type',
    name: '课程详情',
    component: () => import('@/views/course/courseDetail')
  },
  {
    path: '/course/:type/video/:file',
    name: '课程视频播放',
    component: () => import('@/views/course/component/playVideo')
  },
  {
    path: '/course/:type/pdf/:file/:pageNum',
    name: '课程pdf阅读',
    component: () => import('@/views/course/component/pdfReader')
  },
  {
    path: '/discuss',
    name: '讨论留言',
    component: () => import('@/views/discuss/discuss')
  },
  {
    path: '/userCenter/:type',
    name: '用户中心',
    component: () => import('@/views/userCenter/userCenter')
  },
  {
    path: '/userInfoAppeal',
    name: '信息申诉',
    component: () => import('@/views/appeal/appeal.vue')
  },
  {
    path: '/about',
    name: '关于',
    component: () => import('@/views/about/about')
  },
  {
    path: '/about/:type',
    name: '关于网站',
    component: () => import('@/views/about/aboutDetail')
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const router = new VueRouter({
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

export default router
