function location(attr_name, props){
	return <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" class="ax-_location" id="ax-_location">
        <div><div class="error_message">hidden error message </div>
        <label for="_location_widget">URL</label>
        <div id="_location_widget">Loading...</div>
        <script type="text/javascript" tal:text="%" talout:text="$"> //<![CDATA[

	dojo.require("axiom.widget.LocationField");
	var loc = dojo.widget.createWidget('axiom:LocationField',
									   {appPath:axiom.appPath,
										initialValue: '${this._parent.getPath()}',
										parentHref:'${this._parent.getURI()}',
										href:'${this.getURI()}.',
										objectId:'${this.id}',
										parentTypes: ${this.parentTypesJSON()}},
									   dojo.byId('_location_widget'));

	//]]></script>
    </div>
		</fieldset>;
}

function dropdown_location(attr_name, props){
	return <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" class="ax-_location" id="ax-_location">
        <div><div class="error_message">hidden error message </div>
        <label for="_location_widget">Location</label>
        <div id="_location_widget">Loading...</div>
        <script type="text/javascript" talout:text="$"> //<![CDATA[

	dojo.require("axiom.widget.DropdownLocationField");
	var loc = dojo.widget.createWidget('axiom:DropdownLocationField',
									   {appPath:'${root.getURI()}.',
										initialValue: '${this._parent.getPath()}',
										parentHref:'${this._parent.getURI()}.',
										href:'${this.getURI()}.',
										paths: ${this.getLocationPaths()},
										objectId:'${this.id}'},
									   dojo.byId('_location_widget'));

	//]]></script>
    </div>
	</fieldset>;
}


function textbox(attr_name, props){
	return <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class': 'ax-textbox ax-'+attr_name, id: 'ax-'+attr_name">
		<div><div class="error_message">hidden error message </div>
		<label tal:attr="'for': attr_name">{(props.widget.required?new XML('<span class="required">*</span>'):'')}{(props.widget.label?new XMLList(props.widget.label.value):'undefined')}</label>
		<input tal:attr="name: attr_name, id: attr_name, 'class': (props.widget.required?'validate-empty':''), 'talout:attr':'value: this.'+attr_name" type="text" />
		</div>
		<script type="text/javascript" tal:text="%"> //<![CDATA[
        dojo.event.kwConnect({ srcObj: dojo.byId('%{attr_name}'),
							   srcFunc: 'onchange',
  							   adviceFunc: function(evt){ axiom.dirtyProps[ evt.target['name'] ] = true; }
  							 });

    //]]></script>

	</fieldset>;
}


function title(attr_name, props){
	var textbox = this.textbox(attr_name, props);
	textbox..input.@onkeyup = "dojo.widget.byNode(dojo.byId('_location').parentNode).populate(this.value)";
	return textbox;
}


function password(attr_name, props){
	var widget = this.textbox(attr_name, props);
	widget..input[0].@type = 'password';
	return widget;
}

function textarea(attr_name, props){
	return <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class': 'ax-textarea ax-'+attr_name, id: 'ax-'+attr_name">
		<div > <div class="error_message">hidden error message</div>
      	<label tal:attr="'for': attr_name">{(props.widget.required?new XML('<span class="required">*</span>'):'')}{(props.widget.label?new XMLList(props.widget.label.value):'undefined')}</label>
		<textarea cols="50" rows="5" tal:attr="id: attr_name, name:attr_name, 'class': (props.widget.required?'validate-empty':''), 'talout:content': 'this.'+attr_name">.</textarea>
		</div>
		<script type="text/javascript" tal:text="%"> //<![CDATA[

    dojo.event.kwConnect({ srcObj: dojo.byId('%{attr_name}'),
		                   srcFunc: 'onchange',
  						   adviceFunc: function(evt){ axiom.dirtyProps[ evt.target['name'] ] = true; }
  						 });

	//]]></script>
	</fieldset>;
}



function multitext(attr_name, props){
	return <fieldset xmlns:talout="http://axiom.com/talout" tal:attr="'class':'ax-multitext ax-'+attr_name, id: 'ax-'+attr_name">
		<div> <div class="error_message">hidden error message</div>
		<label tal:attr="'for': attr_name">{(props.widget.label?new XMLList(props.widget.label.value):'undefined')}</label>
		<textarea cols="50" rows="5" tal:attr="id: attr_name, name: attr_name">
      	<span tal:attr="talout:replace: \"(this.\"+attr_name+\" != null) ? this.\"+attr_name+\".join('\n'):' '\"" />
		</textarea>
		</div>
		<script type="text/javascript" tal:text="%" talout:text="$"> //<![CDATA[

			dojo.event.kwConnect({ srcObj: dojo.byId('%{attr_name}'),
		                   srcFunc: 'onchange',
  						   adviceFunc: function(evt){ axiom.dirtyProps[ evt.target['name'] ] = true; }
  						 });

	//]]></script>
	</fieldset>;
}


