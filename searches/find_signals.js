'use strict';

const { BASE_URL, SAMPLE_SIGNAL } = require('../lib/constants');

const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${BASE_URL}/signals`,
    params: {
      limit: bundle.inputData.limit || 25,
      minStrength: bundle.inputData.minStrength || undefined,
      type: bundle.inputData.signalType || undefined,
    },
  });
  return response.data.data || [];
};

module.exports = {
  key: 'find_signals',
  noun: 'Signal',
  display: {
    label: 'Find Signals',
    description: 'Lists qualified buying-intent signals, newest first, with optional minimum strength and type filters.',
  },
  operation: {
    perform,
    inputFields: [
      { key: 'minStrength', label: 'Minimum Strength', type: 'integer', required: false, helpText: '0 to 10. Use 7 for warm, 9 for the strongest.' },
      { key: 'signalType', label: 'Signal Type', required: false, helpText: 'For example KEYWORD_SEARCH_COMMENT.' },
      { key: 'limit', label: 'Limit', type: 'integer', required: false, default: '25', helpText: 'Up to 100.' },
    ],
    sample: SAMPLE_SIGNAL,
  },
};
