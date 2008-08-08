/**
Copyright Axiom
Thomas Mayfield
*/

dojo.provide("axiom.widget.RecycleBinTable");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.UserTable");

dojo.widget.defineWidget(
	"axiom.widget.RecycleBinTable",
	axiom.widget.UserTable,
	function(){},
	{
		appPath:'',
		data: {},
		numCols: 3,
		buttonData: [{text: "Restore", callback:"restoreObjects"}, {text: "Delete", callback:"deleteObjects"}],
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/RecycleBinTable.html'),
		templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/RecycleBinTable.css'),
		insertRow: function(item){
			var row_id = item._id;
			var row = this.createRow(
				{id: row_id,
				 cols: [{content: item.title,        'class': 'col_title' },
						{content: item.location,     'class': 'col_location' },
						{content: item.num_children, 'class': 'col_children' }
					   ]
				});
			this.results_body.appendChild(row);
		},
		getSelectedObjects: function(){
			var objects = [];
			for(var id in this.selectedRows){
				objects.push({_id: id});
			}
			return objects;
		},
		submitObjects: function(url, callback, error_callback){
			dojo.io.bind({url: url,
						  method: 'post',
						  contentType: 'text/json',
						  load: callback,
						  error: error_callback,
						  postContent: dojo.json.serialize({objects: this.getSelectedObjects()})
						 });
		},
		restoreObjects: function(){
			this.submitObjects('restore_objects', recyclebin.cfilter.search);
		},
		deleteObjects: function(){
			this.submitObjects('purge_recycled_objects', recyclebin.cfilter.search);
		},
		toggleButtons: function(){
			this.checkButton([], this.buttons[0]);
			this.checkButton([], this.buttons[1]);
		},
		onSelect:function(row){
			this.toggleButtons();
		},
		onUnselect:function(row){
			this.toggleButtons();
		},
		postCreate:function() {
			this.ajaxLoader.src = axiom.staticPath + '/axiom/images/ajax-loader.gif';
			this.tablewrap.style.display = 'block';

			dojo.event.kwConnect({srcObj: this.pagination_input,
								  srcFunc: 'onkeypress',
								  adviceObj: this,
								  adviceFunc: 'goToPage'});

			dojo.event.kwConnect({srcObj: this.pagination_button,
								  srcFunc: 'onclick',
								  adviceObj: this,
								  adviceFunc: 'goToPage'});


		}
	}
);
