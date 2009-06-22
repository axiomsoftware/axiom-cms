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

dojo.provide("axiom.widget.BatchStepModal");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.AxiomModal");

dojo.widget.defineWidget(
	"axiom.widget.BatchStepModal",
	axiom.widget.AxiomModal,
	function(){},
	{
		errorField: null,
		templatePath: new dojo.uri.dojoUri('../axiom/widget/resources/BatchStepModal.html'),
		templateCssPath: new dojo.uri.dojoUri('../axiom/widget/resources/ProgressBarModal.css'),
		closeFunc: null,
		okButton: null,
		script_id: null,
		zip_id: null,
		// Send the contents of all the textareas and inputs to the server. If we don't get back {errors: string} then we assume success.
		validateAndClose: function() {
			if(this.okButton.innerHTML.indexOf('Loading') > -1) {
				return;
			}
			this.errors.innerHTML = '';
			this.okButton.innerHTML = 'Loading...';
			var datums = {
				script_id: this.script_id,
				zip_id: this.zip_id,
				form_data: this.serialize()
			};
			var me = this;
			dojo.io.bind({
				url: axiom.cmsPath + 'batchStepAction',
				method: 'post',
				postContent: dojo.json.serialize(datums),
				mimetype: 'text/json',
				contentType: 'text/json',
				load: function(load, response, evt){
					if(response && !response.errors) {
						me.closeFunc.call()
					} else if(response.errors) {
						me.okButton.innerHTML = 'Continue';
						me.errors.innerHTML = response.errors;
					} else {
						me.okButton.innerHTML = 'Continue';
						me.errors.innerHTML = 'Warning: This batch step did not return errors or status. Please contact your system administrator.';
					}
				},
				error: function() {
					me.okButton.innerHTML = 'Continue';
					me.errors.innerHTML = 'An unknown system error has occured at '+(new Date().getHours()+':'+new Date().getMinutes())+'. Please contact your system administrator with this problem.';
				}
			});
		},
		postCreate:function() {
			this.title.innerHTML = this.s_title || 'Batch Action Information';
			this.mainContent.innerHTML = this.tempalateData;
			this.modalIcon.src = axiom.staticPath +  '/axiom/images/icon_info.gif';

			// Create our buttons and click events
			var buttons = document.createElement('div');
			buttons.className = 'modal-buttons batch-buttons';
			buttons.setAttribute('dojoattachpoint', 'modalButtons');
			this.mainContent.appendChild(buttons);

			this.okButton = document.createElement('a');
			this.okButton.className = 'button form-button';
			this.okButton.innerHTML = ('Continue');
			buttons.appendChild(this.okButton);

			var button = document.createElement('a');
			button.className = 'button form-button';
			button.innerHTML = ('Cancel');
			buttons.appendChild(button);

			dojo.event.kwConnect({
				srcObj: button,
				srcFunc: 'onclick',
				adviceObj: this,
				adviceFunc: 'close'
			});
			dojo.event.kwConnect({
				srcObj: this.okButton,
				srcFunc: 'onclick',
				adviceObj: this,
				adviceFunc: 'validateAndClose'
			});
			// Wire up key events on the modal to submit on enter
			dojo.event.kwConnect({
				srcObj: this.mainContent,
				srcFunc: 'onkeypress',
				adviceObj: this,
				adviceFunc: 'keyListener'
			});
		},
		// Submit our modal if the enter key is pressed on an input
		keyListener: function(e) {
			if(e.target && e.target.tagName.toLowerCase() == 'input' && e.key == e.KEY_ENTER) {
				this.validateAndClose();
			}
		},
		// Return a flattened array of all of the inputs and textareas, with their ids, names, and values
		serialize: function() {
			var arr = [];
			var inputs = this.mainContent.getElementsByTagName('input');
			for(var x=0; x<inputs.length; x++) {
				if(inputs[x].getAttribute('type') != 'button') {
					arr.push({
						name: inputs[x].getAttribute('name'),
						id: inputs[x].getAttribute('id'),
						value: inputs[x].value
					});
				}
			}
			var tas = this.mainContent.getElementsByTagName('textarea');
			for(var x=0; x<tas.length; x++) {
				arr.push({
					name: tas[x].getAttribute('name'),
					id: tas[x].getAttribute('id'),
					value: tas[x].value
				});
			}
			return arr;
		},
		// Pressing enter on any input or textarea fires "close", default dojo behavior? We don't want that.
		close: function() {}
	}
);