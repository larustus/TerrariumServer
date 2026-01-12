package com.terrasystem.user_shop_service.Controller;

import com.terrasystem.user_shop_service.Entity.Order;
import com.terrasystem.user_shop_service.DTO.PlaceOrderRequest;
import com.terrasystem.user_shop_service.Service.OrderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public Order placeOrder(@RequestParam Integer userId,
                            @Valid @RequestBody PlaceOrderRequest request) {
        return orderService.placeOrder(userId, request);
    }
}
