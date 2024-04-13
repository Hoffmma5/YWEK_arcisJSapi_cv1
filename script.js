require(["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/widgets/Sketch", "esri/layers/GraphicsLayer", "esri/widgets/Search", "esri/widgets/ScaleBar", "esri/widgets/LayerList", "esri/widgets/BasemapGallery"], (Map, MapView, FeatureLayer, Sketch, GraphicsLayer, Search, ScaleBar, LayerList, BasemapGallery) => {

  const collapsibleButtons = document.getElementsByClassName("collapsible"); // vyberu vsechly elementy dane tridy

  document.addEventListener("click", event => {
    console.log('image click ');
  });

  // for (let i = 0; i < collapsibleButtons.length; i++) {
  //   collapsibleButtons[i].addEventListener("click", function() {
  //     this.classList.toggle("active");
  //     var content = this.nextElementSibling;
  //     if (content.style.display === "block") {
  //       content.style.display = "none";
  //     } else {
  //       content.style.display = "block";
  //     }
  //   })
  // }

  // for (const button of collapsibleButtons) { //iterace po kazdem tlacitku v HTML kolekci
  //   button.addEventListener("click", function () { // pro kazde tlacitko pridam ovladac udalosti, po kliknuti se spusti callback funkce
  //     this.classList.toggle("active"); // this referencuje kliknute tlacitko - vypne se mi stylizace active
  //     const content = this.nextElementSibling; // najdu dalsi html sourozence element = div contentOpen (ale nemusi byt open)
  //     content.style.display = content.style.display === "block" ? "none" : "block"; //zobrazeni obsahu se prepne kontrolou vlastnosti style.display a pripadne ho prepnu / pomoci ternary operator
  //   });


  // for (const button of collapsibleButtons) { //iterace po kazdem tlacitku v HTML kolekci
  //   button.addEventListener("click", function () { // pro kazde tlacitko pridam ovladac udalosti, po kliknuti se spusti callback funkce
  //     this.classList.toggle("active"); // this referencuje kliknute tlacitko - vypne se mi stylizace active
  //     const content = this.nextElementSibling; // najdu dalsi html sourozence element = div contentOpen (ale nemusi byt open)
  //     content.classList.toggle("content"); // prepnu mezi tridama
  //     content.classList.toggle("contentOpen");
  //   });

  for (const button of collapsibleButtons) { //iterace po kazdem tlacitku v HTML kolekci
    button.addEventListener("click", function (event) { // pro kazde tlacitko pridam ovladac udalosti, po kliknuti se spusti callback funkce
      // event. target je odkaz na element, na kterem byla udalost spustena
      event.target.classList.toggle("active"); // this referencuje kliknute tlacitko - vypne se mi stylizace active
      const content = event.target.nextElementSibling; // najdu dalsi html sourozence element = div contentOpen (ale nemusi byt open)
      content.classList.toggle("content"); // prepnu mezi tridama
      content.classList.toggle("contentOpen");
    });


    // button.addEventListener("click", handleCollClick);
    // function handleCollClick() { // pro kazde tlacitko pridam ovladac udalosti, po kliknuti se spusti callback funkce
    //   this.classList.toggle("active");
    //   const content = this.nextElementSibling;
    //   content.style.display = content.style.display === "block" ? "none" : "block";
    // }
  }

  // console.log(coll);

  // for (el in coll) {
  //   console.log(el.index);
  // }


  const graphicsLayer = new GraphicsLayer();

  const map = new Map({
    basemap: "hybrid",
  });

  const mapView = new MapView({
    container: "viewDiv",
    map: map,

    extent: {
      // autocasts as new Extent()
      xmin: -9177811,
      ymin: 4247000,
      xmax: -9176791,
      ymax: 4247784,
      spatialReference: 102100
    }
  });

  // sketch widget
  mapView.when(() => {
    const sketch = new Sketch({
      layer: graphicsLayer,
      view: mapView,
      // graphic will be selected as soon as it is created
      // creationMode: "update",
      // will be not selected
      creationMode: "single",
      container: sketchContainer
    });

    // mapView.ui.add(sketch, "top-right"); // muzu odstranit, my nepotrebujenem portoze to chci mit v panelu
  });

  // search widget
  const searchWidget = new Search({
    view: mapView
  });
  // Adds the search widget below other elements in
  // the top left corner of the view
  mapView.ui.add(searchWidget, {
    position: "top-left",
    index: 0 // udava poradi widgetu nad sebou v rohu v mape
  });

  // scaleBar widget
  const scaleBar = new ScaleBar({
    view: mapView,
    style: "line",
    unit: "dual",
  });
  // Add widget to the bottom left corner of the view
  mapView.ui.add(scaleBar, {
    position: "bottom-left"
  });

  // layerList widget
  let layerList = new LayerList({
    view: mapView,
    container: layerListContainer
  });
  // Adds widget below other elements in the top left corner of the view
  // mapView.ui.add(layerList, {
  //   position: "top-left"
  // });

  // BasemapGallery widget
  let basemapGallery = new BasemapGallery({
    view: mapView,
    container: basemapGalleryContainer
  });

  /********************
   * Add feature layer
   ********************/

  // Carbon storage of trees in Warren Wilson College.
  const featureLayer = new FeatureLayer({
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0"
  });

  map.addMany([featureLayer, graphicsLayer]);
});