//promise
!function(win ,lib){
    function CusPromise(){
        this.ES6Promise = Promise,
        this.defer = function(){
            var a = {},
            b = new Promise(function(b ,c){
                a.resolve = b,
                a.reject = c
            });
            return a.promise = b , a;
        },
        this.wrap = function(a){
            var b = this;
            return function(){
                if("function" == typeof a){
                    var c = b.defer(),
                    d = (c.promise, [c.resolve, c.reject].concat(Array.prototype.slice.call(arguments))),
                    e = a.apply(this,d);
                    return b.isPromise(e)? e: c.promise
                }
                return a;
            }
        },
        this.mixin = function(a ,b){
            return ["then" ,"catch"].forEach(function(c){
                b[c] = function(){
                    return a[c].apply(a,arguments);
                }
            }) ,b
        },
        this.isThenable = function(a){
            return !!a && !!a.then && "function" == typeof a.then
        },
        this.isPromise = function(a){
            return !!(a instanceof Promise);
        },
        this.record = function(a){
            var b = Object.create(a);
            if(Object.defineProperties){
                var c ,d = "pending";
                Object.defineProperties(b ,{
                    PromiseState: {
                        get: function(){
                            return d
                        },
                        enmurable: !1
                    },
                    PromiseResult: {
                        get: function(){
                            return c
                        },
                        enmurable: !1
                    }
                }),
                a.then(function(a){
                    d = "fullfilled", c = a
                } ,function(a){ 
                    d = "rejected" , c = a
                })
            } else b.PromiseState = "pending" ,
            b.PromiseResult = void 0,
            a.then(function(a){
                b.PromiseState = "fullfilled",
                b.PromiseResult = a
            } ,function(a){
                b.PromiseState = "rejected",
                b.PromiseResult = a
            });
            return b

        }
    }
    function PTool(){
        var a = new Promise(function(a ,b){
            "complete" === document.readyState? a() : document.addEventListener("DOMContentLoader", a)
        });
        this.domReady = function(){
            return a
        }
        var c = new Promise(function(a ,b){
            window.addEventListener("load" ,a)
        });
        this.pageLoad = function(){
            return c
        },
        this.delay = function(a){
            return new Promise(function(b,c){
                setTimeout(b ,a)
            })
        },
        this.waitForEvent = function(a ,b ,c){
            return new Promise(function(d ,e){
                function f(c){
                    a.removeEventListener(b,f),
                    d(c)
                }
                a.addEventListener(b,f,c)
            })
        },
        this.parallel = function(a){
            return Promise.all(a.map(function(a){
                return lib.promise.features.isThenable(a)? Promise.resolve(a) : "function" == typeof a? a() : a 
            }))
        },
        this.serial = function(a){
            var c = Promise.resolve();
            return a.forEach(function(a){
                c = lib.promise.features.isThenable(a)? c.then(function(){
                    return Promise.resolve(a)
                }) : "function" == typeof a ? c.then(a) : c.then(function(){
                    return a
                })
            }) ,c
        }
    }

    var Promise = win.Promise;
    if(!Promise) throw new Error("ES6Promise is not working in this brower");
    var pObj = new CusPromise,
    tool = new PTool;
    lib.promise = Object.create(pObj),
    lib.promise.features = pObj,
    lib.promise.utilities = tool

}(window ,window.lib || (window.lib = {}));
