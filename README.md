# jfaudio-player
## 介绍
1.提供控制音频的基础API

2.支持单音频，多音频rowPlay

3.支持少许配置，轮循，自动播放等

4.hack Safari 下没法自动播放的问题


## 单音频
### 【配置项】
* 'autoplay': true,//默认值true，自动播放
* 'loop': false,//默认值为false，不循环
* 'source': audioDom,//dom 已经存在
* 'src': 'mp3/ball.mp3',//使用URL，可能存在跨域问题
* 'muted': false,//默认 false，不静音
*


## 多音频
### 【配置项】
* 'srcList': ["./mp3/ball.mp3", "./mp3/car.mp3", "./mp3/kite.mp3", "./mp3/teddybear.mp3"],

* var sourceList = document.getElementsByTagName('audio');
* 'sourceList' : sourceList,
* 队列播放，暂不支持只单个播放
*

## Hack

由于 Safari 多媒体比如要有交互事件才能触发，暂时想到的是给document绑定一个touch事件，用户只要触到屏幕即可播放，模拟自动播放。
后续研究使用new Event自定义事件，dispatchEvent能否突破这个限制。