require(["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/widgets/Sketch", "esri/layers/GraphicsLayer", "esri/widgets/Search", "esri/widgets/ScaleBar", "esri/widgets/LayerList", "esri/widgets/BasemapGallery"], (Map, MapView, FeatureLayer, Sketch, GraphicsLayer, Search, ScaleBar, LayerList, BasemapGallery) => {
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
    },

    padding: {
      left: 49
    }

  });

  /********************
   * Add feature layer
   ********************/
  // Carbon storage of trees in Warren Wilson College.
  const featureLayer = new FeatureLayer({
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0"
  });

  mapView.when(() => {

    const sketch = new Sketch({
      layer: graphicsLayer,
      view: mapView,
      creationMode: "single",
      container: sketchContainer
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
    const layerList = new LayerList({
      view: mapView,
      container: layerListContainer
    });

    // BasemapGallery widget
    const basemapGallery = new BasemapGallery({
      view: mapView,
      container: basemapGalleryContainer
    });


    let activeWidget;

    const handleActionBarClick = ({ target }) => {
      if (target.tagName !== "CALCITE-ACTION") {
        return;
      }

      if (activeWidget) {
        document.querySelector(`[data-action-id=${activeWidget}]`).active = false;
        document.querySelector(`[data-panel-id=${activeWidget}]`).hidden = true;
      }

      const nextWidget = target.dataset.actionId;
      if (nextWidget !== activeWidget) {
        document.querySelector(`[data-action-id=${nextWidget}]`).active = true;
        document.querySelector(`[data-panel-id=${nextWidget}]`).hidden = false;
        activeWidget = nextWidget;
      } else {
        activeWidget = null;
      }
    };

    document.querySelector("calcite-action-bar").addEventListener("click", handleActionBarClick);

    let actionBarExpanded = false;

    document.addEventListener("calciteActionBarToggle", event => {
      actionBarExpanded = !actionBarExpanded;
      mapView.padding = {
        left: actionBarExpanded ? 135 : 49
      };
    });

    document.querySelector("calcite-shell").hidden = false;

  });

  map.addMany([featureLayer, graphicsLayer]);
});