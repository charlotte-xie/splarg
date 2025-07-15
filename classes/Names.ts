// Names.ts
// Generates fantasy names echoing a Victorian/steampunk setting

import { Race } from './Races';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  NEUTRAL = 'neutral'
}

// Human names by social class
const humanMaleFirstNames: Record<string, string[]> = {
  noble: [
    'Rodrik', 'Aldric', 'Edgar', 'Percival', 'Cedric', 'Benedict', 'Thaddeus', 'Augustus', 'Lucien', 'Victor',
    'Ignatius', 'Ambrose', 'Reginald', 'Algernon', 'Basil', 'Cornelius', 'Erasmus', 'Leopold', 'Montague', 'Phineas'
  ],
  citizen: [
    'Clyde', 'Harold', 'Wilfred', 'Rupert', 'Gilbert', 'Hugo', 'Oscar', 'Wallace', 'Edwin', 'Clarence',
    'Stanley', 'Milton', 'Vernon', 'Archibald', 'Horace', 'Morris', 'Rufus', 'Sylvester', 'Vernon', 'Winston'
  ],
  peasant: [
    'Tom', 'Jack', 'Bill', 'Sam', 'Ned', 'Will', 'Joe', 'Ben', 'Frank', 'Jim',
    'Pete', 'Hank', 'Ted', 'Bob', 'Fred', 'Charlie', 'Alf', 'Sid', 'Len', 'Ernie'
  ]
};

const humanFemaleFirstNames: Record<string, string[]> = {
  noble: [
    'Rachelle', 'Genevieve', 'Evangeline', 'Isadora', 'Vivienne', 'Seraphina', 'Cordelia', 'Arabella', 'Ophelia', 'Cecilia',
    'Beatrice', 'Eleanora', 'Gwendolyn', 'Lavinia', 'Rosalind', 'Wilhelmina', 'Anastasia', 'Celestine', 'Drusilla', 'Mirabel'
  ],
  citizen: [
    'Barton', 'Mabel', 'Edith', 'Agnes', 'Clara', 'Florence', 'Ida', 'Lillian', 'Maude', 'Nellie',
    'Vera', 'Winifred', 'Dorothy', 'Ethel', 'Irene', 'Myrtle', 'Olive', 'Pearl', 'Sylvia', 'Viola'
  ],
  peasant: [
    'Meg', 'Bess', 'Polly', 'Sally', 'Molly', 'Tess', 'Daisy', 'Nell', 'Kit', 'May',
    'Liz', 'Joan', 'Ruth', 'Fanny', 'Hattie', 'Lottie', 'Betty', 'Annie', 'Elsie', 'Gertie'
  ]
};

const humanNeutralFirstNames: Record<string, string[]> = {
  noble: [
    'Avery', 'Ellis', 'Morgan', 'Quincy', 'Sidney', 'Valentine', 'Darcy', 'Emery', 'Linden', 'Rowan'
  ],
  citizen: [
    'Robin', 'Leslie', 'Marion', 'Rene', 'Sage', 'Terry', 'Tracy', 'Vernon', 'Wynn', 'Jules'
  ],
  peasant: [
    'Alex', 'Charlie', 'Dale', 'Frankie', 'Jessie', 'Pat', 'Riley', 'Sam', 'Taylor', 'Willie'
  ]
};

const humanSurnames: Record<string, string[]> = {
  noble: [
    'Smythe', 'Ashcroft', 'Blackwood', 'Fairchild', 'Harrington', 'Kingsley', 'Montgomery', 'Pembroke', 'Ravensdale', 'Wyndham',
    'Beauregard', 'Chamberlain', 'Davenport', 'Everly', 'Fitzroy', 'Hawthorne', 'Langley', 'Merriweather', 'Sinclair', 'Thornfield'
  ],
  citizen: [
    'Barton', 'Clyde', 'Hobbs', 'Marlow', 'Parker', 'Preston', 'Radley', 'Sutton', 'Trent', 'Whitaker',
    'Baxter', 'Carver', 'Dawson', 'Ellery', 'Fletcher', 'Granger', 'Hollis', 'Jarvis', 'Kendall', 'Larkin'
  ],
  peasant: [
    'Brown', 'Smith', 'Taylor', 'Cooper', 'Carter', 'Baker', 'Wright', 'Walker', 'Turner', 'Clark',
    'Hill', 'Green', 'Ward', 'Wood', 'Moore', 'King', 'Lee', 'White', 'Hall', 'Allen'
  ]
};

