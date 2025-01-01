import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { getAuthToken, removeAuthToken } from "../utils/auth";
import { fetchUserProfile, updateUserProfile } from "../services/api";
import { RootStackParamList, User } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";

const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedProfile, setEditedProfile] = useState<User | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadUserProfile = async () => {
      const token = await getAuthToken();
      if (token) {
        try {
          const profileData = (await fetchUserProfile()) as User;
          setUser(profileData);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      }
      setLoading(false);
    };

    loadUserProfile();
  }, []);

  const handleLogout = async () => {
    await removeAuthToken();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const openEditModal = () => {
    setEditedProfile(user); // Populate the modal with the current user data
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (editedProfile) {
      try {
        await updateUserProfile(editedProfile);
        setUser(editedProfile);
        Alert.alert("Success", "Profile updated successfully");
        setEditModalVisible(false);
      } catch (error) {
        Alert.alert("Error", "Failed to update profile");
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingSpinner />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>No user data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: user.profilePicture || "https://via.placeholder.com/150",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{user.username}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.editButton} onPress={openEditModal}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <ScrollView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Profile</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={editedProfile?.username}
            onChangeText={(text) =>
              setEditedProfile({ ...editedProfile!, username: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={editedProfile?.email}
            onChangeText={(text) =>
              setEditedProfile({ ...editedProfile!, email: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Profile Picture URL"
            value={editedProfile?.profilePicture || ""}
            onChangeText={(text) =>
              setEditedProfile({ ...editedProfile!, profilePicture: text })
            }
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProfile}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  profileEmail: {
    fontSize: 16,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  editButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: "#FF5252",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginLeft: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ProfileScreen;
