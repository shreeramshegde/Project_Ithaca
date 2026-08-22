import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

function IthacaIslandUI() {
  const { team, clearSession } = useAuth();
  
  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '4rem 2rem', background: 'rgba(0,0,0,0.6)', borderRadius: '16px', border: '1px solid var(--gold)' }}>
      <h2 style={{ fontFamily: 'var(--display)', color: 'var(--gold)', fontSize: '3rem', marginBottom: '1rem' }}>
        WELCOME HOME
      </h2>
      <p style={{ color: 'var(--cloud-white)', fontSize: '1.2rem', marginBottom: '2rem', lineHeight: 1.6 }}>
        The perilous seas have been crossed. The guardians have been bested. The odyssey is complete. 
        <br /><br />
        Your team's voyage has been permanently recorded in the annals of history. Please await the final reckoning on the master leaderboard.
      </p>
      
      <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', margin: '0 auto', maxWidth: '400px' }}>
        <h3 style={{ color: 'var(--success)', marginBottom: '0.5rem', fontSize: '1.5rem' }}>Journey Completed</h3>
        <p style={{ color: 'var(--cloud)', fontSize: '1.1rem', margin: 0 }}>
          Final Remaining Years: <strong style={{ color: 'var(--gold)' }}>{team?.remaining_years}</strong>
        </p>
      </div>
    </div>
  );
}

export default IthacaIslandUI;
