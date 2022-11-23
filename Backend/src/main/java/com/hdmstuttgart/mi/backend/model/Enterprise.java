package com.hdmstuttgart.mi.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import java.net.URL;
import java.sql.Blob;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
public class Enterprise {

    @Id
    @GeneratedValue
    private long id;

    @NotBlank(message = "Name is mandatory")
    private String name;

    @NotBlank(message = "Address is mandatory")
    private String address; // How to implement with Google maps and should the coords request take place in front- or backend?
    private long addressLongitude;
    private long addressAltitude;

    @Email
    private String eMail;

    @OneToMany
    private List<Service> services;

    @OneToMany
    private List<Employee> employees;

    @Min(0)
    @Max(5)
    private double rating; // Actually get all ratings from services and divide by services.size

    @Lob
    private List<Blob> pictures;

    private URL website;

    private String phoneNumber;
}
