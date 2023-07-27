import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Chart from 'chart.js/auto';

const AnalyticsPage = () => {
    const location = useLocation();
    const [accessToken, setAccessToken] = useState('');
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchAccessToken = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/auth/google/callback', {
                params: {
                    code: new URLSearchParams(location.search).get('code'),
                },
            });
            setAccessToken(response.data.tokens.access_token);
            setAnalyticsData(response.data.data);
        } catch (error) {
            console.error('Error fetching access token:', error);
            setError('Failed to fetch access token and analytics');
        }
    }, [location.search]);

    useEffect(() => {
        fetchAccessToken();
    }, [fetchAccessToken]);

    const handleTokenChange = (e) => {
        setAccessToken(e.target.value);
    };

    const fetchAnalytics = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('http://localhost:5000/analytics', {
                params: {
                    accessToken: accessToken,
                },
            });
            setAnalyticsData(response.data.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            setError('Failed to fetch Google Drive analytics');
        } finally {
            setLoading(false);
        }
    };

    // Function to convert large numbers to human-readable format with commas
    const formatNumberWithCommas = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    // Function to convert bytes to GB
    const bytesToGB = (bytes) => {
        return (bytes / (1024 * 1024 * 1024)).toFixed(2);
    };

    useEffect(() => {
        if (analyticsData) {
            // Draw the Doughnut chart after data is available
            const ctx = document.getElementById('myChart').getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Used Space', 'Free Space'],
                    datasets: [
                        {
                            data: [
                                parseInt(analyticsData.driveSize.usage),
                                parseInt(analyticsData.driveSize.limit) - parseInt(analyticsData.driveSize.usage),
                            ],
                            backgroundColor: ['green', 'red'],
                        },
                    ],
                },
                options: {
                    legend: {
                        display: true,
                        position: 'bottom',
                    },
                    tooltips: {
                        callbacks: {
                            label: (tooltipItem, data) => {
                                const label = data.labels[tooltipItem.index];
                                const value = data.datasets[0].data[tooltipItem.index];
                                return `${label}: ${formatNumberWithCommas(value)} bytes`;
                            },
                        },
                    },
                },
            });
        }
    }, [analyticsData]);



    return (
        <div>

            <h2>Analytics Page</h2>
            <input
                type="text"
                placeholder="Enter access token"
                value={accessToken}
                onChange={handleTokenChange}
                style={{
                    padding: '5px',
                    marginBottom: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                }}
            />
            <button
                onClick={fetchAnalytics}
                style={{
                    padding: '5px 10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Fetch Analytics
            </button>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {analyticsData && (
                <div>
                    <h3 style={{ marginTop: '20px', borderBottom: '1px solid #ccc' }}>Google Drive Analytics:</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '10px', background: '#f0f0f0', borderBottom: '1px solid #ccc' }}>File Name</th>
                                <th style={{ padding: '10px', background: '#f0f0f0', borderBottom: '1px solid #ccc' }}>File Size (bytes)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analyticsData.filesData.map((file, index) => (
                                <tr key={index} style={{ background: index % 2 === 0 ? '#f9f9f9' : '#ffffff' }}>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{file.name}</td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{file.size}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <p style={{ marginTop: '20px' }}>Drive Size: {formatNumberWithCommas(analyticsData.driveSize.usage)} bytes / {bytesToGB(analyticsData.driveSize.limit)} GB</p>
                    <p>Number of People with Access: {analyticsData.peopleWithAccess}</p>
                    <p>Count of Public Files: {analyticsData.publicFilesCount}</p>
                </div>
            )}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <h3>Drive Size</h3>

                <canvas id="myChart"></canvas>

            </div>
        </div>
    );
};

export default AnalyticsPage;

