hours = [7, 6.5, 8.0, 7.6, 6.5, 7.70, 7.00, 7.28, 6.70, 9.1, 8.5, 7.98, 8.44, 7.34, 7.70, 7.13, 7.9, 8.2, 7.23, 6.77, 6.20, 6.44];
sleep_dates = ['31-Apr-12','30-Apr-12','29-Apr-12','28-Apr-12','27-Apr-12','26-Apr-12','25-Apr-12','24-Apr-12','23-Apr-12','22-Apr-12','21-Apr-12','20-Apr-12','19-Apr-12','18-Apr-12','17-Apr-12','16-Apr-12','15-Apr-12','14-Apr-12','13-Apr-12','12-Apr-12','11-Apr-12','10-Apr-12'];

miles = [8.98, 8.00, 7.70, 7.00, 7.28, 6.70, 7.98, 8.44, 7.34, 7.70, 7.13, 7.23, 6.77, 6.20, 6.44];
run_dates = ['6-Mar-15', '5-Mar-15', '3-Mar-15', '1-Mar-15', '28-Feb-15', '26-Feb-15', '24-Feb-15', '23-Feb-15', '20-Feb-15', '19-Feb-15', '18-Feb-15']




function loadData() {
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
                top: elPos.top - vpPos.top
                ,
                left: elPos.left - vpPos.left,
                width: elPos.width,
                bottom: elPos.bottom - vpPos.top,
                height: elPos.height,
                right: elPos.right - vpPos.left
            };

        };

        console.log($('#left-viewpane').width(), $('#left-viewpane').height());
        // Set the dimensions of the canvas / graph
        var margin = {top: 30, right: 20, bottom: 30, left: 50},
            width = 491 - margin.left - margin.right,
            height = 459 - margin.top - margin.bottom;

        // Parse the date / time
        var parseDate = d3.time.format("%d-%b-%y").parse,
            bisectDate = d3.bisector(function(d) { return d.date; }).left,
            formatTime = d3.time.format("%e %B");

        // Set the ranges
        var x = d3.time.scale().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);

        // Define the axes
        var xAxis = d3.svg.axis().scale(x)
            .orient("bottom")
            .ticks(5);

        var yAxis = d3.svg.axis().scale(y)
            .orient("left")
            .ticks(5);

        // Define the line
        var valueline = d3.svg.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.close); });

        var svg = d3.selectAll(".d3")
            .append("svg")
                .attr("width","100%")
                .attr("height", "100%")
            .append("g")
                .attr("transform", 
                      "translate(" + margin.left + "," + margin.top + ")");

        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 6)
            .text("Date");

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Distance (miles)");

        var div = d3.select('body').append("div")   
            .attr("class", "tooltip")
            .attr("position", "absolute")               
            .style("opacity", 0);

        var focus = svg.append("g").style("display", "none");

        var itemList = d3.selectAll('#itemlist')
        // Get the data
        var data=[]; 
        if ($('#tab1').hasClass('active')) {
            for(var i=0; i<run_dates.length; i++){
                var obj = {date: run_dates[i], close: miles[i]};
                data.push(obj);
            }
        } else {
            for(var i=0; i<sleep_dates.length; i++){
                var obj = {date: sleep_dates[i], close: hours[i]};
                data.push(obj);
            }
        }

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
                    .text(function(d){
                        if ($('#tab1').hasClass('active')) {
                            return formatTime(d.date) + "-" + d.close + " mile run"
                        } else {
                            return formatTime(d.date) + "-" + d.close + " hours of sleep"
                        }
                    })
                    .on("mouseenter", function(e){
                        var node = svg.selectAll('circle')
                                      .filter(function(f){return f.date == e.date})
                                      .attr('fill', 'red')

                        div.transition()        
                            .duration(200)      
                            .style("opacity", .9);      
                        div.html(formatTime(node.data()[0].date) + "<br/>"  + node.data()[0].close)  
                            .style("left", node[0][0].getBoundingClientRect().left + "px")     
                            .style("top", node[0][0].getBoundingClientRect().top -28 + "px");    

                    })
                    .on("mouseleave", function(e){
                        div.transition()
                            .duration(200)
                            .style("opacity", .0);
                    })
}

$(document).ready(function () {
    loadData();
});