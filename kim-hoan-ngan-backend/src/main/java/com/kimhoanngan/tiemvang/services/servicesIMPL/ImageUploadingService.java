package com.kimhoanngan.tiemvang.services.servicesIMPL;

import com.google.auth.Credentials;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Base64;
import java.util.UUID;

@Service
public class ImageUploadingService {

    @Value("${firebase.project_id}")
    private String projectId;

    @Value("${firebase.private_key_id}")
    private String privateKeyId;

    @Value("${firebase.private_key}")
    private String privateKey;

    @Value("${firebase.client_email}")
    private String clientEmail;

    @Value("${firebase.client_id}")
    private String clientId;

    @Value("${firebase.auth_uri}")
    private String authUri;

    @Value("${firebase.token_uri}")
    private String tokenUri;

    @Value("${firebase.auth_provider_x509_cert_url}")
    private String authProviderX509CertUrl;

    @Value("${firebase.client_x509_cert_url}")
    private String clientX509CertUrl;

    @Value("${firebase.bucket_name}")
    private String bucketName;

    private String uploadFile(File file, String fileName, String folderName) throws IOException {
        String blobName = folderName + "/" + fileName;
        BlobId blobId = BlobId.of(bucketName, blobName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType("media").build();

        String json = "{"
                + "\"type\": \"service_account\","
                + "\"project_id\": \"" + projectId + "\","
                + "\"private_key_id\": \"" + privateKeyId + "\","
                + "\"private_key\": \"" + privateKey.replace("\\n", "\n") + "\","
                + "\"client_email\": \"" + clientEmail + "\","
                + "\"client_id\": \"" + clientId + "\","
                + "\"auth_uri\": \"" + authUri + "\","
                + "\"token_uri\": \"" + tokenUri + "\","
                + "\"auth_provider_x509_cert_url\": \"" + authProviderX509CertUrl + "\","
                + "\"client_x509_cert_url\": \"" + clientX509CertUrl + "\""
                + "}";

        InputStream inputStream = new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8));
        Credentials credentials = GoogleCredentials.fromStream(inputStream);
        Storage storage = StorageOptions.newBuilder().setCredentials(credentials).build().getService();
        storage.create(blobInfo, Files.readAllBytes(file.toPath()));

        String DOWNLOAD_URL = "https://firebasestorage.googleapis.com/v0/b/" + bucketName + "/o/%s?alt=media";
        return String.format(DOWNLOAD_URL, URLEncoder.encode(blobName, StandardCharsets.UTF_8));
    }

    private File convertToFile(MultipartFile multipartFile, String fileName) throws IOException {
        File tempFile = new File(fileName);
        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(multipartFile.getBytes());
        }
        return tempFile;
    }

    private String getExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf("."));
    }

    public String uploadProduct(MultipartFile multipartFile) {
        try {
            String fileName = multipartFile.getOriginalFilename();
            fileName = UUID.randomUUID().toString().concat(this.getExtension(fileName));

            File file = this.convertToFile(multipartFile, fileName);
            String URL = this.uploadFile(file, fileName, "product");
            file.delete();
            return URL;
        } catch (Exception e) {
            e.printStackTrace();
            return "Image couldn't upload, Something went wrong";
        }
    }

    public String uploadPayment(MultipartFile multipartFile) {
        try {
            String fileName = multipartFile.getOriginalFilename();
            fileName = UUID.randomUUID().toString().concat(this.getExtension(fileName));

            File file = this.convertToFile(multipartFile, fileName);
            String URL = this.uploadFile(file, fileName, "payment");
            file.delete();
            return URL;
        } catch (Exception e) {
            e.printStackTrace();
            return "Image couldn't upload, Something went wrong";
        }
    }
}
