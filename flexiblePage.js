
!
function(win, lib) {
    function refreshRem() {
        var width = docEl.getBoundingClientRect().width;
        width / F > 540 && (width = 540 * F);
        var rootFontsize = width / 10;
        docEl.style.fontSize = rootFontsize + "px",
        flexible.rem = win.rem = rootFontsize
    }
    var K, doc = win.document,
    docEl = doc.documentElement,
    viewportEl = doc.querySelector('meta[name="viewport"]'),
    flexibleEl = doc.querySelector('meta[name="flexible"]'),
    F = 0,
    E = 0,
    flexible = lib.flexible || (lib.flexible = {});
    if (viewportEl) {
        console.warn("将根据已有的meta标签来设置缩放比例");
        var C = viewportEl.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
        C && (E = parseFloat(C[1]), F = parseInt(1 / E))
    } else {
        if (flexibleEl) {
            var content = flexibleEl.getAttribute("content");
            if (content) {
                var A = content.match(/initial\-dpr=([\d\.]+)/),
                z = content.match(/maximum\-dpr=([\d\.]+)/);
                A && (F = parseFloat(A[1]), E = parseFloat((1 / F).toFixed(2))),
                z && (F = parseFloat(z[1]), E = parseFloat((1 / F).toFixed(2)))
            }
        }
    }
    if (!F && !E) {
        var uAgent = win.navigator.userAgent,
        isIphone = ( !!uAgent.match(/android/gi), !!uAgent.match(/iphone/gi)),
        isOS9 = isIphone && !!uAgent.match(/OS 9_3/),
        dpr = win.devicePixelRatio;
        F = isIphone && !isOS9 ? dpr >= 3 && (!F || F >= 3) ? 3 : dpr >= 2 && (!F || F >= 2) ? 2 : 1 : 1,
        E = 1 / F
    }
    if (docEl.setAttribute("data-dpr", F), !viewportEl) {
        if (viewportEl = doc.createElement("meta"), viewportEl.setAttribute("name", "viewport"), viewportEl.setAttribute("content", "initial-scale=" + E + ", maximum-scale=" + E + ", minimum-scale=" + E + ", user-scalable=no"), docEl.firstElementChild) {
            docEl.firstElementChild.appendChild(viewportEl)
        } else {
            var div = doc.createElement("div");
            div.appendChild(viewportEl),
            doc.write(div.innerHTML)
        }
    }
    win.addEventListener("resize",
    function() {
        clearTimeout(K),
        K = setTimeout(refreshRem, 300)
    },
    !1),
    win.addEventListener("pageshow",
    function(b) {
        b.persisted && (clearTimeout(K), K = setTimeout(refreshRem, 300))
    },
    !1),
    "complete" === doc.readyState ? doc.body.style.fontSize = 12 * F + "px": doc.addEventListener("DOMContentLoaded",
    function() {
        doc.body.style.fontSize = 12 * F + "px"
    },
    !1),
    refreshRem(),
    flexible.dpr = win.dpr = F,
    flexible.refreshRem = refreshRem,
    flexible.rem2px = function(d) {
        var c = parseFloat(d) * this.rem;
        return "string" == typeof d && d.match(/rem$/) && (c += "px"),
        c
    },
    flexible.px2rem = function(d) {
        var c = parseFloat(d) / this.rem;
        return "string" == typeof d && d.match(/px$/) && (c += "rem"),
        c
    }
} (window, window.lib || (window.lib = {}));

window.isNebulaAndChromeAbove56 = (function() {
    var b = 0;
    var a = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    b = a ? parseInt(a[2], 10) : 0;
    if (b >= 56) {
        return navigator.userAgent.indexOf("Nebula") !== -1
    }
    return false
} ());