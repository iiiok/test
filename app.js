import React from 'react';
import { Image, StyleSheet, Text, View ,TouchableOpacity,ScrollView,TextInput,Button,Alert,ActivityIndicator, } from 'react-native';
import logo from './assets/B1BKU1IJ54GI0096.jpg'; 
import myIcon from './assets/icon.png'; 
import * as ImagePicker from 'expo-image-picker';
import AwesomeButton from "react-native-really-awesome-button";

export default function App() {
  const _onPressButton =() =>{
    Alert.alert('You tapped the button!')
  };

  const [selectedImage, setSelectedImage] = React.useState(null);
  let output ;

  const openImagePickerAsync = async () => {
    // output = (<Text>yes</Text>);
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    // console.log(pickerResult);
    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage({ localUri: pickerResult.uri });

  }
  if (selectedImage !== null) {
    console.log("selectedImage !== null");
    // output = (<Image source={img2} style={{ width: 305, height: 459 }} />);
    output = (
        <Image
          source={{ uri: selectedImage.localUri }}
          style={{ width: 305, height: 259 }}
        />
    );
  }

  return (
    <View style={styles.container}>
      <Text  style={styles.redText}>It works!</Text>
      <ScrollView>
      <Image source={logo} style={{ width: 305, height: 459 }} /> 

      {/* <Text style={{color: '#888', fontSize: 38}}>It also works!</Text> */}
      {output}
      <TouchableOpacity
        onPress={openImagePickerAsync}
        // onPress={() => alert('Hello, world!')}
        style={{ backgroundColor: 'blue' }}>
        <Text style={{ fontSize: 20, color: '#fff' }}>Pick photo la</Text>
      </TouchableOpacity>
      <View style={styles.alternativeLayoutButtonContainer}>
          <Button
            onPress={_onPressButton}
            title="This looks great!"
          />
          <Button
            onPress={_onPressButton}
            title="OK!"
            color="#841584"
          />
        </View>
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1
        }}
        defaultValue="You can type"
      />
    </ScrollView>
    <AwesomeButton>
      <Image source={myIcon} />
      <Text>Send it</Text>
    </AwesomeButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  redText:{
    color: "#948",
    fontSize: 40
  },
  alternativeLayoutButtonContainer: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
