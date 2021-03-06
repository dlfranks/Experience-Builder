/** @jsx jsx */
import { React, FormattedMessage, css, jsx } from "jimu-core";
import { BaseWidgetSetting, AllWidgetSettingProps } from "jimu-for-builder";
import {Switch} from "jimu-ui";
import { 
  JimuMapViewSelector,
  SettingSection,
  SettingRow
 } from "jimu-ui/advanced/setting-components";
 import {IMConfig} from "../config";
 import defaultMessage from "./translations/default";


export default class Setting extends BaseWidgetSetting<AllWidgetSettingProps<IMConfig>, any> {

  onZoomToLayerPropertyChange = (evt: React.FormEvent<HTMLInputElement>) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set("zoomToLayer", evt.currentTarget.checked)
    });
  };

  onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    this.props.onSettingChange({
      id: this.props.id,
      useMapWidgetIds: useMapWidgetIds
    });
  };

  render() {
    const style = css`
      .widget-setting-addlayers {
        .checkbox-row {
          display:flex;
          justify-content:space-between;
          margin-bottom:8px;
        }

    }`;
    return (
      <div css={style}>
        <div className="widget-setting-addLayers">
          <SettingSection
            className="map-selector-section"
            title={this.props.intl.formatMessage({
              id:"mapWidgetLabel",
              defaultMessage: defaultMessage.selectMapWidget
            })}  
          >
            <SettingRow>
              <JimuMapViewSelector
                onSelect={this.onMapWidgetSelected}
                useMapWidgetIds = {this.props.useMapWidgetIds}
              />
            </SettingRow>
          </SettingSection>

          <SettingSection
            title={this.props.intl.formatMessage({
              id:"settingLabel",
              defaultMessage: defaultMessage.settings
            })}
          >
            <SettingRow>
              <div className="w-100 addLayers">
                <div className="checkbox-row">
                  <label>
                    <FormattedMessage
                      id="zoomToLayer"
                      defaultMessage={defaultMessage.zoomToLayer}
                    />
                  </label>
                  <Switch
                    checked={
                      (this.props.config && this.props.config.zoomToLayer) || false
                    }
                    onChange={this.onZoomToLayerPropertyChange}
                  />
                </div>

              </div>
            </SettingRow>

          </SettingSection>


        </div>
      </div>
    );
  }
}