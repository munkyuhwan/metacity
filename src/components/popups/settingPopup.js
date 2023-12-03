import React, { useState, useEffect, useRef, version } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DetailSettingWrapper, PaymentTextInput, PaymentTextLabel, PaymentTextWrapper, SelectCancelText, SelectCancelWrapper, SelectWrapper, SelectWrapperColumn, SettingButtonText, SettingButtonWrapper, SettingConfirmBtn, SettingConfirmBtnText, SettingConfirmBtnWrapper, SettingItemWrapper, SettingScrollView, SettingWrapper, StoreIDTextInput, StoreIDTextLabel, TableColumnInput, TableColumnTitle, TableColumnWrapper } from '../../styles/common/settingStyle';
import { Alert, DeviceEventEmitter, KeyboardAvoidingView, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import { getLastPaymentData, indicateAvailableDeviceInfo, serviceFunction, serviceGetting, serviceIndicate, servicePayment, serviceSetting, startSmartroCheckIntegrity, startSmartroGetDeviceInfo, startSmartroGetDeviceSetting, startSmartroKeyTransfer, startSmartroReadCardInfo, startSmartroRequestPayment, startSmartroSetDeviceDefaultSetting, varivariTest } from '../../utils/smartro';
import CodePush from 'react-native-code-push';
import PopupIndicator from '../common/popupIndicator';
import { IndicatorWrapper, PopupIndicatorText, PopupIndicatorWrapper, PopupSpinner } from '../../styles/common/popupIndicatorStyle';
import { PopupCloseButton, PopupCloseButtonWrapper } from '../../styles/common/popup';
import { openFullSizePopup } from '../../utils/common';
import { Picker } from '@react-native-picker/picker';
import { clearTableInfo, getTableList, initTableInfo, setTableInfo } from '../../store/tableInfo';
import { SMARTRO_FUNCTION } from '../../resources/cardReaderConstant';
import { useSharedValue } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cancelOrder, checkTableOrder } from '../../utils/apis';
import { initOrderList } from '../../store/order';
import { setCartView } from '../../store/cart';

