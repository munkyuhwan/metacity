import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Image, KeyboardAvoidingView, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native'
import { LoginActionInputID, LoginActionInputPW, LoginActionSubtitle, LoginActionTitle, LoginActionWrapper, LoginBtnIcon, LoginBtnText, LoginBtnWrapper, LoginLogo, LoginMainWrapper } from '../styles/login/loginStyle'
import { ADOrderBtnIcon, ADOrderBtnText, ADOrderBtnWrapper, ADWrapper, SwiperImage, SwiperScroll, SwiperVideo } from '../styles/ad/adStyle';
import { useDispatch, useSelector } from 'react-redux';
import { LANGUAGE } from '../resources/strings';
import Video from "react-native-video";
import SwipeRender from "react-native-swipe-render";
import Swiper from 'react-native-swiper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { TableName, TableNameBig, TableNameSmall } from '../styles/main/topMenuStyle';
import { getAD } from '../store/ad';
import { ADMIN_BANNER_DIR } from '../resources/apiResources';
import {isEmpty} from 'lodash';

const ADScreen = () =>{
    let adInterval;
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const {language} = useSelector(state=>state.languages);
    const {adList} = useSelector(state=>state.ads);
    const {tableInfo} = useSelector(state=>state.tableInfo);
    // 영상 플레이, 스톱
    const [videoIndex, setVideoIndex] = useState(0);
    const [adIndex, setAdIndex] = useState();
    const [displayUrl, setDisplayUrl] = useState("");

    const swiperRef = useRef(); 
    const onSwipe = (index) =>{
        setVideoIndex(index)
    }

    useEffect(()=>{
        if(isEmpty(adList)) {
            dispatch(getAD()); 
        }
    },[adList])

    useFocusEffect(useCallback(()=>{
        setTimeout(()=>{
            console.log("settimeout!!!!!!");
            let tmpIndex = adIndex;
            if(!tmpIndex) tmpIndex=0;
            let indexToSet = tmpIndex +1;
            if(indexToSet>=adList.length) {
                indexToSet = 0;
            }
            setAdIndex(indexToSet);
            console.log("indexToSet: ",indexToSet," adlist: ",adList[tmpIndex]);
            if(adList[tmpIndex]?.img_chg){
                console.log("img: ",ADMIN_BANNER_DIR+adList[tmpIndex].img_chg);
                setDisplayUrl(ADMIN_BANNER_DIR+adList[tmpIndex].img_chg)
            }
        },10000)
    },[adIndex]))

    /* 
    const AdLayer  = (index) =>{
        const uri = ADMIN_BANNER_DIR+adList[index].img_chg;
        console.log("AdLayer: ",uri)
         
        if (uri.includes(".mp4")) {
            return(
                <>
                    <SwiperVideo
                        key={index}
                        source={{uri: uri}} 
                        paused={videoIndex!=index}
                        repeat={true}
                    />
                </>
            )
        }else {
            return(
                <>
                    <SwiperImage
                        key={index}
                        source={{ uri: uri }}
                    />
                </>
            )
        }
    }
    */
    return(
        <>
            <ADWrapper>
                <View style={{position:'absolute', right:158}}>
                    <TableName>
                        <TableNameBig>{tableInfo?.TBL_NAME}</TableNameBig>
                    </TableName>
                </View>
                {displayUrl.includes('mp4') &&
                    <SwiperVideo
                        key={"aa"}
                        source={{uri: displayUrl}} 
                        paused={false}
                        repeat={true}
                    />
                }
                {!displayUrl.includes('mp4') &&
                    <>
                    <SwiperImage
                        key={"imageswipe"}
                        source={{ uri: displayUrl }}
                    />
                </>
                }
                 {/*    <SwiperVideo
                        key={"aa"}
                        source={{uri: "https://wooriorder.co.kr/smartro/upload_file/banner/1690442236-ehwgi.mp4"}} 
                        paused={false}
                        repeat={true}
                    /> */}
                {/*
                    adList.map((el,index)=>{
                        const uri = ADMIN_BANNER_DIR+el.img_chg;
      
                    })

                *?}
                {/* <Swiper  
                    ref={swiperRef}
                    showsButtons={false}
                    autoplay={true}
                    autoplayTimeout={5}
                    loop={true}
                    scrollEnabled={false}
                    activeDot={<></>}
                    dot={<></>}
                    onIndexChanged={(index)=>{ onSwipe(index); }}
                >
                    {!isEmpty(adList) &&
                        adList.map((el,index)=>{
                            const uri = ADMIN_BANNER_DIR+el.img_chg;
                            //const uri = el.img_chg;
                            console.log(uri)
                            
                            if(uri.includes(".mp4")) {
                                return(
                                    <>
                                        <SwiperVideo
                                            key={index}
                                            source={{uri: uri}} 
                                            paused={videoIndex!=index}
                                            repeat={true}
                                        />
                                    </>
                                )
                            }else {
                                return(
                                    <>
                                        <SwiperImage
                                            key={index}
                                            source={{ uri: uri }}
                                        />
                                    </>
                                )
                            }
                            
                            
                        })
                    }
                </Swiper> */}
                <TouchableWithoutFeedback onPress={()=>{navigation.navigate("main")}}>
                    <ADOrderBtnWrapper>
                        <ADOrderBtnText>주문하기</ADOrderBtnText>
                        <ADOrderBtnIcon source={require("../assets/icons/folk_nife.png")} />
                    </ADOrderBtnWrapper>
                </TouchableWithoutFeedback>
            </ADWrapper>
        </>
    )
}
export default ADScreen