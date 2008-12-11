/**
Copyright Siteworx
Dan Pozmanter
*/

dojo.provide("axiom.widget.LocationField");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");

dojo.widget.defineWidget(
	"axiom.widget.LocationField",
	dojo.widget.HtmlWidget,
	function(){},
	{
	    allowExtended:false,
	    showMessage:true,
	    oldPath:'',
	    currentPath:'',
		appPath:'',
		parentHref:'',
		objectId:'',
		initialValue:'',
		href:'',
		pathField:null,
		idField:null,
		browseButton:null,
		remote:null,
		filemode: false, // if true, preserve captitalization on uploaded filenames
		dialog:null,
		parentTypes: {},
		//Relative to dojo:
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/LocationField.html'),
		exit:function(widget) {
			this.dialog = dojo.widget.byId("BrowseDialog");
			if(this.dialog) {
				axiom.browsecfilter.find_desc.style.display = 'inline';
				axiom.browsecfilter.publishedOnly = false;
				this.dialog.hide();
			} else {
				widget.remote.close();
			}
		},
	    displayMessage: function(showMessage, showRedirect) {
		if (showMessage) {
		    if (!(this.parentHref.match(/\/cms/)) && this.currentPath != this.oldPath) {
			dojo.event.kwConnect({
						 srcObj: this._current,
						 srcFunc:'onclick',
						 adviceObj:this,
						 adviceFunc:function() {axiom.dirtyProps['_current'] = true;}
					     });
			var affected = this.number_affected;
			dojo.io.bind({
					 url: this.oldPath+"/getChildCount",
					 load: function(type, data, evt) {
					     affected.innerHTML = data;
					 },
					 error: function() {
					     affected.innerHTML = '0';
					 },
					 method: "get"
				     });
			delete affected;
			if (showRedirect) {
			    this.oldURL.innerHTML =	this.oldPath;
			    this.currentURL.innerHTML = this.currentPath;
			    this.message_redirect.style.display = "block";
			} else {
			    this.message_redirect.style.display = "none";
			}
			this.location_message.style.display = "block";
		    } else {
			this.location_message.style.display = "none";
		    }
		}
	    },
	    setCurrentPath: function() {
		var pf = this.pathField.value;
		if (pf == "") {
		    this.currentPath = "";
		} else if (pf == "/") {
		    this.currentPath = "/" + this.idField.value;
		} else {
		    this.currentPath = pf + "/" + this.idField.value;
		}
	    },
		setLocation:function(widget, value) {
			widget.pathField.value = value[1].uri;
			widget.pathValue.value = value[1].path;
			axiom.dirtyProps['_location'] = true;
			axiom.dirtyProps['ax_id'] = true;
			widget.setCurrentPath();
		    widget.displayMessage(widget.showMessage, true);
		},
		clearLocation:function(evt){
			this.pathField.value = '';
			this.pathValue.value = '';
			axiom.dirtyProps['_location'] = true;
		    this.setCurrentPath();
			this.displayMessage(this.showMessage);
		},
		browse:function() {
			this.dialog = dojo.widget.byId("BrowseDialog");
			if(this.dialog) {
				axiom.browsetable.multiple = false;
				axiom.browsetable.property = "_location";
				axiom.browsetable.defaultValue = this.pathValue.value;
				axiom.browsetable.defaultValues = [];
				axiom.browsetable.setCallBack = this.setLocation;
				axiom.browsetable.exitCallBack = this.exit;
				axiom.browsetable.callingWidget = this;
				axiom.browsetable.searchURL = this.href + "potentialTargets";
				axiom.browsecfilter.publishedOnly = true;
				axiom.browsecfilter.setTargetTypes(this.parentTypes);
				axiom.browsecfilter.find_desc.style.display = 'none';
				//axiom.browsecfilter.reset();
				axiom.browsecfilter.setLength(12);
				axiom.browsecfilter.search(null, null, null, 12);
				this.dialog.show();
			} else {
				this.remote = window.open(this.appPath + '/cms/browse');
				this.remote.property = "_location";
				this.remote.browsePath = this.href;
				this.remote.setCallBack = this.setLocation;
				this.remote.exitCallBack = this.exit;
				this.remote.callingWidget = this;
			}
		},
		populate:function(text){
		      if(this.initialText.match(/^\d*$/) && this.currentText == this.idField.value){
				  this.idField.value = text;
				  this.scrub();
				  this.currentText = this.idField.value;
		      }
		},
		scrub:function(){
		    this.idField.value = this.idField.value.replace(/\s+/g, '-');
			if (!this.allowExtended) {
			    this.idField.value = this.idField.value.replace(/[^\w-]/g, '');
			}
			if(!this.filemode){
				this.idField.value = this.idField.value.toLowerCase();
			}
			axiom.dirtyProps['ax_id'] = true;
		},
		blurScrub:function(){
			if(this.idField.value)
				this.scrub();
			else
				this.idField.value = this.initialText;
		},
		postCreate:function() {
			this.initialText = this.objectId;
			this.currentText = this.objectId;
			this.pathField.value = this.parentHref.match(/\/cms/)?'':this.parentHref;
			this.pathValue.value = this.initialValue.match(/\/cms/)?'':this.initialValue;
			this.idField.value = this.objectId;
		    this.oldPath = this.currentPath = ((this.pathField.value=="/")?"":this.pathField.value)+"/"+this.idField.value;
			dojo.event.kwConnect({ srcObj:this.browseButton,
								   srcFunc:'onclick',
								   adviceObj:this,
								   adviceFunc:'browse'});
			dojo.event.kwConnect({ srcObj:this.clearButton,
								   srcFunc:'onclick',
								   adviceObj:this,
								   adviceFunc:'clearLocation'});
			dojo.event.kwConnect({ srcObj:this.idField,
								   srcFunc:'onkeyup',
								   adviceObj:this,
								   adviceFunc:'scrub'});
			dojo.event.kwConnect({ srcObj:this.idField,
								   srcFunc:'onblur',
								   adviceObj:this,
					       adviceFunc:function() { this.setCurrentPath(); this.displayMessage(this.showMessage, true); }
					     });
			dojo.event.kwConnect({ srcObj:this.idField,
								   srcFunc:'onblur',
								   adviceObj:this,
								   adviceFunc:'blurScrub'});
		}
	}
);