const SettingPopup = () =>{

    const dispatch = useDispatch();
    const pickerRef = useRef();
    const functionPickerRef = useRef();
    const functionTestPickerRef = useRef();
    const functionPaymentPickerRef = useRef();

    const [spinnerText, setSpinnerText] = React.useState("")
    const {tableList,tableInfo} = useSelector(state=>state.tableInfo);
    const [isTableSettingShow, setTableSettingShow] = useState(false);
    
    //const selectedFunction = useSharedValue("");
    //const selectedFunctionTest = useSharedValue("");
    const [selectedFunction, setSelectedFunction] = useState("");
    const [selectedFunctionTest, setSelectedFunctionTest] = useState("");
    const [paymentType, setPaymentType] = useState("");
    const paymentAmount = useSharedValue(0);
    const paymentApprovalNo = useSharedValue("");
    const paymentApprovalDate = useSharedValue("");
    const [lastPayData, setLastPayData] = useState("");
    // store id, service id
    const [ipText, setIpText] = useState("");
    const [tableNo, setTableNo] = useState("");


    const getIndicateAvailableDeviceInfo = () =>{
        serviceIndicate()
        .then((result)=>{
            const jsonResult=JSON.parse(result);
            displayOnAlert("사용가능 디바이스 정보",jsonResult);
        })
        .catch((error)=>{
            console.log("error: ",error)
        })
    }
    const smartroServiceSetting = () =>{
        serviceSetting()
        .then((result)=>{
            const jsonResult=JSON.parse(result);
            displayOnAlert("디바이스 설정",jsonResult);
        })
        .catch((error)=>{
            console.log("error: ",error)
        })
    }
    const smartroServiceGetting = () =>{
        serviceGetting()
        .then((result)=>{
            const jsonResult=JSON.parse(result);
            displayOnAlert("디바이스 설정값",jsonResult);
        })
        .catch((error)=>{
            console.log("error: ",error)
        })
    }
    const smartroServiceFunction = () => {
        const data = {};
        data[selectedFunction] = selectedFunctionTest;
        serviceFunction(data)
        .then((result)=>{
            const jsonResult=JSON.parse(result);
            displayOnAlert("서비스 기능",jsonResult);
        })
        .catch((error)=>{
            console.log("error: ",error)
        })
    }
    const smartroServicePayment = (paymentData) => {
        servicePayment(dispatch, paymentData)
        .then((result)=>{
            const jsonResult=JSON.parse(result);
            displayOnAlert("서비스 기능",jsonResult);
        })
        .catch((error)=>{
            console.log("error: ",error)
        })
    }
    const smartroGetLastPaymentData = () =>{
        getLastPaymentData(dispatch)
        .then((result)=>{
            const jsonResult=JSON.parse(result);
            const objKeys = Object.keys(jsonResult)
            var str = "";
            for(var i=0; i<objKeys.length; i++) {
                str += `${objKeys[i]}: ${jsonResult[objKeys[i]]}\n`;
            }
            setLastPayData(str);
        })
        .catch((error)=>{
            console.log("error: ",error)
        })
    }

    const uploadLog = () => {

    }
    const initTable = () => {
        AsyncStorage.removeItem("orderResult")
        AsyncStorage.getItem("orderResult").then(result=>console.log("Resutl: ",result))
    }

    // 여러가지 테스트
    const variousTest = () => {
        varivariTest()
        .then((result)=>{
            const jsonResult=JSON.parse(result);
            console.log(jsonResult);
            displayOnAlert("여러가지 결제 결과",jsonResult);
        })
        .catch((error)=>{
            console.log("error: ",error)
        })
    }

    const displayOnAlert = (title, jsonResult) => {
        const objKeys = Object.keys(jsonResult)
        var str = "";
        for(var i=0; i<objKeys.length; i++) {
            str += `${objKeys[i]}: ${jsonResult[objKeys[i]]}\n`;
        }
        Alert.alert(
            title,
            str,
            [{
                text:'확인',
            }]
        )
    }

    const checkUpdate =  async() =>{
            CodePush
            const update = await CodePush.checkForUpdate("73MTJE-Zu27E7cnvd0jdRVE66gkFu-zFUdZn-");
            if(update) {
                /* Alert.alert(
                    "업데이트",
                    "앱 업데이트가 있습니다.",
                    [{
                        text:'확인',
                    }]
                ) */
                update
                .download((progress)=>{
                    setSpinnerText("업데이트 중...",progress,"%");
                })
                .then((newPackage)=>{
                    setSpinnerText("");

                    newPackage
                    .install(CodePush.InstallMode.IMMEDIATE)
                    .then(()=>{CodePush.restartApp()});
                })

            }else {
                Alert.alert(
                    "업데이트",
                    "앱 업데이트가 없습니다.",
                    [{
                        text:'확인',
                    }]
                )
            } 
    } 
    function releaseTable() {
        dispatch(clearTableInfo());
    }

    const ServiceDropDown = () => {
        return (
            <SelectWrapper>
                <Picker
                    ref={functionPickerRef}
                    key={"functionPicker"}
                    mode='dialog'
                    onValueChange = {(itemValue, itemIndex) => {
                        //selectedFunction.value = itemValue;
                        setSelectedFunction(itemValue);
                    }}
                    selectedValue={selectedFunction}
                    style = {{
                        width: 200,
                        height: 50,
                        flex:1
                    }}>
                        <Picker.Item key={"none"} label = {"미선택"} value ={{}} />
                    {
                        SMARTRO_FUNCTION.map((el,index)=>{
                            return(
                                <Picker.Item key={index+"_"+el.key}  label = {el.label} value ={el.key} />
                            )
                        })
                    }
                </Picker>
                <Picker
                    ref={functionTestPickerRef}
                    key={"functionPicker2"}
                    mode='dialog'
                    onValueChange = {(itemValue, itemIndex) => {
                        //selectedFunctionTest.value = (itemValue);
                        console.log("itemValue: ",itemValue);
                        setSelectedFunctionTest(itemValue);
                    }}
                    selectedValue={selectedFunctionTest}
                    style = {{
                        width: 200,
                        height: 50,
                        flex:1
                    }}>
                        <Picker.Item key={"none"} label = {"미선택"} value ={{}} />
                    {
                        SMARTRO_FUNCTION.filter(el=>el.key==selectedFunction)[0]?.data?.map((el,index)=>{
                            return(
                                <Picker.Item key={index+"_"+el.value}  label = {el.label} value ={el.value} />
                            )
                        })
                    }
                </Picker>
                <TouchableWithoutFeedback onPress={()=>{smartroServiceFunction();}}>
                    <SelectCancelWrapper>
                        <SelectCancelText>확인</SelectCancelText>
                    </SelectCancelWrapper>
                </TouchableWithoutFeedback>
            </SelectWrapper>
        );
    }

    const Dropdown = () => {

        return (
            <SelectWrapper>
                <Picker
                    ref={pickerRef}
                    key={"tablePicker"}
                    mode='dialog'
                    onValueChange = {(itemValue, itemIndex) => {
                        dispatch(setTableInfo(itemValue))
                        AsyncStorage.removeItem("orderResult");
                        dispatch(initOrderList());
                        dispatch(setCartView(false));
                        displayOnAlert("수정되었습니다.",[]);

                    }}
                    selectedValue={tableInfo}
                    style = {{
                        width: 200,
                        height: 50,
                        flex:1
                    }}>
                        <Picker.Item key={"none"} label = {"미선택"} value ={{}} />
                    {tableList.map(el=>{
                        return(
                            <Picker.Item key={el.FLR_NAME+"_"+el.TBL_NAME}  label = {el.FLR_NAME+"층 "+el.TBL_NAME+"테이블"} value ={el} />
                        )
                    })
                    }
                </Picker>
                <TouchableWithoutFeedback onPress={()=>{releaseTable();}}>
                    <SelectCancelWrapper>
                        <SelectCancelText>해제</SelectCancelText>
                    </SelectCancelWrapper>
                </TouchableWithoutFeedback>
            </SelectWrapper>
        );
    };

    const PaymentDropdown = () => {
        return (
            <SelectWrapperColumn>
                <Picker
                    ref={functionPaymentPickerRef}
                    key={"paymentPicker"}
                    mode='dialog'
                    onValueChange = {(itemValue, itemIndex) => {
                        setPaymentType(itemValue);
                    }}
                    selectedValue={paymentType}
                    style = {{
                        width: 200,
                        height: 50,
                        flex:1
                    }}>
                    <Picker.Item key={"none"} label = {"미선택"} value ={{}} />
                    <Picker.Item key={"approval"} label = {"결제"} value ={"approval"} />
                    <Picker.Item key={"cancellation"} label = {"취소"} value ={"cancellation"} />
                </Picker>
                
                <PaymentTextWrapper>
                    <PaymentTextLabel>금액:</PaymentTextLabel>
                    <PaymentTextInput keyboardType='numeric' defaultValue={paymentAmount.value} onChangeText={(val)=>{paymentAmount.value=val; }} />
                </PaymentTextWrapper>
                {paymentType=="cancellation" &&
                    <>
                        <PaymentTextWrapper>
                            <PaymentTextLabel>승인번호:</PaymentTextLabel>
                            <PaymentTextInput keyboardType='numeric' defaultValue={paymentApprovalNo.value} onChangeText={(val)=>{paymentApprovalNo.value=val;}} />
                        </PaymentTextWrapper>
                        <PaymentTextWrapper>
                            <PaymentTextLabel>승인일자(YYMMDD):</PaymentTextLabel>
                            <PaymentTextInput keyboardType='numeric' maxLength={6} defaultValue={paymentApprovalDate.value}  onChangeText={(val)=>{paymentApprovalDate.value=val}} />
                        </PaymentTextWrapper>
                    </>
                }
                <TouchableWithoutFeedback onPress={()=>{
                    if(paymentType == "approval") {
                        smartroServicePayment({"deal":paymentType,"total-amount":paymentAmount.value});
                    }
                    else if(paymentType == "cancellation"){
                        smartroServicePayment({"deal":paymentType,"total-amount":paymentAmount.value,"approval-no":paymentApprovalNo.value,"approval-date":paymentApprovalDate.value});
                    }
                    
                    }}>
                    <SelectCancelWrapper>
                        <SelectCancelText>실행</SelectCancelText>
                    </SelectCancelWrapper>
                </TouchableWithoutFeedback>
                <PaymentTextWrapper>
                    <PaymentTextLabel>{lastPayData}</PaymentTextLabel>
                </PaymentTextWrapper>
                <TouchableWithoutFeedback onPress={()=>{smartroGetLastPaymentData();}}>
                    <SelectCancelWrapper>
                        <SelectCancelText>마지막 결제 정보</SelectCancelText>
                    </SelectCancelWrapper>
                </TouchableWithoutFeedback>
            </SelectWrapperColumn>
        );
    }

    useEffect(()=>{
        AsyncStorage.getItem("POS_IP")
        .then((value)=>{
            setIpText(value)
        })
        AsyncStorage.getItem("TABLE_INFO")
        .then((value)=>{
            setTableNo(value)
        })
    },[])

    const setStoreInfo = () =>{
        AsyncStorage.setItem("POS_IP", ipText);   
        displayOnAlert("설정되었습니다.",{});
    }

    const setTableInfo = () =>{
        AsyncStorage.setItem("TABLE_INFO", tableNo);   
        displayOnAlert("테이블이 설정되었습니다.",{});
    }
    return (
        <>
            <KeyboardAvoidingView behavior="padding" enabled style={{width:'100%', height:'100%'}} >
                <SettingWrapper>
                    <TouchableWithoutFeedback onPress={()=>{ openFullSizePopup(dispatch,{innerFullView:"", isFullPopupVisible:false}); }}>
                            <PopupCloseButtonWrapper>
                                <PopupCloseButton source={require('../../assets/icons/close_red.png')}/>
                            </PopupCloseButtonWrapper>
                    </TouchableWithoutFeedback>
                    <SettingScrollView showsVerticalScrollIndicator={false}>
                        <SettingButtonWrapper>
                            { 
                            <SettingItemWrapper>
                                <TouchableWithoutFeedback onPress={()=>{ }} >
                                    <SettingButtonText isMargin={false} >아이피 설정</SettingButtonText>
                                </TouchableWithoutFeedback> 
                                <SelectWrapper style={{marginRight:'auto', marginLeft:'auto', paddingBottom:20}} >
                                    <StoreIDTextLabel>IP:</StoreIDTextLabel>
                                    <StoreIDTextInput keyboardType='numeric'  defaultValue={ipText} onChangeText={(val)=>{ setIpText(val); }} />
                                    <TouchableWithoutFeedback onPress={()=>{setStoreInfo();}}>
                                        <SelectCancelWrapper>
                                            <SelectCancelText>설정하기</SelectCancelText>
                                        </SelectCancelWrapper>
                                    </TouchableWithoutFeedback>
                                </SelectWrapper>
                            </SettingItemWrapper>
                            }
                            <SettingItemWrapper>
                                <TouchableWithoutFeedback onPress={()=>{ }} >
                                    <SettingButtonText isMargin={false} >테이블 세팅</SettingButtonText>
                                </TouchableWithoutFeedback> 
                                <SelectWrapper style={{marginRight:'auto', marginLeft:'auto', paddingBottom:20}} >
                                    <StoreIDTextLabel>테이블 번호:</StoreIDTextLabel>
                                    <StoreIDTextInput keyboardType='numeric'  defaultValue={tableNo} onChangeText={(val)=>{ setTableNo(val); }} />
                                    <TouchableWithoutFeedback onPress={()=>{setTableInfo()}}>
                                        <SelectCancelWrapper>
                                            <SelectCancelText>설정하기</SelectCancelText>
                                        </SelectCancelWrapper>
                                    </TouchableWithoutFeedback>
                                </SelectWrapper>
                                {/* 
                                <StoreIDTextLabel>테이블 번호:</StoreIDTextLabel>
                                <StoreIDTextInput keyboardType='numeric'  defaultValue={tableNo} onChangeText={(val)=>{ setTableNo(val); }} />
                                    
                                <TouchableWithoutFeedback onPress={()=>{ dispatch(getTableList()); setTableSettingShow(!isTableSettingShow) }} >
                                    <SettingButtonText isMargin={false} >테이블 세팅</SettingButtonText>
                                </TouchableWithoutFeedback> 
                                <Dropdown/> 
                                 */}
                            </SettingItemWrapper>
                            {/* 
                            <TouchableWithoutFeedback onPress={()=>{checkTableOrder(dispatch,{tableInfo})}} >
                                <SettingButtonText isMargin={true} >테이블 상태</SettingButtonText>
                            </TouchableWithoutFeedback> 
                            <TouchableWithoutFeedback onPress={()=>{cancelOrder(dispatch,{tableInfo})}} >
                                <SettingButtonText isMargin={true} >주문취소</SettingButtonText>
                            </TouchableWithoutFeedback>  */}
                            <TouchableWithoutFeedback onPress={()=>{getIndicateAvailableDeviceInfo();}} >
                                <SettingButtonText isMargin={true} >단말기 서비스 확인</SettingButtonText>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{smartroServiceSetting();}} >
                                <SettingButtonText isMargin={true} >단말기 서비스 설정하기</SettingButtonText>
                            </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>{smartroServiceGetting();}} >
                                    <SettingButtonText isMargin={true} >단말기 서비스 설정 확인</SettingButtonText>
                                </TouchableWithoutFeedback>
                            <SettingItemWrapper>
                                <TouchableWithoutFeedback onPress={()=>{}} >
                                    <SettingButtonText isMargin={false} >단말기 서비스 기능</SettingButtonText>
                                </TouchableWithoutFeedback>
                                <ServiceDropDown/>
                            </SettingItemWrapper>
                            <SettingItemWrapper>    
                                <TouchableWithoutFeedback onPress={()=>{}} >
                                    <SettingButtonText isMargin={false} >단말기 결제 기능</SettingButtonText>
                                </TouchableWithoutFeedback>
                                <PaymentDropdown/>
                            </SettingItemWrapper>
                            <TouchableWithoutFeedback onPress={()=>{initTable(); }} >
                                <SettingButtonText isMargin={true} >테이블 주문 초기화</SettingButtonText>
                            </TouchableWithoutFeedback>
                            {/* 
                            <TouchableWithoutFeedback onPress={()=>{uploadLog(); }} >
                                <SettingButtonText isMargin={true} >로그 올리기</SettingButtonText>
                            </TouchableWithoutFeedback>
                            */}
                            <TouchableWithoutFeedback onPress={()=>{ }} >
                                <SettingButtonText isMargin={true} >메뉴 업데이트</SettingButtonText>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{checkUpdate();}} >
                                <SettingButtonText isMargin={true} >앱 업데이트 ver 1.0.1-1</SettingButtonText>
                            </TouchableWithoutFeedback> 
                        </SettingButtonWrapper>
                    </SettingScrollView>
                </SettingWrapper>

                {(spinnerText!="")&&
                    <PopupIndicatorWrapper style={{right:0, position:'absolute', width:'104%', height:'104%'}}>
                        <IndicatorWrapper>
                            <PopupSpinner size={'large'}/>
                            <PopupIndicatorText>{spinnerText}</PopupIndicatorText>
                        </IndicatorWrapper>
                    </PopupIndicatorWrapper>
                }
            </KeyboardAvoidingView>
        </>
    )
}
export default SettingPopup;