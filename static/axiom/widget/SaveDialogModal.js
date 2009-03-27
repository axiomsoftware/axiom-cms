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
 Copyright Axiom
 Nick Campbell
 */

dojo.provide("axiom.widget.SaveDialogModal");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");

dojo.widget.defineWidget(
    "axiom.widget.SaveDialogModal",
    axiom.widget.AxiomModal,
    function(){},
    {
	appPath:    '',
	staticPath: '',
	prototype:  '',
	callback: '',
	templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/SaveDialogModal.html'),
	templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/EditTaskModal.css'),
	close:function(){
	    axiom.closeModal();
	},
	onEnter:function(){
	    this.save();
	},
	dontSave:function() {
	    axiom.dirtyProps = {};
	    axiom.showContent();
	    this.close();
	},
	save:function(){
	    axiom.triggerSubmitEdit(this.callback);
	    this.close();
	},
	postCreate:function() {
	    this.title.innerHTML = 'Save Dialog';
	    this.img.src = this.staticPath+'/axiom/images/alert.gif';
	}
    }
);
