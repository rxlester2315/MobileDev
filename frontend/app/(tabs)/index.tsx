import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TextInput, Button, Modal } from 'react-native';
// Replace with your Mac's IP Address
const IP_ADDRESS = "192.168.55.135"; 
const API_URL = `http://${IP_ADDRESS}:8000/api/posts`;


export default function HomeScreen() {
  // All states MUST be inside the function
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // 1. The "Messenger" Function (The POST logic)
  const sendPostToBackend = () => {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newPost }) // Packing the data
    })
    .then(res => res.json())
    .then(savedPost => {
      // Logic: Take the old data list and add the new post to the end
      setData([...data, savedPost]); 
      setNewPost(""); // Clear the text box
    })
    .catch(err => console.error("Send Error:", err));
  };

  const deletePost = (id: number) => {
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    })
    .then(() => {
      const updatedData = data.filter((item: any) => item.id !== id);
      setData(updatedData);
    })
    .catch(err => console.error("Delete Error:", err));
  };

  const openEditModal = (post:any) => {
    setCurrentPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setIsModalVisible(true);
  };

  const closeEditModal = () => {
    setIsModalVisible(false);
    setCurrentPost(null);
  };



  const updatePost = (id:number, editTitle:string, editContent:string) => {
    fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        title: editTitle ,
        content: editContent
      
      })
    })
    .then(res => res.json())
    .then(updatedPost => {
      const updatedData = data.map((item: any) => item.id === id ? updatedPost : item);
      setData(updatedData);
    })
    .catch(err => console.error("Update Error:", err)); 
  
  };

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF2D20" />
      ) : (
        <View style={{ width: '100%', padding: 20 }}>
          
          <TextInput 
            style={styles.input} 
            placeholder="Type a new title..."
            value={newPost}
            onChangeText={setNewPost} 
          />
          <Button title="Send to Laravel" onPress={sendPostToBackend} />

          {data && data.map((item: any) => (
            <View key={item.id.toString()} style={styles.card}> 
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.content}>{item.content}</Text>
              
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                <Button title="Edit" onPress={() => openEditModal(item)} />
                <Button title="Delete" color='red' onPress={() => deletePost(item.id)} />
              </View>
            </View>
          ))}

          <Modal visible={isModalVisible} animationType="slide">
            <View style={styles.container}>
              <View style={{ width: '90%', padding: 20 }}>
                <Text style={styles.title}>Edit Your Post</Text>
                
                <TextInput 
                  style={styles.input} 
                  value={editTitle} 
                  onChangeText={setEditTitle} 
                />
                
                <TextInput 
                  style={styles.input} 
                  value={editContent} 
                  onChangeText={setEditContent} 
                />

                <Button title="Save Changes" onPress={() => {
                   updatePost(currentPost.id, editTitle, editContent);
                   setIsModalVisible(false);
                }} />
                
                <View style={{ marginTop: 10 }}>
                  <Button title="Close" color="red" onPress={closeEditModal} />
                </View>
              </View>
            </View>
          </Modal>

        </View>
      )}
    </View>
  );


}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  card: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
    width: '100%',
  },
  
  content: {
    fontSize: 16,
    color: '#666',
  },
});