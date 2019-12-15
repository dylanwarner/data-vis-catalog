let parseDate = d3.timeParse("%Y-%m-%d");

function rowConverter(d) {
    return {
        date: parseDate(d.date)
    }
}

function makeCandlestick(dataset) {

    let w = 500;
    let h = 300;

    let svg = d3.select("#candlestick")
        .attr("width", w)
        .attr("height", h);

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

    let yScale = d3.scaleLinear()
        .domain([161,181])
        .range([h - 20, 20]);
    // set up y axis
    let yAxis = d3.axisLeft(yScale);
    let yAxisGroup = svg.append("g")
        .attr("transform", `translate(30,0)`)
        .call(yAxis);

    let candle = svg.append("g")
    .attr("stroke", "black")
    .selectAll("g")
    .data(dataset)
    .join("g")
        .attr("")

    
}

window.onload = function() {
    d3.csv('candlestick.csv', rowConverter).then(data => {
       
        data.sort((a,b) => a.date - b.date);

        dataset = data;

        makeCandlestick(dataset);
    })
}