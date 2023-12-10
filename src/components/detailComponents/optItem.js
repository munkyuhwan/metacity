import React, { useEffect, useRef, useState } from 'react'
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { OptItemDim, OptItemFastImage, OptItemImage, OptItemInfoChecked, OptItemInfoPrice, OptItemInfoTitle, OptItemInfoWrapper, OptItemWrapper } from '../../styles/main/detailStyle';
import { getSetItems } from '../../store/menuDetail';
import FastImage from 'react-native-fast-image';


const OptItem = (props)=>{
    const {language} = useSelector(state=>state.languages);
    const dispatch = useDispatch();

    const optionData = props.optionData;
    const {allItems} = useSelector((state)=>state.menu);
    const {menuDetailID, menuOptionGroupCode, menuOptionSelected, menuOptionList, setGroupItem} = useSelector((state)=>state.menuDetail);
    const [isSelected, setSelected] = useState(false);
    const [addtivePrice, setAdditivePrice] = useState();

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
 
    useEffect(()=>{
        // 옵션 선택한 메뉴 확인
      
        /* if(menuOptionSelected.length>0) {             
            const checkMenu = menuOptionSelected.filter(el=>el.menuOptionGroupCode==optionData.GROUP_NO);
            setSelected(checkMenu.length>0);
            // 선택한 메뉴리스트
            
            if(checkMenu.length>0){
                let priceToSet = 0;
                for(var i=0;i<checkMenu.length;i++) {
                    const totalPrice = Number(checkMenu[i].menuOptionSelected?.AMT)+Number(checkMenu[i].menuOptionSelected?.VAT);
                    priceToSet = priceToSet+totalPrice;    
                }
                setAdditivePrice(priceToSet);
            } 
        } */

    },[menuOptionGroupCode,menuOptionSelected])


    return(
        <>
        {/*setGroupItem&&
            setGroupItem.map((el)=>{
                console.log('el: ',el);
                return(
                    <>
                        <TouchableWithoutFeedback onPress={props.onPress} >
                            <OptItemWrapper>
                                {optionItemCategoryExtra[0]?.gimg_chg &&
                                    <OptItemFastImage  source={{uri:`https:${optionItemCategoryExtra[0]?.gimg_chg}`}}/>
                                }
                                {!optionItemCategoryExtra[0]?.gimg_chg &&
                                    <OptItemFastImage resizeMode='contain'  source={require('../../assets/icons/logo.png')}/>
                                }
                                <OptItemDim isSelected={isSelected}/>
                                <OptItemInfoWrapper>
                                    <OptItemInfoTitle>{ItemTitle()||el?.ADDITIVE_GROUP_NAME }</OptItemInfoTitle>
                                    <OptItemInfoPrice>{el?.SAL_TOT_AMT ?"+"+Number(el?.SAL_TOT_AMT).toLocaleString(undefined,{maximumFractionDigits:0})+"원":""}</OptItemInfoPrice>
                                    <OptItemInfoChecked isSelected={isSelected} source={require("../../assets/icons/check_red.png")}/>
                                </OptItemInfoWrapper>
                            </OptItemWrapper>
                        </TouchableWithoutFeedback>
                    </>
                )
            })
        */}
            { 
            <TouchableWithoutFeedback onPress={()=>{props.onPress(itemDetail[0])}} >
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
                        <OptItemInfoPrice>{itemDetail[0]?.SAL_TOT_AMT?"+"+Number(itemDetail[0]?.SAL_TOT_AMT).toLocaleString(undefined,{maximumFractionDigits:0})+"원":""}</OptItemInfoPrice>
                        <OptItemInfoChecked isSelected={props.isSelected} source={require("../../assets/icons/check_red.png")}/>
                    </OptItemInfoWrapper>
                </OptItemWrapper>
            </TouchableWithoutFeedback>
            }
        </>
    )
}
export default OptItem