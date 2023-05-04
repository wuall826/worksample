// Fetch data from the server
async function fetchData() {
  const response = await fetch('/data');
  const data = await response.json();
  return data;
}

// Extract unique values for Asset, Business Category, and Location (Lat, Long)
async function getUniqueValues() {
  const data = await fetchData();
  const assets = new Set();
  const businessCategories = new Set();
  const locations = new Set();

  data.forEach(d => {
      assets.add(d['Asset Name']);
      businessCategories.add(d['Business Category']);
      locations.add(`${d['Lat']}, ${d['Long']}`);
  });

  return {
      assets: Array.from(assets),
      businessCategories: Array.from(businessCategories),
      locations: Array.from(locations)
  };
}

// Populate the dropdown filters
async function populateDropdowns() {
  const { assets, businessCategories, locations } = await getUniqueValues();

  const businessCategoryDropdown = d3.select("#businessCategory");
  const assetDropdown = d3.select("#asset");
  const locationDropdown = d3.select("#location");

  // Populate Business Category dropdown
  businessCategoryDropdown
    .selectAll("option")
    .data(businessCategories)
    .enter()
    .append("option")
    .attr("value", (d) => d)
    .text((d) => d);

  // Populate Asset dropdown
  assetDropdown
    .selectAll("option")
    .data(assets)
    .enter()
    .append("option")
    .attr("value", (d) => d)
    .text((d) => d);

  // Populate Location (Lat, Long) dropdown
  locationDropdown
    .selectAll("option")
    .data(locations)
    .enter()
    .append("option")
    .attr("value", (d) => d)
    .text((d) => d);

  // Listen for changes to the Business Category dropdown
  businessCategoryDropdown.on("change", function () {
    const selectedCategory = businessCategoryDropdown.property("value");

    // Filter assets based on selected Business Category
    const filteredAssets = data
      .filter((item) => item["Business Category"] === selectedCategory)
      .map((item) => item["Asset Name"]);

    // Filter locations based on selected Business Category
    const filteredLocations = data
      .filter((item) => item["Business Category"] === selectedCategory)
      .map((item) => `${item["Lat"]}, ${item["Long"]}`);

    // Update Asset dropdown options
    assetDropdown
      .selectAll("option")
      .data(filteredAssets)
      .join("option")
      .attr("value", (d) => d)
      .text((d) => d);

    // Clear selected Asset
    assetDropdown.property("value", "");

    // Update Location dropdown options
    locationDropdown
      .selectAll("option")
      .data(filteredLocations)
      .join("option")
      .attr("value", (d) => d)
      .text((d) => d);

    // Clear selected Location
    locationDropdown.property("value", "");
  });

  // Listen for changes to the Asset dropdown
  assetDropdown.on("change", function () {
    const selectedAsset = assetDropdown.property("value");

    // Filter Business Category based on selected Asset
    const filteredCategories = data
      .filter((item) => item["Asset Name"] === selectedAsset)
      .map((item) => item["Business Category"]);

    // Filter locations based on selected Asset
    const filteredLocations = data
      .filter((item) => item["Asset Name"] === selectedAsset)
      .map((item) => `${item["Lat"]}, ${item["Long"]}`);

    // Update Business Category dropdown options
    businessCategoryDropdown
      .selectAll("option")
      .data(filteredCategories)
      .join("option")
      .attr("value", (d) => d)
      .text((d) => d);

    // Clear selected Business Category
    businessCategoryDropdown.property("value", "");

    // Update Location dropdown options
    locationDropdown
      .selectAll("option")
      .data(filteredLocations)
      .join("option")
      .attr("value", (d) => d)
      .text((d) => d);

    // Clear selected Location
    locationDropdown.property("value", "");
  });

  // Listen
  // Listen for changes to the Location dropdown
  locationDropdown.on("change", function () {
      const selectedLocation = locationDropdown.property("value");

      // Filter Business Category based on selected Location
      const filteredCategories = data
      .filter((item) => `${item["Lat"]}, ${item["Long"]}` === selectedLocation)
      .map((item) => item["Business Category"]);

      // Filter assets based on selected Location
      const filteredAssets = data
      .filter((item) => `${item["Lat"]}, ${item["Long"]}` === selectedLocation)
      .map((item) => item["Asset Name"]);

      // Update Business Category dropdown options
      businessCategoryDropdown
      .selectAll("option")
      .data(filteredCategories)
      .join("option")
      .attr("value", (d) => d)
      .text((d) => d);

      // Clear selected Business Category
      businessCategoryDropdown.property("value", "");

      // Update Asset dropdown options
      assetDropdown
      .selectAll("option")
      .data(filteredAssets)
      .join("option")
      .attr("value", (d) => d)
      .text((d) => d);

      // Clear selected Asset
      assetDropdown.property("value", "");
      });
  }



