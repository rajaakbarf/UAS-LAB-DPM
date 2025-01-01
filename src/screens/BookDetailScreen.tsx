import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { getBookDetail } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

interface BookDetail {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  publishedYear: number;
  genre: string;
}

const BookDetailScreen = ({ route }) => {
  const { bookId } = route.params;
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookDetail();
  }, []);

  const fetchBookDetail = async () => {
    try {
      const data = await getBookDetail(bookId);
      setBook(data);
    } catch (error) {
      console.error("Error fetching book detail:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!book) {
    return (
      <View style={styles.container}>
        <Text>Buku tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: book.coverImage }} style={styles.coverImage} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>Oleh: {book.author}</Text>
        <Text style={styles.info}>Genre: {book.genre}</Text>
        <Text style={styles.info}>Tahun Terbit: {book.publishedYear}</Text>
        <Text style={styles.description}>{book.description}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  coverImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  author: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    color: "#444",
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
  },
});

export default BookDetailScreen;