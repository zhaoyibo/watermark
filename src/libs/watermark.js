/* eslint-disable */
export default function Watermark() {
  var Config = {
      text: 'watermark',
      rotate: 15,
      xSpace: 20,
      ySpace: 20,
      size: 20,
      xStart: -50,
      yStart: 20,
      opacity: 0.2,
      color: '#000',
      width: 500,
      height: 500,
      imgUrl: '',
      id: '',
      parent: null,
      xShift:0,
    },
    Parent = null,
    Context = null,
    textWidth = -1,
    textHeight = -1;
  function mark(userConfig) {
    userConfig = userConfig || {}
    Config = extend(Config, userConfig)
    getCanvas()
    return drawImg()
  }
  function extend(origin, target) {
    for (var key in target) {
      target.hasOwnProperty(key) && (origin[key] = target[key])
    }
    return origin
  }
  function getCanvas() {
    var id = Config.id || '',
      canvas = document.getElementById(id) || document.createElement('canvas')
    canvas.width = Config.width
    canvas.height = Config.height
    Parent = Config.parent || document.body
    Parent.appendChild(canvas)
    Context = canvas.getContext('2d')
  }
  function drawImg() {
    // 保证canvas加载完成
    return new Promise(function(resolve, reject) {
      var Img = new Image()
      Img.onload = function() {
        Context.drawImage(this, 0, 0, Config.width, Config.height)
        insertMarks()
        resolve()
      }
      Img.src = Config.imgUrl
    })
  }
  function insertMarks() {
    getTextOffset()
    var xSpace = Config.xSpace,
      ySpace = Config.ySpace,
      overHeight = textHeight + ySpace,
      overWidth = textWidth + xSpace,
      squareWidth = 0.72 * (Config.width + Config.height)
    var i = 0
    var textTotal = Config.size * Config.text.length + Config.xSpace
    for (var y = Config.yStart; y < squareWidth + overHeight; y += ySpace + textHeight) {
      i ++;
      for (var x = -textTotal; x < squareWidth + overWidth; x += xSpace + textWidth) {
        if( i % 2 == 0){
            createMark(x + textTotal / 2, y);
        } else{
            createMark(x, y);
        }
      }
    }
  }
  function getTextOffset() {
    var text = (Config.text, getText())
    Parent.appendChild(text)
    setTextStyle(text)
    textWidth = text.offsetWidth
    textHeight = text.offsetHeight
    Parent.removeChild(text)
  }
  function getText() {
    var text = document.createElement('div')
    text.innerText = Config.text
    return text
  }
  function setTextStyle(textDom) {
    var styles = [['position', 'absolute'], ['top', '-1000px'], ['font-size', Config.size + 'px'], ['color', Config.color], ['opacity', Config.opacity], ['filter', 'alpha(opacity=' + 100 * Config.opacity + ')'], ['pointer-events', 'none'], ['white-space', 'nowrap']],
      styleArr = [],
      cssText = ''
    for (var i = 0; i < styles.length; i++) {
      var style = styles[i]
      styleArr.push(style.join(':') + ';')
    }
    cssText = styleArr.join('')
    textDom.style.cssText = cssText
  }
  function createMark(x, y) {
    Context.save()
    Context.font = 'normal normal normal ' + Config.size + 'px Arial'
    Context.fillStyle = Config.color
    Context.zIndex = 1
    Context.rotate(Math.PI / 180 * Config.rotate)
    Context.globalAlpha = Config.opacity
    Context.fillText(Config.text, x, y)
    Context.restore()
  }
  function removeMarks() {
    Context.clearRect(0, 0, Config.width, Config.height)
  }
  function reRendering(userConfig) {
    removeMarks()
    userConfig = userConfig || {}
    Config = extend(Config, userConfig)
    return drawImg()
  }
  return {
    mark: mark,
    reRendering: reRendering
  }
}
