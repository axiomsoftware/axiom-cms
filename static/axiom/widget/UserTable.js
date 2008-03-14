/**
Copyright Axiom
Thomas Mayfield
*/

dojo.provide("axiom.widget.UserTable");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("axiom.widget.ContentTable");

dojo.widget.defineWidget(
	"axiom.widget.UserTable", 
	axiom.widget.ContentTable,
	function(){},
	{
		appPath:'',
		data: {},
		numCols: 7,
		approveButton: null,
		rejectButton: null,
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/UserTable.html'),
		templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/UserTable.css'),
		insertRow: function(user){
			var row_id = user._id ;
			var edit_icon = document.createElement('img');
			edit_icon.src = axiom.staticPath +'/axiom/images/icon_edit.gif';
									
			var row = this.createRow(
				{id: row_id,
				 cols: [{content: edit_icon,       'class': 'col_action' }, 
						{content: user.first_name, 'class': 'col_first_name'},
						{content: user.last_name,  'class': 'col_last_name' },
						{content: user.username,   'class': 'col_username' },
						{content: user.role,       'class': 'col_role' },
						{content: user.email,      'class': 'col_email' }]
				});
			if(user.deletable)
				dojo.html.addClass(row, 'deletable');

			this.results_body.appendChild(row);
			dojo.event.kwConnect({ srcObj: edit_icon,
								   srcFunc: 'onclick',
								   adviceFunc: function(){users.load_edit(user.edit_url)}
								 });
			
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

		onSelect:function(row){
			if(this.deleteButton && !dojo.html.hasClass(row, 'deletable')){
				this.nonDeletableObjects[row.id] = true;
			}
			this.checkButton(this.nonDeletableObjects, this.deleteButton);
		},
		onUnselect:function(row){
			if(row.id != this.activeRow){
				delete this.nonDeletableObjects[row.id];
			}
			this.checkButton(this.nonDeletableObjects, this.deleteButton);
		},
		previous:function(){
			users.cfilter.go(this.start-this.length,this.length);
		},
		next:function(){
			users.cfilter.go(this.start+this.length,this.length);
		},
		goToPage:function(evt){
			if(evt.type == 'click' || evt.keyCode == 13){ 
				users.cfilter.goToPage(this.pagination_input, this.length,this.pages); 
			}
		},
		postCreate:function() {
			this.ajaxLoader.src = axiom.staticPath + '/axiom/images/ajax-loader.gif';
			this.tablewrap.style.display = 'block';
			this.searchUrl = this.appPath+ 'cms/searchUsers';

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
