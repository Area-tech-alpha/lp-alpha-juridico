import type { Answers } from "./steps";

// Only "Sou apenas eu" disqualifies the lead; the other three team sizes
// qualify. This must never be surfaced to the visitor.
const DISQUALIFYING_TEAM_SIZE = "Sou apenas eu";

export function isQualified(answers: Answers): boolean {
  return answers.quantidadeAdvogados !== DISQUALIFYING_TEAM_SIZE;
}
