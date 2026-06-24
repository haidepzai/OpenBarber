package com.hdmstuttgart.mi.backend.model.dto;

public class SlotDto {
    private String time;
    private Long employeeId;
    private String employeeName;
    private byte[] employeePicture;

    public SlotDto() {}

    public SlotDto(String time, Long employeeId, String employeeName, byte[] employeePicture) {
        this.time = time;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.employeePicture = employeePicture;
    }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public byte[] getEmployeePicture() { return employeePicture; }
    public void setEmployeePicture(byte[] employeePicture) { this.employeePicture = employeePicture; }
}
