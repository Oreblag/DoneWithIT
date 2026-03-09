import React from 'react';
import LottieView from 'lottie-react-native';
import { View } from 'react-native';
import loadingAni from '../assets/animations/loaderdot.json'

function TestScreen(props) {
    return (
            <LottieView 
                source={loadingAni}
                autoPlay
                style={{ width: 400, height: 300 }}
            />
    );
}

export default TestScreen;