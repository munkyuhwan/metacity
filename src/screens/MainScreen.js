import React, { useEffect, useState } from 'react'
import {View, NativeModules, DeviceEventEmitter, KeyboardAvoidingView} from 'react-native'
import SideMenu from '../components/main/sideMenu'
import TopMenu from '../components/main/topMenu'
import { MainWrapper, WholeWrapper } from '../styles/main/mainStyle'
import CartView from '../components/main/cartView'
import { SCREEN_TIMEOUT } from '../resources/numberValues'
import MenuListView from '../components/main/menuListView'
import ItemDetail from '../components/detailComponents/itemDetail'
import PopUp from '../components/common/popup'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import LogWriter from '../utils/logWriter'
import { getTableList, getTableStatus } from '../store/tableInfo'
import { openPopup } from '../utils/common'
import RNFS from "react-native-fs";
import { setLanguage } from '../store/languages'
import { DEFAULT_TABLE_STATUS_UPDATE_TIME } from '../resources/defaults'
import {isEmpty} from 'lodash';

const MainScreen = () =>{   
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const {tableList, tableInfo, tableStatus} = useSelector(state=>state.tableInfo);
    useEffect(()=>{
      dispatch(setLanguage("korean"));  
    },[])

   
/* 
    var path = RNFS.DownloadDirectoryPath + '/test.txt';
    RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')
    .then((success) => {
      console.log('FILE WRITTEN!');
    })
    .catch((err) => {
      console.log(err.message);
    }); 
   */

     
    let timeoutSet = null
    function screenTimeOut(){
        if(timeoutSet!=null){clearInterval(timeoutSet);}
            timeoutSet = setInterval(()=>{
            navigation.navigate('ad');
            clearInterval(timeoutSet);
        },SCREEN_TIMEOUT)
    } 
    return(
        <>
            <KeyboardAvoidingView behavior="padding" enabled style={{width:'100%', height:'100%'}} >
                <WholeWrapper onTouchStart={()=>{  /* screenTimeOut(); */  }} >
                    <SideMenu/>
                    <MainWrapper>
                        <TopMenu/>
                        <MenuListView/>
                        <CartView/>
                    </MainWrapper>
                </WholeWrapper> 
            </KeyboardAvoidingView>
        </>
    )
}

export default MainScreen