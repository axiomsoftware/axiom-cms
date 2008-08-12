/**
Copyright Siteworx
Dan Pozmanter
*/

dojo.provide("axiom.widget.ContentFilter");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");

dojo.widget.defineWidget(
	"axiom.widget.ContentFilter",
	dojo.widget.HtmlWidget,
	function(){},
	{
		appPath:'',
		prototypes:{},
		maindiv:null,
		keywordInput:null,
		prototypeList:null,
		searchButton:null,
		searchTerm:'',
		resetButton:null,
		resultTable:null,
		contentAdd:null,
		searchlength:15,
		sortObj: {},
		sortDirections: { cms_sortabletitle: 'asc',
				  cms_sortablelocation: 'asc',
				  '__prototype': 'asc',
				  '_cms_lastmodified': 'desc',
				  creator: 'asc'
				},
		publishedOnly: '',
		//Relative to dojo:
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/ContentFilter.html'),
		getPrototype:function() {
			return this.prototypeList.value;
		},
		getKeywords:function(){
			if(dojo.html.hasClass(this.keywordInput, 'gray')){
				   return '';
			}
			return this.keywordInput.value;
		},
		setPrototype:function(prototype) {
			this.prototypeList.value = prototype;
		},
		setTargetTypes:function(prototypeJSON){
			this.prototypes = prototypeJSON;
			this.populateList();
		},
		resetTargetTypes:function(){
			this.setTargetTypes(this.originalPrototypes);
		},
		registerAdd:function(widget) {
			this.contentAdd = widget;
		},
		registerTable:function(widget) {
			this.resultTable = widget;
		},
		runSearch:function(prototype, keyword, sort, start, length, published_only) {
			var widget = this;
			var search = function(){
				widget.resultTable.runSearch(prototype, keyword, sort, start, length, published_only);
				axiom.showContent();
			};
			if(axiom.isDirty() && this == axiom.cfilter){
				axiom.saveDialog(search);
			} else{
				this.resultTable.runSearch(prototype, keyword, sort, start, length, published_only);
			}
		},
		setDirection:function(field) {
			if (this.sortField == field) {
				this.sortDirection = (this.sortDirection=='desc')?'':'desc';
			} else { this.sortDirection = ''; }
		},
		clear: function(){
			this.sortField = '';
			this.sortfdirection = '';
			this.searchlength = this.initialLength;
			this.setPrototype("");
			this.searchTerm = '';
			this.keywordInput.value = '';
		},
		reset:function() {
			this.clear();
			this.runSearch('', this.getPrototype(), {}, -1, this.searchlength);
		},
		setLength:function(len){
			this.initialLength = len;
			this.searchlength = len;
		},
		search:function(evt, prototype, keyword, length) {
			var p = (prototype || this.getPrototype());
			var k = (keyword || (this.keywordInput.value == 'Keyword' ? '' : this.keywordInput.value));
        	var len = (length || this.searchlength);

			if (k) {
				this.searchTerm = k;
			} else {
				this.searchTerm = '';
			}

			this.runSearch(p, k, this.sortObj, -1, len, this.publishedOnly);
		},
		sort:function(sortObj){
			if(sortObj instanceof Array){
				for(var i in sortObj){
					for(var field in sortObj[i]){
						this.flip_sort(field, sortObj[i]);
					}
				}
			} else {
				for(var field in sortObj){ this.flip_sort(field, sortObj);}
			}
			this.sortObj = sortObj;
			this.runSearch(this.getPrototype(), this.getKeywords(), sortObj, -1, this.searchlength);
		},
		flip_sort: function(field, obj){
			if(obj[field] == 'alternate'){
				var direction = this.sortDirections[field] || 'asc';
				obj[field] = direction;
				this.sortDirections[field] = (direction == 'asc'? 'desc': 'asc');
			}
		},
		go:function(start, length) {
			this.searchlength = length;
			this.runSearch(this.getPrototype(), this.searchTerm, this.sortObj, start, length);
		},
		goToPage:function(textnode,l,pages) {
			var page = parseInt(textnode.value, 10);
			if((1 <= page) && (page <= pages)) {
				this.go((page-1) * l, l);
			} else {
				axiom.openModal({content:"Please enter a Page Number between 1 and " + pages + "."});
				textnode.value="";
			}
		},
		populateList:function(){
			this.prototypeList.innerHTML = '';
			var list = [];
			for (var p in this.prototypes) {
				if(p != 'All'){
					var option = document.createElement('option');
					option.value = p;
					option.innerHTML = this.prototypes[p];
					list.push(option);
				}
			}
			list.sort(function(a,b){return a.innerHTML.localeCompare(b.innerHTML);});
			var all = document.createElement('option');
			all.value = this.prototypes['All'];
			all.innerHTML = 'All Content Types';
			list = [all].concat(list);
			for (var i in list){
				this.prototypeList.appendChild(list[i]);
			}
		},
		closeModal:function(){
			axiom.browsemodal.hide();
		},
		postCreate:function() {
			var option = null;
			this.initialLength = this.searchlength;
			this.populateList();
			if(this.findIcon)
				this.findIcon.src = axiom.staticPath+'/axiom/images/icon_find.gif';
			if(this.closeButton){
				this.closeButton.src = axiom.staticPath+'/axiom/images/button_close.gif';
			}
			this.originalPrototypes = this.prototypes;
			dojo.event.kwConnect({      srcObj: this.keywordInput,
										 srcFunc:'onkeydown',
										 adviceObj: this,
										 adviceFunc: function(evt){ if(evt.keyCode == 13) this.search(); }
								 });
			dojo.event.kwConnect({	     srcObj:this.searchButton,
										 srcFunc:'onclick',
										 adviceObj:this,
										 adviceFunc:'search'});

			dojo.event.kwConnect({	     srcObj:this.resetButton,
										 srcFunc:'onclick',
										 adviceObj:this,
										 adviceFunc:'reset'});
		}
	}
);
