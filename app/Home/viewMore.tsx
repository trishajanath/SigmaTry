import React from 'react';
import { View, StyleSheet,TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { Appbar, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const NavigationPage = () => {
  const router = useRouter();
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  const isRouteDisabled = true;
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Sigma - GMS" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.menuContainer}>
        <Text style={styles.heading}>Select a Category</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/Home/classroom1')}
        >
          <Text style={styles.menuItemText}>Classroom</Text>
          <Icon name="chevron-forward" size={20} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/Home/restroom')}
        >
          <Text style={styles.menuItemText}>Washroom</Text>
          <Icon name="chevron-forward" size={20} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/Home/Department')}
        >
          <Text style={styles.menuItemText}>Department</Text>
          <Icon name="chevron-forward" size={20} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/Home/Water')}
        >
          <Text style={styles.menuItemText}>Water Dispenser</Text>
          <Icon name="chevron-forward" size={20} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/Home/Elevator')}
        >
          <Text style={styles.menuItemText}>Lift</Text>
          <Icon name="chevron-forward" size={20} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/Home/Maintenance')}
        >
          <Text style={styles.menuItemText}>Miscellaneous</Text>
          <Icon name="chevron-forward" size={20} color="#333" />
        </TouchableOpacity>
         

<TouchableOpacity
  style={[styles.menuItem, isRouteDisabled && styles.disabledMenuItem]}
  onPress={() => {
    if (!isRouteDisabled) {
      router.push('');
    }
  }}
  disabled={isRouteDisabled}
>
  <Text style={[styles.menuItemText, isRouteDisabled && styles.disabledText]}>
    Hostel
  </Text>
  <Icon name="chevron-forward" size={20} color={isRouteDisabled ? "#ccc" : "#333"} />
</TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  menuContainer: {
    padding: 16,
    alignItems: 'flex-start',
  },
  disabledMenuItem: {
    opacity: 0.5, 
  },
  disabledText: {
    color: '#ccc', 
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    marginLeft: 5,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 12,
    borderWidth : 1, 
    borderRadius: 10, 
    borderColor : "#D3D3D3",
    width: '100%',
  },
  menuItemText: {
    fontSize: 18,
    color: '#333',
  },
});

export default NavigationPage;
