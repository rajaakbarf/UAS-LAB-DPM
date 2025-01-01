import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Linking, TouchableOpacity } from "react-native";
import { Card, Title, Paragraph, Text, Button } from "react-native-paper";
import { getAllBooks } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import { MaterialIcons } from "@expo/vector-icons";

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  link: string; // Add a link field for the book
}

const HomeScreen = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [ratings, setRatings] = useState<{ [key: string]: number }>({}); // Track ratings for each book

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

  const setRating = (bookId: string, rating: number) => {
    setRatings((prevRatings) => ({ ...prevRatings, [bookId]: rating }));
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
        contentStyle={{ flexDirection: "row-reverse" }} // Optional: Align icon properly
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
                <Title style={styles.title}>{book.title}</Title>
                <Paragraph style={styles.author}>By: {book.author}</Paragraph>
                <Paragraph style={styles.genre}>Genre: {book.genre}</Paragraph>
                <Paragraph numberOfLines={3} style={styles.description}>
                  {book.description}
                </Paragraph>
                <View style={styles.actionRow}>
                  <Button
                    mode="contained"
                    onPress={() => openBookLink(book.link)}
                    style={styles.linkButton}
                    labelStyle={styles.linkButtonLabel}
                    compact
                  >
                    Visit Link
                  </Button>
                  <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity
                        key={star}
                        onPress={() => setRating(book._id, star)}
                      >
                        <MaterialIcons
                          name={
                            ratings[book._id] >= star
                              ? "star"
                              : "star-border"
                          }
                          size={24}
                          color="#FFD700" // Gold color for stars
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
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
    backgroundColor: "#f0f4f8",
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
    backgroundColor: "#82c0cc",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  card: {
    flexBasis: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "flex-start",
    minHeight: 150,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e2d2f",
    marginBottom: 6,
  },
  author: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#6c7a89",
    marginBottom: 4,
  },
  genre: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4db6ac",
    marginBottom: 10,
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
    color: "#3c4858",
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  linkButton: {
    backgroundColor: "#1e88e5",
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  linkButtonLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  noBooks: {
    fontSize: 16,
    fontWeight: "500",
    color: "#8a8d91",
    textAlign: "center",
    marginTop: 40,
  },
});

export default HomeScreen;
