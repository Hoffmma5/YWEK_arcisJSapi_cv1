require(["esri/Map",
    "esri/WebMap",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/BasemapGallery",
    "esri/widgets/ScaleBar",
    "esri/widgets/LayerList",
    "esri/widgets/Expand"],
    (Map, WebMap, MapView, FeatureLayer, BasemapGallery, ScaleBar, LayerList, Expand) => {

        let programLayerView;

        const programNodes = document.querySelectorAll(`.program-item`);
        const programElement = document.getElementById("program-filter");
        const clearButton = document.getElementById("clearFilter");

        const webmap = new WebMap({
            portalItem: { // autocasts as new PortalItem()
                id: "095b6944f4764c4a8ebf5d4483d7ee22"
            }
        });

        const view = new MapView({
            container: "viewDiv",
            map: webmap,
            padding: {
                left: 50
            }
        });

        const basemapGallery = new BasemapGallery({
            view: view,
            container: "basemapGalleryContainer"
        });

        const scaleBar = new ScaleBar({
            view: view,
            style: "ruler",
            unit: "dual"
        });
        // Add widget to the bottom left corner of the view
        view.ui.add(scaleBar, {
            position: "bottom-left"
        });

        let layerList = new LayerList({
            view: view,
            container: "layerListContainer",
            dragEnabled: true
        });


        // click event handler for seasons choices
        programElement.addEventListener("click", filterByProgram);
        clearButton.addEventListener("click", (event) => {
            programLayerView.filter = null;
        });

        // User clicked on Winter, Spring, Summer or Fall
        // set an attribute filter on flood warnings layer view
        // to display the warnings issued in that season
        function filterByProgram(event) {
            const selectedProgram = event.target.getAttribute("data-program");
            if (selectedProgram !== 'BaN') {
                programLayerView.filter = {
                    where: "typ_studia = '" + selectedProgram + "'"
                };
            }
        }

        view.when(() => {

            const foundLayer = webmap.allLayers.find(function (layer) {
                return layer.title === "studentiGaK";
            });

            view.whenLayerView(foundLayer).then((layerView) => {
                // flash flood warnings layer loaded
                // get a reference to the flood warnings layerview
                programLayerView = layerView;
            });

            const { title } = webmap.portalItem;
            document.querySelector("#header-title").textContent = title;

            let activeWidget;

            const handleActionBarClick = ({ target }) => {
                console.log(activeWidget);
                if (target.tagName !== "CALCITE-ACTION") {
                    return;
                }

                if (activeWidget) {
                    document.querySelector(`[data-action-id=${activeWidget}]`).active = false;
                    document.querySelector(`[data-panel-id=${activeWidget}]`).hidden = true;
                }

                const nextWidget = target.dataset.actionId;
                console.log(nextWidget);
                if (nextWidget !== activeWidget) {
                    document.querySelector(`[data-action-id=${nextWidget}]`).active = true;
                    document.querySelector(`[data-panel-id=${nextWidget}]`).hidden = false;
                    activeWidget = nextWidget;
                } else {
                    activeWidget = null;
                }
            };

            document.querySelector("calcite-action-bar").addEventListener("click", handleActionBarClick);

        });

        /********************
         * Add feature layer
         ********************/

        // Carbon storage of trees in Warren Wilson College.
        // const featureLayer = new FeatureLayer({
        //     url: "https://services2.arcgis.com/LlQJoYHf9cwrM7NJ/arcgis/rest/services/studentiGaK/FeatureServer"
        // });

        // webmap.add(featureLayer);
    });