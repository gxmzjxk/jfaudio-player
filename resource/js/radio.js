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
            //\u79FB\u9664\u7ED1\u5B9A\u4E8B\u4EF6
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
        var intDuration = 0;//\u97F3\u9891\u65F6\u957F
        var strDuration = '';//\u97F3\u9891\u65F6\u957F
        var audioSource = audioList[0];
        console.log(audioSource);
        var isNotPlaying = true;
        //\u5F53\u524D\u65F6\u95F4
        var strStart = Main.calTime(audioSource.currentTime);
        $('.start_time').text(strStart);

        var initProgress = function () {
            setInterval(function () {
                intDuration = audioSource.duration;
                strDuration = Main.calTime(audioSource.duration);
                $('.end_time').text(strDuration);
                //
                var strTime = Main.calTime(audioSource.currentTime);
                $('.start_time').text(strTime);
                //\u65B0\u65B9\u6CD5
                var progressWidth = $('.progress_line').width();
                var widthline = Math.round(audioSource.currentTime) / Math.round(intDuration) * progressWidth;
                var pastime = $('.progress_icon')[0];
                pastime.style.width = widthline + "px";
            }, 500);
        };
        initProgress();
        var listenAudioState = function () {
            var audioSrc = audioSource;
            var that = $('#play_state');//\u5C55\u793A\u64AD\u653E\u72B6\u6001\u7684\u56FE\u6807
            audioSrc.addEventListener('pause', function () {
                that.attr('class', 'play2');
                isNotPlaying = false;
                $('.play_cover').addClass('toggleMusic');
            }, false);
            audioSrc.addEventListener('ended', function () {
                that.attr('class', 'play2');
                isNotPlaying = false;
                $('.play_cover').addClass('toggleMusic');
            }, false);
        };
        listenAudioState();
        $('.play_button').on('click', function () {
            var audioSrc = audioSource;
            console.log(audioSrc);
            var that = $('#play_state');//展示播放状态的图标
            if (!isNotPlaying) {
                isNotPlaying = true;
                that.attr('class', 'pause2');
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

        setTimeout(function () {
            if (audioSource.duration > 0 && !audioSource.paused) {
                console.log("2\u79D2\u8FC7\u540E\u5DF2\u7ECF\u80FD\u591F\u6B63\u5E38\u64AD\u653E");
                $('#play_state').attr('class', 'pause2');
            } else {
                $('#play_state').attr('class', 'pause2');
                $('.play_cover').addClass('toggleMusic');
                console.log("\u65E0\u6CD5\u81EA\u52A8\u64AD\u653E");
            }
        }, 2000);
    },
};
$(function () {
    //
    Main.initDownload();
    Main.initAudioPlayer();
});