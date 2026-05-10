const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
};

const replacements = {
  'bg-slate-950': 'bg-slate-50 dark:bg-slate-950',
  'bg-slate-900': 'bg-white dark:bg-slate-900',
  'bg-slate-800': 'bg-slate-100 dark:bg-slate-800',
  'text-slate-100': 'text-slate-900 dark:text-slate-100',
  'text-slate-200': 'text-slate-800 dark:text-slate-200',
  'text-slate-300': 'text-slate-700 dark:text-slate-300',
  'text-slate-400': 'text-slate-500 dark:text-slate-400',
  'text-white': 'text-slate-900 dark:text-white',
  'border-slate-800': 'border-slate-200 dark:border-slate-800',
  'border-slate-700': 'border-slate-300 dark:border-slate-700',
  'border-white/10': 'border-slate-200 dark:border-white/10',
  'border-white/5': 'border-slate-100 dark:border-white/5',
  'bg-white/5': 'bg-slate-900/5 dark:bg-white/5',
  'bg-white/10': 'bg-slate-900/10 dark:bg-white/10'
};

const files = walk(path.join(__dirname, 'frontend/src'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  const keys = Object.keys(replacements).sort((a, b) => b.length - a.length);
  
  keys.forEach(key => {
    // Escape slash for regex
    const escapedKey = key.replace(/\//g, '\\/');
    // Regex: Match key only if NOT preceded by "dark:" and NOT preceded by a word character or hyphen
    // Also ensuring it's not already preceded by its light mode replacement (to avoid double additions)
    const regex = new RegExp(`(?<!dark:)(?<![\\w-])${escapedKey}`, 'g');
    
    // We will do a manual replace to avoid replacing things that already contain the replacement
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, (match) => {
        // Simple check: if the previous 20 chars contain the replacement light class, we might be double applying
        // Actually, since we only run this once, a straight replace is fine as long as we don't match `dark:bg-slate-950`
        return replacements[key];
      });
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
  }
});

console.log("Light mode classes applied to frontend components.");
