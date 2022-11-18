package com.hdmstuttgart.mi.backend.model;

import lombok.Data;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Data
@Entity
public class Enterprise {
    @Id
    @GeneratedValue
    private long id;

    private String name;
}
