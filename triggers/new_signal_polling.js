'use strict';

const { BASE_URL, SAMPLE_SIGNAL } = require('../lib/constants');

// Polling fallback for keys without the write:destinations scope.
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${BASE_URL}/signals`,
    params: {
      limit: 100,
      minStrength: bundle.inputData.minStrength || undefined,
      type: bundle.inputData.signalType || undefined,
    },
  });
  return response.data.data || [];
};

module.exports = {
  key: 'new_signal_polling',
  noun: 'Signal',
  display: {
    label: 'New Signal (Polling)',
    description: 'Triggers when SignalRaven qualifies a new buying-intent signal, checked on a schedule. Use New Signal for instant delivery.',
  },
  operation: {
    type: 'polling',
    perform,
    inputFields: [
      {
        key: 'minStrength',
        label: 'Minimum Strength',
        type: 'integer',
        required: false,
        helpText: 'Only signals with a strength score at or above this value, 0 to 10. Use 7 for warm, 9 for the strongest.',
      },
      {
        key: 'signalType',
        label: 'Signal Type',
        required: false,
        helpText: 'Filter by signal type, for example KEYWORD_SEARCH_COMMENT. Leave empty for all types.',
      },
    ],
    sample: SAMPLE_SIGNAL,
    outputFields: [
      { key: 'id', label: 'Signal ID' },
      { key: 'strength', label: 'Strength (1 to 10)', type: 'integer' },
      { key: 'person__company', label: 'Company' },
      { key: 'person__linkedinUrl', label: 'Person LinkedIn URL' },
      { key: 'whyItMatters', label: 'Why It Matters' },
      { key: 'suggestedOpener', label: 'Suggested Opener' },
    ],
  },
};
