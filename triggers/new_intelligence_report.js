'use strict';

const { BASE_URL, SAMPLE_REPORT } = require('../lib/constants');

const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${BASE_URL}/intelligence`,
    params: { limit: 100, type: bundle.inputData.reportType || undefined },
  });
  return response.data.data || [];
};

module.exports = {
  key: 'new_intelligence_report',
  noun: 'Intelligence Report',
  display: {
    label: 'New Intelligence Report',
    description: 'Triggers when a person or account research report is created.',
  },
  operation: {
    type: 'polling',
    perform,
    inputFields: [
      {
        key: 'reportType',
        label: 'Report Type',
        required: false,
        choices: { account: 'Account', person: 'Person' },
      },
    ],
    sample: SAMPLE_REPORT,
  },
};
