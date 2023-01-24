package com.hdmstuttgart.mi.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.sql.Blob;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
public class Employee {

    @Id
    @GeneratedValue
    private long id;

    @NotBlank(message = "Name is mandatory")
    private String name;

    @Lob
    private Blob picture;

    @OneToMany
    private List<Appointment> appointments;

    @JsonIgnore
    @ManyToOne
    private Enterprise enterprise;
}
