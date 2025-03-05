import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { DateTime } from "luxon";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const Members = () => {
  const [selectedTimezone, setSelectedTimezone] = useState("UTC");
  const [currentTime, setCurrentTime] = useState(DateTime.now().setZone("UTC").toISO());

  const handleRegionClick = (regionName) => {
    const timezoneMapping = {
      China: "Asia/Shanghai",
      India: "Asia/Kolkata",
      "United States": "America/New_York",
      "United Kingdom": "Europe/London",
    };

    const timezone = timezoneMapping[regionName] || "UTC";

    setSelectedTimezone(`${regionName} (${timezone})`);
    setCurrentTime(DateTime.now().setZone(timezone).toISO());
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
      {/* Timezone Details */}
      <div>
        <h2>Selected Timezone: {selectedTimezone}</h2>
        <p>
          Current Time:{" "}
          {DateTime.fromISO(currentTime).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)}
        </p>
      </div>

      {/* World Map */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 150 }}
        style={{ width: "800px", height: "auto" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => handleRegionClick(geo.properties.NAME)}
                style={{
                  default: { fill: "#D6D6DA", outline: "none" },
                  hover: { fill: "#F53", outline: "none" },
                  pressed: { fill: "#E42", outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default Members;
