## Using `relationList`

TOAST UI Grid allows you to set relations between columns using the `relationList` option of a column model. The value of the `relationList` option is an array in which each element defines a unique relation between current column and the target columns.

A relation has a `columnList` property to specify the list of target columns. It also has callback functions like `isEditable`, `isDisabled` and `optionListChange` to specify the rules to change the state of target columns. The columns whose names are in the `columnList` will be affected by the result of the callback functions whenever a current column value is changed.

Every callback function receives two parameters - `value` and `rowData`. The `value` parameter is a value of the current (changing) cell. The `rowData` parameter is an object that contains the all values of the row, where the current cell is located.

### isEditable

The `isEditable` callback function determines the `editable` state of the target columns. If it returns `true`, the cells in the target columns will be editable. Otherwise, the cells will not be editable.

```javascript
grid.setColumnModelList([
    {
        title: 'col1',
        columnName: 'col1',
        relationList: [
            {
                columnList: ['col2', 'col3'],
                isEditable: function(value, rowData) {
                    return value === '1';
                }
            }    
        ]        
    },
    {
        title: 'col2',
        columnName: 'col2'
    },
    {
        title: 'col3',
        columnName: 'col3'
    }
]);
```

In the example above, 'col1' column has a `relationList` option, and the target columns are 'col2' and 'col3'. If the value of a cell in 'col1' is changed to '1', the cells in the same row that are under 'col2' or 'col3' will become not editable.


### isDisabled

The `isDisabled` callback function determines the `disabled` state of the target columns. If it returns `true`, the cells in the target column will be disabled. Otherwise, the cells will not be disabled.

The form of the callback function is the same with `isEditable`.

### optionListChange

The `optionListChange` callback function determines the option list of the target columns. It can be only used for list type columns like `checkbox`, `radio`, and `select`. It returns an array of list options, which has a same form as  `editOption.list`. Whenever the returning value of the callback function is changed, the option list of the cells in the target columns will be changed to the returning value.

```javascript
grid.setColumnModelList([
    {
        title: 'col1',
        columnName: 'col1',
        relationList: [
            columnList: ['col2'],
            optionListChange: function(value, rowData) {
                var optionList;

                if (value === '1') {
                    optionList = [
                        { text: 'opt1', value: '1' }
                        { text: 'opt2', value: '2' }    
                    ];
                } else {
                    optionList = [
                        { text: 'opt3', value: '3' }
                        { text: 'opt4', value: '4' }    
                    ]    
                }
                return optionList;
            }
        ]    
    },
    {
        title: 'col2',
        columnName: 'col2',
        editOption: {
            type: 'select'    
        }    
    }
]);
```

In the example above, the value of the 'col1' column determines the option list of the 'col2'. If the value of a cell in the 'col1' is changed to '1', the option list of a cell in 'col2' in the same row will become 'opt1' and 'opt2'. Otherwise, it will become 'opt3' and 'opt4'.

## Example Page

You can see the sample Grid, which uses `relationList` [here](https://nhnent.github.io/tui.grid/1.9.0/tutorial-example3.html).
