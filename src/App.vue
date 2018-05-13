<template>
  <div id="app">
    <div class="wrapper">
      <div class="model"
           v-show="model"
           @click="model = false">
        <div class="model-show">
          <img :src="modelSrc"
               alt="">
        </div>
      </div>
      <div class="show-info">
        <div class="crop">
          <vueCropper ref="cropper"
                      :img="option.img"
                      :outputSize="option.size"
                      :outputType="option.outputType"
                      :info="true"
                      :full="option.full"
                      :canMove="option.canMove"
                      :canMoveBox="option.canMoveBox"
                      :fixedBox="option.fixedBox"
                      :original="option.original"
                      @realTime="realTime"></vueCropper>
        </div>
        <el-card class="box-card">
          <div slot="header"
               class="clearfix">
            <span>图片编辑</span>
          </div>
          <el-row>
            <el-col :span="24">
              <div class="grid-content crop-button">
                <el-form ref="form">
                  <el-form-item>
                    <el-button-group>
                      <el-button @click="changeImg">随便看看</el-button>
                      <label class="el-button el-button--default upload-btn"
                             for="uploads">上传图片</label>
                      <input type="file"
                             id="uploads"
                             style="position:absolute; clip:rect(0 0 0 0);"
                             accept="image/png, image/jpeg, image/gif, image/jpg"
                             @change="uploadImg($event, 1)">
                    </el-button-group>
                    <el-button-group>
                      <el-button v-if="!crap"
                                 @click="startCrop"
                                 :disabled="empty">开始裁剪
                      </el-button>
                      <el-button v-else
                                 @click="stopCrop"
                                 :disabled="empty">结束裁剪
                      </el-button>
                      <el-button @click="clearCrop"
                                 :disabled="empty">取消裁剪
                      </el-button>
                    </el-button-group>
                    <el-button-group>
                      <el-button @click="rotateLeft"
                                 :disabled="empty">向左旋转
                      </el-button>
                      <el-button @click="rotateRight"
                                 :disabled="empty">向右旋转
                      </el-button>
                    </el-button-group>
                    <el-button-group>
                      <el-button @click="changeScale(-1)"
                                 icon="el-icon-zoom-out"
                                 :disabled="empty">缩小
                      </el-button>
                      <el-button @click="changeScale(1)"
                                 icon="el-icon-zoom-in"
                                 :disabled="empty">放大
                      </el-button>
                    </el-button-group>
                    <el-button-group>

                      <el-button @click="preview"
                                 icon="el-icon-view"
                                 :disabled="empty">预览
                      </el-button>
                      <el-button @click="down"
                                 icon="el-icon-download"
                                 :disabled="empty">保存
                      </el-button>
                    </el-button-group>

                    <el-button-group>
                      <el-button @click="refresh"
                                 icon="el-icon-delete"
                                 :disabled="empty">清空
                      </el-button>
                    </el-button-group>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="box-card">
          <div slot="header"
               class="clearfix">
            <span>证件水印</span>
          </div>
          <el-row>
            <el-col :span="24">
              <div class="grid-content">
                <el-form ref="form"
                         :label-position="labelPosition"
                         label-width="80px">
                  <el-form-item label="水印内容">
                    <el-input v-model="config.text"
                              placeholder="请输入内容"
                              :disabled="empty"></el-input>
                  </el-form-item>
                  <el-form-item label="输出格式">
                    <el-select v-model="option.outputType"
                               placeholder="请选择"
                               :disabled="empty">
                      <el-option label="png"
                                 value="png"></el-option>
                      <el-option label="jpeg"
                                 value="jpeg"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="default"
                               @click="watermarkPreview('base64')"
                               :disabled="empty">预览
                    </el-button>
                    <el-button @click="downWatermark"
                               :disabled="empty">保存
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </div>
    <!-- <div class="show-preview"
         :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}">
      <div :style="previews.div">
        <img :src="previews.url"
             :style="previews.img">
      </div>
    </div> -->
    <canvas id="myCanvas"
            style="display: none;"></canvas>
  </div>
</template>

