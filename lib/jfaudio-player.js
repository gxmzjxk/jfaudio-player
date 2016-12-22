'use strict';
var JFAudioPlayer = function () {
    var self = this;
    this.input = arguments[0];
    this.Container = null;//组件主容器
    this.playContainer = null;//音频List容器
    this.audioSource = null;
    this.currentPlayList = [];
    this.isRowPlay = false;
    this.audioStatus = {
        'canplay': null,
        'canplaythrough': null,
        'ended': null,
        'loadeddata': null,
        'loadedmetadata': null,
        'pause': null,
        'play': null,
        'playing': null,
        'progress': null
    };
    this._safariHack = function () {
        var that = this;
        var autoplayConfig = self.input['autoplay'];
        if (typeof autoplayConfig != 'undefined' && autoplayConfig == false) {
            //不需要自动播放
        } else {
            if (!that.audioStatus.playing) {
                try {
                    if (that.audioSource.getAttribute('src')) {
                        that.audioSource.play();
                    } else {
                        console.warn("audioSource的资源路径不合法！");
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            setTimeout(function () {
                if (!that.audioStatus.playing) {
                    JFUtil.addHandler(document, 'touchstart', _safariHackListener);
                }
            }, 500);
        }

    };
    //辅助监听函数
    var _safariHackListener = function () {
        self.start();
        JFUtil.removeHandler(document, 'touchstart');
    };
    this._playStatusHelper = function (audioSource) {
        var that = this;
        //通过事件监听，获取type，更新status的辅助函数
        var updateStatusHelper = function (e) {
            var eType = e.type;
            that.audioStatus[eType] = true;
            if (eType == 'ended') {
                that.audioStatus.pause = true;
                that.audioStatus.playing = false;
                that.audioStatus.progress = false;
            }
            if (eType == 'palying') {
                that.audioStatus.ended = false;
                that.audioStatus.pause = false;
            }
        };

        var listenerFuncHelper = function (e) {
            updateStatusHelper(e);
        };
        if (typeof audioSource != 'undefined') {
            audioSource.addEventListener('canplay', listenerFuncHelper, false);
            audioSource.addEventListener('canplaythrough', listenerFuncHelper, false);
            audioSource.addEventListener('ended', listenerFuncHelper, false);
            audioSource.addEventListener('loadeddata', listenerFuncHelper, false);
            audioSource.addEventListener('loadedmetadata', listenerFuncHelper, false);
            audioSource.addEventListener('pause', listenerFuncHelper, false);
            audioSource.addEventListener('playing', listenerFuncHelper, false);
            audioSource.addEventListener('progress', listenerFuncHelper, false);
        }
    };
    this._init = function () {
        var that = this;
        var _input = that.input;
        //初始化容器
        var jfcontainer = _initContainer();
        if (_input['srcList'] || _input['sourceList']) {
            //初始化 audioList 配置
            self.isRowPlay = true;
            _initAudioList(_input);
        } else {
            //初始化 单个音频 配置
            self.isRowPlay = false;
            _initSingleAudio(_input);
        }
    };
    var _initContainer = function () {
        var _container = document.querySelector("#JFAudioPlayerContainer");
        if (_container) {
            var jfAudioList = _container.querySelector('#JFAudioList');
            if (!jfAudioList) {
                _container.innerHTML = '<div id="JFAudioList" class="JFAudioList"></div>';
            }
        } else {
            _container = document.createElement('div');
            _container.id = 'JFAudioPlayerContainer';
            _container.innerHTML = '<div id="JFAudioList" class="JFAudioList"></div>' +
                '<button data-JFcontrol="stop" name="JFcontrol">stop</button> ' +
                '<button data-JFcontrol="pause" name="JFcontrol">pause</button> ' +
                '<button data-JFcontrol="restart" name="JFcontrol">restart</button> ' +
                '<button data-JFcontrol="start" name="JFcontrol">start</button> ';
            document.body.appendChild(_container);
        }
        //赋值，返回结果
        self.Container = _container;
        self.playContainer = _container.querySelector('#JFAudioList');

        return _container;
    };
    //单音频处理 function
    var _initSingleAudio = function (_input) {
        var _audioSource;
        if (_input && (_input instanceof HTMLAudioElement || _input instanceof Audio)) {
            _audioSource = _input;
        } else {
            _audioSource = _initAudioConfig(_input);
            self.playContainer.appendChild(_audioSource);
        }
        self.audioSource = _audioSource;
        self._playStatusHelper(_audioSource);
        //处理Safari 无法自动播放的问题

        self._safariHack();

        return _audioSource;
    };
    //音频list处理 function
    var _initAudioList = function (_input) {
        var audioList = _input['srcList'] || _input['sourceList'] || [];
        _playAudioList(audioList);
    };
    var _playAudioList = function (audioList) {
        var playFlag = true;
        if (typeof self.input['autoplay'] !== 'undefined' && self.input['autoplay'] == false) {
            playFlag = false;
        }
        //
        if (audioList.length == 0) {
            return;
        }
        if (audioList[0] instanceof HTMLAudioElement || audioList[0] instanceof Audio) {
            //设置第一个音频的属性
            var tmpAudioList = JFUtil.realArray(audioList);
            if (playFlag) {
                tmpAudioList[0].setAttribute('autoplay', 'autoplay');
            } else {
                tmpAudioList[0].removeAttribute('autoplay');
            }
            self.currentPlayList = tmpAudioList;
        } else {
            var audioContainer = document.querySelector('#JFAudioList');
            var _audioHtml = '', _tmp, _audioStr;
            for (var i = 0, len = audioList.length; i < len; i++) {
                _tmp = audioList[i];
                if (i == 0) {
                    if (playFlag) {
                        _audioStr = '<audio preload="auto" src="' + _tmp + '" data-src="' + _tmp + '" autoplay></audio>';
                    } else {
                        _audioStr = '<audio preload="auto" src="' + _tmp + '" data-src="' + _tmp + '"></audio>';
                    }
                } else {
                    _audioStr = '<audio preload="auto" src="' + _tmp + '" data-src="' + _tmp + '"></audio>';
                }
                _audioHtml += _audioStr;
            }
            audioContainer.innerHTML = _audioHtml;
            var newAudioList = audioContainer.getElementsByTagName('audio');
            self.currentPlayList = JFUtil.realArray(newAudioList);
        }

        //
        var _audio;
        if (playFlag) {
            _audio = self.currentPlayList.shift();
            if (_audio) {
                var _audioSource = _initSingleAudio(_audio);
                JFUtil.addHandler(_audioSource, 'ended', function () {
                    _playAudioList(self.currentPlayList);
                })
            }

        }

    };
    //初始化 audio 配置，生成 audio 元数据
    var _initAudioConfig = function (_input) {
        var autoplay = true;
        var loop = false;
        var muted = false;
        if (typeof _input['autoplay'] != 'undefined' && _input['autoplay'] == false) {
            autoplay = false;
        }
        if (typeof _input['loop'] != 'undefined' && _input['loop'] == true) {
            loop = true;
        }
        if (typeof _input['muted'] != 'undefined' && _input['muted'] == true) {
            muted = true;
        }
        var _audioSource = document.createElement('audio');
        if (_input['source']) {
            _audioSource = _input['source'];
            _audioSource.setAttribute('preload', 'auto');
        } else if (_input['src']) {
            _audioSource = document.createElement('audio');
            _audioSource.setAttribute('preload', 'auto');
            _audioSource.src = _input['src'];
            _audioSource.type = 'audio/mpeg';
        } else {
            console.log('没有相应的资源，初始化失败');
        }
        if (autoplay) {
            _audioSource.setAttribute('autoplay', 'autoplay');
        }
        if (loop) {
            _audioSource.setAttribute('loop', 'loop');
        }
        if (muted) {
            _audioSource.setAttribute('muted', 'muted');
        }
        return _audioSource;
    };
    //停止，再次即重头开始
    JFAudioPlayer.prototype.stop = function () {
        if (self.audioStatus.playing) {
            self.audioSource.currentTime = 0;
            self.audioSource.pause();
        }
    };
    //暂停，可以续播
    JFAudioPlayer.prototype.pause = function () {
        if (self.audioStatus.playing) {
            self.audioSource.pause();
        }
    };
    //重播
    JFAudioPlayer.prototype.restart = function () {
        if (self.isRowPlay) {
            var audioList = self.input['srcList'] || self.input['sourceList'] || [];
            self.input['autoplay'] = true;
            _playAudioList(audioList);
        } else {
            self.audioSource.currentTime = 0;
            self.audioSource.play();
        }

    };
    //播放
    JFAudioPlayer.prototype.start = function () {
        if (self.isRowPlay) {
            var audioList = self.input['srcList'] || self.input['sourceList'] || [];
            self.input['autoplay'] = true;
            _playAudioList(audioList);
        } else {
            if (self.audioStatus.pause === null || self.audioStatus.pause) {
                //准备播放
                self.audioSource.play();
            }
        }

    };
    this._init();
};