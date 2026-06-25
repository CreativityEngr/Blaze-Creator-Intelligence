# Blaze Health Score Calibration Report

Captured: June 20, 2026

## Purpose

Creator Health should answer:

> How am I performing relative to Blaze creators today?

It should not reward audience sizes calibrated for mature streaming platforms.

## Evidence Collected

The registered Blaze Creator Intelligence application used an official App Access Token and read-only Blaze APIs.

- The `type=all` directory returned one 20-channel page with no next cursor. This page was dominated by inactive or newly created channels and is not representative of active creators.
- A separate `type=live` query returned 20 currently live channels with no next cursor.
- Channel stats and VOD availability were available for all 20 live channels.
- Cross-channel follower lists and activity feeds returned `403`, so individual engagement activity is private to the authorized creator.
- Blaze does not expose a public historical growth series. Growth velocity must be calculated from Blaze Creator Intelligence snapshots.

## Current Live-Creator Snapshot

| Metric | Minimum | P25 | Median | P75 | P90 | Maximum |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Followers | 1 | 14 | 23 | 102 | 164 | 274 |
| Subscribers | 0 | 0 | 0 | 1 | 6 | 13 |
| Concurrent viewers | 1 | 2 | 3 | 5 | 7 | 9 |
| Recent VOD availability | 0 | 4 | 13 | 14 | 17 | 30 |
| Viewer-to-follower ratio | 1.9% | 4.5% | 8.2% | 13.3% | 38.5% | 300% |
| Subscriber-to-follower ratio | 0% | 0% | 0% | 1.5% | 5.9% | 7.3% |

These values came from 20 channels returned by the official live directory on June 20, 2026. They are useful as an initial active-creator cohort, but not as a permanent platform census. The API returned no pagination cursor, so the sample may be limited to the directory's first or ranked live page.

Earlier same-day captures produced a live median of 40 followers and 3 viewers. The later capture produced a median of 23 followers and 3 viewers. This volatility is evidence that one directory snapshot must not become a fixed scoring baseline.

The later sample also included 207 recent VODs:

- Median VOD duration: 11,838 seconds
- Median VOD views: 3
- P75 VOD views: 8
- P90 VOD views: 35

The live cohort covered 18 categories, so category-specific ranking is not yet statistically credible.

## Inactive Directory Cohort

The separate `type=all` page had a median of zero followers and was largely inactive. It must not be used as the primary health benchmark for creators who actively stream.

This distinction caused the original report error: the inactive `type=all` sample was incorrectly described as the Blaze ecosystem distribution. The live cohort is the relevant comparison for active creators.

## Connected Creator Position

At validation time, the connected creator had:

- 1 follower
- 0 subscribers
- 2 concurrent viewers while live
- A real follow event and live stream activity

Relative to the captured directory:

- 1 follower is below the current live-channel minimum of 3.
- 2 concurrent viewers is around the live-channel 25th percentile.
- 0 subscribers matches the live-channel median.
- The creator has too little stored history to compare stream consistency or growth velocity reliably.

This creator is early relative to the current live cohort, but 2 concurrent viewers is a real active-audience signal on Blaze and should not be judged against mature-platform audience scales.

## Problems In Health Score v1

1. Engagement uses an absolute logarithm of current viewers instead of a Blaze percentile.
2. Community uses a raw recent activity count, so repeated actions can inflate the score.
3. Growth begins from a fixed baseline of 70 rather than a platform distribution.
4. Subscriber performance is treated as generic growth even though the live distribution is zero-heavy and should be scored by conversion and percentile.
5. Stream consistency is absent despite being important on an emerging platform.
6. The score has no cohort date, sample size, or confidence indicator.

## Recommended Calibration Model

Do not score raw audience size directly. Convert each measurable input into a percentile within a recent Blaze cohort.

The next model should have three independent pillars. No production weights are proposed or applied yet.

### Personal Momentum

- 7-day and 30-day follower velocity
- Subscriber velocity and conversion change
- Median and peak concurrent-viewer change
- Unique engagement activity per stream hour
- Improvement relative to the creator's own prior windows

Momentum should reward meaningful progress from any starting size.

### Ecosystem Percentile

- Active-creator follower percentile
- Live concurrent-viewer percentile
- Viewer-to-follower efficiency percentile
- Subscriber conversion percentile
- VOD reach percentile

Percentiles should use rolling multi-capture cohorts, never one directory page.

### Creator Quality And Consistency

- Active streaming days
- Completed stream sessions
- Stream duration consistency without rewarding excessive hours
- Title and category completeness
- VOD publishing continuity
- Unique community participation and returning participants
- Reliability of stream cadence

Quality should measure healthy operation rather than production budget or audience size.

## Scoring Rules

- Use empirical percentile ranks, not fixed mature-platform thresholds.
- Compare live viewers only with creators who are live.
- Compare growth among creators with similar account age and starting audience where sample size permits.
- Winsorize extreme ratios so tiny follower counts cannot produce misleading 300% efficiency advantages.
- Deduplicate activity by provider event identity and actor/time window.
- Normalize engagement by stream duration and audience opportunity.
- Treat unavailable or statistically flat metrics as neutral, not zero-performance failures.
- Cap absolute audience reach so momentum and consistency can outweigh size.
- Store the benchmark capture date, cohort size, and metric confidence with each score.
- Fall back to the creator's own rolling trend when the platform cohort is too small.
- Do not publish an ecosystem percentile when the effective cohort has fewer than 30 observations.
- Do not publish category percentiles until a category has enough distinct active creators.

## Data Collection Required

Blaze Creator Intelligence should build daily benchmark snapshots from public App Access Token endpoints:

- Channel directory
- Channel stats
- Live status and concurrent viewers
- VOD availability

For a stable benchmark, capture the live directory repeatedly across different hours and weekdays. A minimum research period should include:

- 14 days before internal calibration
- 30 days before presenting ecosystem percentile as a strong user-facing claim
- Multiple captures per day
- Distinct-channel deduplication
- Cohort size and volatility tracking

Private authenticated creator data should supply:

- Followers and subscribers
- Recent activities
- Stream sessions
- Snapshot-derived growth velocity
- Subscriber conversion

At the current observable platform size, use a hybrid score:

1. Platform percentile where a meaningful distribution exists.
2. Personal trend where the ecosystem distribution is flat or too small.
3. Neutral weighting where neither source is statistically credible.

## Confidence Model

Every future score should carry an internal confidence level:

- `low`: fewer than 7 creator-days or an ecosystem cohort below 30
- `developing`: 7 to 29 creator-days with a usable general live cohort
- `established`: at least 30 creator-days and stable rolling cohorts

Low-confidence metrics should contribute less automatically rather than being interpreted as poor performance.

## Recommendation

Do not ship the current score as a reputation-style comparison score. Keep it labeled as an early health estimate until at least 7 to 30 days of benchmark snapshots exist.

The next Health Score implementation should introduce benchmark storage, personal rolling windows, cohort confidence, and consistency metrics before changing weights or visible grade thresholds.
