import React, { useEffect, useState, useRef } from 'react';
import { Connection } from '@solana/web3.js';
import { getPythClusterApiUrl, PythConnection, getPythProgramKeyForCluster } from '@pythnetwork/client';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";



const MarketDataPage = () => {
    const CLUSTER = 'pythnet'; 
    const PYTH_CLUSTER_API_URL = getPythClusterApiUrl(CLUSTER)
    const PYTH_PUBLIC_KEY = getPythProgramKeyForCluster(CLUSTER);

    const [marketData, setMarketData] = useState([]); 
    const [view, setView] = useState("table"); 
    const startTime = useRef(null);
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [minValue, setMinValue] = useState(Number.MAX_SAFE_INTEGER);
    const [maxValue, setMaxValue] = useState(0);

    useEffect(() => {
        const connection = new Connection(PYTH_CLUSTER_API_URL);
        const pythConnection = new PythConnection(connection, PYTH_PUBLIC_KEY);

        try {
            pythConnection.start();

            const handlePriceChange = (product, price) => {
                if (product.symbol == 'Crypto.BTC/USD') {
                    if (!startTime.current) startTime.current = new Date() / 1000;
                    setMarketData((prevData) => [
                        ...prevData,
                        {
                            symbol: product.symbol,
                            price: price.price,
                            confidence: price.confidence,
                            time: new Date() / 1000,
                        }
                    ]);
                    setMaxValue(Math.max(maxValue, price.price));
                    setMinValue(Math.min(minValue, price.price));
                }
            };
    
            pythConnection.onPriceChange(handlePriceChange);

        } catch(error) {
            throw error;
        }
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => {
            console.log("Gracefully Stopping Pyth connection");
            clearInterval(interval);
            pythConnection.stop();
        }
    }, [startTime]); 

    return (
        <div style={{ padding: '20px' }}>
        <h1>Pyth Market Data</h1>
        <button onClick={() => setView(view === "table" ? "graph" : "table")}>
            {view === "table" ? "Graph View" : "Table View"}
        </button>
        {view === "table" ? (
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
                <td>{item.time}</td>
                <td>{item.symbol}</td>
                <td>{item.price}</td>
                <td>{item.confidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
        ) : (
        <div style={{ width: "100%", height: "500px", marginTop: "20px" }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="time"
                    domain={[startTime.current, currentTime / 1000]} 
                    type="number"
                    tickFormatter={(tick) =>
                    new Date(tick * 1000).toLocaleTimeString()
                    } 
                    label={{ value: "Time", position: "insideBottom", offset: -5 }}
                />
                <YAxis
                    label={{
                    value: "Price",
                    angle: -90,
                    position: "insideLeft",
                    }}
                    domain = {[minValue, maxValue]}
                />
                <Tooltip
                    labelFormatter={(label) =>
                    new Date(label * 1000).toLocaleTimeString()
                    }
                />
                <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
        )}
      </div>
    );
};

export default MarketDataPage;