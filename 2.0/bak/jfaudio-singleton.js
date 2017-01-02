const JFAudioPlayer = (function () {
    var jfAudioInstance;
    var initialize = function () {
        var _initcontainer = function () {
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

            return _container;
        };
        var __container = _initcontainer();
        return {
            container : __container
        };
    };
    return {
        init : function () {
            if(!jfAudioInstance){
                jfAudioInstance = initialize();
                return jfAudioInstance;
            }
        }
    };
})();

var jfPlayer = JFAudioPlayer.init();
console.log(jfPlayer);
