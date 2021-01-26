//start with defining svg dimensions
let svgWidth = 840;
let svgHeight = 473;

let axisDelay = 2500;
let circleDely = 2500;

//set the margin
let margin = { top: 20, right: 60, bottom: 80, left: 120 };

//calculate chart Dimension by adjusting the margin
let chartWidth = svgWidth - margin.left - margin.right;
let chartHeight = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
let svg = d3
.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append('g')
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
// Append an SVG group
let chartGroup = svg.append('g');

let circRadius;
function crGet() {
  if (charWidth <= 530) {
    circRadius = 5;
  }
  else {
    circRadius = 10;
  }
}
 
/********************************************/

d3.csv("assets/data/data.csv").then (function(data) {
  createChart(data);
});


function createChart(data) {

data.forEach(function(data) {
  data.poverty = +data.poverty;
  data.obesity = +data.obesity;
  data.age = +data.age;
  data.smokes = +data.smokes;
  data.healthcareLow = +data.healthcareLow;
  data.income = +data.income;

});
console.log(data)

  console.table(data, [
    "poverty",
    "age",
    "income",
    "obesity",
    "smokes",
    "healthcareLow",
  ]);
  // we store the current chartinformation into activeInfo Object
 
 
 
  let activeInfo = {
    data: data,
    currentX: "poverty",
    currentY: "smokes",
  };

  /*********************************************/

  activeInfo.xScale = d3
    .scaleLinear()
    .domain(getXDomain(activeInfo))
    .range([0, chartWidth]);

  activeInfo.yScale = d3
    .scaleLinear()
    .domain(getYDomain(activeInfo))
    .range([chartHeight, 0]);

  activeInfo.xAxis = d3.axisBottom(activeInfo.xScale);
  activeInfo.yAxis = d3.axisLeft(activeInfo.yScale);

  createAxis(activeInfo);

  // /*********************************************/

  createCircles(activeInfo);

  createToolTip(activeInfo);

  createLables();

  d3.selectAll(".aText").on("click", function (event) {
    console.log(event);
    handleClick(d3.select(this), activeInfo);
  });
}
/********************************************/

function handleClick(label, activeInfo) {
  let axis = label.attr("data-axis");
  let name = label.attr("data-name");

  if (label.classed("active")) {
    //no need to do anything if clicked on active axis
    return;
  }
  updateLabel(label, axis);

  if (axis === "x") {
    activeInfo.currentX = name;
    activeInfo.xScale.domain(getXDomain(activeInfo));
    renderXAxes(activeInfo);
    renderHorizontal(activeInfo);
  } //add logic to handle y axis click
  else {
    activeInfo.currentY = name;
    activeInfo.yScale.domain(getYDomain(activeInfo));
    renderYAxes(activeInfo);
    renderVertical(activeInfo);
  }

  if (axis === "y") {
    activeInfo.currentY = name;
    activeInfo.yScale.domain(getYDomain(activeInfo));
    renderYAxes(activeInfo);
    renderVertical(activeInfo);
  } //add logic to handle y axis click
  else {
    activeInfo.currentX = name;
    activeInfo.xScale.domain(getXDomain(activeInfo));
    renderXAxes(activeInfo);
    renderHorizontal(activeInfo);
  }


  
}

/********************************************/

function createLables() {
  let xlabelsGroup = chartGroup
    .append("g")
    .attr("class", "xText")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

  xlabelsGroup
    .append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("data-name", "poverty")
    .attr("data-axis", "x")
    .attr("class", "aText active x")
    .text("In Poverty(%)");

  xlabelsGroup
    .append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("data-name", "age")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Age (Median) (%)");

    xlabelsGroup
    .append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("data-name", "income")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Household Income (Median) (%)");

  let ylabelsGroup = chartGroup
    .append("g")
    .attr("class", "yText")
    .attr("transform", `translate(-60 , ${chartHeight / 2}) rotate(-90)`);

  ylabelsGroup
    .append("text")
    .attr("y", -10)
    .attr("x", chartHeight /10)
    .attr("dy", "1em")
    .attr("data-name", "smokes")
    .attr("data-axis", "y")
    .attr("class", "aText active y")
    .text("Smokes (%)");

    ylabelsGroup
    .append("text")
    .attr("y", -30)
    .attr("x", chartHeight / 10)
    .attr("dy", "1em")
    .attr("data-name", "obesity")
    .attr("data-axis", "y")
    .attr("class", "aText inactive y")
    .text("Obesity (%)");

    ylabelsGroup
    .append("text")
    .attr("y", -50)
    .attr("x", chartHeight / 10)
    .attr("dy", "1em")
    .attr("data-name", "healthcareLow")
    .attr("data-axis", "y")
    .attr("class", "aText inactive y")
    .text("Healthcare (%)");

  }




