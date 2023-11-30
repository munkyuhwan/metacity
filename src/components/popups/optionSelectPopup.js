import { useDispatch, useSelector } from "react-redux";
import { OptList } from "../../styles/main/detailStyle";
import OptItem from "../detailComponents/optItem";
import RadioGroup from 'react-native-radio-buttons-group';
import { useEffect, useMemo, useState } from "react";
import _ from 'lodash';
import { setMenuOptionSelected } from "../../store/menuDetail";
import FastImage from "react-native-fast-image";
import { Text, TouchableWithoutFeedback, View } from "react-native";
import { openPopup } from "../../utils/common";

const OptionSelectPopup = () =>{
    const {language} = useSelector(state=>state.languages);
    const dispatch = useDispatch();
    const {menuOptionList, menuOptionGroupCode} = useSelector((state)=>state.menuDetail);
    const [optionData, setOptionData] = useState([])
    const radioButtons = useMemo(()=>optionData)
    const [selectedId, setSelectedId] = useState();

    // 메뉴 옵션 선택 추가 정보
    const {optionExtra} = useSelector(state=>state.menuExtra);
    
    const ItemTitle = (additiveId,index) =>{
        let selTitleLanguage = "";
        const selExtra = optionExtra.filter(el=>el.pos_code==additiveId);
        if(language=="korean") {
            selTitleLanguage = menuOptionList[index]?.ADDITIVE_NAME;
        }
        else if(language=="japanese") {
            selTitleLanguage = selExtra[0]?.op_name_jp;
        }
        else if(language=="chinese") {
            selTitleLanguage = selExtra[0]?.op_name_cn;
        }
        else if(language=="english") {
            selTitleLanguage = selExtra[0]?.op_name_en;
        }
        return selTitleLanguage;
    }
    
    //console.log("optionExtra: ",optionExtra);
    useEffect(()=>{
        let radioData = [];
        if(!_.isEmpty(menuOptionList)){
            menuOptionList.map((el)=>{
                radioData.push({id:el.ADDITIVE_ID, label:el.ADDITIVE_NAME, value:el.ADDITIVE_ID})
            })
        }
        setOptionData(radioData);
    },[menuOptionList])
    useEffect(()=>{
        if(selectedId) { 
            const selectedAddtive = menuOptionList.filter(el=>el.ADDITIVE_ID==selectedId);
            const additiveData = {
                "ADDITIVE_ID": selectedId,
                "ADDITIVE_NAME": selectedAddtive[0].ADDITIVE_NAME,
                "RULE_ID": menuOptionGroupCode,
                "ADDITIVE_PRICE": selectedAddtive[0].ADDITIVE_SALE_PRICE,
                "ADDITIVE_CNT": "1"
            }

            dispatch(setMenuOptionSelected(additiveData));
            openPopup(dispatch,{innerView:"", isPopupVisible:false});

        }
    },[selectedId])
    return( 
        <>
            <View style={{ width:'100%', textAlign:'center', alignItems:"center", padding:20}} >
                <View style={{width:'100%', height:100, padding:0, flexDirection:'row', alignItems:'center', textAlign:'center'  }} >
                    {optionData.map((el,index)=>{ 
                        const optionRight = optionExtra.filter(optionEl => optionEl.pos_code == el.id);
                        return(
                            <TouchableWithoutFeedback onPress={()=>{setSelectedId(el.id)}} >
                                <View style={{padding:10}} >
                                        <FastImage style={{width:100, height:100, resizeMode:'contain',  }} source={{uri:`https:${optionRight[0]?.gimg_chg}`}} />
                                        <Text style={{width:'100%', color:'black', fontWeight:'bold', fontSize:17, textAlign:'center'}}  >{ItemTitle(menuOptionList[index]?.ADDITIVE_ID, index)||menuOptionList[index]?.ADDITIVE_NAME /* menuOptionList[index]?.ADDITIVE_NAME */}</Text>
                                </View>
                            </TouchableWithoutFeedback>

                        )
                    })}
                </View>
            </View>
            { /*
            <View style={{ width:'100%', textAlign:'center', alignItems:"center"}} >
                <RadioGroup 
                    containerStyle={el=>{console.log("el: ",el)}}
                    radioButtons={radioButtons} 
                    onPress={setSelectedId}
                    selectedId={selectedId}
                    layout="row"
                />
                </View> 
                */}

        </>
    );
}

export default OptionSelectPopup;

