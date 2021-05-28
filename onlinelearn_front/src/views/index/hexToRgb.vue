<template>
  <div>
    <el-row class="input-row">
      <!-- HEX颜色值 -->
      <el-row :xs="24" :sm="24" :md="12" :lg="12" :xl="12" :gutter="4">
        <el-col :span="16">
          <label for="hexColor">HEX颜色值:</label>
          <el-tooltip content="点击右侧按钮选择或输入颜色值" placement="top" effect="light">
            <el-input
              id="hexColor"
              placeholder="HEX颜色值,如#3cb371"
              :value="hexColor"
            >
            </el-input>
          </el-tooltip>
        </el-col>
        <el-col :span="8">
          <el-color-picker
            class="color-pick-btn"
            v-model="hexColor"
            @change="hexToRgb">
          </el-color-picker>
        </el-col>
      </el-row>
      <!-- RGB颜色值 -->
      <br>
      <el-row :xs="24" :sm="24" :md="12" :lg="12" :xl="12" :gutter="4">
        <el-col :span="16">
          <label for="rgbColor">RGB颜色值:</label>
          <el-tooltip content="点击右侧按钮选择或输入颜色值" placement="top" effect="light">
            <el-input
              id="rgbColor"
              placeholder="RGB颜色值,如rgb(60, 179, 113)"
              :value="rgbColor"
            >
            </el-input>
          </el-tooltip>
        </el-col>
        <el-col :span="8">
          <el-color-picker
            class="color-pick-btn"
            color-format="rgb"
            v-model="rgbColor"
            @change="rgbToHex">
          </el-color-picker>
        </el-col>
      </el-row>
      <!-- 颜色显示板 -->
      <el-row :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="color-board" :style="{background: boardColor}"></div>
      </el-row>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'HexToRgb',
  components: {

  },
  data () {
    return {
      hexColor: '#3cb371',
      rgbColor: 'rgb(60, 179, 113)',
      boardColor: '#3cb371'
    }
  },
  methods: {
    hex2rgb (hexColor) {
      if (hexColor) {
        if (hexColor.substr(0, 1) === '#') {
          hexColor = hexColor.substring(1)
          hexColor = hexColor.toLowerCase()
          var b = []
          for (let x = 0; x < 3; x++) {
            b[0] = hexColor.substr(x * 2, 2)
            b[1] = b[0].substr(0, 1)
            b[2] = b[0].substr(1, 1)
            b[3] = '0123456789abcdef'
            b[20 + x] = b[3].indexOf(b[1]) * 16 + b[3].indexOf(b[2])
          }
          return 'rgb(' + b[20] + ',' + b[21] + ',' + b[22] + ')'
        } else {
          this.$message.warning('请输入带#的HEX颜色值')
        }
      }
    },
    hexToRgb () {
      this.rgbColor = this.hex2rgb(this.hexColor)
      this.boardColor = this.hexColor
    },
    hex (x) {
      return ('0' + parseInt(x).toString(16)).slice(-2)
    },
    rgbToHex () {
      // console.log('rgbColor selected:', this.rgbColor)
      if (this.rgbColor) {
        var colorNum = this.rgbColor.split('(')[1].replace(')', '').split(',')
        var r = Number(colorNum[0])
        var g = Number(colorNum[1])
        var b = Number(colorNum[2])
        // console.log(r, g, b)
        const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
        this.hexColor = hex
        this.boardColor = this.rgbColor
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#hexColor:hover, #rgbColor:hover {
  cursor: pointer;
}
.color-pick-btn {
  margin-top: 24px;
}
.color-board {
  width: 100px;
  height: 100px;
  margin-top: 10px;
  border: 1px solid #bfbfbf;
}
</style>