/********************************************/
crGet()
function createCircles(activeInfo) {
  let currentX = activeInfo.currentX;
  let currentY = activeInfo.currentY;
  let xScale = activeInfo.xScale;
  let yScale = activeInfo.yScale;
  console.log(activeInfo)
  chartGroup
    .selectAll("circle")
    .data(activeInfo.data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d[currentX]))
    .attr("cy", (d) => yScale(d[currentY]))
    .attr("r", 10)
    .attr("fill", "green")
    .attr("opacity", ".5")
    .append("text")
    .text(function(activeInfo) {
      return activeInfo.abbr
      }) 
    .style("text-anchor", "middle")
    .style("font-size", "7px")
    //.attr ("font-size", circRadius)
    .attr("class", "stateText")

    .data(activeInfo)
    .enter()
    
    .attr("x", function(activeInfo) {
        return xScale(activeInfo.currentX );
        })
    .attr("y", function(activeInfo) {
        return yScale(activeInfo.currentY - 0.2 );
        })
       






}
/********************************************/

function createAxis(activeInfo) {
  chartGroup.append("g").call(activeInfo.yAxis).attr("class", "y-axis");

  chartGroup
    .append("g")
    .call(activeInfo.xAxis)
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${chartHeight})`);
}

/********************************************/
function renderXAxes(activeInfo) {
  chartGroup
    .select(".x-axis")
    .transition()
    .duration(axisDelay)
    .call(activeInfo.xAxis);
}
/********************************************/
function renderYAxes(activeInfo) {
  chartGroup
    .select(".y-axis")
    .transition()
    .duration(axisDelay)
    .call(activeInfo.yAxis);
}

/********************************************/
function getXDomain(activeInfo) {
  let min = d3.min(activeInfo.data, (d) => d[activeInfo.currentX]);
  let max = d3.max(activeInfo.data, (d) => d[activeInfo.currentX]);
  return [min * 0.8, max * 1.2];
}
/********************************************/
function getYDomain(activeInfo) {
  let min = d3.min(activeInfo.data, (d) => d[activeInfo.currentY])
  let max = d3.max(activeInfo.data, (d) => d[activeInfo.currentY]);
  return [min *.5, max * 1];
}
/********************************************/

function renderHorizontal(activeInfo) {
  d3.selectAll("circle").each(adjustCircles);

  function adjustCircles() {
    d3.select(this)
      .transition()
      .attr("cx", (d) => activeInfo.xScale(d[activeInfo.currentX]))
      .duration(circleDely);
  }
}

/********************************************/
function renderVertical(activeInfo) {
  d3.selectAll("circle").each(function () {
    d3.select(this)
      .transition()
      .attr("cy", (d) => activeInfo.yScale(d[activeInfo.currentY]))
      .duration(circleDely);
  });
}

/********************************************/

function updateLabel(label, axis) {
  d3.selectAll(".aText")
    .filter("." + axis)
    .filter(".active")
    .classed("active", false)
    .classed("inactive", true);

  label.classed("inactive", false).classed("active", true);
}

/********************************************/

function createToolTip(activeInfo) {
 
 let toolTip = d3
    .tip()
    .attr("class", "tooltip")
    .offset([100, -10])
    .html(function(activeInfo) {
       let stateName = activeInfo.state;
       
       let label = activeInfo.currentX;
  
       if (activeInfo.currentX === "poverty") {
         label =label = "Household Income:  ";
         labelValue = activeInfo.poverty;
       } else if (activeInfo.currentX === "age") {
         label = "Age:  ";
         labelValue = activeInfo.age;
         } else { label =  "In Poverty:  ";
                 labelValue = activeInfo.income;
       }
        let label1 = activeInfo.currentY;
       
         if (activeInfo.currentY === "smokes") {
           label1 = "Healthcare:  ";
           label1Value = activeInfo.smokes;
         } else if (activeInfo.currentX === "obesity") {
           label1 = "Obesity:  ";
           label1Value = activeInfo.obesity;
           } else { label1 = "Smokes:  ";
                    label1Value = activeInfo.healthcareLow;
         }
         return (
         
          stateName + '<br>' + label  + labelValue + '<br>'+ label1 + label1Value
      )
    
    
    });


 chartGroup.call(toolTip);

  let circles = d3.selectAll("circle");

  circles.on("mouseover", toolTip.show);

  circles.on("mouseout", toolTip.hide);
}

/********************************************/
