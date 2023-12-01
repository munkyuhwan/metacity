import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NavigationContainer, useFocusEffect, useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import MainScreen from '../screens/MainScreen'
import Header from '../components/common/headerComponent'
import PopUp from '../components/common/popup'
import TransparentPopUp from '../components/common/transparentPopup'
import LoginScreen from '../screens/LoginScreen'
import ADScreen from '../screens/ADScreen'
import WaitIndicator from '../components/common/waitIndicator'
import { DeviceEventEmitter, Text, View } from 'react-native'
import PopupIndicator from '../components/common/popupIndicator'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminCategoryData, getMainCategories, getSubCategories, setSelectedMainCategory, setSelectedSubCategory } from '../store/categories'
import FullSizePopup from '../components/common/fullsizePopup'
import ErrorPopup from '../components/common/errorPopup'
import { getMenuState } from '../store/menu'
import _ from 'lodash';
import { getTableList, getTableStatus, initTableInfo } from '../store/tableInfo'
import { EventRegister } from 'react-native-event-listeners'
import {isEmpty} from 'lodash';
import StatusScreen from '../screens/StatusScreen'
import { initOrderList } from '../store/order'
import { DEFAULT_TABLE_STATUS_UPDATE_TIME } from '../resources/defaults'
import { getAdminMenuItems } from '../store/menuExtra'

const Stack = createStackNavigator()

export default function Navigation() {
    var statusInterval;
    const dispatch = useDispatch();
    const [spinnerText, setSpinnerText] = React.useState("")
    const {tableList, tableInfo, tableStatus} = useSelector(state=>state.tableInfo);
    const navigate = useRef();
    const handleEventListener = () => {
        //리스너 중복방지를 위해 한번 삭제
        DeviceEventEmitter.removeAllListeners("onPending");
        DeviceEventEmitter.removeAllListeners("onComplete");
        EventRegister.removeAllListeners("showSpinner");

        // 결제진행중 팝업
        DeviceEventEmitter.addListener("onPending",(ev)=>{
            const pendingEvent = JSON.parse(ev.event)
            setSpinnerText(pendingEvent?.description)
        })
        DeviceEventEmitter.addListener("onComplete",(ev)=>{
            setSpinnerText("")
        })
        EventRegister.addEventListener("showSpinner",(data)=>{            
            if(data?.isSpinnerShow) { 
                setSpinnerText(data?.msg)
            }else {
                setSpinnerText("");
            }
        })
    }

    useEffect(()=>{
        if(!isEmpty(tableStatus)) {
            const statusValue = tableStatus?.status;
            switch (statusValue) {
                case "1":
                    // 판매중

                break;
                case "2":
                    // 준비중
                    dispatch(initOrderList());
                    navigate?.current.navigate("status");
                break;
                case "3":
                    // 강제 판매중
                    //dispatch(initOrderList());
                    //navigate?.current.navigate("status");
                break;
                case "4":
                    // 예약중
                    dispatch(initOrderList());
                    navigate?.current.navigate("status");
                break;
                default:

                break;
            }
        }
    },[tableStatus])
    useEffect(()=>{
        //if(!isEmpty(tableInfo)) { 
            // 주석 나중에 빼자
            statusInterval = setInterval(() => {
                //console.log("status interval")
                dispatch(getTableStatus());
            }, DEFAULT_TABLE_STATUS_UPDATE_TIME);
        //}
    },[])

    useEffect(()=>{
        // 초기 세팅
        handleEventListener();
        // 포스 메인 카테고리
        dispatch(getMainCategories());
        // 관리자 카테고리 추가 정보
        dispatch(getAdminCategoryData());
        // 관리자 메뉴 정보 받아오기;
        dispatch(getAdminMenuItems());
        /*
        dispatch(getMenuEdit());
        dispatch(initTableInfo());
        var getInterval = setTimeout(() => {
            dispatch(getTableList());
            clearTimeout(getInterval);
        }, 1000);
 
        // 메뉴 갱신을 위한 함수 실행 한시간에 한번
        setInterval(()=>{
           dispatch(getMenuState());
        },1000*60*60)
        */
        
    },[])

    return (
        <>  
            <NavigationContainer
                ref={navigate}
            >
                <Stack.Navigator
                    initialRouteName='main'
                    screenOptions={{
                        gestureEnabled: true,
                        headerShown: false,
                    }}
                >
                    <Stack.Screen
                        name='main'
                        component={MainScreen}
                        options={{title:"Main Screen"}}
                    />
                    <Stack.Screen
                        name='login'
                        component={LoginScreen}
                        options={{title:"Login screen"}}
                    />
                    <Stack.Screen
                        name='ad'
                        component={ADScreen}
                        options={{title:"AD screen"}}
                    />
                    <Stack.Screen
                        name='status'
                        component={StatusScreen}
                        options={{title:"Status Screen"}}
                    />
                </Stack.Navigator>
            </NavigationContainer>
            <PopUp/>
            <TransparentPopUp/>
            <FullSizePopup/>
            {(spinnerText!="")&&
                <PopupIndicator text={spinnerText} />
            }
        </>
    )
}
