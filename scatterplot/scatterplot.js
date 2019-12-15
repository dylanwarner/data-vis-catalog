function makeScatterplot(dataset) {
    
    // set width and height of chart  
    let w = 500;
    let h = 300;

    let scatterplot = d3.select('#scatterplot')
        .attr('width', w)
        .attr('height', h);

    let xScale = d3.scaleLinear()
        .domain([0,15])
        .rangeRound([0, w - 100]);
    
    let yScale = d3.scaleLinear()
        .domain([0,100])
        .rangeRound([h - 20, 20]);

    let colorScale = d3.scaleLinear()
        .domain([0,100])
        .range(['#4CBCB6','#454F5B']);

    scatterplot.selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
        .attr('cx', (d) => xScale(d.price) + 80)
        .attr('cy', (d) => yScale(d.rating))
        .attr('r', (d) => d.rating/7.5)
        .attr('fill', (d) => colorScale(d.rating))
        .on("mouseover", function(d) {
            d3.select(this).transition().duration(100)
                .attr('fill','orange');

            // x and y position to place tooltip text
            var xPos = d3.select(this).attr("x") + xScale(d.price) + 80;
            var yPos = d3.select(this).attr("y") + yScale(d.rating) - 13;

            // append tooltip text at xPos and yPos
            scatterplot.append("text")
            .attr("id", "tooltip")
            .attr("x", xPos)
            .attr("y", yPos)
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("font-weight", "bold")
            .attr("fill", "black")
            .text(d.rating);

        })
        .on("mouseout", function(d) {
            d3.select(this).transition().duration(100)
                .attr('fill', (d) => colorScale(d.rating));
            d3.select('#tooltip').remove();
        });

    scatterplot.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(80, ${h - 20})`)
        .call(d3.axisBottom(xScale)
        .tickFormat(d => d + "$"));
  
    scatterplot.append('g')
        .attr('class', 'axis-left3')
        .attr('transform', `translate(80,0 )`)
        .call(d3.axisLeft(yScale));
    
}

window.onload = function() {
    d3.csv('scatterplot.csv').then(data => {
        
        data.sort((a,b) => a.price - b.price);

        dataset = data;

        makeScatterplot(dataset);
    })
}