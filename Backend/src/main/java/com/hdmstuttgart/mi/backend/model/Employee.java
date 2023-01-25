package com.hdmstuttgart.mi.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.sql.Blob;

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

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "enterprise_id")
    private Enterprise enterprise;

/*    @OneToMany
    private List<Appointment> appointments;*/
}
