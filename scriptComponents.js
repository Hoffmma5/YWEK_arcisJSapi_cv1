require(["esri/WebMap"], (WebMap) => {
    document.querySelector("arcgis-map").addEventListener("arcgisViewReadyChange", (event) => {
        const { portalItem } = event.target.map;
        const navigationLogo = document.querySelector("calcite-navigation-logo");
        navigationLogo.heading = portalItem.title;
        navigationLogo.description = portalItem.snippet;
        navigationLogo.thumbnail = portalItem.thumbnailUrl;
        navigationLogo.href = portalItem.itemPageUrl;
        navigationLogo.label = "Thumbnail of map";

        // turn off the loader once the view is ready
        document.querySelector("calcite-loader").hidden = true;
    });
})