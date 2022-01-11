// @TODO: YOUR CODE HERE!
// The code for the chart is wrapped inside a function
// that automatically resizes the chart
function makeResponsive() {

    // Importing Data from csv
    d3.csv("./assets/data/data.csv").then(function(StateData) {

        console.log(StateData);

    // Parsing data as integer
        StateData.forEach(datapoint => {
            datapoint.age = +datapoint.age;
            datapoint.ageMoe = +datapoint.ageMoe;
            datapoint.healthcare = +datapoint.healthcare;
            datapoint.healthcareHigh = +datapoint.healthcareHigh;
            datapoint.healthcareLow = +datapoint.healthcareLow;
            datapoint.income = +datapoint.income;
            datapoint.incomeMoe = +datapoint.incomeMoe;
            datapoint.obesity = +datapoint.obesity;
            datapoint.obesityHigh = +datapoint.obesityHigh;
            datapoint.obesityLow = +datapoint.obesityLow;
            datapoint.poverty = +datapoint.poverty;
            datapoint.povertyMoe = +datapoint.povertyMoe;
            datapoint.smokes = +datapoint.smokes;
            datapoint.smokesHigh = +datapoint.smokesHigh;
            datapoint.smokesLow = +datapoint.smokesLow;
            datapoint.id = +datapoint.id;
        });

    // if the SVG area isn't empty when the browser loads, remove it
    // and replace it with a resized version of the chart
    var svgArea = d3.select("#scatter").select("svg");
    
    if (!svgArea.empty()) {
      svgArea.remove();
    }
  
    // SVG wrapper dimensions are determined by the current width
    // and height of the browser window.
    var svgWidth = window.innerWidth*0.9;
    var svgHeight = window.innerHeight;
  
    var margin = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50
    };
  
    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chartWidth = svgWidth - margin.left - margin.right;
  
    // append svg
    var svg = d3.select("#scatter")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);

    // Create chart group
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    // Create scale to size chart
    var xScale = d3.scaleLinear()
        .domain([d3.min(StateData, data => data.healthcare), d3.max(StateData, data => data.healthcare)])
        .range([0, chartWidth]);
  
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(StateData, data => data.healthcare)])
        .range([chartHeight, 0]);

    // Create X and Y-axis
    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);

    chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(xAxis);

    chartGroup.append("g").call(yAxis);



    // append circles to data points
    var circlesGroup = chartGroup.selectAll("circle")
      .data(StateData)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => xScale(d.poverty))
      .attr("cy", d => yScale(d.healthcare))
      .attr("r", "10")
      .attr("fill", "teal")
      .attr('opacity',0.3);

    chartGroup
        .select("g")
        .selectAll("circle")
        .data(StateData)
        .enter()
        .append("text")
        .text((d) => d.abbr)
        .attr("x", (d) => xScale(d.poverty))
        .attr("y", (d) => yScale(d.healthcare))
        .attr("dy", -810)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "black");
      
  
    // Append a div to the body to create tooltips, assign it a class
    var toolTip = d3.select("#scatter").append("div")
      .attr("class", "d3-tip");
  
    // Add an onmouseover event to display a tooltip

    circlesGroup.on("mouseover", function(d, i) {
        toolTip.style("display", "block");
        toolTip.html(`State: ${d.state}<br>
                    Poverty: <strong>${d.poverty}</strong><br>
                    Healthcare: <strong>${d.healthcare}</strong>`)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
    })
    
    // Add an on mouseout event to make the tooltip invisible
      .on("mouseout", function() {
        toolTip.style("display", "none");
      });

    // Create axes titles

    chartGroup
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 50)
        .attr("x", 0 - chartHeight/2)
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartGroup
        .append("text")
        .attr("transform", `translate(${chartWidth/2},${chartHeight+ margin.top-10})`)
        .classed("axis-text", true)
        .text("In Poverty (%)");

    


    });
}
  
  // When the browser loads, makeResponsive() is called.
  makeResponsive();
  
  // When the browser window is resized, responsify() is called.
  d3.select(window).on("resize", makeResponsive);
  