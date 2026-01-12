package com.terrasystem.user_shop_service.DTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class PlaceOrderRequest {

    @NotEmpty
    @Valid
    private List<LineItemRequest> items;

    public List<LineItemRequest> getItems() {
        return items;
    }

    public void setItems(List<LineItemRequest> items) {
        this.items = items;
    }
}
