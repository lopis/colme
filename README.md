
Tables are often a headache to use. They're also a pain to code and manipulate. Colme.js was born out of the need to interact with large tables in a meaningful and friendly way. This plugin wraps a bunch of cool table features that can be applied to div based tables (not table based tables). 

There's always a debate over which approach is the best: using tables or using divs. There's really no need to replace tables with divs if all you want is to display tabular data - that's why they exist. But as soon as you need to make more complex manipulations, the problems grow. While developing this plugin, we tried divs and tables, and came up with the following summary of the pros and cons. TL;DR, divs won.

https://docs.google.com/document/d/1AqeYFpDNVKWpyqyL2ihqFFyYoLYe4CpxAFTqpa2m2-Q/edit

The following features are available in colme:
**Toggling columns**: hiding or showing a column, or a whole group of columns if colspans are present;
**Resizing columns**: makes use of the jQueryUI resize plugin to resize columns or columns groups;
**Dragging columns**: drag the header of a column or of a column group to drag it;
**Sticky header**: For big tables or tables inside small containers, it may be useful to make the header sticky;
**Feature selection**: developers can select which features to activate (toggling, resizing, etc);
**Layout management**: Work in progress. Allows one to save the current table layout in JSON/JS format, useful if one needs to save user preferences;


* * *

## Class: Colme


### Colme.toggleable()
Enables hiding and showing groups of columns.
To trigger a column toggle, trigger 'colme:hideColumn' event on the table.()


### Colme.resizable()
Makes columns resizable


### Colme.draggable()
Enables dragging columns or column groups. Columns can be dragged within their group.() 


### Colme.headerSticky(container)
Makes the header sticky when the container scrolls past the top.(container) 



**Parameters**

**container**: `Object`, An object, typically as returned by '$(window)', that is being scrolled on.


### Colme.updateTable()
When the table structure has been manually changed, such as when lines or columns
have been inserted or removed, the table tree must be updated, or [colme] won't behave correctly.() 




### Colme.doYouBelieveInMiracles(lots_of)

Makes miracles.

**Parameters**

**lots_of**: `Hapiness`, The stuff dreams are made of.


* * *
