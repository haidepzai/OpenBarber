package com.hdmstuttgart.mi.backend.service;

public interface IRecaptchaService {
    boolean verify(String token);
}
