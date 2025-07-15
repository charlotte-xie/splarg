import { EntityClass } from '../classes/Entity';
import Game from '../classes/Game';
import NPC from '../classes/NPC';
import { Race } from '../classes/Races';

describe('World', () => {
  test('should add an NPC to grasslands area on initialization', () => {
    const game = new Game().initialise();
    
    // Get the grasslands area
    const grasslandsArea = game.world.areas.get('grasslands');
    expect(grasslandsArea).toBeDefined();
    
    // Check that grasslands has entities (player + mob + NPC)
    expect(grasslandsArea!.entities.size).toBe(3);
    
    // Find the NPC in the entities
    let npcFound = false;
    for (const entityId of grasslandsArea!.entities) {
      const entity = game.getEntity(entityId);
      if (entity && entity.klass === EntityClass.NPC) {
        npcFound = true;
        const npc = entity as NPC;
        expect(npc.name).toBeDefined();
        expect(npc.race).toBe(Race.HUMAN);
        expect(npc.gender).toBe('male');
        expect(npc.getPronoun()).toBe('he');
        break;
      }
    }
    
    expect(npcFound).toBe(true);
  });

  test('should place NPC away from player in grasslands', () => {
    const game = new Game().initialise();
    
    const grasslandsArea = game.world.areas.get('grasslands');
    const player = game.player;
    
    // Find the NPC
    let npc: NPC | null = null;
    for (const entityId of grasslandsArea!.entities) {
      const entity = game.getEntity(entityId);
      if (entity && entity.klass === EntityClass.NPC) {
        npc = entity as NPC;
        break;
      }
    }
    
    expect(npc).toBeDefined();
    
    // Check distance between player and NPC (should be at least 3 tiles)
    const distance = Math.max(
      Math.abs(npc!.position.x - player.position.x),
      Math.abs(npc!.position.y - player.position.y)
    );
    
    expect(distance).toBeGreaterThanOrEqual(3);
  });

  test('should not add NPC in test mode', () => {
    const game = new Game().initialise('test');
    
    // Get the test area
    const testArea = game.world.areas.get('test');
    expect(testArea).toBeDefined();
    
    // Check that test area only has player (no NPC)
    expect(testArea!.entities.size).toBe(1);
    
    // Verify the only entity is the player
    const entityId = Array.from(testArea!.entities)[0];
    const entity = game.getEntity(entityId);
    expect(entity).toBe(game.player);
  });
}); 