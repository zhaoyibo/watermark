<template>
  <div id="app">
    <div class="wrapper">
      <div class="model" v-show="model" @click="model = false">
        <div class="model-show">
          <img :src="modelSrc" alt="" />
        </div>
      </div>
      <div class="show-info">
        <div class="crop">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="true"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :fixedBox="option.fixedBox"
            :original="option.original"
            @realTime="realTime"
          ></vueCropper>
        </div>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>图片编辑</span>
          </div>
          <el-row>
            <el-col :span="24">
              <div class="grid-content crop-button">
                <el-form ref="form">
                  <el-form-item>
                    <el-button-group>
                      <el-button @click="changeImg">随便看看</el-button>
                      <label
                        class="el-button el-button--default upload-btn"
                        for="uploads"
                        >上传图片</label
                      >
                      <input
                        type="file"
                        id="uploads"
                        style="position:absolute; clip:rect(0 0 0 0);"
                        accept="image/png, image/jpeg, image/gif, image/jpg"
                        @change="uploadImg($event, 1)"
                      />
                    </el-button-group>
                    <el-button-group>
                      <el-button
                        v-if="!crap"
                        @click="startCrop"
                        :disabled="empty"
                        >开始裁剪
                      </el-button>
                      <el-button v-else @click="stopCrop" :disabled="empty"
                        >结束裁剪
                      </el-button>
                      <el-button @click="clearCrop" :disabled="empty"
                        >取消裁剪
                      </el-button>
                    </el-button-group>
                    <el-button-group>
                      <el-button @click="rotateLeft" :disabled="empty"
                        >向左旋转
                      </el-button>
                      <el-button @click="rotateRight" :disabled="empty"
                        >向右旋转
                      </el-button>
                    </el-button-group>
                    <el-button-group>
                      <el-button
                        @click="changeScale(-1)"
                        icon="el-icon-zoom-out"
                        :disabled="empty"
                        >缩小
                      </el-button>
                      <el-button
                        @click="changeScale(1)"
                        icon="el-icon-zoom-in"
                        :disabled="empty"
                        >放大
                      </el-button>
                    </el-button-group>
                    <el-button-group>
                      <el-button
                        @click="preview"
                        icon="el-icon-view"
                        :disabled="empty"
                        >预览
                      </el-button>
                      <el-button
                        @click="down"
                        icon="el-icon-download"
                        :disabled="empty"
                        >保存
                      </el-button>
                    </el-button-group>

                    <el-button-group>
                      <el-button
                        @click="refresh"
                        icon="el-icon-delete"
                        :disabled="empty"
                        >清空
                      </el-button>
                    </el-button-group>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>证件水印</span>
          </div>
          <el-row>
            <el-col :span="24">
              <div class="grid-content">
                <el-form
                  ref="form"
                  :label-position="labelPosition"
                  label-width="100px"
                >
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="水印内容">
                        <el-input
                          v-model="config.text"
                          placeholder="请输入内容"
                          :disabled="empty"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="旋转角度">
                        <el-slider v-model="config.rotate" :min="0" :max="359">
                        </el-slider>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="6">
                      <el-form-item label="X轴间隙">
                        <el-input-number
                          v-model="config.xSpace"
                          controls-position="right"
                          :min="1"
                        ></el-input-number>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="Y轴间隙">
                        <el-input-number
                          v-model="config.ySpace"
                          controls-position="right"
                          :min="1"
                        ></el-input-number>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="X轴偏移">
                        <el-slider v-model="config.xShift" :min="0" :max="100">
                        </el-slider>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="6">
                      <el-form-item label="字体大小">
                        <el-input-number
                          v-model="config.size"
                          controls-position="right"
                          :min="1"
                          :max="100"
                        ></el-input-number>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="字体颜色">
                        <el-color-picker
                          v-model="config.color"
                        ></el-color-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="字体透明度">
                        <el-slider
                          v-model="config.opacity"
                          :min="0"
                          :max="1"
                          :step="0.01"
                        >
                        </el-slider>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-form-item label="输出格式">
                      <el-radio-group v-model="option.outputType">
                        <el-radio label="png">png</el-radio>
                        <el-radio label="jpeg">jpeg</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        type="default"
                        @click="watermarkPreview('base64')"
                        :disabled="empty"
                        >预览
                      </el-button>
                      <el-button @click="downWatermark" :disabled="empty"
                        >保存
                      </el-button>
                    </el-form-item>
                  </el-row>
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
    <canvas id="myCanvas" style="display: none;"></canvas>
  </div>
</template>

<script>
import Unsplash, { toJson } from 'unsplash-js';
import { VueCropper } from 'vue-cropper';
import Watermark from './libs/watermark.js';

const unsplash = new Unsplash({
  applicationId: process.env.APPLICATION_ID,
  secret: process.env.SECRET,
  callbackUrl: process.env.CALLBACK_URL,
});

