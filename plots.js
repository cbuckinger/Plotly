function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      //console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
     
      ///crate a pass-thru variable to display the info on the default selection
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
     buildMetadata(firstSample);
     });
  }
  
  init();


  function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
  }
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      PANEL.append("h4").text("ID:  "+ result.id);
      PANEL.append("h6").text("Location:  "+result.location);
      PANEL.append("h6").text("Ethnicity:  "+result.ethnicity);
      PANEL.append("h6").text("Gender:  "+result.gender);
      PANEL.append("h6").text("Age:  "+result.age);
      PANEL.append("h6").text("BB Type:  "+result.bbtype);
      PANEL.append("h6").text("Washing Frequency:  "+result.wfreq);
    });
  }
  function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // 3. Create a variable that holds the samples array. 
      var samples=data.samples;
      var metadata = data.metadata;
     // console.log(sample);
      //filter the samples for the object with the desired sample number.
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var resultMetaArray = metadata.filter(sampleObj => sampleObj.id == sample);
      
      //console.log(resultArray);

      //  5. Create a variable that holds the first sample in the array.
      var result = resultArray[0];
      var metaResult=resultMetaArray[0];
     // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
     // var volID=result.id;
      var otuId=result.otu_ids;
      var otuLab=result.otu_labels;
      var otuSamp=result.sample_values;
      var BBWash=metaResult.wfreq;

      var topTenOtus=otuSamp.slice(0,10).reverse();
        console.log(topTenOtus);

        var topTenSampIDs = otuId.slice(0,10).map(otu => `OTU ${otu}`).reverse();
        var topTenLabs=otuLab.slice(0,10).reverse();
        var top10SampIDs_bubble = otuId.slice(0,10).reverse();
        console.log(top10SampIDs_bubble);

        /////////////Bar

        var trace = {
        x: topTenOtus,
        y: topTenSampIDs,
        type: "bar",
        orientation:"h",
        text: topTenLabs,
        };
        var data = [trace];
        var layout = {
          title: "Top 10 Bacteria Found",
          xaxis: {title: "Amount" },
          yaxis: {title: "Identifier"}
        };
        Plotly.newPlot("bar", data, layout);

       ////////////////Bubble
        // 1.  trace 
       var bubbleData = {
        x: top10SampIDs_bubble,
        y: topTenOtus,
        
        hover_data: topTenOtus,
        text: topTenLabs,
        type: 'scatter',
        mode: 'markers',
        marker: {
          size: topTenOtus,
          color: top10SampIDs_bubble
          },
        };
        var data=[bubbleData];
      // 2. Create the layout for the bubble chart.
      var layout = {
        title: 'Bacteria Cultures per Sample',
        xaxis: {title: "OTU"},
        yaxis: {title: "Number Found"},
        width: 1250,
        height: 900
      };
    Plotly.newPlot('bubble',data,layout);        
   
    ///////////////////////////gauge
   
    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: BBWash,
        title: { text: "Belly Button Washing Frequency"+"<br>"+"Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number",
            gauge: {
                axis: { range: [null, 10] },
                bar: { color: "black" },
                steps: [
                  { range: [0, 2], color: "red" },
                  { range: [2, 4], color: "orange" },
                  { range: [4,6], color: "yellow" },
                  { range: [6,8], color: "green" },
                  { range: [8,10], color: "blue" }
                ],
      }
    } 
    ];
    
    var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', data, layout);
    });
}