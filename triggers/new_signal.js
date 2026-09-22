'use strict';

const { BASE_URL, SAMPLE_DELIVERY } = require('../lib/constants');

// Instant trigger: registers Zapier's hook URL as a SignalRaven webhook
// destination, so each qualified signal is delivered the moment it lands.
const subscribeHook = async (z, bundle) => {
  const response = await z.request({
    url: `${BASE_URL}/destinations`,
    method: 'POST',
    body: {
      destinationType: 'webhook',
      name: 'Zapier',
      config: { url: bundle.targetUrl, method: 'POST' },
    },
  });
  return response.data.data;
};

const unsubscribeHook = async (z, bundle) => {
  const id = bundle.subscribeData && bundle.subscribeData.id;
  if (!id) return {};
  const response = await z.request({
    url: `${BASE_URL}/destinations/${encodeURIComponent(id)}`,
    method: 'DELETE',
    skipThrowForStatus: true,
  });
  return response.data || {};
};

const perform = (z, bundle) => {
  const body = bundle.cleanedRequest || {};
  return [{ id: body.signalId, ...body }];
};

// Samples for the editor: recent signals, reshaped to the delivery payload.
const performList = async (z) => {
  const response = await z.request({ url: `${BASE_URL}/signals`, params: { limit: 3 } });
  return (response.data.data || []).map((s) => ({
    id: s.id,
    signalId: s.id,
    signalDetailUrl: `https://app.signalraven.ai/signals/${s.id}`,
    signalType: s.type,
    strength: s.strength,
    personCompany: s.person && s.person.company,
    personLinkedinUrl: s.person && s.person.linkedinUrl,
    personLocation: s.person && s.person.location,
    whyItMatters: s.whyItMatters,
    suggestedOpener: s.suggestedOpener,
    talkingPoints: s.talkingPoints,
  }));
};

module.exports = {
  key: 'new_signal',
  noun: 'Signal',
  display: {
    label: 'New Signal',
    description: 'Triggers when SignalRaven qualifies a new buying-intent signal. Instant: SignalRaven pushes the signal to Zapier the moment it lands.',
  },
  operation: {
    type: 'hook',
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,
    perform,
    performList,
    sample: { id: SAMPLE_DELIVERY.signalId, ...SAMPLE_DELIVERY },
    outputFields: [
      { key: 'signalId', label: 'Signal ID' },
      { key: 'signalDetailUrl', label: 'Signal URL' },
      { key: 'strength', label: 'Strength (1 to 10)', type: 'integer' },
      { key: 'personName', label: 'Person Name' },
      { key: 'personTitle', label: 'Person Title' },
      { key: 'personCompany', label: 'Company' },
      { key: 'personLinkedinUrl', label: 'Person LinkedIn URL' },
      { key: 'whyItMatters', label: 'Why It Matters' },
      { key: 'suggestedOpener', label: 'Suggested Opener' },
    ],
  },
};
