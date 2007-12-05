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
				this.dialog.hide();
			} else {
				widget.remote.close();
			}
		},
		setLocation:function(widget, value) {
			widget.pathField.value = value[1].uri;
			widget.pathValue.value = value[1].path;
			axiom.dirtyProps['_location'] = true;
			axiom.dirtyProps['ax_id'] = true;
		},
		clearLocation:function(evt){
			this.pathField.value = '';
			this.pathValue.value = '';
			axiom.dirtyProps['_location'] = true;
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
				axiom.browsecfilter.setTargetTypes(this.parentTypes);
				axiom.browsecfilter.find_desc.style.display = 'none';
				axiom.browsecfilter.reset();
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
			this.idField.value = this.idField.value.replace(/\s+/g, '_').replace(/[^\w\.]+/g, '');
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
								   adviceFunc:'blurScrub'});
		}
	}
);
