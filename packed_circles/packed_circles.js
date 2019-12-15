function makePackedCircles(dataset) {

    let root = d3.hierarchy(dataset)
        .sum(d => d.data.size);

    let colorScale = d3.scaleOrdinal()
        .range(["#454F5B", "#4CBCB6" , "#B0EC77"]);

    let w = 600;
    let h = 350;

    let svg = d3.select("#packed_circles")
        .attr('width', w)
        .attr('height', h);

    let pack = d3.pack()
        .size([w,h])
        .padding(1);

    pack(root);
    console.log(root);

    svg.selectAll('circle')
        .data(root.descendants())
        .enter()
        .append('circle')
        .style('fill', d => colorScale(d.depth))
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => d.r);

    label = svg.append('g')
        .attr('text-anchor', 'middle')
        .attr("font-family", "sans-serif")
        .attr("font-size", "7px")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .selectAll('text')
        .data(root.descendants())
        .join('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .text(d => d.data.id);
    
}

window.onload = function() {
    d3.csv('packed_circles.csv').then((data) => {
        dataset = d3.stratify()(data);
        makePackedCircles(dataset);
    });
}