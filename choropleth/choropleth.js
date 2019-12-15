function rand(min, max) {
    return Math.round(min + Math.random() * (max - min));
}

function createChoropleth(dataset, stateValues) {

    let w = 800;
    let h = 600;

    let svg = d3.select('#choropleth')
        .attr("width", w)
        .attr("height", h);

    // define map projection
    let projection = d3.geoAlbersUsa()
        .translate([w/2, h/2]);

    // define path generator for projection
    let path = d3.geoPath()
        .projection(projection);

    // define color scale for the fill
    let color = d3.scaleQuantize()
        .range(["rgb(237,248,233)","#daf1f0","#a2ddd9","#45bab2","#29706b"]);

    // set input domain for color scale
    let sValues = Array.from(stateValues.values());
    color.domain(d3.extent(sValues));

    svg.selectAll("path")
        .data(dataset.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "black")
        .style("fill", d => {
            let value = stateValues.get(d.properties.name);

            if (value) {
                return color(value);
            }
            else {
                return "#ccc";
            }
        })
        .on("mouseover", function(d) {
            d3.select(this).transition().duration(100)
                .style('fill', 'orange');
        })
        .on("mouseout", function(d) {
            let value = stateValues.get(d.properties.name);
            d3.select(this).transition().duration(100)
                .style('fill', color(value));
        })
}

d3.json('us-states.json').then((json) => {
    
    let randMin = 10;
    let randMax = 10000;

    let states = json.features.map(d => {
        return {
            state: d.properties.name,
            value: rand(randMin, randMax)
        }
    });

  let stateValues = new Map(states.map(d => [d.state, d.value]));
  console.log(stateValues);
  createChoropleth(json, stateValues);

})
