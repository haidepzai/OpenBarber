package com.hdmstuttgart.mi.backend.controller;

import com.hdmstuttgart.mi.backend.exception.UnauthorizedException;
import com.hdmstuttgart.mi.backend.mapper.ShopMapper;
import com.hdmstuttgart.mi.backend.model.Shop;
import com.hdmstuttgart.mi.backend.model.User;
import com.hdmstuttgart.mi.backend.model.dto.ShopDto;
import com.hdmstuttgart.mi.backend.model.dto.ShopFilterParams;
import com.hdmstuttgart.mi.backend.model.dto.SlotDto;
import com.hdmstuttgart.mi.backend.service.AppointmentService;
import com.hdmstuttgart.mi.backend.service.ShopService;
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
 * The type Shop controller.
 */
@Api(value = "Shop Controller", description = "Operations related to Shop", tags = "Shop")
@RestController
@RequestMapping("/api/shops")
public class ShopController {

    private final ShopService shopService;
    private final AppointmentService appointmentService;
    private final UserService userService;
    private final JwtService jwtService;
    private final ShopMapper shopMapper;

    /**
     * Instantiates a new Shop controller.
     *
     * @param shopService the shop service
     * @param userService       the user service
     * @param jwtService        the jwt service
     * @param shopMapper  the shop mapper
     */
    public ShopController(ShopService shopService, AppointmentService appointmentService, UserService userService, JwtService jwtService, ShopMapper shopMapper) {
        this.shopService = shopService;
        this.appointmentService = appointmentService;
        this.userService = userService;
        this.jwtService = jwtService;
        this.shopMapper = shopMapper;
    }

    /**
     * Create shop response entity.
     *
     * @param shopDto the shop dto
     * @param token         the token
     * @return the response entity
     */
    @ApiOperation(value = "Create Shop", notes = "Creates a new shop for the provided details")
    @PostMapping
    public ResponseEntity<ShopDto> createShop(@Valid @RequestBody ShopDto shopDto, @RequestHeader("Authorization") String token) {
        Shop createdShop = shopService.createShop(shopMapper.toEntity(shopDto), token);
        ShopDto createdShopDto = shopMapper.toDto(createdShop);
        return new ResponseEntity<>(createdShopDto, HttpStatus.CREATED);
    }

    /**
     * Gets all shops.
     *
     * @return the all shops
     */
    @ApiOperation(value = "Get All Shops", notes = "Retrieves a paginated list of all shops")
    @GetMapping
    public ResponseEntity<Page<ShopDto>> getAllShops(
            @RequestParam(required = false) List<Integer> priceCategory,
            @RequestParam(required = false) List<String> targetAudience,
            @RequestParam(required = false) Integer employeeCountMin,
            @RequestParam(required = false) Integer employeeCountMax,
            @RequestParam(required = false) List<String> openingDays,
            @RequestParam(required = false) String openingTime,
            @RequestParam(required = false) String closingTime,
            @RequestParam(required = false) List<String> paymentMethods,
            @RequestParam(required = false) List<String> drinks,
            @RequestParam(required = false) Double minRating,
            @PageableDefault(size = 12) Pageable pageable) {
        ShopFilterParams params = buildShopFilterParams(priceCategory, targetAudience, employeeCountMin, employeeCountMax, openingDays, openingTime, closingTime, paymentMethods, drinks, minRating);
        Page<Shop> page = shopService.getFilteredShops(params, pageable);
        return ResponseEntity.ok(page.map(shopMapper::toSummaryDto));
    }

    @ApiOperation(value = "Get Shops within Radius", notes = "Retrieves shops within the given radius from a geographical point")
    @GetMapping("/within-radius")
    public ResponseEntity<Page<ShopDto>> getObjectsWithinRadius(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam double radius,
            @RequestParam(required = false) List<Integer> priceCategory,
            @RequestParam(required = false) List<String> targetAudience,
            @RequestParam(required = false) Integer employeeCountMin,
            @RequestParam(required = false) Integer employeeCountMax,
            @RequestParam(required = false) List<String> openingDays,
            @RequestParam(required = false) String openingTime,
            @RequestParam(required = false) String closingTime,
            @RequestParam(required = false) List<String> paymentMethods,
            @RequestParam(required = false) List<String> drinks,
            @RequestParam(required = false) Double minRating,
            @PageableDefault(size = 12) Pageable pageable) {
        ShopFilterParams params = buildShopFilterParams(priceCategory, targetAudience, employeeCountMin, employeeCountMax, openingDays, openingTime, closingTime, paymentMethods, drinks, minRating);
        Page<Shop> page = shopService.getFilteredShopsWithinRadius(lat, lng, radius, params, pageable);
        return ResponseEntity.ok(page.map(shopMapper::toSummaryDto));
    }

