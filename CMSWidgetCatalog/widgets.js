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

function info_label(attr_name, props, label, desc, added_label_html, after_label_html) {
    return <div xmlns:tal="http://axiomstack.com/tale">
        <div class="info_label">
	    <label tal:attr="'for':attr_name">{(props.widget.required?new XML('<span class="required">*</span>'):'')}{label}</label>
	    {(added_label_html||'')}
	    <span tal:if="props.widget" class="info_toggle" tal:attr="id: 'info_toggle_'+attr_name"><img src="/static/axiom/images/icon_info.gif" /></span>

	    {(after_label_html||'')}
	</div>
	<div tal:if="props.widget" tal:attr="id: 'info_'+attr_name" class="info">
	    <p tal:attr="id: 'info_desc_'+attr_name" class="info_desc"><strong>Definition:</strong> {desc}</p>
	<span tal:omit="true" tal:if="props.widget.info">
	    <p tal:if="props.widget.info.value" tal:attr="id: 'info_note_'+attr_name" class="info_note"><strong>Notes:</strong> <span tal:replace="new XHTML(props.widget.info.value)" /></p>
	</span>
	<span tal:omit="true" tal:if="props.widget.info_img">
	    <p tal:if="props.widget.info_img.value" tal:attr="id: 'info_img_'+attr_name" class="info_img"><strong>Image:</strong> <img  tal:attr="src: props.widget.info_img.value" /></p>
	</span>
	</div>
	<script tal:text="%" type="text/javascript">//<![CDATA[
	    dojo.require("axiom.widget.Info");
	    var info = dojo.widget.createWidget('axiom:Info', {
						    id: 'info_%{attr_name}'
						},
						dojo.byId('info_%{attr_name}')
					       );
	    dojo.event.kwConnect({ srcObj:dojo.byId('info_toggle_%{attr_name}'),
		srcFunc:'onclick',
		adviceObj:info,
		adviceFunc:'toggleInfo'});
	    //]]></script>
    </div>;
}

function location(attr_name, props){
	var ret = <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" class="ax-_location" id="ax-_location">
        <div><div class="error_message">hidden error message </div>
	<div class="info_box"> </div>
        <div id="_location_widget">Loading...</div>
        <script type="text/javascript" tal:text="%" talout:text="$"> //<![CDATA[

	dojo.require("axiom.widget.LocationField");
	var loc = dojo.widget.createWidget('axiom:LocationField',
									   {appPath:axiom.appPath,
										initialValue: '${this._parent.getPath()}',
										parentHref:'${this._parent.getURI()}',
										href:'${this.getURI()}/',
										objectId:'${this.id}',
										parentTypes: ${this.parentTypesJSON()}},
									   dojo.byId('_location_widget'));

	//]]></script>
    </div>
	<p class="note">Once this field is set, saving the page will publish it live.</p>
	</fieldset>;

    ret..div.(@['class'] == 'info_box').appendChild(this.info_label(attr_name, props, 'URL', 'This is the location field. You can set the url of your page by changing the values here.'));

    return ret;
}

function dropdown_location(attr_name, props){
	var ret = <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" class="ax-_location" id="ax-_location">
        <div><div class="error_message">hidden error message </div>
	<div class="info_box"> </div>
        <div id="_location_widget">Loading...</div>
        <script type="text/javascript" talout:text="$"> //<![CDATA[

	dojo.require("axiom.widget.DropdownLocationField");
	var loc = dojo.widget.createWidget('axiom:DropdownLocationField',
									   {appPath:'${root.getURI()}/',
										initialValue: '${this._parent.getPath()}',
										parentHref:'${this._parent.getURI()}/',
										href:'${this.getURI()}/',
										paths: ${this.getLocationPaths()},
										objectId:'${this.id}'},
									   dojo.byId('_location_widget'));

	//]]></script>
    </div>
	</fieldset>;

    ret..div.(@['class'] == 'info_box').appendChild(this.info_label(attr_name, props, 'Location', 'This is the location field. You can set the url of your page by changing the values here.'));

    return ret;
}


