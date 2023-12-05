import React, { useEffect, useRef, useState } from 'react'
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { OptItemDim, OptItemFastImage, OptItemImage, OptItemInfoChecked, OptItemInfoPrice, OptItemInfoTitle, OptItemInfoWrapper, OptItemWrapper } from '../../styles/main/detailStyle';


const OptItem = (props)=>{
    const {language} = useSelector(state=>state.languages);

    const optionData = props.optionData;
    const {menuDetailID, menuOptionGroupCode, menuOptionSelected} = useSelector((state)=>state.menuDetail);
    const [isSelected, setSelected] = useState(false);
    const [addtivePrice, setAdditivePrice] = useState();


    // 메뉴 옵션 추가 정보
    const {optionCategoryExtra} = useSelector(state=>state.menuExtra);
    const optionItemCategoryExtra = optionCategoryExtra.filter(el=>el.cate_code==optionData?.GROUP_NO);
    
    const ItemTitle = () =>{
        let selTitleLanguage = "";
        const selExtra = optionItemCategoryExtra.filter(el=>el.cate_code==optionData.GROUP_NO);
        if(language=="korean") {
            selTitleLanguage = optionData?.GROUP_NM;
        }
        else if(language=="japanese") {
            selTitleLanguage = selExtra[0]?.cate_name_jp||optionData?.GROUP_NM;
        }
        else if(language=="chinese") {
            selTitleLanguage = selExtra[0]?.cate_name_cn||optionData?.GROUP_NM;
        }
        else if(language=="english") {
            selTitleLanguage = selExtra[0]?.cate_name_en||optionData?.GROUP_NM;
        }
        return selTitleLanguage;
    }
 
    useEffect(()=>{
        // 옵션 선택한 메뉴 확인
        if(menuOptionSelected.length>0) {             
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
                /*
                const checkedOption = checkMenu[0]?.menuOptionSelected?.PROD_I_CD;
                const itemList = optionData.ADDITIVE_ITEM_LIST;
                const filteredItem = itemList.filter(el=>el.ADDITIVE_ID==checkedOption);
                setAdditivePrice(filteredItem[0].ADDITIVE_SALE_PRICE); */
            } 
        }

    },[menuOptionGroupCode,menuOptionSelected])

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
                        <OptItemInfoTitle>{ItemTitle()||optionData?.ADDITIVE_GROUP_NAME }</OptItemInfoTitle>
                        <OptItemInfoPrice>{addtivePrice?"+"+Number(addtivePrice).toLocaleString(undefined,{maximumFractionDigits:0})+"원":""}</OptItemInfoPrice>
                        <OptItemInfoChecked isSelected={isSelected} source={require("../../assets/icons/check_red.png")}/>
                    </OptItemInfoWrapper>
                </OptItemWrapper>
            </TouchableWithoutFeedback>

        </>
    )
}
export default OptItem