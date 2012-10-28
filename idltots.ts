/// <reference path="node.d.ts" />

import fs = module('fs');

interface StringMap { [alias: string]: string; }

var aliases: StringMap = {
  DOMString: 'string',
  boolean: 'bool',
  dictionary: 'interface',
  object: 'Object',
  'const ?': ''
};

var idl = fs.readFileSync(process.argv[2], 'utf8');
var ts = idl
  // normalize line-endings
  .replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  // replace number types with 'number'
  .replace(/(\b(unsigned|long|byte|short|octet|int|float)\b\s*)+(?=\b)/g, 'number ')
  // collect aliases
  .replace(/typedef\s+(\w+)\s+(\w+);/g, (str, original, alias) => {
    aliases[alias] = original;
    return '';
  })

function find_final_alias(aliases: StringMap, alias: string): string {
  var name = aliases[alias];

  while (typeof name === 'string') {
    alias = name;
    name = aliases[alias];
  }

  return alias;
}

// replace aliases
for (var alias in aliases) {
  if (aliases.hasOwnProperty(alias)) {
    ts = ts.replace(new RegExp('\\b' + alias + '\\b', 'g'), find_final_alias(aliases, alias));
  }
}

ts = ts
  // interface A : B => interface A extends B
  .replace(/interface\s+(\w+)\s*:\s*(\w+)/g, 'interface $1 extends $2')
  // readonly attribute Type Name; => Name: Type;
  .replace(/(readonly)?\s+attribute\s+(\w+)\s+(\w+);/g, '$3: $2;')
  // sequence<A> => A[]
  .replace(/sequence<\s*(\w+)\s*>/g, '$1[]')
  // Type Name = Value; => Name: Type;
  .replace(/(\w+)\s+(\w+)(\s*\=\s*[^;]+)?;/g, '$2: $1;')
  // (translating arguments) Type Name => Name: Type
  .replace(/([\w[\]]+)\??\s+(\w+)(?=,|\))/g, '$2: $1')
  // (translating function signature) ReturnType Name (ArgList) => Name (ArgList): ReturnType
  .replace(/([\w[\]]+)\??\s+(\w+)\s*(\([^)]*\))/g, '$2$3: $1')
  // cutting out all annotatnions
  .replace(/\[[^\]]+\] ?/g, '')

// Two alternative forms of empty interfaces to differentiate them from other empty interfaces:
// 1. adding a unique field 
// 2. translating to declare class

//ts = ts.replace(/interface([^{]+)\{(\s*)\}/g, (str, signature) => 
//    'interface' + signature + '{\n    __' + (signature.replace(/\s+/g, '_')) + ': any;\n}')

ts = ts.replace(/interface([^{]+)\{(\s*)\}/g, 'declare class$1{$2}');

// Optional cleanup
ts = ts
  // one-line comments
  .replace(/\/\/.*/g, '')
  // 
  .replace(/\/\*((?!\*\/)(\n|.))*\*\//g, '')
  .replace(/,\s+/g, ', ')
  .replace(/[ \t]+\n/g, '\n')
  .replace(/\n{3,}/g, '\n\n')
  .replace(/^\n+/, '')

fs.writeFileSync(process.argv[3], ts, 'utf8');