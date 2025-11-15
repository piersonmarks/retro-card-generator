export function PokemonCardTemplate({
  name = "Pikachu",
  description = "A description of the Pokemon.",
  maxHp = 60,
  currentHp = 60,
  type = "Lightning",
}: {
  name?: string;
  description?: string;
  maxHp?: number;
  currentHp?: number;
  type?: string;
}) {
  return (
    <div
      style={{
        width: "245px",
        height: "342px",
        backgroundColor: "#ffffff",
        border: "2px solid #000000",
        borderRadius: "12px",
        padding: "8px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
        position: "relative",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "4px",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            margin: 0,
            color: "#000000",
          }}
        >
          {name}
        </h2>
        <div
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#000000",
          }}
        >
          HP {currentHp} / {maxHp}
        </div>
      </div>

      {/* Type Badge */}
      <div
        style={{
          display: "inline-block",
          backgroundColor: "#FFD700",
          color: "#000000",
          padding: "2px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "bold",
          marginBottom: "8px",
          width: "fit-content",
        }}
      >
        {type}
      </div>

      {/* Image Area */}
      <div
        style={{
          width: "100%",
          height: "180px",
          backgroundColor: "#f0f0f0",
          border: "1px solid #cccccc",
          borderRadius: "4px",
          marginBottom: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            color: "#999999",
            fontSize: "14px",
          }}
        >
          Image
        </div>
      </div>

      {/* Description Section */}
      <div
        style={{
          marginTop: "auto",
          padding: "8px",
          fontSize: "11px",
          color: "#333333",
          lineHeight: "1.4",
          borderTop: "1px solid #cccccc",
        }}
      >
        {description}
      </div>
    </div>
  );
}
