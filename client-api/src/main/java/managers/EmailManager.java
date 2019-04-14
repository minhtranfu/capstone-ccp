package managers;


import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import java.io.IOException;
import java.util.Date;
import java.util.Properties;

public class EmailManager {
	public void sendmail(String subject, String content, String toEmail) throws  MessagingException, IOException {
		Properties props = new Properties();
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.host", "smtp.gmail.com");
		props.put("mail.smtp.port", "587");

		Session session = Session.getInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication("ccphotronguoidung@gmail.com", "truongkiet");
			}
		});
		Message msg = new MimeMessage(session);
		msg.setFrom(new InternetAddress("ccphotronguoidung@gmail.com", false));

		msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
		msg.setSubject(subject);
		msg.setContent(content, "text/plain");
		msg.setSentDate(new Date());
		Transport.send(msg);
	}
}
