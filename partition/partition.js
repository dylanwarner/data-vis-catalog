function makePartition() {
    
    let dataset = {
        "name": "Bob",
        "children": [
          { "name": "Linda", 
            "children": [ 
              { "name": "Louise",
                "children": [
                    {"name": "Gene"},
                    {"name": "Tina"},
                ]
              },
              { "name": "Jimmy" },
              { "name": "Teddy" },
              { "name": "Rudy" },
          ]},
          { "name": "Lois",
          "children": [
            { "name": "Meg"},
            { "name": "Griffin"}
          ]
          },
          { "name": "Rob" }
        ]
      };
   
    let root = d3.hierarchy(dataset)
      .count();

    let colorScale = d3.scaleOrdinal()
        .range(['#C9F46A','#B0EC77','#4CBCB6','#454F5B','#E4F9B6']);

    console.log(root);

    let w = 500;
    let h = 300;

    let svg = d3.select("#partition")
        .attr('width', w)
        .attr('height', h);

    let partition = d3.partition()
        .size([w,h])
        .padding(1);

    partition(root);

    svg.selectAll('rect')
     .data(root.descendants())
     .enter()
     .append('rect')
     .style('fill', d => colorScale(d.depth))
     .classed('partition-area', true)
     .attr('x', d => d.x0 )
     .attr('y', d => d.y0 )
     .attr('width', d => (d.x1 - d.x0) )
     .attr('height', d => (d.y1 - d.y0));

    svg.selectAll('text')
     .data(root.descendants())
     .enter()
     .append('text')
     .attr("font-family", "sans-serif")
     .attr("font-size", "11px")
     .attr("font-weight", "bold")
     .attr("fill", "black")
     .classed('node-label', true)
     .attr('x', d => d.x0 + 10)
     .attr('y', d => d.y0 + 25)
     .text(d => d.data.name);



}

window.onload = function() {
    makePartition();
}