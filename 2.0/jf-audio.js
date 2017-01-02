/**
 *
 * @param options
 * @constructor
 * @limit   只支持单音频，只支持src方式配置
 */
var JFAudio = function (options = {}) {
    this.src = options.src;
    this.fatherContainer = options.fatherContainer;
    this.source = options.source;
    this.status = {
        canplay: false, //初始化时还不能播放
        ended: null,    //初始化时未知（或者认为是停止）
        playing: false, //初始化时未播放
        emptied: false, //初始化时没有错误
        pause: true,    //是否暂停
    };
    //一些初始化操作
    this.init(options);
};
JFAudio.prototype.init = function (options) {
    //初始化容器
    var initAudioContainer = function (options) {
        var _container = document.querySelector(options.fatherContainer);
        _container = _container || document.querySelector("#JFAudioContainer");
        if (!_container) {
            _container = document.createElement('div');
            _container.id = 'JFAudioContainer';
            //并添加到DOM流中，这里就不做拆分了
            document.body.appendChild(_container);
        }
        return _container;
    };
    //初始化音频
    var initAudioByConfig = function (options) {
        var config = options.config || {};
        var _source = document.createElement('audio');
        var autoplay = true;
        var loop = false;
        if (typeof config.autoplay !== 'undefined' && config.autoplay === false) {
            autoplay = false;
        }
        if (typeof config.loop !== 'undefined' && config.loop === true) {
            loop = true;
        }
        //
        _source.setAttribute('preload', 'auto');
        _source.src = options.src;
        _source.type = 'audio/mpeg';
        //
        if (autoplay) {
            _source.setAttribute('autoplay', 'autoplay');
        }
        if (loop) {
            _source.setAttribute('loop', 'loop');
        }

        return _source;
    };
    //实例化操作，分多步骤
    if (options) {
        this.fatherContainer = initAudioContainer(options);//容器
        if (options.src) {
            this.source = initAudioByConfig(options);//音频源
        } else {
            throw new Error("Lost the audio src");
        }
    } else {
        throw new Error("Please check your params");
    }
};

var JFAudioListener = function (jfAudio) {
    this.target = jfAudio;
    this.updateAudioStatus = function () {

    };
    this._audioConfigCal = function () {

    };
    this._updateStatusHelper = function (e) {
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
    this.init = function () {
        if (typeof _source != 'undefined') {
            _source.addEventListener('playing', _updateStatusHelper, false);
            _source.addEventListener('ended', _updateStatusHelper, false);
            _source.addEventListener('canplay', _updateStatusHelper, false);
            _source.addEventListener('emptied', _updateStatusHelper, false);
        }
    };
    this.updateAudioStatus = function () {
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
};

JFUtil.ready(function () {
    var model = document.querySelector('#testModel');
    var audio1 = new JFAudio({
        src: model.src,
        fatherContainer: '#myDiyContainer',
        config: {
            autoplay: true,
            loop: false,
            hack: false,
        }
    });
    console.log(audio1);
});
