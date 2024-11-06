import fs from 'fs';
import path from 'path';

const CLIENT_DIR = './client/src';
const OUTPUT_FILE = './server/src/clientTypes.ts';

// /^(export type|export interface|type|interface)/gm
// /(?:export\s+)?(interface|type)\s+(\w+)\s*=\s*{|(?:export\s+)?interface\s+(\w+)\s*{/g
function extractInterfaces(fileContent) {
  const interfaces = [];
  const regex = /(?:export\s+)?(interface|type)\s+(\w+)\s*=\s*{|(?:export\s+)?interface\s+(\w+)\s*{/g;
  let match;

  while ((match = regex.exec(fileContent)) !== null) {
    const startIndex = match.index;
    let braceCount = 1;
    let endIndex = startIndex + match[0].length;

    // Traverse the content from the match position to find the closing brace
    while (braceCount > 0 && endIndex < fileContent.length) {
      const char = fileContent[endIndex];
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      endIndex++;
    }

    if (braceCount === 0) {
      const interfaceContent = fileContent.substring(startIndex, endIndex);
      interfaces.push(interfaceContent);
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
