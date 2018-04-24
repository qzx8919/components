//H5INDEX_TEMPLATE
!function(win){
    win.H5INDEX_TEMPLATE = {
        tbanner: function () {
            var b = '<div class=" UIView" style="box-sizing: border-box; line-height: 0; width: 10rem; height: 3.125rem; margin: 0 auto;"></div>',
                c = document.createElement("div");
            return c.setAttribute("data-template-name", "tbanner"),
                c.style.position = "relative",
                c.innerHTML = b,
                c;
        }
        ,tbanner_items: function (a) {
            var sbanner = document.createElement("div");
            sbanner.className = "slide-banner",
            sbanner.style.cssText = "height: 100%; width: 10rem; overflow: hidden; position: relative;";
            var ul = document.createElement("ul");
            ul.style.cssText = "height: 100%; width: 10rem; ";
            var el = document.createElement("div");
            return el.className = "indicator",
                el.style.cssText = "right: 0; height: 0.28125rem; position: absolute; bottom: 0.25rem; text-align: center;  -webkit-transform: translateZ(0); -ms-transform: translateZ(0); transform: translateZ(0);",
                a.forEach(function (a, b) {
                    try {
                        var d = document.createElement("li");
                        d.className = "card", d.style.cssText = "display: block; width: 10rem; height: 100%;",
                        d.innerHTML = '<a data-href="' + a.targetUrl + '" data-type="" style="display:block;width:100%;height:100%;vertical-align:middle;overflow:hidden;"><img style="width:100%;height:100%;" ' + (0 === b ? 'lazyload="true"' : 'class="lazyimg"') + '" src="'+a.imageUrl+'" ' + (0 === b ? "data-src" : "dataimg") + '="' + (a.imageUrl || "") + '"></a>';
                        ul.appendChild(d)
                    } catch (f) {
                        console.error(f)
                    }
                }),
                sbanner.appendChild(ul),
                sbanner.appendChild(el),
                sbanner
        }

    }
}(window)

//entry
!function(win ,lib ,ctrl){

    function request(url,method,data){
        var e = lib.promise.defer()
        , xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){

            if(xhr.readyState == 4 && (xhr.status >=200 && xhr.status <300 || xhr.status == 304)){
                e.resolve(xhr.responseText);
            }
        }
        !data && (data=null),
        xhr.open(method,url,true),
        xhr.send(data)
        return e.promise;
    }

    function initSliderBanner(el){
        var b = el.querySelector("ul"),
        carrousel = new ctrl.carrousel(b, {
            autoplay: !1,
            useGesture: !0
        });
        carrousel.playInterval = 4e3;
        var d = el.querySelector(".indicator"),
        indicator = new ctrl.indicator({
            direction: "horizontal",
            amount: carrousel.items.length,
            index: 1
        });
        d.appendChild(indicator.root),
        carrousel.addEventListener("change", function(){
            var a = carrousel.items.index,
            b = [carrousel.items.get(a) ,carrousel.items.get(a+1)];
            b.map(function(a){
                return a.querySelector(".lazyimg")
            }).filter(function(a){
                return !!a
            }).forEach(function(a){
                a.src = a.getAttribute("dataimg"),
                a.removeAttribute("dataimg"),
                a.className = a.className.split(" ").filter(function(a){
                    return "lazyimg" !== a
                }).join(" ")
            }),
            indicator.index = a+1
        });

        setTimeout(function(){
            carrousel.play()
        }, 2e3);
    }
    
    var h = lib.promise.utilities;
    h.pageLoad().then(function(){
        var c = win.H5INDEX_TEMPLATE.tbanner();
        request('data.json','get',null).then(function(data){
            data = JSON.parse(data);
            var section = data ,r = section.items;

            c.querySelector(".UIView").appendChild(win.H5INDEX_TEMPLATE.tbanner_items(r));
            document.body.appendChild(c);
            return c;
        }).then(function(a){
            a.querySelectorAll(".slide-banner").forEach(initSliderBanner);
           
        })

    })
}(window , window.lib, window.ctrl)
