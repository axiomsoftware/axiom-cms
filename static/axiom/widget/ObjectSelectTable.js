/**
Copyright Siteworx
Dan Pozmanter, Thomas Mayfield
*/

dojo.provide("axiom.widget.ObjectSelectTable");

dojo.require("dojo.widget.*");
dojo.require("axiom.widget.ContentTable");

dojo.widget.defineWidget(
	"axiom.widget.ObjectSelectTable",
	axiom.widget.ContentTable,
	function(){},
	{
		searchTemplate:"ObjectSelectTable",
		property:'',
		multiple:false,
		setCallBack:null,
		exitCallBack:null,
		callingWidget:null,
		okButton:null,
		cancelButton:null,
		items:{},
		item:null,
		return_hrefs: false,
		//Relative to dojo:
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/ObjectSelectTable.html'),
		templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/ObjectSelectTable.css'),
		cancel:function() { this.exitCallBack(this.callingWidget); this.return_hrefs = false;},
		ok:function() {
			this.return_hrefs = false;
			if (this.multiple) {
				this.setCallBack(this.callingWidget, this.items);
			} else {
				this.setCallBack(this.callingWidget, this.item);
			}
			this.exitCallBack(this.callingWidget);
		},
		toggleHrefValues:function(){ // return object hrefs insteads of paths for the duration of this popup
			this.return_hrefs = true;
		},
		onSelect:function(row){
			var cells = row.getElementsByTagName('td');
			var path = row.id;
			var uri = cells[2].getElementsByTagName('a')[0].id;
			this.select(cells[1].innerHTML,{'path':path,'uri':uri}, cells[0].getElementsByTagName('input')[0].checked);
		},
		onUnselect:function(row){
			this.onSelect(row);
		},
		select:function(title, obj, checked) {
			title = unescape(title);
			var entry = [title,obj];
			if (this.multiple) {
				if(this.items[obj.path] && !checked) {
					delete(this.items[obj.path]);
				} else if(!this.items[obj.path] && checked) {
					this.items[obj.path] = entry;
				}
			} else if(checked) {
				this.item = entry;
			}
		},
		getArgString:function (prototype, keywords, field, direction, start, length,published_only) {
			var t='';
			if (start != -1) { t += "&start=" + start; }
			if (this.searchTemplate != '') { t += "&template="+this.searchTemplate; }
			if(published_only) { t += '&published_only='+published_only; }
			if (this.multiple) { t += "&select_type=checkbox"; }
			else { t += "&select_type=radio"; }
			return "?prototype=" + prototype + "&keywords=" +
				keywords + "&length=10&sort_field=" + field + "&sort_direction=" + direction + "&property=" + this.property + t;
		},
		insertRow:function(obj){
			var location = document.createElement('a');
			location.id = obj.href;
			location.href = obj.href;
			var uri = obj.path.match(/^\/cms/) ? '' : obj.href;
			if(uri.length > 60){
				uri = uri.substring(0, 60)+'...';
			}
			location.innerHTML = uri;
			this.selectedRows[obj.path] = (obj.path == axiom.browsetable.defaultValue || dojo.lang.inArray(axiom.browsetable.defaultValues,obj.path));
			var row = this.createRow({
				cols: [{content: obj.title, 'class': 'col_title'},
					   {content: location, 'class': 'col_location', title: obj.path},
					   {content:obj.contenttype, 'class':'col_type'}],
				id: obj.path,
				input_type: this.multiple ? 'checkbox' : 'radio',
				input_name: 'objectselect'
			});
			this.results_body.appendChild(row);
		},
		toggleRow:function(){}, // override for no-op
		handleResults:function(type, data, req){
			if (this.widget == axiom.browsetable) {
				if (this.widget.searchterm) {
					if (axiom.browsecfilter.searchTerm) {
						this.widget.searchterm.innerHTML = '<strong>Your search: "' + axiom.browsecfilter.searchTerm + '"</strong>';
					} else {
						this.widget.searchterm.innerHTML = '';
					}
				}
			} 
			this.widget.loading.style.display = 'none';
			this.widget.tablewrap.style.display = 'block';

			this.widget.selectedRows = {};

			this.widget.page = data.page;
			this.widget.pages = data.pages;
			this.widget.length = data.length;
			this.widget.start = data.start;

			this.widget.clearTable();

			for(var i in data.results){
				this.widget.insertRow(data.results[i]);
			}

			var classes = ['button'];
			var buttons = this.widget.insertButtonRow([{text:'OK', callback:'ok', classNames:classes},{text:'Cancel', callback:'cancel', classNames:classes}]);

			this.widget.setupPagination(data);
		}
	}
);
