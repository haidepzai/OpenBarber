package com.hdmstuttgart.mi.backend.model;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
public class Operator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    private String confirmationCode;

    @Column(nullable = false, unique = true)
    private String email;

    private String firstName;

    private String lastName;

    private boolean pending;

    @CreationTimestamp
    private Date createdAt;
}
