
var canvasOverlay = null, viewport = null, map = null;
export class myCanvasOverlay {
    constructor(viewport) {
        this.state = {
            canvas: null,
            render: render,
            viewport: viewport,
        }
        this.state.canvas = createOverlay();
        canvasOverlay = this.state.canvas;
        viewport = this.state.viewport;
    }
}

function createOverlay() {
    var canvasContainer = document.querySelector(".mapboxgl-canvas-container"),
        mapboxCanvas = document.querySelector(".mapboxgl-canvas");
        canvasOverlay = document.createElement("canvas");
        canvasOverlay.style.position = "absolute";
        canvasOverlay.className = "overlay-canvas";
        canvasOverlay.width = parseInt(mapboxCanvas.style.width);
        canvasOverlay.height = parseInt(mapboxCanvas.style.height);
        canvasContainer.appendChild(canvasOverlay);
    return canvasOverlay;
}

export function render(objs) {
    if (canvasOverlay) {
        var ctx = canvasOverlay.getContext("2d");
        // ctx.clearRect(0,0,canv.width, canv.height);
        _preSetCtx(ctx);
        ctx.save();
        // ctx.fillStyle = "rgba(240,200,20,.7)";
        // ctx.fillRect(0,0,canv.width, canv.height);
        ctx.shadowBlur = 4;
        ctx.shadowColor = "rgba(255,255,255,.4)";
        for(var i=0;i<objs.length;i++) {
            var x = objs[i]['lon'], y = objs[i]['lat'],
                pix = trans2pix(x, y);
            if (pix == null) continue;
            ctx.fillStyle = objs[i]['color'];
            ctx.beginPath();
            ctx.arc(pix[0], pix[1], 2, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
        }
        ctx.restore()
    }
}

function trans2pix(lng, lat) {
    if (map != undefined && map.project instanceof Function) {
        var lnglat = map.project(new mapboxgl.LngLat(
            lng, lat));
        var x = lnglat.x;
        var y = lnglat.y;
        return [x, y];
    } else if (viewport && viewport.project) {
        var lnglat = viewport.project([
            lng, lat]);
        var x = lnglat.x;
        var y = lnglat.y;
        return [x, y];
    }
    return [lng, lat];
}

function _preSetCtx(context) {
    //默认值为source-over
    var prev = context.globalCompositeOperation;
    //只显示canvas上原图像的重叠部分 source-in, source, destination-in
    context.globalCompositeOperation = 'destination-in';
    //设置主canvas的绘制透明度
    context.globalAlpha = 0.95;
    //这一步目的是将canvas上的图像变的透明
    // context.fillStyle = "rgba(0,0,0,.95)";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    //在原图像上重叠新图像
    context.globalCompositeOperation = prev;
}

