
![colme](http://i.imgur.com/8mR7nem.png)

Tables are often a headache to use. They're also a pain to code and manipulate. Colme.js was born out of the need to interact with large tables in a meaningful and friendly way. This plugin wraps a bunch of cool table features that can be applied to div based tables (not table based tables). 

There's always a debate over which approach is the best: using tables or using divs. There's really no need to replace tables with divs if all you want is to display tabular data - that's why they exist. But as soon as you need to make more complex manipulations, the problems grow. While developing this plugin, we tried divs and tables, and came up with the following summary of the pros and cons. TL;DR, divs won.

https://docs.google.com/document/d/1AqeYFpDNVKWpyqyL2ihqFFyYoLYe4CpxAFTqpa2m2-Q/edit

The following features are available in colme:
  * **Toggling columns**: hiding or showing a column, or a whole group of columns if colspans are present;
  * **Resizing columns**: makes use of the jQueryUI resize plugin to resize columns or columns groups;
  * **Dragging columns**: drag the header of a column or of a column group to drag it;
  * **Sticky header**: For big tables or tables inside small containers, it may be useful to make the header sticky;
  * **Feature selection**: developers can select which features to activate (toggling, resizing, etc);
  * **Layout management**: allows one to save the current table layout in JSON/JS format, useful if one needs to save user preferences;


* * *

### Usage
If you want to test a working demo, checkout this link: http://codepen.io/lopis/pen/OPVVPP

To apply `colme` to your table, select your table with jQuery and call `colme()` on it, passing the necessary options.

``javascript
      $('#cm-table3').colme({
        resizable: true,
        draggable: true,
        toggleable: true,
        sticky: $(window)
      });
``

#### Options

##### Resizable
Default value is true. Each cell of the table header will get an handle that can be dragged left and right to resize that column.

##### Draggable
Default value is true. Each cell of the table will now be dragged and dropped to move the columns.

##### Toggleable
Default value is true. The table will be listening for the the event `colme:hideColumn` to hide a column or column group.

##### StickyHead
Default value is true. The table head will stick as you scroll the selected element.
  
##### Sticky
Default value is undefined. If set to an element - the container - the table header will stick to the top of the container when the container is scrolled.

##### Selectors and Attributes
It is possible to use custom classes and attribute names if you need to integrate colme with an existing site.

```javascript
      $('#my-table').colme({
        modules : {
          resizable : true,
          draggable : true,
          toggleable: true,
          stickyHead: true,
          markup    : true
        },
        sticky: $(window),
        selectors: {
          head : 'cm-thead',
          body : 'cm-tbody',
          row  : 'cm-tr',
          th   : 'cm-th',
          td   : 'cm-td',
        },
        attributes:{
          id    : 'data-cm-id',
          span  : 'data-cm-span',
        }
      });
```
  * `head`: the class of the table header; defaults to `cm-thead`
  * `body`: the class of the table body; defaults to `cm-tbody`
  * `row`: the class of the table row; defaults to `cm-tr`
  * `th`: the class of the table header cell; defaults to `cm-th`
  * `td`: the class of the table body cell; defaults to `cm-td`
  * `id`: the name of the attribute that identifies a column; defaults to `data-cm-id`
  * `span`: the name of the attribute that represents the column span; defaults to `data-cm-span`

* * *

### Public methods
If you need to use one of the features, but don't want to activate them immediately, you can call one of the following methods to enable them manually. There are also two methods available to manage layouts.

`Colme.toggleable()`
Enables hiding and showing groups of columns.
To trigger a column toggle, trigger 'colme:hideColumn' event on the table.()
The class `cm-hidden` is used to toggle the columns visibility

`Colme.resizable()`
Makes columns resizable


`Colme.draggable()`
Enables dragging columns or column groups. Columns can be dragged within their group.() 


`Colme.headerSticky(container)`
Makes the header sticky when the container scrolls past the top.(container) 

**Parameters**

**container**: `Object`, An object, typically as returned by `$(window)`, that is being scrolled on.


`Colme.updateTable()`
When the table structure has been manually changed, such as when lines or columns have been inserted or removed, the table tree must be updated, or [colme] won't behave correctly. If you add columns, layouts saved before may break.

`Colme.getLayout()`
Returns a representation of the current table layout, including column order, visibility and width. Keep in mind that column hierarchy (i.e. which column belongs to which column group) is not kept, as that is infered by the column spans. If you change the structure of the table, old layouts may break.

`Colme.setLayout(layout)`
Using `getLayout` you can save multiple layouts. Pass a layout to `setLayout` to apply it.

* * *

### Events
Colme listens or triggers to these events.

`colme:hideColumn`, `colme:showColumn`
Trigger this event on the table to hide or show a column or column group. Pass it the ID of the column you want to hide or show, like this:

```javascript
$(#my-table).trigger('colme:hideColumn', column.attr('data-cm-id'));

$(#my-table).trigger('colme:showColumn', column.attr('data-cm-id'));
```

`colme:hidden`, `colme:shown`
This event is triggered by colme. When you hide or show one column, other columns can become hidden or shown in consequence. This event includes the IDs of the columns that were hidden.

```javascript
$(#my-table).on('colme:hidden', function(event, groupIds){
  /* Do something with the IDs */
});

$(#my-table).on('colme:shown', function(event, groupIds){
  /* Do something with the IDs */
});
```

`colme:isReady`m
The plugin may take a bit to load (typically less than 100ms). When the table is ready, this event is triggered. If you call ``updateTable()``, this event is also triggered.