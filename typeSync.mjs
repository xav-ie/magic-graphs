import fs from 'fs';
import path from 'path';

const CLIENT_DIR = './client/src';
const OUTPUT_FILE = './server/src/clientTypes.ts';

function extractInterfaces(fileContent) {
  const interfaces = [];
  const regex = /^((export type )|(export interface )|(type )|(interface ))/gm;

  const lines = fileContent.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const isLineMatched = regex.test(lines[i].trim());

    if (isLineMatched) {
      const interfaceDef = [lines[i]];

      if (!lines[i+1]?.trim()) {
        interfaces.push(interfaceDef.join('\n'));
        continue;
      }

      for (let j = i + 1; j < lines.length; j++) {
        interfaceDef.push(lines[j]);
        if (lines[j] === '}') {
          break;
        }
      }

      i = i + interfaceDef.length;
      interfaces.push(interfaceDef.join('\n'));
    }
  }

  // if (interfaces.length > 0) console.log(interfaces);
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
