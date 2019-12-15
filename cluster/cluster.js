function createCluster() {

    let dataset = {
        "name": "Root/Parent",
        "children": [
          { "name": "Child/Parent", 
            "children": [ 
              { "name": "Child"},
              { "name": "Child" },
              { "name": "Child" }
          
          ]},
          { "name": "Child" },
          { "name": "Child" },
          { "name": "Child" },
          { "name": "Child" }

        ]
    };

    let root = d3.hierarchy(dataset);

    let colorScale = d3.scaleOrdinal()
    .range(["#45bab2","#a2ddd9","#daf1f0","#29706b"]);
    
    let w = 500;
    let h = 300;

    let svg = d3.select("#cluster")
        .attr("width", w)
        .attr("height", h);

    let treelayout = d3.cluster().size([w - 40, h - 40]);

    treelayout(root);

    svg.selectAll('lines')
     .data(root.links())
     .enter()
     .append('line')
     .classed('link', true)
     .attr('x1', d => d.source.x + 20)
     .attr('y1', d => d.source.y + 20)
     .attr('x2', d => d.target.x + 20)
     .attr('y2', d => d.target.y + 20);

    svg.selectAll('circle')
     .data(root.descendants())
     .enter()
     .append('circle')
     .classed('node', true)
     .style('fill', d => colorScale(d.depth))
     .attr('cx', d => d.x + 20)
     .attr('cy', d => d.y + 20)
     .attr('r', 20);

    svg.selectAll('text')
     .data(root.descendants())
     .enter()
     .append('text')
     .classed('node-label', true)
     .attr("font-family", "sans-serif")
     .attr("font-size", "11px")
     .attr("font-weight", "bold")
     .attr("fill", "black")
     .classed('', true)
     .attr('x', d => d.x + 40)
     .attr('y', d => d.y + 25)
     .text(d => d.data.name);
}

window.onload = function() {
    createCluster();
}