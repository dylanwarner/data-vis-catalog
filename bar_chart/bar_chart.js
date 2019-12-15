function makeBarChart(dataset) {
    // set width and height of chart  
    let w = 600;
    let h = dataset.length * 27;

    // calculate min and max value 
    let minVal = d3.min(dataset, (d) => d.reviews);
    let maxVal = d3.max(dataset, (d) => d.reviews);

    dataset.sort((a,b) => b.reviews - a.reviews);

    let barChart = d3.select('#bar_chart')
        .attr('width', w)
        .attr('height', h);

    let xScale = d3.scaleLinear()
        .domain([0, 37511])
        .rangeRound([0, w - 100]);
    
    let yScale = d3.scaleBand()
        .domain(dataset.map((d) => d.country))
        .rangeRound([20, h-20]);
    
    let colorScale = d3.scaleLinear()
        .domain([minVal, 37511])
        .range(['#4CBCB6', '#454F5B']);

    barChart.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('x', 80)
        .attr('y', (d) => yScale(d.country))
        .attr('width', 0)
        .attr('height', 20)
        .attr('fill', (d) => colorScale(d.reviews))
        .on("mouseover", function(d) {
          d3.select(this)
            .attr("fill", "orange");
          
          var xPos = parseFloat(d3.select(this).attr("x")) + xScale(d.reviews) + 20;
          var yPos = parseFloat(d3.select(this).attr("y")) + 14;
  
          barChart.append("text")
            .attr("id", "tooltip")
            .attr("x", xPos)
            .attr("y", yPos)
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("font-weight", "bold")
            .attr("fill", "black")
            .text(d.reviews);
  
        })
        .on("mouseout", function(d) {
          d3.select(this)
            .transition()
            .duration(250)
            .attr("fill", (d) => colorScale(d.reviews));
            d3.select("#tooltip").remove();
        })
        .transition()
          .delay((d,i) => i * 100)
          .ease(d3.easeLinear)
          .attr('width', (d) => xScale(d.reviews));

    let xAxis = d3.axisBottom()
          .scale(xScale);

    let yAxis = d3.axisLeft()
          .scale(yScale);

    let xAxisGroup = barChart.append('g')
          .attr('class', 'axis')
          .attr('transform', `translate(80, ${h - 20})`)
          .call(xAxis);
    
    let yAxisGroup = barChart.append('g')
          .attr('class', 'axis-left1')
          .attr('transform', `translate(80,0 )`)
          .call(yAxis);
}

window.onload = function() {
    d3.csv('bar_chart.csv')
      .then((dataset) => {
        makeBarChart(dataset);
        console.log(dataset);
      });
}