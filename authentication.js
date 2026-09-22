'use strict';

const { BASE_URL, TOKEN_URL, READ_SCOPES, ALL_SCOPES } = require('./lib/constants');

// SignalRaven API keys are OAuth clients. Zapier's session auth fits: the
// client id and secret are exchanged for a short-lived bearer token, and
// Zapier re-runs the exchange whenever the API answers 401.
// The exchange uses fetch rather than z.request on purpose: with session
// auth, core turns every 401 into a RefreshAuthError before app middleware
// runs, and the auth server answers a wrong secret with 401. A plain fetch
// lets a bad key surface as a readable message instead.
const exchange = async (bundle, scopes) => {
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: bundle.authData.clientId,
    client_secret: bundle.authData.clientSecret,
    scope: scopes.join(' '),
  });
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: body.toString(),
  });
  let data = {};
  try {
    data = await res.json();
  } catch (e) {
    data = {};
  }
  return { status: res.status, data };
};

const getSessionKey = async (z, bundle) => {
  // A key may have been created with a subset of scopes. Ask for everything
  // first, then fall back to the read set.
  let response = await exchange(bundle, ALL_SCOPES);
  if (response.status === 400 && /invalid_scope/i.test(JSON.stringify(response.data))) {
    response = await exchange(bundle, READ_SCOPES);
  }
  if (response.status >= 400 || !response.data.access_token) {
    const detail = response.data.error_description || response.data.error || `HTTP ${response.status}`;
    throw new z.errors.Error(`Token exchange failed: ${detail}. Check the client id and secret.`, 'AuthenticationError', response.status);
  }
  return { sessionKey: response.data.access_token };
};

const test = (z) => z.request({ url: `${BASE_URL}/_authcheck` });

module.exports = {
  type: 'session',
  sessionConfig: { perform: getSessionKey },
  fields: [
    {
      key: 'clientId',
      label: 'Client ID',
      required: true,
      helpText: 'Create an API key in SignalRaven: Settings, then API keys, at [app.signalraven.ai](https://app.signalraven.ai).',
    },
    {
      key: 'clientSecret',
      label: 'Client Secret',
      required: true,
      type: 'password',
      helpText: 'Shown once when the key is created. See [SignalRaven developer docs](https://signalraven.ai/developers).',
    },
  ],
  test,
  connectionLabel: (z, bundle) => {
    const scopes = (bundle.inputData && bundle.inputData.oauth && bundle.inputData.oauth.scopes) || [];
    return scopes.length ? `SignalRaven (${scopes.length} scopes)` : 'SignalRaven';
  },
};
