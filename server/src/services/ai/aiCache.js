/**
 * In-Memory LRU / TTL Cache for AI Operations
 * Keyed by SHA-256 hash of feature and request payload.
 */

const crypto = require("crypto");

class AICache {
  constructor(maxEntries = 100, defaultTtlMs = 15 * 60 * 1000) {
    this.maxEntries = maxEntries;
    this.defaultTtlMs = defaultTtlMs;
    this.cache = new Map();
  }

  generateKey(feature, payload) {
    const serialized = JSON.stringify({ feature, payload });
    return crypto.createHash("sha256").update(serialized).digest("hex");
  }

  get(feature, payload) {
    const key = this.generateKey(feature, payload);
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // Refresh position for LRU
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.data;
  }

  set(feature, payload, data, ttlMs = this.defaultTtlMs) {
    const key = this.generateKey(feature, payload);

    if (this.cache.size >= this.maxEntries) {
      // Evict oldest entry
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
    });
  }

  clear() {
    this.cache.clear();
  }
}

const aiCache = new AICache();

module.exports = aiCache;
