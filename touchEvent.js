//touch event
!function(win, lib){
    function getParentNode(a ,b){
        for(var c=a; c;){
            if(c.contains(b) || c == b) return c;
            c = c.parentNode
        }
        return null
    }
    //dispatch event
    function dispatchEvent(element, eventName, data){
        var event = doc.createEvent("HTMLEvents");
        if(event.initEvent(eventName, !0 ,!0), "object" == typeof data) for(var e in data) event[e] = data[e];
        element.dispatchEvent(event);
    }
    function f(){}
    function ontouchstart(event){
        0 === Object.keys(touchs).length && (docEl.addEventListener("touchmove", ontouchmove ,!1),
         docEl.addEventListener("touchend", ontouchend, !1), docEl.addEventListener("touchcancel", ontouchcancel, !1));
        for(var b=0; b<event.changedTouches.length; b++){
            var changedTouch = event.changedTouches[b],
            startTouchData = {};
            for(var g in changedTouch) startTouchData[g] = changedTouch[g];
            var touchData = {
                startTouch: startTouchData,
                startTime: Date.now(),
                status: "tapping",
                element: event.srcElement || event.target,
                pressingHandler: setTimeout(function(element){
                    return function(){
                        "tapping" === touchData.status && (touchData.status = "pressing", dispatchEvent(element, "press", {
                            touchEvent: event
                        })),
                        clearTimeout(touchData.pressingHandler),
                        touchData.pressingHandler = null
                    }
                }(event.srcElement || event.target) ,500)
            };
            touchs[changedTouch.identifier] = touchData;
        }
        if(2 == Object.keys(touchData).length){
            var o = [];
            for(var g in touchData) o.push(touchData[g].element);
            dispatchEvent(getParentNode(o[0], o[1]), "dualtouchstart", {
                touches: slice.call(event.touches),
                touchEvent: event
            })
        }

    }
    function ontouchmove(event){
        for(var b=0; b<event.changedTouches.length; b++){
            var changedTouch = event.changedTouches[b],
            touchObj = touchs[changedTouch.identifier];
            if(!touchObj) return;
            touchObj.lastTouch || (touchObj.lastTouch = touchObj.startTouch),
            touchObj.lastTime || (touchObj.lastTime = touchObj.startTime),
            touchObj.velocityX || (touchObj.velocityX = 0),
            touchObj.velocityY || (touchObj.velocityY = 0),
            touchObj.duration || (touchObj.duration = 0);
            //计算此刻的瞬时速度
            var offtm = Date.now() - touchObj.lastTime,
            vx = (changedTouch.clientX-touchObj.lastTouch.clientX) / offtm,
            vy = (changedTouch.clientY-touchObj.lastTouch.clientY) / offtm,
            k = 70; //瞬时时长
            offtm>k && (offtm = k),
            touchObj.duration + offtm > k && (touchObj.duration = k - offtm),
            touchObj.velocityX = (touchObj.velocityX * touchObj.duration + vx*offtm) / (touchObj.duration + offtm),
            touchObj.velocityY = (touchObj.velocityY * touchObj.duration + vy*offtm) / (touchObj.duration + offtm),
            touchObj.duration += offtm,
            touchObj.lastTouch = {};
            for(var l in changedTouch) touchObj.lastTouch[l] = changedTouch[l];
            touchObj.lastTime = Date.now();
            var offX = changedTouch.clientX - touchObj.startTouch.clientX,
            offY = changedTouch.clientY - touchObj.startTouch.clientY,
            offlen = Math.sqrt(Math.pow(offX, 2) + Math.pow(offY, 2));
            ("tapping" === touchObj.status || "pressing" === touchObj.status) && offlen>10 && (touchObj.status = "panning", touchObj.isVertical = !(Math.abs(offX)>Math.abs(offY)), dispatchEvent(touchObj.element, "panstart" , {
                touch: changedTouch,
                touchEvent: event,
                isVertical: touchObj.isVertical
            }), dispatchEvent(touchObj.element, (touchObj.isVertical? "vertical" : "horizontal")+ "panstart", {
                touch: changedTouch,
                touchEvent: event
            }) ),
            "panning" === touchObj.status && (touchObj.panTime = Date.now(), dispatchEvent(touchObj.element, "pan", {
                displacementX: offX,
                displacementY: offY,
                touch: changedTouch,
                touchEvent: event,
                isVertical: touchObj.isVertical
            }), touchObj.isVertical? dispatchEvent(touchObj.element, "verticalpan", {
                displacementY: offY,
                touch: changedTouch,
                touchEvent: event
            }): dispatchEvent(touchObj.element, "horizontalpan" ,{
                displacementX: offX,
                touch: changedTouch,
                touchEvent: event 
            }) )
        }
        if(2 == Object.keys(touchs).length){
            for(var q, r = [], s = [], t= [], b= 0; b< event.touches.length; b++){
                var c = event.touches[b],
                g = touchs[c.identifier];
                r.push([g.startTouch.clientX, g.startTouch.clientY]),
                s.push([c.clientX, c.clientY])
            }
            for(var l in touchs) t.push(touchs[l].element);
            q = f(r[0][0], r[0][1], r[1][0], r[1][1], s[0][0], s[0][1], s[1][0], s[1][1]),
            dispatchEvent(getParentNode(t[0], t[1]), "dualtouch", {
                transform: q,
                touches: event.touches,
                touchEvent: event
            })
        }
    }
    function ontouchend(event){
        if(2 == Object.keys(touchs).length){
            var b = [];
            for(var c in touchs) b.push(touchs[c].element);
            dispatchEvent(getParentNode(b[0], b[1]), "dualtouchend", {
                touches: slice.call(event.touches),
                touchEvent: event
            })
        }
        for(var f=0; f<event.changedTouches.length; f++){
            var changedTouch = event.changedTouches[f],
            identifier = changedTouch.identifier,
            touchObj = touchs[identifier];
            if(touchObj){
                if(touchObj.pressingHandler && (clearTimeout(touchObj.pressingHandler), touchObj.pressingHandler = null), "tapping" === touchObj.status && (touchObj.timestamp = Date.now(), dispatchEvent(touchObj.element, "tap" ,{
                    touch: changedTouch,
                    touchEvent: event
                }), o && touchObj.timestamp - o.timestamp < 300 && dispatchEvent(touchObj.element, "doubletap", {
                    touch: changedTouch,
                    touchEvent: event
                }), o = touchObj), "panning" === touchObj.status){
                    var now = Date.now(),
                    offtm = now- touchObj.startTime,
                    xlen = (changedTouch.clientX - touchObj.startTouch.clientX ),
                    ylen = changedTouch.clientY - touchObj.startTouch.clientY,
                    vlen = Math.sqrt(touchObj.velocityY * touchObj.velocityY + touchObj.velocityX * touchObj.velocityX),
                    isflick = vlen > .5 && offtm <100, //快速滑动操作
                    data = {
                        duration: offtm,
                        isflick: isflick,
                        velocityX: touchObj.velocityX,
                        velocityY: touchObj.velocityY,
                        displacementX: xlen,
                        displacementY: ylen,
                        touch: changedTouch,
                        touchEvent: event,
                        isVertical: touchObj.isVertical
                    };
                    dispatchEvent(touchObj.element, "panend", data),
                    isflick && (dispatchEvent(touchObj.element, "flick", data), touchObj.isVertical? dispatchEvent(touchObj.element, "verticalflick", data): dispatchEvent(touchObj.element, "horizontalflick", data))
                }
                "pressing" === touchObj.status && dispatchEvent(touchObj.element, "pressend", {
                    touch: changedTouch, 
                    touchEvent: event
                }),
                delete touchs[identifier]
            }
        }
    }
    function ontouchcancel(event){
        if(2 == Object.keys(touchs).length){
            var b = [];
            for(var c in touchs) b.push(touchs[c].element);
            dispatchEvent(getParentNode(b[0],b[1]), "dualtouchend", {
                touches: slice.call(event.touches),
                touchEvent: event
            })
        }
        for(var f=0; f< event.changedTouches.length; f++){
            var changedTouch = event.changedTouches[f],
            identifier = changedTouch.identifier,
            touchObj = touchs[identifier];
            touchObj && (touchObj.pressingHandler && (clearTimeout(touchObj.pressingHandler), touchObj.pressingHandler = null), "panning" === touchObj.status && dispatchEvent(touchObj.element, "panend", {
                touch: changedTouch,
                touchEvent: event
            }), "pressing" === touchObj.status && dispatchEvent(touchObj.element, "pressend", {
                touch: changedTouch,
                touchEvent: event
            }), delete touchs[identifier])
        }
        0 === Object.keys(touchs).length && (docEl.removeEventListener("touchmove", ontouchmove, !1), docEl.removeEventListener("touchend", ontouchend ,!1),docEl.removeEventListener("touchcancel",ontouchcancel,!1))
    }

    var doc = win.document,
    docEl = doc.documentElement,
    slice = Array.prototype.slice,
    touchs = {},
    o = null;
    docEl.addEventListener("touchstart", ontouchstart, !1)
}(window, window.lib || (window.lib = {}))
