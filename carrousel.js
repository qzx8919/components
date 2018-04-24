//carrousel
!function(win,lib,ctrl){
    //getTransXY
    function getTransXY(el){
        var b, pos = { x: 0 ,y: 0},
        trans = getComputedStyle(el)[prevClass+"Transform"];
        return "none" != trans && (b = trans.match(/^matrix\((?:[-\d.]+,\s*){12}([-\d.]+),\s*([-\d.]+)(?:,\s*[-\d.]+){2}\)/) || trans.match(/^matrix\((?:[-\d.]+,\s*){4}([-\d.]+),\s*([-\d.]+)\)$/)) && (pos.x=parseFloat(b[1]) || 0, pos.y=parseFloat(b[2]) || 0),
        pos
    }
    //call slice
    function cSlice(a){ return slice.call(a) }
    //setTranslate
    function setTranslate(x ,y){
        return x = parseFloat(x),
        y = parseFloat(y),
        0 != x && (x+="px"),
        0 != y && (y+="px"),
        is3d? "translate3d("+x+","+y+",0)": "translate("+x+","+y+")" 
    }
    function carrousel(el ,option){
        //dispatch event
        function dispatchEvent(type, data){
            var event = doc.createEvent("HTMLEvents");
            if(event.initEvent(type,!1,!1) ,data) for(var key in data) event[key] = data[key];
            fragment.dispatchEvent(event);
        }
        //get valid index
        function getIndex(index){
            for(; 0>index ;) index+=total;
            for(; index>=total ;) index-=total;
            return index;
        }
        //move to index
        function moveTo(index){
            if(0 !== total){
                var prevItem, nextItem, curItem=q.get(index);
                total>1 && (prevItem = q.get(index-1), nextItem=q.get(index+1), curItem.style.left=-curPos+"px", prevItem.style.left=-curPos-step+"px", nextItem.style.left=-curPos+step+"px"),
                curIndex=curItem.index, 
                dispatchEvent("change", {
                    prevItem: prevItem,
                    curItem: curItem,
                    nextItem: nextItem
                })
            }
        }
        var self = this,
        id = Date.now() + "-" + ++count,
        fragment = document.createDocumentFragment();
        1 !== arguments.length || arguments[0] instanceof HTMLElement || (option = arguments[0] ,el = null),
        el || (el = document.createElement("ul"), fragment.appendChild(el)),
        option = option || {},
        el.setAttribute("data-ctrl-name" ,"carrousel"),
        el.setAttribute("data-ctrl-id", id),
        el.style.position = "relative",
        el.style[prevClass+"Transform"] = setTranslate(0,0);
        var curPos = 0,
        q = {},
        total = 0,
        step = option.step || el.getBoundingClientRect().width, curIndex = 0;
        q.add = function(b){
            q.slide(1);
        },
        q.get = function(a){ return q[getIndex(a)]},
        q.getCloned = function(b){},
        q.slide = function(off){
            if(0 !== total){
                1 === total && (off = 0);
                var f = getTransXY(el).x,
                g = curPos + step * -off,
                h = g - f;
                if(0 !== h){
                    new lib.animation(400, function(a){ return a } ,
                    function(b, c){
                        el.style[prevClass+"Transform"] = setTranslate(f+h*c ,0)
                    }).play().then(function(){ 
                        curPos = g,
                        el.style[prevClass+"Transform"] = setTranslate(g,0),
                        off && moveTo(curIndex + off)
                    })
                }
            }
        },
        q.next = function(){ q.slide(1) },
        q.prev = function(){ q.slide(-1) },
        cSlice(el.querySelectorAll("li")).forEach(function(li){
            li.style.position = "absolute",
            li.style.top = "0",
            li.style.left = total*step + "px",
            li.style["float"] = "left",
            li.index = total,
            Object.defineProperty(q, total+'' ,{
                get: function(){
                    return li
                }
            }),
            total++
        }),
        Object.defineProperty(this, "items", {
            get: function(){
                return q
            }
        }),
        Object.defineProperty(q, "length", {
            get: function(){
                return total
            }
        }),
        Object.defineProperty(q, "index" , {
            get: function(){
                return curIndex
            }
        }),
        Object.defineProperty(q, "step", {
            get: function(){ return step },
            set: function(a){ step = a }
        });
        var isBoot = !1,
        timeoutToken = !1,
        w = !1;
        this.play = function(){
            return isBoot? void(timeoutToken || (timeoutToken = setTimeout(function(){
                w = !0,
                q.next(),
                setTimeout(function(){
                    w = !1
                } ,500),
                timeoutToken = setTimeout(arguments.callee , 400 + interval)
            }, 400 + interval))) : (isBoot = !0 ,moveTo(0))
        },
        this.stop = function(){
            timeoutToken && (clearTimeout(timeoutToken), setTimeout(function(){
                timeoutToken = !1
            }, 500))
        };
        var isAutoplay = !1 , isSettingplay = !1 ;
        Object.defineProperty(this, "autoplay" ,{
            get: function(){
                return isAutoplay
            },
            set: function(a){
                isAutoplay = !!a,
                isSettingplay && (clearTimeout(isSettingplay) ,isSettingplay=!1),
                isAutoplay? isSettingplay = setTimeout(function(){
                    self.play()
                } ,2e3) : self.stop()
            }
        }),
        this.autoplay = !!option.autoplay;
        var interval = 1500;
        if(Object.defineProperty(this, "playInterval", {
            get: function(){ return interval },
            set: function(a) { interval = a }
        }), this.playInterval = !!option.playInterval || 1500, option.useGesture){
            var offmove ,isPanstart = !1;
            el.addEventListener("panstart", function(event){
                event.isVertical || isPanstart && w || (event.preventDefault(), event.stopPropagation(), isAutoplay && self.stop(), offmove=0, isPanstart=!0)
            }),
            el.addEventListener("pan", function(event){
                !event.isVertical && isPanstart && (event.preventDefault(), event.stopPropagation(), offmove=event.displacementX, el.style[prevClass+"Transform"]=setTranslate(curPos+offmove, 0))
            }),
            el.addEventListener("panend", function(event){
                !event.isVertical && isPanstart && (event.preventDefault(), event.stopPropagation(), isPanstart= !1, event.isflick? 0>offmove? q.next(): q.prev() : Math.abs(offmove)< step/2 ? q.slide(0) : q.slide(0>offmove?1 : -1), isAutoplay && setTimeout(function(){
                    self.play()
                } ,2e3) ) 
            } ,!1),
            el.addEventListener("flick", function(event){
                event.isVertical || (event.preventDefault(), event.stopPropagation())
            })
        }
        this.addEventListener = function(type ,fuc){
            this.root.addEventListener(type ,fuc ,!1)
        },
        this.removeEventListener = function(type ,fuc){
            this.root.removeEventListener(type, fuc ,!1)
        },
        this.root = fragment ,
        this.element = el

    }
    var doc = document,
    uAgent = win.navigator.userAgent,
    isFirefox = !!uAgent.match(/Firefox/i),
    isIE = !!uAgent.match(/IEMobile/i),
    prevClass = isFirefox? "Moz": isIE? "ms" : 'webkit';
    cssMatrix = isIE? "MSCSSMatrix" : "WebKitCSSMatrix",
    is3d = !!isFirefox || cssMatrix in win && "m11" in new win[cssMatrix],
    slice = Array.prototype.slice,
    count = 0;
    ctrl.carrousel = carrousel;
}(window , window.lib, window.ctrl || (window.ctrl = {}))
