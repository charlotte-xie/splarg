import Game from '../classes/Game';
import { Gender } from '../classes/Names';
import NPC from '../classes/NPC';
import { Race } from '../classes/Races';

describe('NPC in Game', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game().initialise();
    game.startGame();
  });

  test('should place NPC in grasslands area', () => {
    const grasslandsArea = game.world.getArea('grasslands');
    expect(grasslandsArea).toBeDefined();
    
    // Check if there's an NPC in the grasslands
    let npcFound = false;
    for (let x = 0; x < grasslandsArea!.type.width; x++) {
      for (let y = 0; y < grasslandsArea!.type.height; y++) {
        const tile = grasslandsArea!.getTile(x, y);
        if (tile && tile.entities.length > 0) {
          const entityId = tile.entities[0];
          const entity = game.getEntity(entityId);
          if (entity && entity.klass === 'NPC') {
            npcFound = true;
            expect(entity).toBeInstanceOf(NPC);
            expect((entity as NPC).getName()).toBeDefined();
            expect((entity as NPC).stats.race).toBe(Race.HUMAN);
            break;
          }
        }
      }
      if (npcFound) break;
    }
    expect(npcFound).toBe(true);
  });

  test('should place NPC at least 3 tiles away from player', () => {
    const grasslandsArea = game.world.getArea('grasslands');
    const playerPos = game.player.position;
    
    let npcPosition: { x: number; y: number } | null = null;
    
    // Find NPC position
    for (let x = 0; x < grasslandsArea!.type.width; x++) {
      for (let y = 0; y < grasslandsArea!.type.height; y++) {
        const tile = grasslandsArea!.getTile(x, y);
        if (tile && tile.entities.length > 0) {
          const entityId = tile.entities[0];
          const entity = game.getEntity(entityId);
          if (entity && entity.klass === 'NPC') {
            npcPosition = { x, y };
            break;
          }
        }
      }
      if (npcPosition) break;
    }
    
    expect(npcPosition).not.toBeNull();
    
    // Calculate distance
    const distance = Math.max(
      Math.abs(npcPosition!.x - playerPos.x),
      Math.abs(npcPosition!.y - playerPos.y)
    );
    
    expect(distance).toBeGreaterThanOrEqual(3);
  });

  test('should show correct "Blocked by" message for NPC with proper name', () => {
    // Create a test NPC with a known name and place it directly next to the player
    const npcName = 'Harold Barton';
    const npc = new NPC({ name: npcName, race: Race.HUMAN, gender: Gender.MALE });
    
    // Place player at a known grass position (avoiding water area)
    game.addEntity(game.player, { areaId: 'grasslands', x: 1, y: 1 });
    
    // Place NPC right next to player
    game.addEntity(npc, { areaId: 'grasslands', x: 2, y: 1 });
    
    // Try to move player to NPC position
    const moved = game.doPlayerMove(1, 0);
    
    // Should be blocked
    expect(moved).toBe(false);
    
    // Check that the message shows the NPC name without "the" prefix
    const messages = game.getMessages();
    const lastMessage = messages[messages.length - 1];
    expect(lastMessage).toBeDefined();
    expect(lastMessage.text).toBe('Blocked by Harold Barton');
  });
}); 