<script>
  import Unsplash, {toJson} from 'unsplash-js'
  import vueCropper from 'vue-cropper'
  import Watermark from './libs/watermark.js'

  const unsplash = new Unsplash({
    applicationId: process.env.APPLICATION_ID,
    secret: process.env.SECRET,
    callbackUrl: process.env.CALLBACK_URL
  })

  export default {
    name: 'App',
    data() {
      return {
        empty: false,
        labelPosition: 'top',
        reRender: true,
        model: false,
        modelSrc: '',
        crap: false,
        previews: {},
        fileName: 'watermark',
        lists: [
          {img: 'https://windmt.com/sinaimg/ws3.sinaimg.cn/large/006tNc79ly1fr8whqqdojj30jo0d0td6.jpg'},
          {img: 'https://windmt.com/sinaimg/ws3.sinaimg.cn/large/006tNc79ly1fr8wje05d5j30go0ainb6.jpg'},
          {img: 'https://windmt.com/sinaimg/ws1.sinaimg.cn/large/006tNc79ly1fr8wk1yi42j30go0bedr7.jpg'},
          {img: 'https://windmt.com/sinaimg/ws4.sinaimg.cn/large/006tNc79ly1fr8wkmiqznj30dw08sgna.jpg'},
          {img: 'https://windmt.com/sinaimg/ws2.sinaimg.cn/large/006tNc79ly1fr8wl3sgbyj30go0ajwf8.jpg'}
        ],
        option: {
          img: '',
          size: 1,
          full: false,
          outputType: 'png',
          canMove: true,
          fixedBox: false,
          original: false,
          canMoveBox: false
        },
        downImg: '#',
        config: {
          text: '此证件仅供办理业务使用，他用无效',
          id: 'myCanvas',
          color: '#f9f9f9',
          xStart: 0,
          yStart: -(200 * 0.71),
          rotate: 45,
          opacity: 0.4,
          width: 200,
          height: 200,
          imgUrl: ''
        }
      }
    },
    methods: {
      changeImg() {
        if (process.env.APPLICATION_ID) {
          unsplash.photos
            .getRandomPhoto()
            .then(toJson)
            .then(json = > {
            this.option.img = json.urls.regular
        })
        .
          catch(err = > {
            if(err) {
            }
            this.option.img = this.lists[~~(Math.random() * this.lists.length)].img
        })
        } else {
          this.option.img = this.lists[~~(Math.random() * this.lists.length)].img
        }
        this.reRender = true
        this.empty = false
      },
      startCrop() {
        // start
        this.crap = true
        this.$refs.cropper.startCrop()
        this.reRender = true
      },
      stopCrop() {
        //  stop
        this.crap = false
        this.$refs.cropper.stopCrop()
        this.reRender = true
      },
      clearCrop() {
        // clear
        this.$refs.cropper.clearCrop()
        this.reRender = true
      },
      refresh() {
        // clear
        this.$refs.cropper.refresh()
        this.option.img = 'https://ws1.sinaimg.cn/large/006tNc79ly1fr8urj09g2g300100101d.gif'
        this.reRender = true
        this.empty = true
      },
      changeScale(num) {
        num = num || 1
        this.$refs.cropper.changeScale(num)
        this.reRender = true
      },
      rotateLeft() {
        this.$refs.cropper.rotateLeft()
        this.reRender = true
      },
      rotateRight() {
        this.$refs.cropper.rotateRight()
        this.reRender = true
      },
      finish(type) {
        // 输出
        // let test = window.open('about:blank')
        // test.document.body.innerHTML = '图片生成中..'
        if (type === 'blob') {
          this.$refs.cropper.getCropBlob(data = > {
            let img = window.URL.createObjectURL(data)
            this.model = true
          this.modelSrc = img
        })
        } else {
          this.$refs.cropper.getCropData(data = > {
            this.model = true
          this.modelSrc = data
        })
        }
      },
      preview(type, data) {
        let hasData = typeof data !== 'undefined' && data != null
        let blobType = type === 'blob'

        if (hasData) {
          this.model = true
          this.modelSrc = blobType ? window.URL.createObjectURL(data) : data
        } else {
          if (blobType) {
            this.$refs.cropper.getCropBlob(data = > {
              let img = window.URL.createObjectURL(data)
              this.model = true
            this.modelSrc = img
          })
          } else {
            this.$refs.cropper.getCropData(data = > {
              this.model = true
            this.modelSrc = data
          })
          }
        }
      },
      watermarkPreview() {
        let that = this
        this.drawText().then(function () {
          that.preview('', that.downImg)
          that.reRender = false
        })
      },
      drawText() {
        let that = this
        return new Promise(function (resolve, reject) {
          that.$refs.cropper.getCropData(data = > {
            let image = new Image()
            image.src = data
          image.onload = function () {
            that.config.yStart = -(image.width * 0.71)
            that.config.width = image.width
            that.config.height = image.height
            that.config.imgUrl = data

            new Watermark().mark(that.config).then(function () {
              that.downImg = document.getElementById('myCanvas').toDataURL('image/png')
              resolve()
            })
          }
        })
        })
      },
      downWatermark() {
        let aLink = document.createElement('a')
        aLink.download = this.fileName
        let that = this
        if (!this.reRender && that.downImg !== '#') {
          aLink.href = that.downImg
          aLink.click()
        } else {
          this.drawText().then(function () {
            aLink.href = that.downImg
            aLink.click()
          })
        }
      },
      uploadImg(e) {
        this.reRender = true
        this.empty = false
        // 上传图片
        // this.option.img
        let file = e.target.files[0]
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          alert('图片类型必须是. gif,jpeg,jpg,png,bmp 中的一种')
          return false
        }
        let fileName = file.name.replace(/\.\w+$/, '')
        if (fileName) {
          this.fileName = fileName + '_watermark'
        }

        let reader = new FileReader()
        reader.onload = e =
      >
        {
          let data
          if (typeof e.target.result === 'object') {
            // 把 Array Buffer 转化为 blob 如果是 base64 不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]))
          } else {
            data = e.target.result
          }
          this.option.img = data
        }
        // 转化为 base64
        // reader.readAsDataURL(file)
        // 转化为 blob
        reader.readAsArrayBuffer(file)
      },
      imgLoad(msg) {
        console.log(msg)
      },
      // 实时预览函数
      realTime(data) {
        this.previews = data
      },
      down(type) {
        // event.preventDefault()
        let aLink = document.createElement('a')
        aLink.download = this.fileName.replace(/_watermark$/, '')
        // 输出
        if (type === 'blob') {
          this.$refs.cropper.getCropBlob(data = > {
            this.downImg = window.URL.createObjectURL(data)
          aLink.href = window.URL.createObjectURL(data)
          aLink.click()
        })
        } else {
          this.$refs.cropper.getCropData(data = > {
            this.downImg = data
          aLink.href = data
          aLink.click()
        })
        }
      }
    },
    components: {
      vueCropper
    },
    mounted() {
      // this.changeImg()
      this.option.img = this.lists[~~(Math.random() * this.lists.length)].img
    }
  }
