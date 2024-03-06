import { addUser, querySubmissions, addSubmission } from './db';
import type { Submission } from '../src/structures';
enum Location {
    LAX = "LAX",
    UCLA = "UCLA",
    BUR = "BUR"
}

describe('Database Operations', () => {

  test('addUser adds a user successfully', async () => {
    const email = "sorrow@ucla.edu";
    const message = await addUser(email);
    expect(message).toMatch(/has been added to the database/);
  });

  test('do not allow adding a user twice', async () => {
    const email = "sorrow@ucla.edu";
    const message = await addUser(email);
    expect(message).toMatch(/already exists/);
  });

  test('add a submission successfully', async () => {
    const submission : Submission = {
      userid: 1,
      interval_start: new Date('2024-02-10T09:00:00Z'),
      interval_end: new Date('2024-02-10T10:00:00Z'),
      source: Location.UCLA,
      destination: Location.LAX,
      contact: '@ChadJohnson'
    };
    const message = await addSubmission(submission);
    expect(message).toEqual(1);
  });

  test('querySubmissions retrieves submissions successfully', async () => {
    const submissions : any = querySubmissions();
    await submissions.then((result: any[]) => {
        expect(result).not.toHaveLength(0);
        result.forEach((submission : any) => {
            expect(submission).toHaveProperty('user_id');
            expect(submission).toHaveProperty('early_time');
            expect(submission).toHaveProperty('late_time');
            expect(submission).toHaveProperty('source');
            expect(submission).toHaveProperty('destination');
            expect(submission).toHaveProperty('contact');
        });
    });
  });

});

