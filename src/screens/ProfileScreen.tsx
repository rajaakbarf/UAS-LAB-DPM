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
    setEditedProfile(user);
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
        <Text style={styles.noUserText}>No user data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri: user.profilePicture || "https://via.placeholder.com/150",
            }}
            style={styles.profileImage}
          />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user.username}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
        </View>
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
        animationType="fade"
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <ScrollView style={styles.modalContent}>
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
            </ScrollView>
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
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b2838", // Navy dark background
    padding: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2c3e50", // Navy card background
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    marginRight: 20,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  profileEmail: {
    fontSize: 14,
    color: "#bdc3c7",
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButton: {
    flex: 1,
    backgroundColor: "#0074D9",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  logoutButton: {
    flex: 1,
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#2c3e50",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
  },
  modalContent: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#bdc3c7",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#0074D9",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 10,
  },
  saveButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  noUserText: {
    fontSize: 16,
    color: "#bdc3c7",
    textAlign: "center",
  },
});

export default ProfileScreen;
