import { Being } from '../classes/Being';
import { EntityClass } from '../classes/Entity';
import NPC from '../classes/NPC';
import Player from '../classes/Player';
import { Race } from '../classes/Races';

describe('Gender Defaults', () => {
  test('Being should default to neutral gender when not specified', () => {
    const being = new Being(EntityClass.NPC);
    expect(being.gender).toBe('neutral');
    expect(being.getPronoun()).toBe('it');
  });

  test('NPC should default to neutral gender when not specified', () => {
    const npc = new NPC('Test NPC');
    expect(npc.gender).toBe('neutral');
    expect(npc.getPronoun()).toBe('it');
  });

  test('Player should default to neutral gender when not specified', () => {
    const player = new Player();
    expect(player.gender).toBe('neutral');
    expect(player.getPronoun()).toBe('it');
  });

  test('fromJSON should default to neutral gender when gender is missing', () => {
    // Test Being
    const being = new Being(EntityClass.NPC, 'male');
    const beingJson = being.toJSON();
    delete (beingJson as any).gender;
    const deserializedBeing = Being.fromJSON(beingJson);
    expect(deserializedBeing.gender).toBe('neutral');

    // Test NPC
    const npc = new NPC('Test NPC', Race.HUMAN, 'female');
    const npcJson = npc.toJSON();
    delete (npcJson as any).gender;
    const deserializedNPC = NPC.fromJSON(npcJson);
    expect(deserializedNPC.gender).toBe('neutral');

    // Test Player
    const player = new Player('male');
    const playerJson = player.toJSON();
    delete (playerJson as any).gender;
    const deserializedPlayer = Player.fromJSON(playerJson);
    expect(deserializedPlayer.gender).toBe('neutral');
  });

  test('should still accept explicit gender values', () => {
    const maleBeing = new Being(EntityClass.NPC, 'male');
    const femaleNPC = new NPC('Test NPC', Race.HUMAN, 'female');
    const neutralPlayer = new Player('neutral');

    expect(maleBeing.gender).toBe('male');
    expect(maleBeing.getPronoun()).toBe('he');
    
    expect(femaleNPC.gender).toBe('female');
    expect(femaleNPC.getPronoun()).toBe('she');
    
    expect(neutralPlayer.gender).toBe('neutral');
    expect(neutralPlayer.getPronoun()).toBe('it');
  });
}); 