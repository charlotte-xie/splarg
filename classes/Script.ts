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
  example: (g: Game, ...args: any[]) => {
    console.log('Example script called with game:', g, 'and args:', args);
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

  if (typeof firstArg === 'number') {
    // First arg is a number - get entity by ID
    const entity = game.getEntity(firstArg);
    if (!entity) {
      console.warn(`Entity with ID ${firstArg} not found`);
      return;
    }
    return entity;
  } else if (typeof firstArg === 'string') {
    // First arg is a string - run script by name
    const script = getScript(firstArg);
    if (!script) {
      console.warn(`Script '${firstArg}' not found`);
      return;
    }
    return script(game, ...restArgs);
  } else {
    throw new Error('First argument must be a number (entity ID) or string (script name)');
  }
}

// Run a script for a specific entity, automatically passing the entity ID
export function runEntityScript(game: Game, entity: Entity, scriptArgs: any[]): any {
  if (scriptArgs.length === 0) {
    throw new Error('runEntityScript called with no script args');
  }

  const firstArg = scriptArgs[0];
  const restArgs = scriptArgs.slice(1);

  if (typeof firstArg === 'string') {
    // First arg is a script name - run it with entity ID prepended
    const script = getScript(firstArg);
    if (!script) {
      console.warn(`Script '${firstArg}' not found`);
      return;
    }
    return script(game, entity.id, ...restArgs);
  } else {
    throw new Error('First argument must be a string (script name)');
  }
} 