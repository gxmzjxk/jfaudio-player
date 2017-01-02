var Animation = {};
var audioList = document.getElementsByTagName('audio');
var Const = {
    activeIndex: 0,
    slideNum: 0,
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
                var currentAudio = $(".swiper-slide")[swiper.activeIndex].getElementsByTagName("audio")[0];
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
                        try {
                            currentAudio.oncanplay = function () {
                                currentAudio.play();
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }, 200);
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
        $(".switch_left").on("click", function () {
            if (Const.activeIndex == 0) {
                console.log("已经到第一个item了.");
            }
            slide_container_word.slidePrev();

        });
        $(".switch_right").unbind("click").bind("click", function () {
            if (Const.activeIndex == Const.slideNum - 1) {
                Index.showDialog();
            }
            slide_container_word.slideNext();
        });
    },
    calTime: function (time, $needObj) {
        var hour = parseInt(time / 3600) > 0 ? parseInt(time / 3600) + ':' : '';
        var minute = parseInt((time - 3600 * hour) / 60);
        var intSecond = parseInt(time - 3600 * hour - 60 * minute);
        var second = intSecond < 10 ? '0' + intSecond : intSecond;
        if ($needObj) {
            return {
                hour: hour,
                minute: minute,
                second: second
            };
        } else {
            return hour + minute + ':' + second;
        }
    },
    initAudioPlayer: function () {
        var intDuration = 0;//音频时长
        var strDuration = '';//音频时长
        var audioSource = $(".play_control audio")[0];
        console.log(audioSource);
        var isNotPlaying = true;
        //当前时间
        var strStart = Main.calTime(audioSource.currentTime);
        $('.start_time').text(strStart);
        audioSource.oncanplay = function () {
            intDuration = audioSource.duration;
            strDuration = Main.calTime(audioSource.duration);
            $('.end_time').text(strDuration);
            //
            var startRight = 30;
            setInterval(function () {
                var strTime = Main.calTime(audioSource.currentTime);
                $('.start_time').text(strTime);
                //新方法
                var progressWidth = $('.progress_line').width();
                var widthline = Math.round(audioSource.currentTime) / Math.round(intDuration) * progressWidth;
                var pastime = $('.progress_icon')[0];
                pastime.style.width = widthline + "px";
            }, 500);
        };
        console.log(audioSource.currentTime);
        $('.play_control').on('click', function () {
            var audioSrc = audioList[0];
            var that = $('#play_state');//展示播放状态的图标
            audioSrc.addEventListener('pause', function () {
                that.attr('class', 'play');
                isNotPlaying = false;
                $('.play_cover').addClass('toggleMusic');
            }, false);
            audioSrc.addEventListener('ended', function () {
                that.attr('class', 'play');
                isNotPlaying = false;
                $('.play_cover').addClass('toggleMusic');
            }, false);
            if (!isNotPlaying) {
                isNotPlaying = true;
                that.attr('class', 'pause');
                audioSrc.play();
                try {
                    $('.play_cover').removeClass('toggleMusic');
                } catch (e) {
                    console.log(e);
                }

            } else {
                audioSrc.pause();
            }
        });
    },
};
$(function () {
    //
    Main.initDownload();
    Main.initSwiper();
    Main.initAudioPlayer();
});