import fs from 'fs';
import path from 'path';

const CLIENT_DIR = './client/src';
const OUTPUT_FILE = './server/src/clientTypes.ts';

function extractInterfaces(fileContent) {
  const interfaces = [];
  const regex = /^((export type )|(export interface )|(type ))/gm;

  const lines = fileContent.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const isLineMatched = regex.test(lines[i]);
    if (lines[i].includes('GraphEvents')) {
      console.log('Found interface:', lines[i]);
    }
    if (isLineMatched) {
      const interfaceDef = [];
      interfaceDef.push('// @ts-ignore');
      interfaceDef.push(lines[i]);

      i++;
      if (!lines[i]?.trim()) {
        interfaces.push(interfaceDef.join('\n'));
        continue;
      }

      while (lines[i] !== '}' && lines[i] !== undefined) {
        interfaceDef.push('// @ts-ignore');
        interfaceDef.push(lines[i]);
        i++;
      }

      if (lines[i] === '}') {
        interfaceDef.push('}');
      }

      interfaces.push(interfaceDef.join('\n'));
    }
  }

  return interfaces;
}

const allInterfaces = [];

function processDirectory(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (filePath.endsWith('.ts')) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const interfacesInFile = extractInterfaces(fileContent);
      allInterfaces.push(...interfacesInFile);
    }
  });
}

processDirectory(CLIENT_DIR);
const allContents = allInterfaces.map((content) => content.trim());
const outputContent = allContents.join('\n\n');

fs.writeFileSync(OUTPUT_FILE, outputContent, 'utf-8');

console.info('All synced up!');
