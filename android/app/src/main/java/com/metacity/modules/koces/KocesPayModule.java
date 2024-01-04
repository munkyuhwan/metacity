package com.metacity.modules.koces;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContract;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityOptionsCompat;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.metacity.R;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class KocesPayModule extends ReactContextBaseJavaModule {
    private Context mContext = null;
    private int KOCES_REQUEST_CODE = 1910;

    // Koces result code
    private String KOCES_SUCCESS_CODE = "0000";

    private Callback successCallback = null;
    private Callback errorCallback = null;

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener(){
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, @Nullable Intent data) {
            super.onActivityResult(activity, requestCode, resultCode, data);
            //System.out.println("================================on activity result================================");
            //System.out.println("intent====="+requestCode);
            //System.out.println(data);
            JSONObject result = new JSONObject();
            if(data != null) {
                Object hashData = data.getExtras().get("hashMap");
                if(hashData != null) {
                    JSONObject jObj = new JSONObject((Map) hashData);
                    try {
                        if(jObj.get("AnsCode") != null) {
                            if (jObj.get("AnsCode").toString().equals(KOCES_SUCCESS_CODE)) {
                                // 정상 리스폰스
                                if(successCallback != null) {
                                    successCallback.invoke(jObj.toString());
                                }
                            }else {
                                // 실패 리스폰스
                                if(errorCallback != null) {
                                    errorCallback.invoke(jObj.toString());
                                }
                            }
                        }
                    } catch (JSONException e) {
                        errorCallback.invoke(e);
                        throw new RuntimeException(e);
                    }
                }
            }


        }
    };

    KocesPayModule(ReactApplicationContext context) {
        super(context);
        getReactApplicationContext().addActivityEventListener(mActivityEventListener);
        mContext=context;

    }

    @NonNull
    @Override
    public String getName() {
        return "KocesPay";
    }

    @ReactMethod
    public void prepareKocesPay(ReadableMap data, Callback errorCallback, Callback successCallback) {
        System.out.println("==============================prepare koces pay==============================");

        this.errorCallback = errorCallback;
        this.successCallback = successCallback;

        HashMap dataHash = data.toHashMap();
        HashMap<String, String> hashMap = new HashMap<>();
        Intent intent = new Intent();
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
            intent.addCategory(Intent.CATEGORY_LAUNCHER);
        }
        ComponentName componentName = new ComponentName("com.koces.androidpos","com.koces.androidpos.AppToAppActivity");
        intent.setComponent(componentName);
        intent.setPackage(getReactApplicationContext().getPackageName());
        intent.addFlags(Intent.FLAG_FROM_BACKGROUND);
        // 데이터 담기
        if(dataHash != null) {
            for (Object key : dataHash.keySet()) {
                hashMap.put(key.toString(),(dataHash.get(key) != null ? dataHash.get(key).toString() : "NULL") );
            }
        }
        System.out.println("hashMap: "+hashMap);
        intent.putExtra("hashMap",hashMap);
        intent.setType("text/plane");

        getReactApplicationContext().startActivityForResult(intent, KOCES_REQUEST_CODE,null);



    }


}
