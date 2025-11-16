// biome-ignore lint/correctness/noUnusedImports: React is required at runtime for Satori
import React from "react";
import type { PokemonType } from "@/app/types";
import { getTypeColor } from "@/app/utils/get-type-color";

export function PokemonCard({
  name,
  specialAbility,
  specialAbilityDescription,
  birthday,
  type,
  imageUrl,
}: {
  name: string;
  specialAbility: string;
  specialAbilityDescription: string;
  birthday: string;
  type: PokemonType;
  imageUrl: string;
}) {
  // Calculate age from birthday
  const birthDate = new Date(birthday);
  const age = new Date().getFullYear() - birthDate.getFullYear();
  const birthYear = birthDate.getFullYear();
  const typeColor = getTypeColor(type);
  return (
    <div
      style={{
        width: "500px",
        height: "700px",
        aspectRatio: "5/7",
        background:
          "linear-gradient(to bottom, #f8f4e6 0%, #fff9e6 50%, #f5f0d8 100%)",
        border: "12px solid #e4c157",
        borderRadius: "16px",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
        position: "relative",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "6px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#2c2c2c",
            textShadow: "1px 1px 0px rgba(255,255,255,0.8)",
          }}
        >
          {name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#e74c3c",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span style={{ fontSize: "12px" }}>HP</span>
          <span>{age}</span>
        </div>
      </div>

      {/* Type Badge */}
      <div
        style={{
          display: "flex",
          background: typeColor,
          color: "#ffffff",
          padding: "4px 12px",
          borderRadius: "12px",
          fontSize: "11px",
          fontWeight: "bold",
          marginBottom: "10px",
          border: "2px solid rgba(0,0,0,0.2)",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          justifyContent: "center",
          textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
        }}
      >
        {type} TYPE
      </div>

      {/* Image Area - Square */}
      <div
        style={{
          width: "100%",
          position: "relative",
          paddingBottom: "100%",
          marginBottom: "10px",
          display: "flex",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(135deg, #e8f4f8 0%, #d4e8f0 50%, #e8f4f8 100%)",
            border: "3px solid #b8860b",
            borderRadius: "8px",
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* biome-ignore lint: This is for Satori SVG rendering, not Next.js */}
          <img
            alt={name}
            height="100%"
            src={imageUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            width="100%"
          />
        </div>
      </div>

      {/* Stats/Ability Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff9e6",
          padding: "8px",
          borderRadius: "6px",
          border: "2px solid #d4af37",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "10px",
            fontWeight: "bold",
            color: "#8b4513",
            marginBottom: "4px",
            textTransform: "uppercase",
          }}
        >
          {specialAbility.toUpperCase()}
        </div>
        <div
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 7,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontSize: "11px",
            color: "#333333",
            lineHeight: "1.3",
          }}
        >
          {specialAbilityDescription}
        </div>
      </div>

      {/* Bottom info bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "9px",
          color: "#666666",
        }}
      >
        <div style={{ display: "flex" }}>Rare</div>
        <div style={{ display: "flex" }}>{birthYear}</div>
      </div>
    </div>
  );
}
