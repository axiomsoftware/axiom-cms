/**
Copyright Axiom, Inc
Dan Pozmanter and Thomas Mayfield
*/

dojo.provide("axiom.widget.ContentTable");

dojo.require("dojo.widget.*");
dojo.require("axiom.widget.IOTable");
dojo.require("axiom.widget.DeleteObjectsModal");
dojo.require("axiom.widget.CopyObjectsModal");
dojo.widget.defineWidget(
	"axiom.widget.ContentTable",
	axiom.widget.IOTable,
	function(){},
	{
		activeRow: null,
		deleteButton: null,
		copyButton: null,
		selectedRows: {},
		nonDeletableObjects: {},
		nonAddableObjects: {},
		nextSet:false,
		prevSet:false,
		data:{},
		rowInfoIndex: {},
		numCols: 5,
		sortable_fields:['cms_sortabletitle','cms_sortable_prototype'],
        templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/ContentTable.html'),
		templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/ContentTable.css'),
		previous:function(){
			if(this == axiom.browsetable)
				axiom.browsecfilter.go(this.start-this.length,this.length);
			else
				axiom.cfilter.go(this.start-this.length,this.length);
		},
		next:function(){
			if(this == axiom.browsetable)
				axiom.browsecfilter.go(this.start+this.length,this.length);
			else
				axiom.cfilter.go(this.start+this.length,this.length);
		},
		selectAll:function(evt){
			var all_checked = evt.currentTarget.checked;
			var inputs = this.results_body.getElementsByTagName('input');
			var len = inputs.length;
			for(var i=0; i<len; i++){
				if(inputs[i].type == "checkbox"){
					var input = inputs[i];
					var selected = this.selectedRows[input.parentNode.parentNode.id];
					if((all_checked && !selected) || (!all_checked && selected)){
						input.checked = !input.checked;
						this.toggleSelect(input.parentNode.parentNode);
					}
				}
			}
		},
		postCreate:function(){
			if(this.searchURL == 'cms/runSearch')
				this.searchURL = this.appPath + 'cms/runSearch';
			if(this.ajaxLoader) this.ajaxLoader.src = axiom.staticPath+'/axiom/images/ajax-loader.gif';

			if(this.lock) this.lock.src = axiom.staticPath+'/axiom/images/lock.gif';

			dojo.event.kwConnect({srcObj: this.pagination_input,
								  srcFunc: 'onkeypress',
								  adviceObj: this,
								  adviceFunc: 'goToPage'});

			dojo.event.kwConnect({srcObj: this.pagination_button,
								  srcFunc: 'onclick',
								  adviceObj: this,
								  adviceFunc: 'goToPage'});

		},
		goToPage:function(evt){
			if(evt.type == 'click' || evt.keyCode == 13){
				(this == axiom.browsetable ? axiom.browsecfilter : axiom.cfilter).goToPage(this.pagination_input, this.length,this.pages);
			}
		},
		mouseoutRowHandler:function(evt){
			if(this.activeRow != evt.currentTarget.id && !this.selectedRows[evt.currentTarget.id]){
				dojo.html.removeClass(evt.currentTarget, 'highlight');
			}
		},
		stopBubble: function(evt) {
			evt.cancelBubble = true;
		},
		toggleSelect: function(evt){
			var row,input;
			if(dojo.dom.isNode(evt)){
				row = evt;
				input = row.getElementsByTagName('input')[0]
			} else{
				this.stopBubble(evt);
				input = evt.currentTarget;
				row = input.parentNode.parentNode;
			}

			if(input.checked){
				this.highlightRow(row);
				this.onSelect(row);
				if(input.type == 'radio'){
					for(var id in this.selectedRows){
 						if(this.selectedRows[id] && row.id != id){
							var off_row = dojo.byId(id);
 							this.unhighlightRow(off_row);
 							this.onUnselect(off_row);
 						}
 					}
				}
			} else{
				this.unhighlightRow(row);
				this.onUnselect(row);
			}
		},
		deleteObjects:function(){
			if(!dojo.html.hasClass(this.deleteButton, 'form-button-disabled')){
				var objects = [];
				for(var id in this.selectedRows){
					objects.push({title: dojo.byId(id).getElementsByTagName('td')[2].innerHTML,
								  id: id});
				}
				axiom.openModal({ widget: dojo.widget.createWidget("axiom:DeleteObjectsModal", {appPath:axiom.appPath, staticPath: axiom.staticPath, objects:objects}) });
			}
		},
		copyObjects:function(){
			if(!dojo.html.hasClass(this.copyButton, 'form-button-disabled')){
				var objects = [];
				for(var id in this.selectedRows){
					objects.push({title: dojo.byId(id).getElementsByTagName('td')[2].innerHTML,
								  id: id});
				}
				axiom.openModal({ widget: dojo.widget.createWidget("axiom:CopyObjectsModal", {appPath:axiom.appPath, staticPath: axiom.staticPath, objects:objects}) });
			}
		},
		insertButtonRow:function(data){
	 		var row = this.results_body.insertRow(document.createElement('tr'));
 			var select_spacer = document.createElement('td');
			dojo.html.addClass(row, 'invisible');
			row.appendChild(select_spacer);

			var buttons = [];
			var button_holder = document.createElement('td');

			var colSpan = 7;
			if(this['axiom:opentasktable']) {
				colSpan = 8;
			} else if(this['axiom:contenttable']) {
				colSpan = 5;
			}
			button_holder.setAttribute('colSpan', colSpan);
			dojo.html.addClass(button_holder, 'lastRow');
			for(var i in data){
				var button_obj = data[i];
				var button = document.createElement('a');
				if(!button_obj.classNames){
					dojo.html.addClass(button, 'button');
					dojo.html.addClass(button, 'form-button');
					dojo.html.addClass(button, 'form-button-disabled');
				} else{
					for(var j in button_obj.classNames){
						dojo.html.addClass(button, button_obj.classNames[j]);
					}
				}
				button.innerHTML = button_obj.text;

				button_holder.appendChild(button);
				buttons.push(button);

				if(button_obj.callback){
					dojo.event.kwConnect({srcObj:button,
								 		  srcFunc: 'onclick',
										  adviceObj: this,
										  adviceFunc: button_obj.callback
										 });
				}
			}
			var expand_txt = document.createElement('span');
			expand_txt.className='table_info_txt';
			expand_txt.innerHTML = 'Click row to expand/collapse';
			button_holder.appendChild(expand_txt);
			row.appendChild(button_holder);
			this.results_body.appendChild(row);
			return buttons;
		},
		createRow:function(data,table){

			var row = this.results_body.insertRow(document.createElement('tr'));
			row.id = data.id;
			if(this.selectedRows[row.id]){
				dojo.html.addClass(row, 'highlight');
			}

			// create the checkbox selector
			var selector = document.createElement('td');
			dojo.html.setClass(selector, 'selector');
			if(!data.omitSelector){
				var input;
				if(dojo.render.html.ie){
					input = document.createElement('<input type="'+ (data.input_type || 'checkbox')
												   +'" name="'+data.input_name+'" '
												   +(this.selectedRows[row.id] ? 'checked="true"' : '')+'/>');
				} else{
					input = document.createElement('input');
					input.type = (data.input_type || "checkbox");
					if(data.input_name) { input.name = data.input_name; }
					if(this.selectedRows[row.id]){
						input.checked = true;
					}
				}

				dojo.event.kwConnect({srcObj: input,
									  srcFunc: 'onclick',
									  adviceObj: this,
									  adviceFunc: 'toggleSelect'
									 });
				selector.appendChild(input);

			}

			dojo.event.kwConnect({srcObj: selector,
								  srcFunc: 'onclick',
								  adviceObj: this,
								  adviceFunc: 'stopBubble'
								 });
			dojo.event.kwConnect({srcObj: selector,
								  srcFunc: 'onmouseover',
								  adviceObj: this,
								  adviceFunc: 'stopBubble'
								 });
			row.appendChild(selector);


			// begin adding content to the visible row
			for(var i in data.cols){
				var col = document.createElement('td');

				dojo.html.setClass(col, data.cols[i]['class']);
				if(data.cols[i].title){
					col.title = data.cols[i].title;
				}
				var content = data.cols[i].content;
				if(dojo.dom.isNode(content))
					col.appendChild(content);
				else
					col.innerHTML = content;

				row.appendChild(col);
				var colspan = data.cols[i].colspan;
				if(colspan) { col.setAttribute('colSpan', colspan); }
			}


			// common row event handlers
			if(!data.noHighlight){
				dojo.event.kwConnect({srcObj:row,
									  srcFunc: 'onmouseover',
									  adviceFunc: function(){ dojo.html.addClass(row, 'highlight'); }
									 });
				dojo.event.kwConnect({srcObj:row,
									  srcFunc: 'onmouseout',
									  adviceObj: this,
									  adviceFunc: 'mouseoutRowHandler'
									 });
			}
			dojo.event.kwConnect({srcObj:row,
								  srcFunc: 'onclick',
								  adviceObj: this,
								  adviceFunc: function(){this.toggleRow(row)}
								 });
			return row;
		},
		insertRow:function(obj){
			var cols = [];

			// edit button
			var edit = document.createElement('img');
			if(obj.editable){
				edit.src = axiom.staticPath+"/axiom/images/icon_edit.gif";
				dojo.html.setClass(edit, 'action');
 				edit.title = "Edit";
				edit.alt = "Edit";
				dojo.event.kwConnect({srcObj: edit,
									  srcFunc: 'onclick',
									  adviceFunc: function(evt){evt.cancelBubble = true; axiom.loadEdit((obj.href == '/'?'':obj.href)+'/cms_edit') } });
			} else{
				edit.src = axiom.staticPath+"/axiom/images/icon_edit_off.gif";
				edit.title = "You do not have permission to edit this object";
				edit.alt = "You do not have permission to edit this object";
			}
			cols.push({content: edit, 'class': 'col_action'});

			// title
			cols.push({content: obj.title, 'class': 'col_title'});

			// lock indicator
			var lock = '';
			if(obj.locked){
				lock = document.createElement('img');
				lock.src = axiom.staticPath+"/axiom/images/lock.gif";
				lock.title = "Locked";
				lock.alt = "Locked";
			}
			cols.push({content: lock, 'class': 'col_lock'})

			// live url
			var location = document.createElement('a');
			dojo.event.kwConnect({ srcObj: location,
								   srcFunc: 'onclick',
								   adviceFunc: function(evt){
									   evt.cancelBubble = true;
									   // if-cms-version-enterprise
									   window.open(obj.href.replace(/\/$/,'') + '/task_preview');
									   // end-cms-if
									   // if-cms-version-workgroup|standard
									   window.open(obj.href.replace(/\/$/,''));
									   // end-cms-if
								   }
								 });

			location.href = "javascript:void(0);";
			var uri =  obj.path.match(/^\/cms/) ? '' : obj.href;
			if(uri.length > 60){
				uri = uri.substring(0, 60)+'...';
			}
			location.innerHTML = uri;
			cols.push({content: location, 'class': 'col_location'});

			// content type
			cols.push({content:obj.contenttype, 'class':'col_type'});

			// insert row into table
			var row = this.createRow({cols: cols, id: obj._id});
			this.results_body.appendChild(row);

			if(obj.deletable){
				dojo.html.addClass(row, 'deletable');
			}

			if(obj.addable){
				dojo.html.addClass(row, 'addable');
			}

			// info row creation
			var task_text = '';
			if(obj.task){
				task_text = 'In Task:  '+obj.task.task_id+ ' - '+obj.task.name+' - '+obj.task.status;
			}
			this.results_body.appendChild(this.createInfoRow({
				id: obj._id+'created',
                omitSelector: true,
				cols: [ {content: obj.created},
						{content: task_text ? '<img src="'+axiom.staticPath+'/axiom/images/arrow-right.gif" />' : ''},
						{content: task_text} ]
			}));

			this.results_body.appendChild(this.createInfoRow({id: obj._id+ 'edited',
															  cols: [{content: obj.lastmodified},
																	 {content:  ''},
																	 {content: obj.task ? obj.task.cms_createdby : ''}]
															 }));
			this.rowInfoIndex[obj._id] = [obj._id+'created', obj._id+'edited'];
		},
		createInfoRow:function(data){
			var row = this.results_body.insertRow(document.createElement('tr'));
			row.id = data.id;
			row.style.display = 'none';
			dojo.html.setClass(row, 'info');
			var row_select_spacer = document.createElement('td');
			dojo.html.addClass(row_select_spacer, 'selector');
			row.appendChild(row_select_spacer);
			var dark_row_select_spacer = document.createElement('td');
			row.appendChild(dark_row_select_spacer);
			dojo.html.addClass(dark_row_select_spacer, 'info_spacer');

			var total_cols = data.cols.length + 2;
			for(var i in data.cols){
				var row_content = document.createElement('td');
				var content = data.cols[i].content;
				if(dojo.dom.isNode(content))
				   row_content.appendChild(content);
				else
					row_content.innerHTML = content
				var colspan = data.cols[i].colspan;
				if(colspan){
					row_content.setAttribute('colSpan', colspan);
					total_cols += colspan - 1;
				}
				row.appendChild(row_content);
			}
			var spacers = (this.numCols || 6) - total_cols + 1;
			for(i=0; i< spacers; i++){
				row.appendChild(document.createElement('td'));
			}

			var cells = row.getElementsByTagName('td');
			dojo.html.addClass(cells[cells.length-1], 'last-cell');

			return row;
		},
		collapseRow:function(row){
			dojo.html.removeClass(row, 'highlight');
			var ids = this.rowInfoIndex[row.id];
			for(var i in ids){
				dojo.byId(ids[i]).style.display = 'none';
			}
		},
		onSelect:function(row){
			if(this.deleteButton && !dojo.html.hasClass(row, 'deletable')){
				this.nonDeletableObjects[row.id] = true;
			}
			if(this.copyButton && !dojo.html.hasClass(row, 'addable')){
				this.nonAddableObjects[row.id] = true;
			}
			this.checkDeleteButton();
			this.checkButton(this.nonAddableObjects, this.copyButton);
		},
		onUnselect:function(row){
			delete this.nonDeletableObjects[row.id];
			delete this.nonAddableObjects[row.id];
			delete this.selectedRows[row.id];
			this.checkDeleteButton();
			this.checkButton(this.nonAddableObjects, this.copyButton);
		},
		highlightRow:function(row){
			this.selectedRows[row.id] = true;
			dojo.html.addClass(row, 'highlight');
		},
		unhighlightRow:function(row){
			if(row.id != this.activeRow){
				dojo.html.removeClass(row, 'highlight');
				delete this.selectedRows[row.id];
			}
		},
		checkDeleteButton:function(){
			// if-cms-version-standard|workgroup
			if(!axiom.isContentContributor)
			// end-cms-if
				this.checkButton(this.nonDeletableObjects, this.deleteButton);
		},
		checkButton: function(noTable, button){
			var enable = false;
			for(var i in this.selectedRows){enable = true; break;}
			for(var i in noTable){ enable = false; break;}
			if(enable){
				dojo.html.removeClass(button, 'form-button-disabled');
			} else{
				dojo.html.addClass(button, 'form-button-disabled');
			}
		},
		toggleRow:function(row){
			if(this.activeRow && this.activeRow != row.id){
				this.collapseRow(dojo.byId(this.activeRow));
			}
			this.activeRow = row.id;
			var rows = this.rowInfoIndex[row.id];
			for(var i in rows){
				var row = dojo.byId(rows[i]);
				if(row){
					if(row.style.display == 'table-row' || row.style.display == ''){
						row.style.display = 'none';
						this.activeRow = '';
					}
					else {
						if(dojo.render.html.ie)
							row.style.display = '';
						else
							row.style.display = 'table-row';
					}
				}
			}
		},
		handleResults:function(type, data, req){
			if (this.widget == axiom.ctable) {
				if (this.widget.searchterm) {
					if (axiom.cfilter.searchTerm) {
						this.widget.searchterm.innerHTML = '<strong>Your search: "' + axiom.cfilter.searchTerm + '"</strong>';
					} else {
						this.widget.searchterm.innerHTML = '';
					}
				}
			}
			this.widget.loading.style.display = 'none';
			this.widget.tablewrap.style.display = 'block';
			this.widget.data = data;

			// clear previous selections
			this.widget.selectedRows = {};
			this.widget.nonDeletableObjects = {};

			this.widget.page = data.page;
			this.widget.pages = data.pages;
			this.widget.length = data.length;
			this.widget.start = data.start;

			this.widget.clearTable();

			for(var i in data.results){
				this.widget.insertRow(data.results[i]);
			}
			if(data.results.length == 0 && typeof this.widget.insertNoObjectsRow == 'function'){
				this.widget.insertNoObjectsRow();
			}

			var delete_data = {text:'Delete', callback: 'deleteObjects'};
			// if-cms-version-standard|workgroup
			if(axiom.isContentContributor){
				delete delete_data.callback;
			}
			// end-cms-if

			var buttons;
			if(data.results.length != 0){
				if (this.widget.widgetType == "UserTable") {
					buttons = this.widget.insertButtonRow([delete_data]);
				} else if(this.widget.buttonData){
					buttons = this.widget.insertButtonRow(this.widget.buttonData);
					this.widget.buttons = buttons;
				} else {
					var copy_data = {text:'Copy', callback: 'copyObjects'};
					buttons = this.widget.insertButtonRow([delete_data,copy_data]);
					this.widget.copyButton = buttons[1];
				}
				this.widget.deleteButton = buttons[0];
				this.widget.setupPagination(data);
			}
		},
		setupPagination:function(data){
			if(data.pagination){
				this.pagination_block.style.display = 'block';
				this.page_num.innerHTML = data.page;
				this.page_total.innerHTML = data.pages;
			} else{
				this.pagination_block.style.display = 'none';
			}

			if(data.backenabled){
				this.previous_page_img.src = axiom.staticPath+ '/axiom/images/icon_page_back_enabled.gif';
				if (!this.prevSet) {
					dojo.event.kwConnect({srcObj: this.previous_page_img,
									  srcFunc: 'onclick',
									  adviceObj: this,
									  adviceFunc: 'previous'});
					this.prevSet = true;
				}
			} else{
				this.previous_page_img.src = axiom.staticPath+ '/axiom/images/icon_page_back_disabled.gif';
				this.previous_page_img.style.cursor = 'default';
				if (this.prevSet) {
					dojo.event.kwDisconnect({srcObj: this.previous_page_img,
										 srcFunc: 'onclick',
										 adviceObj: this,
										 adviceFunc: 'previous'});
					this.prevSet = false;
				}
			}

			if(data.nextenabled){
				this.next_page_img.src = axiom.staticPath+ '/axiom/images/icon_page_next_enabled.gif';
				if (!this.nextSet) {
					dojo.event.kwConnect({srcObj: this.next_page_img,
									  srcFunc: 'onclick',
									  adviceObj: this,
									  adviceFunc: 'next'});
					this.nextSet = true;
				}
			} else{
				this.next_page_img.src = axiom.staticPath+ '/axiom/images/icon_page_next_disabled.gif';
				this.next_page_img.style.cursor = 'default';
				if (this.nextSet) {
					dojo.event.kwDisconnect({srcObj: this.next_page_img,
										 srcFunc: 'onclick',
										 adviceObj: this,
										 adviceFunc: 'next'});
					this.nextSet = false;
				}
			}
		},
		clearTable:function(){
			dojo.dom.removeChildren(this.results_body);
		}

	}
);