function select(attr_name, props){
	return <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class': 'ax-select ax-'+attr_name, id: 'ax-'+attr_name">
		<div> <div class="error_message">hidden error message</div>
		<label tal:attr="'for': attr_name">{(props.widget.required?new XML('<span class="required">*</span>'):'')}{(props.widget.label?new XMLList(props.widget.label.value):null)}</label>
        <select tal:attr="id: attr_name, name: attr_name, 'class': (props.widget.required?'validate-empty':''), 'talout:attr': 'value: this.'+attr_name">
		<option value="">--Choose One--</option>
        <option tal:attr="'talout:repeat':'item: '+(props.widget.list?props.widget.list.value:[]),  'talout:attr': 'value: item[0], selected: (data.item[0]==this.'+attr_name+')?\'true\':undefined'" talout:content="item[1]" />
		</select>
		</div>
     	<script type="text/javascript" tal:text="%" > //<![CDATA[
		dojo.event.kwConnect({ srcObj: dojo.byId('%{attr_name}'),
							   srcFunc: 'onchange',
  							   adviceFunc: function(evt){ axiom.dirtyProps[ evt.target['name'] ] = true; }
  							 });

	//]]></script>
    </fieldset>;
}


function multiselect(attr_name, props){
	var tal = new Namespace('tal','http://axiomstack.com/tale');
	var talout = new Namespace('tal', 'http://axiom.com/talout');

	var widget = this.select(attr_name, props);
	widget..select.@tal::attr = "id: 'multiselect_'+attr_name, name: attr_name, 'class': (props.widget.required?'validate-empty':''), 'talout:attr': 'value this.'+attr_name, onchange: 'window.ms_'+attr_name+'.update(this);axiom.dirtyProps[\\''+attr_name+'\\']=true;'";
	widget..select.@multiple = "true";
	delete widget..option[0];
	widget..select.@talout::attr = props.widget.list?'size: eval('+props.widget.list.value+').length':'';
	widget.div.input += <input type="hidden" tal:attr="id: attr_name, name: attr_name" value="" xmlns:tal="http://axiomstack.com/tale"/>;
	widget.div.script += <script type="text/javascript" tal:text="%" talout:text="$" xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" > //<![CDATA[
    window.ms_%{attr_name} = {
		value:'${this.%{attr_name}}',
		hiddenInput:dojo.byId('%{attr_name}'),
		init:function(){
			var select = dojo.byId('multiselect_%{attr_name}');
			//alert(select);
			var opts = select.getElementsByTagName("option");
			var vals = this.value.split(",");
			for(var i in opts) {
				if(dojo.lang.inArray(vals,opts[i].value)) {
					opts[i].selected = true;
				}
			}
			this.update(select);
		},
		update:function(select){
			var opts = select.getElementsByTagName("option");
			var vals = [];
			for(var i in opts) {
				if(opts[i].selected){
					vals.push(opts[i].value);
				}
			}
			this.value = vals.join(",");
			this.hiddenInput.value = this.value;
		}
	};
    ms_%{attr_name}.init();
    //]]></script>;
	return widget;
}

function checkbox(attr_name, props){
	return <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class': 'ax-checkbox ax-'+attr_name, id: 'ax-'+attr_name">
		<div> <div class="error_message">hidden error message</div>
		<label tal:attr="'for': attr_name+'_cb'">{(props.widget.label?new XMLList(props.widget.label.value):'undefined')}</label>
		<input type="checkbox" class="cb" tal:attr="id: attr_name+'_cb', onclick: 'if(this.checked) dojo.byId(\''+attr_name+'\').value=\'true\'; else dojo.byId(\''+attr_name+'\').value=\'false\'; axiom.dirtyProps[\''+attr_name+'\']=true;', 'tal:attributes':'checked this/'+attr_name"/>
		<input type="hidden" tal:attr="id: attr_name, name: attr_name, 'talout:attr':'value this.'+attr_name+'? true : false'" />
		</div>
		</fieldset>;
}



