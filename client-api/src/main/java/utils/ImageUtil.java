package utils;

import com.google.auth.Credentials;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.cxf.jaxrs.ext.multipart.ContentDisposition;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import javax.ws.rs.BadRequestException;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

import static utils.Constants.BUCKET_NAME;

public class ImageUtil {

	public static List<String> uploadImages(String credentialPath,List<Attachment> attachmentList) throws IOException {
		ArrayList<String> urlList = new ArrayList<>();
		for (Attachment attachment : attachmentList) {
			ContentDisposition fileDetail = attachment.getContentDisposition();
			InputStream uploadedInputStream = attachment.getObject(InputStream.class);

			final String fileName = fileDetail.getParameter("filename");
			// Check extension of file
			if (fileName != null && !fileName.isEmpty() && fileName.contains(".")) {
				final String extension = fileName.substring(fileName.lastIndexOf('.') + 1);
				List<String> allowedExt = Arrays.asList("jpg", "jpeg", "png", "gif");

				if (allowedExt.contains(extension)) {
					urlList.add(ImageUtil.uploadFile(credentialPath,uploadedInputStream, fileDetail));

				} else {
					throw new BadRequestException("file must be an image");

				}
			}
		}
		return urlList;
	}

	public static String uploadFile(String credentialPath, InputStream uploadedInputStream, ContentDisposition fileDetail) throws IOException {
		Credentials credentials = null;
		credentials = GoogleCredentials.fromStream(new FileInputStream(credentialPath));
		Storage storage = StorageOptions.newBuilder().setCredentials(credentials)
				.setProjectId("sonic-arcadia-97210").build().getService();

		Bucket bucket = storage.get(BUCKET_NAME);

		DateTimeFormatter dtf = DateTimeFormat.forPattern("YYYY/MM/dd");
		DateTime dt = DateTime.now(DateTimeZone.UTC);
		String folderOfDate = dt.toString(dtf);
		long currentMiliseconds = new Date().getTime();
		String originName = fileDetail.getParameter("filename");
		String fileExtension = originName.substring(originName.lastIndexOf('.') + 1);
		final String fileName = folderOfDate + "/" + currentMiliseconds + "-" + UUID.randomUUID().toString() + "." + fileExtension;

		// the inputstream is closed by default, so we don't need to close it here
		BlobInfo blobInfo =
				storage.create(
						BlobInfo
								.newBuilder(BUCKET_NAME, fileName)
								// Modify access list to allow all users with link to read file
								.setAcl(new ArrayList<>(Arrays.asList(Acl.of(Acl.User.ofAllUsers(), Acl.Role.READER))))
								.build(),
						uploadedInputStream);
//          // Get serving url for image - a magic image URL for resize - crop .... For appengine only
//        ImagesService imagesService = ImagesServiceFactory.getImagesService();
//        String imageUrl = imagesService.getServingUrl(ServingUrlOptions.Builder.withGoogleStorageFileName("/gs/" + BUCKET_NAME + "/" + blobInfo.getName()));
//        return imageUrl;

		// return the public download link
		return blobInfo.getMediaLink();
	}
}
