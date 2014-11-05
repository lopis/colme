/**
 * jquery.colme.js
 *
 * @authors lopis, carlosmtx
 * @dependencies: jquery, jqueryui.resizable
 * @moto: é um plugin e vai ficar awesome
 * @moto2: o que é que nós não fazemos? nada.
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
 * * * The above copyright notice and this permission notice shall be included in
 * * * all copies or substantial portions of the Software.
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
    layouts = {};

    /**
     * Each table node is kept in this object, accessible
     * with the Id of the node (selectors.span)
     */
    tableNodes = {};

    if (!options.selectors) {
        options.selectors = {};
    }
    if (!options.attributes) {
        options.attributes = {};
    }

    selectors = {
        table : ( options.selectors.table ? options.selectors.table : '#cm-table' ),
        head  : ( options.selectors.head  ? options.selectors.head  : '.cm-thead' ),
        body  : ( options.selectors.body  ? options.selectors.body  : '.cm-tbody' ),
        row   : ( options.selectors.row   ? options.selectors.row   : '.cm-tr' ),
        th    : ( options.selectors.th    ? options.selectors.th    : '.cm-th' ),
        td    : ( options.selectors.td    ? options.selectors.td    : '.cm-td' ),
    };
    attributes = {
        id    : ( options.attributes.id    ? options.attributes.id    : 'data-cm-id' ), // column id
        span  : ( options.attributes.span  ? options.attributes.span  : 'data-cm-span' ), // colspan property
    };


   table = $(selectors.table);
   head  = table.find(selectors.head);
   body  = table.find(selectors.body);
   colCount = 0;


   head.find(selectors.row).first().find(selectors.th).each(function () {
       var c = parseInt($(this).attr(attributes.span));
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
    this.doYouBelieveInMiracles = function(){
        return "Hey! Thank You for using this plugin! We realy had a blast making it! Kisses if you are a hot girl!"
    }
    /**
     * Makes columns resizable
     * @author lopis
     */
    this.resizable = function() {

    }

    this.draggable = function() {
        // Create floater
        var floater = $('<div>', {id: 'cm-floater'});
        floater.append($('<div>', {class: selectors.head.replace('.','')}));
        floater.append($('<div>', {class: selectors.body.replace('.','')}));
        floater.css({position: 'fixed'})
        $('body').append(floater);

        // Initialize handler for column dragging
        $(selectors.th).mousedown(function(event) {

            /** Initial position of the element in the page **/
            var element = {
                startPosX: $(this).offset().left - $(window).scrollLeft(),
                startPosY: $(this).offset().top
            };

            var mouse = {
                mouseStartPosX: event.pageX - element.startPosX,
                mouseStartPosY: event.pageY - element.startPosY
            };

            /** Width of this column (or column group) **/
            var width = $(this).width();

            /** Create a placeholder where the cells before moved are **/
            var groupId = $(this).attr(attributes.id);
            var headerClass = selectors.th.replace('.','');
            var bodyClass = selectors.td.replace('.','');
            var placeholderHeader = $('<div>', {class: 'cm-drag-placeholder ' + headerClass, width: width});
            var placeholderBody   = $('<div>', {class: 'cm-drag-placeholder ' + bodyClass, width: width});
            
            $(this).after(placeholderHeader.clone()); // Add placeholder infront of itself
            head.find(selectors.row).each(function () { // Then to the "children" in the header
                afterLastOfType($(this), groupId, placeholderHeader.clone());
            });

            body.find(selectors.row).each(function () { // And in the children in the body
                afterLastOfType($(this), groupId, placeholderBody.clone());
            });

            /** Sets initial position of the floater **/
            var floater = $("#cm-floater");
            floater.css('top', head.offset().top - $(document).scrollTop());
            floater.css('left', element.startPosX);

            /** Copy cells of this col group into the floater **/
            var floater     = $('#cm-floater');
            var floaterHead = floater.find(selectors.head);
            var floaterBody = floater.find(selectors.body);

            head.find(selectors.row).each(function () {
                var thisRowCells = $(this).find('.' + groupId + ' ,[' + attributes.id + '=' + groupId + ']');
                var newRow = $('<div>', {class: selectors.row.replace('.','')});
                newRow.append(thisRowCells); // Moves cells to the new row in the floater
                floaterHead.append(newRow);
            });
            body.find(selectors.row).each(function () {
                var thisRowCells = $(this).find('.' + groupId);
                var newRow = $('<div>', {class: selectors.row.replace('.','')});
                newRow.append(thisRowCells); // Moves cells to the new row in the floater
                floaterBody.append(newRow);
            });

        });
    }

    function afterLastOfType (element, groupId, afterElement) {
        var lastOfGroup = element.find('.' + groupId).last();
        if (lastOfGroup.length > 0) {
            lastOfGroup.after(afterElement);
        };
    }

    this.headerSticky = function() {

    }

    this.columnsToggleable = function(element) {

    }

    this.updateTable = function () {
        // Refreshed the table tree representation.
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
                var colspan = $(ths[j]).attr(attributes.span)
                colspan = parseInt( !colspan ? "1" : colspan);
                var newChild = 0;

                // Checking which parent is the newChild parent (?)
                // ------------------------------------------------
                for(k = 0 ; k < currParents.length ; k++){
                    if ( currentOffset < currParents[k].colspanOffset + currParents[k].colspan  ){
                        newChild = new Node( currParents[k], colspan, currentOffset, 'cm-'+i+'-'+j+'-'+k );
                        tableNodes[newChild.id] = newChild;
                        currParents[k].addChild( newChild );
                        $(ths[j]).attr(attributes.id, newChild.id);
                        $(ths[j]).addClass(newChild.classes);
                        break;
                    }
                }
                newParents.push(newChild);
                currentOffset += colspan;
            }
            currParents = newParents;
        }

        var thCursor = 0;
        var tdCursor = 0;
        var tds = body.find(selectors.td);
        head.find(selectors.row).last().find(selectors.th).each(function () {
            var thNode = tableNodes[$(this).attr(attributes.id)];
            thCursor += thNode.colspan;
            while(tdCursor < thCursor) {
                $(tds[tdCursor]).addClass(thNode.classes + ' ' + thNode.id);
                tdCursor += $(tds[tdCursor]).attr(attributes.span) ? $(tds[tdCursor]).attr(attributes.span) : 1;
            }
        });


        var thCursor = 0;
        var tdCursor = 0;
        var rows = body.find(selectors.row);
        var tds = body.find(selectors.td);
        head.find(selectors.row).last().find(selectors.th).each(function () {
            var thNode = tableNodes[$(this).attr(attributes.id)];
            thCursor += thNode.colspan;
            while(tdCursor < thCursor) {
                rows.each(function () {
                    $(this).children().eq(tdCursor).addClass(thNode.classes + ' ' + thNode.id);
                });
                tdCursor += $(tds[tdCursor]).attr(attributes.span) ? $(tds[tdCursor]).attr(attributes.span) : 1;
            }
        });

    }

    this.createTree();

    if (options.resizable) {
        // Inits jquery plugin and Sets handlers for resizing
        this.resizable();
    };

    if (options.draggable) {
        // Sets dragging handlers
        this.draggable();
    };

    if (options.sticky) {
        // Sets scroll handlers to control table header
    };

    if (options.toggleable) {
        // Sets toggling handlers
    };

}

/**
 * The structure that defines the table is represented
 * internally by a tree, composed of Nodes.
 * The tree can be transversed in both directions to
 * allow propagation of actions up and down.
 * The tree never changes after performing an action
 * on the table. If changes occur, the tree must be
 * refreshed with this.updateTable().
 */
function Node (parent,colspan,colspanOffset,newId){
    this.parent         = parent;
    this.children       = [];
    this.colspan        = colspan;
    this.colspanOffset  = colspanOffset; // Only used to build the tree
    this.id             = !newId ? '' : newId;
    this.classes        = '';

    if (this.parent) {
        this.classes = this.parent.classes + ' ' + this.parent.id;
    };

    this.addChild = function(child){
        this.children.push(child);
    };
}

