import React, { useState } from "react";
import { signInWithGoogle, logout, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import MapComponent from "./MapComponent";

function App() {
  const [user, setUser] = useState(null);

  onAuthStateChanged(auth, (currentUser) => setUser(currentUser));

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Nearby Hospital Finder</h2>
      {user ? (
        <>
          <p>Welcome, {user.displayName}</p>
          <button onClick={logout}>Logout</button>
          <MapComponent />
        </>
      ) : (
        <button onClick={signInWithGoogle}>Login with Google</button>
      )}
    </div>
  );
}

export default App;
