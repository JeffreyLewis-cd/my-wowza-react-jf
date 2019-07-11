import React, {PureComponent} from "react";

import videojs from "video.js";


class H5Player extends PureComponent {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.initVideojs();
    }

    /*初始化播放器*/
    initVideojs() {
        // 设置flash路径,用于在videojs发现浏览器不支持HTML5播放器的时候自动唤起flash播放器
        videojs.options.flash.swf = 'https://cdn.bootcss.com/videojs-swf/5.4.1/video-js.swf';
        var player = videojs('my-player'); //my-player为页面video元素的id
        player.play(); //播放
        //    1. 播放   player.play()
        //    2. 停止   player.pause()
        //    3. 暂停   player.pause()
    }

    render() {
        return (
            <div className='h5_player'>
                <p>H5</p>
                <video id="my-player" className="video-js vjs-default-skin vjs-big-play-centered" controls
                       preload="auto" autoPlay="autoplay"
                       poster="//vjs.zencdn.net/v/oceans.png" width="500" height="800" data-setup='{}'>
                    /*src: 规定媒体文件的 URL  type:规定媒体资源的类型*/
                    <source src='rtmp://182.151.49.151:1935/live/John_PC' type='rtmp/flv'/>
                </video>
            </div>
        )
    }

}

export default H5Player;
