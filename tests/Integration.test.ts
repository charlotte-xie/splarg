import { Gender, generateFullName } from '../classes/Names';
import NPC from '../classes/NPC';
import { Race, getRaceTraits } from '../classes/Races';

describe('Integration: Names, Races, and NPCs', () => {
  test('should create NPCs with generated names for different races', () => {
    const races = [Race.HUMAN, Race.ELF, Race.DWARF, Race.GOBLIN, Race.MERMAN];
    const genders: Gender[] = ['male', 'female'];

    races.forEach(race => {
      genders.forEach(gender => {
        if (race === Race.HUMAN) {
          // Humans need status
          const statuses = ['noble', 'citizen', 'peasant'];
          statuses.forEach(status => {
            const generatedName = generateFullName(race, gender, status);
            const npc = new NPC(generatedName, race);
            
            expect(npc.name).toBe(generatedName);
            expect(npc.race).toBe(race);
            expect(npc.getName()).toBe(generatedName);
          });
        } else {
          // Other races don't need status
          const generatedName = generateFullName(race, gender);
          const npc = new NPC(generatedName, race);
          
          expect(npc.name).toBe(generatedName);
          expect(npc.race).toBe(race);
          expect(npc.getName()).toBe(generatedName);
        }
      });
    });
  });

  test('should apply race traits to NPCs', () => {
    const npc = new NPC('Test NPC', Race.DWARF);
    const traits = getRaceTraits(npc.race);
    
    expect(traits.name).toBe('Dwarf');
    expect(traits.baseStats.strength).toBe(14);
    expect(traits.abilities).toContain('Craftsmanship');
  });

  test('should generate appropriate names for different human social classes', () => {
    // Noble names should be more elaborate
    const nobleName = generateFullName(Race.HUMAN, 'male', 'noble');
    const citizenName = generateFullName(Race.HUMAN, 'male', 'citizen');
    const peasantName = generateFullName(Race.HUMAN, 'male', 'peasant');
    
    const nobleNPC = new NPC(nobleName, Race.HUMAN);
    const citizenNPC = new NPC(citizenName, Race.HUMAN);
    const peasantNPC = new NPC(peasantName, Race.HUMAN);
    
    expect(nobleNPC.name).toBe(nobleName);
    expect(citizenNPC.name).toBe(citizenName);
    expect(peasantNPC.name).toBe(peasantName);
  });

  test('should generate distinct name styles for each race', () => {
    const elfName = generateFullName(Race.ELF, 'male');
    const dwarfName = generateFullName(Race.DWARF, 'male');
    const goblinName = generateFullName(Race.GOBLIN, 'male');
    const mermanName = generateFullName(Race.MERMAN, 'male');
    const humanName = generateFullName(Race.HUMAN, 'male', 'citizen');
    
    // Each race should have distinct naming conventions
    // Check that names contain expected patterns from their respective name pools
    expect(elfName).toMatch(/Moonwhisper|Starlight|Silverleaf|Goldensong|Nightbreeze|Dawnweaver|Sunshadow|Moonbeam|Stardancer|Lightfoot|Swiftwind|Brighteye|Fairhair|Greenleaf|Whitehand|Blackarrow|Redleaf|Bluebell|Yellowflower|Purpleheart/);
    expect(dwarfName).toMatch(/Ironbeard|Stonefist|Goldaxe|Silverhammer|Bronzebreaker|Steeltoe|Copperhead|Brassknuckle|Tinfoot|Leadbelly|Mercurymind|Platinumheart|Diamondeye|Rubyhand|Emeraldtoe|Sapphirebeard|Amethystfist|Topazfoot|Garnethead|Pearlhand/);
    expect(goblinName).toMatch(/Geargrinder|Sprocketspinner|Cogcrusher|Pistonpusher|Valvevault|Screwturner|Bolttightener|Nutcracker|Washerwasher|Springbouncer|Coilwinder|Wirepuller|Cablecutter|Pipefitter|Tubebender|Hosehandler|Connectorclamp|Gearboxbreaker|Rustyratchet|Greasegrinder/);
    expect(mermanName).toMatch(/Deepwater|Seabreeze|Oceanwave|Tidepool|Coralreef|Pearlbed|Shellbeach|Starfish|Seahorse|Dolphin|Whale|Shark|Squid|Octopus|Jellyfish|Anemone|Barnacle|Kelp|Seaweed|Marine/);
    expect(humanName).toMatch(/Barton|Clyde|Hobbs|Marlow|Parker|Preston|Radley|Sutton|Trent|Whitaker|Baxter|Carver|Dawson|Ellery|Fletcher|Granger|Hollis|Jarvis|Kendall|Larkin/);
  });

  test('should handle default status for humans', () => {
    const name1 = generateFullName(Race.HUMAN, 'male', 'citizen');
    const name2 = generateFullName(Race.HUMAN, 'male'); // Should default to citizen
    
    expect(name1).toBeDefined();
    expect(name2).toBeDefined();
    
    const npc1 = new NPC(name1, Race.HUMAN);
    const npc2 = new NPC(name2, Race.HUMAN);
    
    expect(npc1.name).toBe(name1);
    expect(npc2.name).toBe(name2);
  });
}); 