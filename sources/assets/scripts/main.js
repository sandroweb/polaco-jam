/*global document, window */
(function ($, win) {

    'use strict';

    var way,
        terminal;

    way = (function () {
        var scope = $('#way'),
            video = scope.find('video')[0],
            loadedCallback,
            steps,
            currStepIndex = 0;

        function getCurrStep() {
            return steps[currStepIndex];
        }

        function play() {
            video.play();
        }

        function setLoadedCallback(fn) {
            loadedCallback = fn;
            video.onloadeddata = function () {
                if (loadedCallback !== undefined) {
                    loadedCallback();
                }
            };
        }

        function load() {
            $.post('assets/json/data.json', null, function (r) {
                steps = r;
                $(video).append('<source src="assets/videos/way.mp4" type="video/mp4">');
            });
        }

        function setSteps(arr) {
            steps = arr;
        }

        function setDirection(direction) {
            if (getCurrStep().direction === direction) {
                currStepIndex = currStepIndex + 1;
                play();
            }
        }

        function ontimeupdate() {
            var step = getCurrStep();
            console.log(step);
            // console.log(video.currentTime + ' >= ' + step.time, ' $$$$ ', currStepIndex);
            if (video.currentTime >= step.time) {
                video.pause();
                terminal.unlock();
            }
        }

        function init() {
            video.muted = true;
            video.loop = true;
            video.ontimeupdate = ontimeupdate;
        }

        return {
            init: init,
            setSteps: setSteps,
            setDirection: setDirection,
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
            field.val('');
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
                    var key = String.fromCharCode(e.keyCode).toLowerCase();
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
                        }
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
            addText: addText,
            lock: lock,
            unlock: unlock
        };

    }());

    win.onload = function () {
        way.init();
        way.setLoadedCallback(function () {
            terminal.init();
        });
        way.load();
    };

    win.way = way;
    win.terminal = terminal;

}(jQuery, window));