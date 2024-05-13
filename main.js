import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [image, setImage] = useState(null);
  const [search, setSearch] = useState('');
  const [shoppingList, setShoppingList] = useState([]); // New state for shopping list


  // Fetch recipes on app load
  useEffect(() => {
    loadRecipes();
  }, []);

   // Load recipes from AsyncStorage
   const loadRecipes = async () => {
    try {
      const storedRecipes = await AsyncStorage.getItem('recipes');
      if (storedRecipes) {
        setRecipes(JSON.parse(storedRecipes));
      }
    } catch (error) {
      console.error('Failed to load recipes:', error);
    }
  };

  
  // Save recipes to AsyncStorage
  const saveRecipes = async (updatedRecipes) => {
    try {
      await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));
      setRecipes(updatedRecipes);
    } catch (error) {
      console.error('Failed to save recipes:', error);
    }
  };

   // Add a new recipe
   const addRecipe = () => {
    if (!title || !ingredients || !steps) {
      Alert.alert('Error', 'Please fill all fields!');
      return;
    }
    const newRecipe = { id: Date.now().toString(), title, ingredients, steps, image };
    const updatedRecipes = [...recipes, newRecipe];
    saveRecipes(updatedRecipes);

     // Clear inputs
     setTitle('');
     setIngredients('');
     setSteps('');
     setImage(null);
   };

   // Delete a recipe
  const deleteRecipe = (id) => {
    const updatedRecipes = recipes.filter((recipe) => recipe.id !== id);
    saveRecipes(updatedRecipes);
  };

  // Pick an image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    };
  
     // Add ingredients to shopping list
     const addToShoppingList = (ingredients) => {
      const newItems = ingredients.split(',').map((item) => item.trim());
      setShoppingList((prevList) => [...prevList, ...newItems]);
      Alert.alert('Success', 'Ingredients added to shopping list!');
    };
  
    // Clear the shopping list
   const clearShoppingList = () => {
    setShoppingList([]);
    Alert.alert('Success', 'Shopping list cleared!');
  };

  // Filter recipes based on the search query
  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(search.toLowerCase()) ||
      recipe.ingredients.toLowerCase().includes(search.toLowerCase())
  );
}