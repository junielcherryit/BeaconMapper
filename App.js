import * as React from 'react';
import { DeviceEventEmitter, View } from 'react-native';
// import Beacons from 'react-native-beacons-manager';

import Beacons from '@hkpuits/react-native-beacons-manager'

const region = {
  identifier: 'Estimotes',
  uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D',
};

const App = () => {
  const [ data, setData ] = React.useState(undefined)
  React.useEffect(() => {
    Beacons.requestWhenInUseAuthorization();
    Beacons.startMonitoringForRegion(region);
    Beacons.startRangingBeaconsInRegion(region);
    Beacons.startUpdatingLocation();
    const subscription = DeviceEventEmitter.addListener(
      'beaconsDidRange',
      (value) => {
      console.log({ value })
      setData({...value})
      // value.region - The current region
      // value.region.identifier
      // value.region.uuid

      // value.beacons - Array of all beacons inside a region
      //  in the following structure:
      //    .uuid
      //    .major - The major version of a beacon
      //    .minor - The minor version of a beacon
      //    .rssi - Signal strength: RSSI value (between -100 and 0)
      //    .proximity - Proximity value, can either be "unknown", "far", "near" or "immediate"
      //    .accuracy - The accuracy of a beacon
      }
    );

    return () => {
      subscription.remove();
    };
  }, [region]);

  console.log({
    data
  })

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>
        App
      </Text>
    </View>
  );
};

export { App };
