//animation
!function(win ,lib){
    //custom requestAnimationFrame
    function cusRequestAnimationFrame(fuc){
        return setTimeout(fuc ,hz)
    }
    //custom cancelAnimationFrame
    function cusCancelAnimationFrame(a){
        clearTimeout(a)
    }
    function Frame(callfuc){
        var promise, d, isCancel = !1;
        this.request = function(){
            isCancel = !1;
            var args = arguments;
            return promise = lib.promise.defer(),
            extend(promise.promise, this),
            d = requestAnimationFrame(function(){
                isCancel || promise && promise.resolve(callfuc.apply(win, args))
            }), this 
        },
        this.cancel = function(){
            return d && (isCancel=!0, cancelAnimationFrame(d), promise && promise.reject("CANCEL")), this
        },
        this.clone = function(){
            return new Frame(callfuc)
        }
    }
    function extend(a, b){
        return ["then", "catch"].forEach(function(c){
            b[c] = function(){
                return a[c].apply(a, arguments)
            }
        }), b
    }
    //valid function
    function validfunc(fuc){
        var c;
        return "function" == typeof fuc && (c = fuc) ,c
    }
    function Animation(time, processfuc, resultfuc){
        var promise, callfuc = resultfuc, fam = (time / hz), per = 1 / fam ,cur = 0 ,isfuc = validfunc(processfuc) , e;
        if(!isfuc) throw new Error("unexcept timing function")
        var isStart = !1;
        this.play = function(){
            frame = new Frame(callfuc);            
            function a(){
                var c = per* (cur+1).toFixed(10);
                frame.request(c.toFixed(10) ,processfuc(c).toFixed(10)).then(function(){
                    isStart && ( cur >= fam ? (isStart=!1 , promise && promise.resolve("FINISH") , promise=null, frame=null) : (cur++ ,a()) )
                } )
            }
            if(!isStart) return isStart = !0, promise || (promise = lib.promise.defer(), extend(promise.promise ,this)) ,a(), this
        },
        this.stop = function() {
            return isStart? (isStart=!1 , frame && frame.cancel(),this) : void 0;
        }
    }

    var k = 60,
    hz = 1e3 /k,   
    Promise = win.Promise || lib.promise && b.promise.ES6Promise,
    requestAnimationFrame = win.requestAnimationFrame || win.msRequestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || cusRequestAnimationFrame,
    cancelAnimationFrame = win.cancelAnimationFrame || win.msCancelAnimationFrame || win.webkitCancelAnimationFrame || win.mozCancelAnimationFrame || cusCancelAnimationFrame;
    (requestAnimationFrame === cusRequestAnimationFrame || cancelAnimationFrame == cusCancelAnimationFrame) && (requestAnimationFrame=cusRequestAnimationFrame , cancelAnimationFrame = cusCancelAnimationFrame),
    lib.animation = function(a, b, c){
        return new Animation(a ,b ,c)
    },
    lib.animation.frame = function(a){
        return new Frame(a)
    },
    lib.animation.requestFrame = function(a){
        var frame = new Frame(a);
        return frame.request()
    }

}(window ,window.lib || (window.lib={}));
