import { addUser, querySubmissions } from './db';

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

  test('querySubmissions retrieves submissions successfully', async () => {
    const submissions : any = querySubmissions();
    await submissions.then((result: any[]) => {
        result.forEach((submission : any) => {
            expect(submission).toHaveProperty('userid');
            expect(submission).toHaveProperty('interval_start');
            expect(submission).toHaveProperty('interval_end');
            expect(submission).toHaveProperty('source');
            expect(submission).toHaveProperty('destination');
            expect(submission).toHaveProperty('contact');
        });
    });
  });

});

