'use strict';

const { BASE_URL, SAMPLE_REPORT } = require('../lib/constants');

const perform = async (z, bundle) => {
  const kind = bundle.inputData.reportType === 'person' ? 'people' : 'accounts';
  const response = await z.request({
    url: `${BASE_URL}/intelligence/${kind}/${encodeURIComponent(bundle.inputData.reportId)}`,
    skipThrowForStatus: true,
  });
  if (response.status === 404) return [];
  response.throwForStatus();
  return [response.data.data || response.data];
};

module.exports = {
  key: 'get_intelligence_report',
  noun: 'Intelligence Report',
  display: {
    label: 'Get Intelligence Report',
    description: 'Fetches one account report (firmographics, buying committee, disposition, openers) or person report (profile, engagement, ICP read, talking points).',
  },
  operation: {
    perform,
    inputFields: [
      { key: 'reportType', label: 'Report Type', required: true, choices: { account: 'Account', person: 'Person' }, default: 'account' },
      { key: 'reportId', label: 'Report ID', required: true, helpText: 'From Find Intelligence Reports.' },
    ],
    sample: SAMPLE_REPORT,
  },
};
