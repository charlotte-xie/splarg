import { BASIC_COLOURS, COLOUR_VALUES } from '../classes/Colours';

describe('COLOUR_VALUES', () => {
  test('BASIC_COLOURS should all be contained within COLOUR_VALUES', () => {
    for (const colour of BASIC_COLOURS) {
      expect(COLOUR_VALUES).toHaveProperty(colour);
    }
  });
}); 