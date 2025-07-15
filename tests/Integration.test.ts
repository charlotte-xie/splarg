import { Gender, generateFullName } from '../classes/Names';
import NPC from '../classes/NPC';
import { Race, getRaceTraits } from '../classes/Races';

describe('Integration: Names, Races, and NPCs', () => {
  test('should create NPCs with generated names for different races and genders', () => {
    const races = [Race.HUMAN, Race.ELF, Race.DWARF, Race.GOBLIN, Race.MERMAN];
    const genders: Gender[] = [Gender.MALE, Gender.FEMALE];

    races.forEach(race => {
      genders.forEach(gender => {
        if (race === Race.HUMAN) {
          // Humans need status
          const statuses = ['noble', 'citizen', 'peasant'];
          statuses.forEach(status => {
            const generatedName = generateFullName(race, gender, status);
            const npc = new NPC({ name: generatedName, race: race, gender: gender });
            
            expect(npc.getName()).toBe(generatedName);
            expect(npc.stats.race).toBe(race);
            expect(npc.gender).toBe(gender);
            expect(npc.getName()).toBe(generatedName);
            expect(npc.getPronoun()).toBe(gender === 'male' ? 'he' : 'she');
          });
        } else {
          // Other races don't need status
          const generatedName = generateFullName(race, gender);
          const npc = new NPC({ name: generatedName, race: race, gender: gender });
          
          expect(npc.getName()).toBe(generatedName);
          expect(npc.stats.race).toBe(race);
          expect(npc.gender).toBe(gender);
          expect(npc.getName()).toBe(generatedName);
          expect(npc.getPronoun()).toBe(gender === 'male' ? 'he' : 'she');
        }
      });
    });
  });

  test('should apply race traits to NPCs', () => {
    const npc = new NPC({ name: 'Test NPC', race: Race.DWARF, gender: Gender.MALE });
    const traits = getRaceTraits(npc.stats.race!);
    
    expect(traits.name).toBe('Dwarf');
    expect(traits.baseStats.strength).toBe(14);
    expect(traits.abilities).toContain('Craftsmanship');
    expect(npc.gender).toBe('male');
    expect(npc.getPronoun()).toBe('he');
  });

  test('should generate appropriate names for different human social classes', () => {
    // Noble names should be more elaborate
    const nobleName = generateFullName(Race.HUMAN, Gender.MALE, 'noble');
    const citizenName = generateFullName(Race.HUMAN, Gender.MALE, 'citizen');
    const peasantName = generateFullName(Race.HUMAN, Gender.MALE, 'peasant');
    
    const nobleNPC = new NPC({ name: nobleName, race: Race.HUMAN, gender: Gender.MALE });
    const citizenNPC = new NPC({ name: citizenName, race: Race.HUMAN, gender: Gender.MALE });
    const peasantNPC = new NPC({ name: peasantName, race: Race.HUMAN, gender: Gender.MALE });
    
    expect(nobleNPC.getName()).toBe(nobleName);
    expect(citizenNPC.getName()).toBe(citizenName);
    expect(peasantNPC.getName()).toBe(peasantName);
    expect(nobleNPC.getPronoun()).toBe('he');
  });

  test('should generate distinct name styles for each race', () => {
    const elfName = generateFullName(Race.ELF, Gender.MALE);
    const dwarfName = generateFullName(Race.DWARF, Gender.MALE);
    const goblinName = generateFullName(Race.GOBLIN, Gender.MALE);
    const mermanName = generateFullName(Race.MERMAN, Gender.MALE);
    const humanName = generateFullName(Race.HUMAN, Gender.MALE, 'citizen');
    
    // Each race should have distinct naming conventions
    // Check that names contain expected patterns from their respective name pools
    expect(elfName).toMatch(/Moonwhisper|Starlight|Silverleaf|Goldensong|Nightbreeze|Dawnweaver|Sunshadow|Moonbeam|Stardancer|Lightfoot|Swiftwind|Brighteye|Fairhair|Greenleaf|Whitehand|Blackarrow|Redleaf|Bluebell|Yellowflower|Purpleheart/);
    expect(dwarfName).toMatch(/Ironbeard|Stonefist|Goldaxe|Silverhammer|Bronzebreaker|Steeltoe|Copperhead|Brassknuckle|Tinfoot|Leadbelly|Mercurymind|Platinumheart|Diamondeye|Rubyhand|Emeraldtoe|Sapphirebeard|Amethystfist|Topazfoot|Garnethead|Pearlhand/);
    expect(goblinName).toMatch(/Geargrinder|Sprocketspinner|Cogcrusher|Pistonpusher|Valvevault|Screwturner|Bolttightener|Nutcracker|Washerwasher|Springbouncer|Coilwinder|Wirepuller|Cablecutter|Pipefitter|Tubebender|Hosehandler|Connectorclamp|Gearboxbreaker|Rustyratchet|Greasegrinder/);
    expect(mermanName).toMatch(/Deepwater|Seabreeze|Oceanwave|Tidepool|Coralreef|Pearlbed|Shellbeach|Starfish|Seahorse|Dolphin|Whale|Shark|Squid|Octopus|Jellyfish|Anemone|Barnacle|Kelp|Seaweed|Marine/);
    expect(humanName).toMatch(/Barton|Clyde|Hobbs|Marlow|Parker|Preston|Radley|Sutton|Trent|Whitaker|Baxter|Carver|Dawson|Ellery|Fletcher|Granger|Hollis|Jarvis|Kendall|Larkin/);
  });

  test('should handle default status for humans', () => {
    const name1 = generateFullName(Race.HUMAN, Gender.MALE, 'citizen');
    const name2 = generateFullName(Race.HUMAN, Gender.MALE); // Should default to citizen
    
    expect(name1).toBeDefined();
    expect(name2).toBeDefined();
    
    const npc1 = new NPC({ name: name1, race: Race.HUMAN, gender: Gender.MALE });
    const npc2 = new NPC({ name: name2, race: Race.HUMAN, gender: Gender.FEMALE });
    
    expect(npc1.getName()).toBe(name1);
    expect(npc2.getName()).toBe(name2);
    expect(npc1.getPronoun()).toBe('he');
    expect(npc2.getPronoun()).toBe('she');
  });

  test('should handle different genders correctly', () => {
    const maleNPC = new NPC({ name: 'Test Male', race: Race.HUMAN, gender: Gender.MALE });
    const femaleNPC = new NPC({ name: 'Test Female', race: Race.HUMAN, gender: Gender.FEMALE });
    const neutralNPC = new NPC({ name: 'Test Neutral', race: Race.HUMAN, gender: Gender.NEUTRAL });
    
    expect(maleNPC.getPronoun()).toEqual('he');
    expect(femaleNPC.getPronoun()).toEqual('she');
    expect(neutralNPC.getPronoun()).toEqual('it');
  });
}); 