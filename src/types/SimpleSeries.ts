import { Field } from '@grafana/data';

export interface SimpleSeries {
  name?: string;

  x: Field;
  y: Field;
  z: Field;
  color?: Field;
}
