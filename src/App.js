import React, { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { Loader } from "@googlemaps/js-api-loader";

// Firebase configuration (Replace with your Firebase credentials)
const firebaseConfig = {
  apiKey: "AIzaSyD4SleZbXMwmBKj7x1mPWxhIHGA_n3rpZs",
  authDomain: "hospital-finder-17044.firebaseapp.com",
  projectId: "hospital-finder-17044",
  storageBucket: "hospital-finder-17044.firebasestorage.app",
  messagingSenderId: "894955091163",
  appId: "1:894955091163:web:c4727f63bfc3ed060a08fe",
  measurementId: "G-BKFM1BMPJV"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();

const GOOGLE_MAPS_API_KEY = "AIzaSyD4SleZbXMwmBKj7x1mPWxhIHGA_n3rpZs";

export default function App() {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Login Failed:", error);
    }
  };

  const logout = () => {
    signOut(auth);
    setUser(null);
    setHospitals([]);
  };

  useEffect(() => {
    if (user) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true }
      );
    }
  }, [user]);

  useEffect(() => {
    if (location) {
      const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY, libraries: ["places"] });
      loader.load().then(() => {
        const { google } = window;
        const map = new google.maps.Map(document.getElementById("map"), {
          center: location,
          zoom: 14,
        });
        
        new google.maps.Marker({ position: location, map, title: "You are here",label:"You" });
        
        const service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location,
          radius: 5000,
          type: "hospital",
        }, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            setHospitals(results);
            results.forEach((place) => {
              new google.maps.Marker({ position: place.geometry.location, map, title: place.name,label:"H" });
            });
          }
        });
      });
    }
  }, [location]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {user ? (
        <>
          <h2>Welcome, {user.displayName}</h2>
          <button onClick={logout}>Logout</button>
          <div id="map" style={{ height: "500px", width: "80%", margin: "20px auto" }}></div>
          <h3>Nearby Hospitals:</h3>
          <ul>
            {hospitals.map((hospital) => (
              <li key={hospital.place}>{hospital.name}</li>
            ))}
          </ul>
        </>
      ) : (
        <button onClick={loginWithGoogle}>Login with Google</button>
      )}
    </div>
  );
}