function textbox(attr_name, props, desc){
	var ret = <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class': 'ax-textbox ax-'+attr_name, id: 'ax-'+attr_name">
		<div><div class="error_message">hidden error message </div>
		<div class="info_box"> </div>
		<input tal:attr="name: attr_name, id: attr_name, 'class': (props.widget.required?'validate-empty':''), 'talout:attr':'value: this.'+attr_name" type="text" />
		</div>
		<script type="text/javascript" tal:text="%"> //<![CDATA[
        dojo.event.kwConnect({ srcObj: dojo.byId('%{attr_name}'),
							   srcFunc: 'onchange',
  							   adviceFunc: function(evt){ axiom.dirtyProps[ evt.target['name'] ] = true; }
  							 });

    //]]></script>

	</fieldset>;

    ret..div.(@['class'] == 'info_box').appendChild(this.info_label(attr_name, props, (props.widget.label?new XMLList(props.widget.label.value):'undefined'), (desc||'You have the ability to enter any text you want within this field.')));

    return ret;
}


function title(attr_name, props){
    var textbox = this.textbox(attr_name, props, 'This is the title of the page. The title of the page has great significance throughout most web sites. The title is used throughout Axiom CMS for identification. Also, most developers use the title but within the page templates. This means that you should always fill out this field.');
	textbox..input.@onkeyup = "dojo.widget.byNode(dojo.byId('_location').parentNode).populate(this.value)";
	return textbox;
}


function password(attr_name, props){
	var widget = this.textbox(attr_name, props, 'This textfield is set to accept passwords.');
	widget..input[0].@type = 'password';
	return widget;
}

function textarea(attr_name, props){
	var ret = <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class': 'ax-textarea ax-'+attr_name, id: 'ax-'+attr_name">
		<div > <div class="error_message">hidden error message</div>
		<div class="info_box"> </div>
		<textarea cols="50" rows="5" tal:attr="id: attr_name, name:attr_name, 'class': (props.widget.required?'validate-empty':''), 'talout:content': 'this.'+attr_name+'|| \'\''"></textarea>
		</div>
		<script type="text/javascript" tal:text="%"> //<![CDATA[

    dojo.event.kwConnect({ srcObj: dojo.byId('%{attr_name}'),
		                   srcFunc: 'onchange',
  						   adviceFunc: function(evt){ axiom.dirtyProps[ evt.target['name'] ] = true; }
  						 });

	//]]></script>
	</fieldset>;


    ret..div.(@['class'] == 'info_box').appendChild(this.info_label(attr_name, props, (props.widget.label?new XMLList(props.widget.label.value):'undefined'), 'This larger area can accept any type of text. Sometimes it is used to format specific information so be sure to read the Notes section for more information.'));

    return ret;
}



function multitext(attr_name, props){
	var ret = <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class':'ax-multitext ax-'+attr_name, id: 'ax-'+attr_name">
		<div> <div class="error_message">hidden error message</div>
		<div class="info_box"> </div>
		<textarea cols="50" rows="5" tal:attr="id: attr_name, name: attr_name">
      	<span tal:attr=" 'talout:replace' : '(this.'+attr_name+' != null) ? this.'+attr_name+'.join(\'\\n\') : \'\''" />
		</textarea>
		</div>
		<script type="text/javascript" tal:text="%" talout:text="$"> //<![CDATA[

			dojo.event.kwConnect({ srcObj: dojo.byId('%{attr_name}'),
		                   srcFunc: 'onchange',
  						   adviceFunc: function(evt){ axiom.dirtyProps[ evt.target['name'] ] = true; }
  						 });

	//]]></script>
	</fieldset>;

    ret..div.(@['class'] == 'info_box').appendChild(this.info_label(attr_name, props, (props.widget.label?new XMLList(props.widget.label.value):'undefined'), 'This area is a special kind of text area. You should enter information such that it is one bit of information per line.'));

    return ret;
}


