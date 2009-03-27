/**
 * Axiom Content Management System (CMS)
 * Copyright (C) 2009 Axiom Software Inc.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307
 * USA or contact Axiom Software Inc., 11480 Commerce Park Drive,
 * Third Floor, Reston, VA 20191 USA or email:
 * info@axiomsoftwareinc.com
 * */


/**
*/

dojo.provide("axiom.widget.ReferenceMultiSelectChecked");

dojo.require("dojo.lang.common");
dojo.require("dojo.html.*");
dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");

dojo.widget.defineWidget(
	"axiom.widget.ReferenceMultiSelectChecked",
	dojo.widget.HtmlWidget,
	function(){},
	{
		name:'',
		dataUrl:'',
		initialValue:'',
		initialArr:null,
		initialPaths:'',
		potentialRefs:null,
		checkboxes:null,
		input:null,
		required:null,

		createInputs:function() {
			var widgetRef = this;
			this.domNode.innerHTML = "";
			this.checkboxes = [];
			for(var i=0;i<this.potentialRefs.length;i++) {
				var div = document.createElement("div");
				this.checkboxes[i] = document.createElement("input");
				this.checkboxes[i].type = "checkbox";
				this.checkboxes[i].className = "cb";
				this.checkboxes[i].id = this.name + "_" + i;
				this.checkboxes[i].value = this.potentialRefs[i][1];
				this.checkboxes[i].onclick = function() { widgetRef.update(); };
				var tmplabel = document.createElement("label");
				tmplabel.setAttribute("for",this.name + "_" + i);
				tmplabel.innerHTML = this.potentialRefs[i][0];
				div.appendChild(this.checkboxes[i]);
				div.appendChild(tmplabel);
				this.domNode.appendChild(div);
				if(dojo.lang.inArray(this.initialArr,this.potentialRefs[i][1])) { 
					this.checkboxes[i].checked="true";
				}
			}
			this.domNode.appendChild(this.input);
		},

		update:function() {
			var refArr = [];
			for (var i=0;i<this.checkboxes.length;i++) {
				if(this.checkboxes[i].checked) {
					refArr.push(this.checkboxes[i].value);
				}
			}
			this.input.value = refArr.join(",");
			axiom.dirtyProps[this.name] = true;
		},
		toggleVisibility: function(elem){
			if(elem.innerHTML == "Hide"){
				elem.innerHTML = "Show";
				this.hide();
			}
			else{
				elem.innerHTML = "Hide";
				this.show();
			}
				
		},
		initialize:function(){
			var widget = this;
			var div = this.domNode;
			var name = this.name;
			dojo.io.bind({
				url:this.dataUrl,
				method:"GET",
				mimetype:"text/json",
				preventCache:true,
				load:function(type,data,evt){
					widget.potentialRefs = data;
					widget.createInputs();
				}
			});
			var tmpArr = eval(this.initialValue);
			this.initialArr = [];
			for(var i=0;i<tmpArr.length;i++) {
				this.initialArr.push(tmpArr[i][1]);
			}
			this.initialPaths = this.initialArr.join(",");
			if(dojo.render.html.ie) { // Can't set name attribute in IE
				this.input = document.createElement("<input name='"+this.name+"'>");
			} else {
				this.input = document.createElement("input");
				this.input.name = this.name;
			}
			this.input.type = "hidden";
			if(this.required) { this.input.className = "validate-empty"; }
			this.input.value = this.initialPaths;
			
		}
	}
);
