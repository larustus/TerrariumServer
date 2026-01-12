package com.terrasystem.user_shop_service.Entity;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import jakarta.persistence.GeneratedValue;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@ToString(exclude = {"items"})
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "order_date", nullable = false, insertable = false, updatable = false)
    private LocalDateTime orderDate;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "status", nullable = true)
    private String status;

    @Column(name = "total", nullable = true, precision = 19, scale = 4)
    private BigDecimal total;

    @JsonManagedReference
    @OneToMany(mappedBy = "order", cascade = jakarta.persistence.CascadeType.ALL, fetch = jakarta.persistence.FetchType.LAZY, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    public void addItem(OrderItem oi) {
        items.add(oi);
        oi.setOrder(this);
    }

    public void removeItem(OrderItem oi) {
        items.remove(oi);
        oi.setOrder(null);
    }

}
