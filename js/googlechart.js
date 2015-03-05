// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {

  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Macronutrient');
  data.addColumn('number', 'Percent');
  data.addRows([
    ['Fat', 28],
    ['Protein', 22],
    ['Carbohydrates', 50],
  ]);

  // Set chart options
  var options = {'width':'auto',
                 'height':'300',
                'colors': ['#CD5C5C', '#C2E066', '#5CAFE6'],
                'legend': {position: 'bottom'}};

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}




//   <body>
//     <!--Div that will hold the pie chart-->
//     <div id="chart_div"></div>
//   </body>
// </html>