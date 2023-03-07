package com.hdmstuttgart.mi.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hdmstuttgart.mi.backend.model.enums.Drink;
import com.hdmstuttgart.mi.backend.model.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import javax.validation.constraints.*;
import java.net.URL;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Enterprise {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank(message = "Name is mandatory")
    private String name;

    @NotBlank(message = "Owner is mandatory")
    private String owner;

    @NotBlank(message = "Address is mandatory")
    private String address;
    private double addressLongitude;
    private double addressLatitude;

    @NotBlank(message = "Email is mandatory")
    @Column(nullable = false, unique = true)
    @Email
    private String email;

    private String phoneNumber;

    private URL website;

    // { open: "10:00", close: "08:00" }
    // private Hours hours;
    private String openingTime;
    private String closingTime;

    private boolean recommended;

    private boolean approved;

    @Min(value = 0, message = "Price Category must be greater than or equal to 0")
    @Max(value = 3, message = "Price Category must be smaller than or equal to 3")
    private int priceCategory;

    @ElementCollection(targetClass = PaymentMethod.class)
    @CollectionTable(name = "enterprise_payment_methods", joinColumns = @JoinColumn(name = "enterprise_id"))
    @Enumerated(EnumType.STRING)
    private Set<PaymentMethod> paymentMethods;

    @ElementCollection(targetClass = Drink.class)
    @CollectionTable(name = "enterprise_drinks", joinColumns = @JoinColumn(name = "enterprise_id"))
    @Enumerated(EnumType.STRING)
    private Set<Drink> drinks;

//    @Lob //TODO how?
    private byte[] logo;

    /*@Lob*/
    @ElementCollection
    @CollectionTable(name = "enterprise_pictures")
    private List<byte[]> pictures;

    @OneToMany(cascade=CascadeType.ALL, mappedBy = "enterprise")
    private List<Service> services;

    @OneToMany(cascade=CascadeType.ALL, mappedBy = "enterprise")
    private List<Employee> employees;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "enterprise")
    private List<Appointment> appointments;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "enterprise")
    private List<Review> reviews;
}
