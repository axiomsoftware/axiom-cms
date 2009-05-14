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

dojo.provide("axiom.widget.ProgressBarModal");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.AxiomModal");

dojo.widget.defineWidget(
	"axiom.widget.ProgressBarModal",
	axiom.widget.AxiomModal,
	function(){},
	{
		errorField: null,
		zip_id: null,
		script_id: null,
		progressInterval: null,
		completed: false,
		totalObjects: null,
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/ProgressBarModal.html'),
		templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/ProgressBarModal.css'),
		closeFunc: null,
		close:function(){
			if(this.closeFunc) {
				this.closeFunc.call();
			}
			axiom.closeModal();
		},
		// Check to the getBatchProgress function to see how many objects we have completed
		queryProgress: function() {
			var me = this;
			dojo.io.bind({
				url: axiom.cmsPath + 'getBatchProgress',
				method: 'post',
				postContent: dojo.json.serialize({zip_id:this.zip_id, script_id:this.script_id}),
				contentType: 'text/json',
				mimetype: 'text/json',
				load: function(load, data, evt){
					if(data.errors) {
						me.errors.innerHTML = "An error occured while running the script. Please contact your system administrator.<br /><br />Error: "+data.errors;
						me.showCloseButon('OK');
					}
					if(me.completed) {return};
					me.progress.innerHTML = 'Processed '+data+' of '+me.totalObjects;
					me.modal_progress_bar.style.width = ((parseInt(data) / parseInt(me.totalObjects)) * 198) +'px';

					if(parseInt(data) == parseInt(me.totalObjects)) {
						me.completed = true;
						clearInterval(me.progressInterval);
						me.message.innerHTML += 'Complete!';
						me.showCloseButon('OK');
					}
				}
			});
		},
		postCreate:function() {
			this.title.innerHTML = "CMS Script Progress";
			var me = this;
			
			// Call to get the total objects to process...
			dojo.io.bind({
				url: axiom.cmsPath + 'getBatchTotal',
				method: 'post',
				postContent: dojo.json.serialize({zip_id:this.zip_id, script_id:this.script_id}),
				contentType: 'text/json',
				mimetype: 'text/json',
				load: function(load, data, evt){
					// ...then start the progress bar query
					if(data.errors) {
						me.errors.innerHTML = "An error occured while running the script. Please contact your system administrator.<br /><br />Error: "+data.errors;
						me.showCloseButon('OK');
					} else {
						me.totalObjects = data;
						me.progressInterval = setInterval(function() {
							me.queryProgress();
						}, 1000);
					}
				}
			});
			
			// Call to start the batch script
			dojo.io.bind({
				url: axiom.cmsPath + 'beginBatch',
				method: 'post',
				postContent: dojo.json.serialize({zip_id:this.zip_id, script_id:this.script_id}),
				contentType: 'text/json',
				mimetype: 'text/json',
				load: function(load, data, evt){
					// We hit this return if the script finishes, or errors
					if(data.errors) {
						me.errors.innerHTML = "An error occured while running the script. Please contact your system administrator.<br /><br />Error: "+data.errors;
						me.showCloseButon('OK');
					}
				}
			});
			this.modalIcon.src = axiom.staticPath + '/axiom/images/icon_info.gif';
		},
		showCloseButon: function(text) {
			var buttons = document.createElement('div');
			buttons.setAttribute('class', 'modal-buttons');
			buttons.setAttribute('dojoattachpoint', 'modalButtons');
			this.mainContent.appendChild(buttons);
			
			var button = document.createElement('a');
			button.setAttribute('class', 'button form-button');
			button.innerHTML = (text || 'Close');
			buttons.appendChild(button);
			
			dojo.event.kwConnect({srcObj: button,
								  srcFunc: 'onclick',
								  adviceObj: this,
								  adviceFunc: 'close'});
		}
	}
);
