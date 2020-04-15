let utils = (function () {

    function getCss(element, attr) {
        let value = window.getComputedStyle(element)[attr];
        let reg = /^\d+(px|rem|em)?$/i;
        if (reg.test(value)) {
            value = parseFloat(value);
        }
        return value;
    }

    function setCss(element, attr, value) {
        if (attr === 'opacity') {
            element['style']['opacity'] = value;
            element['style']['filter'] = `alpha=(opacity=${value*100})`;
        }
        let reg = /^width|height|margin|padding|top|bottom|left|right$/i;
        if (reg.test(attr)) {
            value = value + 'px';
        }
        element['style'][attr] = value;
    }

    function setGroupCss(element, value) {
        for (let key in value) {
            if (!value.hasOwnProperty(key)) break;
            setCss(element, key, value[key]);
        }
    }

    function css(element) {
        let len = arguments.length,
            attr = arguments[1],
            value = arguments[2];
        if (len >= 3) {
            setCss(element, attr, value);
            return;
        }
        if (attr !== null && typeof attr === 'object') {
            setGroupCss(element, attr);
            return;
        }
        return getCss(element, attr);
    }

    function offset(element) {
        let parent = element.offsetParent,
            top = element.offsetTop,
            left = element.offsetLeft;
        with(parent) {
            if (!/MSIE 8/.test(navigator.userAgent)) {
                top += parent.clientTop;
                left += parent.clientLeft;
            }
            top += parent.offsetTop;
            left += parent.offsetLeft;
            parent = parent.offsetParent;
            return{
                top,
                left
            }
        }
    }
    return {
        css,
        offset
    }
})();