// Create the line graph
async function createLineGraph() {
  const data = await fetchData();

  // Filter data based on the selected dropdown values
function filterData() {
  const selectedCategory = d3.select('#businessCategory').property('value');
  const selectedAsset = d3.select('#asset').property('value');
  const selectedLocation = d3.select('#location').property('value');
  const [selectedLat, selectedLong] = selectedLocation.split(', ');

  return data.filter((d) => d['Business Category'] === selectedCategory &&
      d['Asset Name'] === selectedAsset &&
      d['Lat'] === selectedLat &&
      d['Long'] === selectedLong);
}


      // Update the line graph based on the selected dropdown values
      function updateLineGraph() {
      const filteredData = filterData();
      
      // Remove any existing chart elements
      d3.select("#chart").selectAll("*").remove();
      
      // Set up chart dimensions and margins
      const maxWidth = 0.8 * window.innerWidth;
      const maxHeight = 0.9 * window.innerHeight;
      const width = Math.max(Math.min(maxWidth, maxWidth));
      const height = Math.max(Math.min(maxHeight, maxHeight));
      const margin = { top: 20, right: 20, bottom: 50, left: 50 };
      
      // Create the SVG container
      const svg = d3
          .select("#chart")
          .append("svg")
          .attr("width", width)
          .attr("height", height);
      
      // Set up scales
      const xScale = d3
          .scaleLinear()
          .domain(d3.extent(filteredData, (d) => +d.Year))
          .range([margin.left, width - margin.right]);
      
      const yScale = d3
          .scaleLinear()
          .domain([0, d3.max(filteredData, (d) => +d["Risk Rating"])])
          .range([height - margin.bottom, margin.top]);
      
      // Set up axes
      const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
      const yAxis = d3.axisLeft(yScale);
      
      // Create the line
      const line = d3
          .line()
          .x((d) => xScale(+d.Year))
          .y((d) => yScale(+d["Risk Rating"]));
      
      // Draw the line
      svg
          .append("path")
          .datum(filteredData)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 1.5)
          .attr("d", line);
      
      // Add dots for data points
      const dots = svg
          .selectAll(".dot")
          .data(filteredData)
          .enter()
          .append("circle")
          .attr("class", "dot")
          .attr("cx", (d) => xScale(+d.Year))
          .attr("cy", (d) => yScale(+d["Risk Rating"]))
          .attr("r", 5);
      
      // Add tooltip functionality
      const tooltip = d3
          .select("body")
          .append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("background-color", "white")
          .style("border", "solid")
          .style("border-width", "1px")
          .style("border-radius", "5px")
          .style("padding", "10px")
          .style("opacity", 0);
      
      const mouseover = (event, d) => {
          tooltip.style("opacity", 1);
      };
      
      const mousemove = (event, d) => {
          tooltip
          .html(
              `Asset Name: ${d["Asset Name"]}<br>Risk Rating: ${d["Risk Rating"]}<br>Risk Factors: ${d["Risk Factors"]}<br>Year: ${d["Year"]}`
          )
          .style("left", event.pageX + 15 + "px")
          .style("top", event.pageY + "px");
      };
      
      const mouseleave = (event, d) => {
          tooltip.style("opacity", 0);
      };
      
      dots.on("mouseover", mouseover).on("mousemove", mousemove).on("mouseleave", mouseleave);
      
      // Add axes
      svg
          .append("g")
          .attr("transform", `translate(0, ${height - margin.bottom})`)
          .call(xAxis);
      
      svg
          .append("g")
          .attr("transform", `translate(${margin.left}, 0)`)
          .call(yAxis);
      
      // Add axis labels
      svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", height - margin.bottom / 2)
          .text("Year");
      
      svg
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -height / 2)
          .attr("y", margin.left / 2)
          .text("Risk Rating");
      
      // Add title
      const selectedCategory = d3.select("#businessCategory").property("value");
      const selectedAsset = d3.select("#asset").property("value");
      const selectedLocation = d3.select("#location").property("value");
      
      const [selectedLat, selectedLong] = selectedLocation.split(", ");
      
      const filteredTitle =
          selectedCategory +
          ", " +
          selectedAsset +
          ", " +
          selectedLat +
          ", " +
          selectedLong;
      
      svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", margin.top * 2)
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .text(`Risk Rating over Time for ${filteredTitle}`);
      }
      
      

      // Listen for changes to the dropdown filters
      d3.select('#businessCategory').on('change', updateLineGraph);
      d3.select('#asset').on('change', updateLineGraph);
      d3.select('#location').on('change', updateLineGraph);

      // Initial line graph rendering
      updateLineGraph();
  }

  // Populate the dropdown filters and create the line graph
  populateDropdowns();
  createLineGraph();