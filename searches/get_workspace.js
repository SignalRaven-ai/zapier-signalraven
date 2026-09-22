'use strict';

const { BASE_URL } = require('../lib/constants');

const performIcp = async (z) => {
  const response = await z.request({ url: `${BASE_URL}/icp` });
  return [response.data.data || response.data];
};

const performSources = async (z, bundle) => {
  const response = await z.request({ url: `${BASE_URL}/sources`, params: { period: bundle.inputData.period || '30' } });
  return response.data.data || [];
};

const performUsage = async (z) => {
  const response = await z.request({ url: `${BASE_URL}/usage` });
  return [response.data.data || response.data];
};

const performDetail = (z, bundle) => (bundle.inputData.detail === 'usage' ? performUsage(z, bundle) : performIcp(z, bundle));

module.exports = {
  getWorkspaceDetail: {
    key: 'get_workspace_detail',
    noun: 'Workspace Detail',
    display: { label: 'Get ICP or Usage', description: 'Fetches the workspace ideal customer profile, or its activity counts and system status.' },
    operation: {
      perform: performDetail,
      inputFields: [{ key: 'detail', label: 'Detail', required: true, choices: { icp: 'ICP', usage: 'Usage' }, default: 'icp' }],
      sample: {
        id: 'icp',
        minEmployees: 200,
        maxEmployees: 10000,
        targetIndustries: ['Professional Services', 'Software Development', 'Financial Services'],
        targetTitles: ['Head of Corporate Events', 'Director of Events', 'Event Marketing Manager', 'VP Marketing'],
        targetPersonas: ['Event owners', 'Marketing leaders'],
        targetSeniority: ['Manager', 'Director', 'Head', 'VP'],
      },
    },
  },
  listSources: {
    key: 'list_sources',
    noun: 'Source',
    display: { label: 'Find Sources', description: 'Lists the LinkedIn sources being monitored, with signal counts and a strength score for each.' },
    operation: {
      perform: performSources,
      inputFields: [{ key: 'period', label: 'Period', required: false, choices: { 7: '7 days', 30: '30 days', all: 'All time' }, default: '30' }],
      sample: {
        id: 'src-1',
        type: 'keyword_search',
        displayName: 'corporate event planning',
        isActive: true,
        strengthScore: 82,
        signalCount: 14,
        totalPosts: 75,
        qualifiedPosts: 9,
        createdAt: '2026-08-01T00:00:00.000Z',
      },
    },
  },
};
