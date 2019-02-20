package jaxrs.services;

import com.google.api.gax.paging.Page;
import com.google.auth.Credentials;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Part;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;

import static com.google.api.client.util.Charsets.UTF_8;


@Path("storage")
@Produces(MediaType.APPLICATION_JSON)
public class StorageService {

    @Context
    private ServletContext servletContext;

    private final String BUCKET_NAME = "sonic-arcadia-97210.appspot.com";
    private Bucket bucket = null;
    private Storage storage;

//    public StorageService() throws IOException {
//        String credentialPath = servletContext.getRealPath("/WEB-INF/capstone-ccp-credients.json");
//        Credentials credentials = GoogleCredentials.fromStream(new FileInputStream(credentialPath));
//        storage = StorageOptions.newBuilder().setCredentials(credentials)
//                .setProjectId("sonic-arcadia-97210").build().getService();
//
//        bucket = storage.get(BUCKET_NAME);
//    }


    @GET
    public Response getFiles() {

        String credentialPath = servletContext.getRealPath("/WEB-INF/capstone-ccp-credients.json");

        try {
            Credentials credentials = GoogleCredentials.fromStream(new FileInputStream(credentialPath));
            Storage storage = StorageOptions.newBuilder().setCredentials(credentials)
                    .setProjectId("sonic-arcadia-97210").build().getService();

            Bucket bucket = storage.get(BUCKET_NAME);

            String value = "Hello, World!";
            byte[] bytes = value.getBytes(UTF_8);
//            Blob blob = bucket.create("new-file", bytes);
            Blob blob = storage.create(BlobInfo.newBuilder(BUCKET_NAME, "My-new-file.txt").setAcl(new ArrayList<>(Arrays.asList(Acl.of(Acl.User.ofAllUsers(), Acl.Role.READER)))).build(), bytes);

            return Response.ok(blob.getMediaLink()).build();

//            Page<Bucket> pages = storage.list();

//            Page<Blob> pages = bucket.list();
//
//            return Response.ok(pages).build();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return Response.ok("Error!").build();
    }

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response create(@FormDataParam("file") InputStream uploadedInputStream,
                           @FormDataParam("file") FormDataContentDisposition fileDetail) {
        final String fileName = fileDetail.getFileName();
        String imageUrl = "buon-vkl";
        try {
            // Check extension of file
            if (fileName != null && !fileName.isEmpty() && fileName.contains(".")) {
                final String extension = fileName.substring(fileName.lastIndexOf('.') + 1);
                String[] allowedExt = {"jpg", "jpeg", "png", "gif"};
                for (String s : allowedExt) {
                    if (extension.equals(s)) {
                        return Response.ok(this.uploadFile(uploadedInputStream, fileDetail, BUCKET_NAME)).build();
                    }
                }
                throw new ServletException("file must be an image");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return Response.ok(imageUrl).build();
    }

    public String uploadFile(InputStream uploadedInputStream, FormDataContentDisposition fileDetail, final String bucketName) throws IOException {
        String credentialPath = servletContext.getRealPath("/WEB-INF/capstone-ccp-credients.json");
        Credentials credentials = GoogleCredentials.fromStream(new FileInputStream(credentialPath));
        storage = StorageOptions.newBuilder().setCredentials(credentials)
                .setProjectId("sonic-arcadia-97210").build().getService();

        bucket = storage.get(BUCKET_NAME);

        DateTimeFormatter dtf = DateTimeFormat.forPattern("-YYYY-MM-dd-HHmmssSSS");
        DateTime dt = DateTime.now(DateTimeZone.UTC);
        String dtString = dt.toString(dtf);
        final String fileName = fileDetail.getFileName() + dtString;

        // the inputstream is closed by default, so we don't need to close it here
        BlobInfo blobInfo =
                storage.create(
                        BlobInfo
                                .newBuilder(bucketName, fileName)
                                // Modify access list to allow all users with link to read file
                                .setAcl(new ArrayList<>(Arrays.asList(Acl.of(Acl.User.ofAllUsers(), Acl.Role.READER))))
                                .build(),
                        uploadedInputStream);
        // return the public download link
        return blobInfo.getMediaLink();
    }
}