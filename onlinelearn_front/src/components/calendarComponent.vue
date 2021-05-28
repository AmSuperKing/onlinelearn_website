<template>
  <div class="clock_box">
    <div class="clock_dial">
      <div class="dial"><span></span><br><b>12</b></div>
      <div class="dial"><span></span><br><div>1</div></div>
      <div class="dial"><span></span><br><div>2</div></div>
      <div class="dial"><span></span><br><b>3</b></div>
      <div class="dial"><span></span><br><div>4</div></div>
      <div class="dial"><span></span><br><div>5</div></div>
      <div class="dial"><span></span><br><b>6</b></div>
      <div class="dial"><span></span><br><div>7</div></div>
      <div class="dial"><span></span><br><div>8</div></div>
      <div class="dial"><span></span><br><b>9</b></div>
      <div class="dial"><span></span><br><div>10</div></div>
      <div class="dial"><span></span><br><div>11</div></div>
    </div>
    <div class="H"><span></span></div>
    <div class="M"><span></span></div>
    <div class="S"><span></span></div>
  </div>
</template>

<script>
export default {
  name: 'CalendarComponent',
  data () {
    return {
    }
  },
  mounted () {
    this.makeClock()
  },
  methods: {
    makeClock () {
      var dial = document.querySelectorAll('.dial')
      var hClock = document.querySelector('.H')
      var mClock = document.querySelector('.M')
      var sClock = document.querySelector('.S')
      // console.log(dial[0].lastChild)
      // 1 制作表盘
      for (var i = 0; i < dial.length; i++) {
        var angle = 360 / 12 * i
        dial[i].style.transform = 'rotate(' + angle + 'deg)'
        dial[i].lastChild.style.transform = 'rotate(' + -angle + 'deg)'
      }
      // 2 获得当地时间，用计时器实现动画效果
      setInterval(function () {
        var nowTime = new Date()
        var H = nowTime.getHours()
        var M = nowTime.getMinutes()
        var S = nowTime.getSeconds()
        // 1s是6度，1m是6度，1h是30度
        sClock.style.transform = 'rotate(' + S * 6 + 'deg)'
        hClock.style.transform = 'rotate(' + (H * 30 + 30 / 60 * M) + 'deg)'
        mClock.style.transform = 'rotate(' + M * 6 + 'deg)'
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.clock_box{
  width: 150px;
  height: 150px;
  border: 2px solid #3CB371;
  border-radius: 50%;
  position: relative;
}
.clock_dial{
  font-size: 12px;
  width: 100%;
  height: 100%;
  position: relative;
  transform-origin: center center;
  text-align: center;

}
.dial{
  position: absolute;
  width: 4.5px;
  height: 100%;
  top: 0;
  left: 69px;

}
.dial span{
  width: 1.5px;
  height: 9px;
  background: black;
  display: inline-block;
  vertical-align: top;
}
.dial b{
  display: inline-block;
}
.H,.M,.S{
  position: absolute;
  height: 100%;
  top: 0;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  text-align: center;
}
.H span{
  margin-top: 39px;
  width: 3px;
  height: 39px;
  background: black;
  display: inline-block;
}
.M span{
  margin-top: 30px;
  height: 50px;
  width: 3px;
  background: black;
  display: inline-block;
}
.S span{
  margin-top: 22.5px;
  height: 60px;
  width: 1.5px;
  background: red;
  display: inline-block;
  position: relative;
}
.S span:after {
  content: '';
  width: 4.5px;
  height: 4.5px;
  border-radius: 50%;
  background: red;
  position: absolute;
  bottom: 4.5px;
  left: -2.5px;
}
</style>