// Elf names
const elfMaleFirstNames = [
  'Aerith', 'Caladriel', 'Eldrin', 'Faelar', 'Galadriel', 'Haldir', 'Legolas', 'Mithrandir', 'Nimrodel', 'Orophin',
  'Rivendell', 'Silvan', 'Thranduil', 'Vilya', 'Zephyr', 'Arwen', 'Celeborn', 'Elrond', 'Glorfindel', 'Lindir'
];

const elfFemaleFirstNames = [
  'Arwen', 'Celebrian', 'Eowyn', 'Galadriel', 'Idril', 'Luthien', 'Miriel', 'Nimloth', 'Rivendell', 'Silmaril',
  'Tauriel', 'Varda', 'Yavanna', 'Aredhel', 'Finduilas', 'Gilraen', 'Ioreth', 'Melian', 'Nerdanel', 'Ungoliant'
];

const elfNeutralFirstNames = [
  'Arien', 'Earendil', 'Feanor', 'Manwe', 'Nienna', 'Orome', 'Ulmo', 'Vaire'
];

const elfSurnames = [
  'Moonwhisper', 'Starlight', 'Silverleaf', 'Goldensong', 'Nightbreeze', 'Dawnweaver', 'Sunshadow', 'Moonbeam',
  'Stardancer', 'Lightfoot', 'Swiftwind', 'Brighteye', 'Fairhair', 'Greenleaf', 'Whitehand', 'Blackarrow',
  'Redleaf', 'Bluebell', 'Yellowflower', 'Purpleheart'
];

// Dwarf names
const dwarfMaleFirstNames = [
  'Durin', 'Thorin', 'Balin', 'Dwalin', 'Bifur', 'Bofur', 'Bombur', 'Dori', 'Nori', 'Ori',
  'Gloin', 'Oin', 'Fili', 'Kili', 'Gimli', 'Balin', 'Dain', 'Thrain', 'Thror', 'Fundin'
];

const dwarfFemaleFirstNames = [
  'Dis', 'Dwalin', 'Balin', 'Gimli', 'Thorin', 'Bifur', 'Bofur', 'Bombur', 'Dori', 'Nori',
  'Ori', 'Gloin', 'Oin', 'Fili', 'Kili', 'Balin', 'Dain', 'Thrain', 'Thror', 'Fundin'
];

const dwarfNeutralFirstNames = [
  'Durin', 'Thorin', 'Balin', 'Dwalin', 'Bifur', 'Bofur', 'Bombur', 'Dori', 'Nori', 'Ori'
];

const dwarfSurnames = [
  'Ironbeard', 'Stonefist', 'Goldaxe', 'Silverhammer', 'Bronzebreaker', 'Steeltoe', 'Copperhead', 'Brassknuckle',
  'Tinfoot', 'Leadbelly', 'Mercurymind', 'Platinumheart', 'Diamondeye', 'Rubyhand', 'Emeraldtoe', 'Sapphirebeard',
  'Amethystfist', 'Topazfoot', 'Garnethead', 'Pearlhand'
];

// Goblin names
const goblinMaleFirstNames = [
  'Grimtooth', 'Snaggle', 'Rusty', 'Sprocket', 'Cogwheel', 'Gearbox', 'Piston', 'Valve', 'Screw', 'Bolt',
  'Nut', 'Washer', 'Spring', 'Coil', 'Wire', 'Cable', 'Pipe', 'Tube', 'Hose', 'Connector'
];

const goblinFemaleFirstNames = [
  'Grimtooth', 'Snaggle', 'Rusty', 'Sprocket', 'Cogwheel', 'Gearbox', 'Piston', 'Valve', 'Screw', 'Bolt',
  'Nut', 'Washer', 'Spring', 'Coil', 'Wire', 'Cable', 'Pipe', 'Tube', 'Hose', 'Connector'
];

const goblinNeutralFirstNames = [
  'Grimtooth', 'Snaggle', 'Rusty', 'Sprocket', 'Cogwheel', 'Gearbox', 'Piston', 'Valve', 'Screw', 'Bolt'
];

const goblinSurnames = [
  'Geargrinder', 'Sprocketspinner', 'Cogcrusher', 'Pistonpusher', 'Valvevault', 'Screwturner', 'Bolttightener',
  'Nutcracker', 'Washerwasher', 'Springbouncer', 'Coilwinder', 'Wirepuller', 'Cablecutter', 'Pipefitter',
  'Tubebender', 'Hosehandler', 'Connectorclamp', 'Gearboxbreaker', 'Rustyratchet', 'Greasegrinder'
];

