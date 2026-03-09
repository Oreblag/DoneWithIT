import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import Screen from "../components/Screen";
import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";
import AppText from "../components/AppText";

import messagesApi from "../api/messages";
import useAuth from "../auth/useAuth";




const initialMessages = [
  {
    id: 1,
    title: "George Orepitan",
    description: "Hey! Is this item still available?",
    image: require("../assets/mosh.jpg"),
  },
  {
    id: 2,
    title: "George Orepitan",
    description:
      "I'm interested in this item. When will you be able to post it?",
    image: require("../assets/mosh.jpg"),
  },
];

function MessagesScreen({ route }) {

  const { listingId } = route.params || {};
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);


  const [messages, setMessages] = useState(initialMessages);
  const [refreshing, setRefreshing] = useState(false);



  // const loadMessages = async () => {
  //   setLoading(true);
  //   const response = await messagesApi.getMessages(listingId);
  //   setLoading(false);
    
  //   if (!response.ok) {
  //     setError(true);
  //     return console.log("Error fetching messages", response.problem);
  //   }
    
  //   setError(false);
  //   setMessages(response.data);
  // };
  
  // useEffect(() => {
  
  //   loadMessages();
  // }, [listingId]);


  const handleDelete = async (message) => {

    // const originalMessages = messages;

    // Delete the message from messages
    setMessages(messages.filter((m) => m.id !== message.id));

    // Call API to delete 
    const response = await messagesApi.deleteMessage(message.id);
    if (!response.ok) {
      // Revert if delete failed
      setMessages(originalMessages);
      Alert.alert("Error", "Could not delete the message.");
    }
  };

  // const handleRefresh = async () => {
  //   setRefreshing(true);
  //   await loadMessages();
  //   setRefreshing(false);
  // };

  if (loading && messages.length === 0) {
    return (
      <Screen>
        <ActivityIndicator animating size="large" />
      </Screen>
    );
  }

  if (error && messages.length === 0) {
    return (
      <Screen>
        <AppText>Couldn't load messages. Pull down to refresh.</AppText>
      </Screen>
    );
  }


  return (
    <Screen>
      <FlatList
        data={messages}
        keyExtractor={(message) => message.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            title={item.title}
            subTitle={item.description}
            image={item.image}
            onPress={() => console.log("Message selected", item)}
            renderRightActions={() => (
              <ListItemDeleteAction onPress={() => handleDelete(item)} />
            )}
          />
        )}
        ItemSeparatorComponent={ListItemSeparator}
        refreshing={refreshing}
        onRefresh={() => {
          setMessages([
            {
              id: 2,
              title: "T2",
              description: "D2",
              image: require("../assets/mosh.jpg"),
            },
          ]);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({});

export default MessagesScreen;
