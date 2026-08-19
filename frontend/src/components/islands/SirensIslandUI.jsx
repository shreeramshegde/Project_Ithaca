import React from "react";

function SirensIslandUI({ activeMainQuestion, hasSandals, onSandalsClick }) {
  if (!activeMainQuestion) return null;

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
      {hasSandals && (
        <div style={{ marginBottom: "2rem" }}>
          <button 
            className="action-button cinematic-button" 
            onClick={onSandalsClick}
            style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
          >
            Use Hermes Sandals to Bypass Time (Deduct 2 Years)
          </button>
        </div>
      )}
      <div className="sirens-portals" style={{ display: "flex", justifyContent: "center" }}>
        <div 
          className="siren-portal selected active"
          style={{
            width: "100px",
            height: "140px",
            border: "2px solid var(--gold)",
            borderRadius: "50px 50px 10px 10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(198,165,106,0.1)",
            boxShadow: "0 0 20px rgba(198,165,106,0.4)"
          }}
        >
          <div className="portal-ring"></div>
          <span style={{ fontSize: "1.5rem", color: "#fff" }}>Ω</span>
          <h4 style={{ fontFamily: "var(--display)", color: "var(--cloud-white)", marginTop: "10px", fontSize: "0.9rem" }}>
            Current Song
          </h4>
        </div>
      </div>
    </div>
  );
}

export default SirensIslandUI;