// Merman names
const mermanMaleFirstNames = [
  'Aquarius', 'Coral', 'Dolphin', 'Fin', 'Gill', 'Kelp', 'Marine', 'Ocean', 'Pearl', 'Reef',
  'Salty', 'Seaweed', 'Shark', 'Shell', 'Squid', 'Starfish', 'Tide', 'Wave', 'Whale', 'Zephyr'
];

const mermanFemaleFirstNames = [
  'Aqua', 'Coral', 'Dolphin', 'Fin', 'Gill', 'Kelp', 'Marine', 'Ocean', 'Pearl', 'Reef',
  'Salty', 'Seaweed', 'Shark', 'Shell', 'Squid', 'Starfish', 'Tide', 'Wave', 'Whale', 'Zephyr'
];

const mermanNeutralFirstNames = [
  'Aquarius', 'Coral', 'Dolphin', 'Fin', 'Gill', 'Kelp', 'Marine', 'Ocean', 'Pearl', 'Reef'
];

const mermanSurnames = [
  'Deepwater', 'Seabreeze', 'Oceanwave', 'Tidepool', 'Coralreef', 'Pearlbed', 'Shellbeach', 'Starfish',
  'Seahorse', 'Dolphin', 'Whale', 'Shark', 'Squid', 'Octopus', 'Jellyfish', 'Anemone',
  'Barnacle', 'Kelp', 'Seaweed', 'Marine'
];

// Race-specific name maps
const raceMaleFirstNames: Record<Race, string[] | Record<string, string[]>> = {
  [Race.HUMAN]: humanMaleFirstNames,
  [Race.ELF]: elfMaleFirstNames,
  [Race.DWARF]: dwarfMaleFirstNames,
  [Race.GOBLIN]: goblinMaleFirstNames,
  [Race.MERMAN]: mermanMaleFirstNames
};

const raceFemaleFirstNames: Record<Race, string[] | Record<string, string[]>> = {
  [Race.HUMAN]: humanFemaleFirstNames,
  [Race.ELF]: elfFemaleFirstNames,
  [Race.DWARF]: dwarfFemaleFirstNames,
  [Race.GOBLIN]: goblinFemaleFirstNames,
  [Race.MERMAN]: mermanFemaleFirstNames
};

const raceNeutralFirstNames: Record<Race, string[] | Record<string, string[]>> = {
  [Race.HUMAN]: humanNeutralFirstNames,
  [Race.ELF]: elfNeutralFirstNames,
  [Race.DWARF]: dwarfNeutralFirstNames,
  [Race.GOBLIN]: goblinNeutralFirstNames,
  [Race.MERMAN]: mermanNeutralFirstNames
};

const raceSurnames: Record<Race, string[] | Record<string, string[]>> = {
  [Race.HUMAN]: humanSurnames,
  [Race.ELF]: elfSurnames,
  [Race.DWARF]: dwarfSurnames,
  [Race.GOBLIN]: goblinSurnames,
  [Race.MERMAN]: mermanSurnames
};

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getFirstNamePool(race: Race, gender: Gender, status?: string): string[] {
  let nameMap: string[] | Record<string, string[]>;
  
  if (gender === Gender.MALE) nameMap = raceMaleFirstNames[race];
  else if (gender === Gender.FEMALE) nameMap = raceFemaleFirstNames[race];
  else nameMap = raceNeutralFirstNames[race];

  if (Array.isArray(nameMap)) {
    return nameMap;
  } else {
    // Humans need status, default to 'citizen' if not provided
    const humanStatus = status || 'citizen';
    return nameMap[humanStatus] || nameMap['citizen'];
  }
}

function getSurnamePool(race: Race, status?: string): string[] {
  const nameMap = raceSurnames[race];
  
  if (Array.isArray(nameMap)) {
    return nameMap;
  } else {
    // Humans need status, default to 'citizen' if not provided
    const humanStatus = status || 'citizen';
    return nameMap[humanStatus] || nameMap['citizen'];
  }
}

export function generateFirstName(race: Race, gender: Gender, status?: string): string {
  const pool = getFirstNamePool(race, gender, status);
  return randomFrom(pool);
}

export function generateSurname(race: Race, status?: string): string {
  const pool = getSurnamePool(race, status);
  return randomFrom(pool);
}

export function generateFullName(race: Race, gender: Gender, status?: string): string {
  const first = generateFirstName(race, gender, status);
  const last = generateSurname(race, status);
  return `${first} ${last}`;
} 