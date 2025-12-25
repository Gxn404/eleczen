import fs from 'fs';
import path from 'path';
import { ComponentProcessor } from '../src/lib/processing/ComponentProcessor.js';
import { generateEZC } from '../src/lib/eleczen-dsl/generator.js';

const filePath = path.resolve('scripts/4N25.sub');
const content = fs.readFileSync(filePath, 'utf-8');

const processor = new ComponentProcessor();
const files = [{ name: '4N25.sub', content: content }];

try {
    const {components, ezl} = processor.processLibrary(files, 'TestLib');
    const ezc = generateEZC(components)
    fs.writeFileSync("result.esc", ezl, "utf8");
    console.log(ezl);
} catch (error) {
    console.error('Error processing:', error);
}
