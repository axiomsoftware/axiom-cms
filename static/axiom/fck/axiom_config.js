/**
 * 
 * File Name: axiom_config.js
 * 	Axiom-specific editor configuration settings.
 * 	See the documentation for more info.
 * 
 * File Authors:
 * 		Developers of Siteworx, Inc.
 */

// Toolbar used in CMS
FCKConfig.ToolbarSets["Siteworx"] = [
	['Source','Templates'],
	['Cut','Copy','Paste','PasteText','PasteWord','-'],
	['Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat'],
	'/',
	['Bold','Italic','Underline','StrikeThrough','-','Subscript','Superscript'],
	['OrderedList','UnorderedList','-','Outdent','Indent'],
	['JustifyLeft','JustifyCenter','JustifyRight','JustifyFull'],
	['LinkSelect','Unlink','Anchor'],
	['ImageSelect','FileSelect','AudioSelect','VideoSelect'],
	['Table','Rule','SpecialChar'],
	'/',
	['FontFormat']
];

// Not sure what this does, leaving it because this is what was changed from the initial configuration
FCKConfig.ImageBrowser = false ;
FCKConfig.FlashBrowser = false ;
FCKConfig.ImageUpload = false ;
FCKConfig.FlashUpload = false ;

// Makes Pressing Enter in IE add a BR so it behaves like Firefox
FCKConfig.EnterMode = 'br' ;

// Adds Plugin for LinkSelect, ImageSelect, FileSelect, AudioSelect, and VideoSelect Toolbar Buttons
FCKConfig.Plugins.Add( 'axiom', null ) ;
