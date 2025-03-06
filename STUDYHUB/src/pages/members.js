import React, { useEffect, useState } from "react";

const Members = () => {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(script);
      });
    };

    const loadHighcharts = async () => {
      try {
        await loadScript("https://code.highcharts.com/maps/highmaps.js");
        
        if (window.Highcharts && window.Highcharts.AST) {
          await loadScript("https://code.highcharts.com/modules/exporting.js");
        }

        setScriptsLoaded(true);
      } catch (error) {
        console.error("Error loading Highcharts scripts:", error);
      }
    };

    loadHighcharts();
  }, []);

  useEffect(() => {
    const loadMap = async () => {
      if (!scriptsLoaded || !window.Highcharts) return;

      try {
        const response = await fetch(
          "https://code.highcharts.com/mapdata/countries/ph/ph-all.topo.json"
        );

        if (!response.ok) throw new Error("Failed to fetch map data");

        const mapData = await response.json();

        const mindanaoRegions = [
          ["ph-zs", 1], ["ph-zn", 2], ["ph-zm", 3], ["ph-ls", 4], ["ph-ln", 5],
          ["ph-bk", 6], ["ph-ms", 7], ["ph-mr", 8], ["ph-cm", 9], ["ph-ds", 10],
          ["ph-dn", 11], ["ph-do", 12], ["ph-dv", 13], ["ph-sk", 14], ["ph-ss", 15],
          ["ph-cg", 16], ["ph-su", 17], ["ph-sm", 18], ["ph-ag", 19], ["ph-as", 20],
          ["ph-md", 21], ["ph-ta", 22], ["ph-bs", 23], ["ph-sg", 24]
        ];

        window.Highcharts.mapChart("container", {
          chart: {
            map: mapData,
          },
          title: {
            text: "Mindanao Map",
          },
          subtitle: {
            text: "Showing only Mindanao regions",
          },
          mapNavigation: {
            enabled: true,
            buttonOptions: {
              verticalAlign: "bottom",
            },
          },
          colorAxis: {
            min: 0,
          },
          series: [
            {
              data: mindanaoRegions,
              name: "Mindanao Regions",
              states: {
                hover: {
                  color: "#BADA55",
                },
              },
              dataLabels: {
                enabled: true,
                format: "{point.name}",
              },
            },
          ],
        });
      } catch (error) {
        console.error("Error initializing Highcharts map:", error);
      }
    };

    loadMap();
  }, [scriptsLoaded]);

  return (
    <div className="members-container">
      <div id="container" style={{ height: "80vh", width: "100%" }} />
    </div>
  );
};

export default Members;
