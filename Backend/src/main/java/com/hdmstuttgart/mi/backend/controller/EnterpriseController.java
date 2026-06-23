package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.exception.UnauthorizedException;
import com.hdmstuttgart.mi.backend.mapper.EnterpriseMapper;
import com.hdmstuttgart.mi.backend.model.Enterprise;
import com.hdmstuttgart.mi.backend.model.User;
import com.hdmstuttgart.mi.backend.model.dto.EnterpriseDto;
import com.hdmstuttgart.mi.backend.service.AppointmentService;
import com.hdmstuttgart.mi.backend.service.EnterpriseService;
import com.hdmstuttgart.mi.backend.service.JwtService;
import com.hdmstuttgart.mi.backend.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.List;

/**
 * The type Enterprise controller.
 */
@Api(value = "Enterprise Controller", description = "Operations related to Enterprise", tags = "Enterprise")
@RestController
@RequestMapping("/api/enterprises")
public class EnterpriseController {

    private final EnterpriseService enterpriseService;
    private final AppointmentService appointmentService;
    private final UserService userService;
    private final JwtService jwtService;
    private final EnterpriseMapper enterpriseMapper;

    /**
     * Instantiates a new Enterprise controller.
     *
     * @param enterpriseService the enterprise service
     * @param userService       the user service
     * @param jwtService        the jwt service
     * @param enterpriseMapper  the enterprise mapper
     */
    public EnterpriseController(EnterpriseService enterpriseService, AppointmentService appointmentService, UserService userService, JwtService jwtService, EnterpriseMapper enterpriseMapper) {
        this.enterpriseService = enterpriseService;
        this.appointmentService = appointmentService;
        this.userService = userService;
        this.jwtService = jwtService;
        this.enterpriseMapper = enterpriseMapper;
    }

    /**
     * Create enterprise response entity.
     *
     * @param enterpriseDto the enterprise dto
     * @param token         the token
     * @return the response entity
     */
    @ApiOperation(value = "Create Enterprise", notes = "Creates a new enterprise for the provided details")
    @PostMapping
    public ResponseEntity<EnterpriseDto> createEnterprise(@Valid @RequestBody EnterpriseDto enterpriseDto, @RequestHeader("Authorization") String token) {
        Enterprise createdEnterprise = enterpriseService.createEnterprise(enterpriseMapper.toEntity(enterpriseDto), token);
        EnterpriseDto createdEnterpriseDto = enterpriseMapper.toDto(createdEnterprise);
        return new ResponseEntity<>(createdEnterpriseDto, HttpStatus.CREATED);
    }

    /**
     * Gets all enterprises.
     *
     * @return the all enterprises
     */
    @ApiOperation(value = "Get All Enterprises", notes = "Retrieves a paginated list of all enterprises")
    @GetMapping
    public ResponseEntity<Page<EnterpriseDto>> getAllEnterprises(@PageableDefault(size = 12) Pageable pageable) {
        Page<Enterprise> page = enterpriseService.getAllEnterprises(pageable);
        return ResponseEntity.ok(page.map(enterpriseMapper::toSummaryDto));
    }

    @ApiOperation(value = "Get Enterprises within Radius", notes = "Retrieves enterprises within the given radius from a geographical point")
    @GetMapping("/within-radius")
    public ResponseEntity<Page<EnterpriseDto>> getObjectsWithinRadius(
            @RequestParam double lat, @RequestParam double lng, @RequestParam double radius,
            @PageableDefault(size = 12) Pageable pageable) {
        Page<Enterprise> page = enterpriseService.getEnterprisesWithinRadius(lat, lng, radius, pageable);
        return ResponseEntity.ok(page.map(enterpriseMapper::toSummaryDto));
    }

    /**
     * Gets enterprise by user.
     *
     * @param token the token
     * @return the enterprise by user
     */
    @ApiOperation(value = "Get Enterprise by User", notes = "Retrieves the enterprise associated with the user")
    @GetMapping("/user")
    public ResponseEntity<EnterpriseDto> getEnterpriseByUser(@RequestHeader("Authorization") String token) {
        Enterprise enterprise = enterpriseService.getEnterpriseByUser(token);
        EnterpriseDto enterpriseDto = enterpriseMapper.toDto(enterprise);
        return new ResponseEntity<>(enterpriseDto, HttpStatus.OK);
    }

