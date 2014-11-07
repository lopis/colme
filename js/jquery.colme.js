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

    floater = {};

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


   table    = $(selectors.table);
   head     = table.find(selectors.head);
   body     = table.find(selectors.body);
   colCount = 0;
   colme    = this;

   head.find(selectors.row).first().find(selectors.th).each(function () {
       var c = parseInt($(this).attr(attributes.span));
       colCount += !c ? 1 : c;
   });


    /**
     * Enables hinding and showing groups of columns.
     *
     * @param string colGroup Column group name
     * @param boolean visible True to show group, False otherwise
     */
    this.toggleable = function() {
        table.on('colme:hideColumn', function (event, groupId, value) {

            if (value) {
                var elem  = $('.' + groupId); 
                if (!elem.is(':visible')) {
                    return;
                }

                var elems = $('[' + attributes.id + '=' + groupId + ']');
                var width = elems.width();
                var node  = tableNodes[groupId];

                elem.hide();  // Hides self
                elems.hide(); // Hides descendants
                table.trigger('colme:hidden', elems.push(elem));
                for (var parent = node.parent; parent; parent = parent.parent) {
                    parent.DOMelement.width(parent.DOMelement.width() - width); // Removes self width from ancestors
                };

            } else {
                var elem = $('[' + attributes.id + '=' + groupId + ']');
                if (elem.is(':visible')) {
                    return;
                }
                var elems = $('.' + groupId);
                elems.show(); // Shows descendants
                var width = elem.width();
                var node = tableNodes[groupId];
                var parent = node.parent;
                elem.show(); // Shows self
                table.trigger('colme:shown', elems.push(elem));
                for (; parent; parent = parent.parent) {
                    /*  Updates its width and that of its descendants */
                    parent.DOMelement.show();
                    parent.setCellWidth();
                };

            }
        })

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
     * Makes miracles.
     *
     * @author Your Heart
     * @param Hapiness
     */
    this.doYouBelieveInMiracles = function(){
        return "Hey! Thank You for using this plugin! We really had a blast making it! Kisses if you are a hot girl!"
    }

    /**
     * Makes columns resizable
     * @author lopis
     * @author carlosmtx
     */
    this.resizable = function() {
        var cm = this;
        var colIds = head.find(selectors.th + '[' + attributes.id + ']');

        $('<style>.ui-resizable-helper::after{height: '+table.height()+'px;}</style>').appendTo('head');

        $(colIds).each(function () {
            $(this).resizable({
                handles  : 'e',
                distance : 3 ,
                helper   : 'ui-resizable-helper',
                start    : function (event, ui) {
                    $(ui.helper).height(ui.originalSize.height);
                    $(ui.helper).css('top', table.offset().top);
                },
                stop     : function(event, ui) {
                    var initialWidth    = ui.originalSize.width;
                    var finalWidth      = ui.size.width;
                    var delta           = finalWidth - initialWidth;
                    var absDelta        = Math.abs(delta);
                    var sign            = delta > 0 ? 1 : -1;

                    var element = $(ui.element.context);
                    var span    = element.attr(attributes.span);
                    
                    var rootNode = tableNodes[element.attr(attributes.id)]
                    rootNode.DOMelement.width(initialWidth)
                    rootNode.resizeAcumulator =0;
                    rootNode.resizeAmount = absDelta;

                    var stack = [ {iterated : false , node : rootNode } ];
                    var childrenNodes =[{iterated : false , node : rootNode }];
                    var leafNodes = [];
                    var lost =0;
                    // Traversing the tree 
                    // -------------------
                    do{
                        var current = stack[stack.length -1];
                        //The current node and all its children were already visited
                        //----------------------------------------------------------
                        if ( current.iterated ){
                            stack.pop();
                            current.node.parent.resizeAcumulator += current.node.resizeAcumulator;
                            continue;
                        }
                        //The node children must be visited to determine the current node width change
                        //----------------------------------------------------------------------------
                        for ( var i = 0 ; i < current.node.children.length ; i++ ){
                            var theNew = {iterated : false , node : current.node.children[i] };
                            theNew.node.resizeAmount    = Math.floor( current.node.resizeAmount * theNew.node.DOMelement.width() / current.node.DOMelement.width() ) ;
                            theNew.node.resizeAcumulator= 0; 
                            stack.push(theNew);
                            childrenNodes.push(theNew);
                        }
                        //The current node is a final node , the current node can be resized without problem
                        if ( current.node.children.length == 0){
                            current.node.resizeAcumulator = current.node.resizeAmount; 
                            leafNodes.push(current);   
                        }
                        //The current node was visited
                        //----------------------------
                        current.iterated = true;


                    } while ( stack.length > 1);

                    // Applying possible width to all the descendant nodes 
                    for ( var i = 0 ; i < childrenNodes.length ; i++){
                        childrenNodes[i].node.DOMelement.width( childrenNodes[i].node.resizeAcumulator * sign + childrenNodes[i].node.DOMelement.width()   );
                    }

                    // Applying possible width to all the body elements
                    for ( var i = 0 ; i < leafNodes.length ; i++){
                        var id = leafNodes[i].node.parent.DOMelement.attr(attributes.id);
                        body.find( "." + id ).width( leafNodes[i].node.DOMelement.width() );
                    }

                    // Applying possible width to all parent nodes
                    for(ancestor = rootNode.parent; ancestor ; ancestor = ancestor.parent) {
                        ancestor.DOMelement.width( ancestor.DOMelement.width() + rootNode.resizeAcumulator * sign );
                    }
                }
            });

            $(this).on('resizestart', function (e) {
                e.stopPropagation();
            });
        });
    }



    this.draggable = function() {

        // Initialize handler for column dragging
        $(selectors.th).mousedown(function(event) {

            // Prevents children from triggering this event
            // Only accepts left click to drag
            if (event.target != this || event.which != 1) {return}; 

            //$(selectors.th).unbind('mousedown');

            /** Width of this column (or column group) **/
            var width = $(this).width();

            var groupId = $(this).attr(attributes.id);

            /** Initial position of the element in the page **/
            floater.startPosX    = $(this).offset().left + $(window).scrollLeft();
            floater.startPosY    = $(this).offset().top + $(window).scrollTop();
            floater.mouseOffsetX = event.pageX - floater.startPosX;
            floater.groupId      = groupId;

            var parentNode = tableNodes[groupId].parent.DOMelement;
            if (!parentNode || parentNode.length < 1) {
                parentNode = head;
            };
            floater.lowerBoundX = parentNode.offset().left + floater.mouseOffsetX;
            floater.upperBoundX = parentNode.offset().left + parentNode.width() + floater.mouseOffsetX - width;

            /** Create a placeholder where the cells before moved are **/
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
            floater.DOMelement.css('top', head.offset().top - $(document).scrollTop());
            floater.DOMelement.css('left', -floater.mouseOffsetX);

            /** Copy cells of this col group into the floater **/
            var floaterHead = floater.DOMelement.find(selectors.head);
            var floaterBody = floater.DOMelement.find(selectors.body);
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
            refreshFloater(event);

            /** Bind position of the floater to mouse movement **/
            $(window).mousemove(function(event) {
                refreshFloater(event);
                refreshPlaceHolder(event);
            });
            $(window).mouseup(stopDrag);

            // Because this is a drag event, it starts selecting text. So this disables it.
            // Because this is a sow task, it's down in the end of this function.
            $('*').css('user-select', 'none');
        });
    }

    /**
     * Utility function to add 'afterElement' after the
     * last found element with a given class 'groupId'
     *
     * @author lopis
     */
    function afterLastOfType (element, groupId, afterElement) {
        var lastOfGroup = element.find('.' + groupId).last();
        if (lastOfGroup.length > 0) {
            lastOfGroup.after(afterElement);
        };
    }

    /** 
     * Updates the position of the floater with 
     * the current position of the mouse. Restricts
     * the position of the floater to the limits of
     * the col group (defined in floater).
     *
     * @author lopis
     */
    function refreshFloater (event) {
        var pos = Math.max(Math.min(event.pageX, floater.upperBoundX), floater.lowerBoundX); 
        $('#cm-floater').css('transform', 'translateX('+pos+'px)');
    }

    /**
     * No offense intended. I have seen and enjoyed drag shows.
     * But this specific drag event stops here.
     *
     * @author lopis
     */
    function stopDrag () {
        
        var floaterHead = floater.DOMelement.find(selectors.head);
        var floaterBody = floater.DOMelement.find(selectors.body);
        var placeHolder = $('.cm-drag-placeholder');
        floater.DOMelement.css('left', -1000);

        /** Removes mouse binds **/
        $(window).unbind('mousemove');
        $(window).unbind('mouseup');

        /** Prepends content of the floater to the placeholder **/
        floaterHead.find(selectors.row).each(function (rowIndex) {
            var thisRowCells = $(this).find(selectors.th);
            head.find(selectors.row).eq(rowIndex).find('.cm-drag-placeholder').before(thisRowCells);
        });
        floaterBody.find(selectors.row).each(function (rowIndex) {
            var thisRowCells = $(this).find(selectors.td);
            body.find(selectors.row).eq(rowIndex).find('.cm-drag-placeholder').before(thisRowCells);
        });

        /** Removes the placeholder **/
        $('.cm-drag-placeholder').remove();

        /** Clears the drag **/
        floater.DOMelement.find(selectors.row).remove();

        // Restore bind
        //colme.draggable();
    }

    /**
     * When the floater moves, try to move the 
     * columns around, changing the position of
     * the placeholder.
     *
     * @author lopis
     */
    function refreshPlaceHolder (event) {

        var firstPlaceholder = table.find('.cm-drag-placeholder').first();
        var offset           = firstPlaceholder.offset().left;
        var prevSibling      = firstPlaceholder.prev();
        var nextSibling      = firstPlaceholder.next();

        // Position relative to element is (pageX-offset).
        // Position is bound to the col group
        var mouseX = Math.max(Math.min(event.pageX, floater.upperBoundX), floater.lowerBoundX) - floater.mouseOffsetX; 
        if (mouseX >= offset + nextSibling.width() * 0.4) {
            movePlaceholder(firstPlaceholder, true, nextSibling.attr(attributes.id));
        } else if (mouseX <= offset - prevSibling.width() * 0.6) {
            movePlaceholder(firstPlaceholder, false, prevSibling.attr(attributes.id));
        } else {

        }
    }

    /**
     * 
     * @param boolean isForward True if the placeholder should move forward, false otherwise.
     * @author lopis
     */
    function movePlaceholder (firstPlaceholder, isForward, siblingId) {
        floater.DOMelement.find(selectors.row).each(function (rowIndex) {
            var tableRow = table.find(selectors.row).eq(rowIndex);
            var span = tableRow.find('.' + siblingId + ',[' + attributes.id + '=' + siblingId + ']').length;
            if (isForward) {
                tableRow.find('.cm-drag-placeholder').each(function () {
                    $(this).siblings().addBack().eq($(this).index() + span).after($(this));
                });
            } else {
                tableRow.find('.cm-drag-placeholder').each(function () {
                    $(this).siblings().addBack().eq($(this).index() - span).before($(this));
                });
            }
        });
    }



    this.headerSticky = function() {
        var container = $(window);
        container.scroll(function (event) {
            var scrollTop = container.scrollTop();
            var offsetTop = table.offset().top;
            if (scrollTop > offsetTop) {
                head.css('transform', 'translateY('+(scrollTop-offsetTop)+'px)');
            } else {
                head.css('transform', 'translateY(0px)');
            }
        })
    }

    this.columnsToggleable = function(element) {

    }

    this.updateTable = function () {
        // Refreshed the table tree representation.
    }


    /**
     * Creates a tree representation of the table
     * using the colspan values to establish relationships
     * between columns.
     *
     * @author carlosmtx
     * @author lopis
     */
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
                        newChildId = 'cm-'+i+'-'+j+'-'+k ;
                        $(ths[j]).addClass(currParents[k].classes);
                        $(ths[j]).addClass(currParents[k].id);
                        $(ths[j]).attr(attributes.id, newChildId);
                        
                        newChild = new Node( currParents[k], colspan, currentOffset, newChildId );
                        tableNodes[newChild.id] = newChild;
                        currParents[k].addChild( newChild );
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
        var rows = body.find(selectors.row);
        var tds = body.find(selectors.td);
        /* Searches which 'parent' this cell belongs to by 
         * using the values of the colspan */
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

        /* Transverses the tree to collect its leaf nodes */
        var leafs=[];
        for ( i in tableNodes){
            if ( tableNodes[i].children.length == 0){
                leafs.push(tableNodes[i]);
            }
        }
        /* Connects the last row of the header (the 'leafs') to the first row of the body */
        var firstRow = body.find(selectors.row).first();
        for ( var i = 0 ; i < leafs.length ; i++){
            firstRow.find("." + leafs[i].id ).each(function(){
                var newNode = new Node( leafs[i] , 1 , 0);
                newNode.DOMelement = $(this);
                leafs[i].addChild(newNode);
            });
        }
            
        /* Sets the correct width of the headers */
        root.setCellWidth();
    }

    this.createTree();

    if (options.resizable) {
        // Inits jquery plugin and Sets handlers for resizing
        this.resizable();
    };

    if (options.draggable) {
        // Create floater
        floater.DOMelement = $('<div>', {id: 'cm-floater'});
        floater.DOMelement.append($('<div>', {class: selectors.head.replace('.','')}));
        floater.DOMelement.append($('<div>', {class: selectors.body.replace('.','')}));
        floater.DOMelement.css({position: 'fixed'})
        $('body').append(floater.DOMelement);

        // Sets dragging handlers
        this.draggable();
    };

    if (options.sticky) {
        // Sets scroll handlers to control table header
        this.headerSticky();
    };

    if (options.toggleable) {
        // Sets toggling handlers
        this.toggleable();
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
 *
 * @author carlosmtx
 * @author lopis
 */
function Node (parent,colspan,colspanOffset,newId){
    this.parent         = parent;
    this.children       = [];
    this.colspan        = colspan;
    this.colspanOffset  = colspanOffset; // Only used to build the tree
    this.id             = !newId ? 'cm-root' : newId;
    this.classes        = '';
    this.DOMelement     = head.find("["+attributes.id+"="+newId+"]");


    //This Elements exist to help the tree traversing when resizing
    //-------------------------------------------------
    this.resizeAcumulator = 0; 
    this.resizeAmount = 0;


    if (this.parent) {
        this.classes = this.parent.classes + ' ' + this.parent.id;
    };

    this.addChild = function(child){
        this.children.push(child);
    };

    /**
     * Visits all descendants and set its width equal
     * to the sum of the width of its descendants
     *
     * @author lopis
     */
    this.setCellWidth = function () {
        if (!this.children || this.children.length < 1) {
            return this.DOMelement.is(':visible') ? this.DOMelement.width() : 0;
        } else {
            var width = 0;
            for (var i = 0; i < this.children.length; i++) {
                width += this.children[i].setCellWidth();
            }
            this.DOMelement.width(width);
            return width;
        }
    }
}

