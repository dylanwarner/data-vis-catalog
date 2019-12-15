function makePieChart(dataset) {
    
    // set width and height of chart with margins
    var margin = {top: 20, right: 20, bottom: 40, left: 30};  
    let w = 420;
    let h = 300;
    let innerRadius = 0;
    let outerRadius = h/2;

    let pieChart = d3.select('#pie_chart')
        .attr('width', w)
        .attr('height', h + margin.bottom)
        .append('g')
        .attr('transform', "translate(" + margin.left + "," + margin.top + ")");

    let pie = d3.pie()
        .value(d => d.value);
    
    let arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    let arcHover = d3.arc().outerRadius(outerRadius + 5).innerRadius(innerRadius);

    let colorScale = d3.scaleOrdinal()
        .domain(["water","coffee","clothes","food","other"])
        .range(['#C9F46A','#B0EC77','#4CBCB6','#454F5B','#E4F9B6']);
        
    let legendScale = d3.scaleOrdinal()
        .domain(["Food","Clothes","Coffee","Water","Other"])
        .range(['#454F5B','#4CBCB6','#B0EC77','#C9F46A','#E4F9B6']);
    
    let arcs = pieChart.selectAll('g.arc')
        .data(pie(dataset))
        .enter()
        .append('g')
            .attr('class','arc')
            .attr('transform', `translate(${h/2}, ${h/2})`);
    
    arcs.append('path')
        .attr('fill', (d) => colorScale(d.value))
        .attr('d', arc)
        .on("mouseover", function(d) {
            d3.select(this).transition().duration(100)
                .attr('fill', 'orange')
                .attr("d", arcHover);
        })
        .on("mouseout", function(d) {
            d3.select(this).transition().duration(100)
                .attr('fill', (d) => colorScale(d.value))
                .attr("d", arc);
        });

        arcs.append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .attr("font-family", "sans-serif")
            .attr("font-size", "13px")
            .attr("font-weight", "bold")
            .attr("fill", "black")
            .text(d => d.value);

    // LEGEND - built using Susie Lu's d3.svg.legend package
    pieChart.append("g")
    .attr("class", "legendOrdinal")
    .attr("transform", "translate(320,20)")
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");

    var legendOrdinal = d3.legendColor()
        .shape("path", d3.symbol().type(d3.symbolSquare).size(60)())
        .shapePadding(10)
        .scale(legendScale);

    pieChart.select(".legendOrdinal")
        .call(legendOrdinal);
    
}

window.onload = function() {
    d3.csv('pie_chart.csv').then(data => {
        
        dataset = data;

        makePieChart(dataset);
    })
}