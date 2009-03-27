/**
 * Axiom Content Management System (CMS)
 * Copyright (C) 2009 Axiom Software Inc.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307
 * USA or contact Axiom Software Inc., 11480 Commerce Park Drive,
 * Third Floor, Reston, VA 20191 USA or email:
 * info@axiomsoftwareinc.com
 * */


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
