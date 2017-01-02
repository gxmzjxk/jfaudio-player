'use strict';
//杂项 start
//日志
var jLog = function (data, infoTag = 'tag：') {
    var area = document.querySelector('#debugArea');
    var html = "<section>" + infoTag + "|time:" + new Date().getTime() + "：" + JSON.stringify(data) + "</section>";
    area.insertAdjacentHTML('beforeEnd', html);
};
//杂项 end

/**
 * @constructor
 * @desc    先只处理单个实例
 */
var JFAudio = function () {
    //基础属性
    this.audioStatus = {
        canplay: false, //初始化时还不能播放
        ended: null,    //初始化时未知（或者认为是停止）
        playing: false, //初始化时未播放
        emptied: false, //初始化时没有错误
        pause: true,    //是否暂停
    };
    this.input = arguments[0];
    //全局变量
    const self = this;
    const params = arguments[0];

    /**
     * @desc 基础方法 start
     */
        // 监听并更新音频的状态
    var _updateAudioStatus = function () {
            var _audioModel = this;
            var _source = this.audioSource;
            var _audioStatus = this.audioStatus;
            // 配置初始化回调，包括canplay,ended
            var _audioConfigCal = function (cal) {
                if (typeof cal === 'function') {
                    cal();
                }
            };
            //更新 音频状态 辅助函数
            var _updateStatusHelper = function (e) {
                var eType = e.type;
                _audioStatus[eType] = true;
                if (eType === 'ended') {
                    _audioStatus.pause = true;
                    _audioStatus.playing = false;
                    _audioConfigCal(_audioModel.input.ended);

                }
                if (eType === 'palying') {
                    _audioStatus.ended = false;
                    _audioStatus.pause = false;
                }
                if (eType === 'canplay') {
                    if (!_audioModel.canplay) {
                        _audioConfigCal(_audioModel.input.initialed);
                    }
                }
            };
            if (typeof _source != 'undefined') {
                _source.addEventListener('playing', _updateStatusHelper, false);
                _source.addEventListener('ended', _updateStatusHelper, false);
                _source.addEventListener('canplay', _updateStatusHelper, false);
                _source.addEventListener('emptied', _updateStatusHelper, false);
            }
        };
    var _initAudioGlobal = function () {
        _updateAudioStatus();
    };
    const initialize = function () {
        _initAudioGlobal();
    };
    //初始化
    initialize();
};
JFAudio.prototype = (function () {
    var start = function () {
        var source = this.audioSource;
        source.play();
        jLog("点击播放", "77");
    };
    var pause = function () {
        this.audioSource.pause();
    };
    var stop = function () {

    };
    var restart = function () {

    };
    return {
        start,
        pause,
        stop,
        restart
    }
})();

JFUtil.ready(function () {
    var tmp1 = new JFAudio({
        config: {
            loop: false
        },
        type: 'audio',
        source: "./mp3/ball.mp3",
        initialed: function () {
            jLog(tmp1, "104");
        },
        ended: function () {
            jLog(tmp1.audioStatus, "108");
        }
    });
    console.log(tmp1);
    var userClick = document.querySelector('#userClickPlay');
    JFUtil.addHandler(userClick, 'click', function () {
        tmp1.start();
    })
});
