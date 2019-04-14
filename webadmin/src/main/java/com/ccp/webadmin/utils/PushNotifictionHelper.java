package com.ccp.webadmin.utils;

import org.json.*;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
public class PushNotifictionHelper {

    public final static String AUTH_KEY_FCM = "AAAAb5A36MQ:APA91bHH4d0d2Qxf9wJjrIL7bUBJblSTB3aNnToPSQPnEtBBnzhuqnK7f9MudQZn9RuEouKVPndX-GCCEgh5rbxMTSof9Con2GCk-CLl8sskMXn1QKo3Wtr9YN9CvShvzqg0X_pA6MHG";
    public final static String API_URL_FCM = "https://fcm.googleapis.com/fcm/send";


    public static void pushFCMNotification(String userDeviceIdKey, String title, String content, String clickAction) throws Exception {

        String authKey = AUTH_KEY_FCM; // You FCM AUTH key
        String FMCurl = API_URL_FCM;

        URL url = new URL(FMCurl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setUseCaches(false);
        conn.setDoInput(true);
        conn.setDoOutput(true);

        conn.setRequestMethod("POST");
        conn.setRequestProperty("Authorization", "key=" + authKey);
        conn.setRequestProperty("Content-Type", "application/json");

        JSONObject json = new JSONObject();
        json.put("to", userDeviceIdKey.trim());
        JSONObject info = new JSONObject();
        info.put("title", title); // Notification title
        info.put("body", content); // Notification body
        info.put("click_action", clickAction); // Notification body
        info.put("icon", "https://ccp.hoctot.net/public/assets/images/logo.png"); // Notification body
        json.put("notification", info);

        OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());
        wr.write(json.toString());
        wr.flush();
        conn.getInputStream();
    }
}
