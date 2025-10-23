/**
 * Test suite for validating Monologue parameter dumps against JSON schema
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { validateMonologueParametersWithSchema } from "../validator";

describe("Monologue Parameter Validation", () => {
  const dumpFiles = ["dump1"];

  describe("JSON Schema Validation", () => {
    dumpFiles.forEach((dumpFile) => {
      it(`should validate ${dumpFile}.json successfully`, () => {
        const filePath = join(__dirname, "data", "parsed", `${dumpFile}.json`);
        const data = JSON.parse(readFileSync(filePath, "utf8"));

        const result = validateMonologueParametersWithSchema(data);

        if (!result.valid) {
          console.error(`\nValidation errors for ${dumpFile}:`);
          result.errors?.forEach((err) => console.error(`  - ${err}`));
        }
        expect(result.valid).toBe(true);
        expect(result.errors).toBeUndefined();
      });
    });
  });
});
