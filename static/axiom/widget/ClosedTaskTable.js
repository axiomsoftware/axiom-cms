/**
Copyright Axiom, Inc
Thomas Mayfield
*/

dojo.provide("axiom.widget.ClosedTaskTable");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.TaskTable");

dojo.widget.defineWidget(
	"axiom.widget.ClosedTaskTable", 
	axiom.widget.TaskTable,
	function(){},
	{
		appPath:'',
		data: {},
		infoRowNames: ['description_closed'],
		numCols: 6,
		numItems: 0,
		selectedRows:{},
		viewAllRow: null,
		hiddenRows: [],
		initialDisplay: 6,
		noFormatDate: true,
		sortDirections: { task_id: 'asc',
						  name: 'desc' },
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/ClosedTaskTable.html'),
		templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/ClosedTaskTable.css'),
		insertRow: function(task){
			var row_id = task.task_id + 'closed';
			var row = this.createRow( 
				{id:row_id,
				 omitSelector: true,
				 cols: [{content: task.task_id,   'class': 'col_task_id' }, 
						{content: task.name,      'class': 'col_task_name', colspan: 2},
						{content: task.objects.length, 'class': 'col_task_items' },
						{content: this.formatDate(task.lastmodified),   'class': 'col_due_date' },
						{content: task.admin_actor+' on '+this.formatDate(task.lastmodified,true), 'class': 'col_by' }]
				});
			this.results_body.appendChild(row);
			this.insertObjectRows(task,row_id,true);
			this.numItems++;
			if(this.numItems > this.initialDisplay){
				row.style.display='none';
				this.hiddenRows.push(row_id);
			}
		},
		showAll: function(){
			for(var i in this.hiddenRows){
				if(dojo.render.html.ie)
					dojo.byId(this.hiddenRows[i]).style.display = 'block';
				else
					dojo.byId(this.hiddenRows[i]).style.display = 'table-row';
			}
			this.viewAllRow.style.display = 'none';
		},
		insertFooter: function() {
			if(this.numItems > this.initialDisplay){
 				var view_all_row = this.results_body.insertRow(document.createElement('tr')); 
 				dojo.html.addClass(view_all_row, 'invisible');
				dojo.html.addClass(view_all_row, 'view_all');
				var select_spacer = document.createElement('td');
				dojo.html.addClass(select_spacer, 'selector');
				view_all_row.appendChild(select_spacer);
				var view_all_cell = document.createElement('td');
				view_all_cell.setAttribute('colSpan',this.numCols);
				var view_all_link = document.createElement('a');
				dojo.html.addClass(view_all_link, 'view_all');
				view_all_link.href= "javascript:void(0);";
				view_all_link.innerHTML = "View all "+this.numItems;
				view_all_cell.appendChild(view_all_link);
				view_all_row.appendChild(view_all_cell);
				dojo.html.addClass(view_all_cell, 'last-cell');
				this.results_body.appendChild(view_all_row);
				this.viewAllRow = view_all_row;
				dojo.event.kwConnect({srcObj: view_all_link,
									  srcFunc: 'onclick',
									  adviceObj: this,
									  adviceFunc: 'showAll'});
			}
 			var row = this.results_body.insertRow(document.createElement('tr')); 
 			dojo.html.addClass(row, 'invisible');
			var select_spacer = document.createElement('td');
			row.appendChild(select_spacer);
			var border_row = document.createElement('td');
			border_row.setAttribute('colSpan', this.numCols-1);
			dojo.html.addClass(border_row, 'lastRow');
			row.appendChild(border_row);
			this.results_body.appendChild(row);
		},
		handleResults:function(type, data, req){
			this.widget.numItems = 0;
			this.widget.insertResults(data);
		},
		postCreate:function() {
			this.tablewrap.style.display = 'block';
			this.searchUrl = this.appPath+ 'cms/my_closed_tasks';
			this.search();
		}
	}
);
