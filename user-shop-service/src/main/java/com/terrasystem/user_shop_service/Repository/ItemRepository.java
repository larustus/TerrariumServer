package com.terrasystem.user_shop_service.Repository;

import com.terrasystem.user_shop_service.Entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Integer> { }
