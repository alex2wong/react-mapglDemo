// 全局参数
var radius = 5, pathIndex = 0, animateTimer = null, requestAnimationFrameID = null;
window.requestAnimationFrame = window.requestAnimationFrame 
    || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame 
    || window.msRequestAnimationFrame;

function _preSetCtx(context) {
  //默认值为source-over
    var prev = context.globalCompositeOperation;
    //只显示canvas上原图像的重叠部分
    context.globalCompositeOperation = 'destination-in';
    //设置主canvas的绘制透明度
    context.globalAlpha = 0.95;
    //这一步目的是将canvas上的图像变的透明
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    //在原图像上重叠新图像
    context.globalCompositeOperation = prev;
}

// Root Class for Point CanvasOverlay
export function PointLayer(options) {
    this.longitude = options.longitude;
    this.latitude = options.latitude;
    this.strokeStyle = options.strokeStyle || 'rgba(250,250,50, 0.9)';
    this.radius = radius;
}

/**
 * renderCircle with animation.
 */
function renderCircle(context, point, strokeStyle) {
  //画圆
    _preSetCtx(context);
    // context.clearRect(0,0,context.canvas.width, context.canvas.height);
    context.beginPath();
    context.arc(point[0], point[1], radius, 0, Math.PI * 2);    
    context.closePath();
    context.lineWidth = 2; //线条宽度
    context.strokeStyle = strokeStyle; //颜色
    context.stroke();

    radius += 0.2; //每一帧半径增加0.1
    if (radius > 20) {
        radius = 5;
    }
}

/**
 * overwrite the CanvasOverlay redraw method..
 */
export function drawCircle(props) {
    // register callback async.. drawCircle context would changed to window??
    let that = this;
    if (requestAnimationFrameID) cancelAnimationFrame(requestAnimationFrameID);
    requestAnimationFrameID = requestAnimationFrame(function() {
        drawCircle.call(that, props);
    });
    renderCircle(props.ctx, props.project([that.longitude, that.latitude]), that.strokeStyle);
}

/**
 * renderPath with single point animation.. this Method should be public and static..
 * for it is a common method.
 */
function renderPathPoint(context, point, fillStyle) {
  _preSetCtx(context);
  context.save();
  context.shadowColor = '#fff';
  context.shadowBlur = 10;
  context.beginPath();
  context.arc(point[0], point[1], 4, 0, Math.PI * 2);
  context.lineWidth = 2; //线条宽度
  context.fillStyle = fillStyle || 'rgba(131, 235, 235, 0.9)';
  context.fill();
  context.closePath();
  context.restore();
}

/**
 * render static path with background canvas..
 */
function renderStaticPath(context, coords, project, strokeStyle) {
    let pathlen = coords.coordinates.length;        
    context.beginPath();
    context.lineWidth = 4;
    context.strokeStyle = strokeStyle;
    for(let i=0;i<pathlen;i++) {  
        let coord = coords.coordinates[i];
        // one thing! there is no pitch/bearing project... only wgs84-> web mercator.
        let point = project([coord.longitude, coord.latitude]);
        if (i == 0) {
            context.moveTo(point[0], point[1]);
        } else {
            context.lineTo(point[0], point[1]);
        }
    }
    context.stroke();
}

function render(that, props) {
    let pathlen = that.coords.coordinates.length,
            // step equal to total points/ total frames number..
            step = parseInt(pathlen/100);
    animateTimer = setInterval(function() {
        renderPathPoint(props.ctx, props.project([
            that.coords.coordinates[pathIndex].longitude, that.coords.coordinates[pathIndex].latitude]));
        if (pathIndex < (pathlen-step)) {
            pathIndex += step;
        } else {
            pathIndex = 0;
        }
    }, 25);    
}

/**
 * drawPath with 2dContext and coords, 
 * actually need two canvas to render static background path and animated one.
 * Actually this method is to overwrite CanvasOverlay.redraw method !!
 */
export function PathLayer(options) {
    // this.coords = options.coords;
    this.aniDuration = options.duration || 2000;
    this.strokeStyle = options.strokeStyle || 'rgba(131, 235, 235, 0.6)';
    this.drawPath = function(props) {
        // purple, 253, 45,215. lightblue 10, 210, 250， yellow: 255,235,59
        let canvas = props.ctx.canvas;            
        props.ctx.clearRect(0,0,canvas.width, canvas.height);  
        clearInterval(animateTimer);
        renderStaticPath(props.ctx, this.coords, props.project, this.strokeStyle);
        // start animate renderPathPoint. this refer to OverLayer Object who call this function.
        render(this, props);
    }
}
