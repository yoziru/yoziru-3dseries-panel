import { Field, FieldType, PanelPlugin } from '@grafana/data';

import { SimplePanel } from 'SimplePanel';

import { ChartType } from 'types/ChartType';
import { SimpleOptions } from 'types/SimpleOptions';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions((builder) => {
  builder.addRadio({
    category: ['Graph styles'],
    name: 'Chart type',
    description: 'How the chart should be rendered',
    path: 'chartType',
    settings: {
      options: [
        { value: ChartType.scatter3D, label: 'Scatter' },
        { value: ChartType.line3D, label: 'Line' },
      ],
    },
    defaultValue: ChartType.scatter3D,
  });

  builder.addSliderInput({
    category: ['Graph styles'],
    path: 'symbolSize',
    name: 'Size',
    defaultValue: 5,
    settings: {
      min: 0,
      max: 50,
    },
  });

  builder.addSliderInput({
    category: ['Graph styles'],
    path: 'fillOpacity',
    name: 'Fill Opacity',
    defaultValue: 1,
    settings: {
      min: 0,
      max: 1,
      step: 0.1,
    },
  });

  builder.addFieldNamePicker({
    category: ['Axis'],
    path: 'axes.x',
    name: 'X Axis',
    settings: {
      filter: (f: Field) => f.type === FieldType.number,
      noFieldsMessage: 'No numeric fields found',
    },
  });

  builder.addFieldNamePicker({
    category: ['Axis'],
    path: 'axes.y',
    name: 'Y Axis',
    settings: {
      filter: (f: Field) => f.type === FieldType.number,
      noFieldsMessage: 'No numeric fields found',
    },
  });

  builder.addFieldNamePicker({
    category: ['Axis'],
    path: 'axes.z',
    name: 'Z Axis',
    settings: {
      filter: (f: Field) => f.type === FieldType.number,
      noFieldsMessage: 'No numeric fields found',
    },
  });

  builder.addFieldNamePicker({
    category: ['Color'],
    path: 'axes.color',
    name: 'Color Axis',
    settings: {
      filter: (f: Field) => f.type === FieldType.number,
      noFieldsMessage: 'No numeric fields found',
    },
  });

  builder.addBooleanSwitch({
    category: ['Color'],
    path: 'colorLegend',
    name: 'Show legend?',
    showIf: (options) => options.axes?.color !== undefined,
  });

  return builder;
});
