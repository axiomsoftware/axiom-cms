/**
Copyright Axiom
Dan Pozmanter, Thomas Mayfield
*/

dojo.provide("axiom.widget.ContentAdd");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");

dojo.widget.defineWidget(
	"axiom.widget.ContentAdd",
	dojo.widget.HtmlWidget,
	function(){},
	{
		appPath:'',
		prototypes:{},
		myTasks:[],
		//addPrototypeList:null,
		addButton:null,
		//Relative to dojo:
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/ContentAdd.html'),
		getPrototype:function() {
			return this.addPrototypeList.value;
		},
		setPrototype:function(prototype) {
			this.addPrototypeList.value = prototype;
		},
		addObject:function() { //"add" is apparently a built-in Dojo widget method
			if(axiom.isDirty()){
				axiom.saveDialog(function(){ 
					axiom.dirtyProps = {};
					axiom.cadd.addObject()
				});
			} else{
				var p = this.getPrototype();
				if(p != "All" && p){
					var task = p;
					if(this.addToTaskList){
						task += !this.addToTaskList.value.match(/Choose One/i) ? '&task_id='+this.addToTaskList.value : '';
					}
					axiom.loadEdit(this.appPath + 'cms/cms_add?prototype='+task);
				} else {
					axiom.openModal({content:"Please choose a content type before proceeding"});
				}
			}
		},
		postCreate:function() {
			this.addPrototypeList.innerHTML = '';
			var first = document.createElement('option');
			first.value = 'All';
			first.innerHTML = '-- Choose One --';
			first.setAttribute('selected', 'selected');
			this.addPrototypeList.appendChild(first);
			for (var p in this.prototypes) {
				var option = document.createElement('option');
				option.value = p;
				option.innerHTML = this.prototypes[p]; 
				this.addPrototypeList.appendChild(option);
			}
			
			dojo.event.kwConnect({ srcObj:this.addButton,
								   srcFunc:'onclick',
								   adviceObj:this,
								   adviceFunc:'addObject'});
		}
	}
);
