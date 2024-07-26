import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { server } from "../server";
import styles from "../styles/styles";

const SellerActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        await axios
          .post(`${server}/shop/activation`, {
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
  }, [activation_token]);

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
          <h4 className="font-bold text-center">Your account successfully activated!</h4>
          <Link to="/shop-login" className="text-blue-600 pl-2 text-center">
            Sign in
          </Link>
          </div>
      ) : (
        <p>Activating your account...</p>
      )}
    </div>
  );
};

export default SellerActivationPage;
