import React from 'react';

import { DataFrame, GrafanaTheme2, PanelProps } from '@grafana/data';
import { ThemeContext } from '@grafana/ui';

import * as echarts from 'echarts';
import 'echarts-gl';
import ReactEChartsCore from 'echarts-for-react';

import { ChartType } from 'types/ChartType';
import { ECharts3DOption } from 'types/EchartsTypes';
import { SimpleOptions } from 'types/SimpleOptions';
import { SimpleSeries } from 'types/SimpleSeries';
import { findFieldIndex } from 'utils';

interface Props extends PanelProps<SimpleOptions> {}

function generateContent(
  options: SimpleOptions,
  width: number,
  height: number,
  series: SimpleSeries,
  theme: GrafanaTheme2
) {
  const xValues: number[] = series.x.values.toArray(); // X
  const yValues: number[] = series.y.values.toArray(); // Y
  const zValues: number[] = series.z.values.toArray(); // Z
  const colorValues: number[] | undefined = series.color?.values.toArray();

  const hasColorDefined = colorValues !== undefined && colorValues.length > 0;

  const XYZ = hasColorDefined
    ? xValues.map((xi, i) => [xi, yValues[i], zValues[i], colorValues[i]])
    : xValues.map((xi, i) => [xi, yValues[i], zValues[i]]);

  const visualMapLegendOptions = (colorValuesIn: number[]) =>
    options.colorLegend ?? false
      ? {
          show: true,
          itemWidth: 20,
          itemHeight: 6,
          itemGap: 4,
          text: [Math.max(...colorValuesIn).toFixed(1), Math.min(...colorValuesIn).toFixed(1)],
          textStyle: {
            fontSize: 8,
            color: theme.colors.secondary.text,
          },
        }
      : { show: false };

  const visualMapOptions: { visualMap: echarts.EChartOption.VisualMap[] } | undefined = hasColorDefined
    ? {
        visualMap: [
          {
            dimension: 3, // the fourth dimension of series.data (i.e. value[3]) is mapped
            type: 'piecewise', // defined as discrete visualMap
            splitNumber: 5,
            min: Math.min(...colorValues),
            max: Math.max(...colorValues),
            color: ['rgb(224, 47, 68)', 'rgb(255, 120, 10)', 'rgb(86, 166, 75)'],
            ...visualMapLegendOptions(colorValues),
          },
        ],
      }
    : undefined;

  const chartStyleOptions =
    options.chartType === ChartType.line3D
      ? {
          lineStyle: {
            color: theme.colors.primary.main,
            width: options.symbolSize,
            opacity: options.fillOpacity,
          },
        }
      : {
          symbolSize: options.symbolSize,
          itemStyle: {
            color: theme.colors.primary.main,
            opacity: options.fillOpacity,
          },
        };

  const echartsOptions: ECharts3DOption = {
    grid3D: {
      axisLabel: {
        show: false,
      },
      axisPointer: {
        lineStyle: { color: theme.colors.primary.shade },
        label: {
          textStyle: {
            color: theme.colors.primary.text,
          },
        },
      },
      axisTick: {
        lineStyle: { opacity: 0.8, color: theme.colors.secondary.transparent },
      },
      axisLine: {
        lineStyle: { opacity: 0.8, color: theme.colors.secondary.transparent },
      },
      splitLine: {
        lineStyle: { opacity: 0.8, color: theme.colors.secondary.transparent },
      },
    },
    xAxis3D: {
      name: undefined,
      min: 'dataMin',
      max: 'dataMax',
    },
    yAxis3D: {
      name: undefined,
      min: 'dataMin',
      max: 'dataMax',
    },
    zAxis3D: {
      name: undefined,
      min: 'dataMin',
      max: 'dataMax',
    },
    series: [
      {
        animation: false,
        type: ChartType[options.chartType],
        data: XYZ,
        ...chartStyleOptions,
      },
    ],
    ...visualMapOptions,
  };
  return (
    <ReactEChartsCore
      echarts={echarts}
      option={echartsOptions}
      style={{ height: height, width: width }}
      lazyUpdate={true}
    />
  );
}

const prepSeries = (options: SimpleOptions, frames: DataFrame[]): SimpleSeries => {
  if (!frames.length) {
    throw new Error('missing data');
  }

  if (!options.axes) {
    throw new Error('no options (axes) defined');
  }
  const { axes } = options;

  if (axes?.x === undefined) {
    throw new Error('Select X dimension');
  }

  if (axes?.y === undefined) {
    throw new Error('Select Y dimension');
  }

  if (axes?.z === undefined) {
    throw new Error('Select Z dimension');
  }

  const frame = frames[0];
  const xIndex = findFieldIndex(frame, axes.x);

  if (xIndex !== undefined) {
    const yIndex = findFieldIndex(frame, axes.y);

    if (yIndex === undefined) {
      throw new Error('Y must be in the same frame as X');
    }

    const zIndex = findFieldIndex(frame, axes.z);
    if (zIndex === undefined) {
      throw new Error('Z must be in the same frame as X');
    }

    const colorIndex = findFieldIndex(frame, axes.color);

    const baseSeries = {
      x: frame.fields[xIndex],
      y: frame.fields[yIndex],
      z: frame.fields[zIndex],
    };

    if (colorIndex == null) {
      return baseSeries;
    }

    return {
      ...baseSeries,
      color: frame.fields[colorIndex],
    };
  }
  throw "Can't find X axis";
};

interface State {
  error?: Error;
  series?: SimpleSeries;
}

const prepData = (options: SimpleOptions, data: DataFrame[]): State => {
  try {
    const series = prepSeries(options, data);
    return {
      series: series,
    };
  } catch (e) {
    if (e instanceof Error) {
      return {
        error: e,
      };
    } else {
      throw e;
    }
  }
};

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const { error, series } = prepData(options, data.series);
  if (error) {
    return (
      <div className="panel-empty">
        <p>{error.message}</p>
      </div>
    );
  }
  if (series === undefined) {
    return (
      <div className="panel-empty">
        <p>Series is undefined</p>
      </div>
    );
  }
  return (
    <ThemeContext.Consumer>{(theme) => generateContent(options, width, height, series, theme)}</ThemeContext.Consumer>
  );
};