function select(attr_name, props, desc){
	var ret = <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class': 'ax-select ax-'+attr_name, id: 'ax-'+attr_name">
		<div> <div class="error_message">hidden error message</div>
		<div class="info_box"> </div>
        <select tal:attr="id: attr_name, name: attr_name, 'class': (props.widget.required?'validate-empty':''), 'talout:attr': 'value: this.'+attr_name">
		<option value="">--Choose One--</option>
        <option tal:attr="'talout:repeat':'item: '+(props.widget.list?props.widget.list.value:'[[\'No values given\', \'No values given.\']]'),  'talout:attr': 'value: item[0], selected: (data.item[0]==this.'+attr_name+')?\'true\':undefined'" talout:content="item[1]" />
		</select>
		</div>
     	<script type="text/javascript" tal:text="%" > //<![CDATA[
		dojo.event.kwConnect({ srcObj: dojo.byId('%{attr_name}'),
							   srcFunc: 'onchange',
  							   adviceFunc: function(evt){ axiom.dirtyProps[ evt.target['name'] ] = true; }
  							 });

	//]]></script>
    </fieldset>;

    ret..div.(@['class'] == 'info_box').appendChild(this.info_label(attr_name, props, (props.widget.label?new XMLList(props.widget.label.value):'undefined'), (desc||'This is a dropdown area that lets you specify some specific option.')));

    return ret;
}


function multiselect(attr_name, props){
	var tal = new Namespace('tal','http://axiomstack.com/tale');
	var talout = new Namespace('tal', 'http://axiom.com/talout');

    var widget = this.select(attr_name, props, 'This select area allows you to select multiple items. You can do so by pressing the Ctrl key and click on a couple of items. If you are on a Mac then use the Cmd key.');
	widget..select.@tal::attr = "id: 'multiselect_'+attr_name, name: attr_name, 'class': (props.widget.required?'validate-empty':''), 'talout:attr': 'value: this.'+attr_name, onchange: 'window.ms_'+attr_name+'.update(this);axiom.dirtyProps[\\''+attr_name+'\\']=true;'";
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
	var ret = <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class': 'ax-checkbox ax-'+attr_name, id: 'ax-'+attr_name">
		<div> <div class="error_message">hidden error message</div>
		<div class="info_box"> </div>
		<input type="checkbox" class="cb" tal:attr="id: attr_name+'_cb', onclick: 'if(this.checked) dojo.byId(\''+attr_name+'\').value=\'true\'; else dojo.byId(\''+attr_name+'\').value=\'false\'; axiom.dirtyProps[\''+attr_name+'\']=true;', 'tal:attr':'checked this.'+attr_name"/>
		<input type="hidden" tal:attr="id: attr_name, name: attr_name, 'talout:attr':'value: this.'+attr_name+'? true : false'" />
		</div>
		</fieldset>;

    ret..div.(@['class'] == 'info_box').appendChild(this.info_label(attr_name+'_cb', props, (props.widget.label?new XMLList(props.widget.label.value):'undefined'), 'By checking this field you are toggling some functionality within your website.'));

    return ret;
}



function radio(attr_name, props){
	var ret = <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout"  tal:attr="'class': 'ax-radio ax-'+attr_name, id: 'ax-'+attr_name">
		<div class="error_message">hidden error message</div>
		<div class="info_box"> </div>
		<div tal:attr="'talout:repeat-content':'item: '+(props.widget.list?props.widget.list.value:'[]')">
		<input type="radio" class="cb" tal:attr="name: attr_name, 'talout:attr' : 'value: item, id: \''+attr_name+'_\'+item, checked: (this.'+attr_name+' == data.item)?\'true\':undefined'" />
		<label tal:attr="'talout:attr' : '\'for\' : \''+attr_name+'_\'+item'"><span talout:replace="item" /></label>
		<script type="text/javascript" tal:text="%" talout:text="$">//<![CDATA[
                dojo.event.kwConnect({ srcObj: dojo.byId('%{attr_name}_${item}'),
									   srcFunc: 'onchange',
  									   adviceFunc: function(evt){ axiom.dirtyProps[ evt.target['name'] ] = true; }
  									 });

		//]]></script>
		</div>
		</fieldset>;

    ret..div.(@['class'] == 'info_box').appendChild(this.info_label(attr_name, props, (props.widget.label?new XMLList(props.widget.label.value):'undefined'), 'By specifying one of the options you are setting an option to the selected value.'));

    return ret;
}

