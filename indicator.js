!function() {
    var cssText = '[data-ctrl-name=indicator] span{display:block;overflow:hidden;width:.25rem;height:.25rem;font-size:0;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAsZJREFUeNqkVE1oE1EQnrdJ2liaQyKNDRVBLU3SYhpSDRqVij2Ip4InqVisWOlBhBSVKOrBXgpKoRCaSw6KJxG8F2xJQSvtpfFifxI9KGnTGJrDWk0226wzy25MYlt368DwYHa+771975uPSZIElcEYM+FixbRg1inlAiaPmcN+sbKfqwEf8Pv97VNTU125XO40Np+lzGazgcnJyeMul8uNPfYqjHoC/NAciURcg4ODRw0YsE0Ui8WtcDi8Mjw8nEBcmmpGBWyfmJhwDg0NtcEuYTKZDMFg0C0IgoSYEpJkGNUDgUBHLBbrogbQEHQSj8czv7S0tEh3YB0ZGXFoBasnGR8fP0hYIrD4fL4m0Bler9eGSyMRmCwWS71eAqvVSpg6DvYeTNVBkef5gl406iSPi0AE/MLCQlYvQTwe38DlB928kEgk9vX39zejfjitz9jb27uICv3GoRiKs7Ozq9FoNKl197GxsWXUwDrNhaxEWVGMcaIoAqqxdSdN4M4igldCoVCSMKCAy4lhx2HqxMG5mE6n+7B2kzKVSl2mGg7TMeqpxLBtxtmojHMjplkp/8Lc/Oc4V7wvq/m24+Uaa/3gxmFoe9jOrjab4UI9B4eont+Cz6t5eHv3o/Qce76U/7/WD+Z62PUTNnjE/hy9KkoS/HyXhQfdMemV6gcyAfnBh/Ns4OR+GNXyjNMZuN0zI5NkOPLAW63Q7rfBY606ONcEo5da4AhduOwHd5ysj2PQoJWAep92smtlP6AL0zsLDjN0l/0Ah9qhlwBfqOV//cBQ9gOhBGt60YUSfC37QRpFopdgLQ8z5AdEkHu2LL0kkWgFUy+pkrCyH4ST8Gl+A55oJYh9h9CbFJCkRU71g1PT0ov3Wbi320nwG6+o8LU6D1XjTJLGYXLed7MrqI0zDQbooPqmCPH1AszRsZWd/x6mvfrBbwEGAEsWX34YFVnkAAAAAElFTkSuQmCC);background-repeat:none;background-size:contain}[data-ctrl-name=indicator] b{box-sizing:border-box;display:block;height:.3125rem;line-height:.3125rem;border:1px solid rgba(0,0,0,.16);background-color:rgba(255,255,255,.4);border-radius:.15625rem;padding:0 .1875rem;margin:0 .21875rem;font-weight:400;color:#999;overflow:hidden}[data-ctrl-name=indicator] b.hide{display:none}[data-ctrl-name=indicator] b.show{display:block}[data-ctrl-name=indicator][data-dir=horizontal]{width:100%;padding-bottom:.25rem;display:-webkit-box;-webkit-box-align:center;-webkit-box-pack:center;display:-ms-flexbox;-ms-flex-align:center;-ms-flex-pack:center;display:-moz-box;-moz-box-align:center;-moz-box-pack:center;text-align:center}[data-ctrl-name=indicator][data-dir=horizontal] span{margin:0 .09375rem}[data-ctrl-name=indicator][data-dir=vertical] span{margin:.09375rem 0}[data-ctrl-name=indicator][data-dir=vertical] b.hide{display:none}[data-ctrl-name=indicator][data-dir=vertical] b.show{display:none}[data-dpr="1"] [data-ctrl-name=indicator] b{font-size:7px}[data-dpr="2"] [data-ctrl-name=indicator] b{font-size:14px}[data-dpr="3"] [data-ctrl-name=indicator] b{font-size:21px}',
    styleEl = document.createElement("style");
    if (document.getElementsByTagName("head")[0].appendChild(styleEl), styleEl.styleSheet) styleEl.styleSheet.disabled || (styleEl.styleSheet.cssText = style);
    else try {
        styleEl.innerHTML = cssText
    } catch(c) {
        styleEl.innerText = cssText
    }
} (),
function(win, ctrl){
   function c(el ,option){
       //set the direction 
       function setDir(){
           el.setAttribute("data-dir", direction)
       }
       //render html page according by the amout number
       function createHtml(){
           el.innerHTML = new Array(amount+1).join('<span style="background-size: 0.25rem 0.5rem; background-position: 0 0;"></span>') + '<b class="hide"></b>'
       }
       //set current highlight element
       function setCurEl(){
           var curEl = el.querySelector("span.cur");
           curEl && (curEl.style.backgroundPosition="0 0", curEl.className="");
           var newCurEl = el.querySelector("span:nth-child("+index+")");
           newCurEl.className = "cur",
           newCurEl.style.backgroundPosition="0 -0.25rem"
       }
       //set the current index of total page percent
       function setPercent(){
           var b = el.querySelector("b");
           isShowpage? b.className = "show" : b.className = "hide",
           b.innerHTML = index + "/" + amount
       }
       var id = Date.now() + "-" + ++count,
       fragment = document.createDocumentFragment();
       1 !== arguments.length || arguments[0] instanceof HTMLElement || (option = arguments[0], el=null),
       el || (el = document.createElement("div"), fragment.appendChild(el)),
       option = option || {},
       el.setAttribute("data-ctrl-name", "indicator"),
       el.setAttribute("data-ctrl-id", id);
       var direction;
       Object.defineProperty(this, "direction", {
           get: function(){
               return direction
           },
           set: function(a){
               if("string" != typeof a || !a.match(/^v|vertical|h|horizontal$/)) throw new Error("Non expected value");
               direction = a.length >1? a : 'v' === a ? "vertical" : "horizontal", setDir()
           }
       }),
       this.direction = option.direction || "horizontal";
       var amount;
       Object.defineProperty(this, "amount", {
           get : function(){
               return amount
           },
           set : function(a){
               if("number" != typeof a) throw new Error("Non expected value");
               amount = a,
               createHtml(),
               this.index = 1
           }
       }),
       this.amount = option.amount;
       var index;
       Object.defineProperty(this, "index", {
           get: function(){
               return index
           },
           set: function(a){
               if(!("number" == typeof a && a>0 && amount>=a)) throw new Error("Non expected value");
               index = a,
               setCurEl(),
               setPercent()
           }
       }),
       this.index = option.index || 1;
       var isShowpage;
       Object.defineProperty(this, "showpage", {
           get: function(){
               return isShowpage
           },
           set: function(a){
               if("boolean" != typeof a) throw new Error("Non expected value");
               isShowpage = a,
               setPercent()
           }
       }),
       this.showpage = option.showpage || !1,
       this.addEventListener = function(){
           el.addEventListener.apply(el, arguments);
       },
       this.removeEventListener = function(){
           el.removeEventListener.apply(el, arguments)
       },
       this.remove = function(){
           el.parentNode && el.parentNode.removeChild(el)
       },
       this.element = el,
       this.root = fragment
   }
   var count = 0;
   ctrl.indicator = c
}(window, window.ctrl || (window.ctrl={}))