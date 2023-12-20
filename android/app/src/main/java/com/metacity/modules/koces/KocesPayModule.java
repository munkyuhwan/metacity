package com.metacity.modules.koces;

import android.content.Context;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class KocesPayModule extends ReactContextBaseJavaModule {
    private Context mContext = null;
    KocesPayModule(ReactApplicationContext context) {
        super(context);
        mContext=context;
    }

    @NonNull
    @Override
    public String getName() {
        return "KocesPay";
    }

    @ReactMethod
    public void prepareKocesPay() {
        System.out.println("==============================prepare koces pay==============================");
    }

}
