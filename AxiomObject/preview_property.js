function preview_property(){
	var prop = this.getSchema()[req.data.property];
	var style_file;
	if(prop.widget && prop.widget.styles){
		style_file = prop.widget.styles.value;
	}
	return this.preview_markup( {styles: style_file,
								 src_id: req.data.src_id } );
}