package com.hdmstuttgart.mi.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.sql.Blob;

/**
 * The type Employee.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Employee {

    @Id
    @GeneratedValue
    private Long id;

    @NotBlank(message = "Name is mandatory")
    private String name;

    private String title;

    @Column(columnDefinition = "bytea")
    private byte[] picture;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "shop_id")
    private Shop shop;

/*    @OneToMany
    private List<Appointment> appointments;*/
}
