export default function LocaleLoading() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#F8F4F3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "3px solid rgba(188,10,24,0.15)",
          borderTopColor: "#BC0A18",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

