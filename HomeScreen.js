import * as WebBrowser from 'expo-web-browser';
// import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {
	Image,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Button,
	TextInput,
	Alert,
	FlatList,
	SafeAreaView,
	AsyncStorage
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import * as ImagePicker from 'expo-image-picker';

function Item({ item }) {
	const { name, phone, image } = item;
	return (
		<View
			style={{
				// flex: 1,
				flexDirection: 'row',
				// justifyContent: 'space-around',
				// alignItems: 'center',
				// backgroundColor: 'pink',
				width: 150,
				height: 50,
				margin: 5
			}}
		>
			<Image source={{ uri: JSON.parse(image) }} style={styles.profile} />
			<View>
				<Text>姓名： {name}</Text>
				<Text />

				<Text>电话： {phone}</Text>
			</View>
		</View>
	);
}

export default function HomeScreen() {
	const [ inputName, setInputName ] = useState('');
	const [ inputPhone, setInputPhone ] = useState('');
	const [ selectedImage, setSelectedImage ] = React.useState({ localUri: null });
	const [ list, setList ] = useState(null);

	// const onclearInput = () => {
	// 	setSelectedImage({ localUri: null });
	// 	setUserName('');
	// };

	//保存数据
	function save() {
		//设置多项
		var keyValuePairs = [
			[ 'name', inputName ],
			[ 'phone', inputPhone ],
			[ 'image', JSON.stringify(selectedImage.localUri) ]
		];
		console.log('object', keyValuePairs);
		AsyncStorage.multiSet(keyValuePairs, function(errs) {
			if (errs) {
				//TODO：存储出错
				return;
			}
			alert('数据保存成功!');
		});
	}

	//清除数据
	function clear() {
		AsyncStorage.clear(function(err) {
			if (!err) {
				setInputName('');
				setInputPhone('');
				alert('存储的数据已清除完毕!');
			}
		});
	}

	useEffect(() => {
		//需要查询的键值
		var keys = [ 'name', 'phone', 'image' ];
		//根据键数组查询保存的键值对
		AsyncStorage.multiGet(keys, function(errs, result) {
			//如果发生错误，这里直接返回（return）防止进入下面的逻辑
			if (errs) {
				return;
			}

			//  得到的结果是二维数组（result[i][0]表示我们存储的键，result[i][1]表示我们存储的值）
			setList([
				{
					name: result[0][1] != null ? result[0][1] : '',
					phone: result[1][1] != null ? result[1][1] : '',
					image: result[2][1] != null ? result[2][1] : ''
				}
			]);
			// console.dir(JSON.stringify(result[2][1]));
		});
	}, [list]);

	const openImagePickerAsync = async () => {
		let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

		if (permissionResult.granted === false) {
			alert('Permission to access camera roll is required!');
			return;
		}
		if (pickerResult.cancelled === true) {
			return;
		}

		let pickerResult = await ImagePicker.launchImageLibraryAsync();
		setSelectedImage({ localUri: pickerResult.uri });
		console.log(pickerResult);
	};
	return (
		<View style={styles.container}>
			<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
				<View style={styles.flex}>
					{list && (
						<FlatList
							data={list}
							renderItem={({ item }) => <Item item={item} />}
							// keyExtractor={item => item.name}
						/>
					)}
				</View>
				<View style={styles.flex}>
					<View style={styles.row}>
						<View style={styles.head}>
							<Text style={styles.label}>姓名 </Text>
						</View>
						<View style={styles.flex}>
							<TextInput
								style={styles.input}
								value={inputName}
								onChangeText={(inputName) => setInputName(inputName)}
							/>
						</View>
					</View>
					<View style={styles.row}>
						<View style={styles.head}>
							<Text style={styles.label}>电话</Text>
						</View>
						<View style={styles.flex}>
							<TextInput
								style={styles.input}
								value={inputPhone}
								onChangeText={(inputPhone) => setInputPhone(inputPhone)}
							/>
						</View>
					</View>
				</View>
				{/* <Text style={styles.btn}>{JSON.stringify(list)}</Text> */}

				<View style={styles.getStartedContainer}>
					<Text style={styles.getStartedText}>Upload you image:</Text>
				</View>

				<View style={styles.helpContainer}>
					<TouchableOpacity onPress={openImagePickerAsync} style={styles.helpLink}>
						{selectedImage.localUri === null ? (
							<View style={styles.helpContainer}>
								<Image source={require('../assets/images/splash.png')} style={styles.welcomeImage} />
								<Text style={styles.getStartedText}>{selectedImage.localUri}</Text>
							</View>
						) : (
							<View style={styles.helpContainer}>
								<Image source={{ uri: selectedImage.localUri }} style={styles.welcomeImage} />
								<Text style={styles.getStartedText}>Uploaded</Text>
							</View>
						)}
					</TouchableOpacity>
				</View>
			</ScrollView>
			<View style={styles.row}>
				<Text style={styles.btn} onPress={save}>
					保存
				</Text>
				<Text style={styles.btn} onPress={clear}>
					清除
				</Text>
			</View>
		</View>
	);
}

