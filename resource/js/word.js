var Animation = {};
var audioList = document.getElementsByTagName('audio');
var Const = {
    activeIndex: 0,
    slideNum: 0
};
var Index = {
    showDialog: function () {
        $(".mask_download_dialog").show();
        $(".close_dialog_btn").unbind("click").bind("click", function () {
            $(".mask_download_dialog").hide();
            //移除绑定事件
            Util.removeSwipe("#slide_container_word", Index.showDialog);
        });
    }
};
var Main = {
    initDownload: function () {
        $(".link_btn").on('click', function () {
            window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=m.primedu.cn";
        }, false);
    },
    initSwiper: function () {
        var slide_container_word = new Swiper('#slide_container_word', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            spaceBetween: 30,
            autoplayDisableOnInteraction: false,
            onSlideChangeEnd: function (swiper) {
                // console.log(swiper);
                Const.activeIndex = swiper.activeIndex;
                Const.slideNum = swiper.slidesGrid.length;
            },
            onReachEnd: function (swiper) {
                if (Const.activeIndex != 0) {
                    Util.addSwipe("#slide_container_word", Index.showDialog, null);
                }
            },
            onTransitionEnd: function (swiper) {
                //微信下响应滑屏事件
                Const.activeIndex = swiper.activeIndex;
                $(".switch_paly").trigger('click');
            }
        });
        $(".switch_paly").on("click", function () {
            var currentAudio = audioList[Const.activeIndex];
            $.each(audioList, function ($k, $v) {
                if (audioList[$k].paused == true) {

                } else {
                    audioList[$k].pause();
                    audioList[$k].currentTime = 0;
                }
            });
            setTimeout(function () {
                if (currentAudio.paused) {
                    currentAudio.currentTime = 0;
                    currentAudio.play();
                }
            }, 200);
        });
        $(".word_switch_left").on("click", function () {
            if (Const.activeIndex == 0) {
                console.log("已经到第一个item了.");
            }
            slide_container_word.slidePrev();

        });
        $(".word_switch_right").unbind("click").bind("click", function () {
            if (Const.activeIndex == Const.slideNum - 1) {
                Index.showDialog();
            }
            slide_container_word.slideNext();
        });
    },
};
$(function () {
    //
    Main.initDownload();
    Main.initSwiper();
});