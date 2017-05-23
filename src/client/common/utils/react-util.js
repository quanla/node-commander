const ReactUtil = {
    getClientRect(comp) {
        if (!comp.mounted) {
            return null;
        }
        let dom = ReactDOM.findDOMNode(comp);
        if (dom == null) {
            return null;
        }
        let $dom = $(dom);
        let offset = $dom.offset();
        let $window = $(window);
        let top = offset.top - $window.scrollTop();
        let left = offset.left - $window.scrollLeft();
        let width = $dom.width();
        let height = $dom.height();
        return {
            top,
            left,
            width,
            height,
        };
    }
};

exports.ReactUtil = ReactUtil;