HomeScreen.navigationOptions = {
	header: null
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	developmentModeText: {
		marginBottom: 20,
		color: 'rgba(0,0,0,0.4)',
		fontSize: 14,
		lineHeight: 19,
		textAlign: 'center'
	},
	contentContainer: {
		paddingTop: 30
	},
	welcomeContainer: {
		alignItems: 'center',
		marginTop: 10,
		marginBottom: 20
	},
	welcomeImage: {
		width: 300,
		height: 300,
		resizeMode: 'contain',
		marginTop: 3
	},
	profile: {
		width: 100,
		height: 100,
		resizeMode: 'contain',
		marginRight: 10
	},
	getStartedContainer: {
		alignItems: 'center',
		marginHorizontal: 50
	},
	homeScreenFilename: {
		marginVertical: 7
	},
	codeHighlightText: {
		color: 'rgba(96,100,109, 0.8)'
	},
	codeHighlightContainer: {
		backgroundColor: 'rgba(0,0,0,0.05)',
		borderRadius: 3,
		paddingHorizontal: 4
	},
	getStartedText: {
		fontSize: 17,
		color: 'rgba(96,100,109, 1)',
		lineHeight: 24,
		textAlign: 'center'
	},
	tabBarInfoContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		...Platform.select({
			ios: {
				shadowColor: 'black',
				shadowOffset: { width: 0, height: -3 },
				shadowOpacity: 0.1,
				shadowRadius: 3
			},
			android: {
				elevation: 20
			}
		}),
		alignItems: 'center',
		backgroundColor: '#fbfbfb',
		paddingVertical: 20
	},
	tabBarInfoText: {
		fontSize: 17,
		color: 'rgba(96,100,109, 1)',
		textAlign: 'center'
	},
	navigationFilename: {
		marginTop: 5
	},
	helpContainer: {
		marginTop: 15,
		alignItems: 'center'
	},
	helpLink: {
		paddingVertical: 15
	},
	uploadButton: {
		fontSize: 20,
		marginTop: 15,
		color: '#2e78b7',
		height: 30,
		margin: 20
	},
	flex: {
		flex: 1
	},
	topStatus: {
		marginTop: 25
	},
	row: {
		flexDirection: 'row',
		height: 45,
		marginBottom: 10
	},
	head: {
		width: 70,
		marginLeft: 5,
		backgroundColor: '#23BEFF',
		height: 45,
		justifyContent: 'center',
		alignItems: 'center'
	},
	label: {
		color: '#fff',
		fontSize: 15,
		fontWeight: 'bold'
	},
	input: {
		height: 45,
		borderWidth: 1,
		marginRight: 5,
		paddingLeft: 10,
		borderColor: '#ccc'
	},
	btn: {
		flex: 1,
		backgroundColor: '#FF7200',
		height: 45,
		textAlign: 'center',
		color: '#fff',
		marginLeft: 5,
		marginRight: 5,
		lineHeight: 45,
		fontSize: 15
	}
});
