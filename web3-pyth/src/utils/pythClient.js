// import { Connection } from '@solana/web3.js';
// import React, { useEffect, useState } from 'react';
// import { getPythClusterApiUrl, PythConnection, getPythProgramKeyForCluster } from '@pythnetwork/client';


// // Needed for a pyth client:
// // A connection with Remote Procedure Call URL 
// // A cluster within the pyth network
// // 1. Connect to pyth using the connection to Solana and cluster name
// // 2. Await data load
// // 3. Get data 

// const CLUSTER = 'pythnet'; 
// const PYTH_CLUSTER_API_URL = getPythClusterApiUrl(CLUSTER)
// const PYTH_PUBLIC_KEY = getPythProgramKeyForCluster(CLUSTER);

// const fetchPythData = () => {
//     const [marketData, setMarketData] = useState([]);

//     useEffect(() => {
//         try {
//             const connection = new Connection(PYTH_CLUSTER_API_URL);
//             const pythConnection = new PythConnection(connection, PYTH_PUBLIC_KEY);

//             pythConnection.start();

//             const handlePriceChange = (product, price) => {
//                 setMarketData((prevData) => [
//                     ...prevData,
//                     {
//                         symbol: product.symbol,
//                         price: price.price,
//                         confidence: price.confidence,
//                         timestamp: new Date().toLocaleTimeString(),
//                     }
//                 ]);
//             };
    
//             pythConnection.onPriceChange(handlePriceChange);
//         } catch(error) {
//             throw error;
//         }

//         return () => {
//             console.log("Stopping Pyth connection...");
//             pythConnection.stop();
//         }
//     }, []); 
// };