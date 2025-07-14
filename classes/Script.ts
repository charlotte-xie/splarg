// Script.ts
//
// The idea is to express arbitrary script logic in serlialisable JSON
// These are effectively continuations, but can be serialized and deserialized

import type Entity from './Entity';
import type Game from './Game';

// Script is now a function type
export type Script = (g: Game, ...args: any[]) => any;

export type EntityScript = (g: Game, e: Entity, ...args: any[]) => any;

// Exported global scripts record, initialized with an example script
export const scripts: Record<string, Script> = {
  logExample: (g: Game, ...args: any[]) => {
    console.log('Example logging script called with args:', args);
    return 'example result';
  }
};

// Register a script globally
export function registerScript(name: string, script: Script) {
  scripts[name] = script;
}

// Retrieve a script by name
export function getScript(name: string): Script | undefined {
  return scripts[name];
}

// Run a script with game and args
export function runScript(game: Game, args: any[]): any {
  if (args.length === 0) {
    // This is an AI SUCCESS, just returns SUCCESS indefinitely
    return args;
  }

  const firstArg = args[0];

  if (typeof firstArg === 'string') {
    // First arg is a string - run script by name
    const script = getScript(firstArg);
    if (!script) {
      throw new Error(`Script not found: ${firstArg}`);
    }
    return script(game, ...args);
  } else {
    throw new Error('First argument must be a string (script name) but was '+typeof firstArg+' in '+ args+ ":"+typeof args);
  }
} 