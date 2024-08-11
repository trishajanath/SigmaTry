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

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Write A Complaint" />
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
          <Text style={styles.menuItemText}>Elevator</Text>
          <Icon name="chevron-forward" size={20} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/Home/Maintenance')}
        >
          <Text style={styles.menuItemText}>Miscellaneous</Text>
          <Icon name="chevron-forward" size={20} color="#333" />
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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
    alignSelf: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderBottomWidth: 1,  // Added a bottom border
    borderBottomColor: '#e0e0e0', // Light gray color
    width: '100%',
  },
  menuItemText: {
    fontSize: 18,
    color: '#333',
  },
});

export default NavigationPage;
