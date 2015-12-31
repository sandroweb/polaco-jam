'use strict';

WIN95.mazeBox = function() {
	this.ID      = null
	this.image   = 'regedit_201'
	this.title   = 'Explorer'
	this.text    = ''
	this.buttons = {}
}

WIN95.mazeBox.prototype = {
	constructor: WIN95.mazeBox,
	set: function(data) {
		this.ID      = data.ID
		this.image   = data.image
		this.title   = data.title
		return this
	},
	draggableOptions: {
		containment: 'window',
		handle: '.windowTitleBar'
	},
	render: function() {
		var _this = this
		var position = [
			document.width  / 3.5,
			document.height / 3
		]
		var element = $(Mustache.render(
			WIN95.templates.mazeBox, {
				ID:    this.ID,
				title: this.title,
			}
		))
		.appendTo('#desktop')
		.draggable(this.draggableOptions)
		.mousedown(function() {
			$('[data-window]').attr('data-status', 'normal')
			$('.taskBarItem').attr('data-status', 'normal')
			$(this).attr('data-status', 'selected')
		})
		.on('remove', function() {
		})
		.css({
			'position': 'absolute',
			'left': position[0],
			'top':  position[1],
			'width': '877px',
			'height': '515px'
		})
		.mousedown()


		this.postRender(element)
	},
	postRender: function(element) {



	}
}