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


var axiom = {
 	init: function() {
		dojo.require('dojo.json');
		dojo.require('dojo.dom');
		dojo.require("dojo.io.XhrIframeProxy");
		if(dojo.byId("ContentFilter")){ // no initialization needed if we're not on the content tab
			dojo.require("axiom.widget.ContentFilter");
			dojo.require("axiom.widget.ContentAdd");
			dojo.require("axiom.widget.ContentTable");
			// Set loading message to ajax loader gif
			var ajaxLoader = axiom.staticPath + '/axiom/images/ajax-loader.gif';
			dojo.widget.byId("EditBody").loadingMessage = '<div style="width:100%;text-align:center;padding:25px 0;">Loading...<br/><img src="'+ajaxLoader+'" alt="Loading..." /></div>';

			// Initialize the first set of widgets
			axiom.cfilter = dojo.widget.createWidget("axiom:ContentFilter",{prototypes:axiom.searchPrototypes,
																			appPath:axiom.appPath,
																			templatePath: new dojo.uri.dojoUri('../axiom/widget/resources/NavContentFilter.html')},
													 dojo.byId("ContentFilter"));
			axiom.cadd = dojo.widget.createWidget("axiom:ContentAdd",{prototypes:axiom.addPrototypes,
																	  appPath:axiom.appPath,
																	  myTasks: axiom.myAssignedTasks},
												  dojo.byId("ContentAdd"));

			axiom.ctable = dojo.widget.createWidget("axiom:ContentTable",{appPath:axiom.appPath, staticPath: axiom.staticPath},dojo.byId("ContentTable"));
			axiom.ctable.setContext('contentTable');

			axiom.cfilter.registerAdd(axiom.cadd);
			axiom.cfilter.registerTable(axiom.ctable);

			axiom.cfilter.search();
			// Display the ContentPane with the Search Table
			axiom.showContent();
			axiom.showContentTable();
		}

		dojo.require("axiom.widget.AxiomModal");
		var dialogHolder = document.createElement("div");
		document.body.appendChild(dialogHolder);
		axiom.modal = dojo.widget.createWidget("Dialog",{},dialogHolder);
		axiom.modal.bg.style.zIndex = 1000;
		axiom.modal.domNode.style.zIndex = 1001;
		dojo.event.kwConnect({srcObj: axiom.modal.domNode,
							  srcFunc: 'onkeypress',
							  adviceFunc: function(e){
								  if(e.key == e.KEY_ESCAPE){
									  axiom.closeModal();
								  } else if(e.key == e.KEY_ENTER){
									  var widget = axiom.modal.widget;
									  if(widget && widget.onEnter){
										  widget.onEnter();
									  }
								  }
							  }
							 });

		if(dojo.byId("EditBody") && dojo.byId("ContentBody")) {
			axiom.editBaseClass = dojo.html.getClass(dojo.widget.byId("EditBody").domNode);
			axiom.contentBaseClass = dojo.html.getClass(dojo.widget.byId("ContentBody").domNode);
		}
		var oldcall = window.onresize;
		window.onresize = function(){
			if(oldcall){
				oldcall();
			}
			axiom.adjustHeight();
		};
		axiom.adjustHeight();
		axiom.initValidation();
	},
	editBaseClass : '',
	contentBaseClass: 'body',
	adjustHeight: function(){
		var height = (window.innerHeight ||document.documentElement.clientHeight);
		var edit_content = dojo.byId("edit_content");
		if(edit_content){
			edit_content.style.height = (height-185)+'px';
		}
		var colRight = dojo.byId("columnRight");
		if(colRight){
			dojo.byId("columnRight").style.height= (height-170)+'px';
		}
	},
    showSaveOrContent: function() {
	if (axiom.isEditing) {
	    if (axiom.isDirty()) {
		axiom.saveDialog();
		return false;
	    } else {
		axiom.showContent();
	    }
	}
    },
	hideMessage:function(){
		var messages = dojo.byId("Messages");
		if(messages){
			messages.style.display = 'none';
		}
	},
	showMessage:function(message){
		var messages = dojo.byId("Messages");
		if(messages){
			messages.style.display = 'block';
			//dojo.lfx.html.highlight(messages, new dojo.gfx.color.Color('d9dcde'), 3000).play();
			messages.innerHTML = message;
		}
	},
	initValidation: function(){
		axiom.validateFunctions['validate-empty'] = { errorNode: axiom.defaultErrorNode,
													  onInvalid: axiom.defaultOnInvalid,
													  validate: function(elem){
														  if(elem.value == "")
															  return [false, "Please enter a value"];
														  return [true, "valid"];
													  }
													};

		axiom.validateFunctions['validate-date'] = { errorNode: axiom.defaultErrorNode,
													 onInvalid: axiom.defaultOnInvalid,
													 validate: function(elem){
														 if(elem.value == "")
															 return [false, "Please enter a valid Date." ];
														 return [true, "valid"];
													 }
												   };

		axiom.validateFunctions['validate-email'] = { errorNode: axiom.defaultErrorNode,
													  onInvalid: axiom.defaultOnInvalid,
													  validate: function(elem){
														  dojo.require("dojo.validate.web");
														  if(!dojo.validate.isEmailAddress(elem.value)){
															  return[false, "Please enter a valid email address."]
														  }
														  return[true, "valid"];
													  }
													};

		axiom.validateFunctions['validate-length'] = { errorNode: axiom.defaultErrorNode,
													   onInvalid: axiom.defaultOnInvalid,
													   validate: function(elem){
														   var maxchars = 99999;
														   var classes = elem.className.split(/\s+/);
														   for(var i in classes){
															   if(classes[i].indexOf('validate-length')!= -1)
																   maxchars = classes[i].substring(classes[i].lastIndexOf('-')+1);
														   }
														   if (elem.value.length > maxchars)
															   return [false, "Please enter less than "+maxchars+" characters in this input."];
														   return [true, "valid"];
													   }
													 };

		axiom.validateFunctions['validate-preview'] = { errorNode: axiom.defaultErrorNode,
														onInvalid: axiom.defaultOnInvalid,
														validate: function(elem, data){
															// ex: location field
															if(data.preview){
																var result = axiom.validateFunctions['validate-empty'].validate(elem, data);
																if(!result[0]){
																	result[1] = 'Required for preview.';
																}
																return result;
															}
															return [true, 'valid'];
														}
													  };

		axiom.validateFunctions['validate-task'] = { errorNode: axiom.defaultErrorNode,
															onInvalid: axiom.defaultOnInvalid,
															validate: function(elem, data){
																// ex: task selector
																if(!data.preview && elem.value == "")
																	return [false, "Please select a task."];
																return [true, 'valid']
															}
														  };


	},
	defaultErrorNode: function(elem){
		return dojo.html.getElementsByClass("error_message", dojo.byId("ax-"+elem.name),"div")[0];
	},
	defaultOnInvalid: function(errornode, message, highest){
		errornode.innerHTML = message;
		errornode.style.display = "block";
		if(errornode.offsetTop < highest) {
			if(dojo.render.html.ie)
				highest = errornode.offsetParent.offsetTop;
			else
				highest = errornode.offsetTop;
		}
		return highest;
	},
	addValidationFunction: function(className, func){
		axiom.validateFunctions[className] = {errorNode: axiom.defaultErrorNode,
											  onInvalid: axiom.defaultOnInvalid,
											  validate: func};
	},
	validateFunctions: {},
	validateForm: function(id, data){
		var valid = true;
		var highest=999999;
		var validate_lambda = function(elem){
			var classes = dojo.html.getClasses(elem);
			for(var i in classes){
				for(var key in axiom.validateFunctions){
					if(classes[i].indexOf(key) != -1){
						var validateFunc = axiom.validateFunctions[key];
						if(validateFunc){
							var message_tuple = validateFunc.validate(elem, data);
							var error_node = validateFunc.errorNode(elem);
							if(!message_tuple[0]){
								valid = false;
								highest = validateFunc.onInvalid(error_node, message_tuple[1], highest);
							} else {
								error_node.style.display = 'none';
							}
						}
					}
				}
			}
		};
		var edit = dojo.byId(id);
		dojo.lang.forEach(edit.getElementsByTagName('textarea'), validate_lambda);
		dojo.lang.forEach(edit.getElementsByTagName('select'), validate_lambda);
		dojo.lang.forEach(edit.getElementsByTagName('input'), validate_lambda);
		if(!valid) { axiom.scroll(highest); }
		return valid;
	},
	saveDialog:function(callback){
	    dojo.require('axiom.widget.SaveDialogModal');
	    var widget =  dojo.widget.createWidget('axiom:SaveDialogModal', {appPath: axiom.appPath, staticPath: axiom.staticPath, callback: callback});
	    axiom.openModal({ widget: widget });
	},
	isDirty: function(){
		var dirty = false;
		for(var i in axiom.dirtyProps) {dirty=true; break;}
		return dirty;
	},
	showContent: function(classname) {
		axiom.dirtyProps = {};
		dojo.html.removeClass(dojo.byId("columnRight"), 'fixed');
		var content = dojo.byId("ContentWrapper");
		var edit = dojo.widget.byId("EditBody");
		edit.hide();
		dojo.html.setClass(edit.domNode, axiom.editBaseClass);
		if(classname){ dojo.html.addClass(content.domNode, classname); }
		axiom.showingThumbs = true;
		axiom.hideObjectDetail();
		axiom.showLeftNav();
		document.title = (axiom.title || "Axiom CMS");
		content.style.display='block';
	},
	showEdit: function(classname) {
		dojo.html.addClass(dojo.byId("columnRight"), 'fixed');
		var content = dojo.byId("ContentWrapper");
		var edit = dojo.widget.byId("EditBody");
		content.style.display='none';
		axiom.hideMessage();

		if(dojo.byId("ContentFilter") || dojo.byId("TaskPanel")) { // If in Content Mode -- initialize object select table
			dojo.require("dojo.dnd.HtmlDragMove");
			if(!axiom.browsemodal) {
				axiom.browsemodal = dojo.widget.createWidget("Dialog",
															 {id:"BrowseDialog"},
															 dojo.byId("BrowseDialog"));
				new dojo.dnd.HtmlDragMoveSource(dojo.byId("BrowseDialog"));
			}
			if(!axiom.browsecfilter) {
				dojo.require('axiom.widget.ContentFilter');
				axiom.browsecfilter = dojo.widget.createWidget("axiom:ContentFilter",
															   {prototypes:axiom.searchPrototypes,
																appPath:axiom.appPath},
															   dojo.byId("BrowseContentFilter"));
			}
			if(!axiom.browsetable) {
				dojo.require("axiom.widget.ObjectSelectTable");
				axiom.browsetable = dojo.widget.createWidget("axiom:ObjectSelectTable",
															 {appPath:axiom.appPath},
															 dojo.byId("BrowseContentTable"));
				axiom.browsecfilter.registerTable(axiom.browsetable);
			}

			axiom.browsetable.multiple = false; // Initialize table to be singular select
			axiom.browsetable.defaultValue = "";
			axiom.browsetable.defaultValues = [];
		}

		dojo.html.setClass(content.domNode, axiom.contentBaseClass);
		if(classname){ dojo.html.addClass(edit.domNode, classname); }
		edit.show();
	},
	submitMethods:[],
	addSubmitMethod:function(method) {
		axiom.submitMethods.splice(axiom.submitMethods.length,0,method);
	},
	onSubmit:function(type,data,evt) {
		for(var i=0;i<axiom.submitMethods.length;i++) {
			axiom.submitMethods[i](type,data,evt);
        }
	},
	bodyChangeMethods:[],
	addBodyChangeMethod:function(method) {
		axiom.bodyChangeMethods.splice(axiom.bodyChangeMethods.length,0,method);
	},
	onBodyChange:function(type,data,evt) {
		for(var i=0;i<axiom.bodyChangeMethods.length;i++) {
			axiom.bodyChangeMethods.pop(i)(type,data,evt);
        }
	},
	clearOnSubmitMethods: function(){
		axiom.submitMethods = [];
	},
	scroll: function(highest){
		var edit_pane = dojo.byId('edit_content');
		if(edit_pane){
			edit_pane.scrollTop = highest - edit_pane.offsetTop;
		}
	},
	submitEditCallBack:function(type,data,evt){
		var errorsObj = eval(data);
		if(errorsObj) {
			var errorNode;
			var highest=999999;
			for(var i in errorsObj.errors) {
				if(i=="_accessname" || i=="_location") {
					errorNode = dojo.html.getElementsByClass("error_message",dojo.byId("ax-_location"),"div")[0];
				} else {
					errorNode = dojo.html.getElementsByClass("error_message",dojo.byId("ax-"+i),"div")[0];
				}
				if(errorNode.offsetTop < highest) {
					highest = errorNode.offsetTop;
				}
				errorNode.innerHTML = errorsObj.errors[i];
				errorNode.style.display = (i=="_accessname" || i=="_location")?"inline":"block";
				axiom.scroll(highest);
			}
			// reenable save button
			var save_button = dojo.byId('save_button');
			dojo.html.removeClass(save_button, 'form-button-disabled');
		} else {
			axiom.dirtyProps = {};
			if(axiom.cfilter){
				axiom.cfilter.sort({'cms_lastmodified': 'desc'});
			}else if(axiom.tasks){
				axiom.tasks.taskPanel.refreshAll();
			}
			axiom.showContent();

		}
	},
	loadContent: function(url, classname) {
		axiom.showContent(classname);
		dojo.widget.byId("ContentBody").href = url;
		dojo.widget.byId("ContentBody").refresh();
	},

	loadEdit: function(url, classname) {
		axiom.onBodyChange();
		axiom.showEdit(classname);
		dojo.widget.byId("EditBody").href = url;
		dojo.widget.byId("EditBody").refresh();
	},

	setContentData: function(data, classname) {
		dojo.widget.byId("ContentBody").setContent(data);
		axiom.showContent(classname);
	},

	setEditData: function(data, classname) {
		dojo.widget.byId("EditBody").setContent(data);
		axiom.showEdit(classname);
	},

	showLeftNav: function() {
		if (dojo.byId('task_add_section')) { dojo.byId('task_add_section').style.display = 'block'; }
		if (dojo.byId('task_filter_section')) { dojo.byId('task_filter_section').style.display = 'block'; }
		if (dojo.byId('filter_section')) { dojo.byId('filter_section').style.display = 'block'; }
		if (dojo.byId('add_section')) { dojo.byId('add_section').style.display = 'block'; }
	},

	hideLeftNav: function() {
		if (dojo.byId('task_add_section')) { dojo.byId('task_add_section').style.display = 'none'; }
		if (dojo.byId('task_filter_section')) { dojo.byId('task_filter_section').style.display = 'none'; }
		if (dojo.byId('filter_section')) { dojo.byId('filter_section').style.display = 'none'; }
		if (dojo.byId('add_section')) { dojo.byId('add_section').style.display = 'none'; }
	},

	showObjectDetail: function(url) {
	    var ref_container = dojo.byId('referenced_box');
	    if (ref_container) {
		ref_container.style.display = 'none';
	    }
	    if (url) {
		var args = {
		    url: url+((url == '/')?'':'/')+'ref_list',
		    load: function(type, data, evt) {
			if (!ref_container) {
			    ref_container = dojo.byId('referenced_box');
			}
			if (ref_container) {
			    var refs = data.replace(/<!DOCTYPE[^>].*|<div>|<\/div>/g, "");
			    if (!(refs.match(/^\s*$/))) {
				ref_container.style.display = 'block';
				ref_container.innerHTML = refs;
			    }
			}
		    },
		    preventCache: true,
		    method: 'get'
		};
		dojo.io.bind(args);
	    }
	    dojo.byId('object_detail').style.display = 'block';
	},

	hideObjectDetail: function() {
		dojo.byId('object_detail').style.display = 'none';
	},

	showContentTable: function() {
		axiom.hideObjectDetail();
		dojo.byId('TableWrapper').style.display = 'block';
	},

	hideContentTable: function() {
		dojo.byId('TableWrapper').style.display = 'none';
	},
	getFormData: function(id, submitAll){
		var edit = dojo.byId(id);
		var data = {};
		var extract_lambda = function(elem){ if(elem.name) {
			if(submitAll || axiom.dirtyProps[elem.name])
				data[elem.name] = elem.value;
		}
										   };
		dojo.lang.forEach( (edit.getElementsByTagName('textarea') || []), extract_lambda);
		dojo.lang.forEach( (edit.getElementsByTagName('select') || []), extract_lambda);
		dojo.lang.forEach( (edit.getElementsByTagName('input') || []), extract_lambda);
		return data;
	},
	populateFCKTextareas: function() {
		if(!axiom.FCKInstances) return;
		for(var i=0;i<axiom.FCKInstances.length;i++) {
			var xhtml = FCKeditorAPI.GetInstance(axiom.FCKInstances[i]).GetXHTML();
			var ta = dojo.byId(axiom.FCKInstances[i]);
			ta.value = xhtml;
		}
	},
	currentFCKInstance:null,
	FCKAssetSelect:null,
	loadFCKInstance: function(id,width,height,formats,templates,styles,stylesxml) {
		// TODO: Add more config parameters, config?/toolbar? etc
			dojo.byId(id+'_preview').style.display='none';
			dojo.byId(id+'_fckarea').style.display='block';
		    	dojo.byId(id+'_toggle').innerHTML = 'VIEW';
			var fck = new FCKeditor(id+'_fcktext');
			fck.BasePath = axiom.staticPath+'/FCKeditor/';
			fck.Config.PluginsPath = axiom.staticPath+'/axiom/fck/';
			fck.Config.CustomConfigurationsPath = axiom.staticPath+'/axiom/fck/axiom_config.js';
			fck.ToolbarSet = 'Siteworx';
			axiom.FCKAssetSelect.instanceName = id+'_fcktext';
			fck.AssetInstance = 'fck_wysiwyg_selector';
			if(width) { fck.Width = width; }
			if(height) { fck.Height = height; } else { fck.Height = "400"; }
			if(formats) { fck.Config.FontFormats = formats; }
			if(templates) { fck.Config.TemplatesXmlPath = axiom.appPath + templates; }
			if(styles) { fck.Config.EditorAreaCSS = axiom.appPath + styles; }
			if(stylesxml) { fck.Config.StylesXmlPath = axiom.appPath + stylesxml; }
			fck.ReplaceTextarea();
			axiom.currentFCKInstance = id;
	},

    toggleFCKInstance: function(id,width,height,formats,templates,styles,stylesxml) {
	var tmp = axiom.currentFCKInstance;
	if(axiom.currentFCKInstance) {
	    axiom.unloadFCKInstance(axiom.currentFCKInstance);
	}

	if (tmp!=id) {
	    axiom.loadFCKInstance(id,width,height,formats,templates,styles,stylesxml);
	}
	tmp = null;
    },

	unloadFCKInstance: function(id) {
		var xhtml = FCKeditorAPI.GetInstance(id+'_fcktext').GetXHTML();
		var empty_tag_re = /<(strong|em|u|strike|a(?!\s+name="[^"]*"))[^>]*>\s*<\/\1>/g;
		var only_br_re = /<(strong|em|u|strike|a(?!\s+name="[^"]*"))[^>]*>\s*<br\s*\/>\s*<\/\1>/g;
		xhtml = xhtml.replace(empty_tag_re,'').replace(only_br_re,'<br />');
		dojo.byId(id).value = xhtml; // Set hidden "input" to new markup value
		//dojo.byId(id+'_preview').innerHTML = xhtml; // Show new markup in preview div
		(dojo.byId(id+'_preview').contentDocument || dojo.byId(id+'_preview').contentWindow.document).body.innerHTML = xhtml;
		dojo.byId(id+'_preview').style.display='block';
		dojo.byId(id+'_fckarea').style.display='none'; // Hide FCK Area
		dojo.byId(id+'_fckarea').innerHTML = '<textarea id="'+id+'_fcktext">'+xhtml+'</textarea>';
	    	dojo.byId(id+'_toggle').innerHTML = 'EDIT';
		axiom.currentFCKInstance = null;
	},

	submitMultiEdit: function(edit_url, obj_id){
		var data = {};
		data[obj_id] = axiom.getFormData('edit');
		dojo.io.bind({ url:edit_url,
				       load: axiom.showContent, // TODO display errors if any
				       postContent: dojo.json.serialize(data),
				       preventCache: true,
				       contentType: 'text/json',
				       method: 'post' });
	},

	submitEdit: function(data){
		var form_elem = data.form_elem;
		var preview = form_elem ? form_elem.innerHTML == "Preview" : false;
		if(form_elem && !preview){
			if(dojo.html.hasClass(form_elem, 'form-button-disabled'))
				return;
			dojo.html.addClass(form_elem, 'form-button-disabled');
		}

		if(axiom.currentFCKInstance){ axiom.unloadFCKInstance(axiom.currentFCKInstance);}
	    window.onunload = null;
	    axiom.bodyChangeMethods = [];
		var form_id = (data.form_id || 'edit');
	    if(axiom.validateForm(form_id, data)) {
			var form_data = axiom.getFormData(form_id, data.submit_all);
			if(data.obj_id){
				wrapper = {};
				wrapper[data.obj_id] = form_data;
				form_data = wrapper;
			}
			var args = { url:          data.edit_url,
				         load:         function(type,dat,evt) {
							 if(data.callback){
								 data.callback(type,dat,evt);
							 } else {
								 axiom.onSubmit(type,dat,evt);
							 }
						 },
						 error:        function(type,dat,evt) {
							 axiom.openModal({content: "Error connecting to server."});
							 dojo.html.removeClass(dojo.byId('save_button'), 'form-button-disabled');
						 },
						 postContent:  dojo.json.serialize(form_data),
						 preventCache: true,
						 contentType:  'text/json',
						 method:       'post'
					   };
			dojo.io.bind(args);
		}
		else {
			dojo.html.removeClass(dojo.byId('save_button'), 'form-button-disabled');
		}
	},

	openModal: function(obj) {
 		/** Modal object properties:
         * -----------------------
		 * href             loads this url into the Modal
		 * confirmdialog    Boolean to specify if this should be confirm, if not assumes alert
		 * content          Text for the Modal
		 * callback         Callback for the OK button if confirm is true
		 * submittext       text for submit button. defaults to "OK"
		 * widget           load the specified widget into the modal. responsible for its own buttons and callbacks
		 */

		if(typeof obj.href !="undefined") {
			axiom.modal.href = obj.href;
			axiom.modal.refresh();
		} else if(obj.widget) {
			axiom.modal.widget = obj.widget;
			axiom.modal.setContent(obj.widget.domNode);
		} else {
			var dialog = document.createElement("div");
			dialog.className = "modal";
			var p;
			if(dojo.dom.isNode(obj.content)){
				p = obj.content;
			} else{
				p = document.createElement("p");
				p.innerHTML = obj.content;
			}
			dialog.appendChild(p);
			var b = document.createElement("div");
			b.className = "buttons";
			if(obj.confirmdialog) {
				var okbutton = document.createElement("a");
				okbutton.innerHTML = (obj.submittext || "OK");
				okbutton.className = "button form-button";
				okbutton.onclick = function() { axiom.closeModal();obj.callback(); };
				b.appendChild(okbutton);
				var cancelbutton = document.createElement("a");
				cancelbutton.innerHTML = "Cancel";
				cancelbutton.className = "button form-button";
				cancelbutton.onclick = function() { axiom.closeModal(); };
				b.appendChild(cancelbutton);
			} else {
				var okbutton = document.createElement("a");
				okbutton.innerHTML = "OK";
				okbutton.className = "button form-button";
				okbutton.onclick = function() { axiom.closeModal(); };
				b.appendChild(okbutton);
			}
			dialog.appendChild(b);

			axiom.modal.setContent(dialog);
		}
		axiom.modal.show();
	},

	closeModal: function() {
		axiom.modal.setContent("");
		delete axiom.modal.widget;
		axiom.modal.hide();
	},

	deleteNewAdd: function(path, callback) {
		if(path){
			axiom.dirtyProps = {};
			dojo.io.bind({   url:path + "/cms_delete?full_removal=true",
							 method:"GET",
							 mimetype:"text/json",
							 load:function(type,data,evt){ if(callback) {callback(type,data,evt);} else{ axiom.showContent();}},
							 error:function(type,data,evt){ /**axiom.openModal({content:"Error occurred while deleting."});*/ }
						 });
		}
	},

	deleteObject: function(path,title) {
		if(!title) { title = "Untitled Object"; }

		axiom.openModal({
			confirmdialog:true,
			content:"Delete "+unescape(title)+"?",
			callback:function() {
				dojo.io.bind({ url:path + "/cms_delete",
							   method:"GET",
							   mimetype:"text/json",
							   load:function(type,data,evt){
								   //axiom.openModal({content:"Successfully Deleted "+data.deleted+"."});
								   axiom.cfilter.search();
							   },
							   error:function(type,data,evt){ axiom.openModal({content:"Error occurred while deleting."}); }
							 });
			}
		});
	},

	taskListChange: function(node){
		if(node.options[node.selectedIndex].value == 'ADD NEW TASK'){
			dojo.require('axiom.widget.AddTaskModal');
			var widget =  dojo.widget.createWidget('axiom:AddTaskModal', {appPath: axiom.appPath, staticPath: axiom.staticPath, selectNode: node});
			widget.editCallback = function(evt,data,req){
				axiom.myAssignedTasks = data.my_assigned_tasks;
				var opt = document.createElement('option');
				opt.value = data.path;
				opt.innerHTML = data.task_id + ' - ' + data.name;

				var opts = this.widget.selectNode.getElementsByTagName('option');
				var len = opts.length;
				var last = opts[len-1];

				this.widget.selectNode.insertBefore(opt, last);
				this.widget.selectNode.selectedIndex = len-1;
				this.widget.close();
			};
			axiom.openModal({ widget: widget });
		}

	},

	tags : { tagWindows: {},
			 toggleWindow: function(id){
				 var node = dojo.byId(id);
				 if(!(id in axiom.tags.tagWindows)){
					 axiom.tags.tagWindows[id] = false;
				 }
				 if(axiom.tags.tagWindows[id]){
					 dojo.lfx.html.fadeOut(node, 300, undefined, function(){node.style.display = 'none';}).play();
				 } else{
					 node.style.opacity = "0.0";
					 node.style.display = 'block';
					 dojo.lfx.html.fadeIn(node, 300).play();
				 }
				 axiom.tags.tagWindows[id] = !axiom.tags.tagWindows[id];
			 },
			 saveTags: function(textareaId, windowNode, searchmode){
				 axiom.dirtyProps['tags'] = true;
				 var inputs = windowNode.getElementsByTagName('input');
				 var results = [];
				 var len = inputs.length;
				 for(var i=0; i<len; i++){
					 if(inputs[i] && inputs[i].checked)
						 results.push(inputs[i].value);
				 }
				 var textarea = dojo.byId(textareaId);
				 var value = textarea.value+'';
				 if(searchmode){
					 for(var tag in results){
						 results[tag]= 'tag:"'+results[tag]+'"';
						 if(value.indexOf(results[tag]) != -1)
							 results[tag]= '';
					 }
					 textarea.value += ' '+results.join(' ');
				 }
				 else{
					 value = value.length ? value.split(/\s*,\s*/) : [];
					 var new_results = [].concat(value);
					 var skip = false;
					 for(var tag in results){
						 for(var i=0; i<value.length; i++){
							 if(results[tag] == value[i]){
								 skip = true;
								 break;
							 }
						 }

						 if(skip) {
							 skip = false;
						 } else {
							 new_results.push(results[tag]);
						 }
					 }
					 textarea.value = new_results.join(', ');
				 }
				 axiom.tags.toggleWindow(windowNode.id);
			 }
	       },

	logout: function(){
		dojo.io.bind({url: axiom.appPath+ 'cms/Logout',
					  load: function(){ window.location = axiom.appPath+ 'cms/Login'; }
					 });
	},
    search_initialized: false,
	dirtyProps:{}
};
dojo.addOnLoad(axiom.init);