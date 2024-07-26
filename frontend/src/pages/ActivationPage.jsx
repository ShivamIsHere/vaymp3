import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Import Link
import { server } from "../server";
import styles from "../styles/styles"; // Ensure you have the correct styles import

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        await axios
          .post(`${server}/user/activation`, {
            activation_token,
          })
          .then((res) => {
            console.log(res);
            setActivated(true); // Set activated to true on success
          })
          .catch((err) => {
            setError(true);
          });
      };
      sendRequest();
    }
  }, [activation_token]); // Add activation_token as a dependency

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {error ? (
        <p>Your token is expired!</p>
      ) : activated ? (
        <div className="flex-col text-center">
          <h4 className="font-bold">Account successfully created</h4>
          <br/>
          <Link to="/login" className="text-blue-600 pl-2">
            Sign in
          </Link>
        </div>
      ) : (
        <p>Activating your account...</p>
      )}
    </div>
  );
};

export default ActivationPage;