    /**
     * Gets shop by user.
     *
     * @param token the token
     * @return the shop by user
     */
    @ApiOperation(value = "Get Shop by User", notes = "Retrieves the shop associated with the user")
    @GetMapping("/user")
    public ResponseEntity<ShopDto> getShopByUser(@RequestHeader("Authorization") String token) {
        Shop shop = shopService.getShopByUser(token);
        if (shop == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        ShopDto shopDto = shopMapper.toDto(shop);
        return new ResponseEntity<>(shopDto, HttpStatus.OK);
    }

    /**
     * Gets shop by email.
     *
     * @param email the email
     * @return the shop by email
     */
    @ApiOperation(value = "Get Shop by Email", notes = "Retrieves the shop based on the provided email")
    @GetMapping("/email")
    public ResponseEntity<ShopDto> getShopByEmail(@RequestParam String email) {
        Shop shop = shopService.getShopByEmail(email);
        ShopDto shopDto = shopMapper.toDto(shop);
        return new ResponseEntity<>(shopDto, HttpStatus.OK);
    }

    /**
     * Gets shop by id.
     *
     * @param id the id
     * @return the shop by id
     */
    @ApiOperation(value = "Get Shop by ID", notes = "Retrieves the shop by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<ShopDto> getShopById(@PathVariable long id) {
        Shop shop = shopService.getShopById(id);
        ShopDto shopDto = shopMapper.toDto(shop);
        return new ResponseEntity<>(shopDto, HttpStatus.OK);
    }

    /**
     * Update shop response entity.
     *
     * @param id                   the id
     * @param updatedShopDto the updated shop dto
     * @param token                the token
     * @return the response entity
     */
    @ApiOperation(value = "Update Shop", notes = "Updates the shop with the provided ID")
    @PutMapping("/{id}")
    public ResponseEntity<ShopDto> updateShop(
            @PathVariable long id,
            @Valid @RequestBody ShopDto updatedShopDto,
            @RequestHeader("Authorization") String token
    ) {
        // Validate the JWT token and extract the user information
        String email = jwtService.extractUsername(token.substring(7));
        User user = userService.getUserByEmail(email);

        // Check if the user is authorized to perform the operation based on their email
        if (!user.getEmail().equals(updatedShopDto.getEmail())) {
            throw new UnauthorizedException("User is not authorized to perform this operation");
        }

        Shop updatedShop = shopService.updateShop(id, shopMapper.toEntity(updatedShopDto), token);
        ShopDto newShopDto = shopMapper.toDto(updatedShop);
        return new ResponseEntity<>(newShopDto, HttpStatus.OK);
    }

    /**
     * Patch shop response entity.
     *
     * @param shopDto the shop dto
     * @param token         the token
     * @return the response entity
     */
    @ApiOperation(value = "Patch Shop", notes = "Partially updates the shop associated with the user")
    @PatchMapping("/user")
    public ResponseEntity<ShopDto> patchShop(@RequestBody ShopDto shopDto,
                                                      @RequestHeader("Authorization") String token) {
        String email = jwtService.extractUsername(token.substring(7));
        Shop shop = shopService.getShopByUser(token);
        if (!shop.getEmail().equals(email)) {
            throw new UnauthorizedException("User is not authorized to perform this operation");
        }
        Shop updatedShop = shopService.updateShop(shop.getId(), shopMapper.toEntity(shopDto), token);
        ShopDto newShopDto = shopMapper.toDto(updatedShop);
        return new ResponseEntity<>(newShopDto, HttpStatus.OK);
    }

    /**
     * Delete shop response entity.
     *
     * @param id    the id
     * @param token the token
     * @return the response entity
     */
    @PostMapping("/{id}/logo")
    public ResponseEntity<ShopDto> uploadLogo(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String token) {
        Shop shop = shopService.uploadLogo(id, file, token);
        return ResponseEntity.ok(shopMapper.toDto(shop));
    }

    @DeleteMapping("/{id}/logo")
    public ResponseEntity<ShopDto> deleteLogo(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token) {
        Shop shop = shopService.deleteLogo(id, token);
        return ResponseEntity.ok(shopMapper.toDto(shop));
    }

    @PostMapping("/{id}/pictures")
    public ResponseEntity<ShopDto> uploadPictures(
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files,
            @RequestHeader("Authorization") String token) {
        Shop shop = shopService.uploadPictures(id, files, token);
        return ResponseEntity.ok(shopMapper.toDto(shop));
    }

    @DeleteMapping("/{id}/pictures/{index}")
    public ResponseEntity<ShopDto> deletePicture(
            @PathVariable Long id,
            @PathVariable int index,
            @RequestHeader("Authorization") String token) {
        Shop shop = shopService.deletePicture(id, index, token);
        return ResponseEntity.ok(shopMapper.toDto(shop));
    }

    @ApiOperation(value = "Get Available Slots", notes = "Returns available time slots for an shop on a given date")
    @GetMapping("/{id}/available-slots")
    public ResponseEntity<List<SlotDto>> getAvailableSlots(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Long employeeId,
            @RequestParam(defaultValue = "30") int serviceDuration) {
        List<SlotDto> slots = appointmentService.getAvailableSlots(id, employeeId, date, serviceDuration);
        return ResponseEntity.ok(slots);
    }

    @ApiOperation(value = "Delete Shop", notes = "Deletes the shop by its ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteShop(@PathVariable long id,
                                                   @RequestHeader("Authorization") String token) {
        Shop shop = shopService.getShopById(id);
        String email = jwtService.extractUsername(token.substring(7));
        if (!shop.getEmail().equals(email)) {
            throw new UnauthorizedException("User is not authorized to perform this operation");
        }
        shopService.deleteShop(id);
        return new ResponseEntity<>("Shop deleted with id = " + id, HttpStatus.NO_CONTENT);
    }

    private ShopFilterParams buildShopFilterParams(
            List<Integer> priceCategory,
            List<String> targetAudience,
            Integer employeeCountMin,
            Integer employeeCountMax,
            List<String> openingDays,
            String openingTime,
            String closingTime,
            List<String> paymentMethods,
            List<String> drinks,
            Double minRating) {
        return ShopFilterParams.builder()
                .priceCategory(priceCategory)
                .targetAudience(targetAudience)
                .employeeCountMin(employeeCountMin)
                .employeeCountMax(employeeCountMax)
                .openingDays(openingDays)
                .openingTime(openingTime)
                .closingTime(closingTime)
                .paymentMethods(paymentMethods)
                .drinks(drinks)
                .minRating(minRating)
                .build();
    }
}
