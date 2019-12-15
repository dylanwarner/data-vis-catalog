function makeTreeMap(dataset) {

    let root = d3.hierarchy(dataset)
        .sum(d => d.data.size);

    let colorScale = d3.scaleOrdinal()
    .range(["rgb(237,248,233)","#daf1f0","#a2ddd9","#45bab2","#29706b"]);

    let w = 500;
    let h = 300;

    let svg = d3.select("#tree_map")
        .attr('width', w)
        .attr('height', h);

    let treemap = d3.treemap()
        .size([w,h])
        .padding(8);

    treemap(root);

    svg.selectAll('rect')
        .data(root.descendants())
        .enter()
        .append('rect')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .style('fill', d => colorScale(d.depth))
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0);

    label = svg.append('g')
        .attr("font-family", "sans-serif")
        .attr("font-size", "7.5px")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .selectAll('text')
        .data(root.descendants())
        .join('text')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .text(d => d.data.id);

}

window.onload = function() {
    d3.csv('tree_map.csv').then((data) => {
        dataset = d3.stratify()(data);
        makeTreeMap(dataset);
    });
}