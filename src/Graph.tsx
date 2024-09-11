import React, { Component } from 'react';
import { Table, TableData } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
        // Added different schema to track ratios instead of the top price
        // To create alerts we added upper and lower bounds and an alert schema.
        // The price of both stocks was also
        price_abc: 'float',
        price_def: 'float',
        ratio: 'float',
      alert: 'float',
      upper_bound: 'float',
      lower_bound: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      //Changed the attributes of the graph
      // Columns allow us to focus on the specified points of a datapoints data on the y axis (ratio, bounds and alerts)
      // Row Pivot maps each datapoint based on timestamp
      // Aggregated averages all other data other than timestamp and only considers a datapoint as 'unique' if it has a timestamp.
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('columns', '["ratio","lower_bound","upper_bound","alert"]');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('aggregates', JSON.stringify({
        price_abc: 'avg',
        price_def: 'avg',
        timestamp: 'distinct count',
        upper_bound: 'avg',
        lower_bound: 'avg',
        alert: 'avg',
        ratio: 'avg',
      }));
    }
  }

    componentDidUpdate() {
        if (this.table) {
            this.table.update([
                DataManipulator.generateRow(this.props.data),
            ] as unknown as TableData);
        }
    }
}

export default Graph;
