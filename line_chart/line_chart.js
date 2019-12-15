let parseDate = d3.timeParse("%Y-%m-%d");
let key = d => d.date;

function rowConverter(d) {
    return {
        date: parseDate(d.date),
        sleep: parseFloat(d.hours_of_sleep)
    }
}

function createLineChart(dataset) {
    
    // set width and height of chart with margins
    var margin = {top: 0, right: -10, bottom: 5, left: 10};  
    let w = 600 - margin.left - margin.right;
    let h = 300 - margin.top - margin.bottom;

    let svg = d3.select('#line_chart')
        .attr('width', w)
        .attr('height', h)
        .append('g')
        .attr('transform', "translate(" + margin.right + "," + margin.top + ")");
    
    // y scale
    let yScale = d3.scaleLinear()
        .domain([0,12])
        .range([h - 20, 20]);

    // x scale
    let xScale = d3.scaleTime()
        .domain(d3.extent(dataset, d => d.date))
        .range([30, w - 20]);
    
    // set up x axis
    let xAxis = d3.axisBottom(xScale)
        .ticks(dataset.length + 1)
        .tickFormat(d3.timeFormat("%a"));
    let xAxisGroup = svg.append("g")
        .attr("transform", `translate(0, ${h - 20})`)
        .call(xAxis);

    // set up y axis
    let yAxis = d3.axisLeft(yScale);
    let yAxisGroup = svg.append("g")
        .attr("transform", `translate(30,0)`)
        .call(yAxis);

    // dashed hover line
    let dash_line = svg.append('line')
        .attr('class','line')
        .attr('stroke', 'orange')
        .style('stroke-dasharray',('3,3'))
        .attr('stroke-width','2')
        .attr("x1",100)
        .attr("x2",400)
        .attr("y1",200)
        .attr("y2",200)
        .style("display", "none");
    
    // create line
    let line = d3.line()
                 .x(d => xScale(d.date))
                 .y(d => yScale(d.sleep));

    // append the line for the dataset
    svg.append('path')
       .datum(dataset)
       .attr('class', 'line')
       .attr('d', line)
       .attr('fill', 'none')
       .attr('stroke', '#4CBCB6')
       .attr('stroke-width','2');

    // append dots to line data points
    svg.selectAll('.dot')
       .data(dataset, key)
       .enter()
       .append("circle")
       .attr("cx", d => xScale(d.date))
       .attr("cy", d => yScale(d.sleep))
       .attr('r', 5)
       .style("fill", '#454F5B')
       .on("mouseover", function(d) {
           d3.select(this).transition().duration(100)
             .attr("r", 8);

             // x and y position to place tooltip text
             var xPos = d3.select(this).attr("x") + xScale(d.date) + 20;
             var yPos = d3.select(this).attr("y") + yScale(d.sleep) + 4;
           
             // append tooltip text at xPos and yPos
             svg.append("text")
             .attr("id", "tooltip")
             .attr("x", xPos)
             .attr("y", yPos)
             .attr("text-anchor", "middle")
             .attr("font-family", "sans-serif")
             .attr("font-size", "11px")
             .attr("font-weight", "bold")
             .attr("fill", "black")
             .text(d.sleep);

           // display dashed line to point
           dash_line.transition().duration(10)
             .style("display", "block")
             .attr("x1", xScale(d.date))
             .attr("y1", yScale(d.sleep))
             .attr("x2", xScale(d.date) + 0.5)
             .attr("y2", h - 20)
       })
       .on("mouseout", function(d) {
           // set radius back to 5
           d3.select(this).transition().duration(100)
             .attr("r",5);
           // remove dashed line
           dash_line.style("display","none");
           // remove tooltip
           d3.select("#tooltip").remove();
       });
}

window.onload = function() {
    d3.csv('line_chart.csv', rowConverter).then(data => {
       
        data.sort((a,b) => a.date - b.date);

        dataset = data;

        createLineChart(dataset);
    })
}