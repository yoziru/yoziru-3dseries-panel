import { HideableFieldConfig, AxisConfig } from '@grafana/schema';

import { ChartType } from './ChartType';

export interface SimpleSeriesConfig extends HideableFieldConfig, AxisConfig {
  x?: string;
  y?: string;
  z?: string;
  color?: string;
}
export interface SimpleOptions {
  chartType: ChartType;
  symbolSize: number;
  fillOpacity: number;
  axes?: SimpleSeriesConfig;
  colorLegend?: boolean;
}
