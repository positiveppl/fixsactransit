import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

const KV_NAMESPACE_ID = 'aac52192fcae4d898c2eb6d25ea8f644';

const result = {
  id: "sacramento",
  name: "Sacramento",
  state: "CA",
  rail_feed: false,
  pain_factor: 6.6,
  transit_minutes: 100,
  drive_minutes: 15,
  walk_minutes: 11,
  wait_minutes: 41,
  wait_pct: 41,
  transfers: 1,
  next_departure_min: 28,
  frequency_score: 5.8,
  coverage_score: 1.4,
  avg_headway_minutes: 28.3,
  coverage_pct: 14.9,
  stop_count: 2823,
  score: "2.8",
  pain_computed_at: new Date().toISOString(),
  gtfs_computed_at: new Date().toISOString(),
};

writeFileSync('/tmp/sac-result.json', JSON.stringify(result));
execSync(`npx wrangler kv key put --namespace-id=${KV_NAMESPACE_ID} "city:sacramento" --path="/tmp/sac-result.json"`, { stdio: 'inherit' });
console.log('✅ Done');
