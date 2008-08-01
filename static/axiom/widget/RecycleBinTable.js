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
		approveButton: null,
		rejectButton: null,
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/RecycleBinTable.html'),
		templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/RecycleBinTable.css'),
		insertRow: function(item){
			var row_id = item._id;
			var row = this.createRow(
				{id: row_id,
				 cols: [{content: item.title,       'class': 'col_title' },
						{content: item.location,    'class': 'col_location' },
						{content: item.num_children,    'class': 'col_children' }
					   ]
				});
			this.results_body.appendChild(row);
		},
		toggleRow:function(){}, // override for no-op
		deleteObjects:function(){
			if(!dojo.html.hasClass(this.deleteButton, 'form-button-disabled')){
				var objects = [];
				for(var id in this.selectedRows){
					objects.push(id);
				}
				var content;
				if(objects.length == 1){
					var cells = dojo.byId(objects[0]).getElementsByTagName('td');
					content = "Delete user <b>"+cells[2].innerHTML+" "+cells[3].innerHTML+"</b>?";
				} else {
					content = "Delete the selected users? This action cannot be undone.";
				}
				axiom.openModal({ confirmdialog: true,
								  content: content,
								  callback: function(){
									  dojo.io.bind({ url: 'delete_users',
													 method: 'post',
													 contentType: 'text/json',
													 load: function(){ users.cfilter.search()},
													 postContent: dojo.json.serialize({users: objects}),
													 error: function(){
														 axiom.openModal({content: "Error connecting to server."});
													 }
												   });
								  }


				});
			}
		},
		postCreate:function() {
			this.ajaxLoader.src = axiom.staticPath + '/axiom/images/ajax-loader.gif';
			this.tablewrap.style.display = 'block';
			this.searchUrl = this.appPath+ 'cms/recycle_bin_contents';

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
