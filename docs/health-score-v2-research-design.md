# Health Score V2 Research Design

Status: research design only. Health Score v1 weights remain unchanged.

## Product Question

The score must answer:

> How strong is this creator's current trajectory and operating health relative to their own history and the Blaze ecosystem?

## Three-Pillar Model

### Personal Momentum

Measures whether the creator is improving.

- Follower and subscriber net change
- Median viewers per stream
- Viewer retention proxies
- Unique activity per stream hour
- Conversion trend
- Acceleration or deceleration over rolling windows

Use absolute deltas alongside percentage deltas. Moving from 1 to 2 followers is real progress, but should not be treated as equivalent to adding 100 followers solely because both may produce a large percentage.

### Ecosystem Percentile

Measures relative position only where the cohort is credible.

- Compare live viewers against active live creators.
- Compare followers against recently active creators.
- Compare conversion ratios against creators with enough denominator volume.
- Use rolling percentile bands from repeated captures.
- Suppress percentiles when cohort size or stability is insufficient.

Absolute size should have capped influence.

### Creator Quality And Consistency

Measures sustainable creator behavior.

- Streaming days and completed sessions
- Cadence consistency
- Reasonable stream duration
- Metadata completeness
- VOD continuity
- Unique and returning community activity
- Low duplicate-event and test-event contamination

Do not equate longer streams with better streams. Consistency and engagement efficiency matter more than raw hours.

## Cohort Strategy

Use multiple cohorts, selected in this order:

1. Active Blaze creators over the trailing 30 days
2. Similar starting audience band
3. Similar account tenure
4. Category cohort only when it has enough creators

Fallback to the broader active cohort when a narrow cohort is too small.

## Benchmark Collection

Capture public ecosystem data several times daily:

- Channel identity and category
- Live state
- Followers, subscribers, viewers
- VOD count, duration, and views
- Capture timestamp

Derive:

- Distinct active days
- Observed stream frequency
- Viewer and follower distributions
- Conversion distributions
- Ratio distributions with outlier controls
- Cohort volatility

Private creator snapshots provide the personal trend and engagement dimensions that public APIs cannot expose.

## Guardrails

- Minimum cohort: 30 distinct creators
- Minimum personal history: 7 days for directional signals
- Preferred personal history: 30 days
- Winsorize ratios at rolling P5 and P95
- Deduplicate provider events
- Exclude known test activity from production scoring
- Avoid penalizing missing subscriber activity while the ecosystem distribution remains zero-heavy
- Attach confidence and benchmark date to every calculated score

## Research Exit Criteria

Weights should not be proposed until:

1. At least 14 days of repeated ecosystem captures exist.
2. At least 30 distinct active creators are observed.
3. Cohort distributions are stable enough to reproduce percentile bands.
4. The connected creator has at least 7 days of personal snapshots.
5. Test events are separated from organic activity.
6. Backtesting confirms that creator growth and consistency can outperform raw audience size.
