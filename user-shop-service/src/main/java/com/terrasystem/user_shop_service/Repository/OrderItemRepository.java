package com.terrasystem.user_shop_service.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.terrasystem.user_shop_service.Entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
}
