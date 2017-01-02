var Util = {
    swipeleft : false,
    swiperight : false,
    removeSwipe : function (dom,leftFuc) {
        $(dom).unbind("touchstart");
        $(dom).unbind("touchend");
    },
    addSwipe: function (dom, leftFuc, rightFuc) {
        $(dom).bind("touchstart", function (e) {
            var touch = e.touches[0]; // touches数组对象获得屏幕上所有的touch，取第一个touch
            var startPos = { // 取第一个touch的坐标值
                x: touch.pageX,
                y: touch.pageY
            };

            function touchEnd(e2) {
                var touch2 = e2.changedTouches[0];
                var e2Pos = {
                    x : touch2.pageX,
                    y : touch2.pageY
                };
                var distanceX = e2Pos.x - startPos.x;
                if(distanceX < 0){
                    leftFuc();
                }
            }
            $(dom).bind("touchend", touchEnd);
        });
    }
};