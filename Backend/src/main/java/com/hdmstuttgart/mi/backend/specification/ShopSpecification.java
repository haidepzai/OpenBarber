package com.hdmstuttgart.mi.backend.specification;

import com.hdmstuttgart.mi.backend.model.Employee;
import com.hdmstuttgart.mi.backend.model.Review;
import com.hdmstuttgart.mi.backend.model.Service;
import com.hdmstuttgart.mi.backend.model.Shop;
import com.hdmstuttgart.mi.backend.model.dto.ShopFilterParams;
import com.hdmstuttgart.mi.backend.model.enums.Drink;
import com.hdmstuttgart.mi.backend.model.enums.PaymentMethod;
import com.hdmstuttgart.mi.backend.model.enums.ServiceTargetAudience;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Subquery;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Locale;

public final class ShopSpecification {

    private static final double EARTH_RADIUS_KM = 6371.0d;

    private ShopSpecification() {
    }

    public static Specification<Shop> withFilters(ShopFilterParams params) {
        if (params == null) {
            return Specification.where(null);
        }

        return Specification.where(hasPriceCategories(params.getPriceCategory()))
                .and(hasTargetAudiences(params.getTargetAudience()))
                .and(hasEmployeeCount(params.getEmployeeCountMin(), params.getEmployeeCountMax()))
                .and(hasOpeningDays(params.getOpeningDays()))
                .and(opensBeforeOrAt(params.getOpeningTime()))
                .and(closesAfterOrAt(params.getClosingTime()))
                .and(hasPaymentMethods(params.getPaymentMethods()))
                .and(hasDrinks(params.getDrinks()))
                .and(hasMinRating(params.getMinRating()));
    }

