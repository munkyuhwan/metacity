import { NativeModules } from "react-native"
import { TID } from "../../resources/apiResources";
import moment from "moment";

export const prepareKocesPay = () =>{
    const {KocesPay} = NativeModules;
    
    const payData = {
        TrdType:'A10',
        TermID: TID, 
        Audate:`${moment().format("YYMMDD")}`,
        AuNo:'',
        KeyYn:'I',
        TrdAmt:"50000",
        TaxAmt:"5000",
        SvcAmt:"0",
        TaxFreeAmt:"0",
        Month:"00",
        MchData:"wooriorder",
        TrdCode:"",
        TradeNo:"",
        CompCode:"",
        DscYn:1,
        DscData:"",
        FBYn:0,
        InsYn:1,
        CancelReason:"",
        CashNum:"",
        BillNo:"",

    };
    KocesPay.prepareKocesPay(
        payData,
        (error)=>{
            reject(error);
        },
        (msg)=>{
            resolve(msg);
        }
    );
}