import React from "react";

function WitchIslandUI({ activeMainQuestion, hasBlessing, onBlessingClick }) {
  if (!activeMainQuestion) return null;

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
      {hasBlessing && (
        <div style={{ marginBottom: "2rem" }}>
          <button 
            className="action-button cinematic-button" 
            onClick={onBlessingClick}
            style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
          >
            Invoke The Blessing (Deduct 3 Years)
          </button>
        </div>
      )}
      <div className="witch-cauldrons" style={{ display: "flex", justifyContent: "center" }}>
        <div 
          className="witch-cauldron selected active"
          style={{
            width: "90px",
            height: "90px",
            border: "2px solid var(--gold)",
            borderRadius: "10px 10px 40px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(198,165,106,0.1)",
            boxShadow: "0 0 15px rgba(198,165,106,0.4)"
          }}
        >
          <div style={{ color: "#888", fontSize: "1.5rem", marginBottom: "5px" }}>✧</div>
          <h4 style={{ fontFamily: "var(--display)", color: "var(--cloud-white)", margin: 0, fontSize: "0.8rem" }}>
            Current Spell
          </h4>
        </div>
      </div>
    </div>
  );
}

export default WitchIslandUI;
