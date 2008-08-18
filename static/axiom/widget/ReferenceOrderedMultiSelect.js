/**
Copyright Axiom
Dan Pozmanter, Hassan Riaz, Thomas Mayfield
*/

dojo.provide("axiom.widget.ReferenceOrderedMultiSelect");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");

dojo.widget.defineWidget(
	"axiom.widget.ReferenceOrderedMultiSelect",
	dojo.widget.HtmlWidget,
	function(){},
	{
		tablewrapper:null,
		table:null,
		input:null, // Hidden input for final value
		refbody:null,
        toggleSpan:null,
        toggleLink:null,
		objectHref:'',
		appPath:'',
		id:'_',
		refArr:[],
		items:{},
		targetTypes:{},
		data:'',
		column_headers: ['Title', 'Location', '&nbsp;'],
		addButton:null,
		img_top:null,
		img_up:null,
		img_down:null,
		img_bottom:null,
		selected:0,
		dialog:null,
		//Relative to dojo:
		templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/ReferenceOrderedMultiSelect.html'),
		templateCssPath:new dojo.uri.dojoUri('../axiom/widget/resources/ReferenceOrderedMultiSelect.css'),
		swapRows:function(a,b) {
			// a = selected row, b = row to swap it with
			var rows = this.table.getElementsByTagName("tr");

			var aCells = rows[a].getElementsByTagName("td");
			var aTitle = aCells[0].innerHTML;
			var aEllipsedValue = aCells[1].innerHTML;
			var aValue = aCells[1].title;

			var bCells = rows[b].getElementsByTagName("td");
			aCells[0].innerHTML = bCells[0].innerHTML;
			aCells[1].innerHTML = bCells[1].innerHTML;
			aCells[1].title = bCells[1].title;
			rows[a].className = '';

			rows[b].className = 'selected';
			bCells[0].innerHTML = aTitle;
			bCells[1].innerHTML = aEllipsedValue;
			bCells[1].title = aValue;
		},
		goTop:function() {
			var rows = this.table.getElementsByTagName("tr");
			for(var i=1;i<rows.length;i++) {
				if(rows[i].className=="selected") {
					for(var j=0;j<i-1;j++) {
						this.goUp();
					}
				}
			}
		},
		goUp:function() {
			var rows = this.table.getElementsByTagName("tr");
			for(var i=1;i<rows.length;i++) {
				if(rows[i].className=="selected") {
					if(i>1) {
						this.swapRows(i,i-1);
						this.update();
						return;
					}
				}
			}
		},
		goDown:function() {
			var rows = this.table.getElementsByTagName("tr");
			for(var i=1;i<rows.length;i++) {
				if(rows[i].className=="selected") {
					if(i<rows.length-1) {
						this.swapRows(i,i+1);
						this.update();
						return;
					}
				}
			}
		},
		goBottom:function() {
			var rows = this.table.getElementsByTagName("tr");
			for(var i=1;i<rows.length;i++) {
				if(rows[i].className=="selected") {
					for(var j=0;j<rows.length-i;j++) {
						this.goDown();
					}
				}
			}
		},
		toggleVisibility: function(elem){
			if(elem.innerHTML == "Hide"){
                this.visibilityOff(elem);
			}
			else{
                this.visibilityOn(elem);
			}
		},
		visibilityOn: function(elem){
            elem.innerHTML = "Hide";
            this.show();
        },
		visibilityOff: function(elem){
            elem.innerHTML = "Show";
            this.hide();
        },
		update:function(){
			this.refArr = [];
			this.items = {};
			var rows = this.table.getElementsByTagName("tr");
			for(var i=1;i<rows.length;i++) {
				var col = rows[i].getElementsByTagName("td")[1];
				this.refArr.push( (col.title || col.innerHTML) );
				this.items[(col.title || col.innerHTML)] = rows[i].getElementsByTagName("td")[0].innerHTML;
			}
			this.input.value = this.refArr.join(",");

			if(this.refArr.length) {
                this.refbody.style.display="block";
                this.visibilityOn(this.toggleLink);
                this.showToggle();
            } else {
                this.refbody.style.display="none";
                this.visibilityOff(this.toggleLink);
                this.hideToggle();
            }
		},
        showToggle: function(){
            this.toggleSpan.style.display = 'inline';
        },
        hideToggle: function(){
            this.toggleSpan.style.display = 'none';
        },
		exit:function(widget) {
			this.dialog = dojo.widget.byId("BrowseDialog");
			if(this.dialog) {
				this.dialog.hide();
			} else {
				widget.remote.close();
			}
		},
		addLocations:function(widget, values) {
			for (var i in values) {
				if(!widget.items[i]) { widget.addRow(values[i][0], i, values[i][1].uri); }
			}
			for (var i in widget.items) {
				if(!values[i]) { widget.deleteRef(i); }
			}

		},
		deleteRef:function(path) {
			var rows = this.table.getElementsByTagName("tr");
			for(var i=1;i<rows.length;i++) {
				if(rows[i].getElementsByTagName("td")[1].innerHTML == path) {
					if(dojo.render.html.ie) { // Can't removeChild on tr in IE, so we use deleteRow
						this.table.tBodies[0].deleteRow(i);
						this.update();
						return true;
					} else {
						this.table.removeChild(rows[i]);
						this.update();
						return true;
					}
				}
			}
		},
		browse:function() {
			//var path = this.objectPath + this.objectId + '/';
			var path = this.objectHref;
			this.dialog = dojo.widget.byId("BrowseDialog");
			if(this.dialog) {
				axiom.browsetable.multiple = true;
				axiom.browsetable.property = this.id;
				axiom.browsetable.items = dojo.lang.shallowCopy(this.items);
				axiom.browsetable.defaultValue = "";
				axiom.browsetable.defaultValues = this.refArr;
				axiom.browsetable.browsePath = path;
				axiom.browsetable.setCallBack = this.addLocations;
				axiom.browsetable.exitCallBack = this.exit;
				axiom.browsetable.callingWidget = this;
				axiom.browsetable.searchURL = path + "potentialTargets";
				axiom.browsecfilter.setTargetTypes(this.targetTypes);
				axiom.browsecfilter.clear();
				axiom.browsecfilter.setLength(12);
				axiom.browsecfilter.search(null, null, null, 12);
				this.dialog.show();
			}
		},
		addRow:function(title, path, uri) {
			var widgetRef = this;
			var row = document.createElement('tr');
			row.onclick = function() {
				var tmp = widgetRef.table.getElementsByTagName("tr");
				for(var i=0;i<tmp.length;i++) {
					tmp[i].className="";
				}
				this.className="selected";
			};
			var col = document.createElement('td');
			col.className = 'ref_title';
			col.innerHTML = title?title:'&nbsp;';
			row.appendChild(col);
			col = document.createElement('td');
			col.className = 'ref_path';

			var shown = (uri || path);
			col.innerHTML = (shown.length > 50) ? (shown.substring(0,50)+ '...') : shown;
			col.alt = path;
			col.title = path;
			row.appendChild(col);
			col = document.createElement('td');
			col.className = 'ref_delete';
			var link = document.createElement('a');
			link.innerHTML = "Remove";
			link.href="javascript:void(0);";
			link.onclick = function() {
				if(dojo.render.html.ie) { // Can't removeChild on tr in IE, so we use deleteRow
					var tmp = widgetRef.table.getElementsByTagName("tr");
					for(var i=0;i<tmp.length;i++) {
					    if(tmp[i]==this.parentNode.parentNode) { widgetRef.table.tBodies[0].deleteRow(i);break; }
					}
				} else {
					widgetRef.table.removeChild(this.parentNode.parentNode);
				}
				widgetRef.update();
			};
			col.appendChild(link);
			row.appendChild(col);
			if(dojo.render.html.ie) { // Can't appendChild to table in IE, so we appendChild to tBodies[0]
				this.table.tBodies[0].appendChild(row);
			} else {
				this.table.appendChild(row);
			}
			this.update();
		},
		writeTable:function(data){
			var row = null;
			var col = null;
			row = document.createElement('tr');
			for (var i = 0; i < this.column_headers.length; i++){
				col = document.createElement('th');
				col.innerHTML = this.column_headers[i];
				row.appendChild(col);
			}
			if(dojo.render.html.ie) {
				this.table.tBodies[0].appendChild(row);
			} else {
				this.table.appendChild(row);
			}
			for (var i = 0; i < data.length; i++) {
				this.addRow(unescape(data[i][0]), data[i][1], data[i][2]);
			}

		},
		initialize:function(){
			this.hide();
			if(dojo.render.html.ie) { // Can't set name attribute in IE
				this.input = document.createElement('<input name="'+this.id+'" id="'+this.id+'">');
			} else {
				this.input = document.createElement("input");
				this.input.id = this.id;
				this.input.name = this.id;
			}
			this.input.type = "hidden";

			this.img_top.src = axiom.staticPath+'/axiom/images/icon_top.gif';
			this.img_up.src = axiom.staticPath+'/axiom/images/icon_up.gif';
			this.img_down.src = axiom.staticPath+'/axiom/images/icon_down.gif';
			this.img_bottom.src = axiom.staticPath+'/axiom/images/icon_bottom.gif';

            this.toggleSpan = dojo.byId('ax-'+this.id).getElementsByTagName('span')[0];
            this.toggleLink = this.toggleSpan.getElementsByTagName('a')[0];
            if(this.data.length) {
                this.refbody.style.display="block";
            } else {
                this.hideToggle();
            }
			this.writeTable(this.data);

			this.initialArr = [];
			for(var i=0;i<this.data.length;i++) {
				this.initialArr.push(this.data[i][1]);
			}
			this.initialPaths = this.initialArr.join(",");


			this.input.value = this.initialPaths;
			this.tablewrapper.appendChild(this.input);


			dojo.event.kwConnect({
						     srcObj:this.addButton,
						     srcFunc:'onclick',
						     adviceObj:this,
						     adviceFunc:'browse'});
			dojo.event.kwConnect({
						     srcObj:this.img_top,
						     srcFunc:'onclick',
						     adviceObj:this,
						     adviceFunc:'goTop'});
			dojo.event.kwConnect({
						     srcObj:this.img_up,
						     srcFunc:'onclick',
						     adviceObj:this,
						     adviceFunc:'goUp'});
			dojo.event.kwConnect({
						     srcObj:this.img_down,
						     srcFunc:'onclick',
						     adviceObj:this,
						     adviceFunc:'goDown'});
			dojo.event.kwConnect({
						     srcObj:this.img_bottom,
						     srcFunc:'onclick',
						     adviceObj:this,
						     adviceFunc:'goBottom'});
			var widget = this;
			dojo.event.kwConnect({
						     srcObj:this,
						     srcFunc:'update',
						     adviceFunc:function(){axiom.dirtyProps[widget.id]=true;}});

		}
	}
);
