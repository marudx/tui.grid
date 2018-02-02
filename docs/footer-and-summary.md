The TOAST UI Grid provides the **footer** which is always shown at the bottom of a table regardless of its scroll position. As the footer is usually used to represent the summaries of each column, the TOAST UI Grid also provides useful options for that purpose. 

## Footer options

To enable the footer, you should add `footer` property to the option object which is used when creating an instance of `tui.Grid`.

```javascript
var grid = new tui.Grid({
  el: $('#grid'),
  columnModelList: [/* … */],
  footer: {
    height: 100,  // by pixel
    columnContent: {
      col1: {
        template: function() {
          return 'col1 footer';
        }
      },
      col2: {
        template: function() {
          return 'col2 footer';
        }
      }
    }
  }
});
```

The `footer.height` property sets the height of the footer by pixel unit. If this property is set to 0, the footer is not shown. 

The `footer.columnContent` property is the key-value object which configures the content of each column's footer. Each key is a name of column, and each value is an obejct which contains a `template` function which returns the HTML string. The returning string from a `template` is used to render each column's footer (&lt;th&gt; tag).

## Using Automatic Summary

If you set an object for a specific column to the `columnContent` property, the Grid automatically calculates the summary of that column. It means that whenever some values in the column are changed, the Grid re-calculate the summary. A result of summary is passed to a `template` function as a paramater so that you can use it for generating HTML string of the footer.

```javascript
// …
columnContent: {
  col1: {
    template: function(summary) {
      return 'sum: ' + summary.sum + '<br>avg: ' + summary.avg;
    }
  },
  col2: {
    template: function(summary) {
      return 'max: ' + summary.max + '<br>min: ' + summary.min;
    }
  }
}
// …
```

As you can see above, a `template` function takes a `summary` object as a parameter and it contains values like `sum`, `avg`, etc. The available types are listed below.

- `sum`: sum(total) value
- `avg`: average value
- `min`: minimum value
- `max`: maximum value
- `cnt`: count of the rows

Whenever a summary value is changed, a `template` function is called and a content of a column footer is refreshed using the returing HTML of a `template` function.

One important thing is that every value in the column must be a `Number` type. If a value is not a number type, the Grid treat it as a number `0`. 


## Disabling Automatic Summary

There is another property available for a value object of the `columnContent`. The name of the property is `useAutoSummary` and this determines whether using the automatic summary or not. As a default value of a `useAutoSummary` is `true`, if you want to use a `template` function without auto-summary, use should set this property to `false` like example below.

```javascript
// …
columnContent: {
  col1: {
    useAutoSummary: false,
    template: function() {
      return 'static content';
    }
  },
  // …
}
// …
```

Although it's possible to use a `templete` function for a static content without setting `useAutoSummary:false`, It's better to set it explicitly for preventing unnecessary calculation.

## setFooterColumnContent()

A Grid instance also has a public API to change a content of a column footer. `setFooterColumnContent()` sets the HTML string to the footer of the given column. 

```javascript
grid.setFooterColumnContent('col1', 'footer content');
```

This method is useful when you don't want to use the auto-summary and want to set your own value to the column footer dynamically. In this case, you'd better to set `useAutoSummary:false' to prevent a Grid from changing the footer content automatically.

## Example

You can see a Grid using a footer with the auto-summary at the [example page](http://nhnent.github.io/tui.grid/1.9.0/tutorial-example6.html).