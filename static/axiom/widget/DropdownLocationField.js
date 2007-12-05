/**
Copyright Axiom
Thomas Mayfield
*/

dojo.provide("axiom.widget.DropdownLocationField");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.LocationField");

dojo.widget.defineWidget(
	"axiom.widget.DropdownLocationField",
	axiom.widget.LocationField,
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
		dialog:null,
		parentTypes: {},
		paths: [],
		//Relative to dojo:
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/DropdownLocationField.html'),
		postCreate:function() {
			this.initialText = this.objectId;
			this.currentText = this.objectId;
			//this.pathField.value = this.initialValue.match(/^\/cms/)?'':this.initialValue;
			for(var i in this.paths){
				var opt = document.createElement('option');
				opt.innerHTML = this.paths[i];
				opt.value = this.paths[i];
				if(this.initialValue == this.paths[i])
					opt.selected = 'true';
				this.pathField.appendChild(opt);
			}
			this.idField.value = this.objectId;
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
