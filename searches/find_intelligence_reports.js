'use strict';

const { BASE_URL, SAMPLE_REPORT } = require('../lib/constants');

const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${BASE_URL}/intelligence`,
    params: {
      type: bundle.inputData.reportType || undefined,
      q: bundle.inputData.query || undefined,
      limit: bundle.inputData.limit || 25,
    },
  });
  return response.data.data || [];
};

module.exports = {
  key: 'find_intelligence_reports',
  noun: 'Intelligence Report',
  display: {
    label: 'Find Intelligence Reports',
    description: 'Lists person and account research reports, optionally filtered by type or matched by name.',
  },
  operation: {
    perform,
    inputFields: [
      { key: 'reportType', label: 'Report Type', required: false, choices: { account: 'Account', person: 'Person' } },
      { key: 'query', label: 'Search', required: false, helpText: 'Match by person or company name, for example Halvorsen Consulting.' },
      { key: 'limit', label: 'Limit', type: 'integer', required: false, default: '25' },
    ],
    sample: SAMPLE_REPORT,
  },
};
