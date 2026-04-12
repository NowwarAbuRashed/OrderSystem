const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) { 
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
let changed = 0;
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;
  content = content.replace(/bg-blue-/g, 'bg-primary-');
  content = content.replace(/text-blue-/g, 'text-primary-');
  content = content.replace(/ring-blue-/g, 'ring-primary-');
  content = content.replace(/outline-blue-/g, 'outline-primary-');
  content = content.replace(/border-blue-/g, 'border-primary-');
  content = content.replace(/rounded-md/g, 'rounded-lg');
  content = content.replace(/border-slate-200(?!\/)/g, 'border-slate-200/60');
  
  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    changed++;
  }
});
console.log(`Updated ${changed} files.`);