function radio(attr_name, props){
	return <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout"  tal:attr="'class': 'ax-radio ax-'+attr_name, id: 'ax-'+attr_name">
		<div class="error_message">hidden error message</div>
		<label>{attr_name}</label>
		<div tal:attr="'talout:repeat-content':'item: '+(props.widget.list?props.widget.list.value:'[]')">
		<label tal:attr="'for' : attr_name">
		<input type="radio" class="cb" tal:attr="name: attr_name, 'talout:attr' : 'value: item, id: item, checked: (this.'+attr_name+' == data.item)?\'true\':undefined'" />
		<span talout:replace="item" />
		</label>
		</div>
		<script type="text/javascript" tal:text="%" talout:text="$"> <![CDATA[

                dojo.event.kwConnect({ srcObj: dojo.byId('%{attr_name}'),
									   srcFunc: 'onchange',
  									   adviceFunc: function(evt){ axiom.dirtyProps[ evt.target['name'] ] = true; }
  									 });

		//]]></script>
		</fieldset>;
}

function wysiwyg(attr_name, props){
	return <fieldset xmlns:talout="http://axiom.com/talout" xmlns:tal="http://axiomstack.com/tale" tal:attr="'class': 'ax-wysiwyg ax-'+attr_name, id: 'ax-'+attr_name">
		<div> <div class="error_message">hidden error message</div>
		<label class="wysiwyg-label" tal:attr="'for': attr_name">{(props.widget.required?new XML('<span class="required">*</span>'):'')} {(props.widget.label?new XMLList(props.widget.label.value):'undefined')+' '} <a class="button form-button" tal:attr="onclick: 'axiom.loadFCKInstance(\''+attr_name+'\',\''+(props.widget.width?props.widget.width.value:'')+'\',\''+(props.widget.height?props.widget.height.value:'')+'\',\''+(props.widget.formats?props.widget.formats.value:'')+'\',\''+(props.widget.templates?props.widget.templates.value:'')+'\',\''+(props.widget.styles?props.widget.styles.value:'')+'\',\''+(props.widget.stylesxml?props.widget.stylesxml.value:'')+'\');axiom.dirtyProps[\''+attr_name+'\'] = true;'">Edit</a>
		          </label>
        <iframe tal:attr="id: attr_name+'_preview', 'talout:attr': 'src: this.getURI(\'preview_property?property='+attr_name+'&amp;src_id='+attr_name+'\')'" class="wysiwyg_preview">.</iframe>
        <textarea tal:attr="id: attr_name, name: attr_name, 'class':(props.widget.required?'validate-empty':'')" style="display:none"><span tal:attr="'talout:replace':'this.'+attr_name" /> </textarea>
		<div tal:attr="id: attr_name+'_fckarea'" style="display:none"><textarea tal:attr="id: attr_name+'_fcktext'"><span tal:attr=" 'talout:replace': 'this.'+attr_name" /></textarea></div>
		</div></fieldset>;
}


function calendar(attr_name, props){ // Requires Dojo
	return <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class': 'ax-calendar ax-'+attr_name, id: 'ax-'+attr_name">
		<div> <div class="error_message">hidden error message</div>
		<label tal:attr="'for': attr_name">{(props.widget.required?new XML('<span class="required">*</span>'):'')}{(props.widget.label?new XMLList(props.widget.label.value):'undefined')}</label>
		<div tal:attr="id: attr_name+'_DatePicker'"> <br/> </div>
		<script type="text/javascript" tal:text="%" talout:text="$"> //<![CDATA[

	dojo.require('dojo.widget.DropdownDatePicker');
	var d_%{attr_name} = dojo.widget.createWidget('DropdownDatePicker', {inputName:'%{attr_name}',value:'${this.%{attr_name}}',iconURL:'${app.getStaticMountpoint('axiom/images/icon_date.gif')}', dojo.byId('%{attr_name}_DatePicker'));
	d_%{attr_name}.inputNode.className='%{(props.widget.required?'validate-date':'')}';
    dojo.event.kwConnect({ srcObj:d_%{attr_name},
						   srcFunc: 'onValueChanged',
						   adviceFunc: function(){ axiom.dirtyProps['%{attr_name}'] = true;}
						 });

	d_%{attr_name}.inputNode.onchange= function(){axiom.dirtyProps['%{attr_name}'] = true; }; // catch manual edits
		      //]]></script>
		</div>
		</fieldset>;
}

function time(attr_name, props) {
	return <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class': 'ax-datetime ax-'+attr_name, id: 'ax-'+attr_name">
		<div> <div class="error_message">hidden error message</div>
		<label tal:attr="'for': attr_name">{(props.widget.required?new XML('<span class="required">*</span>'):'')}{(props.widget.label?new XMLList(props.widget.label.value):'undefined')}</label>
		<label tal:attr="'for':'timehour_'+attr_name">Time</label>
    		<select tal:attr="id: 'timehour_'+attr_name">
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="3">3</option>
				<option value="4">4</option>
				<option value="5">5</option>
				<option value="6">6</option>
				<option value="7">7</option>
				<option value="8">8</option>
				<option value="8">9</option>
				<option value="10">10</option>
				<option value="11">11</option>
				<option value="12">12</option>
			</select>
  		    <select tal:attr="id: 'timeminute_'+attr_name">
				<option value="0">:00</option>
				<option value="15">:15</option>
				<option value="30">:30</option>
				<option value="45">:45</option>
			</select>
		    <select tal:attr="id: 'timemeridiem_'+attr_name">
				<option value="AM">AM</option>
				<option value="PM">PM</option>
			</select>
		<input type="hidden" tal:attr="name: attr_name, id: attr_name, 'talout:attr':'value: this'+attr_name, 'class': (props.widget.required?'validate-date':'')"  />
		<script type="text/javascript" tal:text="%" talout:text="$"> //<![CDATA[

    window.time_%{attr_name} = {
				datevalue:null,
				input:dojo.byId('%{attr_name}'),
				init: function(){
					this.datevalue = (this.input.value)?new Date(this.input.value):new Date();
					var hoursSelect = dojo.byId('timehour_%{attr_name}');
					var minutesSelect = dojo.byId('timeminute_%{attr_name}');
					var meridiemSelect = dojo.byId('timemeridiem_%{attr_name}');
					var hours = this.datevalue.getHours();
					var minutes = this.datevalue.getMinutes();
					if(Math.max(hours,12)==hours) {
						meridiemSelect.value = "PM";
						hours -= 12;
					} else { meridiemSelect.value = "AM"; }
					hoursSelect.value = hours == 0 ? 12 : hours;
					minutesSelect.value = minutes;
					hoursSelect.onchange = function(){ time_%{attr_name}.update(true); };
					minutesSelect.onchange = function(){ time_%{attr_name}.update(true); };
					meridiemSelect.onchange = function(){ time_%{attr_name}.update(true); };
					this.update();
				},
				update: function(dirty) {
					if(dirty) axiom.dirtyProps['%{attr_name}'] = true;
					var meridiem = dojo.byId('timemeridiem_%{attr_name}').value;
					var hours = parseInt(dojo.byId('timehour_%{attr_name}').value);
					if(meridiem=="PM"){
						if(hours != 12) hours += 12;
					}
					else if(hours == 12){
						hours = 0;
					}
					var minutes = parseInt(dojo.byId('timeminute_%{attr_name}').value);
					this.datevalue.setHours(hours);
					this.datevalue.setMinutes(minutes);
					dojo.byId('%{attr_name}').value = Date.parse(this.datevalue);
				}
			};
	time_%{attr_name}.init();


			//]]></script>
		</div>
		</fieldset>;
}

function datetime(attr_name, props){ // Requires Dojo
	return <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class': 'ax-datetime ax-'+attr_name, id:'ax-'+attr_name">
		<div> <div class="error_message">hidden error message</div>
		<label tal:attr="'for': attr_name">{(props.widget.required?new XML('<span class="required">*</span>'):'')}{(props.widget.label?new XMLList(props.widget.label.value):'undefined')}</label>
		      <div tal:attr="id: attr_name+'_DateTime'"><br/></div>
		<div>
		<label tal:attr="'for': 'dthour_'+attr_name">Time</label>
		<select tal:attr="id: 'dthour_'+attr_name">
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="3">3</option>
				<option value="4">4</option>
				<option value="5">5</option>
				<option value="6">6</option>
				<option value="7">7</option>
				<option value="8">8</option>
				<option value="8">9</option>
				<option value="10">10</option>
				<option value="11">11</option>
				<option value="12">12</option>
			</select>
		<select tal:attr="id: 'dtminute_'+attr_name">
				<option value="0">:00</option>
				<option value="15">:15</option>
				<option value="30">:30</option>
				<option value="45">:45</option>
			</select>
		<select tal:attr="id: 'dtmeridiem_'+attr_name">
				<option value="AM">AM</option>
				<option value="PM">PM</option>
			</select>
		<select tal:attr="id: 'dttimezone_'+attr_name, name: (props.widget.timezone?props.widget.timezone.value:attr_name+'_timezone'), 'talout:attr':'value: this.'+(props.widget.timezone?props.widget.timezone.value:attr_name+'_timezone')">
				<option value="EST">EST</option>
				<option value="CST">CST</option>
				<option value="MST">MST</option>
				<option value="PST">PST</option>
		</select>
		<input type="hidden" tal:attr="name: attr_name, id: attr_name, 'class': (props.widget.required?'validate-date':''), 'talout:attr': 'value: this.'+attr_name" />
		</div>
		<script type="text/javascript" tal:text="%" talout:text="$"> //<![CDATA[

				dojo.require('dojo.widget.DropdownDatePicker');
				var dt_calendar_%{attr_name} = dojo.widget.createWidget('DropdownDatePicker', {inputName:'',value:'${this.%{attr_name}}',iconURL:'${app.getStaticMountpoint('axiom/images/icon_date.gif')}',displayFormat:'MM/dd/yyyy'}, dojo.byId('%{attr_name}_DateTime'));

				var dt_%{attr_name} = {
					calendar:null,
					datevalue:null,
					initialtimezone:'${this{timezone}}',
					input:dojo.byId('%{attr_name}'),
					init: function(){
						var now = new Date();
						now.setMinutes(0);
						this.datevalue = (this.input.value)?new Date(this.input.value):now;
						dojo.byId('%{attr_name}').value = Date.parse(this.datevalue);
						this.calendar = dt_calendar_%{attr_name};
						var hoursSelect = dojo.byId('dthour_%{attr_name}');
						var minutesSelect = dojo.byId('dtminute_%{attr_name}');
						var meridiemSelect = dojo.byId('dtmeridiem_%{attr_name}');
						var timezoneSelect = dojo.byId('dttimezone_%{attr_name}');
						var hours = this.datevalue.getHours();
						var minutes = this.datevalue.getMinutes();
						if(Math.max(hours,12)==hours) {
							meridiemSelect.value = "PM";
							hours -= 12;
						} else { meridiemSelect.value = "AM"; }
						hoursSelect.value = hours == 0 ? 12 : hours;
						minutesSelect.value = minutes;
						//timezoneSelect.value = this.datevalue.getTimezoneOffset / 60;
						timezoneSelect.value = this.initialtimezone;
						dojo.event.kwConnect({
						     srcObj:this.calendar,
						     srcFunc:'onValueChanged',
						     adviceObj:this,
						     adviceFunc:'update'
						});
						hoursSelect.onchange = function(){ dt_%{attr_name}.update(); };
						minutesSelect.onchange = function(){ dt_%{attr_name}.update(); };
						meridiemSelect.onchange = function(){ dt_%{attr_name}.update(); };
					},
					update: function() {
						var meridiem = dojo.byId('dtmeridiem_%{attr_name}').value;
						var hours = parseInt(dojo.byId('dthour_%{attr_name}').value);
						if(meridiem=="PM"){
							if(hours != 12) hours += 12;
						}
						else if(hours == 12){
							hours = 0;
						}
						var minutes = parseInt(dojo.byId('dtminute_%{attr_name}').value);
						this.datevalue = this.calendar.getDate();
						if(this.datevalue) {
							this.datevalue.setHours(hours);
							this.datevalue.setMinutes(minutes);
							dojo.byId('%{attr_name}').value = Date.parse(this.datevalue);
						}
						axiom.dirtyProps['%{attr_name}'] = true;
					}
				};
				dt_%{attr_name}.init();
                        	dojo.event.kwConnect({ srcObj:dt_calendar_%{attr_name},
						       srcFunc: 'onValueChanged',
						       adviceFunc: function(){ axiom.dirtyProps['%{attr_name}'] = true;}
						     });

		      //]]></script>
		</div>
		</fieldset>;
}

function referenceSingleSelectAuto(attr_name, props){ // Requires Dojo
	return <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class':'ax-refssa ax-'+attr_name, id:'ax-'+attr_name">
		   <div> <div class="error_message">hidden error message</div>
		<label tal:attr="'for':attr_name">{(props.widget.label?new XMLList(props.widget.label.value):'undefined')}</label>
		<div tal:attr="id:attr_name+'_WRSSA'">Loading...</div>
		<script type="text/javascript" tal:text="%" talout:text="$"> //<![CDATA[

			   dojo.require("dojo.widget.Select");
			   window.wrssa_%{attr_name} = dojo.widget.createWidget('Select',
			                           {name:'%{attr_name}',
						   searchType:'startWord',
						    dataUrl:'${this.getURI()}/potentialTargets?path=${this.getURI()}/'+unescape('%%26')+'length=MAX_HITS'+unescape('%%26')+'property=%{attr_name}'+unescape('%%26')+'json=1'},
						   dojo.byId('%{attr_name}_WRSSA'));
			   wrssa_%{attr_name}.setLabel('${this.referenceTitle('%{attr_name}');}');
			   wrssa_%{attr_name}.setValue('${this.referencePath('%{attr_name}');}');

		          dojo.event.kwConnect({ srcObj: window.wrssa_%{attr_name},
										 srcFunc: 'onValueChanged',
										 adviceFunc: function(){axiom.dirtyProps['%{attr_name}'] = true;}
									   });

			 //]]></script>
		  </div>
		</fieldset>;
}

function referenceSingleSelectPopUp(attr_name, props){ // Requires Dojo
	return <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class':'ax-refssp ax-'+attr_name, id:'ax-'+attr_name">
		<div> <div class="error_message">hidden error message</div>
		<label tal:attr="'for':attr_name">{(props.widget.label?new XMLList(props.widget.label.value):'undefined')}</label>
		<div tal:attr="id:attr_name+'_WRSS'">Loading...</div>
		<script type="text/javascript" tal:text="%" talout:text="$"> //<![CDATA[

			dojo.require("axiom.widget.ReferenceSingleSelect");
			window.wrmso_%{attr_name} = dojo.widget.createWidget('axiom:ReferenceSingleSelect',
							 {appPath:'${root.getURI()}/',
							  id:'%{attr_name}',
							  objectHref:'${this.getURI()}/',
							  refPath:'${this.referencePath('%{attr_name}');}',
							  refTitle:'${this.referenceTitle('%{attr_name}');}',
							  targetTypes: ${this.targetTypesJSON('%{attr_name}')}
							 },
							 dojo.byId('%{attr_name}_WRSS'));

		      //]]></script>
		</div>
		</fieldset>;
}

function referenceOrderedMultiSelectPopUp(attr_name, props){ // Requires Dojo
	return <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class':'ax-refomsp ax-'+attr_name, id:'ax-'+attr_name">
		<div> <div class="error_message">hidden error message</div>
			  <div class="label_container">
        <label class="reference" tal:attr="'for':attr_name">{(props.widget.label?new XMLList(props.widget.label.value):'undefined')} <span class="ref-widget-toggle">[<a href="javascript:void(0);" tal:attr="onclick:'dojo.widget.byId(\''+attr_name+'\').toggleVisibility(this)'">Show</a>]</span></label>
		<a href="javascript:void(0);" class="button form-button" tal:attr="id:'refomsp_add_'+attr_name">ADD...</a>
			  </div>
		<div tal:attr="id:attr_name+'_WRMSO'">Loading...</div>
		<script type="text/javascript" tal:text="%" talout:text="$"> //<![CDATA[

			 dojo.require("axiom.widget.ReferenceOrderedMultiSelect");
			 var wrmso_%{attr_name} = dojo.widget.createWidget('axiom:ReferenceOrderedMultiSelect', {
											 appPath:'${root.getURI()}/',
											 id:'%{attr_name}',
											 addButton:dojo.byId('refomsp_add_%{attr_name}'),
											 objectHref:'${this.getURI()}/',
											 data:${javascript: this.multiValueJSON('%{attr_name}');},
											 targetTypes: ${this.targetTypesJSON('%{attr_name}')}
										 },
										 dojo.byId('%{attr_name}_WRMSO'));

		       //]]></script>
		</div>
	      </fieldset>;
}

function referenceMultiSelectChecked(attr_name, props){
	return <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class':'ax-refmsc ax-'+attr_name, id:'ax-'+attr_name">
	            <div> <div class="error_message">hidden error message</div>
 		<label tal:attr="'for':attr_name">{(props.widget.required?new XML('<span class="required">*</span>'):'')}{(props.widget.label?new XMLList(props.widget.label.value):'undefined')}</label>
		<div tal:attr="id:attr_name+'_WMSC'">Loading...</div>
		<script type="text/javascript" tal:text="^" talout:text="$"> //<![CDATA[

	dojo.require("axiom.widget.ReferenceMultiSelectChecked");
	var wrssa_^{attr_name} = dojo.widget.createWidget('axiom:ReferenceMultiSelectChecked',
		{
			name:'^{attr_name}',
			id:'^{attr_name}',
			required:^{props.widget.required?props.widget.required.value:'false'},
			initialValue:'${this.multiValueJSON('^{attr_name}');}',
			dataUrl:'${this.getURI()}/potentialTargets?path=${this.getURI()}/'+unescape('%26')+'property=^{attr_name}'+unescape('%26')+'json=1'+unescape('%26')+'context=referenceWidget'},
													  dojo.byId('^{attr_name}_WMSC'));

			 //]]></script>
		    </div>
		</fieldset>;
}

function assetselect(attr_name, props){
	return <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class':'ax-assetselect ax-'+attr_name, id:'ax-'+attr_name">
	             <div> <div class="error_message">hidden error message</div>
		<label tal:attr="'for':attr_name">{(props.widget.required?new XML('<span class="required">*</span>'):'')}{(props.widget.label?new XMLList(props.widget.label.value):'undefined')}</label>
		<div tal:attr="id:attr_name+'_WAS'">Loading...</div>
		<script type="text/javascript" tal:text="%" talout:text="$"> //<![CDATA[

			       dojo.require("axiom.widget.AssetSelector");
			       var was_%{attr_name} = dojo.widget.createWidget('axiom:AssetSelector',
						       {appPath:'${root.getURI()}/',
					            id:'%{attr_name}',
	  						    objectId:'${this._accessvalue}',
		      					required:%{props.widget.required?props.widget.required.value:'false'},
				     			refPath:'${this.referencePath('%{attr_name}');}',
						    	refTitle:'${this.referenceTitle('%{attr_name}');}',
							    assetType:'%{props.widget.assettype?props.widget.assettype.value:'All'}',
							    objectUrl:'${this.%{attr_name}.getTarget().getURI()}/',
					            objectData:${this.%{attr_name}.getTarget().getAssetObject()}
						       },
						       dojo.byId('%{attr_name}_WAS'));

		     //]]></script>
		     </div>
		</fieldset>;
}

function textboxcounter(attr_name, props){
	return <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class':'ax-textboxcounter ax-'+attr_name, id:'ax-'+attr_name">
	           <div> <div class="error_message">hidden error message</div>
		<label tal:attr="'for':attr_name">{(props.widget.required?new XML('<span class="required">*</span>'):'')}{(props.widget.label?new XMLList(props.widget.label.value):'undefined')}</label>
		<input type="text" tal:attr="id:attr_name, name:attr_name, maxlength: (props.widget.maxchars || 20), onkeypress:'tbc'+attr_name+'.update()', 'talout:attr': 'value: this'+attr_name,  'class':(props.widget.required?'validate-empty':'')"/>
		<div class="counter"><span tal:attr="id: 'count-'+attr_name">{(props.widget.maxchars.value || 20)}</span>&#160;Characters Remaining</div>
		<script type="text/javascript" tal:text="%"> //<![CDATA[

			   window.tbc%{attr_name} = {
			       countTag: dojo.byId('%{"count-"+attr_name}'),
				   inTag: dojo.byId('%{"ax-"+attr_name}').getElementsByTagName("input")[0],
				   maxChars: %{props.widget.maxchars.value || 20},
				   update: function() {
				       this.countTag.innerHTML = this.maxChars - this.inTag.value.length;
				       axiom.dirtyProps['%{attr_name}'] = true;
				   }
			  };
			  tbc%{attr_name}.countTag.innerHTML = tbc%{attr_name}.maxChars - tbc%{attr_name}.inTag.value.length;

			 //]]></script>
		   </div>
		 </fieldset>;
}

function textareacounter(attr_name, props){
	return <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class':'ax-textareacounter ax-'+attr_name, id:'ax-'+attr_name" tal:var="maxchars: (props.widget.maxchars? props.widget.maxchars.value: 100)">
			 <div> <div class="error_message">hidden error message</div>
		<label tal:attr="'for': attr_name">{(props.widget.required?new XML('<span class="required">*</span>'):'')}{(props.widget.label?new XMLList(props.widget.label.value):'undefined')}</label>
		<textarea cols="50" rows="5" tal:attr="id:attr_name, name:attr_name, onkeyup:'tac'+attr_name+'.update()', 'class':(props.widget.required?'validate-empty validate-length-'+maxchars:'validate-length-'+maxchars)"> <span tal:attr="'talout:replace':'this.'+attr_name+"/> </textarea>
		<div class="counter"><span tal:attr="id:'count-'+attr_name" tal:content="maxchars"> </span>&#160;Characters Remaining</div>
		<script type="text/javascript" tal:text="%" talout:text="$"> //<![CDATA[

			       		window.tac%{attr_name} = {
						countTag: dojo.byId('%{"count-"+attr_name}'),
						taTag: dojo.byId('%{"ax-"+attr_name}').getElementsByTagName("textarea")[0],
						maxChars: %{maxchars},
						update: function() {
							var a=this.taTag.value.length,b=this.maxChars;
        					//if(Math.max(a,b)==a) { this.taTag.value = this.taTag.value.substring(0,b); }
							var remaining = this.maxChars - a;
							if(Math.max(remaining,0)==remaining){
								this.countTag.innerHTML = remaining;
							} else { this.countTag.innerHTML = "0"; }
							axiom.dirtyProps['%{attr_name}'] = true;
						}
					};
					tac%{attr_name}.countTag.innerHTML = tac%{attr_name}.maxChars - tac%{attr_name}.taTag.value.length;

				//]]></script>
			</div>
		</fieldset>;
}

function tags(attr_name, props){
    return <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class':'ax-tags ax-'+attr_name, id:'ax-'+attr_name">
              <div> <div class="error_message">hidden error message</div>
	          <div talout:var="window_id: this.id+'_window'" class="tags">
		<label tal:attr="'for':attr_name">{(props.widget.label?new XMLList(props.widget.label.value):'undefined')}</label>
		      <textarea name="tags" talout:attr="id: this.id+'_tags'" talout:content="this.getTagString()"> </textarea>
		      <div class="tag_button"><img talout:attr="onclick: 'axiom.tags.toggleWindow(\''+window_id+'\'), src: app.getStaticMountpoint('axiom/images/tag.gif')" />
		      <span talout:var="input_id: this.id+'_tags'" talout:replace="this.list_tags(data)"/> </div>
		     </div>
		</div>
	      </fieldset>;
}

function urlselect(attr_name, props){
	var markup = <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class':'ax-urlselect ax-'+attr_name, id:'ax-'+attr_name">
			 <div> <div class="error_message">hidden error message</div>
		<label tal:attr="'for':attr_name">{(props.widget.required?new XML('<span class="required">*</span>'):'')}{(props.widget.label?new XMLList(props.widget.label.value):'undefined')}</label>
		<input type="text" tal:attr="id:attr_name, name:attr_name, 'talout:attr': 'value: this.'+attr_name, onchange:'axiom.dirtyProps[\''+attr_name+'\']=true', 'class':(props.widget.required?'validate-empty':'')"/> <img tal:attr="id:'icon_'+attr_name, onclick:'urlselect'+attr_name+'.open();', 'talout:attr':'src: app.getStaticMountpoint(\'axiom/images/icon_link.gif\')'" /> <a href="javascript:void(0);" class="button form-button" tal:attr="onclick:'urlselect'+attr_name+'.clear();'">Clear</a>
		<script type="text/javascript" tal:text="%" talout:text="$"> //<![CDATA[

				window.urlselect%{attr_name} = {
					host:'${root.getURI()}/',
					clear:function() {
						dojo.byId('%{attr_name}').value = '';
						axiom.dirtyProps['%{attr_name}'] = true;
					},
					open:function() {
						axiom.browsetable.multiple = false;
						axiom.browsetable.property = '%{attr_name}';
						axiom.browsetable.defaultValue = '${this.%{attr_name}}';
						axiom.browsetable.defaultValues = [];
						axiom.browsetable.setCallBack = function(a,b){
							var url = b[1].uri;
							dojo.byId('%{attr_name}').value = url;
							axiom.dirtyProps['%{attr_name}'] = true;
						}
						axiom.browsetable.exitCallBack = function(){axiom.browsemodal.hide();}
						axiom.browsetable.callingWidget = this;
						axiom.browsetable.searchURL = '/' + axiom.ctable.searchURL;
						axiom.browsetable.setContext('urlselect');
						axiom.browsetable.toggleHrefValues();
						axiom.browsecfilter.setTargetTypes({'All': []});
						axiom.browsecfilter.search();
						axiom.browsemodal.show();
					}
				};

				//]]></script>
			</div>
		</fieldset>;
	if(props.widget.internal && props.widget.internal.value=="true") {
		markup..input[0].@readonly = "true";
	}
	return markup;
}
