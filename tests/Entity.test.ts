import Entity from '../classes/Entity';

describe('Entity serialization', () => {
  test('should serialize and deserialize position correctly', () => {
    const entity = new Entity();
    entity.setPosition(5, 7);
    entity.position.areaId = 'test-area';

    const json = entity.toJSON();
    expect(json.position).toEqual({ x: 5, y: 7, areaId: 'test-area' });

    const serialized = JSON.stringify(json);
    const parsed = JSON.parse(serialized);
    const deserialized = Entity.fromJSON(parsed);

    expect(deserialized.position).toEqual({ x: 5, y: 7, areaId: 'test-area' });
  });
}); 