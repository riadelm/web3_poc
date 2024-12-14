import React, { useEffect, useState } from 'react';
import { Connection } from '@solana/web3.js';
import { getPythClusterApiUrl, PythConnection, getPythProgramKeyForCluster } from '@pythnetwork/client';



const MarketDataPage = () => {
    const CLUSTER = 'pythnet'; 
    const PYTH_CLUSTER_API_URL = getPythClusterApiUrl(CLUSTER)
    const PYTH_PUBLIC_KEY = getPythProgramKeyForCluster(CLUSTER);

    const [marketData, setMarketData] = useState([]); // list of market data
    const [loading, setLoading] = useState(true); // loading toggle

    useEffect(() => {
        const connection = new Connection(PYTH_CLUSTER_API_URL);
        const pythConnection = new PythConnection(connection, PYTH_PUBLIC_KEY);

        try {
            pythConnection.start();

            const handlePriceChange = (product, price) => {
                if (product.symbol == 'Crypto.BTC/USD') {
                    setMarketData((prevData) => [
                        ...prevData,
                        {
                            symbol: product.symbol,
                            price: price.price,
                            confidence: price.confidence,
                            timestamp: new Date().toLocaleTimeString(),
                        }
                    ]);
                }
            };
    
            pythConnection.onPriceChange(handlePriceChange);
        } catch(error) {
            throw error;
        }

        return () => {
            console.log("Stopping Pyth connection...");
            pythConnection.stop();
        }
    }, []); 

    return (
        <div style={{ padding: '20px' }}>
        <h1>Pyth Market Data</h1>
        <table border="1" style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
                <th>Time</th>
                <th>Symbol</th>
                <th>Price</th>
                <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {marketData.map((item, index) => (
              <tr key={index}>
                <td>{item.timestamp}</td>
                <td>{item.symbol}</td>
                <td>{item.price}</td>
                <td>{item.confidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
};

export default MarketDataPage;