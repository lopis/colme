/**
 * jquery.colme.js
 * 
 * @author lopis
 * @dependencies: jquery, jqueryui.resizable
 *
 * MIT License
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


function Colme(options) {

    /**
     * Table layouts are objects that describe the layout
     * of the table, including column widths and order.
     */
    this.layouts = {};

    if (!options.selectors) {
        options.selectors = {};
    }
    selectors = {
        table : ( options.selectors.table ? options.selectors.table : '#cm-table' ),
        head  : ( options.selectors.head  ? options.selectors.head  : '.cm-thead' ),
        body  : ( options.selectors.body  ? options.selectors.body  : '.cm-tbody' ),
        row   : ( options.selectors.row   ? options.selectors.row   : '.cm-tr' ),
        th    : ( options.selectors.th    ? options.selectors.th    : '.cm-th' ),
        td    : ( options.selectors.td    ? options.selectors.td    : '.cm-td' ),
    };


   table = $(selectors.table);
   head  = table.find(selectors.head);
   body  = table.find(selectors.body);
   colCount = 0;
   head.find(selectors.row).first().find(selectors.th).each(function () {
       var c = parseInt($(this).attr('data-cm-span'));
       colCount += !c ? 1 : c;
   });


    /**
     * Hides/shows the columns of 'colGroup'.
     *
     * @param string colGroup Column group name
     * @param boolean visible True to show group, False otherwise
     */
    this.setColumnVisible = function(colGroup, visible) {

    }

    this.isColumnVisible = function (colGroup) {

    }

    this.saveCurrentLayout = function() {

    }

    this.getLayouts = function() {

    }

    this.setLayout = function() {

    }

    /**
     * Makes columns resizable
     * @author lopis
     */
    this.resizable = function() {
        var cm = this;
        var colIds = head.find(selectors.th);
        $(colIds).each(function () {
            $(this).resizable({
                handles  : 'e',
                distance : 3 ,
                helper   : 'ui-resizable-helper',
                start    : function (event, ui) {
                    $(ui.helper).height(ui.originalSize.height);
                    console.log(ui);
                },
                stop     : function(event, ui) {
                    $(selectors.table).trigger('colme:col:resize', [ui]);
                }
            });
        });
    }

    this.draggable = function() {

    }

    this.headerSticky = function() {

    }

    this.columnsToggleable = function(element) {

    }


    this.createTree = function(){
    	var root = new Node(undefined,colCount,0)
    	var headerRows = head.find(selectors.row);
    	var currParents = [root];
    	// Iteration through each row
    	//-------------------------------
    	for (var i = 0; i < headerRows.length; i++) {
    		
    		var newParents=[];
    		var currentOffset = 0;
    		var ths = $( headerRows[i] ).find(selectors.th);
    		
    		// Iterating through each th inside a row
    		//---------------------------------------
    		for ( j = 0 ; j < ths.length ; j++ ){
				var colSpan = $(ths[j]).attr("data-cm-span")
    			colSpan = parseInt( !colSpan ? "1" : colSpan);
    			var newChild = 0;
    			
    			// Checking which parent is the newChild parent (?)
    			// ------------------------------------------------
    			for(k = 0 ; k < currParents.length ; k++){
					if ( currentOffset < currParents[k].colSpanOffset + currParents[k].colSpan  ){
    					newChild = new Node( currParents[k] , colSpan ,currentOffset);
    					currParents[k].addChildren( newChild );
    					break;
    				}
    			}
    			newParents.push(newChild);
				currentOffset += colSpan ;
    		}
    		currParents = newParents;
    	}
    }


    if (options.resizable) {
        // Inits jquery plugin
        // Sets handlers for resizing
        this.resizable();
    };

    if (options.draggable) {
        // Sets dragging handlers
    };

    if (options.sticky) {
        // Sets scroll handlers to control table header
    };

    if (options.toggleable) {
        // Sets toggling handlers
    };

}


function Node (parent,colSpan,colSpanOffset){
	this.parent  		= parent;
	this.children   	= [];
	this.colSpan    	= colSpan;
	this.colSpanOffset 	= colSpanOffset;

	this.addChildren = function(child){
		this.children.push(child);
	};
}

