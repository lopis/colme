
# Table of Contents
<!-- MarkdownTOC depth=2 -->

- [API](#api)
  - [colme(table, options)](#colmetable-options)
  - [saveCurrentLayout(name](#, extra)
  - [getLayouts()](#getlayouts)
  - [set_resizable(](#value)
  - [set_draggable(](#value)
  - [set_header_sticky(](#value)
  - [set_columns_toggleable(](#value)
- [Events](#events)
  - ['colme:col:hide'](#colmecolhide)
  - ['colme:col:show'](#colmecolshow)
  - ['colme:col:resize'](#colmecolresize)

<!-- /MarkdownTOC -->


API
===========================

## colme(table, options)
Applies [colme] to 'table'.

### Params:
#### table:
ould be a div-based html table (e.g. as returned by ``$("#table")`` )
An example of a table with valid markup:


    <div class="table">
      <div class="cm-thead">
        <div class="cm-tr">
          <div class="cm-th" data-cm-group="id" col-span="1"></div>
          <div class="cm-th" data-cm-group="sales" col-span="2"></div>
        </div>
        <div class="cm-tr">
          <div class="cm-th" data-cm-group="id" data-cm-id="id"></div>
          <div class="cm-th" data-cm-group="sales" data-cm-id="sales2013"></div>
          <div class="cm-th" data-cm-group="sales" data-cm-id="sales2014"></div>
        </div>
      </div>
      <div class="cm-tbody">
        <div class="cm-tr">
          <div class="cm-td" data-cm-group="id" data-cm-id="id"></div>
          <div class="cm-td" data-cm-group="sales" data-cm-id="sales2013"></div>
          <div class="cm-td" data-cm-group="sales" data-cm-id="sales2014"></div>
        </div>
        <div class="cm-tr">
          <div class="cm-td" data-cm-group="id" data-cm-id="id"></div>
          <div class="cm-td" data-cm-group="sales" data-cm-id="sales2013"></div>
          <div class="cm-td" data-cm-group="sales" data-cm-id="sales2014"></div>
        </div>
      </div>
    </div>

#### options:
An object containing some key-value pairs. Some are mandatory and some have default values.
Options: table-class, head-class, body-class, row-class, th-class, td-class, col-id-attr, col-group-att, resizable, draggable, sticky, toggleable, 
#### table-class:
The class of the div representing the table. Must be root of 'table'.
Optional field, since it defaults to the class of the root element of 'table'.

#### head-class:
The class of the div representing the table header.
Defaults to "cm-thead".

#### body-class:
The class of the div representing the table body.
Defaults to "cm-tbody".

#### row-class:
The class of the div representing the table row.
Defaults to "cm-tr".

#### th-class:
The class of the div representing the header cell.
Defaults to "cm-th".

#### td-class:
The class of the div representing the body cell.
Defaults to "cm-td".

#### col-id-attr:
The attribute in the cells that identifies a column. Defaults to "data-cm-id".

#### col-group-attr:
The attribute in the cells that identifies a column group.
Defaults to "data-cm-group".

#### resizable:
Set to 'true' to enable resizable columns.
Defaults to false.

#### draggable:
Set to 'true' to enable dragging columns.
Defaults to false.

#### sticky:
Set to 'true' to enable sticky header, i.e. the header stays visible when the page overscrolls; the header scrolls with the table if its top or bottom is visible.

#### toggleable:
Accepts a class name of the elements that should trigger the hiding and showing of tables.

## saveCurrentLayout(name [, extra] )
Saves the current layout of the table, including each column width, column visibility and column order.
If the name already exists, overwrite the existing layout.
### Params:
#### name:
The name of the view to be saved or the name of an existing view to overwrite.
#### extra:
An object containing extra fields that might be useful to attach to this view.
E.g.: ``{'layoutClass': 'compressed-table', 'createdBy': 'john'}``

## getLayouts()
Use this to save your layouts in a database for instance.
Returns an array containing object representations of all layouts, e.g.:

    [{
      name: 'my view',
      col-widths: {
        'id': 100,
        'sales2013': 13,
        'sales2014': 15
      },
      col-visibility: {
        'id': false,
        'sales': true
      },
      col-order: [
        'id', 'sales'
      ],
      options: {
        'layoutClass': 'compressed-table',
        'createdBy': 'john'
      }
    }]

## set_resizable( [value] )
## set_draggable( [value] )
## set_header_sticky( [value] )
## set_columns_toggleable( [value] )
Use these to manually enable or disable each feature on the table.
### Parameters
#### value
Set to true to enable the feature or false to disable it.
Defaults to true.

Events
===========================

## 'colme:col:hide'
Event triggered on the table after a column has been hidden
### Parameters:
#### col-group
The column group that was hidden

## 'colme:col:show'
Event triggered on the table after a column has been shown
### Parameters:
#### col-group
The name of the column group that was shown

## 'colme:col:resize'
Triggered after a column finished resizing and style updated.
### Parameters:
#### col-id:
The id column of the column 


save_current_layout(table, view_name)
set_current_view(table, view_name)
remove_view(table, view_name)
