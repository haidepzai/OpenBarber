package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.exception.UnauthorizedException;
import com.hdmstuttgart.mi.backend.mapper.EnterpriseMapper;
import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.User;
import com.hdmstuttgart.mi.backend.model.dto.EnterpriseDto;
import com.hdmstuttgart.mi.backend.service.EnterpriseService;
import com.hdmstuttgart.mi.backend.service.JwtService;
import com.hdmstuttgart.mi.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/enterprises")
public class EnterpriseController {

    private final EnterpriseService enterpriseService;
    private final UserService userService;
    private final JwtService jwtService;
    private final EnterpriseMapper enterpriseMapper;

    public EnterpriseController(EnterpriseService enterpriseService, UserService userService, JwtService jwtService, EnterpriseMapper enterpriseMapper) {
        this.enterpriseService = enterpriseService;
        this.userService = userService;
        this.jwtService = jwtService;
        this.enterpriseMapper = enterpriseMapper;
    }

    @PostMapping
    public ResponseEntity<EnterpriseDto> createEnterprise(@Valid @RequestBody EnterpriseDto enterpriseDto, @RequestHeader("Authorization") String token) {
        Enterprise createdEnterprise = enterpriseService.createEnterprise(enterpriseMapper.toEntity(enterpriseDto), token);
        EnterpriseDto createdEnterpriseDto = enterpriseMapper.toDto(createdEnterprise);
        return new ResponseEntity<>(createdEnterpriseDto, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<EnterpriseDto>> getAllEnterprises() {
        List<Enterprise> enterprises = enterpriseService.getAllEnterprises();
        List<EnterpriseDto> enterpriseDtos = enterpriseMapper.toDtos(enterprises);
        return new ResponseEntity<>(enterpriseDtos, HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<EnterpriseDto> getEnterpriseByUser(@RequestHeader("Authorization") String token) {
        Enterprise enterprise = enterpriseService.getEnterpriseByUser(token);
        EnterpriseDto enterpriseDto = enterpriseMapper.toDto(enterprise);
        return new ResponseEntity<>(enterpriseDto, HttpStatus.OK);
    }

    @GetMapping("/email")
    public ResponseEntity<EnterpriseDto> getEnterpriseByEmail(@RequestParam String email) {
        Enterprise enterprise = enterpriseService.getEnterpriseByEmail(email);
        EnterpriseDto enterpriseDto = enterpriseMapper.toDto(enterprise);
        return new ResponseEntity<>(enterpriseDto, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnterpriseDto> getEnterpriseById(@PathVariable long id) {
        Enterprise enterprise = enterpriseService.getEnterpriseById(id);
        EnterpriseDto enterpriseDto = enterpriseMapper.toDto(enterprise);
        return new ResponseEntity<>(enterpriseDto, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EnterpriseDto> updateEnterprise(
            @PathVariable long id,
            @Valid @RequestBody EnterpriseDto updatedEnterpriseDto,
            @RequestHeader("Authorization") String token
    ) {
        // Validate the JWT token and extract the user information
        String email = jwtService.extractUsername(token.substring(7));
        User user = userService.getUserByEmail(email);

        // Check if the user is authorized to perform the operation based on their email
        if (!user.getEmail().equals(updatedEnterpriseDto.getEmail())) {
            throw new UnauthorizedException("User is not authorized to perform this operation");
        }

        Enterprise updatedEnterprise = enterpriseService.updateEnterprise(id, enterpriseMapper.toEntity(updatedEnterpriseDto));
        EnterpriseDto newEnterpriseDto = enterpriseMapper.toDto(updatedEnterprise);
        return new ResponseEntity<>(newEnterpriseDto, HttpStatus.OK);
    }

    @PatchMapping("/user")
    public ResponseEntity<EnterpriseDto> patchEnterprise(@RequestBody EnterpriseDto enterpriseDto,
                                                      @RequestHeader("Authorization") String token) {
        String email = jwtService.extractUsername(token.substring(7));
        Enterprise enterprise = enterpriseService.getEnterpriseByUser(token);
        if (!enterprise.getEmail().equals(email)) {
            throw new UnauthorizedException("User is not authorized to perform this operation");
        }
        Enterprise updatedEnterprise = enterpriseService.updateEnterprise(enterprise.getId(), enterpriseMapper.toEntity(enterpriseDto));
        EnterpriseDto newEnterpriseDto = enterpriseMapper.toDto(updatedEnterprise);
        return new ResponseEntity<>(newEnterpriseDto, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEnterprise(@PathVariable long id,
                                                   @RequestHeader("Authorization") String token) {
        Enterprise enterprise = enterpriseService.getEnterpriseById(id);
        String email = jwtService.extractUsername(token.substring(7));
        if (!enterprise.getEmail().equals(email)) {
            throw new UnauthorizedException("User is not authorized to perform this operation");
        }
        enterpriseService.deleteEnterprise(id);
        return new ResponseEntity<>("Enterprise deleted with id = " + id, HttpStatus.NO_CONTENT);
    }
}