    public static Specification<Shop> withinRadius(double latitude, double longitude, double radius) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return criteriaBuilder.lessThanOrEqualTo(buildDistanceExpression(root, criteriaBuilder, latitude, longitude), radius);
        };
    }

    private static Specification<Shop> hasPriceCategories(List<Integer> categories) {
        if (isEmpty(categories)) {
            return null;
        }

        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return root.get("priceCategory").in(categories);
        };
    }

    private static Specification<Shop> hasTargetAudiences(List<String> audiences) {
        if (isEmpty(audiences)) {
            return null;
        }

        List<ServiceTargetAudience> normalizedAudiences = new ArrayList<>();
        for (String audience : audiences) {
            if (StringUtils.hasText(audience)) {
                normalizedAudiences.add(toTargetAudience(audience));
            }
        }

        if (normalizedAudiences.isEmpty()) {
            return null;
        }

        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            List<Predicate> predicates = new ArrayList<>();

            for (ServiceTargetAudience audience : normalizedAudiences) {
                Subquery<Long> subquery = query.subquery(Long.class);
                Root<Service> serviceRoot = subquery.from(Service.class);
                subquery.select(criteriaBuilder.literal(1L));
                subquery.where(
                        criteriaBuilder.equal(serviceRoot.get("shop"), root),
                        criteriaBuilder.equal(serviceRoot.get("targetAudience"), audience)
                );
                predicates.add(criteriaBuilder.exists(subquery));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static Specification<Shop> hasEmployeeCount(Integer min, Integer max) {
        if (min == null && max == null) {
            return null;
        }

        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            Subquery<Long> employeeCountSubquery = query.subquery(Long.class);
            Root<Employee> employeeRoot = employeeCountSubquery.from(Employee.class);
            employeeCountSubquery.select(criteriaBuilder.count(employeeRoot));
            employeeCountSubquery.where(criteriaBuilder.equal(employeeRoot.get("shop"), root));

            List<Predicate> predicates = new ArrayList<>();
            if (min != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(employeeCountSubquery, min.longValue()));
            }
            if (max != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(employeeCountSubquery, max.longValue()));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static Specification<Shop> hasOpeningDays(List<String> openingDays) {
        if (isEmpty(openingDays)) {
            return null;
        }

        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            List<Predicate> predicates = new ArrayList<>();
            for (String openingDay : openingDays) {
                if (StringUtils.hasText(openingDay)) {
                    predicates.add(criteriaBuilder.isMember(openingDay, root.get("openingDays")));
                }
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static Specification<Shop> opensBeforeOrAt(String openingTime) {
        String normalizedTime = normalizeTime(openingTime);
        if (!StringUtils.hasText(normalizedTime)) {
            return null;
        }

        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return criteriaBuilder.lessThanOrEqualTo(root.get("openingTime"), normalizedTime);
        };
    }

    private static Specification<Shop> closesAfterOrAt(String closingTime) {
        String normalizedTime = normalizeTime(closingTime);
        if (!StringUtils.hasText(normalizedTime)) {
            return null;
        }

        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            return criteriaBuilder.greaterThanOrEqualTo(root.get("closingTime"), normalizedTime);
        };
    }

    private static Specification<Shop> hasPaymentMethods(List<String> paymentMethods) {
        if (isEmpty(paymentMethods)) {
            return null;
        }

        List<PaymentMethod> normalizedMethods = new ArrayList<>();
        for (String paymentMethod : paymentMethods) {
            if (StringUtils.hasText(paymentMethod)) {
                normalizedMethods.add(PaymentMethod.valueOf(paymentMethod.trim().toUpperCase(Locale.ROOT)));
            }
        }

        if (normalizedMethods.isEmpty()) {
            return null;
        }

        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            List<Predicate> predicates = new ArrayList<>();
            for (PaymentMethod paymentMethod : normalizedMethods) {
                predicates.add(criteriaBuilder.isMember(paymentMethod, root.get("paymentMethods")));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static Specification<Shop> hasDrinks(List<String> drinks) {
        if (isEmpty(drinks)) {
            return null;
        }

        List<Drink> normalizedDrinks = new ArrayList<>();
        for (String drink : drinks) {
            if (StringUtils.hasText(drink)) {
                normalizedDrinks.add(Drink.valueOf(drink.trim().toUpperCase(Locale.ROOT)));
            }
        }

        if (normalizedDrinks.isEmpty()) {
            return null;
        }

        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            List<Predicate> predicates = new ArrayList<>();
            for (Drink drink : normalizedDrinks) {
                predicates.add(criteriaBuilder.isMember(drink, root.get("drinks")));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static Specification<Shop> hasMinRating(Double minRating) {
        if (minRating == null || minRating <= 0) {
            return null;
        }

        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            Subquery<Double> avgSubquery = query.subquery(Double.class);
            Root<Review> reviewRoot = avgSubquery.from(Review.class);
            avgSubquery.select(criteriaBuilder.avg(reviewRoot.get("rating")));
            avgSubquery.where(criteriaBuilder.equal(reviewRoot.get("shop"), root));

            // Shops with no reviews are excluded when a minRating is set
            return criteriaBuilder.greaterThanOrEqualTo(avgSubquery, minRating);
        };
    }

    private static Expression<Double> buildDistanceExpression(Root<Shop> root, CriteriaBuilder criteriaBuilder, double latitude, double longitude) {
        Expression<Double> latitudeInRadians = criteriaBuilder.function("radians", Double.class, criteriaBuilder.literal(latitude));
        Expression<Double> longitudeInRadians = criteriaBuilder.function("radians", Double.class, criteriaBuilder.literal(longitude));
        Expression<Double> shopLatitudeInRadians = criteriaBuilder.function("radians", Double.class, root.get("addressLatitude"));
        Expression<Double> shopLongitudeInRadians = criteriaBuilder.function("radians", Double.class, root.get("addressLongitude"));

        Expression<Double> firstTerm = criteriaBuilder.prod(
                criteriaBuilder.function("cos", Double.class, latitudeInRadians),
                criteriaBuilder.prod(
                        criteriaBuilder.function("cos", Double.class, shopLatitudeInRadians),
                        criteriaBuilder.function("cos", Double.class, criteriaBuilder.diff(shopLongitudeInRadians, longitudeInRadians))
                )
        );
        Expression<Double> secondTerm = criteriaBuilder.prod(
                criteriaBuilder.function("sin", Double.class, latitudeInRadians),
                criteriaBuilder.function("sin", Double.class, shopLatitudeInRadians)
        );
        Expression<Double> cosineDistance = criteriaBuilder.sum(firstTerm, secondTerm);

        return criteriaBuilder.prod(
                criteriaBuilder.literal(EARTH_RADIUS_KM),
                criteriaBuilder.function("acos", Double.class, cosineDistance)
        );
    }

    private static ServiceTargetAudience toTargetAudience(String audience) {
        String normalizedValue = audience.trim().toUpperCase(Locale.ROOT);
        if ("KIDS".equals(normalizedValue)) {
            normalizedValue = "CHILDREN";
        }
        return ServiceTargetAudience.valueOf(normalizedValue);
    }

    private static String normalizeTime(String timeValue) {
        if (!StringUtils.hasText(timeValue)) {
            return null;
        }

        String trimmedValue = timeValue.trim();
        int timeSeparatorIndex = trimmedValue.indexOf('T');
        if (timeSeparatorIndex >= 0 && trimmedValue.length() >= timeSeparatorIndex + 6) {
            return trimmedValue.substring(timeSeparatorIndex + 1, timeSeparatorIndex + 6);
        }
        if (trimmedValue.length() >= 5) {
            return trimmedValue.substring(0, 5);
        }
        return trimmedValue;
    }

    private static boolean isEmpty(Collection<?> values) {
        return values == null || values.isEmpty();
    }
}
