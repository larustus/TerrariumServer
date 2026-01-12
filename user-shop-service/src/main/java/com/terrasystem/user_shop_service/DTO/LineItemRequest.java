package com.terrasystem.user_shop_service.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;


public class LineItemRequest {

    @NotNull
    private Integer itemId;

    @NotNull
    @Min(1)
    private Integer quantity;

    public Integer getItemId() {
        return itemId;
    }

    public void setItemId(Integer itemId) {
        this.itemId = itemId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
