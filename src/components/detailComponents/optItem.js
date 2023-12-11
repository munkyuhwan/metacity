import React, { useEffect, useRef, useState } from 'react'
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { OptItemDim, OptItemFastImage, OptItemImage, OptItemInfoChecked, OptItemInfoPrice, OptItemInfoTitle, OptItemInfoWrapper, OptItemWrapper } from '../../styles/main/detailStyle';
import { getSetItems, setMenuOptionSelected } from '../../store/menuDetail';
import FastImage from 'react-native-fast-image';
import { DetailItemAmtController, DetailItemAmtText,DetailItemAmtWrapper, DetailOperandorText, OperandorText } from '../../styles/main/cartStyle';


const OptItem = (props)=>{
    const {language} = useSelector(state=>state.languages);
    const dispatch = useDispatch();

    const optionData = props.optionData;
    const {allItems} = useSelector((state)=>state.menu);
    const {menuDetailID, menuOptionGroupCode, menuOptionSelected, menuOptionList, setGroupItem} = useSelector((state)=>state.menuDetail);
    const [isSelected, setSelected] = useState(false);
    const [addtivePrice, setAdditivePrice] = useState();
    const [qty,setQty] = useState(1);

    // 메뉴 옵션 추가 정보
    const {optionCategoryExtra,menuExtra} = useSelector(state=>state.menuExtra);
    const itemDetail = allItems.filter(el=>el.PROD_CD==optionData?.PROD_I_CD);
    const itemMenuExtra = menuExtra.filter(el=>el.pos_code==optionData?.PROD_I_CD);
    const ItemTitle = () =>{
        let selTitleLanguage = "";
        const selExtra = itemMenuExtra.filter(el=>el.pos_code==optionData.PROD_I_CD);
        if(language=="korean") {
            selTitleLanguage = optionData?.GROUP_NM;
        }
        else if(language=="japanese") {
            selTitleLanguage = selExtra[0]?.cate_name_jp||optionData?.PROD_I_CD;
        }
        else if(language=="chinese") {
            selTitleLanguage = selExtra[0]?.cate_name_cn||optionData?.PROD_I_CD;
        }
        else if(language=="english") {
            selTitleLanguage = selExtra[0]?.cate_name_en||optionData?.PROD_I_CD;
        }
        return selTitleLanguage;
    }
 
    const plusCnt = () =>{
        let tmpOptions = Object.assign([],menuOptionSelected);
        let filteredTmpOptions = tmpOptions.filter(el=>el.PROD_I_CD ==optionData?.PROD_I_CD )
        let tmpOptionPut = filteredTmpOptions[0];
        let qty = 1;
        if(filteredTmpOptions.length > 0) {
            qty = filteredTmpOptions[0].QTY+1
        }
        tmpOptionPut = {...tmpOptionPut,...{QTY:qty}}
        dispatch(setMenuOptionSelected({data:tmpOptionPut,isAdd:true, isAmt:true}));
    }
    const minusCnt = () => {
        let tmpOptions = Object.assign([],menuOptionSelected);
        let filteredTmpOptions = tmpOptions.filter(el=>el.PROD_I_CD ==optionData?.PROD_I_CD )
        let tmpOptionPut = filteredTmpOptions[0];
        let qty = 1;
        if(filteredTmpOptions.length > 0) {
            qty = filteredTmpOptions[0].QTY-1
        }
        tmpOptionPut = {...tmpOptionPut,...{QTY:qty}}
        dispatch(setMenuOptionSelected({data:tmpOptionPut,isAdd:true, isAmt:true}));
    }

    
    useEffect(()=>{
        let filteredTmpOptions = menuOptionSelected.filter(el=>el.PROD_I_CD ==optionData?.PROD_I_CD )
        if(filteredTmpOptions.length > 0) {
            setQty(filteredTmpOptions[0].QTY);
        }
    },[menuOptionSelected])

    return(
        <>
            { 
            <TouchableWithoutFeedback onPress={()=>{props.onPress(itemDetail[0])}} >
                <View>

                    <OptItemWrapper>
                        {itemMenuExtra[0]?.gimg_chg &&
                            <OptItemFastImage  source={{uri:`https:${itemMenuExtra[0]?.gimg_chg}`,headers: { Authorization: 'AuthToken' },priority: FastImage.priority.normal}}/>
                        }
                        {!itemMenuExtra[0]?.gimg_chg &&
                            <OptItemFastImage resizeMode='contain'  source={require('../../assets/icons/logo.png')}/>
                        }
                        <OptItemDim isSelected={props.isSelected}/>
                        <OptItemInfoWrapper>
                            <OptItemInfoTitle>{ItemTitle()||itemDetail[0]?.PROD_NM }</OptItemInfoTitle>
                            <OptItemInfoPrice>{itemDetail[0]?.SAL_TOT_AMT?"+"+Number(itemDetail[0]?.SAL_TOT_AMT*qty).toLocaleString(undefined,{maximumFractionDigits:0})+"원":""}</OptItemInfoPrice>
                            <OptItemInfoChecked isSelected={props.isSelected} source={require("../../assets/icons/check_red.png")}/>
                        </OptItemInfoWrapper>
                    </OptItemWrapper>
                    {/* 옵션 수량 조절 */}
                    {props.isSelected &&
                        <DetailItemAmtWrapper>
                            <TouchableWithoutFeedback  onPress={()=>{ minusCnt();}} >
                                <DetailItemAmtController>
                                <DetailOperandorText>-</DetailOperandorText>
                                </DetailItemAmtController>
                            </TouchableWithoutFeedback>
                            <DetailItemAmtText>{qty}</DetailItemAmtText>
                            <TouchableWithoutFeedback  onPress={()=>{ plusCnt(); }} >
                                <DetailItemAmtController>
                                    <DetailOperandorText>+</DetailOperandorText>
                                </DetailItemAmtController>
                            </TouchableWithoutFeedback>
                        </DetailItemAmtWrapper>
                    }
                </View>
            </TouchableWithoutFeedback>
            }
        </>
    )
}
export default OptItem