export default {
  name: 'App',
  data() {
    return {
      empty: false,
      labelPosition: 'left',
      reRender: true,
      model: false,
      modelSrc: '',
      crap: false,
      previews: {},
      fileName: 'watermark',
      option: {
        img: '',
        size: 1,
        full: false,
        outputType: 'png',
        canMove: true,
        fixedBox: false,
        original: false,
        canMoveBox: false,
      },
      downImg: '#',
      config: {
        text: '此证件仅供办理业务使用，他用无效',
        id: 'myCanvas',
        color: '#f9f9f9',
        xSpace: 100,
        ySpace: 50,
        size: 20,
        xStart: 0,
        yStart: 0,
        rotate: 45,
        opacity: 0.4,
        width: 200,
        height: 200,
        imgUrl: '',
        xShift: 0,
      },
    };
  },
  methods: {
    changeImg() {
      if (process.env.APPLICATION_ID) {
        unsplash.photos
          .getRandomPhoto()
          .then(toJson)
          .then((json) => {
            this.option.img = json.urls.regular;
          })
          .catch((err) => {
            this.option.img = require('../static/' + ~~(Math.random() * 7) + '.jpeg' )
          });
      } else {
          this.option.img = require('../static/' + ~~(Math.random() * 7) + '.jpeg' )
      }
      this.reRender = true;
      this.empty = false;
    },
    startCrop() {
      // start
      this.crap = true;
      this.$refs.cropper.startCrop();
      this.reRender = true;
    },
    stopCrop() {
      //  stop
      this.crap = false;
      this.$refs.cropper.stopCrop();
      this.reRender = true;
    },
    clearCrop() {
      // clear
      this.$refs.cropper.clearCrop();
      this.reRender = true;
    },
    refresh() {
      // clear
      this.$refs.cropper.refresh();
      this.option.img = '';
      this.reRender = true;
      this.empty = true;
    },
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
      this.reRender = true;
    },
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
      this.reRender = true;
    },
    rotateRight() {
      this.$refs.cropper.rotateRight();
      this.reRender = true;
    },
    finish(type) {
      // 输出
      // let test = window.open('about:blank')
      // test.document.body.innerHTML = '图片生成中..'
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob((data) => {
          let img = window.URL.createObjectURL(data);
          this.model = true;
          this.modelSrc = img;
        });
      } else {
        this.$refs.cropper.getCropData((data) => {
          this.model = true;
          this.modelSrc = data;
        });
      }
    },
    preview(type, data) {
      let hasData = typeof data !== 'undefined' && data != null;
      let blobType = type === 'blob';

      if (hasData) {
        this.model = true;
        this.modelSrc = blobType ? window.URL.createObjectURL(data) : data;
      } else {
        if (blobType) {
          this.$refs.cropper.getCropBlob((data) => {
            let img = window.URL.createObjectURL(data);
            this.model = true;
            this.modelSrc = img;
          });
        } else {
          this.$refs.cropper.getCropData((data) => {
            this.model = true;
            this.modelSrc = data;
          });
        }
      }
    },
    changeOutputType() {
      this.downImg = '#';
    },
    watermarkPreview() {
      let that = this;
      this.drawText().then(function() {
        that.preview('', that.downImg);
        that.reRender = false;
      });
    },
    drawText() {
      let that = this;
      return new Promise(function(resolve, reject) {
        that.$refs.cropper.getCropData((data) => {
          let image = new Image();
          image.src = data;
          image.onload = function() {
            that.config.yStart = -(image.width * 0.71);
            that.config.width = image.width;
            that.config.height = image.height;
            that.config.imgUrl = data;

            new Watermark().mark(that.config).then(function() {
              that.downImg = document
                .getElementById('myCanvas')
                .toDataURL('image/' + that.option.outputType);
              resolve();
            });
          };
        });
      });
    },
    downWatermark() {
      let aLink = document.createElement('a');
      aLink.download = this.fileName;
      let that = this;
      if (!this.reRender && that.downImg !== '#') {
        aLink.href = that.downImg;
        aLink.click();
      } else {
        this.drawText().then(function() {
          aLink.href = that.downImg;
          aLink.click();
        });
      }
    },
    uploadImg(e) {
      this.reRender = true;
      this.empty = false;
      // 上传图片
      // this.option.img
      let file = e.target.files[0];
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert('图片类型必须是. gif,jpeg,jpg,png,bmp 中的一种');
        return false;
      }
      let fileName = file.name.replace(/\.\w+$/, '');
      if (fileName) {
        this.fileName = fileName + '_watermark';
      }

      let reader = new FileReader();
      reader.onload = (e) => {
        let data;
        if (typeof e.target.result === 'object') {
          // 把 Array Buffer 转化为 blob 如果是 base64 不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        this.option.img = data;
      };
      // 转化为 base64
      // reader.readAsDataURL(file)
      // 转化为 blob
      reader.readAsArrayBuffer(file);
    },
    imgLoad(msg) {
      console.log(msg);
    },
    // 实时预览函数
    realTime(data) {
      this.previews = data;
    },
    down(type) {
      // event.preventDefault()
      let aLink = document.createElement('a');
      aLink.download = this.fileName.replace(/_watermark$/, '');
      // 输出
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob((data) => {
          this.downImg = window.URL.createObjectURL(data);
          aLink.href = window.URL.createObjectURL(data);
          aLink.click();
        });
      } else {
        this.$refs.cropper.getCropData((data) => {
          this.downImg = data;
          aLink.href = data;
          aLink.click();
        });
      }
    },
  },
  components: {
    VueCropper,
  },
  mounted() {
    this.changeImg();
  },
};
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
  background-image: -webkit-linear-gradient(
    left,
    #3498db,
    #f47920 10%,
    #d71345 20%,
    #f7acbc 30%,
    #ffd400 40%,
    #3498db 50%,
    #f47920 60%,
    #d71345 70%,
    #f7acbc 80%,
    #ffd400 90%,
    #3498db
  );
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
  z-index: 1002;
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
  background-image: linear-gradient(
      45deg,
      #eee 25%,
      transparent 25%,
      transparent 75%,
      #eee 75%,
      #eee 100%
    ),
    linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%);
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
