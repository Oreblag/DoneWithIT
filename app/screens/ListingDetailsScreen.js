import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import React from "react";
import AppText from "../components/AppText";

import ListItem from "../components/lists/ListItem";
import colors from "../config/colors";
import ContactSellerForm from '../components/ContactSellerForm';
import Screen from "../components/Screen";

export default function ListingDetailsScreen({ route }) {
  const listing = route.params

  return (
    <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}>
      <Image style={styles.image} placeholder={{ uri: listing.images[0].thumbnailUrl }} tint="light" source={{ uri: listing.images[0].url }} blurRadius={1} />
      <BlurView 
        intensity={20} 
        tint="light" 
      />
      <View style={styles.detailsContainer}>
        <AppText style={styles.title}>{listing.title}</AppText>
        <AppText style={styles.price}>${listing.price}</AppText>
        <View style={styles.userContainer}>
          <ListItem
            image={require("../assets/mosh.jpg")}
            title="George"
            subTitle="5 Listings"
          />
        </View>
        <ContactSellerForm listing={listing} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 300,
  },
  price: {
    color: colors.secondary,
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 20,
  },
  title: {
    color: 'tomato',
    fontSize: 24,
    fontWeight: "500",
  },
  userContainer: {
    marginVertical: 40,
  },
});
