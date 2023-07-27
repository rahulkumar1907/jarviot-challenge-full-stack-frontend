import React, { useState } from 'react';
import axios from 'axios';

const RevokePage = () => {
    const [accessToken, setAccessToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    const handleTokenChange = (e) => {
        setAccessToken(e.target.value);
    };

    const revokeDriveAccess = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('http://localhost:5000/revoke-access', {
                params: {
                    accessToken: accessToken,
                },
            });
            setStatusMessage(response.data.message);
        } catch (error) {
            console.error('Error revoking access:', error);
            setError('Failed to revoke Google Drive access');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Revoke Page</h2>
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
                onClick={revokeDriveAccess}
                style={{
                    padding: '5px 10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Revoke Access
            </button>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {statusMessage && <p style={{ color: 'green' }}>{statusMessage}</p>}
        </div>
    );
};

export default RevokePage;
