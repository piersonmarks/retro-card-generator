import type { PokemonType } from "@/app/types";

export function getTypeColor(type: PokemonType): string {
  const typeColors: Record<PokemonType, string> = {
    Fire: "#F08030",
    Water: "#6890F0",
    Grass: "#78C850",
    Electric: "#F8D030",
    Psychic: "#F85888",
    Dark: "#705848",
    Fairy: "#EE99AC",
    Fighting: "#C03028",
    Normal: "#A8A878",
    Dragon: "#7038F8",
    Ice: "#98D8D8",
    Rock: "#B8A038",
    Ground: "#E0C068",
    Flying: "#A890F0",
    Bug: "#A8B820",
    Poison: "#A040A0",
    Ghost: "#705898",
    Steel: "#B8B8D0",
  };

  return typeColors[type];
}
