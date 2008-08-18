/**
 * Copyright Axiom
 * Thomas Mayfield
 */

dojo.provide("axiom.widget.UserFilter");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.ContentFilter");

dojo.widget.defineWidget(
	"axiom.widget.UserFilter",
	axiom.widget.ContentFilter,
	function(){},
	{
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/UserFilter.html'),
		prototypeList: ["CMSUser"],
		sortObj: [{last_name: 'asc'}, {first_name:'asc'}],
		getPrototype:function() {
			return "CMSUser";			
		},
		getKeywords:function(){
			return this.keywordInput.value + (this.rolesInput.value != 'All'?' search_roles:"'+this.rolesInput.value+'"':'');
		},
		reset:function(){
			this.rolesInput.value = "All";
			this.keywordInput.value = "";
		},
	 	showSearch: function(){
			dojo.widget.byId('EditBody').hide();
			dojo.widget.getWidgetsByType('UserTable')[0].show(); 
		},
		postCreate:function() {
			dojo.event.kwConnect({       srcObj: this.keywordInput,
										 srcFunc:'onkeydown',
										 adviceObj: this,
										 adviceFunc: function(evt){  
											 if(evt.keyCode == 13){
												 this.showSearch();
												 this.search(evt, "CMSUser", this.getKeywords()); 
											 }
										 }
								 });
			dojo.event.kwConnect({	     srcObj:this.searchButton,
										 srcFunc:'onclick',
										 adviceObj:this,
										 adviceFunc:function(evt){ 
											 this.showSearch();
											 this.search(evt, "CMSUser", this.getKeywords()); 
										 }
								 });

			dojo.event.kwConnect({	     srcObj:this.resetButton,
										 srcFunc:'onclick',
										 adviceObj:this,
										 adviceFunc:'reset'});

		}
	}
);