function wysiwyg(attr_name, props){
	var ret = <fieldset xmlns:talout="http://axiom.com/talout" xmlns:tal="http://axiomstack.com/tale" tal:attr="'class': 'ax-wysiwyg ax-'+attr_name, id: 'ax-'+attr_name">
	    <div> <div class="error_message">hidden error message</div>
	    <div class="wysiwyg-label">
		<div class="info_box"> </div>
	    </div>
        <iframe tal:attr="id: attr_name+'_preview', 'talout:attr': 'src: this.getURI(\'preview_property?property='+attr_name+'\u0026src_id='+attr_name+'\')'" class="wysiwyg_preview"></iframe>
        <textarea tal:attr="id: attr_name, name: attr_name, 'class':(props.widget.required?'validate-empty':'')" style="display:none"><span tal:attr="'talout:replace':'(this.'+attr_name+'||\'\')'" /></textarea>
		<div tal:attr="id: attr_name+'_fckarea'" style="display:none"><textarea tal:attr="id: attr_name+'_fcktext'"><span tal:attr="'talout:replace': 'this.'+attr_name+'||\'\''" /></textarea></div>
		</div></fieldset>;

    ret..div.(@['class'] == 'info_box').appendChild(this.info_label(attr_name, props, (props.widget.label?new XMLList(props.widget.label.value):'undefined'), 'This area is a wysiwyg (What You See Is What You Get). It allows you to type text, select images, and format your information without having to write HTML. To get started with the wysiwyg, click the EDIT button above.', <a xmlns:tal="http://axiomstack.com/tale" class="button form-button" tal:attr="id: attr_name+'_toggle',onclick: 'axiom.toggleFCKInstance(\''+attr_name+'\',\''+(props.widget.width?props.widget.width.value:'')+'\',\''+(props.widget.height?props.widget.height.value:'')+'\',\''+(props.widget.formats?props.widget.formats.value:'')+'\',\''+(props.widget.templates?props.widget.templates.value:'')+'\',\''+(props.widget.styles?props.widget.styles.value:'')+'\',\''+(props.widget.stylesxml?props.widget.stylesxml.value:'')+'\');axiom.dirtyProps[\''+attr_name+'\'] = true;'">Edit</a>));

    return ret;
}


function calendar(attr_name, props){ // Requires Dojo
	var ret = <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class': 'ax-calendar ax-'+attr_name, id: 'ax-'+attr_name">
		<div> <div class="error_message">hidden error message</div>
		<div class="info_box"> </div>
		<div tal:attr="id: attr_name+'_DatePicker'"> <br/> </div>
		<script type="text/javascript" tal:text="%" talout:text="$"> //<![CDATA[

	dojo.require('dojo.widget.DropdownDatePicker');
	var d_%{attr_name} = dojo.widget.createWidget('DropdownDatePicker', {inputName:'%{attr_name}',value:${(this.%{attr_name} || new Date()).getTime()},iconURL:'${app.getStaticMountpoint('axiom/images/icon_date.gif')}'}, dojo.byId('%{attr_name}_DatePicker'));
	d_%{attr_name}.inputNode.className='%{(props.widget.required?'validate-date':'')}';
    dojo.event.kwConnect({ srcObj:d_%{attr_name},
						   srcFunc: 'onValueChanged',
						   adviceFunc: function(){ axiom.dirtyProps['%{attr_name}'] = true;}
						 });

	d_%{attr_name}.inputNode.onchange= function(){axiom.dirtyProps['%{attr_name}'] = true; }; // catch manual edits
		      //]]></script>
		</div>
		</fieldset>;

    ret..div.(@['class'] == 'info_box').appendChild(this.info_label(attr_name, props, (props.widget.label?new XMLList(props.widget.label.value):'undefined'), 'The calendar allows you to set a field to a Date.'));

    return ret;
}

