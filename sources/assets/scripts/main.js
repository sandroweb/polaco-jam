/*global document, window, setTimeout */
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
            currStepIndex = -1;

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

        function reset() {
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

        function start() {
            currStepIndex = 0;
            play();
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
            load: load,
            getCurrStepIndex: function () {
                return currStepIndex;
            },
            start: start
        };

    }());

    intro = (function () {
        var scope = $('#intro');

        function hide(callback) {
            scope.fadeOut(300, function () {
                callback();
            });
        }

        return {
            hide: hide
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