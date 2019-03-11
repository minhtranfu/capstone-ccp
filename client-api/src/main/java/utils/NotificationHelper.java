package utils;

import com.google.firebase.messaging.*;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

public class NotificationHelper {

	private static final String SERVER_TOKEN_KEY = "AAAAb5A36MQ:APA91bHH4d0d2Qxf9wJjrIL7bUBJblSTB3aNnToPSQPnEtBBnzhuqnK7f9MudQZn9RuEouKVPndX-GCCEgh5rbxMTSof9Con2GCk-CLl8sskMXn1QKo3Wtr9YN9CvShvzqg0X_pA6MHG";

	public static void sendNotification() throws FirebaseMessagingException {

		String regisToken = "epYM3BuEDJw:APA91bEiCCAOLF2cRapo4u6IE1a59knrPmMvqqOP-T49RQxVZ3EbyiguD0HJG05YJADfSNhS15NHtUA29ctVkl_yX0VIzAh0jS4xGYGrAOIo36i_1vzlMF2gV55bsaO9VJ717aEH5ac8";

		Message message = Message.builder()
				.setNotification(new Notification("wassup ae", "Sent from web-api NGhia"))
				.setWebpushConfig(WebpushConfig.builder()
						.setNotification(WebpushNotification.builder()
								.setIcon("https://ccp.hoctot.net/public/assets/images/logo.png")
								.build())
						.build())
				.setToken(regisToken)
				.build();
		String response = FirebaseMessaging.getInstance().send(message);
		System.out.println("Successfully sent message: " + response);
	}

	public static InputStream sendNotiWithHTTP() throws IOException {
		URL url = new URL("https://fcm.googleapis.com/fcm/send");
		HttpURLConnection connection = (HttpURLConnection) url.openConnection();

		connection.setUseCaches(false);
		connection.setDoInput(true);
		connection.setDoOutput(true);

		connection.setRequestMethod("POST");
		connection.setRequestProperty("Content-Type","application/json");
		connection.setRequestProperty("Authorization","key="+SERVER_TOKEN_KEY);

		JSONObject json = new JSONObject();
		json.put("to", "epYM3BuEDJw:APA91bEiCCAOLF2cRapo4u6IE1a59knrPmMvqqOP-T49RQxVZ3EbyiguD0HJG05YJADfSNhS15NHtUA29ctVkl_yX0VIzAh0jS4xGYGrAOIo36i_1vzlMF2gV55bsaO9VJ717aEH5ac8");
		JSONObject info = new JSONObject();
		info.put("title", "wassup ae"); // Notification title
		info.put("body", "sent from Nghia"); // Notification body
		info.put("click_action", "https://ccp.hoctot.net/"); // Notification body
		info.put("icon", "https://ccp.hoctot.net/public/assets/images/logo.png"); // Notification body
		json.put("notification", info);
		OutputStreamWriter wr = new OutputStreamWriter(connection.getOutputStream());
		wr.write(json.toString());
		wr.flush();
		return connection.getInputStream();

	}


}
