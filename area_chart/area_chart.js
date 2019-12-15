let parseDate = d3.timeParse("%Y-%m-%d");
let key = d => d.date;

function rowConverter(d) {
    return {
        date: parseDate(d.date),
        sleep: parseFloat(d.hours_of_sleep)
    }
}

function makeAreaChart(dataset) {
    
    // set width and height of chart  
    let w = 600;
    let h = 300;

    let svg = d3.select('#area_chart')
        .attr('width', w)
        .attr('height',h);
    
    let yScale = d3
        .scaleLinear()
        .domain([0, 12])
        .range([h - 20, 20]);
    
    let xScale = d3
        .scaleTime()
        .domain(d3.extent(dataset, d => d.date))
        .range([30, w - 20]);
    
    let xAxis = d3
        .axisBottom(xScale)
        .ticks(dataset.length + 1)
        .tickFormat(d3.timeFormat("%a"));
    let xAxisGroup = svg
        .append("g")
        .attr("transform", `translate(0, ${h - 20})`)
        .call(xAxis);
    
    let yAxis = d3.axisLeft(yScale);
    let yAxisGroup = svg
          .append("g")
          .attr("transform", `translate(30, 0)`)
          .call(yAxis);
    
    let area = d3.area()
          .curve(d3.curveMonotoneX)
          .x(d => xScale(d.date))
          .y0(d => yScale(d.sleep))
          .y1(yScale.range()[0]);

    svg.append('path')
        .datum(dataset)
        .attr('class', 'area')
        .attr('fill', '#4CBDB6')
        .attr('opacity', '0.8')
        .attr('d', area);
}

window.onload = function() {
    d3.csv('area_chart.csv', rowConverter).then(data => {
        
        data.sort((a,b) => a.date - b.date);

        dataset = data;

        makeAreaChart(dataset);
    })
}