// src/App.js
import React, { useEffect, useState } from "react";
import "./index.css";

import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

// This file is created by earlier Amplify steps in the tutorial
import outputs from "../amplify_outputs.json";

// Configure Amplify with the backend you created (auth, API, DynamoDB, function)
Amplify.configure(outputs);

// Create a client to talk to your GraphQL API
const client = generateClient();

function App() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from the API once a user is signed in
  useEffect(() => {
    async function loadProfiles() {
      try {
        // "Profile" should match the model name from your Amplify Data schema
        const result = await client.models.Profile.list();
        setProfiles(result.data ?? []);
      } catch (err) {
        console.error("Error loading profiles:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfiles();
  }, []);

  return (
    <Authenticator>
      {({ user, signOut }) => (
        <main className="App">
          <div className="card">
            <h1>User profile app</h1>
            <p>
              Signed in as:{" "}
              <strong>{user?.signInDetails?.loginId ?? "(unknown user)"}</strong>
            </p>
            <button onClick={signOut}>Sign out</button>
          </div>

          <section>
            <h2>Profiles from the database</h2>

            {loading && <p>Loading profiles...</p>}

            {!loading && profiles.length === 0 && (
              <p>No profiles found yet.</p>
            )}

            <ul>
              {profiles.map((p) => (
                <li key={p.id}>
                  {p.email ?? "(no email)"} — id: {p.id}
                </li>
              ))}
            </ul>
          </section>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
