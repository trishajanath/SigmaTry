import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { router, useNavigation } from "expo-router";
import { Appbar } from "react-native-paper";

const QRCodeScanner = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: any; data: any }) => {
    if (!scanned) {
      setScanned(true);
      Alert.alert("Process Completed", `The QR code has been processed`, [
        {
          text: "OK",
          onPress: () => {
            handleRedirect(data);
          },
        },
      ]);
    }
  };

  const handleRedirect = (scannedData: string) => {
    const locationType = parseLocationType(scannedData);
    console.log("Location Type:", locationType);
    console.log("Scanned Data:", scannedData);
    switch (locationType) {
      case "classroom":
        router.push({
          pathname: "/qrScanner/qrForm",
          params: { scannedData },
        });
        break;
      case "restroom":
        router.push({
          pathname: "/qrScanner/qrRestroom",
          params: { scannedData },
        });
        break;
      case "department":
        router.push({
          pathname: "/qrScanner/qrDepartment",
          params: { scannedData },
        });
        break;
      case "water":
        router.push({
          pathname: "/qrScanner/qrWater",
          params: { scannedData },
        });
        break;
      case "lift":
        router.push({
          pathname: "/qrScanner/qrLift",
          params: { scannedData },
        });
        break;
      case "maintenance":
        router.push({
          pathname: "/qrScanner/qrMaintenance",
          params: { scannedData },
        });
        break;
      case "printer":
        router.push({
          pathname: "/qrScanner/qrPrinter",
          params: { scannedData },
        });
        break;
      case "ac":
        router.push({
          pathname: "/qrScanner/qrAC",
          params: { scannedData },
        });
        break;
      case "electrical":
        router.push({
          pathname: "/qrScanner/qrElectrical",
          params: { scannedData },
        });
        break;
      case "hostel":
        router.push({
          pathname: "/qrScanner/qrHostel",
          params: { scannedData },
        });
        break;
      default:
        Alert.alert(
          "Unknown Location",
          "The scanned QR code is not recognized."
        );
        setScanned(false);
        break;
    }
  };

  const parseLocationType = (data: string): string => {
    if (data.includes("classroom")) {
      return "classroom";
    } else if (data.includes("restroom")) {
      return "restroom";
    } else if (data.includes("department")) {
      return "department";
    } else if (data.includes("water")) {
      return "water";
    } else if (data.includes("lift")) {
      return "lift";
    } else if (data.includes("maintenance")) {
      return "maintenance";
    } else if (data.includes("printer")) {
      return "printer";
    } else if (data.includes("ac")) {
      return "ac";
    } else if (data.includes("electrical")) {
      return "electrical";
    } else if (data.includes("hostel")) {
      return "hostel";
    }
    return "unknown";
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
      </Appbar.Header>
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
  },
});

export default QRCodeScanner;
