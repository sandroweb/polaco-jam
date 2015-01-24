/*global document, window */
(function ($, win) {

    'use strict';

    var way,
        terminal;

    way = (function () {
        var scope = $('#way'),
            video = scope.find('video')[0],
            loadedCallback;
            // interval,
            // intervalTime = 300;

        // function appendTime(time) {
        //     video.currentTime = video.currentTime + time;
        // }

        // function stop() {
        //     clearInterval(interval);
        // }

        // function play() {
        //     interval = setInterval(function () {
        //         appendTime(0.3);
        //     }, intervalTime);
        // }

        function setLoadedCallback(fn) {
            loadedCallback = fn;
            video.onloadeddata = function () {
                if (loadedCallback !== undefined) {
                    loadedCallback();
                }
            };
        }

        function load() {
            $(video).append('<source src="assets/videos/way.mp4" type="video/mp4">');
        }

        function init() {
            video.muted = true;
            // video.autoplay = true;
            video.loop = true;
            // video.play();
        }

        return {
            init: init,
            loadedCallback: loadedCallback,
            setLoadedCallback: setLoadedCallback,
            load: load
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

        function show() {
            scope.fadeIn(300);
        }

        function hide() {
            scope.fadeIn(300);
        }

        function lock() {
            locked = true;
        }

        function unlock() {
            locked = false;
        }

        function refreshScroll() {
            content.css({
                'margin-top': (lines.height() - scope.height()) * -1
            });
        }

        function startFocus() {
            field.focus();
        }

        function getLastIndex() {
            return lines.find('.line').length - 1;
        }

        function setLine(index, content) {
            index = index || getLastIndex();
            lines.find('.line').eq(index).find('.text-content').html(content + cursorTemplate);
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

        function init() {
            startFocus();
            field.on('focusout keypress keyup', function (e) {
                startFocus();
                switch (e.type) {
                case 'focusout':
                    startFocus();
                    break;
                // case 'keypress':
                case 'keyup':
                    if (locked === false) {
                        if (e.which === 13) {
                            createLine();
                        } else {
                            refreshLine();
                        }
                    }
                    break;
                }
            });
            createLine();

            addText('Opa! Bom dia! Eler&ecirc;!', function () {
                console.log('kjsdhfkjshf ksjdhf kjh');
            });
        }

        return {
            init: init,
            show: show,
            hide: hide,
            addText: addText
        };

    }());

    win.onload = function () {
        way.init();
        way.setLoadedCallback(function () {
            console.log('jkfjhdkfjdhskfjhsk j');
            terminal.init();
        });
        way.load();
        console.log('sdjfsdhk');
    };

    win.way = way;
    win.terminal = terminal;

}(jQuery, window));