'use strict';

const { BASE_URL, SAMPLE_REPORT } = require('../lib/constants');

const runAccount = async (z, bundle) => {
  const response = await z.request({
    url: `${BASE_URL}/intelligence/accounts`,
    method: 'POST',
    body: { companyUrl: bundle.inputData.companyUrl },
  });
  return response.data.data || response.data;
};

const runPerson = async (z, bundle) => {
  const response = await z.request({
    url: `${BASE_URL}/intelligence/people`,
    method: 'POST',
    body: {
      personUrl: bundle.inputData.personUrl,
      sourceCompanyReportId: bundle.inputData.sourceCompanyReportId || undefined,
    },
  });
  return response.data.data || response.data;
};

module.exports = {
  runAccountIntelligence: {
    key: 'run_account_intelligence',
    noun: 'Account Report',
    display: {
      label: 'Run Account Intelligence',
      description: 'Starts an account research report for a company LinkedIn URL. Spends credits unless a recent report exists, in which case the cached report is returned.',
    },
    operation: {
      perform: runAccount,
      inputFields: [
        { key: 'companyUrl', label: 'Company LinkedIn URL', required: true, helpText: 'For example `https://www.linkedin.com/company/example`.' },
      ],
      sample: { ...SAMPLE_REPORT, cached: false },
    },
  },
  runPersonIntelligence: {
    key: 'run_person_intelligence',
    noun: 'Person Report',
    display: {
      label: 'Run Person Intelligence',
      description: 'Starts a person research report for a LinkedIn profile URL. Spends credits unless a recent report exists, in which case the cached report is returned.',
    },
    operation: {
      perform: runPerson,
      inputFields: [
        { key: 'personUrl', label: 'Person LinkedIn URL', required: true, helpText: 'For example `https://www.linkedin.com/in/example`.' },
        { key: 'sourceCompanyReportId', label: 'Source Account Report ID', required: false, helpText: 'Optional account report to attach this person to.' },
      ],
      sample: { ...SAMPLE_REPORT, type: 'person', name: 'Marcus Feld', slug: 'marcus-feld', cached: false },
    },
  },
};
