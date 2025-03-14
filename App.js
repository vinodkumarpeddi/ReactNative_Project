import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, TouchableOpacity, ActivityIndicator, 
  StyleSheet, Animated, Easing 
} from "react-native";
import axios from "axios";

const UserScreen = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animations
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);
  const slideAnim = new Animated.Value(0);
  const buttonScale = new Animated.Value(1);
  const avatarRotation = new Animated.Value(0);
  const shimmerAnim = new Animated.Value(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      // Animate when user changes
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(avatarRotation, {
          toValue: 1,
          duration: 600,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(shimmerAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(shimmerAnim, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            }),
          ])
        ).start(),
      ]).start();
    }
  }, [currentIndex, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://random-data-api.com/api/users/random_user?size=80");
      if (response.data && response.data.length > 0) {
        setUsers(response.data);
      } else {
        setError("No users found in API response.");
      }
    } catch (err) {
      setError("Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
      slideAnim.setValue(300);
      avatarRotation.setValue(0);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
      slideAnim.setValue(-300);
      avatarRotation.setValue(0);
    }
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#FFD700" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  if (users.length === 0) {
    return <Text style={styles.error}>No user data available.</Text>;
  }

  const user = users[currentIndex];

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.card, 
        { 
          opacity: fadeAnim, 
          transform: [{ scale: scaleAnim }, { translateX: slideAnim }]
        }
      ]}>
        <Animated.Image 
          source={{ uri: user.avatar }} 
          style={[
            styles.avatar, 
            { transform: [{ rotate: avatarRotation.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "360deg"]
              }) 
            }] }
          ]} 
        />
        <Text style={styles.name}>{user.first_name} {user.last_name}</Text>
        <Text style={styles.username}>@{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <Animated.View 
          style={[
            styles.detailsContainer, 
            { opacity: shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }
          ]}
        >
          <Text style={styles.detailText}>ID: {user.id}</Text>
          <Text style={styles.detailText}>UID: {user.uid}</Text>
          <Text style={styles.detailText}>Password: {user.password}</Text>
        </Animated.View>
      </Animated.View>

      <View style={styles.buttonContainer}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            onPress={() => { handlePrevious(); animateButton(); }}
            disabled={currentIndex === 0}
            style={[styles.button, currentIndex === 0 && styles.disabledButton]}>
            <Text style={styles.buttonText}>◀ Previous</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            onPress={() => { handleNext(); animateButton(); }}
            disabled={currentIndex === users.length - 1}
            style={[styles.button, currentIndex === users.length - 1 && styles.disabledButton]}>
            <Text style={styles.buttonText}>Next ▶</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E1E2C",
    padding: 20,
  },
  card: {
    backgroundColor: "#2C2F4A",
    padding: 25,
    borderRadius: 20,
    width: "90%",
    alignItems: "center",
    shadowColor: "#FFD700",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 15,
    borderWidth: 4,
    borderColor: "#FFD700",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFD700",
  },
  username: {
    fontSize: 18,
    color: "#E3F2FD",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#8AC6D1",
    marginBottom: 15,
  },
  detailsContainer: {
    backgroundColor: "#37474F",
    padding: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  detailText: {
    fontSize: 16,
    color: "#E3F2FD",
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "80%",
    marginTop: 20,
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#FFD700",
  },
  buttonText: {
    color: "#1E1E2C",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#B0BEC5",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});

export default UserScreen;
