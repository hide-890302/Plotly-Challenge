// Define Initalization Function to load page
function init() {
    // Read "samples.json" file
    d3.json("data/samples.json").then((importData) => {
        console.log(importData);

        // Filter "Test Subject ID No." from Imported Data. 
        var sampleNames = importData.names;
        console.log(sampleNames);

        // Select dropdown menu location for "index.html"
        dropdownMenu = d3.select("#selDataset");
        // Append "Test Subject ID No." to the dropdown menu
        sampleNames.forEach((name) => {
        dropdownMenu.append("option").text(name).property("value", name);
        })
        
        // Run "buildMetadata" & "buildChart" functions
        buildMetadata(sampleNames[0])
        buildChart(sampleNames[0])
    });
}


// Define function to build Demographic Info of selected "Test Subject ID" from "samples.json"
function buildMetadata(subject) {
    console.log(subject)
    // Read "samples.json" file
    d3.json("data/samples.json").then((importData) => {
        
        // Filter "importData" to extract the metadata
        var metaData = importData.metadata;
        console.log(metaData);

        // Filter metadata for selected "Test Subject ID"
        var subjectMetadata = metaData.filter(object => object.id == subject);
        console.log(subjectMetadata[0])

        // Set location for the metadata in "index.html"
        var metadataPanel = d3.select("#sample-metadata");

        // Process for Clearing previous metadata
        metadataPanel.html("")

        // Append metadata for selected subject into the selected panel
        Object.entries(subjectMetadata[0]).forEach(([key, value]) => { 
        metadataPanel.append("h5").text(`${key}: ${value}`);
        });
    });
}


// Define function to build charts from "samples.json" file
function buildChart(subject) {
    console.log(subject)
    // Read "samples.json" file
    d3.json("data/samples.json").then((importData) => {

        // Define samples array
        var samples = importData.samples;
        console.log(samples)

        // Filter the samples array for results of the selected subject
        filterData = samples.filter(sampleObject => sampleObject.id == subject)[0]
        console.log(filterData)
       
        // Define otu sample values of the selected subject
        var sample_values = filterData.sample_values
        console.log(sample_values)

        //  Define otu ids of the selected subject
        var otu_ids = filterData.otu_ids
        console.log(otu_ids)
        
        // Define otu labels of the selected subject
        var otu_labels = filterData.otu_labels
        console.log(otu_labels)
    
       
        // [Horizontal Bar Chart]

        // Slice the first 10 sample values of selected "Test Subject ID" for plotting and reverse their order
        barchartValues = sample_values.slice(0, 10).reverse();
        console.log(barchartValues);

        // Slice the first 10 otu ids of selected subject for plotting and reverse their order
        barchartLabels = otu_ids.slice(0, 10).reverse();
        console.log(barchartLabels);
        
        // Format Barchart Labels
        formatBarchartLabels = barchartLabels.map(label => "OTU " + label);
        console.log(formatBarchartLabels);

        // Slice the first 10 otu labels of selected subject for plotting and reverse their order
        barchartHovertext = otu_labels.slice(0, 10).reverse();
        console.log(barchartHovertext);

        // Define Trace for bar chart
        var barTrace = {
            x: barchartValues,
            y: formatBarchartLabels,
            text: barchartHovertext,
            type: "bar",
            orientation: "h",
        };

        // Set Trace for bar chart
        var horizBarData = [barTrace];

        // Set Layout for bar chart
        var barLayout = {
            margin: {
                l:  120,
                r:  80,
                t:  10,
                b:  20
            }
        };

        // Render the bar chart plot to the div tag with id "bar"
        Plotly.newPlot("bar", horizBarData, barLayout);

        
        // [Bubble Chart]
        // Define Trace for bubble chart
        var bubbleTrace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                color: otu_ids,
                colorscale: 'YlGnBu',
                size: sample_values
            }
        };

        // Set data variable from trace for bubble chart
        var bubblechartData = [bubbleTrace];

        // Set layout for bubble chart
        var bubbleLayout = {
            xaxis: {
                title:'OTU ID'
            },
            margin: {
                l: 50,
                r: 50,
                t: 50,
                b: 100
            }
        };

        // Render the bubble chart plot to the div tag with id "bubble"
        Plotly.newPlot("bubble", bubblechartData, bubbleLayout);


    })
}


//  Define function to change metadata and charts for selected subject on change of the dropdown menu
function optionChanged(newsubject) {
    buildMetadata(newsubject);
    buildChart(newsubject);
    console.log(newsubject)
};


// Run Initialization Function on start up
init()