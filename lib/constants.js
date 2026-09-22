'use strict';

const BASE_URL = 'https://api.signalraven.ai/api/v1';
const TOKEN_URL = 'https://auth.signalraven.ai/oauth2/token';

const READ_SCOPES = [
  'read:signals',
  'read:sources',
  'read:watchlist',
  'read:icp',
  'read:intelligence',
  'read:usage',
  'read:destinations',
];
const ALL_SCOPES = [...READ_SCOPES, 'write:intelligence', 'write:destinations'];

const SAMPLE_SIGNAL = {
  id: '3f9c2a1e-0000-4000-8000-000000000001',
  type: 'KEYWORD_SEARCH_COMMENT',
  strength: 9,
  person: {
    company: 'Halvorsen Consulting',
    linkedinUrl: 'https://www.linkedin.com/in/example',
    location: 'London, United Kingdom',
  },
  icp: { fit: true, compositeScore: 0.93, persona: 'Event owner' },
  whyItMatters:
    "Director of Corporate Events is actively talking about venue holds disappearing for next year's leadership summit.",
  suggestedOpener:
    "Saw your note on venue holds disappearing for next year's summit. How far out are you sourcing now?",
  talkingPoints: [
    'Venue holds are disappearing earlier this cycle.',
    'Summit planning is starting earlier than last year.',
  ],
  postPreview: 'Venue holds for next year are already gone in three cities we looked at.',
  createdAt: '2026-09-15T14:02:00.000Z',
};

const SAMPLE_DELIVERY = {
  signalId: '3f9c2a1e-0000-4000-8000-000000000001',
  signalDetailUrl: 'https://app.signalraven.ai/signals/3f9c2a1e-0000-4000-8000-000000000001',
  signalType: 'KEYWORD_SEARCH_COMMENT',
  strength: 9,
  personName: 'Marcus Feld',
  personTitle: 'Director of Corporate Events',
  personCompany: 'Halvorsen Consulting',
  personLinkedinUrl: 'https://www.linkedin.com/in/example',
  personLocation: 'London, United Kingdom',
  companyIndustry: 'Professional Services',
  companyEmployeeCount: 850,
  whyItMatters:
    "Director of Corporate Events is actively talking about venue holds disappearing for next year's leadership summit.",
  suggestedOpener:
    "Saw your note on venue holds disappearing for next year's summit. How far out are you sourcing now?",
  talkingPoints: [
    'Venue holds are disappearing earlier this cycle.',
    'Summit planning is starting earlier than last year.',
  ],
};

const SAMPLE_REPORT = {
  id: '8a1d5c3e-0000-4000-8000-000000000002',
  type: 'account',
  slug: 'halvorsen-consulting',
  name: 'Halvorsen Consulting',
  status: 'completed',
  createdAt: '2026-09-14T09:30:00.000Z',
};

module.exports = { BASE_URL, TOKEN_URL, READ_SCOPES, ALL_SCOPES, SAMPLE_SIGNAL, SAMPLE_DELIVERY, SAMPLE_REPORT };
