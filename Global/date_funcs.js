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


Date.prototype.toCSVString = function(){
	return this.pad(this.getMonth()+1)+'/'+this.pad(this.getDate())+'/'+this.getFullYear().toString().substring(2,4) + ' '+this.pad(this.getHours())+':'+this.pad(this.getMinutes());
} 
Date.prototype.toCMSString = function(){
	return this.pad(this.getMonth()+1)+'/'+this.pad(this.getDate())+'/'+this.getFullYear().toString().substring(2,4) + ', '+this.pad(this.getHours())+':'+this.pad(this.getMinutes());
} 
Date.prototype.pad = function(i){
	return i < 10 ? '0'+i : i;
}

Date.prototype.toH2Timestamp = function(){
	// yyyy-MM-dd hh:mm:ss
	return [this.getFullYear(), '-',
			this.pad(this.getMonth()+1), '-',
			this.pad(this.getDate()), ' ',
			this.pad(this.getHours()), ':',
			this.pad(this.getMinutes()), ':',
			this.pad(this.getSeconds()) ].join('');
}