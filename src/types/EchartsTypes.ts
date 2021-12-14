import { EChartOption } from 'echarts';
import { AxisBaseOptionCommon } from 'echarts/types/src/coord/axisCommonTypes';
import { ColorString, ZRFontWeight } from 'echarts/types/src/util/types';

interface SeriesLine3D extends EChartOption.SeriesLine {
  grid3DIndex?: number;
}

interface SeriesScatter3D extends EChartOption.SeriesScatter {
  grid3DIndex?: number;
}

type EChart3DSeries = SeriesLine3D | SeriesScatter3D;

interface BaseLineStyle {
  color?: EChartOption.Color | EChartOption.Color[] | undefined;
  width?: number | undefined;
  opacity?: number | undefined;
}

interface BaseTextStyle {
  color?: ColorString | ((value?: string) => ColorString);
  borderWidth?: number;
  borderColor?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: ZRFontWeight;
}

type StringFormatter = string | ((value: number, valueAll: number[]) => string);
interface Grid3D extends EChartOption.Grid {
  id?: string;
  tooltip?: EChartOption.Tooltip;
  axisLine?: {
    show?: boolean;
    interval?: number | 'auto' | ((index: number, value: string) => boolean);
    lineStyle?: BaseLineStyle;
  };
  axisLabel?: {
    show?: boolean;
    margin?: number;
    interval?: number | 'auto' | ((index: number, value: string) => boolean);
    formatter?: StringFormatter;
    textStyle?: BaseTextStyle;
  };
  axisTick?: {
    show?: boolean;
    length?: number;
    interval?: number | 'auto' | ((index: number, value: string) => boolean);
    lineStyle?: BaseLineStyle;
  };
  splitLine?: {
    show?: boolean;
    interval?: number | 'auto' | ((index: number, value: string) => boolean);
    lineStyle?: BaseLineStyle;
  };
  splitArea?: {
    show?: boolean;
    interval?: number | 'auto' | ((index: number, value: string) => boolean);
    areaStyle?: { color?: ColorString[] };
  };
  axisPointer?: {
    show?: boolean;
    lineStyle?: BaseLineStyle;
    label?: {
      show?: boolean;
      margin?: number;
      formatter?: StringFormatter;
      textStyle?: BaseTextStyle;
    };
  };
}

export interface ECharts3DOption extends EChartOption {
  grid3D: Grid3D;
  xAxis3D: AxisBaseOptionCommon;
  yAxis3D: AxisBaseOptionCommon;
  zAxis3D: AxisBaseOptionCommon;
  series: EChart3DSeries[];
  visualMap?: EChartOption.VisualMap[];
}
