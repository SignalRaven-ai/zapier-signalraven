'use strict';

const authentication = require('./authentication');
const { befores = [], afters = [] } = require('./middleware');
const newSignal = require('./triggers/new_signal');
const newSignalPolling = require('./triggers/new_signal_polling');
const newIntelligenceReport = require('./triggers/new_intelligence_report');
const findSignals = require('./searches/find_signals');
const findSignal = require('./searches/find_signal');
const findIntelligenceReports = require('./searches/find_intelligence_reports');
const getIntelligenceReport = require('./searches/get_intelligence_report');
const { getWorkspaceDetail, listSources } = require('./searches/get_workspace');
const { runAccountIntelligence, runPersonIntelligence } = require('./creates/run_intelligence');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication,
  beforeRequest: [...befores],
  afterResponse: [...afters],
  triggers: {
    [newSignal.key]: newSignal,
    [newSignalPolling.key]: newSignalPolling,
    [newIntelligenceReport.key]: newIntelligenceReport,
  },
  searches: {
    [findSignals.key]: findSignals,
    [findSignal.key]: findSignal,
    [findIntelligenceReports.key]: findIntelligenceReports,
    [getIntelligenceReport.key]: getIntelligenceReport,
    [getWorkspaceDetail.key]: getWorkspaceDetail,
    [listSources.key]: listSources,
  },
  creates: {
    [runAccountIntelligence.key]: runAccountIntelligence,
    [runPersonIntelligence.key]: runPersonIntelligence,
  },
  resources: {},
  flags: { cleanInputData: false },
};
