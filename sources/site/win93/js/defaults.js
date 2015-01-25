$(function() {
'use strict';

/*
 * Desktop icons
 */

WIN95.desktopIcons = {}

WIN95.desktopIcons.myComputer = new WIN95.icon()
WIN95.desktopIcons.myComputer.set({
	ID:     'myComputer',
	image:  'explorer_100',
	text:   'My Computer',
	rename: true
}).render('#desktopIcons')

WIN95.desktopIcons.networkNeighborhood = new WIN95.icon()
WIN95.desktopIcons.networkNeighborhood.set({
	ID:     'networkNeighborhood',
	image:  'shell32_18',
	text:   'Network Neighborhood',
	rename: true
}).render('#desktopIcons')

WIN95.desktopIcons.recycleBin = new WIN95.icon()
WIN95.desktopIcons.recycleBin.set({
	ID:     'recycleBin',
	image:  'shell32_32',
	text:   'Recycle Bin',
	rename: false
}).render('#desktopIcons')

/*
 * Explorer icons
 */


window.setTimeout(function() {

	var dialog = new WIN95.dialogBox()
	dialog.set({
		ID:      WIN95.getUniqueID(),
		image:   'access_110',
		title:   'MsgBot',
		text:    'Hey pal.\
	<br><br>\
		I have been working really hard to decrypt that stuff we found in the abandoned campus.\
	<br><br>\
		I was quite frustrated when you decided to leave this job, but I\'m here to ask your help.\
	<br><br>\
		This message has been scheduled to be send to you if I don\'t log in my e-mail account for three days. Which means something bad happened with me as you predicted.\
	<br><br>\
		Please, I need your help. You need to continue my work.\
	<br><br>\
		The lastest version of the file is attached to this message.\
	<br><br>\
	<br><br>\
		Good luck.\
	<br><br>\
		S0ADEX\
	<br><br><br><br>\
		',
		buttons: {
			'Open File': function(button) {
				dialog.close();

				var maze = new WIN95.mazeBox()
				maze.set({
					ID:      WIN95.getUniqueID(),
					title:   'MaZe.exe'
				}).render();

			}
		}
	}).render()



}, 3000)

})