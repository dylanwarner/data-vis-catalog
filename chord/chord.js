function makeChord() {

    let matrix = [
        [10000,  5045, 7514, 2453],
        [2345, 9987, 2000, 5678],
        [8098, 16543, 7865, 6098],
        [900, 200, 400, 8000]
    ];

    let w = 440;
    let h = 440;

    let svg = d3.select("#chord")
        .attr("width", w)
        .attr("height", h)
        .append("g")
        .attr("transform", "translate(220,220)");

    let chord = d3.chord()
        .padAngle(0.05)
        .sortSubgroups(d3.descending)
        (matrix);

    svg.datum(chord)
        .append("g")
        .selectAll("g")
        .data(d => d.groups)
        .enter()
        .append("g")
        .append("path")
            .style("fill", "grey")
            .style("stroke", "black")
            .attr("d", d3.arc()
                .innerRadius(200)
                .outerRadius(210)
            );
    
    svg.datum(chord)
        .append("g")
        .selectAll("path")
        .data((d) => d)
        .enter()
        .append("path")
            .attr("d", d3.ribbon()
                .radius(200)
            )
            .style("fill", "#4CBDB6")
            .style("stroke", "black");
    
}

window.onload = function() {
    makeChord();
}