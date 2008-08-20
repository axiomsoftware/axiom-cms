/**
 * Copyright Axiom
 * Thomas Mayfield
 */

dojo.provide("axiom.widget.RecycleBinFilter");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.UserFilter");

dojo.widget.defineWidget(
	"axiom.widget.RecycleBinFilter",
	axiom.widget.UserFilter,
	function(){},
	{
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/RecycleBinFilter.html'),
		prototypeList: ["CMSTrashBag"],
		sortObj: [{title: 'asc'}],
		getPrototype:function() {
			return "CMSTrashBag";
		},
		getKeywords:function(){
			return this.keywordInput.value;
		},
		reset:function(){
			this.keywordInput.value = "";
		},
		postCreate:function() {
			dojo.event.kwConnect({       srcObj: this.keywordInput,
										 srcFunc:'onkeydown',
										 adviceObj: this,
										 adviceFunc: function(evt){
											 if(evt.keyCode == 13){
												 //this.showSearch();
												 this.search(evt, "CMSTrashBag", this.getKeywords());
											 }
										 }
								 });
			dojo.event.kwConnect({	     srcObj:this.searchButton,
										 srcFunc:'onclick',
										 adviceObj:this,
										 adviceFunc:function(evt){
											 //this.showSearch();
											 this.search(evt, "CMSTrashBag", this.getKeywords());
										 }
								 });

			dojo.event.kwConnect({	     srcObj:this.resetButton,
										 srcFunc:'onclick',
										 adviceObj:this,
										 adviceFunc:'reset'});

		}
	}
);
