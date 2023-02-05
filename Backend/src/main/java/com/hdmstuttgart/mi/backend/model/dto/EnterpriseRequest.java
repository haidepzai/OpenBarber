package com.hdmstuttgart.mi.backend.model.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.net.URL;
import java.sql.Blob;
import java.util.List;

@Data
public class EnterpriseRequest {
    private String name;
    private String address;
    private String eMail;
    private MultipartFile file;
    /*private MultipartFile file;*/
}
