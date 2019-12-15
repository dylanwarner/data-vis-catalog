function makeStackedBarChart() {

    let dataset = [
        {date: new Date(2019, 2), food: 150.00, coffee: 50.00, gas: 50.00 }, 
        {date: new Date(2019, 3), food: 200.00, coffee: 30.00, gas: 72.00 }, 
        {date: new Date(2019, 4), food: 120.00, coffee: 150.00, gas: 40.00 }, 
        {date: new Date(2019, 5), food: 215.00, coffee: 75.00, gas: 63.00 } ];
    
    let w = 600;
    let h = 350;

    let stack = d3.stack()
        .keys(['food','coffee','gas']);
    let stackedData = stack(dataset);

    console.table(stackedData);

    let svg = d3.select("#stacked_bar_chart")
        .attr("width", w)
        .attr("height", h);

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.food + d.coffee + d.gas) + 80])
        .range([h - 40, 20]);

    let extent = d3.extent(dataset, d => d.date);
    let endDate = new Date(extent[1].getFullYear(), extent[1].getMonth() + 1);
    let xScale = d3.scaleTime()
        .domain([extent[0], endDate])
        .range([60, w - 20]);

    let colorScale = d3.scaleOrdinal()
        .domain(["food", "coffee", "gas"])
        .range(["#454F5B", "#4CBCB6" , "#B0EC77"]);

    let legendScale = d3.scaleOrdinal()
        .domain(["Food", "Coffee", "Gas"])
        .range(["#454F5B", "#4CBCB6" , "#B0EC77"]);

    let groups = svg.selectAll('g')
        .data(stackedData)
        .enter()
        .append('g')
            .style('fill', (d,i) => colorScale(i));
    
    let barlen = (w - 40) / dataset.length - 20;

    groups.selectAll('rect')
        .data(d => d)
        .enter()
        .append('rect')
            .attr('x', d => xScale(d.data.date))
            .attr('y', d => yScale(d[1]))
            .attr('width', barlen)
            .attr('height', d => yScale(d[0]) - yScale(d[1]))
            .on("mouseover", function(d) {
                
            })
            .on("mouseout", function(d) {
            
            });

    let xAxis = d3.axisBottom(xScale)
        .ticks(dataset.length)
        .tickFormat(d3.timeFormat("%b"));
    let xAxisGroup = svg.append("g")
        .attr("transform", `translate(0, ${h - 40})`)
        .call(xAxis);

    let yAxis = d3.axisLeft(yScale);
    let yAxisGroup = svg.append("g")
          .attr("transform", `translate(60, 0)`)
          .call(yAxis);

    // LEGEND - built using Susie Lu's d3.svg.legend package
    svg.append("g")
        .attr("class", "legendOrdinal")
        .attr("transform", "translate(80,20)")
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");

    var legendOrdinal = d3.legendColor()
    .shape("path", d3.symbol().type(d3.symbolSquare).size(60)())
    .shapePadding(10)
    .scale(legendScale);

    svg.select(".legendOrdinal")
    .call(legendOrdinal);
}

window.onload = function() {

    makeStackedBarChart();
}