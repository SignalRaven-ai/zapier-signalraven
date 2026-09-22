/* globals describe, it, expect */
'use strict';

const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

const authData = { clientId: process.env.SR_CLIENT_ID, clientSecret: process.env.SR_CLIENT_SECRET };
const haveCreds = Boolean(authData.clientId && authData.clientSecret);
const maybe = haveCreds ? describe : describe.skip;

maybe('SignalRaven (live, needs SR_CLIENT_ID / SR_CLIENT_SECRET)', () => {
  let sessionKey;

  it('exchanges the client id and secret for a token', async () => {
    const result = await appTester(App.authentication.sessionConfig.perform, { authData });
    expect(typeof result.sessionKey).toBe('string');
    sessionKey = result.sessionKey;
  });

  it('passes the auth test with the token', async () => {
    const response = await appTester(App.authentication.test, { authData: { ...authData, sessionKey } });
    expect(response.status).toBe(200);
    expect(response.data.ok).toBe(true);
  });

  it('rejects a bad secret', async () => {
    await expect(
      appTester(App.authentication.sessionConfig.perform, { authData: { ...authData, clientSecret: 'nope' } }),
    ).rejects.toThrow(/Token exchange failed/);
  });

  it('polls signals', async () => {
    const results = await appTester(App.triggers.new_signal_polling.operation.perform, {
      authData: { ...authData, sessionKey },
      inputData: { minStrength: 7 },
    });
    expect(Array.isArray(results)).toBe(true);
    expect(results[0]).toHaveProperty('id');
    expect(results[0]).toHaveProperty('strength');
  });

  it('lists hook samples reshaped to the delivery payload', async () => {
    const results = await appTester(App.triggers.new_signal.operation.performList, { authData: { ...authData, sessionKey } });
    expect(results[0]).toHaveProperty('signalId');
    expect(results[0]).toHaveProperty('personCompany');
  });

  it('finds a signal by id and returns [] for an unknown id', async () => {
    const list = await appTester(App.searches.find_signals.operation.perform, { authData: { ...authData, sessionKey }, inputData: { limit: 1 } });
    const found = await appTester(App.searches.find_signal.operation.perform, {
      authData: { ...authData, sessionKey },
      inputData: { signalId: list[0].id },
    });
    expect(found[0].id).toBe(list[0].id);
    const missing = await appTester(App.searches.find_signal.operation.perform, {
      authData: { ...authData, sessionKey },
      inputData: { signalId: '00000000-0000-4000-8000-000000000000' },
    });
    expect(missing).toEqual([]);
  });

  it('reads ICP, sources and usage', async () => {
    const b = { authData: { ...authData, sessionKey }, inputData: {} };
    const [icp] = await appTester(App.searches.get_workspace_detail.operation.perform, { ...b, inputData: { detail: 'icp' } });
    expect(icp).toHaveProperty('targetTitles');
    const sources = await appTester(App.searches.list_sources.operation.perform, { ...b, inputData: { period: '7' } });
    expect(Array.isArray(sources)).toBe(true);
    const [usage] = await appTester(App.searches.get_workspace_detail.operation.perform, { ...b, inputData: { detail: 'usage' } });
    expect(usage).toHaveProperty('systemStatus');
  });

  it('lists intelligence reports', async () => {
    const results = await appTester(App.searches.find_intelligence_reports.operation.perform, { authData: { ...authData, sessionKey }, inputData: {} });
    expect(Array.isArray(results)).toBe(true);
  });
});

describe('definition', () => {
  it('has the expected triggers, searches and creates', () => {
    expect(Object.keys(App.triggers).sort()).toEqual(['new_intelligence_report', 'new_signal', 'new_signal_polling']);
    expect(Object.keys(App.searches).length).toBe(6);
    expect(Object.keys(App.creates).sort()).toEqual(['run_account_intelligence', 'run_person_intelligence']);
  });
});
