/**
Copyright Axiom
Thomas Mayfield
*/

dojo.provide("axiom.widget.TaskTable");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.ContentTable");

dojo.widget.defineWidget(
	"axiom.widget.TaskTable",
	axiom.widget.ContentTable,
	function(){},
	{
		appPath:'',
		title: '',
		searchUrl: '',
		tasks: {},
		sortObj: {cms_lastmodified: 'desc', task_id: 'desc'},
		sortDirections: {},
		search: function(args){
			var sortArray = [];
			for(var i in this.sortObj){
				var f = {};
				f[i] = this.sortObj[i];
				sortArray.push(f);
			}
			var post_args = {sort: sortArray};
			if(args){
				post_args.args = args;
			}
			dojo.io.bind({url:this.searchUrl,
						  mimeType: 'text/json',
						  contentType: 'text/json',
						  postContent: dojo.json.serialize(post_args),
						  load: this.handleResults,
						  error: this.errorHandler,
						  method: 'post',
						  widget: this
						 });
		},
		postCreate:function() {
			this.tablewrap.style.display = 'block';
		},
		sort:function(sortObj) {
			for(var field in sortObj){
				if(sortObj[field] == 'alternate'){
					var direction = (field in this.sortDirections) ? this.sortDirections[field] : 'desc';
					sortObj[field] = direction;
					this.sortDirections[field] = (direction == 'asc'? 'desc': 'asc');
				}
			}
			this.sortObj = sortObj;
			this.refresh();
		},
		insertResults:function(data){
			try{
				data = eval(data);
			}catch(e){
				axiom.openModal({content: "Server returned malformed response."});
				return;
			}
			this.data = data;
			var objs = 0;
			for(var i in data){
				objs++;
				this.insertRow(data[i]);
				this.tasks[data[i].task_id] = data[i];
			}

			if(objs == 0) {
				this.insertNoObjectsRow();
			} else{
				var rows = this.results_body.getElementsByTagName('tr');
				var cells = rows[rows.length-1].getElementsByTagName('td');
				var len = cells.length;
				for(var i=1; i<len; i++){
					dojo.html.addClass(cells[i], 'last');
				}
				if(dojo.render.html.ie)
					this.columnHeaders.style.display = '';
				else
					this.columnHeaders.style.display = 'table-row';
				if(this['axiom:closedtasktable'])
					this.insertFooter();
				return true;
			}
		},
		insertObjectRows:function(task, row_id, omitEdit){
			if(task.description || task.rejection_description || task.approval_description){
				this.results_body.appendChild(this.createInfoRow({	id: row_id+'description',
																	cols: [{content: (task.approval_description || task.rejection_description || task.description),
																			colspan: this.numCols-2}]
																 }));
				this.rowInfoIndex[row_id] = [row_id+'description'];
			} else {
				this.rowInfoIndex[row_id] = [];
			}

			for(var i in task.objects){
				var object = task.objects[i];
				var row = this.createObjectRow(object, row_id, omitEdit);
				this.results_body.appendChild(row);
				this.rowInfoIndex[row_id].push(row.id);
			}
		},
		formatDate:function(dateObj, noFormatDate){
			var result;
			try{
				result = dojo.date.strftime(dateObj, '%m/%d/%y');
				if(!(this.noFormatDate || noFormatDate) && dateObj.getTime() < (new Date()).getTime()){
					result = '<span class="alert">'+result+"</span>";
				}
			}catch(e){
				result = '';
			}
			return result;
		},
		refresh:function(args){
			dojo.dom.removeChildren(this.results_body);
			this.selectedRows = {};
			this.search(args);
		},
		editTask:function(evt){
			this.stopBubble(evt);
			var task = this.tasks[evt.currentTarget.parentNode.parentNode.id.match(/^\d+/)[0]];
			var widget = dojo.widget.createWidget("axiom:EditTaskModal", {appPath: axiom.appPath, staticPath: axiom.staticPath, task:task});
			axiom.openModal({widget: widget});
		},
		createObjectRow:function(obj, rowId, omitEdit){
			// edit button
			var edit = '';
			if(!omitEdit){
				edit = document.createElement('img');
				if(obj.editable){
					edit.src = axiom.staticPath+"/axiom/images/icon_edit.gif";
					dojo.html.setClass(edit, 'action');
 					edit.title = "Edit";
					edit.alt = "Edit";
					dojo.event.kwConnect({srcObj: edit,
										  srcFunc: 'onclick',
										  adviceFunc: function(evt){evt.cancelBubble = true; axiom.loadEdit((obj.href == '/'?'':obj.href)+'/cms_edit'); } });
				} else {
					edit.src = axiom.staticPath+"/axiom/images/icon_edit_off.gif";
					edit.title = "You do not have permission to edit this object";
					edit.alt = "You do not have permission to edit this object";
				}
			}
			var info_text = obj.title;
			if(this.getNamespacedType() != 'axiom:closedtasktable') {
				var link_text = "Preview";
				var link_action = "window.open('"+obj.href+"')";
				if(obj._action == "Deleted"){
					link_text = "Cancel Deletion";
					link_action = "axiom.tasks.cancelDelete('"+obj.href+"')";
				}
				info_text += ' [<a href="javascript:void(0);" onclick="'+link_action+'">'+link_text+'</a>]';
			}
			var cols =  (edit ? [{content:edit}] : []);
			return this.createInfoRow({id:   obj._id+'_'+rowId,
									   cols: cols.concat([{content:' Action: ' +obj._action},
														  {content: info_text},
														  {content: ''},
														  {content: 'Content Type: '+obj._prototype, colspan:'2'}])});
		}
	}
);
