/** @jsx jsx */
/**
  Licensing

  Copyright 2021 Esri

  Licensed under the Apache License, Version 2.0 (the "License"); You
  may not use this file except in compliance with the License. You may
  obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
  implied. See the License for the specific language governing
  permissions and limitations under the License.

  A copy of the license is available in the repository's
  LICENSE file.
*/
import { React, 
  jsx,
  AllWidgetProps, 
  IMDataSourceInfo, 
  DataSourceComponent, 
  DataSourceManager, 
  DataSource, 
  DataSourceStatus,
  FeatureLayerQueryParams
 } from "jimu-core";
 import { MapDataSource, 
  DataSourceTypes,
  loadArcGISJSAPIModules,
  JimuMapViewComponent, 
  JimuMapView 
} from "jimu-arcgis";
import * as ReactDataGrid from "react-data-grid";


interface IState {
  //: FeatureLayerQueryParams;
  rows:null;
  rowCount:number;
}
interface ColumnModel{
  key:string;
  name:string;
}

export default class Widget extends React.PureComponent<AllWidgetProps<any>, any> {
  private columns = [
    { key: "id", name: "ID" },
    { key: "title", name: "Title" },
    { key: "count", name: "Count" },
  ];

  private rows = [
    { id: 0, title: "row1", count: 20 },
    { id: 1, title: "row1", count: 40 },
    { id: 2, title: "row1", count: 60 },
  ];
  constructor(props) {
    super(props);
    this.state = {
      rows:null,
      rowCount:0
    };
  }

  cityNameRef: React.RefObject<HTMLInputElement> = React.createRef();
  fieldNames:string[] = ["RestaurantName", "City", "Address", "Description"];

  componentDidMount() {
    this.query();
  }

  query = () => {
    if (!this.isDsConfigured()) {
      return;
    }
    const fieldName = this.props.useDataSources[0].fields[0];
    const w = this.cityNameRef.current && this.cityNameRef.current.value ?
      `${fieldName} like '%${this.cityNameRef.current.value}%'` : '1=1';

      

    this.setState({
      rows: {...this.rows},
      rowCount:this.rows.length
    });
  };

  getColumns = ():ColumnModel[] => {
    const columns:ColumnModel[] = this.fieldNames.map((r, i) => {
      return {key:r, name:r.toLocaleUpperCase()}
    });
    return columns;
  }
  dataRender = (ds: DataSource, info: IMDataSourceInfo) => {

    const fName = this.props.useDataSources[0].fields[0];
    //const columns:ColumnModel[] = this.getColumns();
    
    
    let data;
    if(ds && ds.getStatus() === DataSourceStatus.Loaded){

      data = ds.getRecords().map((r, i) => {
        let row = r.getData();
        const a = {};
        for(let i = 0; this.fieldNames.length > i; i++){
          a[this.fieldNames[i]] = r.getData()[this.fieldNames[i]];
        }
        return a;
      });

      this.setState({
        rows:[...data],
        rowCount:data.length
      });
      this.columns = this.getColumns();
    }
    
    return <div>
      <ReactDataGrid
            columns={this.columns}
            rowGetter={(i) => this.state.rows[i]}
            rowsCount={this.state.rowCount}
            minHeight={250}
          />
    </div>
    
  }

  isDsConfigured = () => {
    if (this.props.useDataSources &&
      this.props.useDataSources.length === 1 &&
      this.props.useDataSources[0].fields &&
      this.props.useDataSources[0].fields.length === 1) {
      return true;
    }
    return false;
  }
  
  render() {
    return (
      <div>
        <div className="widget-d3 jimu-widget p-2">
          <p>React Data Grid sample</p>
          <p>
          <DataSourceComponent useDataSource={this.props.useDataSources[0]} query={this.state.query} widgetId={this.props.id} queryCount>
          {
            this.dataRender
          }
        </DataSourceComponent>
            
          </p>
        </div>
      </div>
    );
  }
}