</script>

<style scoped>
  #app {
    color: #2c3e50;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    /* text-align: center; */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .crop-button {
    display: flex;
    flex-wrap: wrap;
    text-align: center;
  }

  .upload-btn {
    border-top-right-radius: 4px !important;
    border-bottom-right-radius: 4px !important;
  }

  .el-button-group {
    margin: 5px;
  }

  /* .btn {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #c0ccda;
    color: #1f2d3d;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 20px 10px 0px 0px;
    padding: 9px 15px;
    font-size: 14px;
    border-radius: 4px;
    color: #fff;
    background-color: #50bfff;
    border-color: #50bfff;
    transition: all 0.2s ease;
    text-decoration: none;
    user-select: none;
  } */

  .show-info {
    margin-bottom: 50px;
  }

  .title {
    display: block;
    text-decoration: none;
    text-align: center;
    line-height: 1.5;
    margin: 20px 0px;
    background-image: -webkit-linear-gradient(left, #3498db, #f47920 10%, #d71345 20%, #f7acbc 30%, #ffd400 40%, #3498db 50%, #f47920 60%, #d71345 70%, #f7acbc 80%, #ffd400 90%, #3498db);
    color: transparent;
    background-clip: text;
    -webkit-background-clip: text;
    background-size: 200% 100%;
    animation: slide 5s infinite linear;
    font-size: 40px;
  }

  .crop {
    height: 500px;
  }

  .el-card {
    margin-top: 15px;
  }

  .model {
    position: fixed;
    z-index: 10;
    width: 100vw;
    height: 100vh;
    overflow: auto;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.8);
  }

  .model-show {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
  }

  .model img {
    display: block;
    margin: auto;
    max-width: 80%;
    user-select: none;
    background-position: 0px 0px, 10px 10px;
    background-size: 20px 20px;
    background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%), linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%);
  }

  .c-item {
    display: block;
    padding: 10px 0;
    user-select: none;
  }

  @keyframes slide {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
</style>
