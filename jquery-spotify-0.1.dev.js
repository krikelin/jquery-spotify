/***
 * JQuery Spotify extension
 * Copyright (C) 2011 Alexander Forselius
 * CURRENTLY EXPERIMENTAL!
 * This is a work in progress, not intended for production use yet
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
/**
 * Non jquery simplificated spotify object
 */

function JSpotify(params){
	this.api = getSpotifyApi(1);
	this.m = this.api.require('sp://import/scripts/api/models');
	this.v = this.api.require('sp://import/scripts/api/views');
	this.coverflow = this.api.require("sp://import/scripts/coverflow");
	this.popover = this.api.require("sp://import/scripts/popover");
	/**
	 * Used for the flow
	 */
	this.get_image = function(obj){
		return obj.cover != 'undefined' ? obj.cover : (
		obj.portrait != 'undefined' ? obj.portrait : (
			obj.cover != 'undefined' ? obj.mosaic : (
					""
					
				)
				
			)
		)
	};
}
var __spot = new JSpotify();
var jsp_v = __spot.v;
var jsp_m = __spot.m;
(function( $ ){
	
	/**
	 * Method prototype
	 */
	var methods = {
		button: function(options){
			
		},
		/**
		 * creates a popover
		 * @param options {
		 * 		node : DOMNodeList
		 * }
		 */
		popover: function( options ){
			
			var popover = __spot.popover.popover(options);
			var content = new Object();
			content.contentNode = options.node; // Set contentnode
			popover.setContent(content);
			$(this).append(popover.node);
			// TODO Add this
		},
		
		/**
		 * Creates a nice coverflow.
		 * 
		 * Options {
		 * 	datasource: {
		 * 	// Is a object that is an datasource. Must implement these functions:
		 * 		makeNode : function(index){
		 * 			// shall make a item
		 * 			return {
		 * 				dataset : { An array }
		 * 	
		 * 			}
		 * 		}
		 * }
		 * 
		 * }
		 * }
		 */
		coverflow: function( options ){
			var datasource = options.datasource;
			var coverflow = new __spot.coverflow.Coverflow(datasource, options);
			$(this).html("");
			console.log(coverflow);
			console.log($(this).get(0));
			$(this).append(coverflow.node);
			
		},
		/**
		 * Creates a flow of a certain kind of content, like the similar artists section on the artists view
		 * options { title : String, content :[m.views.Artist|Album|Playlist]}
		 */
		flow: function( options ){
			var type = options.type;
			var content = options.content; // Arrays of uris
			
			var scale = options.scale; // <scale>x<scale> size
			var div = document.createElement("div");
		
			for(var i=0; i < content.length; i++){
				var obj = content[i]; // object, either an istance of 
				var a = document.createElement("a");
				var elm = document.createElement("span");
				$(elm).addClass("sp-flow-item");
				var img = document.createElement("img");
				img.setAttribute("width", scale);
				img.setAttribute("src", __spot.get_image(obj)); 
				img.setAttribute("height", scale);
				img.setAttribute("class", "sp-player-image");
				a.setAttribute("href", obj.data.uri); // URI of the data
				a.appendChild(elm);
				a.appendChild(document.createElement("br")); // Add line break
				if(options.text != 'undefined'){
					var text = document.createElement("span");
					$(text).html(options.text);
					a.appendChild(text);
				}
				$(div).append(a);
				
				
			}
			var html = $(this).html();
			$(this).html("");
			$(this).append(div);
		
		},
		
		/**
		 * Creates a section divider, like the Top Tracks on the artist page
		 */
		divider: function( options ){
			var html = $(this).html();
			$(this).html(""); // Nullifiate the html
		
			var div = document.createElement("div");
			div.setAttribute("class","spotify-divider");
			$(this).append(div);
			$(div).html(html);
			return $(div);
		},
		/**
		 * Player view
		 */
		player : function(options){
			var context = options.context;
			var player = new jsp_v.player;
			return $(this).appendChild(player);
		},
		/**
		 * Album object
		 */
		album : function ( options ){
			var uri = options.uri;
			
		},
		/**
		 * A list, v.list
		 */
		list : function(options){
			
			var playlist = options.playlist;
			
			var list = new jsp_v.List(playlist, function(track){
				return new views.Track(track, views.Track.FIELD.STAR | views.Track.FIELD.POPULARITY | views.Track.FIELD.SHARE | views.Track.FIELD.NAME | views.Track.FIELD.ARTIST | views.Track.FIELD.ALBUM);
			});
			$(this).append(list.node);
			return $(list.node);
			
		},
		/****
		 * Adds a playlist to the view
		 * @param list the playlist object to add
		 * @param title The title of the playlist
		 * @param host The object where the playlist should be appended to
		 */
		playlist : function ( options ) {
			var list = options.list; // The list object
			var title = options.title;
			
			var table= document.createElement("table");
			table.setAttribute("width","100%");
			var tr = document.createElement("tr");
			table.setAttribute("cellspacing",10);
			var td = document.createElement("td");
			td.setAttribute("valign", "top");
			var td2 = document.createElement("td");
			td2.setAttribute("valign", "top");
			var player = new jsp_v.Player();
			player.context = playlist;
			var context = new jsp_v.List(playlist, function(track){
				return new views.Track(track, views.Track.FIELD.STAR | views.Track.FIELD.POPULARITY | views.Track.FIELD.SHARE | views.Track.FIELD.NAME | views.Track.FIELD.ARTIST | views.Track.FIELD.ALBUM);
			});
			var link = document.createElement("h3")
			var alink = document.createElement("a");
			link.style.paddingBottom = 113;
			alink.appendChild(link);
			link.innerHTML = title;
			if(image == 'undefined'){
			var img = document.createElement("img");
			img.setAttribute("src", image);
			img.setAttribute("width",64);
			td.appendChild(img);
			} else {
				td.appendChild(player.node);
			}
			
			td.setAttribute("width","12");
			var button = document.createElement("button");
			button.setAttribute("class", "add-playlist button icon");
			button.setAttribute("value", playlist.uri);
			var span = document.createElement("span");
			span.innerHTML = "Add to playlist";
			button.appendChild(span);
			td.appendChild(button);
			span.setAttribute("class", "plus");
			td2.appendChild(alink)
			td2.appendChild(context.node);
			tr.appendChild(td);
			tr.appendChild(td2);
			table.appendChild(tr);
			$(this).table;
			return $(this).table;
		}
	};
	
	/**
	 * Spotify prototype
	 */
	$.fn.Spotify = function( method ){
		/**
		 * Basic from http://docs.jquery.com/Plugins/Authoring
		 */
		 if ( methods[method] ) {
	      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	      return methods.init.apply( this, arguments );
	    } else {
	      $.error( 'Method ' +  method + ' does not exist on jQuery.Spotify' );
	    }    
		
	};
})( jQuery );
