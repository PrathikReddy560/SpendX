import React, { useState } from 'react';
import { StyleSheet, View, Alert, Image, ScrollView } from 'react-native';
import { Provider as PaperProvider, Text, TextInput, Button, Card, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

// ⚠️ REPLACE THIS WITH YOUR PC's IP ADDRESS
const API_URL = 'http://192.168.1.5:8000'; 

export default function App() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [image, setImage] = useState(null);

  // --- 1. Text Logic ---
  const handleAIParse = async () => {
    if (!text) return;
    setLoading(true);
    setAiResult(null);
    try {
      const response = await axios.post(`${API_URL}/parse-text`, { text });
      setAiResult(response.data);
    } catch (error) {
      Alert.alert("Error", "Is your Backend running? Check IP.");
      console.error(error);
    }
    setLoading(false);
  };

  // --- 2. Image Logic (NEW!) ---
  const pickImage = async () => {
    // Ask for permission
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    setLoading(true);
    setAiResult(null);
    
    // Prepare the file for upload
    let formData = new FormData();
    formData.append('file', {
      uri: uri,
      name: 'receipt.jpg',
      type: 'image/jpeg',
    });

    try {
      // Send to your Python Backend
      const response = await axios.post(`${API_URL}/scan-bill`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAiResult(response.data);
    } catch (error) {
      Alert.alert("Upload Failed", "Could not analyze receipt.");
      console.error(error);
    }
    setLoading(false);
  };

  // --- 3. Save Logic ---
  const handleSave = async () => {
    try {
        await axios.post(`${API_URL}/add-expense`, aiResult);
        Alert.alert("Success", "Saved to Database! 🎉");
        setAiResult(null);
        setText('');
        setImage(null);
    } catch (error) {
        Alert.alert("Error", "Save failed");
    }
  };

  return (
    <PaperProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>SpendX Mobile 📱</Text>
        
        {/* INPUT CARD */}
        <Card style={styles.card}>
            <Card.Content>
                {/* Text Input */}
                <TextInput
                    label="Type expense..."
                    placeholder="e.g. Pizza 500"
                    value={text}
                    onChangeText={setText}
                    mode="outlined"
                    right={<TextInput.Icon icon="send" onPress={handleAIParse}/>}
                    style={{marginBottom: 15}}
                />
                
                <Text style={{textAlign:'center', marginBottom:10, color:'#888'}}>- OR -</Text>

                {/* Image Button */}
                <Button 
                    mode="contained-tonal" 
                    icon="camera" 
                    onPress={pickImage}
                >
                    Upload Bill Photo
                </Button>

                {/* Image Preview */}
                {image && <Image source={{ uri: image }} style={styles.previewImage} />}
            </Card.Content>
        </Card>

        {/* LOADING SPINNER */}
        {loading && <ActivityIndicator animating={true} size="large" style={{marginTop:20}} />}

        {/* RESULT CARD (Only shows when AI is done) */}
        {aiResult && !loading && (
            <Card style={[styles.card, {marginTop: 20, backgroundColor: '#e8f5e9', borderColor: '#4caf50', borderWidth:1}]}>
                <Card.Content>
                    <Text variant="titleMedium" style={{fontWeight:'bold', color:'#2e7d32'}}>Gemini Analysis:</Text>
                    <View style={styles.resultRow}>
                        <Text>📌 Category:</Text>
                        <Text style={{fontWeight:'bold'}}>{aiResult.category}</Text>
                    </View>
                    <View style={styles.resultRow}>
                        <Text>💰 Amount:</Text>
                        <Text style={{fontWeight:'bold', fontSize:18}}>₹{aiResult.amount}</Text>
                    </View>
                    <View style={styles.resultRow}>
                        <Text>📝 Desc:</Text>
                        <Text style={{fontWeight:'bold'}}>{aiResult.description}</Text>
                    </View>
                    
                    <Button 
                        mode="contained" 
                        onPress={handleSave} 
                        style={{marginTop: 15, backgroundColor: '#2e7d32'}}
                    >
                        Confirm & Save
                    </Button>
                </Card.Content>
            </Card>
        )}
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  card: {
    padding: 5,
    borderRadius: 15,
    elevation: 4,
    backgroundColor: 'white'
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginTop: 15,
    borderRadius: 10,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 4
  }
});