import { DataFrame, getFieldDisplayName } from '@grafana/data';

export function findFieldIndex(frame?: DataFrame, name?: string): number | undefined {
  if (!frame || !(name?.length ?? 0)) {
    return undefined;
  }

  for (let i = 0; i < frame.fields.length; i++) {
    const field = frame.fields[i];
    if (name === field.name) {
      return i;
    }
    const disp = getFieldDisplayName(field, frame);
    if (name === disp) {
      return i;
    }
  }
  return undefined;
}
