import { useState } from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import axios from 'axios';
import { getAuthHeader } from '../../services/api';

const BASE = import.meta.env.VITE_TRIP_SERVICE_URL;

export default function QRModal({ tripId, onClose }) {
  const [token, setToken] = useState(null);
  const [accessType, setAccessType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = token ? `${window.location.origin}/trips/share/${tripId}?token=${token}` : null;

  const generateLink = async (type) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE}/api/trips/${tripId}/shares`,
        { accessType: type },
        { headers: getAuthHeader() }
      );
      setToken(res.data.token);
      setAccessType(res.data.accessType);
    } catch (err) {
      alert('Failed to generate share link.');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="qr-overlay" onClick={onClose}>
      <div className="qr-modal" onClick={e => e.stopPropagation()}>
        <h2>🔗 Share Trip</h2>

        {!token ? (
          <>
            <p>Choose access level for the share link:</p>
            <div className="qr-access-buttons">
              <button
                className="qr-access-btn view"
                onClick={() => generateLink('VIEW')}
                disabled={loading}
              >
                👁️ View Only
              </button>
              <button
                className="qr-access-btn edit"
                onClick={() => generateLink('EDIT')}
                disabled={loading}
              >
                ✏️ Can Edit
              </button>
            </div>
            {loading && <p style={{ color: '#94a3b8', marginTop: '1rem' }}>Generating...</p>}
          </>
        ) : (
          <>
            <div className={`qr-badge ${accessType === 'EDIT' ? 'edit' : 'view'}`}>
              {accessType === 'EDIT' ? '✏️ Edit Access' : '👁️ View Only'}
            </div>
            <p>Scan to open this trip</p>
            <div className="qr-code-wrapper">
              <QRCode value={shareUrl} size={200} />
            </div>
            <p className="qr-url">{shareUrl}</p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '1rem' }}>
              <button className="qr-copy-btn" onClick={copyLink}>
                {copied ? '✅ Copied!' : '📋 Copy Link'}
              </button>
              <button className="qr-access-btn view" onClick={() => { setToken(null); setAccessType(null); }}>
                ← Back
              </button>
            </div>
          </>
        )}

        <button className="qr-close-btn" style={{ marginTop: '1rem' }} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
