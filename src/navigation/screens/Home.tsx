import { Button, Text } from '@react-navigation/elements';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useFrappeAuth } from '../../auth';

export function Home() {
  const { logout } = useFrappeAuth();

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Text>You are logged in!</Text>
      <Button screen="Profile">
        Go to Profile
      </Button>
      <Button screen="Settings">Go to Settings</Button>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
});
