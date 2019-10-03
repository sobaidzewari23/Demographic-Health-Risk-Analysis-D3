 // @TODO: YOUR CODE HERE!

/// Run HTTP Server, python -m http.server --cgi 8000

// Set svg wrapper dimensions 
var svgWidth = 900;
var svgHeight = 600;
var margin = { top: 100, right: 60, bottom: 100, left:60};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create SVG wrapper, append SVG group to hold chart, shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

/// Append an SVG Group, shift by left and top margins
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

/// Initial Params
var chosenXaxis = "poverty";
var chosenYaxis = "healthcare";

/// Retrieve data from CSV
var file = "assets/data/data.csv"
console.log(d3.csv(file))
// d3.csv(file).then(successHandle, errorHandle);
d3.csv("assets/data/data.csv").then(function(data) {
    // this visualize function would contain all of the code that renders the plot
    successHandle(data);
})



function successHandle(data) {
    /// Parse Data
    data.forEach(function(data) {
        data.state = data.state;
        data.abbr = data.abbr;
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });
    
    /// Scale Functions
    var xLinearScale = xScale(data, chosenXaxis);
    // console.log(xLinearScale)
    var yLinearScale = yScale(data, chosenYaxis);

    /// Initial Axis Functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    
    /// Append X Axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
        
    var xLabel = chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 20})`)
        .attr("x", 0 )
        .attr("y", 20)
        .attr("value", "healthcare")
        .attr("class", "axis-text")
        .classed("active", true)
        .classed("inactive", false)
        .text("healthcare (%)");

        /// Append Y Axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);
        
    var yLabel = chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 -  margin.left + 20)
        .attr("x", 0 - height / 2)
        .attr("value", "poverty")
        .attr("class", "axis-text")
        .classed("active", true)
        .classed("inactive", false)
        .text("In Poverty(%)")
    
    var circleRadius = 15;

    /// Append Initial Circles
    var circlesGroup = chartGroup.selectAll("circles")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXaxis]))
        .attr("cy", d => yLinearScale(d[chosenYaxis]))
        .attr("r", circleRadius)
        .attr("fill", "steelblue")
        .style("stroke", "grey")
        .attr("opacity", ".7")
        .text(function(d) {
            return d.abbr;
        })

    /// Append State Abbreviations to Circles
    var abbrGroup = chartGroup.selectAll("texts")
    .data(data)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d[chosenXaxis]))
    .attr("y", d => yLinearScale(d[chosenYaxis]))
    .attr("class","stateText")
    .text(function(d) {
        return d.abbr;
    })

// Axis labels
var xLabel = "In Poverty (%)"
var yLabel = "healthcare(%)"

//  Create tooltips, assign it a class
var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([105, 0])
        .html(function(d) {
             return (`<b>${d["state"]}</b><br>${xLabel} <b>${d[chosenXaxis]}</b><br>${yLabel} <b>${d[chosenYaxis]}</b>`)
        });
        
        abbrGroup.call(toolTip);
        abbrGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
        })
            .on("mouseout", function(data, index) {
                toolTip.hide(data);
            });
        return abbrGroup;

/// Function for x-scale 
function xScale(data, chosenXaxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXaxis]) * .8,
        d3.max(data, d => d[chosenXaxis]) * 1.1])
        .range([0, width]);
    return xLinearScale;
}

/// Function for y-scale 
function yScale(data, chosenYaxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYaxis]) * 0.8,
        d3.max(data, d => d[chosenYaxis]) * 1.1])
        .range([height, 0]);
    return yLinearScale;
}
}
