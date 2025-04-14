import { calculateWeeklyProgress } from '../../utils/progress';

describe('calculateWeeklyProgress()', () => {
  const today = new Date(Date.UTC(2025, 3, 12)); // April 12, 2025 (Saturday)
  const docId = 'med1';
  const index = 0;
  const pillId = `${docId}_${index}`;

  const date = new Date(today);
  date.setDate(today.getDate() - today.getDay() + 3); // Get Wednesday of the week
  const dateKey = date.toLocaleDateString('en-CA');
  const completionKey = `${dateKey}_${pillId}`;

  it('returns correct progress for completed pills', () => {
    const completions = {
      [completionKey]: true,
    };
    const times = [{ seconds: 0 }];
    const daysOfWeek = ['Wed'];

    const result = calculateWeeklyProgress({
      completions,
      times,
      daysOfWeek,
      docId,
      today,
    });

    expect(result['Wed']).toEqual({ toTake: 1, taken: 1 });
  });

  // Test for a pill that is not taken on the scheduled day
  it('returns correct progress for a missed pill', () => {
    const completions = {}; // No record = missed
    const times = [{ seconds: 0 }];
    const daysOfWeek = ['Wed'];
    const docId = 'med2';
    const today = new Date('2025-04-12'); // Saturday
  
    const result = calculateWeeklyProgress({ completions, times, daysOfWeek, docId, today });
  
    expect(result['Wed']).toEqual({ toTake: 1, taken: 0 });
  });

  // Test for a pill that is scheduled on multiple days of the week
  it('handles a pill scheduled on multiple days of the week', () => {
    const completions = {
      '2025-04-09_med3_0': true, // Wed
      '2025-04-10_med3_0': true, // Thu
    };
    const times = [{ seconds: 0 }];
    const daysOfWeek = ['Wed', 'Thu'];
    const docId = 'med3';
    const today = new Date('2025-04-12'); // Saturday
  
    const result = calculateWeeklyProgress({ completions, times, daysOfWeek, docId, today });
  
    expect(result['Wed']).toEqual({ toTake: 1, taken: 1 });
    expect(result['Thu']).toEqual({ toTake: 1, taken: 1 });
  });
  
  // Test for a pill that is scheduled on multiple days of the week with different times
  it('handles multiple reminder times in a single day', () => {
    const completions = {
      '2025-04-09_med4_0': true,
      '2025-04-09_med4_1': false,
    };
    const times = [{ seconds: 0 }, { seconds: 1 }]; // Two times
    const daysOfWeek = ['Wed'];
    const docId = 'med4';
    const today = new Date('2025-04-12');
  
    const result = calculateWeeklyProgress({ completions, times, daysOfWeek, docId, today });
  
    expect(result['Wed']).toEqual({ toTake: 2, taken: 1 });
  });
  
  // Test for a pill that is scheduled on multiple days of the week with different times and some taken
  it('marks days with no scheduled pills as 0 toTake and 0 taken', () => {
    const completions = {};
    const times = [{ seconds: 0 }];
    const daysOfWeek = ['Tue']; // not scheduled for Wed
    const docId = 'med5';
    const today = new Date('2025-04-12');
  
    const result = calculateWeeklyProgress({ completions, times, daysOfWeek, docId, today });
  
    expect(result['Wed']).toEqual({ toTake: 0, taken: 0 });
    expect(result['Tue']).toEqual({ toTake: 1, taken: 0 });
  });
  
});
