package com.kimhoanngan.tiemvang.services.servicesIMPL;

import com.kimhoanngan.tiemvang.DTOs.generalsDTOs.UserDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseOrderDTO;
import com.kimhoanngan.tiemvang.DTOs.responseDTOs.ResponseOrderDetailDTO;
import com.kimhoanngan.tiemvang.DTOs.updateDTOs.UpdateOrderDTO;
import com.kimhoanngan.tiemvang.mappers.OrderDetailMapper;
import com.kimhoanngan.tiemvang.mappers.OrderMapper;
import com.kimhoanngan.tiemvang.mappers.UserMapper;
import com.kimhoanngan.tiemvang.pojos.Customer;
import com.kimhoanngan.tiemvang.pojos.Order;
import com.kimhoanngan.tiemvang.pojos.OrderDetail;
import com.kimhoanngan.tiemvang.pojos.User;
import com.kimhoanngan.tiemvang.repositories.ICustomerRepository;
import com.kimhoanngan.tiemvang.repositories.IOrderDetailRepository;
import com.kimhoanngan.tiemvang.repositories.IOrderRepository;
import com.kimhoanngan.tiemvang.repositories.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private IOrderRepository orderRepository;

    @Autowired
    private IOrderDetailRepository orderDetailRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private ICustomerRepository customerRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OrderDetailMapper orderDetailMapper;

    public List<ResponseOrderDTO> findAll() {
        List<Order> orders = orderRepository.findAll();
        List<ResponseOrderDTO> orderDTOs = new ArrayList<>();
        for (Order order : orders) {
            User sale = userRepository.findByUsername(order.getSaleStaff()).orElse(null);
            User cashier = userRepository.findByUsername(order.getCashierStaff()).orElse(null);
            User service = userRepository.findByUsername(order.getServiceStaff()).orElse(null);

            UserDTO saleDTO = sale != null ? UserMapper.toResponseDTO(sale) : null;
            UserDTO cashierDTO = cashier != null ? UserMapper.toResponseDTO(cashier) : null;
            UserDTO serviceDTO = service != null ? UserMapper.toResponseDTO(service) : null;
            orderDTOs.add(OrderMapper.toResponseDTO(order, saleDTO, cashierDTO, serviceDTO));
        }
        return orderDTOs;
    }

    public Optional<ResponseOrderDTO> findById(int id) {
        Optional<Order> orderOptional = orderRepository.findById(id);
        if (orderOptional.isEmpty()) {
            return Optional.empty();
        }
        Order order = orderOptional.get();
        User sale = userRepository.findByUsername(order.getSaleStaff()).orElse(null);
        User cashier = userRepository.findByUsername(order.getCashierStaff()).orElse(null);
        User service = userRepository.findByUsername(order.getServiceStaff()).orElse(null);

        UserDTO saleDTO = sale != null ? UserMapper.toResponseDTO(sale) : null;
        UserDTO cashierDTO = cashier != null ? UserMapper.toResponseDTO(cashier) : null;
        UserDTO serviceDTO = service != null ? UserMapper.toResponseDTO(service) : null;
        ResponseOrderDTO responseOrderDTO = OrderMapper.toResponseDTO(order, saleDTO, cashierDTO, serviceDTO);
        return Optional.of(responseOrderDTO);
    }

    public ResponseOrderDTO update(int id, UpdateOrderDTO orderDTO) {
        // Fetch existing order, throw exception if not found
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Fetch associated customer, throw exception if not found
        Customer customer = customerRepository.findById(orderDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Map UpdateOrderDTO to Order entity
        Order updatedOrder = OrderMapper.toEntity(orderDTO, customer);
        updatedOrder.setId(id);
        updatedOrder.setSaleStaff(existingOrder.getSaleStaff());
        updatedOrder.setCashierStaff(existingOrder.getCashierStaff());
        updatedOrder.setServiceStaff(existingOrder.getServiceStaff());

        // Save updated order to repository
        Order savedOrder = orderRepository.save(updatedOrder);

        // Fetch associated user details
        User sale = userRepository.findByUsername(savedOrder.getSaleStaff())
                .orElseThrow(() -> new RuntimeException("Sale staff not found"));
        User cashier = userRepository.findByUsername(savedOrder.getCashierStaff())
                .orElseThrow(() -> new RuntimeException("Cashier staff not found"));
        User service = userRepository.findByUsername(savedOrder.getServiceStaff())
                .orElseThrow(() -> new RuntimeException("Service staff not found"));

        UserDTO saleDTO = sale != null ? UserMapper.toResponseDTO(sale) : null;
        UserDTO cashierDTO = cashier != null ? UserMapper.toResponseDTO(cashier) : null;
        UserDTO serviceDTO = service != null ? UserMapper.toResponseDTO(service) : null;

        // Map saved order to ResponseOrderDTO
        ResponseOrderDTO responseOrderDTO = OrderMapper.toResponseDTO(savedOrder, saleDTO, cashierDTO, serviceDTO);

        return responseOrderDTO;
    }

    public void delete(int id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        orderRepository.delete(order);
    }

    public List<ResponseOrderDTO> getOrdersByStatus(String status) {
        List<Order> orders = orderRepository.findByStatus(status);
        List<ResponseOrderDTO> orderDTOs = new ArrayList<>();
        for (Order order : orders) {
            User sale = userRepository.findByUsername(order.getSaleStaff()).orElse(null);
            User cashier = userRepository.findByUsername(order.getCashierStaff()).orElse(null);
            User service = userRepository.findByUsername(order.getServiceStaff()).orElse(null);

            UserDTO saleDTO = sale != null ? UserMapper.toResponseDTO(sale) : null;
            UserDTO cashierDTO = cashier != null ? UserMapper.toResponseDTO(cashier) : null;
            UserDTO serviceDTO = service != null ? UserMapper.toResponseDTO(service) : null;
            orderDTOs.add(OrderMapper.toResponseDTO(order, saleDTO, cashierDTO, serviceDTO));
        }
        return orderDTOs;
    }

    public List<ResponseOrderDetailDTO> getOrderDetailsByOrderId(int id) {
        List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(id);
        List<ResponseOrderDetailDTO> orderDetailDTOs = new ArrayList<>();
        for (OrderDetail orderDetail: orderDetails) {
            orderDetailDTOs.add(orderDetailMapper.toDTO(orderDetail));
        }
        return orderDetailDTOs;
    }

    public List<ResponseOrderDTO> getOrdersBySelectTimeOption(int option) {
        List<Order> orders = new ArrayList<>();
        List<ResponseOrderDTO> orderDTOs = new ArrayList<>();

        //1 - today 2 - this week 3 - this month 4 - this year
        switch (option) {
            case 1:
                orders = orderRepository.findOrdersToday();
                break;
            case 2:
                orders = orderRepository.findOrdersThisWeek();
                break;
            case 3:
                orders = orderRepository.findOrdersThisMonth();
                break;
            case 4:
                orders = orderRepository.findOrdersThisYear();
                break;
        }
        for (Order order : orders) {
            User sale = userRepository.findByUsername(order.getSaleStaff()).orElse(null);
            User cashier = userRepository.findByUsername(order.getCashierStaff()).orElse(null);
            User service = userRepository.findByUsername(order.getServiceStaff()).orElse(null);

            UserDTO saleDTO = sale != null ? UserMapper.toResponseDTO(sale) : null;
            UserDTO cashierDTO = cashier != null ? UserMapper.toResponseDTO(cashier) : null;
            UserDTO serviceDTO = service != null ? UserMapper.toResponseDTO(service) : null;
            orderDTOs.add(OrderMapper.toResponseDTO(order, saleDTO, cashierDTO, serviceDTO));
        }
        return orderDTOs;
    }

    public boolean sendReport(String to) {
        try {
            LocalDate currentDate = LocalDate.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            String formattedDate = currentDate.format(formatter);

            List<ResponseOrderDTO> orderDTOs = getOrdersBySelectTimeOption(4);
            double total = 0;
            int quantity = 0;
            for (ResponseOrderDTO orderDTO : orderDTOs) {
                quantity++;
                total += orderDTO.getTotal();
            }

            String htmlContent = "<h2 style='color: green'>Báo cáo cửa hàng hôm nay:</h2>"
                    + "<div style='display: flex; align-items: center;'>"
                    + "<h4 style='margin: 0; padding-right: 10px;'>Tổng số lượng đơn hàng hôm nay:</h4>"
                    + "<p style='color: red; margin: 0;'>" + quantity + "</p></div>"
                    + "<div style='display: flex; align-items: center;'>"
                    + "<h4 style='margin: 0; padding-right: 10px;'>Tổng doanh thu cửa hàng hôm nay:</h4>"
                    + "<p style='color: red; margin: 0;'>" + total + "</p></div>";


            emailService.sendHtmlEmail(to, "Báo cáo doanh thu ngày " +formattedDate, htmlContent);
        } catch(Exception e) {
            return false;
        }
        return true;
    }
}
