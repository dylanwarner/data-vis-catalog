function makeStackedAreaChart() {
    
    const dataset = 
    [{ date: new Date(2019,2), aData: 50, bData: 300, cData: 150}, {date: new Date(2019,3), aData: 0, bData: 50, cData: 100},
    { date: new Date(2019,4), aData: 200, bData: 100, cData: 300}, {date: new Date(2019,5), aData: 130, bData: 50, cData: 150},
    { date: new Date(2019,6), aData: 240, bData: 80, cData: 200}];

    let w = 600;
    let h = 300;

    let svg = d3.select('#stacked_area_chart')
        .attr('width', w)
        .attr('height', h);

    let stack = d3.stack()
        .keys(['aData','bData','cData']);
    let stackedData = stack(dataset);

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.aData + d.bData + d.cData)])
        .range([h - 40, 20]);

    let extent = d3.extent(dataset, d => d.date);
    let endDate = new Date(extent[1].getFullYear(), extent[1].getMonth());
    let xScale = d3.scaleTime()
        .domain([extent[0], endDate])
        .range([60, w - 20]);

    let colorScale = d3.scaleOrdinal()
        .domain(["aData", "bData", "cData"])
        .range(["#454F5B", "#4CBCB6" , "#B0EC77"]);

    let area = d3.area()
        .curve(d3.curveMonotoneX)
        .x(d => xScale(d.data.date))
        .y0(d => yScale(d[0]))
        .y1(d => yScale(d[1]));

    svg.selectAll('path')
        .data(stackedData)
        .enter()
        .append('path')
        .attr('class','area')
        .attr('d', area)
        .attr('fill', (d,i) => colorScale(i));

    let xAxis = d3.axisBottom(xScale)
        .ticks(dataset.length + 1)
        .tickFormat(d3.timeFormat("%b"));
    let xAxisGroup = svg.append("g")
        .attr("transform", `translate(0, ${h - 40})`)
        .call(xAxis);

    let yAxis = d3.axisLeft(yScale);
    let yAxisGroup = svg.append("g")
        .attr("transform", `translate(60, 0)`)
        .call(yAxis);
}

window.onload = function() {
    makeStackedAreaChart();
}