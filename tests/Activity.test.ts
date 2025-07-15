import { Activity, ActivityState, ContentType } from '../classes/Activity';
import { ActivityType } from '../classes/ActivityType';

describe('Activity', () => {
  beforeAll(() => {
    // Ensure the ActivityType is registered (should be in ActivityType.ts already, but safe to re-register)
    ActivityType.registerType('pickup-items', {
      title: 'Pick Up Items',
      priority: 1,
      onCreate: (activity) => {
        activity.content.push({ type: ContentType.stat, value: 'Initialised', colour: 'green' });
      },
    });
  });

  it('should create an Activity of type "pickup-items" with correct defaults and onCreate', () => {
    const activity = new Activity('pickup-items');
    expect(activity.activityType).toBe('pickup-items');
    expect(activity.title).toBe('Pick Up Items');
    expect(activity.state).toBe(ActivityState.ACTIVE);
    expect(Array.isArray(activity.content)).toBe(true);
    expect(activity.content.length).toBeGreaterThan(0);
    expect(activity.content[0]).toMatchObject({ type: ContentType.stat, value: 'Initialised', colour: 'green' });
  });
}); 