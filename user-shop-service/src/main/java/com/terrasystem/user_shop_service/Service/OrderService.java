package com.terrasystem.user_shop_service.Service;

import com.terrasystem.user_shop_service.Entity.Item;
import com.terrasystem.user_shop_service.Entity.Order;
import com.terrasystem.user_shop_service.Entity.OrderItem;
import com.terrasystem.user_shop_service.DTO.LineItemRequest;
import com.terrasystem.user_shop_service.DTO.PlaceOrderRequest;
import com.terrasystem.user_shop_service.Repository.ItemRepository;
import com.terrasystem.user_shop_service.Repository.OrderRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class OrderService {

    private final ItemRepository itemRepository;
    private final OrderRepository orderRepository;

    public OrderService(ItemRepository itemRepository, OrderRepository orderRepository) {
        this.itemRepository = itemRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional
    public Order placeOrder(Integer userId, PlaceOrderRequest request) {
        if (userId == null) {
            throw new IllegalArgumentException("userId is required");
        }
        if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("order items are required");
        }

        Order order = new Order();
        order.setUserId(userId);
        order.setStatus("NEW");

        BigDecimal total = BigDecimal.ZERO;

        for (LineItemRequest li : request.getItems()) {
            Integer itemId = li.getItemId();
            Integer qty = li.getQuantity();

            if (itemId == null) {
                throw new IllegalArgumentException("itemId is required");
            }
            if (qty == null || qty < 1) {
                throw new IllegalArgumentException("quantity must be >= 1");
            }

            Item item = itemRepository.findById(itemId)
                    .orElseThrow(() -> new IllegalArgumentException("Item not found: " + itemId));

            Integer available = item.getAvailableQty();
            if (available == null) {
                throw new IllegalStateException("Item has no stock configured: " + itemId);
            }
            if (available < qty) {
                throw new IllegalStateException("Not enough stock for item " + itemId +
                        ". Available=" + available + ", requested=" + qty);
            }

            // Zmniejszamy stan magazynowy
            item.setAvailableQty(available - qty);
            // W transakcji wystarczy, że encja jest zarządzana; zapis nastąpi przy flush/commit.
            // itemRepository.save(item); // opcjonalnie

            OrderItem orderItem = new OrderItem();
            orderItem.setItem(item);
            orderItem.setQuantity(qty);
            orderItem.setUnitPrice(item.getPrice()); // serwer ustala cenę

            order.addItem(orderItem);

            total = total.add(item.getPrice().multiply(BigDecimal.valueOf(qty)));
        }

        order.setTotal(total);

        // Zapis zamówienia (kaskada zapisze OrderItem)
        Order saved = orderRepository.save(order);

        // Re-fetch, żeby pola generowane przez DB (order_date) nie były null w odpowiedzi
        return orderRepository.findById(saved.getId())
                .orElseThrow(() -> new IllegalStateException("Saved order not found: " + saved.getId()));
    }
}
