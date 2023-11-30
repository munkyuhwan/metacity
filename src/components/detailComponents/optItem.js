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
    const optionItemCategoryExtra = optionCategoryExtra.filter(el=>el.cate_code==optionData?.ADDITIVE_GROUP_CODE);
    
    const ItemTitle = () =>{
        let selTitleLanguage = "";
        const selExtra = optionItemCategoryExtra.filter(el=>el.cate_code==optionData.ADDITIVE_GROUP_CODE);
        if(language=="korean") {
            selTitleLanguage = optionData?.ADDITIVE_GROUP_NAME;
        }
        else if(language=="japanese") {
            selTitleLanguage = selExtra[0]?.cate_name_jp||optionData?.ADDITIVE_GROUP_NAME;
        }
        else if(language=="chinese") {
            selTitleLanguage = selExtra[0]?.cate_name_cn||optionData?.ADDITIVE_GROUP_NAME;
        }
        else if(language=="english") {
            selTitleLanguage = selExtra[0]?.cate_name_en||optionData?.ADDITIVE_GROUP_NAME;
        }
        return selTitleLanguage;
    }
 
    useEffect(()=>{
        // 옵션 선택한 메뉴 확인
        if(menuOptionSelected.length>0) {
            const checkMenu = menuOptionSelected.filter(el=>el.menuOptionGroupCode==optionData.ADDITIVE_GROUP_CODE);
            setSelected(checkMenu.length>0);
            // 선택한 메뉴리스트
            if(checkMenu.length>0){
                const checkedOption = checkMenu[0]?.menuOptionSelected?.ADDITIVE_ID;
                const itemList = optionData.ADDITIVE_ITEM_LIST;
                const filteredItem = itemList.filter(el=>el.ADDITIVE_ID==checkedOption);
                setAdditivePrice(filteredItem[0].ADDITIVE_SALE_PRICE);
            }
        }

    },[menuOptionGroupCode,menuOptionSelected])

    return(
        <>
            <TouchableWithoutFeedback onPress={props.onPress} >
                <OptItemWrapper>
                    <OptItemFastImage  source={{uri:`https:${optionItemCategoryExtra[0]?.gimg_chg}`}}/>
                    <OptItemDim isSelected={isSelected}/>
                    <OptItemInfoWrapper>
                        <OptItemInfoTitle>{ItemTitle()||optionData?.ADDITIVE_GROUP_NAME }</OptItemInfoTitle>
                        <OptItemInfoPrice>{addtivePrice?"+"+Number(addtivePrice).toLocaleString(undefined,{maximumFractionDigits:0}):""}</OptItemInfoPrice>
                        <OptItemInfoChecked isSelected={isSelected} source={require("../../assets/icons/check_red.png")}/>
                    </OptItemInfoWrapper>
                </OptItemWrapper>
            </TouchableWithoutFeedback>

        </>
    )
}
export default OptItem