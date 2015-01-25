'use strict';

WIN95.templates = {

	icon:
	'<div class="icon" data-icon="{{ID}}" data-status="normal">'
		+ '<img src="win93/img/icons/{{image}}.ico" alt="" draggable="false" />'
		+ '<span>{{text}}</span>'
		+ '<textarea></textarea>'
	+ '</div>',

	explorer:
	'<div class="window explorer" data-window="{{ID}}" data-status="selected">'
		+ '<div class="windowTitleBar">'
			+ '<img src="win93/img/icons/{{image}}.ico" alt="" />'
			+ '<span>{{title}}</span>'
			+ '<div class="windowTitleBarButtons">'
				+ '<div class="windowTitleBarMinimize" data-status="enabled"></div>'
				+ '<div class="windowTitleBarMaximize" data-status="enabled"></div>'
				+ '<div class="windowTitleBarClose" data-status="enabled"></div>'
			+ '</div>'
		+ '</div>'
		+ '<ul class="windowMenuBar">'
			+ '<li data-open="false"><a href="#"><u>F</u>ile</a></li>'
			+ '<li data-open="false"><a href="#"><u>E</u>dit</a></li>'
			+ '<li data-open="false"><a href="#"><u>V</u>iew</a></li>'
			+ '<li data-open="false"><a href="#"><u>H</u>elp</a></li>'
		+ '</ul>'
		+ '<div class="explorerContents"></div>'
		+ '<div class="explorerStatusBar">'
			+ '<div class="explorerStatusBarLeft"><span></span></div>'
			+ '<div class="explorerStatusBarRight"><span></span></div>'
		+ '</div>'
	+ '</div>',

	taskBarItem:
	'<div class="taskBarItem" data-taskBarItem="{{ID}}" data-status="normal">'
		+ '<img src="win93/img/icons/{{image}}.ico" alt="" />'
		+ '<span>{{title}}</span>'
	+ '</div>',

	dialogBox:
	'<div class="window dialogBox" data-window="{{ID}}" data-status="selected">'
		+ '<div class="windowTitleBar">'
			+ '<span>{{title}}</span>'
			+ '<div class="windowTitleBarButtons">'
				+ '<div class="windowTitleBarClose" data-status="disabled"></div>'
			+ '</div>'
		+ '</div>'
		+ '<div class="dialogBoxContents">'
			+ '<span>{{{text}}}</span>'
		+ '</div>'
		+ '<div class="dialogBoxButtons"></div>'
	+ '</div>',

	mazeBox:
	'<div class="window dialogBox mazeBox" data-window="{{ID}}" data-status="selected">'
		+ '<div class="windowTitleBar">'
			+ '<span>{{title}}</span>'
			+ '<div class="windowTitleBarButtons">'
				+ '<div class="windowTitleBarClose" data-status="disabled"></div>'
			+ '</div>'
		+ '</div>'
		+ '<div class="dialogBoxContents">'
			+ '<iframe src="cmd.html" scrolling="no" style="width: 911px;height: 491px;"></iframe>'
		+ '</div>'
	+ '</div>',

}