export function normalizeQuery(query) {
    const STOP_WORDS = [
        "a",
        "an",
        "and",
        "the",
        "in",
        "on",
        "at",
        "for",
        "with",
        "to",
        "of",
        "by",
        "is",
        "are",
        "was",
        "were",
        "be",
        "been",
        "it",
        "this",
        "that",
        "these",
        "those",
        "near",
        "good",
        "best",
        "place",
    ];

    return query
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter((w) => w && !STOP_WORDS.includes(w))
        .sort()
        .join(" ");
}
