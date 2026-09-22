# SignalRaven for Zapier

The SignalRaven Zapier integration: LinkedIn buying-intent signals, prospect and account research, and openers from your workspace, connected to the apps Zapier supports.

## What it does

**Triggers**
- New Signal (instant): SignalRaven pushes each qualified signal to the Zap through a webhook destination it registers in your workspace. Needs a key with the `write:destinations` scope.
- New Signal (Polling): same signals on a schedule, with minimum strength and type filters. For keys without `write:destinations`.
- New Intelligence Report: a person or account research report was created.

**Searches**
- Find Signals, Find Signal by ID
- Find Intelligence Reports, Get Intelligence Report
- Find Sources, Get ICP or Usage

**Actions**
- Run Account Intelligence, Run Person Intelligence (spend credits unless a recent report exists)

## Authentication

Session auth. The user pastes the client id and client secret of a SignalRaven API key (Settings, then API keys, at https://app.signalraven.ai). The integration exchanges them for a short-lived bearer token and re-runs the exchange when the API answers 401. Keys created with a subset of scopes work: the exchange retries with the read scopes.

## Develop

```
npm install
npx zapier-platform-cli validate
SR_CLIENT_ID=... SR_CLIENT_SECRET=... npm test    # or put both in .env
```

## Publish (Zapier developer account required)

```
npx zapier-platform-cli login
npx zapier-platform-cli register "SignalRaven"     # once; writes .zapierapprc
npx zapier-platform-cli push
```

Then in the Zapier Developer Platform: add the logo and description, invite testers, and submit for public review. Zapier answers within a week, then the integration sits in a 90-day beta that ends early once one Zapier signup comes through an embed on our site.

Docs: https://signalraven.ai/developers · Support: support@signalraven.ai
