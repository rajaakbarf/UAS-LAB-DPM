import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
  TextInput,
  Button as PaperButton,
  Card,
  Title,
  Paragraph,
  IconButton,
  Surface,
} from "react-native-paper";
import {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
}

const BookScreen = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
  });

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await getAllBooks();
      if (response && response.data) {
        setBooks(response.data);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = () => {
    setSelectedBook(null);
    setFormData({
      title: "",
      author: "",
      description: "",
      genre: "",
    });
    setDialogVisible(true);
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title || "",
      author: book.author || "",
      description: book.description || "",
      genre: book.genre || "",
    });
    setDialogVisible(true);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert("Validation Error", "Title is required");
      return false;
    }
    if (formData.title.trim().length < 3) {
      Alert.alert("Validation Error", "Title must be at least 3 characters");
      return false;
    }
    if (!formData.author.trim()) {
      Alert.alert("Validation Error", "Author is required");
      return false;
    }
    if (formData.author.trim().length < 3) {
      Alert.alert("Validation Error", "Author must be at least 3 characters");
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert("Validation Error", "Description is required");
      return false;
    }
    if (formData.description.trim().length < 10) {
      Alert.alert(
        "Validation Error",
        "Description must be at least 10 characters"
      );
      return false;
    }
    if (!formData.genre.trim()) {
      Alert.alert("Validation Error", "Genre is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const bookData = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      description: formData.description.trim(),
      genre: formData.genre.trim(),
    };

    try {
      if (selectedBook) {
        await updateBook(selectedBook._id, bookData);
        Alert.alert("Success", "Book updated successfully");
      } else {
        await createBook(bookData);
        Alert.alert("Success", "Book created successfully");
      }
      setDialogVisible(false);
      fetchBooks();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to save book.");
    }
  };

  const handleDelete = (bookId: string) => {
    Alert.alert("Delete Book", "Are you sure you want to delete this book?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteBook(bookId);
            Alert.alert("Success", "Book deleted successfully");
            fetchBooks();
          } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to delete book");
          }
        },
      },
    ]);
  };

  const renderBookItem = ({ item }: { item: Book }) => (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <Title style={styles.title}>{item.title}</Title>
        <Paragraph style={styles.genre}>{item.genre}</Paragraph>
      </View>
      <View style={styles.cardContent}>
        <Paragraph numberOfLines={3} style={styles.description}>
          {item.description}
        </Paragraph>
      </View>
      <Card.Actions style={styles.cardActions}>
        <PaperButton mode="contained" onPress={() => handleEditBook(item)} style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </PaperButton>
        <PaperButton mode="outlined" style={styles.deleteButton} onPress={() => handleDelete(item._id)}>
          Delete
        </PaperButton>
      </Card.Actions>
    </Card>
  );

  const renderForm = () => (
    <Modal
      visible={dialogVisible}
      animationType="slide"
      onRequestClose={() => setDialogVisible(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <Surface style={styles.modalHeader}>
          <Title style={styles.modalTitle}>
            {selectedBook ? "Edit Book" : "Add New Book"}
          </Title>
          <IconButton
            icon="close"
            size={24}
            onPress={() => setDialogVisible(false)}
            style={styles.closeButton}
          />
        </Surface>

        <ScrollView style={styles.formContent}>
          <TextInput
            label="Title *"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Author *"
            value={formData.author}
            onChangeText={(text) => setFormData({ ...formData, author: text })}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Description *"
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
            multiline
            numberOfLines={4}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Genre *"
            value={formData.genre}
            onChangeText={(text) => setFormData({ ...formData, genre: text })}
            style={styles.input}
            mode="outlined"
          />
        </ScrollView>

        <View style={styles.buttonContainer}>
          <PaperButton mode="outlined" onPress={() => setDialogVisible(false)} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </PaperButton>
          <PaperButton mode="contained" onPress={handleSubmit} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </PaperButton>
        </View>
      </SafeAreaView>
    </Modal>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <PaperButton mode="contained" onPress={handleAddBook} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add New Book</Text>
      </PaperButton>
      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
      {renderForm()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    backgroundColor: "#fff",
  },
  cardHeader: {
    backgroundColor: "#e3f7f9",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007B83",
    marginBottom: 4,
  },
  genre: {
    fontSize: 14,
    color: "#007AFF",
  },
  cardContent: {
    padding: 16,
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  editButton: {
    backgroundColor: "#82cdd3",
    borderRadius: 80,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  deleteButton: {
    borderColor: "#ff5252",
  },
  addButton: {
    alignSelf: "center",
    backgroundColor: "#82cdd3",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    marginBottom: 16,
  },
  addButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#e3f7f9", // Warna biru pastel untuk modal
  },
  modalHeader: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#82cdd3", // Header biru pastel
    elevation: 3,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff", // Teks putih
  },
  closeButton: {
    backgroundColor: "#ffffff",
    borderRadius: 50,
    padding: 6,
  },
  formContent: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#82cdd3",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  saveButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default BookScreen;
