import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react";
import { nanoid } from "nanoid";

let visitor_id = localStorage.getItem("visitor_id");
if (!visitor_id) {
  visitor_id = nanoid();
  localStorage.setItem("visitor_id", visitor_id);
}

const growthbook = new GrowthBook({
  apiHost: process.env.REACT_APP_GROWTHBOOK_API_HOST,
  clientKey: process.env.REACT_APP_GROWTHBOOK_CLIENT_KEY,
  attributes: {
    id: visitor_id,
  },
  trackingCallback: (experiment, result) => {
    console.log({
      experimentId: experiment.key,
      variationId: result.variationId,
    });
  },
});

const FEATURES_ENDPOINT = process.env.REACT_APP_GROWTHBOOK_FEATURES_ENDPOINT;

fetch(FEATURES_ENDPOINT)
  .then((res) => res.json())
  .then((json) => {
    growthbook.setFeatures(json.features);
  });


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GrowthBookProvider growthbook={growthbook}>
      <App />
    </GrowthBookProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
