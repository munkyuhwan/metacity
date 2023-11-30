import React, { useEffect, useState } from 'react'
import { 
    Animated,
    Easing,
    Image,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native'
import { TouchIcon } from '../../styles/main/topMenuStyle'
import { useDispatch, useSelector } from 'react-redux'
import { clickIcon } from '../../store/onClick'
import { setCartView } from '../../store/cart'
import styled, {css} from 'styled-components/native';
import { colorBlack, colorWhite } from '../../assets/colors/color'

const TopButton = (props) => {

    const dispatch = useDispatch();
    const {isOn} = useSelector((state)=>state.cartView);

    const onImage = props.onSource;
    const offImage = props.offSource;
    const isSlideMenu = props.isSlideMenu;

    const [onIconAnimation, setOnIconAnimation] = useState(new Animated.Value(1))
    const [offIconAnimation, setOffIconAnimation] = useState(new Animated.Value(0))

    const onChangeIcon = () =>{
        Animated.parallel([
            Animated.timing(onIconAnimation, {
                toValue:1,
                duration: 0,
                useNativeDriver:true,
            }),
            Animated.timing(offIconAnimation, {
                toValue:0,
                duration: 0,
                useNativeDriver:true,
            })
        ]).start();  
    }
    const offChangeIcon = () =>{
        Animated.parallel([
            Animated.timing(onIconAnimation, {
                toValue:0,
                duration: 0,
                useNativeDriver:true,
            }),
            Animated.timing(offIconAnimation, {
                toValue:1,
                duration: 0,
                useNativeDriver:true,
            })
        ]).start();  
    }
    const onIconClicked = () =>{
        dispatch(setCartView(!isOn))
    }
    useEffect(()=>{
        if(isOn==false) {
            onChangeIcon();  
        }else {
            offChangeIcon();  
        }
    },[isOn])

    return(
        <>
        <WrapperIcon>

            {!isOn &&
                <>
                    <TouchableWithoutFeedback onPress={()=>{ props.onPress(); if(isSlideMenu){onIconClicked();}  }}>
                        <View>
                            <Image source={onImage} resizeMode='contain' style={[{width:52,height:52},{marginLeft:12}]}  />    
                            <TextOff>{isSlideMenu?"장바구니":"주문내역"}</TextOff>
                        </View>
                    </TouchableWithoutFeedback>
                </>
            }
            {isOn &&
                <>
                    <TouchableWithoutFeedback  onPress={()=>{props.onPress(); if(isSlideMenu){onIconClicked();}  }}>
                        <View>
                            <Image source={offImage} resizeMode='contain'  style={[{width:52,height:52},{marginLeft:12} ]}  />
                            <TextOn>{isSlideMenu?"장바구니":"주문내역"}</TextOn>
                        </View>
                    </TouchableWithoutFeedback>
                </>
            }
        </WrapperIcon>
        
        </>
    )
}
const fontSize = 20;
const WrapperIcon = styled.View`

`
const TextOn = styled.Text`
    fontSize:${fontSize}px;
    color:${colorBlack};
    fontWeight:bold;
    marginLeft:7px;
`
const TextOff = styled.Text`
    fontSize:${fontSize}px;
    color:${colorWhite};
    fontWeight:bold;
    marginLeft:7px;
`

export default TopButton;
