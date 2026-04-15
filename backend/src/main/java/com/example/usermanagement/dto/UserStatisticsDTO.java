package com.example.usermanagement.dto;

import lombok.Data;
import java.util.Map;

@Data
public class UserStatisticsDTO {
    private long totalUsers;
    private long activeUsers;
    private long inactiveUsers;
    private long lockedUsers;
    private Map<String, Long> usersByRole;
    private Map<String, Long> usersByStatus;
}