import React, { useEffect, useState } from "react";
import axios from "axios";

const Members = () => {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [pfoCounts, setPfoCounts] = useState({
    bukidnon: 0,
    cdo: 0,
    camiguin: 0,
    misor: 0,
    ldn: 0,
    misoc: 0,
  });

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
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/tupads");

        if (!Array.isArray(response.data.data)) {
          throw new Error("API did not return an array");
        }
        const counts = {
          bukidnon: 0,
          cdo: 0,
          camiguin: 0,
          misor: 0,
          ldn: 0,
          misoc: 0,
        };

        response.data.data.forEach((item) => {
          const pfo = item.pfo.toLowerCase(); 
          if (pfo.includes("bukidnon")) counts.bukidnon++;
          else if (pfo.includes("cdo")) counts.cdo++;
          else if (pfo.includes("camiguin")) counts.camiguin++;
          else if (pfo.includes("misor")) counts.misor++;
          else if (pfo.includes("ldn")) counts.ldn++;
          else if (pfo.includes("misoc")) counts.misoc++;
        });

        setPfoCounts(counts);
        console.log("Updated PFO Counts:", counts);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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
          ["ph-bk", pfoCounts.bukidnon],
          ["ph-6992", pfoCounts.cdo],
          ["ph-cm", pfoCounts.camiguin],
          ["ph-mn", pfoCounts.misor],
          ["ph-ln", pfoCounts.ldn],
          ["ph-md", pfoCounts.misoc],
        ];

        window.Highcharts.mapChart("container", {
          chart: {
            map: mapData,
          },
          title: {
            text: "Philippines Map",
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
  }, [scriptsLoaded, pfoCounts]);

  return (
    <div className="members-container">
      <div id="container" style={{ height: "80vh", width: "100%" }} />
    </div>
  );
};

export default Members;
