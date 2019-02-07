import React from 'react';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import './Button.css'

const ButtonDisabled = (props) => (
        <AwesomeButton action={() => props.updateData()} type="primary" disabled={true}>Upload Now</AwesomeButton>
)

export default ButtonDisabled