package com.hdmstuttgart.mi.backend.service;

import com.hdmstuttgart.mi.backend.model.Appointment;
import com.hdmstuttgart.mi.backend.repository.AppointmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Deletes unconfirmed guest appointments that were not confirmed within 30 minutes.
 * Only applies to appointments without a linked customer account (guest bookings).
 * Logged-in customer bookings are auto-confirmed and never expire.
 */
@Component
public class AppointmentExpiryScheduler {

    private static final Logger log = LoggerFactory.getLogger(AppointmentExpiryScheduler.class);
    private static final int EXPIRY_MINUTES = 30;

    private final AppointmentRepository appointmentRepository;

    public AppointmentExpiryScheduler(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @PostConstruct
    @Transactional
    public void cleanupOnStartup() {
        deleteExpiredUnconfirmedAppointments();
    }

    @Scheduled(fixedDelay = 5 * 60 * 1000) // every 5 minutes
    @Transactional
    public void deleteExpiredUnconfirmedAppointments() {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(EXPIRY_MINUTES);
        List<Appointment> expired = appointmentRepository
                .findByConfirmedFalseAndCustomerIsNullAndCreatedAtBefore(threshold);

        if (!expired.isEmpty()) {
            log.info("Deleting {} expired unconfirmed guest appointment(s)", expired.size());
            appointmentRepository.deleteAll(expired);
        }
    }
}
