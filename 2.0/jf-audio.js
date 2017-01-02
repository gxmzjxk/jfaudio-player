const jLog = function (data, _infoTag) {
    console.info("日志信息：");
    var infoTag = _infoTag || 'tag：';
    var area = document.querySelector('#debugArea');
    if (!area) {
        area = document.createElement('div');
        area.id = 'debugArea';
        document.body.appendChild(area);
    }
    var html = "<section>" + infoTag + "|time:" + new Date().getTime() + "：" + JSON.stringify(data) + "</section>";
    area.insertAdjacentHTML('beforeEnd', html);
};
const _$ = function (selector) {
    return document.querySelector(selector);
};
/**
 *
 * @param _options
 * @constructor
 * @limit   只支持单音频，只支持src方式配置
 */
var JFAudio = function (_options) {
    var options = _options || {};
    this.src = options.src;
    this.fatherContainer = options.fatherContainer;
    this.source = options.source;
    this.duration = 0;
    this.config = options.config;
    this.initialed = false;
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
    //初始化操作，分多步骤
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
JFAudio.prototype.$update = function () {

};
JFAudio.prototype.start = function () {
    // var str = "andoid_weixin:" + (uPlat === 'android_weixin').valueOf();
    this.source.play();
};
JFAudio.prototype.pause = function () {
    this.source.pause();
};
JFAudio.prototype.stop = function () {
    this.source.pause();
    this.source.currentTime = 0;
};
JFAudio.prototype.restart = function () {
    this.source.currentTime = 0;
    this.source.play();
};
JFAudio.prototype.getCurrentTime = function () {
    return this.source.currentTime || 0;
};
/**
 *
 * @param jfAudio
 * @constructor
 * @desc    观察者1：观察和监听jfAudio的状态的变化，并更新 JFAudio
 */
var JFAudioListener = function (jfAudio) {
    this.target = jfAudio;
    var model = jfAudio;
    //在new JFAudio 的时候配置的回调
    var _audioConfigCal = function (cal) {
        if (typeof cal === 'function') {
            cal();
        }
    };
    //是否添加 touch 的hack，只针对 autoplay 为 TRUE 有效
    var _fakeAutoplayHack = function () {
        var _config = model.config;
        var _hackTimer;
        var _touchListener = function () {
            model.start();
            clearTimeout(_hackTimer);
            document.removeEventListener('touchstart', _touchListener, false);
        };
        var _autoPlayHackFunc = function () {
            _hackTimer = setTimeout(function () {
                if (!model.status.playing) {
                    document.addEventListener('touchstart', _touchListener, false);
                }
            }, 500);
        };
        if (_config.autoplay && _config.hack) {
            _autoPlayHackFunc();
        }
    };


    var _updateStatusHelper = function (e) {
        var eType = e.type;
        var _audioStatus = model.status;
        var audioConfig = model.config;
        _audioStatus[eType] = true;
        if (eType === 'ended') {
            _audioStatus.pause = true;
            _audioStatus.playing = false;
            _audioConfigCal(audioConfig.ended);

        }
        if (eType === 'palying') {
            _audioStatus.ended = false;
            _audioStatus.pause = false;
        }
        if (eType === 'canplay') {
            model.duration = model.source.duration;//填上音频时长
            _audioConfigCal(audioConfig.canplay);//已经可以播放
            if (!model.initialed) {//初始化完成
                _audioConfigCal(audioConfig.initialed);
                model.initialed = true;
            }


        }
    };
    this.init = function () {
        var _source = this.target.source;
        if (typeof _source !== 'undefined') {
            _source.addEventListener('playing', _updateStatusHelper, false);
            _source.addEventListener('ended', _updateStatusHelper, false);
            _source.addEventListener('canplay', _updateStatusHelper, false);
            _source.addEventListener('emptied', _updateStatusHelper, false);
        }
        //hack autoplay
        _fakeAutoplayHack();
    };
    this.init();
};

/**
 * @param jfAudio
 * @constructor
 * @desc    观察者2：监听jfAudio 实际状态的变化，做相应的展示
 */
var JFAudioView = function (_jfAudio, _info) {
    this.audio = _jfAudio || {};
    this.info = _info || {};

    this.buildView();
};
JFAudioView.prototype.buildView = function () {
    var _initView = function () {

    }
};
JFUtil.ready(function () {
    var model = document.querySelector('#testModel');
    var audio1 = new JFAudio({
        // src: './mp3/lovesong.wav',
        src: './mp3/63.mp3',
        fatherContainer: '#myDiyContainer',
        config: {
            autoplay: true,
            loop: false,
            hack: true,
            initialed: function () {
                //初始化完成时执行的操作，只会触发一次
                jLog("初始化完成", "171");
                // audio1.start();
            },
            canplay: function () {
                console.log("可以开始播放了");
            },
            ended: function () {
                console.log("播放结束了");
            }
        },
    });
    var listener = new JFAudioListener(audio1);
    var audioInfo = {
        img : 'http://cdn2.primedu.cn/se/62e0f9ad41ca1340c622696a1c1e1b76',
        title : 'My Aunt Came Back',
        src : 'http://cdn2.primedu.cn/se/16d679b358f3e900cd6b73aab5fd1d04.mp3',
    };
    var jfAudioView = new JFAudioView(audio1, audioInfo);

    JFUtil.addHandler(_$("#JFControlArea"), "click", function (e) {
        var _target = e.target || e.srcElement;
        var action = JFUtil.data(_target, 'action');
        audio1[action]();
    }, false);

    // var count = 0;bakTag
    // var testInter = setInterval(function () {
    //     if (audio1.status.ended || count > 10) {
    //         clearInterval(testInter);
    //     }
    //     console.log(audio1);
    //     console.log(audio1.getCurrentTime());
    //     count++;
    // }, 200);
});
