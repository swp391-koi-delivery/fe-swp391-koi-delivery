import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import locationIcon from "./location.png"; // Icon add in map

// Tọa độ Huế
const hueCoord = { lat: 16.4634, lon: 107.5858 };

// Các vùng miền Việt Nam
const isNorth = (lat) => lat > 14.0583;  // Bắc Việt Nam (Hà Nội trở lên)
const isCentral = (lat, lon) => lat >= 8.1 && lat <= 17 && lon >= 102.1 && lon <= 109.5;  // Miền Trung (từ Đà Nẵng đến các tỉnh miền Trung)
const isSouth = (lat) => lat < 14.0583;  // Nam Việt Nam (HCM và các tỉnh phía Nam)

// Kiểm tra nếu điểm nằm trong lãnh thổ Việt Nam
const isInVietnam = (lat, lon) => {
  return lat >= 8.1 && lat <= 23.4 && lon >= 102.1 && lon <= 109.5;
};

// Hàm lấy tuyến đường từ API (OSRM)
const getRoute = async (start, end) => {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?geometries=geojson`
    );
    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
      return data.routes[0].geometry.coordinates;
    }
    return [];
  } catch (error) {
    console.error("Error fetching route:", error);
    return [];
  }
};

function Map({ origin, destination }) {
  useEffect(() => {
    // Khởi tạo bản đồ, căn giữa theo tọa độ Việt Nam
    const map = L.map("map").setView([14.0583, 108.2772], 6); 
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    // Sửa lỗi thiếu biểu tượng mặc định
    delete L.Icon.Default.prototype._getIconUrl;

    // Tạo biểu tượng tùy chỉnh
    const customIcon = new L.Icon({
      iconUrl: locationIcon,
      iconSize: [20, 20], // Kích thước icon
    });

    //Thêm điểm đánh dấu điểm xuất phát nếu trong địa phận Việt Nam
    if (origin && isInVietnam(origin.lat, origin.lon)) {
      L.marker([origin.lat, origin.lon], { icon: customIcon })
        .addTo(map)
        .bindPopup("Start Location")
        .openPopup();
    }

    // Thêm điểm đánh dấu cho điểm đến nếu trong phạm vi Việt Nam
    if (destination && isInVietnam(destination.lat, destination.lon)) {
      L.marker([destination.lat, destination.lon], { icon: customIcon })
        .addTo(map)
        .bindPopup("End Location")
        .openPopup();
    }

    // Kiểm tra hướng đi và điều chỉnh tuyến đường
    const fetchRoute = async () => {
      let newRoute = [];

      if (origin && destination) {
        // Nếu cả hai điểm đều nằm trong lãnh thổ Việt Nam
        if (isInVietnam(origin.lat, origin.lon) && isInVietnam(destination.lat, destination.lon)) {
          // Nếu di chuyển trong cùng một khu vực (Bắc, Trung, Nam), không cần đi qua Huế
          if (
            (isNorth(origin.lat) && isNorth(destination.lat)) || 
            (isCentral(origin.lat, origin.lon) && isCentral(destination.lat, destination.lon)) || 
            (isSouth(origin.lat) && isSouth(destination.lat))
          ) {
            // Vẽ tuyến đường bình thường giữa origin và destination
            newRoute = await getRoute(origin, destination);
          } 
          // Nếu di chuyển từ Bắc vào Nam hoặc Nam vào Bắc, cần đi qua Huế
          else {
            const routeToHue = await getRoute(origin, hueCoord);
            if (routeToHue.length > 0) {
              const routeFromHueToDest = await getRoute(hueCoord, destination);
              if (routeFromHueToDest.length > 0) {
                newRoute = [...routeToHue, ...routeFromHueToDest];
              }
            }
          }
        }
      }

      // Vẽ tuyến đường trên bản đồ nếu có
      if (newRoute.length > 0) {
        const validRoute = newRoute.filter(
          ([lon, lat]) =>
            lat >= 8.1 && lat <= 23.4 && lon >= 102.1 && lon <= 109.5,
        );

        if (validRoute.length > 1) {
          L.polyline(
            validRoute.map(([lon, lat]) => [lat, lon]),
            { color: "blue" },
          ).addTo(map);
          map.fitBounds(validRoute.map(([lon, lat]) => [lat, lon]));
        }
      }
    };

    fetchRoute();

    // Dọn dẹp bản đồ khi ngắt kết nối thành phần
    return () => map.remove();
  }, [origin, destination]);

  return <div id="map" style={{ height: "600px", width: "100%" }}></div>;
}

export default Map;
