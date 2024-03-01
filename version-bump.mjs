#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';

let targetVersion = process.argv[2];

let packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
packageJson.version = targetVersion;
writeFileSync('package.json', JSON.stringify(packageJson, null, '\t'));

let manifest = JSON.parse(readFileSync('manifest.json', 'utf8'));
manifest.version = targetVersion;
writeFileSync('manifest.json', JSON.stringify(manifest, null, '\t'));
