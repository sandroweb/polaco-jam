/*global document, window, setTimeout, Howl */
(function ($, win) {

    'use strict';

    var way,
        intro,
        terminal,
        name = 'mAzE';

    way = (function () {
        var scope = $('#way'),
            video = scope.find('video')[0],
            loadedCallback,
            steps,
            currStepIndex = -1,
            backgroundSound,
            totalTime = 60 * 4,
            currentTime = 0,
            timeInterval;

        function getCurrStep() {
            return steps[currStepIndex];
        }

        function play() {
            video.play();
        }

        function executeLoadedCallback() {
            loadedCallback();
            // console.log(loadedCallback);
        }

        function load() {
            video.onloadeddata = function () {
                var soundLoader = new Howl({
                    urls: ['assets/sounds/capetatech.mp3'],
                    autoplay: true,
                    loop: true,
                    volume: 0,
                    onload: function () {
                        backgroundSound = soundLoader;
                        executeLoadedCallback();
                        win.backgroundSound = backgroundSound;
                        return backgroundSound;
                    }
                });
            };
            $.post('assets/json/data.json', null, function (r) {
                steps = r;
                $(video).append('<source src="assets/videos/intro.mp4" type="video/mp4">');
            });
        }

        function reset() {
            clearInterval(timeInterval);
            currentTime = 0;
            currStepIndex = -1;
            video.currentTime = 0;
        }

        function setSteps(arr) {
            steps = arr;
        }

        function setDirection(direction) {
            if (getCurrStep().direction === direction) {
                terminal.hide(function () {
                    currStepIndex = currStepIndex + 1;
                    play();
                });
            } else {
                terminal.addText('Voc&ecirc; errou!!!', function (txt) {
                    reset();
                    setTimeout(function () {
                        terminal.restart();
                    }, 800);
                    return txt;
                });
            }
        }

        function ontimeupdate() {
            var step = getCurrStep();
            if (video.currentTime >= step.time) {
                if (video.paused === false) {
                    video.pause();
                    terminal.show(function () {
                        terminal.addText(step.description, function (txt) {
                            return txt;
                        });
                    });
                }
            }
        }

        function timeEnded() {
            terminal.addText('Acabou o tempo!!!', function () {
                console.log('kjshfhkjd fsjh kjs dfkdfsh');
            });
        }

        function start() {
            // var maxVolume = 0.2;
            currStepIndex = 0;
            play();
            timeInterval = setInterval(function () {
                if (currentTime < totalTime) {
                    currentTime = currentTime + 1;
                    // backgroundSound.volume(currentTime * maxVolume / totalTime);
                } else {
                    timeEnded();
                }
            }, 1000);
        }

        function init(callback) {
            loadedCallback = callback;
            video.muted = true;
            video.loop = true;
            video.ontimeupdate = ontimeupdate;
            load();
        }

        return {
            init: init,
            setSteps: setSteps,
            setDirection: setDirection,
            getCurrStepIndex: function () {
                return currStepIndex;
            },
            start: start
        };

    }());

    intro = (function () {
        var scope = $('#intro'),
            video = scope.find('video')[0],
            loadedCallback;

        function load() {
            video.onloadeddata = function () {
                loadedCallback();
            };
            $(video).append('<source src="assets/videos/intro.mp4" type="video/mp4">');
        }

        function hide(callback) {
            scope.fadeOut(300, function () {
                callback();
            });
        }

        function play() {
            video.currentTime = 40;
            video.play();
        }

        function ontimeupdate() {
            if (video.currentTime === video.duration) {
                hide(terminal.init);
            }
        }

        function init(callback) {
            loadedCallback = callback;
            video.muted = false;
            video.loop = false;
            video.ontimeupdate = ontimeupdate;
            load();
        }

        return {
            init: init,
            hide: hide,
            play: play
        };
    }());

    terminal = (function () {

        var scope = $('#terminal'),
            content = $('.content'),
            field = scope.find('.field'),
            lines = scope.find('.lines'),
            lineTemplate = $('#terminal-line-template').text(),
            cursorTemplate = $('#terminal-cursor-text-template').text(),
            textAnimationInterval,
            locked = true;

        function startFocus() {
            field.focus();
        }

        function show(callback) {
            scope.fadeIn(300, function () {
                startFocus();
                callback();
            });
        }

        function hide(callback) {
            scope.fadeOut(300, function () {
                callback();
            });
        }

        function lock() {
            locked = true;
        }

        function unlock() {
            field.val('');
            locked = false;
        }

        function refreshScroll() {
            content.css({
                'margin-top': (lines.height() - scope.height()) * -1
            });
        }

        function getLastIndex() {
            return lines.find('.line').length - 1;
        }

        function setLine(index, content) {
            index = index || getLastIndex();
            lines.find('.line').eq(index).find('.text-content').html(name + ':/> ' + content + cursorTemplate);
            refreshScroll();
        }

        function createLine() {
            lines.append(lineTemplate);
            setLine(null, '');
            field.val('');
        }

        function refreshLine() {
            setLine(null, field.val());
        }

        function addText(txt, callback) {
            lock();
            textAnimationInterval = setInterval(function () {
                if (field.val().length === txt.length) {
                    clearInterval(textAnimationInterval);
                    createLine();
                    unlock();
                    callback(txt);
                } else {
                    field.val(txt.substr(0, field.val().length + 1));
                    refreshLine();
                }
            }, 20);
        }

        function reset() {
            lines.html('');
        }

        function start() {
            createLine();

            addText('[[[ Pressione a barra de espa&ccedil;o para come&ccedil;ar ]]]', function () {
                console.log('Aguardando ...');
            });
        }

        function restart() {
            reset();
            start();
        }

        function init() {
            startFocus();
            field.on('focusout keypress keyup', function (e) {
                switch (e.type) {
                case 'focusout':
                    startFocus();
                    break;
                // case 'keypress':
                case 'keyup':
                    var key = String.fromCharCode(e.keyCode).toLowerCase();
                    console.log(locked);
                    if (locked === false) {
                        switch (key) {
                        case 'e':
                        case 'd':
                        case 'f':
                            way.setDirection(key);
                            refreshLine();
                            createLine();
                            lock();
                            break;
                        case ' ':
                            if (way.getCurrStepIndex() === -1) {
                                hide(function () {
                                    intro.hide(way.start);
                                });
                            }
                            break;
                        }
                    }
                    break;
                }
            });
            start();
        }

        return {
            init: init,
            show: show,
            hide: hide,
            addText: addText,
            lock: lock,
            unlock: unlock,
            restart: restart
        };

    }());

    function onLoaded() {
        intro.play();
    }

    win.onload = function () {
        intro.init(function () {
            way.init(function () {
                onLoaded();
            });
        });
        // way.init();
        // way.setLoadedCallback(function () {
        //     terminal.init();
        // });
        // way.load();
    };

    win.way = way;
    win.terminal = terminal;

}(jQuery, window));