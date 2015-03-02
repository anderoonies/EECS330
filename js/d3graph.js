// Adds the svg canvas
$(document).ready(function() {
/* ----- d3 ----- */

    d3.selection.prototype.position = function() {

        var el = this.node();
        var elPos = el.getBoundingClientRect();
        var vpPos = getVpPos(el);

        function getVpPos(el) {
            if(el.parentElement.tagName === 'svg') {
                return el.parentElement.getBoundingClientRect();
            }
            return getVpPos(el.parentElement);
        }

        return {
            top: elPos.top - vpPos.top,
            left: elPos.left - vpPos.left,
            width: elPos.width,
            bottom: elPos.bottom - vpPos.top,
            height: elPos.height,
            right: elPos.right - vpPos.left
        };

    };
    // Set the dimensions of the canvas / graph
    var margin = {top: 30, right: 20, bottom: 30, left: 50},
        width = $('#left-viewpane').width() - margin.left - margin.right,
        height = $('#left-viewpane').height() - margin.top - margin.bottom;

    // Parse the date / time
    var parseDate = d3.time.format("%d-%b-%y").parse,
        bisectDate = d3.bisector(function(d) { return d.date; }).left,
        formatTime = d3.time.format("%e %B");

    // Set the ranges
    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(5);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(5);

    // Define the line
    var valueline = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.close); });

    var svg = d3.select("#left-viewpane")
        .append("svg")
            .attr("width","100%")
            .attr("height", "100%")
        .append("g")
            .attr("transform", 
                  "translate(" + margin.left + "," + margin.top + ")");

    var div = d3.select('body').append("div")   
        .attr("class", "tooltip")
        .attr("position", "absolute")               
        .style("opacity", 0);

    var focus = svg.append("g").style("display", "none");

    var itemList = d3.select('#itemlist')
    // Get the data
    d3.csv("js/data.csv", function(error, data) {
        data.forEach(function(d) {
            d.date = parseDate(d.date);
            d.close = +d.close;
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.close; })]);

        // Add the valueline path.
        svg.append("path")
            .attr("class", "line")
            .attr("d", valueline(data));

        // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        svg.selectAll("dot")    
        .data(data)         
        .enter().append("circle")                               
        .attr("r", 5)       
        .attr("cx", function(d) { return x(d.date); })       
        .attr("cy", function(d) { return y(d.close); })     

        itemList.selectAll("td")
                .data(data)
                .text(function(d){return formatTime(d.date) + "-" + d.close + " mile run"})
                .on("click", function(e){
                    var node = svg.selectAll('circle')
                                  .filter(function(f){return f.date == e.date})
                                  .attr('fill', 'red')

                    div.transition()        
                        .duration(200)      
                        .style("opacity", .9);      
                    div.html(formatTime(node.data()[0].date) + "<br/>"  + node.data()[0].close)  
                        .style("left", node[0][0].getBoundingClientRect().left + "px")     
                        .style("top", node[0][0].getBoundingClientRect().top -28 + "px");    

                        console.log(node.data());
                }) 
    });
});