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
    if (!options.attributes) {
        options.attributes = {};
    }

    this.selectors = {
        table : ( options.selectors.table ? options.selectors.table : "#cm-table" ),
        head  : ( options.selectors.head  ? options.selectors.head  : ".cm-thead" ),
        body  : ( options.selectors.body  ? options.selectors.body  : ".cm-tbody" ),
        row   : ( options.selectors.row   ? options.selectors.row   : ".cm-tr" ),
        th    : ( options.selectors.th    ? options.selectors.th    : ".cm-th" ),
        td    : ( options.selectors.td    ? options.selectors.td    : ".cm-td" ),
    };

    this.attributes = {
        colId    : ( options.attributes.id    ? options.attributes.id    : "data-cm-id" ),
        colGroup : ( options.attributes.group ? options.attributes.group : "data-cm-group" )
    };

    this.table = $(this.selectors.table);
    this.head = this.table.find(this.selectors.head);
    this.body = this.table.find(this.selectors.body);




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
        var colIds = this.head.find(this.selectors.th + "[" + this.attributes.colId + "]");
        console.log(colIds);
        $(colIds).each(function () {
            $(this).resizable({
                handles:    'e',
                distance:    3,
                helper:     'ui-resizable-helper',
                stop:       function(event, ui) {
                    $(cm.selectors.table).trigger('colme:col:resize', [ui]);
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


