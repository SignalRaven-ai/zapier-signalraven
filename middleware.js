'use strict';

// Core already converts a 401 into a RefreshAuthError for session auth, which
// re-runs the token exchange and retries. This file only attaches the token.
const addBearer = (request, z, bundle) => {
  if (bundle.authData && bundle.authData.sessionKey && !request.headers.Authorization) {
    request.headers.Authorization = `Bearer ${bundle.authData.sessionKey}`;
  }
  request.headers.Accept = 'application/json';
  return request;
};

module.exports = {
  befores: [addBearer],
  afters: [],
};
