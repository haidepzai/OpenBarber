package com.hdmstuttgart.mi.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import javax.validation.constraints.Email;
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
    private Long id;

    @NotBlank(message = "Name is mandatory")
    private String name;

    @NotBlank(message = "Address is mandatory")
    private String address;
    private long addressLongitude;
    private long addressAltitude;

    @NotBlank(message = "Email is mandatory")
    @Column(/*nullable = false, */unique = true)
    @Email
    private String eMail;

    @Lob
    private Blob logo;

    @Lob
    private List<Blob> pictures;

    private URL website;

    private String phoneNumber;

    private boolean approved;


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
