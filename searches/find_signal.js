'use strict';

const { BASE_URL, SAMPLE_SIGNAL } = require('../lib/constants');

const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${BASE_URL}/signals/${encodeURIComponent(bundle.inputData.signalId)}`,
    skipThrowForStatus: true,
  });
  if (response.status === 404) return [];
  response.throwForStatus();
  const signal = response.data.data || response.data;
  if (!signal || signal.id !== bundle.inputData.signalId) return [];
  return [signal];
};

module.exports = {
  key: 'find_signal',
  noun: 'Signal',
  display: {
    label: 'Find Signal by ID',
    description: 'Fetches one signal with the full write-up: ICP analysis, why it matters, suggested opener and talking points.',
  },
  operation: {
    perform,
    inputFields: [{ key: 'signalId', label: 'Signal ID', required: true, helpText: 'From Find Signals or the New Signal trigger.' }],
    sample: SAMPLE_SIGNAL,
  },
};
