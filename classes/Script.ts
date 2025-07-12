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
    throw new Error('runScript called with no args');
  }

  const firstArg = args[0];
  const restArgs = args.slice(1);

  if (typeof firstArg === 'string') {
    // First arg is a string - run script by name
    const script = getScript(firstArg);
    if (!script) {
      throw new Error(`Script not found: ${firstArg}`);
    }
    return script(game, ...restArgs);
  } else if (Array.isArray(firstArg)) {
    // First arg is an array - run it as a script and recursively call runScript with the result
    const result = runScript(game, firstArg);
    if (restArgs.length > 0) {
      // If there are more args, recursively call runScript with the result and remaining args
      return runScript(game, [result, ...restArgs]);
    }
    return result;
  } else if (typeof firstArg === 'function') {
    // First arg is a function - run it as a script
    return firstArg(game, ...restArgs);
  } else {
    throw new Error('First argument must be a string (script name), array (script), or function');
  }
} 