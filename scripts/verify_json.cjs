#!/usr/bin/env node
/**
 * Verify JSON file is valid
 * Usage: node scripts/verify_json.js
 */

const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'src', 'lessonPlansData.json');

try {
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log('✅ JSON is valid');
  console.log(`   Total lessons: ${data.lessonPlans.length}`);
  
  const stats = fs.statSync(jsonPath);
  console.log(`   File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
} catch (e) {
  console.log('❌ JSON is invalid:');
  console.log(`   ${e.message}`);
  if (e.message.includes('position')) {
    const match = e.message.match(/position (\d+)/);
    if (match) {
      const pos = parseInt(match[1]);
      const content = fs.readFileSync(jsonPath, 'utf8');
      const line = content.substring(0, pos).split('\n').length;
      console.log(`   Line: ${line}`);
    }
  }
  process.exit(1);
}
