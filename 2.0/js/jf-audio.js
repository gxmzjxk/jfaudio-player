var jLog = function (data, _infoTag) {
    var infoTag = _infoTag || 'tag：';
    var area = document.querySelector('#debugArea');
    if (!area) {
        area = document.createElement('div');
        area.id = 'debugArea';
        _$('#resourceContainer').appendChild(area);
        // document.body.appendChild(area);
    }
    var html = "<section>" + infoTag + "|time:" + new Date().getTime() + "：" + JSON.stringify(data) + "</section>";
    area.insertAdjacentHTML('beforeEnd', html);
};
var _$ = function (selector) {
    return document.querySelector(selector);
};
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

/**
 * @desc 播放器，使用入口 JFAudioPlayer.init({config});
 * @type {{init}}
 * @main    入口
 */
var JFAudioPlayer = (function () {
    'use strict';
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
    JFAudio.prototype = {
        start: function () {
            this.source.play();
        },
        pause: function () {
            this.source.pause();
        },
        stop: function () {
            this.source.pause();
            this.source.currentTime = 0;
        },
        restart: function () {
            this.source.currentTime = 0;
            this.source.play();
        },
        getCurrentTime: function () {
            return this.source.currentTime || 0;
        }
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
            var loop = false;

            if (typeof config.loop !== 'undefined' && config.loop === true) {
                loop = true;
            }
            //
            _source.setAttribute('preload', 'auto');
            _source.src = options.src;
            _source.type = 'audio/mpeg';
            //
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
    /**
     *
     * @param jfAudio
     * @constructor
     * @desc    观察者1：观察和监听jfAudio的状态的变化，并更新 JFAudio
     */
    var JFAudioListener = function (_jfAudio, _jfView) {
        this.target = _jfAudio;
        var $audio = _jfAudio;
        var $view = _jfView;
        //在new JFAudio 的时候配置的回调
        var _audioConfigCal = function (cal) {
            if (typeof cal === 'function') {
                cal();
            }
        };
        //是否添加 touch 的hack，只针对 autoplay 为 TRUE 有效
        var _fakeAutoplayHack = function () {
            var _config = $audio.config;
            var _hackTimer;
            var _touchListener = function (e) {
                if (e.target && e.target.id && e.target.id === 'play_state') {
                    //如果点击的是播放按钮，让其触发默认的播放事件即可
                    clearTimeout(_hackTimer);
                    document.removeEventListener('touchstart', _touchListener, false);
                } else {
                    $audio.start();
                    $view.$updateView($audio);
                    clearTimeout(_hackTimer);
                    document.removeEventListener('touchstart', _touchListener, false);
                }

            };
            var _autoPlayHackFunc = function () {
                _hackTimer = setTimeout(function () {
                    if (!$audio.status.playing) {
                        document.addEventListener('touchstart', _touchListener, false);
                    }
                }, 500);
            };
            if (_config.autoplay) {
                //兼容处理 polyfill
                if ((client.browser.chrome > 0 || client.browser.firefox > 0) && plat !== 'android') {
                    $audio.start();
                } else if (uPlat === 'android_weixin') {
                    $audio.start();
                } else {
                    _autoPlayHackFunc();
                }
            }
        };


        var _updateStatusHelper = function (e) {
            var eType = e.type;
            var _audioStatus = $audio.status;
            var audioConfig = $audio.config;
            _audioStatus[eType] = true;
            if (eType === 'ended') {
                _audioStatus.pause = true;
                _audioStatus.playing = false;
                _audioConfigCal(audioConfig.ended);
            }
            if (eType === 'pause') {
                _audioStatus.playing = false;
            }
            if (eType === 'playing') {
                _audioStatus.pause = false;
            }
            if (eType === 'canplay') {
                $audio.duration = $audio.source.duration;//填上音频时长
                _audioConfigCal(audioConfig.canplay);//已经可以播放
                if (!$audio.initialed) {//初始化完成
                    _audioConfigCal(audioConfig.initialed);
                    $audio.initialed = true;
                }
            }
        };
        this.init = function () {
            var _source = this.target.source;
            if (typeof _source !== 'undefined') {
                _source.addEventListener('playing', _updateStatusHelper, false);
                _source.addEventListener('pause', _updateStatusHelper, false);
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
        var $audio = _jfAudio || {};
        var $info = _info || {};
        var self = this;
        //
        var buildAudioInfo = function () {
            var dom_title = _$('.jfaudio-title');
            var dom_cover = _$('#audioPlayCover');
            if (!dom_title.innerHTML) {
                dom_title.innerHTML = $info.title;
            }
            if (!dom_cover.getAttribute('src')) {
                dom_cover.setAttribute('src', $info.img);
            }
        };
        var buildView = function () {
            var template = '';
            var _audioPlayerInter = null;
            //更新进度条和时间信息
            var _initProgress = function () {
                var intDuration = $audio.duration;
                var strDuration = JFUtil.calAudioTime(intDuration);
                var currentTime = $audio.getCurrentTime();
                _$('.end_time').innerHTML = strDuration;
                //
                var strTime = JFUtil.calAudioTime(currentTime);
                _$('.start_time').innerHTML = strTime;
                //更改进度条长度
                var progressWidth = JFUtil.getRectBoxObj(_$('.progress_line')).width;
                var widthline = Math.ceil(currentTime) / Math.ceil(intDuration) * progressWidth;
                var pastime = _$('.progress_icon');
                pastime.style.width = widthline + "px";
            };
            var _initView = function () {
                if (!_$('#resourceContainer')) {
                    document.body.insertAdjacentHTML('afterbegin', template);
                }
                JFUtil.addHandler(_$("#resourceContainer"), 'click', function (e) {
                    var _target = e.target || e.srcElement;
                    var action = JFUtil.data(_target, 'action');
                    if (action === 'toggleAudioPlay') {
                        if ($audio.status.playing) {
                            $audio.pause();
                        } else {
                            $audio.start();
                        }
                    }
                }, false);

            };
            _initView();
            //
            if (!_audioPlayerInter) {
                _audioPlayerInter = setInterval(function () {
                    //更新视图
                    self.$updateView($audio);
                    //更新进度条
                    _initProgress();
                }, 500);
            }
        };
        //一些初始化操作
        buildAudioInfo();
        buildView();

    };
    JFAudioView.prototype.$updateView = function (_jfAudio) {
        var model = _jfAudio;
        if (model.status.playing) {
            try {
                _$('#play_state').setAttribute('class', 'play2');
                JFUtil.removeClass(_$('#audioPlayCover'), 'toggleMusic');
                // jLog(_$('#audioPlayCover').getAttribute('class'), "262");
            } catch (e) {
                console.warn(e);
            }
        } else {
            try {
                _$('#play_state').setAttribute('class', 'pause2');
                JFUtil.addClass(_$('#audioPlayCover'), 'toggleMusic');

            } catch (e) {
                console.warn(e);
            }
        }
    };

    /**
     * @desc  管理一批音频
     * @constructor
     */
    var JFAudioBatchListener = function () {
        this.audioList = [];
    };
    JFAudioBatchListener.prototype = {
        //播放到最后一个
        playToLast: function () {

        },
        //播放指定的音频
        playSingle: function () {

        },
        //停止所有
        stopAll: function () {

        },
        //播放下一个
        next: function () {

        },

    };

    return {
        initSingle: function (options) {
            var audio = new JFAudio(options);
            var view = new JFAudioView(audio, options.info);
            var listener = new JFAudioListener(audio, view);
            return {
                audio: audio,
                listener: listener,
                view: view
            };
        },
        initAudioList: function (options) {
            //需要添加新的观察者
        }
    };
})();

