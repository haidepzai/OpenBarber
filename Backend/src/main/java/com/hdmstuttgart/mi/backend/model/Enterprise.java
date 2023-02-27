package com.hdmstuttgart.mi.backend.model;

import com.hdmstuttgart.mi.backend.model.enums.Drink;
import com.hdmstuttgart.mi.backend.model.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
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
    @GeneratedValue
    private Long id;

    @NotBlank(message = "Name is mandatory")
    private String name;

    @NotBlank(message = "Address is mandatory")
    private String address;
    private long addressLongitude;
    private long addressAltitude;

    /*@NotBlank(message = "Email is mandatory")
    @Column(*//*nullable = false, *//*unique = true)*/
    @Email
    private String eMail;

    private String phoneNumber;

    private URL website;

    // { open: "10:00", close: "08:00" }
    private String hours;

    // Das später aus Reviews berechnen
    private double rating;

    // Hier später eigener Datentyp
    private long reviews;

    private boolean recommended;

    private boolean approved;

    @Min(value = 1, message = "Price Category must be greater than or equal to 1")
    @Max(value = 3, message = "Price Category must be smaller than or equal to 3")
    private int priceCategory;

    @ElementCollection(targetClass = PaymentMethod.class)
    @Enumerated(EnumType.STRING)
    private Set<PaymentMethod> paymentMethods;

    @ElementCollection(targetClass = Drink.class)
    @Enumerated(EnumType.STRING)
    private Set<Drink> drinks;

    @Lob
    private byte[] logo;

    /*@Lob*/
    @ElementCollection
    @CollectionTable(name = "enterprise_pictures")
    private List<byte[]> pictures;

    @OneToMany(cascade=CascadeType.ALL) /*(mappedBy = "enterprise")*/
    private List<Service> services;

    @OneToMany(cascade=CascadeType.ALL) /*(mappedBy = "enterprise")*/
    private List<Employee> employees;


/*    @Lob
    private byte[] file;
    @Lob
    private Blob logo;
    @Lob
    private List<Blob> pictures;*/






/*    @OneToMany
    private List<Service> services;*/

/*    @OneToMany
    private List<Employee> employees;*/

/*    private double getRating() {
        double rating = 0;
        int count = 0;
        for(Employee employee : employees) {
            for(Appointment appointment : employee.getAppointments()) {
                if(appointment.getRating() != 0) {
                    rating += appointment.getRating();
                    count++;
                }
            }
        }
        return count == 0 ? 0 : rating / count;
    }*/

/*    public void addEmployee(Employee employee){
        this.employees.add(employee);
    }*/
}
