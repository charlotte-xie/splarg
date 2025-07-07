import Entity from '../classes/Entity';

describe('Entity serialization', () => {
  test('should serialize and deserialize position correctly', () => {
    const entity = new Entity();
    entity.setPosition({ x: 5, y: 7 });
    entity.position.areaId = 'test-area';

    const json = entity.toJSON();

    const serialized = JSON.stringify(json);
    const parsed = JSON.parse(serialized);
    const deserialized = Entity.fromJSON(parsed);

    expect(deserialized.position).toEqual({ x: 5, y: 7, areaId: 'test-area' });
  });
}); 