var WIN95 = {}

$(function() {
'use strict';

// The Microsoft Sound
(new Audio('mp3/win95.mp3')).play()

/*
 * Utility functions
 */

// Get time (AM/PM format)
var currentTime = function() {
	var dateObject = new Date()
	var hours = dateObject.getHours()
	var minutes = dateObject.getMinutes()
	var ampm = hours >= 12 ? 'PM' : 'AM'
	hours = hours % 12
	hours = hours ? hours : 12
	minutes = minutes < 10 ? '0' + minutes : minutes
	return hours + ':' + minutes + ' ' + ampm
}

// Generate a unique identifier for every UI element.
WIN95.getUniqueID = function() {
	if (!WIN95.IDCounter) {
		WIN95.IDCounter = 1
	}
	return ++WIN95.IDCounter
}

/*
 * Taskbar
 */

// Start button
var startButton = $('#startButton')

startButton.mousedown(function() {
	$('.icon').attr('data-status', 'normal')
	var isOpen = $(this).attr('data-open')
	if (isOpen === 'true') {
		$(this).attr('data-open', false)
		startMenu.hide()
	}
	else if (isOpen === 'false') {
		$(this).attr('data-open', true)
		startMenu.show()
	}
})

// Taskbar items
WIN95.taskBarItem = function() {
	this.ID    = null,
	this.image = null,
	this.title = null
}

WIN95.taskBarItem.prototype = {
	constructor: WIN95.taskBarItem,
	set: function(data) {
		this.ID    = data.ID
		this.image = data.image
		this.title = data.title
		return this
	},
	render: function() {
		var _this = this
		var element = $(Mustache.render(
			WIN95.templates.taskBarItem, {
				ID:    this.ID,
				image: this.image,
				title: this.title
			}
		))
		.mousedown(function(e) {
			$('.taskBarItem').attr('data-status', 'normal')
			$(this).attr('data-status', 'selected')
			$('[data-window=' + _this.ID + ']').show().mousedown()
		})
		.appendTo('#taskBarItems')
		.attr('data-status', 'selected')
		this.postRender(element)
	},
	postRender: function(element) {
	}
}

// Taskbar clock
setInterval(function() {
	$('#clock span').text(currentTime())
}, 1000)

/*
 * Start menu
 */

var startMenu = $('#startMenu')
$('#startMenuRight').menu()

$('#startMenuRight li').hover(function() {
	$(this).find('a').css('color', '#FFF')
}, function() {
	$(this).find('a').css('color', '#000')
})

/*
 * Desktop
 */

$(document)
.mousedown(function(e) {
	var defocus = [
		$(e.target).parents('.icon').length,
		$(e.target).parents('#startMenu').length,
		$(e.target).parents('#taskBar').length,
		$(e.target).is('#taskBar')
	]
	console.log(defocus)
	var d = false
	for (var i in defocus) {
		if (defocus[i]) {
			d = true
		}
	}
	if (!d) {
		$('.icon').attr('data-status', 'normal')
		if (startButton.attr('data-open') === 'true') {
			startButton.mousedown()
		}
	}
})
.keypress(function(e) {
	if (e.which === 13) {
		$('.icon[data-status=selected]').dblclick()
	}
})
.bind('contextmenu', function(e) {
	return false
})

})