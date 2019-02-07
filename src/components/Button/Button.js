import React from 'react';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import './Button.css'

const Button = (props) => (

        <AwesomeButton action={() => props.updateData()} type="primary">Upload Now</AwesomeButton>

)

export default Button