/* import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const libraries = ["places"];
const mapContainerStyle = { width: "100%", height: "500px" };

function MapComponent() {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const mapRef = useRef(null);
  const placesServiceRef = useRef(null); // Store PlacesService instance

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => console.error("Error fetching location:", error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    if (location && mapRef.current && placesServiceRef.current) {
      fetchNearbyHospitals(location.lat, location.lng);
    }
  }, [location]);

  const fetchNearbyHospitals = (lat, lng) => {
    if (!placesServiceRef.current) {
      console.error("PlacesService is not initialized yet.");
      return;
    }

    console.log("Fetching hospitals for:", lat, lng);

    const request = {
      location: new window.google.maps.LatLng(lat, lng),
      radius: 5000,
      type: ["hospital"],
    };

    placesServiceRef.current.nearbySearch(request, (results, status) => {
      console.log("Places API Status:", status);
      console.log("Results:", results);

      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setHospitals(results);
      } else {
        console.error("No hospitals found or API error:", status);
      }
    });
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyD4SleZbXMwmBKj7x1mPWxhIHGA_n3rpZs" libraries={libraries}>
      {location ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={14}
          center={location}
          onLoad={(map) => {
            mapRef.current = map;
            placesServiceRef.current = new window.google.maps.places.PlacesService(map);
            fetchNearbyHospitals(location.lat, location.lng);
          }}
        >
          <Marker position={location} label="You" />
          {hospitals.map((hospital, index) => (
            <Marker key={index} position={hospital.geometry.location} label="H" />
          ))}
        </GoogleMap>
      ) : (
        <p>Fetching location...</p>
      )}
    </LoadScript>
  );
}

export default MapComponent;
 */
import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const libraries = ["places"];
const mapContainerStyle = { width: "100%", height: "500px" };

function MapComponent() {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const mapRef = useRef(null);
  const placesServiceRef = useRef(null);

  // Get User's Current Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          console.log("User Location:", { lat: latitude, lng: longitude });
        },
        (error) => console.error("Error fetching location:", error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Fetch Nearby Hospitals (Only if PlacesService is available)
  const fetchNearbyHospitals = (lat, lng) => {
    if (!placesServiceRef.current) {
      console.error("❌ PlacesService is not initialized yet.");
      return;
    }
  
    console.log("🔍 Fetching hospitals for:", lat, lng);
  
    const request = {
      location: new window.google.maps.LatLng(lat, lng),
      radius: 5000, 
      type: ["hospital"],
    };
  
    try {
      placesServiceRef.current.nearbySearch(request, (results, status) => {
        console.log("📌 Places API Status:", status);
        console.log("Results:", results);
  
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setHospitals(
            results.map((hospital) => ({
              ...hospital,
              position: {
                lat: hospital.geometry.location.lat(),
                lng: hospital.geometry.location.lng(),
              },
            }))
          );
        } else {
          console.error("⚠️ NearbySearch Error:", status);
        }
      });
    } catch (error) {
      console.error("❌ NearbySearch Execution Error:", error);
    }
  };
  
  return (
    <LoadScript googleMapsApiKey="AIzaSyD4SleZbXMwmBKj7x1mPWxhIHGA_n3rpZs" libraries={libraries}>
      {location ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={14}
          center={location}
          onLoad={(map) => {
            console.log("🗺️ Google Map Loaded");
            mapRef.current = map;

            placesServiceRef.current = new window.google.maps.places.PlacesService(map);

            if (placesServiceRef.current) {
              console.log("✅ PlacesService initialized");
              fetchNearbyHospitals(location.lat, location.lng);
            } else {
              console.error("❌ PlacesService failed to initialize.");
            }
          }}
        >
          {/* User Location Marker */}
          <Marker position={location} label="You" />

          {/* Hospital Markers */}
          {hospitals.map((hospital, index) => (
            <Marker key={index} position={hospital.position} label="H" />
          ))}
        </GoogleMap>
      ) : (
        <p>Fetching location...</p>
      )}
    </LoadScript>
  );
}

export default MapComponent;
