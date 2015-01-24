/*global s_gi, s_account*/
(function ($, win, doc) {

    'use strict';

    /* To debug the video in console:
     * window['video' + 'youtubeVideoId'.toLowerCase() + '-api'].content.player.getVolume();
     */
    $.fn.youtubeVideoPlayer = function (options) {
        options = (options === undefined) ? {} : options;
        win.youtubeVideoPlayers = win.youtubeVideoPlayers || [];

        var content = $(this),
            videoId = content.attr('video-id'),
            videoName = 'video' + videoId.toLowerCase(),
            apiId = videoName + '-api',
            showMosaic = content.attr('video-show-mosaic'),
            showControls = content.attr('video-show-controls'),
            showInfo = content.attr('video-show-info'),
            autoPlay = content.attr('video-auto-play'),
            mutted = content.attr('video-mute'),
            loop = content.attr('video-loop'),
            position = 0,
            interval = null,
            player = null,
            playerIndex = win.youtubeVideoPlayers.length,
            callbackStateChange = 'onYouTubePlayer' + playerIndex + 'StateChange',
            callbackError = 'onYouTubePlayer' + playerIndex + 'Error';

        function onYouTubeIframeAPIReady() {
            win.youtubePlayerLoaded = true;
            win[apiId].buildYoutube();
        }

        win.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

        win.youtubeVideoPlayers[playerIndex] = apiId;

        win[callbackStateChange] = function (s) {
            win[apiId].onStateChange(s);
        };

        win[callbackError] = function (e) {
            win[apiId].onError(e);
        };

        win.youtubeVideoPlayers = content;

        showMosaic = showMosaic || 0;
        showControls = showControls || 0;
        showInfo = showInfo || 0;
        autoPlay = autoPlay || 0;
        mutted = mutted || 0;
        loop = loop || 0;

        function onStateChange(s) {
            switch (s) {
            case -1:
                position = 0;
                break;
            case 0:
                if (options.onFinished !== undefined) {
                    options.onFinished(content.player);
                    position = 0;
                }
                if (parseInt(loop, 10) === 1) {
                    content.player.playVideo();
                }
                break;
            case 1:
                if (options.onPlaying !== undefined) {
                    options.onPlaying(content.player);
                }
                break;
            case 2:
                if (options.onPaused !== undefined) {
                    options.onPaused(content.player);
                }
                break;
            }
        }

        function onUpdate() {
            if (doc.getElementById(videoName) === null) {
                clearInterval(interval);
            }

            if (options.onUpdate !== undefined) {
                if (content.player !== undefined && content.player.getPlayerState !== undefined && content.player.getPlayerState() === 1) {
                    options.onUpdate(content.player);
                }
            }

            if (player && player.getDuration) {
                var p = player.getCurrentTime(),
                    d = player.getDuration(),
                    c = p / d * 100;

                c = Math.round(c);
                if (player.isReset) {
                    c = 0;
                }
                player.c = c;
                if (!player.completed) {
                    if (c >= 1 && position === 0 && c < 25) {
                        position = 1;
                    } else if (c >= 25 && position <= 1 && c < 50) {
                        position = 2;
                    } else if (c >= 50 && position <= 2 && c < 75) {
                        position = 3;
                    } else if (c >= 75 && position <= 3 && c < 100) {
                        position = 4;
                    } else if (c === 100 && position <= 4) {
                        position = 5;
                    }
                }
            }
        }

        function onError(e) {
            return e;
        }

        function buildYoutube() {
            content.player = new YT.Player(videoName, {
                height: '100%',
                width: '100%',
                videoId: videoId,
                origin: win.location.protocol + '//' + win.location.host,
                playerVars: {
                    controls: showControls,
                    showinfo: showInfo,
                    playsinline: 0,
                    autoplay: autoPlay,
                    rel: showMosaic
                },
                events: {
                    'onReady': function (event) {
                        if (options.onReady !== undefined) {
                            options.onReady(content.player);
                        }
                        if (parseInt(mutted, 10) === 1) {
                            content.player.mute();
                        }
                        interval = setInterval(onUpdate, 50);
                        onUpdate();
                        return event;
                    },
                    'onStateChange': function (event) {
                        onStateChange(event.data);
                        return event;
                    },
                    'onError': callbackError
                }
            });
        }

        function loadPlayer() {
            var tag = doc.createElement('script'),
                firstScriptTag = doc.getElementsByTagName('script')[0];

            tag.src = "https://www.youtube.com/iframe_api";
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        function init() {
            position = 0;
            content.html($('<div />').attr('id', videoName));

            if (win.youtubePlayerLoaded === true) {
                buildYoutube();
            } else {
                loadPlayer();
            }
        }

        // function getStateChange() {
        //     return player.getPlayerState();
        // }

        init();

        win[apiId] = {
            content: content,
            buildYoutube: buildYoutube,
            onStateChange: onStateChange,
            onError: onError
        };
    };

}(jQuery, window, document));