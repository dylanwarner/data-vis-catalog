let force;

function makeForceDirectedGraph() {

    let dataset = {
        nodes: [
            {name: 'Adult Animation', group: 0},     // 0
            {name: 'Bobs Burgers', group: 0},        // 1
            {name: 'Bojack Horseman', group: 0},     // 2
            {name: 'Family Guy', group: 0},          // 3
            {name: 'American Dad', group: 0},        // 4
            {name: 'Drama', group: 1},               // 5
            {name: 'Breaking Bad', group: 1},        // 6
            {name: 'Dexter', group: 1},              // 7
            {name: 'Narcos', group: 1},              // 8
            {name: 'Comedy', group: 2},              // 9
            {name: 'The Office', group: 2},          // 10
            {name: 'Parks and Recreation', group: 2},// 11
            {name: 'Shameless', group: 2},           // 12
            {name: 'Horror', group: 3},              // 13
            {name: 'American Horror Story', group: 3},// 14
            {name: 'Stranger Things', group: 3},      // 15
        ],
        edges: [
            {source: 0, target: 1},
            {source: 0, target: 2},
            {source: 0, target: 3},
            {source: 0, target: 4},
            {source: 5, target: 6},
            {source: 5, target: 7},
            {source: 5, target: 8},
            {source: 9, target: 10},
            {source: 9, target: 11},
            {source: 9, target: 12},
            {source: 13, target: 14},
            {source: 13, target: 15},
            {source: 9, target: 1},
            {source: 9, target: 2},
            {source: 9, target: 3},
            {source: 9, target: 4},
            {source: 5, target: 12},
            {source: 5, target: 15},
            
        ]
    }
    
    let w = 500;
    let h = 390;

    let colorScale = d3.scaleOrdinal()
        .domain(["Cup of Coffee", "Cup of Tea"])
        .range(['#C9F46A','#B0EC77','#4CBCB6','#454F5B','#E4F9B6']);

    let svg = d3.select('#force_directed_chart')
        .attr('width', w)
        .attr('height', h);

    let linkTargetLength = 100;
    force = d3.forceSimulation(dataset.nodes)
        .force('charge', d3.forceManyBody())
        .force('link', d3.forceLink(dataset.edges)
            .distance(linkTargetLength))
        .force('center', d3.forceCenter()
            .x(w/2)
            .y(h/2));

    let edges = svg.selectAll('line')
        .data(dataset.edges)
        .enter()
        .append('line')
            .classed('edge', true)
            .attr('stroke','black');

    let nodes = svg.selectAll('circle')
        .data(dataset.nodes)
        .enter()
        .append('circle')
        .attr('r', 10)
        .style('fill', (d) => colorScale(d.group))
        .on("mouseover", function(d) {
            d3.select(this).transition().duration(100)
                .attr('fill', 'orange');
        })
        .call(d3.drag()
        .on('start', onDragStart)
        .on('drag', onDrag)
        .on('end', onDragEnd));

    nodes.append('title')
        .attr('x',12)
        .text(d => d.name);

    force.on('tick', () => {
            edges
              .attr('x1', d => d.source.x)
              .attr('y1', d => d.source.y)
              .attr('x2', d => d.target.x)
              .attr('y2', d => d.target.y);
        
            // update node center x/y's using the 
            // joined data that D3 derived from our dataset
            nodes 
              .attr('cx', d => d.x)
              .attr('cy', d => d.y);
        
          });
    
}

// EVENT HANDLING FUNCTIONS
// (these come straight from "Interactive Data Visualization for the Web", Ch 13, "Draggable Nodes")
function onDragStart(d) {
    if(!d3.event.active) {
      force.alphaTarget(0.3).restart();
    }
    // use fx and fy as fixed x and y values; when set, overrides computed x/y
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function onDrag(d) {
    // set fx and fy to event x/y 
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  
  function onDragEnd(d) {
    if(!d3.event.active) {
      force.alphaTarget(1).restart();
    }
    // clear fx and fy so that computed x/y is used once again
    d.fx = null;
    d.fy = null;
  
  }

window.onload = function() {
    makeForceDirectedGraph();
  };