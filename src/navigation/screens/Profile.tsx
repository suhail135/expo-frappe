import { Text } from '@react-navigation/elements';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useFrappeGetCall } from 'frappe-react-sdk';
import { useFrappeAuth } from '../../auth';

interface UserInfo {
  name: string;
  email: string;
  full_name: string;
  user_image?: string;
  roles: string[];
}

export function Profile() {
  const { logout } = useFrappeAuth();
  
  // Fetch current user info from Frappe
  const { data, error, isLoading } = useFrappeGetCall<UserInfo>(
    'frappe.integrations.oauth2.openid_profile'
  );


  const user = data;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load profile</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Avatar */}
      <View style={styles.avatarContainer}>
        {user?.user_image ? (
          <Image source={{ uri: user.user_image }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {user?.full_name?.charAt(0) || user?.name?.charAt(0) || '?'}
            </Text>
          </View>
        )}
      </View>

      {/* User Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.fullName}>{user?.full_name || user?.name || 'Unknown User'}</Text>
        <Text style={styles.email}>{user?.email || user?.name}</Text>
        
        {/* Roles */}
        {user?.roles && user.roles.length > 0 && (
          <View style={styles.rolesContainer}>
            <Text style={styles.rolesLabel}>Roles:</Text>
            <View style={styles.rolesList}>
              {user.roles.slice(0, 3).map((role, index) => (
                <View key={index} style={styles.roleBadge}>
                  <Text style={styles.roleText}>{role}</Text>
                </View>
              ))}
              {user.roles.length > 3 && (
                <Text style={styles.moreRoles}>+{user.roles.length - 3} more</Text>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  detailsContainer: {
    alignItems: 'center',
    gap: 8,
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  rolesContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  rolesLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  rolesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  roleBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    fontSize: 12,
    color: '#1976D2',
  },
  moreRoles: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'center',
  },
  logoutButton: {
    marginTop: 30,
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
