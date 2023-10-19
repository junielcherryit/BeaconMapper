import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import MapView, { Marker } from 'react-native-maps';

const BeaconTracker = () => {

  const [beaconUUID, setBeaconUUID] = React.useState<string>('')

  const [beacons, setBeacons] = useState<any[]>([]);
  const [estimatedLocation, setEstimatedLocation] = useState<any>({ latitude: 0, longitude: 0 });

  const isBeacon = (device: any) => {
    if (device.serviceUUIDs.includes(beaconUUID)) return true  
    return false;
  };

  const trilateration = (beacons: any[]) => {
    // Certifique-se de que você tenha pelo menos 3 beacons para estimar a localização
    if (beacons.length < 3) {
      return { latitude: 0, longitude: 0 };
    }

    // Arrays para armazenar as coordenadas e as distâncias de todos os beacons
    const latitudes: any[] = [];
    const longitudes: any[] = [];
    const distances: any[] = [];

    // Preencha os arrays com os dados dos beacons
    beacons.forEach(beacon => {
      latitudes.push(beacon.latitude);
      longitudes.push(beacon.longitude);
      distances.push(beacon.distance);
    });

    // Implemente a lógica de trilateração aqui, usando as coordenadas e distâncias dos beacons
    // Você pode adaptar as fórmulas para lidar com múltiplos beacons

    // Exemplo de trilateração simples
    // Implemente a lógica de trilateração adequada para os beacons do seu ambiente
    // Aqui está um exemplo de cálculo da localização média ponderada com base nas distâncias

    const totalDistance = distances.reduce((acc, curr) => acc + curr, 0);

    const weightedLatitudes = latitudes.map((lat, index) => (lat * distances[index]) / totalDistance);
    const weightedLongitudes = longitudes.map((lon, index) => (lon * distances[index]) / totalDistance);

    const estimatedLatitude = weightedLatitudes.reduce((acc, curr) => acc + curr, 0);
    const estimatedLongitude = weightedLongitudes.reduce((acc, curr) => acc + curr, 0);

    return { latitude: estimatedLatitude, longitude: estimatedLongitude };
  };
  

  useEffect(() => {
    const bleManager = new BleManager();

    const startScanning = () => {
      bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error(error);
          return;
        }

        if (isBeacon(device)) {
          setBeacons(beacons => [...beacons, device]);
        }
      });
    };

    startScanning();

    return () => {
      bleManager.stopDeviceScan();
    };
  }, []);

  useEffect(() => {
    const estimatedLocation = trilateration(beacons);
    setEstimatedLocation(estimatedLocation);
  }, [beacons]);

  return (
    <View style={styles.container}>
      <TextInput 
        value={beaconUUID}
        onChangeText={(e) => setBeaconUUID(e)}
      />
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: estimatedLocation.latitude,
          longitude: estimatedLocation.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
      >
        {beacons.map((beacon, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: beacon.latitude, longitude: beacon.longitude }}
            title={beacon.name || 'Beacon'}
          />
        ))}

        <Marker
          coordinate={estimatedLocation}
          title="Minha Localização"
          description="Esta é a sua localização estimada"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default BeaconTracker;
