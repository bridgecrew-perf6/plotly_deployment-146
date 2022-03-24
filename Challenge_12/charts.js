function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    var sampleData = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = sampleData.filter(sampleObj => sampleObj.id == sample);
    console.log(resultArray);
    //  5. Create a variable that holds the first sample in the array.
    var firstResult = resultArray[0];
    console.log(firstResult);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = firstResult.otu_ids;
    var sample_values = firstResult.sample_values;
    var otu_labels = firstResult.otu_labels;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last.
    sample_values.sort(function(a, b) {
      return parseInt(a) - parseInt(b);
    }).reverse();
    sample_values=sample_values.slice(0,10);
    console.log(sample_values);
    var yticks = otu_ids.slice(0,10).map(otu_id => `OTU ${otu_id}`).reverse();
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var trace1 = {
      x: sample_values.reverse(),
      y: yticks,
      text: otu_labels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    };
    
    // data
    var barData = [trace1];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("plot", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var trace2 = {
      x: yticks,
      y: sample_values.reverse(),
      mode: 'markers',
      text: otu_labels.slice(0,10).reverse(),
      marker:{
        size:sample_values.reverse(),
        color: otu_ids,
        colorscale:'YlOrRd',
      }
    };
    
    var bubbleData = [trace2];
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
          title:"Bellybutton Samples",
          xaxis:{title: "OTU IDs"},
          height: 600,
          width: 1200,
    };
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble',bubbleData,bubbleLayout);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metaData = data.metadata;

    // Create a variable that holds the first sample in the array.
    var metaArray = metaData.filter(metaObj => metaObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var firstMetaResult = metaArray[0];
    console.log(firstMetaResult)

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    otuID = 
    otuLab = 
    sampVal = 

    // 3. Create a variable that holds the washing frequency.
    wfreq = parseFloat(firstMetaResult.wfreq);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value:wfreq,
      title:"Bellybutton Washing Frequency",
      type:"indicator",
      mode:"gauge+number",
      gauge:{
        axis:{range:[null,10]},
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: 'rgb(255, 69, 0)' },
          { range: [2, 4], color: 'rgb(255, 165, 0)' },
          { range: [4, 6], color: 'rgb(255, 255, 0)' },
          { range: [6, 8], color: 'rgb(0, 255, 0)' },
          { range: [8, 10], color: 'rgb(0, 128, 0)' },
        ],
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout ={ width: 600, height: 500, margin: { t: 0, b: 0 } };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge',gaugeData,gaugeLayout);
  });
}

