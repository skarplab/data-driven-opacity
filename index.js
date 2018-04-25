require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/widgets/Legend",
  "dojo/domReady!"
], function(
        Map, MapView, FeatureLayer, Legend
        ) {
  //////////////////////////////////////
  // DEFINE SYMBOLS FOR CLASS BREAKS //
  ////////////////////////////////////
  var classGreat = {
    type: "simple-fill",
    color: "#1A9641",
    style: "solid",
    outline: {
      width: 0
    }
  }
  var classGood = {
    type: "simple-fill",
    color: "#A6D96A",
    style: "solid",
    outline: {
      width: 0
    }
  }
  var classFair = {
    type: "simple-fill",
    color: "#FFFFBF",
    style: "solid",
    outline: {
      width: 0
    }
  }
  var classPoor = {
    type: "simple-fill",
    color: "#FDAE61",
    style: "solid",
    outline: {
      width: 0
    }
  }
  var classWorst = {
    type: "simple-fill",
    color: "#D7191C",
    style: "solid",
    outline: {
      width: 0
    }
  }
  
  //////////////////////
  // DEFINE RENDERER //
  /////////////////////
  var renderer = {
    type: "class-breaks",
    field: "TOTAL_SCORE",
    defaultSymbol: {
      type: "simple-fill",
      color: "gray",
      outline: {
        width: 0.5,
        color: "black"
      }
    },
    defaultLabel: "No Data",
    classBreakInfos:[{
      minValue: 0,
      maxValue: 7,
      symbol: classGreat,
      label: "<= 7"
    }, {
      minValue: 8,
      maxValue: 9,
      symbol: classGood,
      label: "8 - 9"
    }, {
      minValue: 10,
      maxValue: 11,
      symbol: classFair,
      label: "10 - 11"
    }, {
      minValue: 12,
      maxValue: 13,
      symbol: classPoor,
      label: "12 - 13"
    }, {
      minValue: 14,
      maxValue: 15,
      symbol: classWorst,
      label: "14 - 15"
    }]
  }
  
  ////////////////////////
  // SETUP FEATURE LAYER //
  //////////////////////
  var losLyr = new FeatureLayer({
    url: "https://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/BLOCKS_2017_DEMO/FeatureServer/0",
    renderer: renderer,
    outFields: ["GEOID",
                "TOTAL_SCORE",
                "POP",
                "POP_WGT",
                "WGT_SCORE",
                "DSCORE",
                "DIST",
                "ASCORE",
                "ACRE_PP",
                "PSCORE",
                "PARK_PP",
                "Shape__Area"],
    popupTemplate: {
      title: "Block: {GEOID10}",
      content: `<b>SCORES</b><br>
<b>Distance to Closest Park:</b> {DSCORE}<br>
<b>Accessible Acres per Person:</b> {ASCORE}<br>
<b>Accessible Parks per Person:</b> {PSCORE}<br>
<b>Total:</b> {TOTAL_SCORE}<br>
<b>Population:</b> {POP}<br>
<b>Population Density:</b> {$feature.POP / $feature.Shape__Area}`
    }
  })

  /////////////////
  // CREATE MAP //
  ///////////////
  var map = new Map({
    layers: [losLyr],
    basemap: "dark-gray"
  });
  
  var view = new MapView({
    map: map,
    container: "viewDiv",
    center: [-78.638694, 35.814998],
    zoom: 12
  });
  var legend = new Legend({
    view: view,
    layerInfos: [{
      layer: losLyr,
      title: "Existing Level of Service"
    }]
  });
  view.ui.add(legend, "bottom-left")
  
  ///////////////////////////////////////////////////////
  // INCLUDE DATA-DRIVEN OPACITY AS A VISUAL VARIABLE //
  /////////////////////////////////////////////////////
  view.when(function(){
    var rendererButtonContainer = document.getElementById("button-container")
    var rendererButton = document.getElementById("renderer-button");
    rendererButton.addEventListener("click", function(){
      var newRenderer = losLyr.renderer.clone();
      var popDensityArcade = document.getElementById("pop-density").text;
      var opacityVV = {
        type: "opacity",
        valueExpression: popDensityArcade,
        // Set the value and opacity ranges
        stops: [
          { value: 1, opacity: 0.1, label: "< 1 person per acre" },
          { value: 200, opacity: 1, label: "> 200 people per acre"}
        ]        
      }
      newRenderer.visualVariables = [opacityVV]
      losLyr.renderer = newRenderer

      rendererButtonContainer.removeChild(rendererButton)
    })
  })
});