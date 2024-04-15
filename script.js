require([
  "esri/WebMap",
  "esri/views/MapView",
  "esri/widgets/Sketch",
  "esri/layers/GraphicsLayer",
  "esri/widgets/Search",
  "esri/widgets/ScaleBar",
  "esri/widgets/LayerList",
  "esri/widgets/BasemapGallery",
], (
  WebMap,
  MapView,
  Sketch,
  GraphicsLayer,
  Search,
  ScaleBar,
  LayerList,
  BasemapGallery
) => {
  // INICIALIZACE
  const graphicsLayer = new GraphicsLayer();
  let programLayerView;

  const programFilter = document.getElementById("program-filter");
  const clearBtn = document.getElementById("clearFilter");

  const webmap = new WebMap({
    portalItem: {
      id: "095b6944f4764c4a8ebf5d4483d7ee22",
    },
  });

  const mapView = new MapView({
    container: "viewDiv",
    map: webmap,

    padding: {
      left: 49,
    },
  });

  // OVLADACE UDALOSTI
  programFilter.addEventListener("click", filterByProgram);
  clearBtn.addEventListener("click", () => {
    programLayerView.filter = null;
  });

  // FILTRACE

  /**
   * Nastaveni atributoveho filtru na layerView
   * @param {*} event
   */
  function filterByProgram(event) {
    const selectedProgram = event.target.getAttribute("data-program");
    if (selectedProgram !== "BaN") {
      programLayerView.filter = {
        where: "typ_studia = '" + selectedProgram + "'",
      };
    }
  }

  // PRACE S MAPVIEW
  mapView.when(() => {
    const layer = webmap.allLayers.find(function (layer) {
      return layer.title === "studentiGaK";
    });

    mapView.whenLayerView(layer).then((layerView) => {
      programLayerView = layerView; // ulozeni layerView do promenne
    });

    const sketch = new Sketch({
      layer: graphicsLayer,
      view: mapView,
      creationMode: "single",
      container: sketchContainer,
    });

    // search widget
    const searchWidget = new Search({
      view: mapView,
    });

    // pridani searchWidgetu do mapy
    mapView.ui.add(searchWidget, {
      position: "top-left",
      index: 0, // udava poradi widgetu nad sebou v rohu v mape
    });

    // scaleBar widget
    const scaleBar = new ScaleBar({
      view: mapView,
      style: "line",
      unit: "dual",
    });

    // pridani meritka do mapy
    mapView.ui.add(scaleBar, {
      position: "bottom-left",
    });

    // layerList widget
    const layerList = new LayerList({
      view: mapView,
      container: layerListContainer,
      dragEnabled: true,
    });

    // BasemapGallery widget
    const basemapGallery = new BasemapGallery({
      view: mapView,
      container: basemapGalleryContainer,
    });

    let activeWidget;

    /**
     * Funkce ovladajici kliknuti na action bar
     *
     * @param {Object} target - target kliknuti.
     * @return {void} nic nevraci
     */
    const handleActionBarClick = ({ target }) => {
      if (target.tagName !== "CALCITE-ACTION") {
        return;
      }

      if (activeWidget) {
        document.querySelector(
          `[data-action-id=${activeWidget}]`
        ).active = false;
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

    document
      .querySelector("calcite-action-bar")
      .addEventListener("click", handleActionBarClick);

    let actionBarExpanded = false;

    document.addEventListener("calciteActionBarToggle", (event) => {
      actionBarExpanded = !actionBarExpanded;
      mapView.padding = {
        left: actionBarExpanded ? 135 : 49,
      };
    });

    document.querySelector("calcite-shell").hidden = false;
  });

  webmap.add(graphicsLayer);
});
