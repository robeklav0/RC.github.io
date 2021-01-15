
function getPlots(id) {
  //Read samples.json
      d3.json("samples.json").then (sampledata =>{
          console.log(sampledata)
          let ids = sampledata.samples[0].otu_ids;
          console.log(ids)
          let sampleValues =  sampledata.samples[0].sample_values.slice(0,10).reverse();
          console.log(sampleValues)
          let labels =  sampledata.samples[0].otu_labels.slice(0,10);
          console.log (labels)
      // get only top 10 otu ids for the plot OTU and reversing it. 
          let OTU_top = ( sampledata.samples[0].otu_ids.slice(0, 10)).reverse();
      // get the otu id's to the desired form for the plot
          let OTU_id = OTU_top.map(d => "OTU " + d);
          console.log(`OTU IDS: ${OTU_id}`)
       // get the top 10 labels for the plot
          let labels1 =  sampledata.samples[0].otu_labels.slice(0,10);
          console.log(`OTU_labels: ${labels1}`)
          let trace = {
              x: sampleValues,
              y: OTU_id,
              text: labels,
              marker: {
              color: 'darkblue'},
              type:"bar",
              orientation: "h",
          };
          // create data variable
          let data = [trace];
  
          // create layout variable to set plots layout
          let layout = {
              title: "Top 10 OTUs",
              yaxis:{
                  tickmode:"linear",
              },
              margin: {
                  l: 100,
                  r: 100,
                  t: 100,
                  b: 30
              }
          };
  
          // create the bar plot
      Plotly.newPlot("bar", data, layout);
        
          let trace1 = {
              x: sampledata.samples[0].otu_ids,
              y: sampledata.samples[0].sample_values,
              mode: "markers",
              marker: {
                  size: sampledata.samples[0].sample_values,
                  color: sampledata.samples[0].otu_ids
              },
              text:  sampledata.samples[0].otu_labels
  
          };
  
          // set the layout for the bubble plot
          let layout2 = {
              xaxis:{title: "OTU IDs"},
              height: 500,
              width: 1200
          };
  
          // creating data variable 
          let data1 = [trace1];
  
      // create the bubble plot
      Plotly.newPlot("bubble", data1, layout2); 
      
      });
  }  
  // create the function to get the necessary data
  
  
  
  
  function getDemoInfo(id) {
  // read the json file to get data
      d3.json("samples.json").then((data)=> {
  // get the metadata info for the demographic panel
          let metadata = data.metadata;
  
          console.log(metadata)
  
        // filtering metadata by id
         let results = metadata.filter(meta => meta.id.toString() === id)[0];
        // selecting demographic panel
         let demoInfo = d3.select("#sample-metadata");
        
       // reseting demographic panel
         demoInfo.html("");
  
       // getting demographic data to panel
          Object.entries(results).forEach((key) => {   
              demoInfo.append("h4").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
          });
          window.value1 = parseFloat(results.wfreq);
          console.log(value1);
        


          // getting gauge set 
          let trace3 =  {
            type: "indicator",
            mode: "gauge+number",
            value: value1,
            title: { text: "Wash Frecuency", font: { size: 24 } },
            delta: { reference: 400, increasing: { color: "RebeccaPurple" } },
            gauge: {
              axis: { range: [0, 9], tickwidth: 1, tickcolor: "darkblue" },
              bar: { color: "darkblue" },
              bgcolor: "white",
              borderwidth: 2,
              bordercolor: "gray",
              steps: [
                { range: [null, 9], color: "cyan" },
                { range: [0, value1], color: "royalblue" }
              ],
              threshold: {
                line: { color: "red", width: 6, },
                thickness: 1,
                value: value1
              
              }
            }
          
          };
          
        let layout = {
          width: 500,
          height: 400,
          margin: { t: 25, r: 25, l: 25, b: 25 },
          paper_bgcolor: "lavender",
          font: { color: "darkblue", family: "Arial" }
        };
           let data3 = [trace3];
        Plotly.newPlot("gauge", data3, layout); 


      });
    
  }
 
  // creating  function for change
function optionChanged(id) {
      getPlots(id);
      getDemoInfo(id);
      
  }
  

  // creating function for initial data
  function init() {
      // selecting dropdown menu 
     let dropdown = d3.select("#selDataset");
  
      d3.json("samples.json").then((data)=> {
          console.log(data)
  
          // getting the id data to the dropdwown menu
          data.names.forEach(function(name) {
              dropdown.append("option").text(name).property("value");
          });
  
          // call the functions to display the data and the plots to the page
          getPlots(data.names[0]);
          getDemoInfo(data.names[0]);
          
      });
  }
  
  init();
 
  