function time(attr_name, props) {
	var ret = <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class': 'ax-datetime ax-'+attr_name, id: 'ax-'+attr_name">
		<div> <div class="error_message">hidden error message</div>
		<div class="info_box"> </div>
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
		<input type="hidden" tal:attr="name: attr_name, id: attr_name, 'talout:attr':'value: (this.'+attr_name+' || new Date()).getTime()', 'class': (props.widget.required?'validate-date':'')"  />
		<script type="text/javascript" tal:text="%" talout:text="$"> //<![CDATA[

    window.time_%{attr_name} = {
				datevalue:null,
				input:dojo.byId('%{attr_name}'),
				init: function(){
					this.datevalue = new Date(parseInt(this.input.value,10));
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

    ret..div.(@['class'] == 'info_box').appendChild(this.info_label(attr_name, props, (props.widget.label?new XMLList(props.widget.label.value):'undefined'), 'With this area you can specify a Time value for the field.'));

    return ret;
}

function datetime(attr_name, props){ // Requires Dojo
	return <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class': 'ax-datetime ax-'+attr_name, id:'ax-'+attr_name">
		<div> <div class="error_message">hidden error message</div>
		<div class="info_box"> </div>
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
		<input type="hidden" tal:attr="name: attr_name, id: attr_name, 'class': (props.widget.required?'validate-date':''), 'talout:attr': 'value: (this.'+attr_name+'||new Date()).getTime()'" />
		</div>
		<script type="text/javascript" tal:text="%" talout:text="$"> //<![CDATA[

				dojo.require('dojo.widget.DropdownDatePicker');
				var dt_calendar_%{attr_name} = dojo.widget.createWidget('DropdownDatePicker', {inputName:'',value:${(this.%{attr_name}|| new Date()).getTime()},iconURL:'${app.getStaticMountpoint('axiom/images/icon_date.gif')}',displayFormat:'MM/dd/yyyy'}, dojo.byId('%{attr_name}_DateTime'));

				var dt_%{attr_name} = {
					calendar:null,
					datevalue:null,
					initialtimezone:'${this.timezone}',
					input:dojo.byId('%{attr_name}'),
					init: function(){
						var now = new Date();
						now.setMinutes(0);
						this.datevalue = (this.input.value)?new Date(parseInt(this.input.value,10)):now;
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

    ret..div.(@['class'] == 'info_box').appendChild(this.info_label(attr_name, props, (props.widget.label?new XMLList(props.widget.label.value):'undefined'), 'This area allows you to set both a Date and Time.'));

    return ret;
}

function referenceSingleSelectAuto(attr_name, props){ // Requires Dojo
	var ret = <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class':'ax-refssa ax-'+attr_name, id:'ax-'+attr_name">
		   <div> <div class="error_message">hidden error message</div>
		<div class="info_box"> </div>
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

    ret..div.(@['class'] == 'info_box').appendChild(this.info_label(attr_name, props, (props.widget.label?new XMLList(props.widget.label.value):'undefined'), 'This field allows to type the title of what you are looking for an tries to help you select it. This connects this page with some other page inside your website.'));

    return ret;
}

function referenceSingleSelectPopUp(attr_name, props){ // Requires Dojo
	var ret = <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class':'ax-refssp ax-'+attr_name, id:'ax-'+attr_name">
		<div> <div class="error_message">hidden error message</div>
		<div class="info_box"> </div>
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

    ret..div.(@['class'] == 'info_box').appendChild(this.info_label(attr_name, props, (props.widget.label?new XMLList(props.widget.label.value):'undefined'), 'This field allows you to select a page that you would like to connect this page with from a dialog. You have the ability to search your website within that dialog.'));

    return ret;
}

function referenceOrderedMultiSelectPopUp(attr_name, props){ // Requires Dojo
	var ret = <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class':'ax-refomsp ax-'+attr_name, id:'ax-'+attr_name">
		<div> <div class="error_message">hidden error message</div>
		    <div class="label_container">
			<div class="info_box"> </div>
		    </div>
		<div tal:attr="id:attr_name+'_WRMSO'">Loading...</div>
		<script type="text/javascript" tal:text="%" talout:text="$"> //<![CDATA[

			 dojo.require("axiom.widget.ReferenceOrderedMultiSelect");
			 var wrmso_%{attr_name} = dojo.widget.createWidget('axiom:ReferenceOrderedMultiSelect', {
											 appPath:'${root.getURI()}/',
											 id:'%{attr_name}',
											 addButton:dojo.byId('refomsp_add_%{attr_name}'),
											 objectHref:'${this.getURI()}/',
											 data:${this.multiValueJSON('%{attr_name}');},
											 targetTypes: ${this.targetTypesJSON('%{attr_name}')}
										 },
										 dojo.byId('%{attr_name}_WRMSO'));

		       //]]></script>
		</div>
	      </fieldset>;

    ret..div.(@['class'] == 'info_box').appendChild(this.info_label(attr_name, props, (props.widget.label?new XMLList(props.widget.label.value):'undefined'), 'This allows you to connect multiple pages with this page through a dialog. You have the ability to search your website within that dialog.', <span xmlns:tal="http://axiomstack.com/tale" class="ref-widget-toggle" style="margin-left:5px;float:left;">[<a href="javascript:void(0);" tal:attr="onclick:'dojo.widget.byId(\''+attr_name+'\').toggleVisibility(this)'">Show</a>]</span>, <a href="javascript:void(0);" class="button form-button" tal:attr="id:'refomsp_add_'+attr_name" xmlns:tal="http://axiomstack.com/tale">ADD...</a>));

    return ret;
}

function referenceMultiSelectChecked(attr_name, props){
	var ret = <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class':'ax-refmsc ax-'+attr_name, id:'ax-'+attr_name">
	            <div> <div class="error_message">hidden error message</div>
		<div class="info_box"> </div>
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
        ret..div.(@['class'] == 'info_box').appendChild(this.info_label(attr_name, props, (props.widget.label?new XMLList(props.widget.label.value):'undefined'), 'This allows you to connect multiple pages with this page through a set of checkboxes. By selecting one of the items, a connection will be made to that page.'));

    return ret;
}

function assetselect(attr_name, props){
	var ret = <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class':'ax-assetselect ax-'+attr_name, id:'ax-'+attr_name">
	             <div> <div class="error_message">hidden error message</div>
		<div class="info_box"> </div>
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
							    objectUrl:'${this.%{attr_name}?this.%{attr_name}.getTarget().getURI():''}/',
					            objectData:${this.%{attr_name}?this.%{attr_name}.getTarget().getAssetObject():'undefined'}
						       },
						       dojo.byId('%{attr_name}_WAS'));

		     //]]></script>
		     </div>
		</fieldset>;

        ret..div.(@['class'] == 'info_box').appendChild(this.info_label(attr_name, props, (props.widget.label?new XMLList(props.widget.label.value):'undefined'), 'You can create a connection to an Asset that exists within Axiom CMS. This will bring up a dialog allowing you to search for your Asset and then select it.'));

    return ret;
}

function textboxcounter(attr_name, props){
	var ret = <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class':'ax-textboxcounter ax-'+attr_name, id:'ax-'+attr_name">
	           <div> <div class="error_message">hidden error message</div>
		<div class="info_box"> </div>
		<input type="text" tal:attr="id:attr_name, name:attr_name, maxlength: (props.widget.maxchars ? props.widget.maxchars.value : 20), onkeypress:'tbc'+attr_name+'.update()', 'talout:attr': 'value: this.'+attr_name,  'class':(props.widget.required?'validate-empty':'')"/>
		<div class="counter"><span tal:attr="id: 'count-'+attr_name">{(props.widget.maxchars ? props.widget.maxchars.value : 20)}</span>&#160;Characters Remaining</div>
		<script type="text/javascript" tal:text="%"> //<![CDATA[

			   window.tbc%{attr_name} = {
			       countTag: dojo.byId('%{"count-"+attr_name}'),
				   inTag: dojo.byId('%{"ax-"+attr_name}').getElementsByTagName("input")[0],
				   maxChars: %{props.widget.maxchars ? props.widget.maxchars.value : 20},
				   update: function() {
				       this.countTag.innerHTML = this.maxChars - this.inTag.value.length;
				       axiom.dirtyProps['%{attr_name}'] = true;
				   }
			  };
			  tbc%{attr_name}.countTag.innerHTML = tbc%{attr_name}.maxChars - tbc%{attr_name}.inTag.value.length;

			 //]]></script>
		   </div>
		 </fieldset>;

        ret..div.(@['class'] == 'info_box').appendChild(this.info_label(attr_name, props, (props.widget.label?new XMLList(props.widget.label.value):'undefined'), 'This specifies a counter for the textbox and does not allow any more entry after the max has been reached.'));

    return ret;
}

function textareacounter(attr_name, props){
	var ret = <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class':'ax-textareacounter ax-'+attr_name, id:'ax-'+attr_name" tal:var="maxchars: (props.widget.maxchars? props.widget.maxchars.value: 100)">
			 <div> <div class="error_message">hidden error message</div>
		<div class="info_box"> </div>
		<textarea cols="50" rows="5" tal:attr="id:attr_name, name:attr_name, onkeyup:'tac'+attr_name+'.update()', 'class':(props.widget.required?'validate-empty validate-length-'+maxchars:'validate-length-'+maxchars)"><span tal:attr="'talout:replace':'this.'+attr_name+' || \'\''"/></textarea>
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

        ret..div.(@['class'] == 'info_box').appendChild(this.info_label(attr_name, props, (props.widget.label?new XMLList(props.widget.label.value):'undefined'), 'This specifies a counter for the textarea and does not allow any more entry after the max has been reached.'));

    return ret;
}

function tags(attr_name, props){
    var ret = <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class':'ax-tags ax-'+attr_name, id:'ax-'+attr_name">
              <div> <div class="error_message">hidden error message</div>
	          <div talout:var="window_id: this.id+'_window'" class="tags">
		<div class="info_box"> </div>
		      <textarea name="tags" talout:attr="id: this.id+'_tags'" talout:content="this.getTagString()"> </textarea>
		      <div class="tag_button"><img talout:attr="onclick: 'axiom.tags.toggleWindow(\''+window_id+'\')', src: app.getStaticMountpoint('axiom/images/tag.gif')" />
		      <span talout:var="input_id: this.id+'_tags'" talout:replace="this.list_tags(data)"/> </div>
		     </div>
		</div>
	      </fieldset>;

        ret..div.(@['class'] == 'info_box').appendChild(this.info_label(attr_name+'_tags', props, (props.widget.label?new XMLList(props.widget.label.value):'undefined'), 'Within this area you can enter tag names. These names are comma delimited and are then able to be managed within the Asset Manager.'));

    return ret;
}

function urlselect(attr_name, props){
	var markup = <fieldset xmlns:tal="http://axiomstack.com/tale" xmlns:talout="http://axiom.com/talout" tal:attr="'class':'ax-urlselect ax-'+attr_name, id:'ax-'+attr_name">
			 <div> <div class="error_message">hidden error message</div>
		<div class="info_box"> </div>
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
						axiom.browsetable.defaultValue = '${escape(this.%{attr_name})}';
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
    var ret = markup;

        ret..div.(@['class'] == 'info_box').appendChild(this.info_label(attr_name, props, (props.widget.label?new XMLList(props.widget.label.value):'undefined'), 'This area allows you to specify a URL that is not a part of your website, but it also brings up a dialog allowing you to find another URL within your website.'));

    return ret;
}
