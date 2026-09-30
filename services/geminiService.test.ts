import { expect, it, vi } from 'vitest';
const { generate } = vi.hoisted(() => ({generate: vi.fn()}));
vi.mock('@google/genai', () => ({GoogleGenAI: class {models = {generateContent: generate};},Type:{OBJECT:'OBJECT',STRING:'STRING',ARRAY:'ARRAY',INTEGER:'INTEGER'}}));
import { parseImage, generateRecipes, validateRecipes } from './geminiService';
it('preserves supported image MIME and data', () => {
  for (const mime of ['png','jpeg','webp']) expect(parseImage(`data:image/${mime};base64,AAAA`)).toEqual({mimeType:`image/${mime}`,data:'AAAA'});
});
it('rejects unsupported and oversized images', () => {
  for (const value of ['data:image/gif;base64,AAAA','data:image/svg+xml;base64,AAAA','bad',`data:image/png;base64,${'A'.repeat(8*1024*1024)}`]) expect(() => parseImage(value)).toThrow();
});
it('rejects malformed model output', () => {
  for (const value of [null,{}, {analysis:'test',recipes:[]}, {analysis:'test',recipes:[{}]}]) expect(() => validateRecipes(value)).toThrow();
});
it('never calls a model without a personal key', async () => {
  await expect(generateRecipes('data:image/png;base64,AAAA','','ingredients','zh','')).rejects.toThrow();
  expect(generate).not.toHaveBeenCalled();
});
