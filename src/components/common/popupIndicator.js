import { ActivityIndicator } from "react-native";

const { PopupIndicatorWrapper, PopupIndicatorText, IndicatorWrapper, PopupSpinner } = require("../../styles/common/popupIndicatorStyle")
const { default: WaitIndicator } = require("./waitIndicator")


const PopupIndicator = (props) => {
    
    return (
    <PopupIndicatorWrapper>
        <IndicatorWrapper>
            <PopupSpinner size={'large'}/>
            <PopupIndicatorText>{props?.text}</PopupIndicatorText>
        </IndicatorWrapper>
    </PopupIndicatorWrapper>)
}
export default PopupIndicator;