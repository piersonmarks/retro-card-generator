export type PokemonType =
  | "Fire"
  | "Water"
  | "Grass"
  | "Electric"
  | "Psychic"
  | "Dark"
  | "Fairy"
  | "Fighting"
  | "Normal"
  | "Dragon"
  | "Ice"
  | "Rock"
  | "Ground"
  | "Flying"
  | "Bug"
  | "Poison"
  | "Ghost"
  | "Steel";

export type PokemonAnalysis = {
  type: PokemonType;
  specialAbility: string;
  specialAbilityDescription: string;
};
