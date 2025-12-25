import fs from 'fs';
import path from 'path';
import { ComponentProcessor } from '../src/lib/processing/converter.js';

const asyPath = path.resolve('scripts/NE555.asy');
const subPath = path.resolve('scripts/NE555.sub');
const kiSymPath = path.resolve('scripts/NE555.kicad_sym');

const asyContent = fs.readFileSync(asyPath, 'utf-8');
const subContent = fs.readFileSync(subPath, 'utf-8');
const kiContent = fs.readFileSync(kiSymPath, 'utf-8');

const processor = new ComponentProcessor();
const { ezc, ezl } = processor.processLibrary([
    { name: 'NE555.asy', content: asyContent },
    { name: 'NE555.sub', content: subContent },
    { name: 'NE555.kicad_sym', content: kiContent }
], 'NE555');

// Ensure directory exists
const outputDir = path.resolve('components/ne555');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, 'ne555.ezl'), ezl, "utf8");
fs.writeFileSync(path.join(outputDir, 'ne555.ezc'), ezc, "utf8");

console.log(`\nResults written to ${outputDir}`);