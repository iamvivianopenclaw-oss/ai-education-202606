import type { MemoryCard } from "./types";

const STORAGE_KEY = "chempilot.memoryCards.v1";
const MAX_STORED_CARDS = 12;

export function loadMemoryCards(storage: Storage | undefined): MemoryCard[] {
  if (!storage) return [];

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isMemoryCard) : [];
  } catch {
    return [];
  }
}

export function saveMemoryCards(storage: Storage | undefined, cards: MemoryCard[]): void {
  if (!storage) return;

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(cards.slice(0, MAX_STORED_CARDS)));
  } catch {
    // Persistence is optional; the review flow should still work when storage is blocked.
  }
}

function isMemoryCard(value: unknown): value is MemoryCard {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<MemoryCard>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.experimentId === "string" &&
    typeof candidate.experimentTitle === "string" &&
    isFiniteNumber(candidate.createdAt) &&
    isOptionalFiniteNumber(candidate, "lastReviewedAt") &&
    isStringArray(candidate.keyPhenomena) &&
    typeof candidate.equation === "string" &&
    typeof candidate.principle === "string" &&
    typeof candidate.misconception === "string" &&
    typeof candidate.safety === "string" &&
    typeof candidate.mnemonic === "string" &&
    Array.isArray(candidate.recallPrompts) &&
    candidate.recallPrompts.every(isRecallPrompt) &&
    isMisconceptionPrompt(candidate.misconceptionPrompt) &&
    isShortAnswerPrompt(candidate.shortAnswerPrompt) &&
    (candidate.status === "new" || candidate.status === "due" || candidate.status === "mastered")
  );
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isOptionalFiniteNumber(value: object, key: keyof MemoryCard): boolean {
  return !(key in value) || isFiniteNumber((value as Partial<MemoryCard>)[key]);
}

function isRecallPrompt(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;

  const prompt = value as Partial<MemoryCard["recallPrompts"][number]>;
  return typeof prompt.question === "string" && typeof prompt.answer === "string";
}

function isMisconceptionPrompt(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;

  const prompt = value as Partial<MemoryCard["misconceptionPrompt"]>;
  return (
    typeof prompt.statement === "string" &&
    typeof prompt.isCorrect === "boolean" &&
    typeof prompt.explanation === "string"
  );
}

function isShortAnswerPrompt(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;

  const prompt = value as Partial<MemoryCard["shortAnswerPrompt"]>;
  return typeof prompt.question === "string" && typeof prompt.answer === "string";
}
