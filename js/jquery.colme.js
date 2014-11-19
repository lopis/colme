/**
 * jquery.colme.js
 *
 * @authors lopis, carlosmtx
 * @dependencies: jquery, jqueryui.resizable
 * @moto: é um plugin e vai ficar awesome
 * @moto2: o que é que nós não fazemos? nada.
 *
 * @class Colme
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
'use strict';
var $;
function Colme(options) {

    /**
     * Each table node is kept in this object, accessible
     * with the Id of the node (selectors.span)
     */
    var tableNodes = {};
    var floater = {};

    if (!options.selectors) {
        options.selectors = {};
    }
    if (!options.attributes) {
        options.attributes = {};
    }
    var classes   = {
        head  : ( options.selectors.head  ? options.selectors.head  : 'cm-thead' ),
        body  : ( options.selectors.body  ? options.selectors.body  : 'cm-tbody' ),
        row   : ( options.selectors.row   ? options.selectors.row   : 'cm-tr' ),
        th    : ( options.selectors.th    ? options.selectors.th    : 'cm-th' ),
        td    : ( options.selectors.td    ? options.selectors.td    : 'cm-td' ),
    };

    var selectors = {
        head  : '.'+ classes.head ,
        body  : '.'+ classes.body ,
        row   : '.'+ classes.row  ,
        th    : '.'+ classes.th   ,
        td    : '.'+ classes.td   ,
    };

    var attributes = {
        id    : ( options.attributes.id    ? options.attributes.id    : 'data-cm-id' ), // column id
        span  : ( options.attributes.span  ? options.attributes.span  : 'data-cm-span' ), // colspan property
        floater : 'cm-floater',
    };

   var table    = options.table;
   var head     = table.find(selectors.head);
   var body     = table.find(selectors.body);
   var colCount = 0;
   var root ;


    /**
     * @method toggleable
     * Enables hiding and showing groups of columns.
     * To trigger a column toggle, trigger 'colme:hideColumn' event on the table.
     */
    this.toggleable = function() {
        table.on('colme:hideColumn', function (event, groupId) {
            var elems  = table.find('.' + groupId);
            var elem = table.find('[' + attributes.id + '=' + groupId + ']'); // The head of the column group
            
            if (!elem.is(':visible')) {
                return;
            }

            var node  = tableNodes[groupId];

            elems.addClass('cm-hidden'); // Hides descendant
            elems.filter(selectors.th).each(function () {
                table.trigger('colme:hidden', $(this).attr(attributes.id));
            });

            elem.addClass('cm-hidden');
            table.trigger('colme:hidden', groupId);
            for ( var parent = node.parent; parent; parent = parent.parent) {
                //parent.DOMelement.width(parent.DOMelement.width() - width); // Removes self width from ancestors
                parent.setCellWidth();
            }
        });

        table.on('colme:showColumn', function (event, groupId) {
            var elem = table.find('[' + attributes.id + '=' + groupId + ']'); // The head of the column group
            var elems = table.find('.' + groupId); // The other cells
            if (elem.is(':visible')) {
                return;
            }
            
            elems.removeClass('cm-hidden'); // Shows descendant
            
            elems.filter(selectors.th).each(function () {
                table.trigger('colme:shown', $(this).attr(attributes.id));
            });
            
            var node = tableNodes[groupId];
            var width = node.getWidth();
            var parent = node.parent;
            elem.removeClass('cm-hidden'); // Shows self
            table.trigger('colme:shown', groupId);
            for (; parent; parent = parent.parent) {
                /*  Updates its width and that of its descendants */
                if ( parent.parent){
                    parent.DOMelement.removeClass('cm-hidden');
                    table.trigger('colme:shown', parent.id);
                    parent.DOMelement.width( parent.DOMelement.width() + width );
                    parent.setCellWidth();
                }
            }
        });
    };

    this.getLayout = function() {
        var layout = {};
        for ( var i in tableNodes ){
            layout[i] = tableNodes[i].toObject();
        }
        return layout;
    };

    this.setLayout = function( layout ) {
        if ( typeof layout === layout){
            layout = JSON.parse(layout);
        }
        var currNode;
        for ( var i in layout ){
            currNode = tableNodes[layout[i].id];
            //currNode.width = layout[i].width;
            var aux={};
            for ( var j in currNode.children  ){
                aux[ currNode.children[j].id ] = currNode.children[j];
            }
            
            var newChildren =[];
            for ( var k in layout[i].children ){
                newChildren.push( aux[ layout[i].children[k].id] );
            }
            currNode.children = newChildren;
        }

        applyOrderWidthAndVisibility(layout);
    };

    /** 
     * Applies order, width and visibility
     */
    function applyOrderWidthAndVisibility (layout) {
        var stack = [{node :root , index :0}];

        do{
            var current = stack[stack.length-1];

            if (current.node.children.length === 0 && current.node.parent) {
                $('.' + current.node.parent.id).each(function () {
                    /* Appends node to own row */
                    $(this).parent().append($(this));
                    $(this).removeClass('cm-hidden');
                }).width(layout[current.node.id].width).addClass(!layout[current.node.id].visible ? 'cm-hidden' : ''); /* Apply width and visibility to itself */

                
                stack.pop();
                continue; // because there are not more children
            }

            if (current.index >= current.node.children.length) {
                stack.pop();
                continue; // because there are not more children
            }


            if (current.index === 0 && current.node.parent) {
                /* Appends node to own row */
                current.node.DOMelement.parent().append(current.node.DOMelement);

                /* Apply width to itself */
                current.node.DOMelement.width(layout[current.node.id].width);

                /* Set visiblity */
                current.node.DOMelement.removeClass('cm-hidden');
                current.node.DOMelement.addClass(!layout[current.node.id].visible? 'cm-hidden' : '');
            }

            stack.push({node: current.node.children[current.index++], index : 0});

        } while ( stack.length > 1);
        
    }

    /**
     * Makes miracles.
     *
     * @author Your Heart
     * @param {Hapiness} lots_of - The stuff dreams are made of.
     */
    function doYouBelieveInMiracles() {
        return 'Hey! Thank You for using this plugin! We really had a blast making it! Kisses if you are a hot girl!';
    }

    /**
     * @method resizable
     * Makes columns resizable
     * @author lopis
     * @author carlosmtx
     */
    this.resizable = function() {
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
                    //var span    = element.attr(attributes.span);
                    
                    var resizeRootNode = tableNodes[element.attr(attributes.id)];
                    resizeRootNode.DOMelement.width( resizeRootNode.getWidthResize(initialWidth) );
                    resizeRootNode.resizeAcumulator =0;
                    resizeRootNode.resizeAmount = absDelta;

                    var stack = [ {iterated : false , node : resizeRootNode } ];
                    var childrenNodes =[{iterated : false , node : resizeRootNode }];
                    var leafNodes = [];
                    //var lost =0;

                    // Traversing the tree 
                    // -------------------
                    do{
                        var current = stack[stack.length -1];
                        //The current node and all its children were already visited
                        //----------------------------------------------------------
                        if ( current.iterated ){
                            stack.pop();
                            if ( !current.node.isVisible() ){
                                continue;
                            }
                            current.node.parent.resizeAcumulator += current.node.resizeAcumulator;
                            continue;
                        }
                        //The node children must be visited to determine the current node width change
                        //----------------------------------------------------------------------------
                        for ( var child = 0 ; child < current.node.children.length ; child++ ){
                            var theNew = {iterated : false , node : current.node.children[child] };
                            theNew.node.resizeAmount = Math.floor( current.node.resizeAmount * theNew.node.getWidth() / current.node.getWidth() );
                            theNew.node.minimumWidth = Math.ceil( current.node.getImmutableWidth()  * theNew.node.DOMelement.width() / current.node.DOMelement.width() );  
                            theNew.node.resizeAcumulator= 0; 
                            stack.push(theNew);
                            childrenNodes.push(theNew);
                        }
                        //The current node is a final node , the current node can be resized without problem
                        if ( current.node.children.length === 0 &&  current.node.isVisible()){
                            current.node.resizeAcumulator = current.node.resizeAmount; 
                            if ( sign < 0){
                                var parentRestric= false;
                                var childRestric = false;
                                if ( current.node.minimumWidth > current.node.getWidth() - current.node.resizeAmount ){
                                    parentRestric =  current.node.getWidth() - current.node.minimumWidth;
                                }
                                if ( current.node.resizeAmount > current.node.getMutableWidth() ){
                                    childRestric = current.node.getMutableWidth() - 1;
                                }
                                if ( parentRestric || childRestric ){
                                    parentRestric = parentRestric === false ? Number.MAX_VALUE : parentRestric;
                                    childRestric  = childRestric  === false ? Number.MAX_VALUE : childRestric;
                                    current.node.resizeAcumulator = parentRestric < childRestric ? parentRestric : childRestric;
                                }
                            }
                            leafNodes.push(current);
                            
                            
                        }
                        //The current node was visited
                        //----------------------------
                        current.iterated = true;


                    } while ( stack.length > 1);
                    // Applying possible width to all the descendant nodes 
                    for ( var i = 0 ; i < childrenNodes.length ; i++){
                        childrenNodes[i].node.DOMelement.width( childrenNodes[i].node.resizeAcumulator * sign + childrenNodes[i].node.getMutableWidth()   );
                    }
                    // Applying possible width to all the body elements
                    for ( i = 0 ; i < leafNodes.length ; i++){
                        var id = leafNodes[i].node.parent.DOMelement.attr(attributes.id);
                        body.find( '.' + id ).width( leafNodes[i].node.getMutableWidth() );
                    }
                    // Applying possible width to all parent nodes
                    for( var ancestor = resizeRootNode.parent; ancestor ; ancestor = ancestor.parent) {
                        ancestor.DOMelement.width( ancestor.getMutableWidth() + resizeRootNode.resizeAcumulator * sign );
                    }

                }
            });

            $(this).on('resizestart', function (e) {
                e.stopPropagation();
            });
        });
    };


    /**
     * @method draggable
     * Enables dragging columns or column groups. Columns can be dragged within their group.
     */
    this.draggable = function() {

        // Initialize handler for column dragging
        head.find(selectors.th).mousedown(function(event) {

            // Prevents children from triggering this event
            // Only accepts left click to drag
            if (event.target != this || event.which != 1) {
                return;
            }

            //$(selectors.th).unbind('mousedown');

            /** Width of this column (or column group) **/
            var width = $(this).width();

            var groupId = $(this).attr(attributes.id);

            /** Initial position of the element in the page **/
            floater.startPosX    = $(this).offset().left - $(window).scrollLeft();
            floater.startPosY    = $(this).offset().top + $(window).scrollTop();
            floater.mouseOffsetX = event.pageX - floater.startPosX;
            floater.groupId      = groupId;

            var parentNode = tableNodes[groupId].parent.DOMelement;
            if (!parentNode || parentNode.length < 1) {
                parentNode = head;
            }
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

            /** Sets initial position of the floater **/
            floater.DOMelement.css('top', head.offset().top - $(document).scrollTop());
            floater.DOMelement.css('left', -floater.mouseOffsetX);

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
    };

    /**
     * Utility function to add 'afterElement' after the last found element with a given class 'groupId'
     *
     * @param {Object} element - The element where it will be inserted.
     * @param {String} groupId - The id.
     * @param {Object} afterElement - The element being inserted into 'element'.
     * @author lopis
     */
    function afterLastOfType (element, groupId, afterElement) {
        var lastOfGroup = element.find('.' + groupId).last();
        if (lastOfGroup.length > 0) {
            lastOfGroup.after(afterElement);
        }
    }

    /** 
     * Updates the position of the floater with the current position of the mouse. Restricts
     * the position of the floater to the limits of the col group (defined in floater).
     *
     * @param {Event} e - The mouse move event.
     * @author lopis
     */
    function refreshFloater (e) {
        var scrollLeft = $(window).scrollLeft();
        var pos = Math.max(Math.min(e.pageX, floater.upperBoundX- scrollLeft), floater.lowerBoundX- scrollLeft); 
        floater.DOMelement.css('transform', 'translateX('+pos+'px)');
        //floater.DOMelement.find(selectors.head).css('transform', 'translateY('+(30+$(window).scrollTop())+'px)');
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
        var rowToUpdate = placeHolder.first().parents(selectors.row);
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

        /* Apply current column order in the tree */
        var newChildren = [];
        rowToUpdate.find('.' + tableNodes[floater.groupId].parent.id).each(function () {
            newChildren.push($(this).attr(attributes.id));
        });

        tableNodes[floater.groupId].parent.children.sort(function (arg1, arg2) {
            return newChildren.indexOf(arg1.id) -  newChildren.indexOf(arg2.id);
        });

        /** Removes the placeholder **/
        $('.cm-drag-placeholder').remove();

        /** Clears the drag **/
        floater.DOMelement.find(selectors.row).remove();
    }

    /**
     * @method refreshPlaceHolder
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
        var scrollLeft = $(window).scrollLeft();
        var mouseX = Math.max(Math.min(event.pageX + scrollLeft, floater.upperBoundX), floater.lowerBoundX) - floater.mouseOffsetX; 

        if (mouseX >= offset + nextSibling.width() * 0.4) {
            movePlaceholder(firstPlaceholder, true, nextSibling.attr(attributes.id));
        } else if (mouseX <= offset - prevSibling.width() * 0.6) {
            movePlaceholder(firstPlaceholder, false, prevSibling.attr(attributes.id));
        } else {

        }
    }

    /**
     * When the floater moves beyond a certain point, the placeholder jumps forward or backward.
     * @param {Boolean} isForward - True if the placeholder should move forward, false otherwise.
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

    /**
     * @method headerSticky
     * Makes the header sticky when the container scrolls past the top.
     *
     * @param {Object} container - An object, typically as returned by '$(window)', that is being scrolled on.
     */
    this.headerSticky = function(container) {
        container.scroll(function () {
            var scrollTop = container.scrollTop();
            var offsetTop = container.offset() ? 0 : table.offset().top; 
            var offsetBottom = table.height() - head.height();
            if (scrollTop > offsetTop + offsetBottom) {
                head.css('transform', 'translateY('+offsetBottom+'px)');
            } else if(scrollTop > offsetTop) {
                head.css('transform', 'translateY('+(scrollTop-offsetTop)+'px)');
            } else {
                head.css('transform', 'translateY(0px)');
            }
        });

        $(document).ready(function () {
            container.scroll(); // triggers the repositioning of the header
        });
    };

    /**
     * @method updateTable
     * When the table structure has been manually changed, such as when lines or columns
     * have been inserted or removed, the table tree must be updated, or [colme] won't behave correctly.
     *
     * @author lopis
     */
    this.updateTable = function() {
        // Refreshed the table tree representation.
        for ( var i = 0; i < tableNodes.length; i++) {
            delete tableNodes[i];
        }
        createTree();
        root.setCellWidth();
        table.trigger('colme:isReady');
    };

    this.refreshWidth = function(node) {
        node.resizeAmount = 0;
        node.resizeAcumulator = 0;

        for( var child in node.children){
            this.refreshWidth(node.children[child]);
        }
        if ( node.parent ){
            if (node.children.length) {
                node.DOMelement.width( node.getWidthResize(node.resizeAcumulator ) );
            }
            node.parent.resizeAcumulator += node.getWidth();
        }
    };

    /**
     * Creates a tree representation of the table using the colspan values to
     * establish relationships between columns.
     *
     * @author carlosmtx
     * @author lopis
     */
    function createTree(){
        head.find(selectors.row).first().find(selectors.th).each(function () {
            var c = parseInt($(this).attr(attributes.span));
            colCount += !c ? 1 : c;
        });

        root = new Node(undefined,colCount,0);
        var headerRows = head.find(selectors.row);
        var currParents = [root];
        // Iteration through each row
        //-------------------------------
        for ( var i = 0; i < headerRows.length; i++) {

            var newParents=[];
            var currentOffset = 0;
            var ths = $( headerRows[i] ).find(selectors.th);

            // Iterating through each th inside a row
            //---------------------------------------
            for ( var  j = 0 ; j < ths.length ; j++ ){
                var colspan = $(ths[j]).attr(attributes.span);
                colspan = parseInt( !colspan ? '1' : colspan);
                var newChild = 0;

                // Checking which parent is the newChild parent (?)
                // ------------------------------------------------
                for( var k = 0 ; k < currParents.length ; k++){
                    if ( currentOffset < currParents[k].colspanOffset + currParents[k].colspan  ){
                        var newChildId = 'cm-'+i+'-'+j+'-'+k ;
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
        for ( var node in tableNodes){
            if ( tableNodes[node].children.length === 0){
                leafs.push(tableNodes[node]);
            }
        }
        /* Connects the last row of the header (the 'leafs') to the first row of the body */
        var firstRow = body.find(selectors.row).first();
        for ( var leaf = 0 ; leaf < leafs.length ; leaf++){
            firstRow.find('.' + leafs[leaf].id ).each(function(index){
                var newNode = new Node( leafs[leaf] , 1 , 0, leafs[leaf].id + '--' + leaf + '--' + index);
                newNode.DOMelement = $(this);
                leafs[leaf].addChild(newNode);
                tableNodes[newNode.id] = newNode;
                newNode.DOMelement.attr(attributes.id, newNode.id);
            });
        }
        /* Sets the correct width of the headers */
    }

    function addMarkup(){
        var rows = head.find(selectors.row);
        rows.each(function(){
            $(this).children('div').each( function(){
                $(this).addClass(classes.th);
            });
        });

        rows = body.find(selectors.row);
        rows.each(function(){
            $(this).children('div').each( function(){
                $(this).addClass(classes.td);
            });
        });

    }

    addMarkup();
    createTree();
    this.refreshWidth(root);

    /* Inits jquery plugin and sets handlers for resizing */
    if (options.resizable) {
        this.resizable();
    }

    /* Creates floater and sets dragging handlers */
    if (options.draggable) {
        var currentFloater = $('#' + attributes.floater);
        if (currentFloater.length === 0) {
            floater.DOMelement = $('<div>', {id: attributes.floater});
            floater.DOMelement.append($('<div>', {class: selectors.head.replace('.','')}));
            floater.DOMelement.append($('<div>', {class: selectors.body.replace('.','')}));
            floater.DOMelement.css({position: 'fixed'});
            table.append(floater.DOMelement);
        } else {
            floater.DOMelement = currentFloater;
        }

        this.draggable();
    }

    /* Sets scroll handlers to control table header */
    if (options.sticky) {
        this.headerSticky(options.sticky);
    }

    /* Sets toggling handlers */
    if (options.toggleable) {
        this.toggleable();
    }

    doYouBelieveInMiracles();
    table.trigger('colme:isReady');

    /**
     * The structure that defines the table is represented internally by a tree, composed of Nodes.
     * The tree can be transversed in both directions to allow propagation of actions up and down.
     * The tree never changes after performing an action on the table. If changes occur, the tree must be
     * refreshed with this.updateTable().
     *
     * @param {Node} parent - The direct ancestor
     * @param {int} colspan - Colspan of this cell
     * @param {int} colspanOffset - Sum of colspans before this cell
     * @param {String} newId - And ID for this cell
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
        this.DOMelement     = head.find('['+attributes.id+'='+newId+']');

        //This Elements exist to help the tree traversing when resizing
        //-------------------------------------------------
        this.resizeAcumulator = 0; 
        this.resizeAmount = 0;
        this.minimumWidth = 0;
        
        if (this.parent) {
            this.classes = this.parent.classes + ' ' + this.parent.id;
        }

        this.addChild = function(child){
            this.children.push(child);
        };

        this.getWidth = function(){

            return this.DOMelement.width() + 
                    parseInt(this.DOMelement.css('border-left-width')) + 
                    parseInt(this.DOMelement.css('border-right-width')) +
                    parseInt(this.DOMelement.css('padding-left')) +
                    parseInt(this.DOMelement.css('padding-right'))+
                    parseInt(this.DOMelement.css('margin-right'))+
                    parseInt(this.DOMelement.css('margin-left'));
        };

        this.getWidthResize = function(targetWidth){
            return targetWidth - 
                    (
                       parseInt(this.DOMelement.css('border-left-width')) + 
                       parseInt(this.DOMelement.css('border-right-width')) +
                       parseInt(this.DOMelement.css('padding-left')) +
                       parseInt(this.DOMelement.css('padding-right'))+
                       parseInt(this.DOMelement.css('margin-right'))+
                       parseInt(this.DOMelement.css('margin-left'))
                    );
        };

        this.getImmutableWidth = function(){
            return parseInt(this.DOMelement.css('border-left-width')) + 
                   parseInt(this.DOMelement.css('border-right-width')) +
                   parseInt(this.DOMelement.css('padding-left')) +
                   parseInt(this.DOMelement.css('padding-right'))+
                   parseInt(this.DOMelement.css('margin-right'))+
                   parseInt(this.DOMelement.css('margin-left'));
        };

        this.getMutableWidth = function(){
            return parseInt( this.DOMelement.width() );
        };

        this.isVisible = function(){
            if ( !this.DOMelement){
                return true;
            }
            return this.DOMelement.hasClass('cm-hidden') ? false : true;
        };

        this.toJSON = function() {
          return {
                colspan : this.colspan,
                id : this.id,
                children : this.children
          };
        };

        this.toObject = function() {
          var obj = {
                colspan  : this.colspan,
                id       : this.id,
                width    : this.DOMelement.width(),
                children : [],
                visible  : !this.DOMelement.hasClass('cm-hidden'),
          };

          for ( var i in this.children ){
            obj.children.push( this.children[i].toObject() );
          }
          return obj;
        };

        /**
         * Visits all descendants and set its width equal
         * to the sum of the width of its descendants
         *
         * @author lopis
         */
        this.setCellWidth = function () {
            if (!this.children || this.children.length < 1) {
                return this.DOMelement.is(':visible') ? this.getWidth() : 0;
            } else {
                var width = 0;
                for (var i = 0; i < this.children.length; i++) {
                    width += this.children[i].setCellWidth();
                }
                if (width === 0) {
                    this.DOMelement.addClass('cm-hidden');
                } else {
                    this.DOMelement.width(this.getWidthResize(width));
                    this.DOMelement.removeClass('cm-hidden');
                }
                return width;
            }
        };
    }

}

$.fn.colme = function(options) {
    options.table = this;

    var c = new Colme(options);

        /* Public functions */
    return {
        getLayout: c.getLayout,
        setLayout: c.setLayout,
    };
};
