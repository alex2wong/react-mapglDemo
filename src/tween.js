var createOverlay = null;
export function testTween (mapCenter, render) {
    var objNum = 10, canvasOverlay = null, objs = null, targets = null;
    if (createOverlay && createOverlay instanceof Function)
        canvasOverlay = createOverlay();
    objs = rdObjs(objNum, mapCenter);
    // myTween.loop = false;
    targets = rdObjs(objNum, mapCenter);
    myTween.get(objs).to(targets, 4000, render);
}

// rdObjs with given number
function rdObjs(num, mapCenter) {
    var objs = [], index = 0;
    if (!mapCenter) return objs;
    for(var i=0;i<num;i++) {
        objs.push({
            name: "p" + i.toString(),
            lon: parseInt(((Math.random()*8)+mapCenter[0]-4).toFixed(2)),
            lat: parseInt(((Math.random()*4)+mapCenter[1]-2).toFixed(2)),
            color: 'rgba(10,200,'+ (Math.random()*251).toFixed(0) +',0.7)',
        });
    }
    return objs;
}

//  SingleTon Object to control animation.
export var myTween = {
    fps: 40,
    objs : null,
    get : function(models) {
        this.objs = models;
        return this;
    },
    to : function(targets, duration, cb) {
        this.lastAniParams = [targets, duration];
        if (targets != undefined && duration != undefined && myTween.objs != null) {
            var inter = 1000/myTween.fps,
                stepNum = (duration/1000)*myTween.fps,
                stepIndex =0,
                objsCopy = [],
                props = [];

            // tranverse targetStatus props then calculate status of each frame
            for(var i=0;i<myTween.objs.length;i++){
                for(var k in targets[i]) {
                    if(typeof(targets[i][k]) == 'number'){
                        // deepCopy original status..
                        if (typeof objsCopy[i] != 'object') objsCopy[i] = {};
                        if (typeof props[i] != 'object') props[i] = {};
                        objsCopy[i][k] = myTween.objs[i][k];
                        props[i][k] = parseFloat(((targets[i][k] - myTween.objs[i][k]) * (1/stepNum)).toFixed(3)); 
                    }
                }
            }

            this.timer = setInterval(function() {
                // animation end related handling.
                if (stepIndex >= stepNum) {
                    // reset objs 2 original status.
                    if (myTween.loop) { 
                        stepIndex = 0;
                        for (var i = 0; i < myTween.objs.length; i++) {
                            myTween.objs[i] = Object.assign([], myTween.objs[i], objsCopy[i]);
                        }
                        // myTween.objs = Object.assign([], myTween.objs, objsCopy);
                        console.warn("animation reset !!!!");
                    } else {
                        myTween.paused = true;
                    }
                    return;
                }
                if (myTween.speed != 1) {

                }
                // animation pause related.  record current params..
                if (myTween.paused) {
                    return;
                }
                for(var i=0;i<myTween.objs.length;i++){
                    for(var key in props[i]) {                                
                        // currently animation is controlled by stepIndex..
                        myTween.objs[i][key] += props[i][key];
                        // console.log("obj " +  myTween.objs[i]['name'] +' changed,' + key + ": " + myTween.objs[i][key]);
                    }
                }
                if (cb && cb instanceof Function) {
                    cb.call(this, myTween.objs);
                }                            
                stepIndex += 1;
            }, inter);
        }
        return this;
    },
    loop : true,
    speed: 1,
    timer : null,
    paused: false,
    wait: function(targets, duration) {
        setTimeout(function() {
            myTween.objs = Object.assign(myTween.objs, targets);
        }, duration);
    },
    toggleAni: function() {
        this.paused = !this.paused;
    },
    toggleLoop: function() {
        this.loop = !this.loop;
    },
    lastAniParams: [undefined, undefined]
}
