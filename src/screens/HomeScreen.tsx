import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Linking } from "react-native";
import { Card, Title, Paragraph, Text, Button, Divider } from "react-native-paper";
import { getAllBooks } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  link: string;
}

const HomeScreen = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await getAllBooks();
      if (response && response.data) {
        setBooks(response.data);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const openBookLink = (url: string) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.error("Unable to open link:", url);
        }
      })
      .catch((err) => console.error("An error occurred:", err));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        icon="pencil"
        onPress={() => navigation.navigate("Books")}
        style={styles.manageButton}
        contentStyle={{ flexDirection: "row-reverse" }}
        compact
      >
       
      </Button>

      <ScrollView contentContainerStyle={styles.booksContainer}>
        {books.length === 0 ? (
          <Text style={styles.noBooks}>No books available</Text>
        ) : (
          books.map((book) => (
            <Card key={book._id} style={styles.card}>
              <Card.Content>
                {/* Judul */}
                <Title style={styles.title}>{book.title}</Title>

                {/* Divider */}
                <Divider style={styles.divider} />

                {/* Author and Genre */}
                <View style={styles.metaContainer}>
                  <Text style={styles.author}>Author: {book.author}</Text>
                  <Text style={styles.genre}>Genre: {book.genre}</Text>
                </View>

                {/* Divider */}
                <Divider style={styles.divider} />

                {/* Deskripsi */}
                <Paragraph numberOfLines={3} style={styles.description}>
                  {book.description}
                </Paragraph>

                {/* Divider */}
                <Divider style={styles.divider} />

                {/* Tombol Visit Link */}
                <Button
                  mode="contained"
                  onPress={() => openBookLink(book.link)}
                  style={styles.linkButton}
                  labelStyle={styles.linkButtonLabel}
                  compact
                >
                  Visit Link
                </Button>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b2838", // Latar belakang abu gelap
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  booksContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "stretch",
    paddingBottom: 16,
  },
  manageButton: {
    backgroundColor: "#001f3f", // Warna navy
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  card: {
    flexBasis: "48%",
    backgroundColor: "#2c3e50", // Latar belakang kartu navy terang
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
    minHeight: 200,
    borderColor: "#34495e",
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff", // Teks putih untuk judul
    marginBottom: 6,
    textAlign: "center",
  },
  divider: {
    marginVertical: 8,
    backgroundColor: "#34495e", // Warna navy terang untuk pembatas
    height: 1,
  },
  metaContainer: {
    alignItems: "center",
    marginBottom: 6,
  },
  author: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#bdc3c7", // Abu pastel untuk penulis
  },
  genre: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1abc9c", // Warna hijau pastel untuk genre
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
    color: "#ecf0f1", // Abu terang untuk deskripsi
    textAlign: "center",
  },
  linkButton: {
    backgroundColor: "#0074D9", // Biru navy terang
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 8,
  },
  linkButtonLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff", // Teks putih untuk tombol
  },
  noBooks: {
    fontSize: 16,
    fontWeight: "500",
    color: "#bdc3c7", // Abu terang untuk teks kosong
    textAlign: "center",
    marginTop: 40,
  },
});

export default HomeScreen;
