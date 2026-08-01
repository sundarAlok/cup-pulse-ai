import test from "node:test";
import assert from "node:assert/strict";
import { resolveStoredPhotoUrl } from "./profileUpdates";

test("preserves the existing photo URL when the incoming value is blank", () => {
  assert.equal(resolveStoredPhotoUrl("https://cdn.example.com/avatar.png", "   "), "https://cdn.example.com/avatar.png");
  assert.equal(resolveStoredPhotoUrl("https://cdn.example.com/avatar.png", ""), "https://cdn.example.com/avatar.png");
});

test("uses the new photo URL when a non-empty value is provided", () => {
  assert.equal(resolveStoredPhotoUrl("https://cdn.example.com/old.png", "https://cdn.example.com/new.png"), "https://cdn.example.com/new.png");
});
