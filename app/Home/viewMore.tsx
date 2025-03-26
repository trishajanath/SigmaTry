import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { Appbar, Text, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const NavigationPage = () => {
  const router = useRouter();
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const categories = [
    {
      title: "Student Complaints",
      items: [
        { title: "Classroom", route: "/Home/classroom1", icon: "school" },
        { title: "Washroom", route: "/Home/restroom", icon: "water" },
        { title: "Water Dispenser", route: "/Home/Water", icon: "water" },
        { title: "Elevator", route: "/Home/Elevator", icon: "arrow-up" },
        { title: "Maintenance", route: "/Home/Maintenance", icon: "construct" },
        { title: "Lost & Found", route: "/Home/lostAndFound", icon: "search" },
      ]
    },
    {
      title: "Employee Complaints",
      items: [
        { title: "Department", route: "/Home/Department", icon: "business" },
        { title: "Printer", route: "/Home/printer", icon: "print" },
        { title: "AC", route: "/Home/ac", icon: "snow" },
        { title: "Electrical", route: "/Home/electrical", icon: "flash" },
        { title: "Hostel", route: "/Home/hostel", icon: "home" },
        { title: "Laundry", route: "/Home/laundry", icon: "shirt" },
        { title: "Mess", route: "/Home/mess", icon: "restaurant" },
        { title: "Common Areas", route: "/Home/commonAreas", icon: "people" },
        { title: "New Installation Request", route: "/Home/newInstallation", icon: "add-circle" },
        { title: "Other Issues", route: "/Home/other", icon: "ellipsis-horizontal" },
      ]
    },
    {
      title: "HOD Accessible",
      items: [
        { title: "Department", route: "/Home/Department", icon: "business" },
        { title: "Academic Issues", route: "/Home/academic", icon: "book" },
        { title: "Faculty Related", route: "/Home/faculty", icon: "people" },
        { title: "Curriculum", route: "/Home/curriculum", icon: "library" },
        { title: "Research", route: "/Home/research", icon: "flask" },
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Sigma - GMS" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.menuContainer}>
        <Text style={styles.heading}>Select a Category</Text>

        {categories.map((category, index) => (
          <View key={index} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            {category.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.menuItem}
                onPress={() => router.push(item.route)}
              >
                <View style={styles.menuItemContent}>
                  <Icon name={item.icon} size={24} color="#333" style={styles.menuIcon} />
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </View>
                <Icon name="chevron-forward" size={20} color="#333" />
              </TouchableOpacity>
            ))}
            {index < categories.length - 1 && <Divider style={styles.divider} />}
          </View>
        ))}
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
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    marginLeft: 5,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
    marginLeft: 5,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  divider: {
    marginVertical: 15,
    backgroundColor: '#e0e0e0',
  },
});

export default NavigationPage;
