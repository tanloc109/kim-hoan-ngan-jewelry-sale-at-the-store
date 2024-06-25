package com.kimhoanngan.tiemvang.services.servicesIMPL;

import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddCartItemDTO;
import com.kimhoanngan.tiemvang.DTOs.addDTOs.CheckoutDTO;
import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddPaymentDTO;
import com.kimhoanngan.tiemvang.DTOs.addDTOs.AddWarrantyDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.*;
import com.kimhoanngan.tiemvang.mappers.*;
import com.kimhoanngan.tiemvang.pojos.*;
import com.kimhoanngan.tiemvang.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final ConcurrentHashMap<String, Cart> userCarts = new ConcurrentHashMap<>();

    @Autowired
    private IProductRepository productRepository;

    @Autowired
    private ICustomerRepository customerRepository;

    @Autowired
    private IOrderRepository orderRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IOrderDetailRepository orderDetailRepository;

    @Autowired
    private IPaymentRepository paymentRepository;

    @Autowired
    private IWarrantyRepository warrantyRepository;
    
    @Autowired
    private ProductMapper productMapper;
    
    @Autowired
    private WarrantyMapper warrantyMapper;

    @Autowired
    private PaymentMapper paymentMapper;

    public ResponseCartDTO getCart(String username) {
        Cart cart = userCarts.computeIfAbsent(username, k -> new Cart());
        List<ResponseCartItemDTO> itemsDTO = cart.getItems().values().stream()
                .map(cartItem -> new ResponseCartItemDTO(
                        productMapper.toResponseDTO(cartItem.getProduct()),
                        cartItem.getQuantity()
                ))
                .collect(Collectors.toList());
        return new ResponseCartDTO(itemsDTO);
    }

    public ResponseCartDTO addItemToCart(String username, AddCartItemDTO addCartItemDTO) {
        Cart cart = getCartV2(username);
        Product product = productRepository.findById(addCartItemDTO.getProductId()).orElseThrow();
        int productId = addCartItemDTO.getProductId();
        CartItem existingItem = cart.getItems().get(productId);
        CartItem newItem = new CartItem();
        newItem.setProduct(product);
        newItem.setQuantity(addCartItemDTO.getQuantity());

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + addCartItemDTO.getQuantity());
        } else {
            cart.addItem(newItem);
        }

        List<ResponseCartItemDTO> itemsDTO = cart.getItems().values().stream()
                .map(cartItem -> new ResponseCartItemDTO(
                        productMapper.toResponseDTO(cartItem.getProduct()),
                        cartItem.getQuantity()
                ))
                .collect(Collectors.toList());

        return new ResponseCartDTO(itemsDTO);
    }

    public void removeItemFromCart(String username, int productId, int quantity) {
        Cart cart = getCartV2(username);
        CartItem existingItem = cart.getItems().get(productId);

        if (existingItem != null) {
            int newQuantity = existingItem.getQuantity() - quantity;
            if (newQuantity > 0) {
                existingItem.setQuantity(newQuantity);
            } else {
                cart.removeItem(productId);
            }
        }
    }

    public Cart getCartV2(String username) {
        return userCarts.computeIfAbsent(username, k -> new Cart());
    }

    public ResponseOrderDTO checkout(String username, CheckoutDTO addOrderDTO) {
        Order order = new Order();
        order.setOrderTime(new Timestamp(System.currentTimeMillis()));
        order.setStatus("Đợi thanh toán");
        order.setSaleStaff(username);
        ResponseCartDTO responseCartDTO = getCart(username);
        List<ResponseCartItemDTO> itemsDTOs = responseCartDTO.getItems();
        double total = 0;
        int totalQuantity = 0;
        for (ResponseCartItemDTO itemDTO : itemsDTOs) {
            double itemTotal = itemDTO.getQuantity() * itemDTO.getProduct().getPrice();
            total += itemTotal;
            totalQuantity += itemDTO.getQuantity();
        }
        order.setTotal(total);
        order.setTotalQuantity(totalQuantity);
        Customer customer = customerRepository.findById(addOrderDTO.getCustomerId()).orElseThrow();
        order.setCustomer(customer);
        User sales = userRepository.findByUsername(username).orElseThrow();
        order.setUser(sales);
        Order createdOrder = orderRepository.save(order);
        for (ResponseCartItemDTO itemDTO : itemsDTOs) {
            Product product = productRepository.findById(itemDTO.getProduct().getId()).orElseThrow(() -> new RuntimeException("Not found product !"));
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setPrice(itemDTO.getProduct().getPrice());
            orderDetail.setQuantity(itemDTO.getQuantity());
            orderDetail.setProduct(product);
            orderDetail.setOrder(order);
            OrderDetail createdOrderDetail = orderDetailRepository.save(orderDetail);
            System.out.println(createdOrderDetail);
        }

        // Clear the cart after checkout
        Cart cart = getCartV2(username);
        cart.clear();

        ResponseOrderDTO responseOrderDTO = new ResponseOrderDTO();
        responseOrderDTO.setId(createdOrder.getId());
        responseOrderDTO.setTotalQuantity(createdOrder.getTotalQuantity());
        responseOrderDTO.setOrderTime(createdOrder.getOrderTime());
        responseOrderDTO.setTotal(createdOrder.getTotal());
        responseOrderDTO.setCustomer(CustomerMapper.toResponseDTO(createdOrder.getCustomer()));

        responseOrderDTO.setSaleStaff(UserMapper.toResponseDTO(sales));
        responseOrderDTO.setStatus(createdOrder.getStatus());
        return responseOrderDTO;
    }

    public ResponsePaymentDTO payOrder(String username, AddPaymentDTO addPaymentDTO) throws IOException {
        Order order = orderRepository.findById(addPaymentDTO.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus("Đã thanh toán");
        order.setCashierStaff(username);
        orderRepository.save(order);

        // Tạo đối tượng Payment từ AddPaymentDTO và lưu trữ ảnh ngân hàng
        Payment payment = paymentMapper.toEntity(addPaymentDTO, order);
        payment.setPaymentTime(new Timestamp(System.currentTimeMillis()));
        paymentRepository.save(payment);

        return paymentMapper.toResponseDTO(payment);
    }

    public List<ResponseWarrantyDTO> exportWarranty(String username, AddWarrantyDTO addWarrantyDTO) {
        List<ResponseWarrantyDTO> responseWarrantyDTOs = new ArrayList<>();
        Order order = orderRepository.findById(addWarrantyDTO.getOrderId()).orElseThrow();
        order.setStatus("Đã hoàn thành");
        order.setServiceStaff(username);
        orderRepository.save(order);
        List<OrderDetail> orderDetails = order.getOrderDetails();
        for (OrderDetail orderDetail : orderDetails) {
            for (int i = 0; i < orderDetail.getQuantity(); i++) {
                Warranty warranty = new Warranty();
                warranty.setStartDate(new Timestamp(System.currentTimeMillis()));
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(warranty.getStartDate());

                calendar.add(Calendar.MONTH, orderDetail.getProduct().getNumOfWarranty());
                warranty.setEndDate(new Timestamp(calendar.getTime().getTime()));

                warranty.setOrderDetail(orderDetail);
                warranty.setCustomer(orderDetail.getOrder().getCustomer());
                warranty.setProduct(orderDetail.getProduct());
                warranty.setActive((warranty.getEndDate()).after(new Timestamp(System.currentTimeMillis())));

                warrantyRepository.save(warranty);

                responseWarrantyDTOs.add(warrantyMapper.toResponseDTO(warranty));
            }
        }

        return responseWarrantyDTOs;
    }
}