    /**
     * Gets enterprise by email.
     *
     * @param email the email
     * @return the enterprise by email
     */
    @ApiOperation(value = "Get Enterprise by Email", notes = "Retrieves the enterprise based on the provided email")
    @GetMapping("/email")
    public ResponseEntity<EnterpriseDto> getEnterpriseByEmail(@RequestParam String email) {
        Enterprise enterprise = enterpriseService.getEnterpriseByEmail(email);
        EnterpriseDto enterpriseDto = enterpriseMapper.toDto(enterprise);
        return new ResponseEntity<>(enterpriseDto, HttpStatus.OK);
    }

    /**
     * Gets enterprise by id.
     *
     * @param id the id
     * @return the enterprise by id
     */
    @ApiOperation(value = "Get Enterprise by ID", notes = "Retrieves the enterprise by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<EnterpriseDto> getEnterpriseById(@PathVariable long id) {
        Enterprise enterprise = enterpriseService.getEnterpriseById(id);
        EnterpriseDto enterpriseDto = enterpriseMapper.toDto(enterprise);
        return new ResponseEntity<>(enterpriseDto, HttpStatus.OK);
    }

    /**
     * Update enterprise response entity.
     *
     * @param id                   the id
     * @param updatedEnterpriseDto the updated enterprise dto
     * @param token                the token
     * @return the response entity
     */
    @ApiOperation(value = "Update Enterprise", notes = "Updates the enterprise with the provided ID")
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

        Enterprise updatedEnterprise = enterpriseService.updateEnterprise(id, enterpriseMapper.toEntity(updatedEnterpriseDto), token);
        EnterpriseDto newEnterpriseDto = enterpriseMapper.toDto(updatedEnterprise);
        return new ResponseEntity<>(newEnterpriseDto, HttpStatus.OK);
    }

    /**
     * Patch enterprise response entity.
     *
     * @param enterpriseDto the enterprise dto
     * @param token         the token
     * @return the response entity
     */
    @ApiOperation(value = "Patch Enterprise", notes = "Partially updates the enterprise associated with the user")
    @PatchMapping("/user")
    public ResponseEntity<EnterpriseDto> patchEnterprise(@RequestBody EnterpriseDto enterpriseDto,
                                                      @RequestHeader("Authorization") String token) {
        String email = jwtService.extractUsername(token.substring(7));
        Enterprise enterprise = enterpriseService.getEnterpriseByUser(token);
        if (!enterprise.getEmail().equals(email)) {
            throw new UnauthorizedException("User is not authorized to perform this operation");
        }
        Enterprise updatedEnterprise = enterpriseService.updateEnterprise(enterprise.getId(), enterpriseMapper.toEntity(enterpriseDto), token);
        EnterpriseDto newEnterpriseDto = enterpriseMapper.toDto(updatedEnterprise);
        return new ResponseEntity<>(newEnterpriseDto, HttpStatus.OK);
    }

    /**
     * Delete enterprise response entity.
     *
     * @param id    the id
     * @param token the token
     * @return the response entity
     */
    @PostMapping("/{id}/logo")
    public ResponseEntity<EnterpriseDto> uploadLogo(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String token) {
        Enterprise enterprise = enterpriseService.uploadLogo(id, file, token);
        return ResponseEntity.ok(enterpriseMapper.toDto(enterprise));
    }

    @DeleteMapping("/{id}/logo")
    public ResponseEntity<EnterpriseDto> deleteLogo(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token) {
        Enterprise enterprise = enterpriseService.deleteLogo(id, token);
        return ResponseEntity.ok(enterpriseMapper.toDto(enterprise));
    }

    @PostMapping("/{id}/pictures")
    public ResponseEntity<EnterpriseDto> uploadPictures(
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files,
            @RequestHeader("Authorization") String token) {
        Enterprise enterprise = enterpriseService.uploadPictures(id, files, token);
        return ResponseEntity.ok(enterpriseMapper.toDto(enterprise));
    }

    @DeleteMapping("/{id}/pictures/{index}")
    public ResponseEntity<EnterpriseDto> deletePicture(
            @PathVariable Long id,
            @PathVariable int index,
            @RequestHeader("Authorization") String token) {
        Enterprise enterprise = enterpriseService.deletePicture(id, index, token);
        return ResponseEntity.ok(enterpriseMapper.toDto(enterprise));
    }

    @ApiOperation(value = "Get Available Slots", notes = "Returns available time slots for an enterprise on a given date")
    @GetMapping("/{id}/available-slots")
    public ResponseEntity<List<String>> getAvailableSlots(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Long employeeId,
            @RequestParam(defaultValue = "30") int serviceDuration) {
        List<String> slots = appointmentService.getAvailableSlots(id, employeeId, date, serviceDuration);
        return ResponseEntity.ok(slots);
    }

    @ApiOperation(value = "Delete Enterprise", notes = "Deletes the enterprise by its ID")
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
