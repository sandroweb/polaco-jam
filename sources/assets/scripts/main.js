/*global document */
(function ($) {

    'use strict';

    (function terminal() {

        var scope = $('#terminal'),
            content = $('.content'),
            field = scope.find('.field'),
            lines = scope.find('.lines'),
            lineTemplate = $('#terminal-line-template').text(),
            cursorTemplate = $('#terminal-cursor-text-template').text();

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
            // lines.find('.line').eq(getLastIndex()).find('.text-content').html(cursorTemplate);
            setLine(null, '');
        }

        function refreshLine() {
            setLine(null, field.val());
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
                    if (e.which === 13) {
                        createLine();
                        field.val('');
                    } else {
                        refreshLine();
                    }
                    break;
                }
            });
            createLine();
        }

        init();

    }());

}(jQuery));