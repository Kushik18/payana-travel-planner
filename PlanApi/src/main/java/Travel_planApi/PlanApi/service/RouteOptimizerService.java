package Travel_planApi.PlanApi.service;

import org.springframework.stereotype.Service;
import java.util.*;

/**
 * Route Optimization Service using Nearest-Neighbor Greedy Algorithm (TSP-lite).
 * Given a list of places with coordinates, returns the most efficient visitation order.
 */
@Service
public class RouteOptimizerService {

    private static final double EARTH_RADIUS_KM = 6371.0;

    /**
     * Represents a stop on the route.
     */
    public static class RouteStop {
        public String name;
        public double lat;
        public double lon;
        public String district;

        public RouteStop(String name, double lat, double lon, String district) {
            this.name = name;
            this.lat = lat;
            this.lon = lon;
            this.district = district;
        }
    }

    /**
     * Optimization result returned to the controller.
     */
    public static class OptimizationResult {
        public List<RouteStop> originalRoute;
        public List<RouteStop> optimizedRoute;
        public double originalDistanceKm;
        public double optimizedDistanceKm;
        public double distanceSavedKm;
        public double fuelSavedLitres;   // estimate at 15 km/litre
        public int timeSavedMinutes;      // estimate at 60 km/h
    }

    /**
     * Haversine formula: computes great-circle distance between two GPS points.
     */
    public double haversine(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                 + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                 * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    /**
     * Calculates total route distance for a given ordered list of stops.
     */
    public double totalDistance(List<RouteStop> stops) {
        double total = 0;
        for (int i = 0; i < stops.size() - 1; i++) {
            total += haversine(stops.get(i).lat, stops.get(i).lon,
                               stops.get(i + 1).lat, stops.get(i + 1).lon);
        }
        return total;
    }

    /**
     * Nearest-neighbor greedy TSP: starts from the first stop and always visits
     * the closest unvisited stop next.
     */
    public OptimizationResult optimize(List<RouteStop> stops) {
        if (stops == null || stops.size() <= 2) {
            // Nothing to optimize
            OptimizationResult r = new OptimizationResult();
            r.originalRoute   = stops != null ? stops : List.of();
            r.optimizedRoute  = stops != null ? new ArrayList<>(stops) : List.of();
            r.originalDistanceKm  = stops != null ? totalDistance(stops) : 0;
            r.optimizedDistanceKm = r.originalDistanceKm;
            r.distanceSavedKm = 0;
            r.fuelSavedLitres = 0;
            r.timeSavedMinutes = 0;
            return r;
        }

        List<RouteStop> remaining = new ArrayList<>(stops.subList(1, stops.size()));
        List<RouteStop> optimized = new ArrayList<>();
        optimized.add(stops.get(0)); // always start from first stop

        while (!remaining.isEmpty()) {
            RouteStop current = optimized.get(optimized.size() - 1);
            double minDist = Double.MAX_VALUE;
            RouteStop nearest = null;

            for (RouteStop candidate : remaining) {
                double d = haversine(current.lat, current.lon, candidate.lat, candidate.lon);
                if (d < minDist) {
                    minDist = d;
                    nearest = candidate;
                }
            }

            optimized.add(nearest);
            remaining.remove(nearest);
        }

        double origDist  = totalDistance(stops);
        double optDist   = totalDistance(optimized);
        double saved     = Math.max(0, origDist - optDist);

        OptimizationResult result = new OptimizationResult();
        result.originalRoute      = stops;
        result.optimizedRoute     = optimized;
        result.originalDistanceKm  = Math.round(origDist * 10.0) / 10.0;
        result.optimizedDistanceKm = Math.round(optDist * 10.0) / 10.0;
        result.distanceSavedKm     = Math.round(saved * 10.0) / 10.0;
        result.fuelSavedLitres     = Math.round((saved / 15.0) * 10.0) / 10.0;
        result.timeSavedMinutes    = (int) Math.round((saved / 60.0) * 60);
        return result;
    }
}
