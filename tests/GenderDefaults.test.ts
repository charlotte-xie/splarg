import { Being } from '../classes/Being';
import { EntityClass } from '../classes/Entity';
import { Gender } from '../classes/Names';
import NPC from '../classes/NPC';
import Player from '../classes/Player';
import { Race } from '../classes/Races';

describe('Gender Defaults', () => {
  test('Being should default to neutral gender when not specified', () => {
    const being = new Being(EntityClass.NPC);
    expect(being.stats.gender).toBeUndefined();
    expect(being.getPronoun()).toBe('it');
  });

  test('NPC should default to neutral gender when not specified', () => {
    const npc = new NPC({ name: 'Test NPC' });
    expect(npc.stats.gender).toBeUndefined();
    expect(npc.getPronoun()).toBe('it');
  });

  test('Player should default to neutral gender when not specified', () => {
    const player = new Player();
    expect(player.stats.gender).toBeUndefined();
    expect(player.getPronoun()).toBe('it');
  });

  test('fromJSON should default to neutral gender when gender is missing', () => {
    // Test Being
    const being = new Being(EntityClass.NPC);
    being.stats.gender = Gender.MALE;
    const beingJson = being.toJSON();
    if (beingJson.stats) delete beingJson.stats.gender;
    const deserializedBeing = Being.fromJSON(beingJson);
    expect(deserializedBeing.stats.gender).toBeUndefined();

    // Test NPC
    const npc = new NPC({ name: 'Test NPC', race: Race.HUMAN, gender: Gender.FEMALE });
    const npcJson = npc.toJSON();
    if (npcJson.stats) delete npcJson.stats.gender;
    const deserializedNPC = NPC.fromJSON(npcJson);
    expect(deserializedNPC.stats.gender).toBeUndefined();

    // Test Player
    const player = new Player();
    player.stats.gender = Gender.MALE;
    const playerJson = player.toJSON();
    if (playerJson.stats) delete playerJson.stats.gender;
    const deserializedPlayer = Player.fromJSON(playerJson);
    expect(deserializedPlayer.stats.gender).toBeUndefined();
  });

  test('should still accept explicit gender values', () => {
    const maleBeing = new Being(EntityClass.NPC);
    maleBeing.stats.gender = Gender.MALE;
    const femaleNPC = new NPC({ name: 'Test NPC', race: Race.HUMAN, gender: Gender.FEMALE });
    const neutralPlayer = new Player();
    neutralPlayer.stats.gender = Gender.NEUTRAL;

    expect(maleBeing.stats.gender).toBe(Gender.MALE);
    expect(maleBeing.getPronoun()).toBe('he');
    
    expect(femaleNPC.stats.gender).toBe(Gender.FEMALE);
    expect(femaleNPC.getPronoun()).toBe('she');
    
    expect(neutralPlayer.stats.gender).toBe(Gender.NEUTRAL);
    expect(neutralPlayer.getPronoun()).toBe('it');
  });
}); 