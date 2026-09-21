// Moved into the shared library — the dashboard renders the same card, and two
// copies of it would drift. Re-exported here so this feature's imports and the
// `_components` barrel keep working unchanged.
export { StatTile as default } from '@/components/library';
