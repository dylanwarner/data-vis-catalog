function rand(min, max) {
    return Math.round(min + Math.random() * (max - min));
}

function createMapWithPoints(dataset, stateValues, cityValues) {
    
    let w = 800;
    let h = 600;

    let svg = d3.select("#maps")
        .attr('width', w)
        .attr('height', h);

    let projection = d3.geoAlbersUsa()
        .translate([w/2,h/2]);

    let projectionDefaultScale = projection.scale();

    let path = d3.geoPath()
        .projection(projection);

    let colorScale = d3.scaleQuantize()
        .range(["rgb(237,248,233)","#daf1f0","#a2ddd9","#45bab2","#29706b"]);
    
    let sValues = Array.from(stateValues.values()); // grab values from Map object and put into an array
    colorScale.domain(d3.extent(sValues));

    let map = svg.append('g');

    map.selectAll("path")
        .data(dataset.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("stroke", "black")
        .style("fill", d => {
            let value = stateValues.get(d.properties.name);

            if(value) {
                return colorScale(value);
            } else {
                return '#ccc';
            }
        });

    
    map.selectAll("circle")
        .data(cityValues.cities)
        .enter()
        .append("circle")
        .style('fill', 'red')
        .style('stroke', 'purple')
        .style('opacity', '0.75')
        .attr('cx', d => projection([d.lon, d.lat])[0])
        .attr('cy', d => projection([d.lon, d.lat])[1])
        .attr('r', 5)
        .append('title')
            .text(d => `${d.name}: ${d.population} million`);

    
}

Promise.all([
    d3.json('us-states.json'),
    d3.json('city-data.json')
]).then((values) => {
    let [stateData, cityData] = values;

    // Generate randomized state data for choropleth
    let randMin = 10, randMax = 10000;
    let states = stateData.features.map(d => { 
      return {
        state: d.properties.name, 
        value: rand(randMin, randMax)
      }
    });

    let stateValues = new Map(states.map(d => [d.state, d.value]));

    createMapWithPoints(stateData,stateValues,cityData);
})