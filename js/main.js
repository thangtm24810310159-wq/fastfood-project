/* Chạy khi HTML load xong */
document.addEventListener("DOMContentLoaded", function() {

    /* Lấy dữ liệu giỏ hàng từ localStorage */
    let cart = JSON.parse(localStorage.getItem("fastfood_cart_data")) || [];

    /* Cập nhật giao diện giỏ hàng */
    function updateCartUI() {

        /* Tính tổng số lượng món */
        let totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

        /* Lấy phần tử hiển thị số lượng */
        const cartCountElement = document.getElementById("cart-count");

        /* Hiển thị số lượng */
        if (cartCountElement) cartCountElement.innerText = totalQty;

        /* Render trang giỏ hàng */
        renderCartPage();
    }

    /* Lấy tất cả nút thêm */
    const addButtons = document.querySelectorAll(".product-card .btn-add");

    /* Lặp qua từng nút thêm */
    addButtons.forEach(button => {

        /* Bắt sự kiện click */
        button.addEventListener("click", function(e) {

            /* Ngăn load trang */
            e.preventDefault();

            /* Lấy card sản phẩm */
            let card = this.closest('.product-card');

            /* Nếu không có card thì dừng */
            if(!card) return;

            /* Lấy tên sản phẩm */
            let name = card.querySelector('h3').innerText;

            /* Lấy giá */
            let priceText = card.querySelector('.price').innerText;

            /* Chuyển giá sang số */
            let price = parseInt(priceText.replace(/\D/g, ''));

            /* Lấy ảnh */
            let img = card.querySelector('img').src;

            /* Kiểm tra món đã tồn tại chưa */
            let existingItem = cart.find(item => item.name === name);

            /* Nếu có thì tăng số lượng */
            if (existingItem) {
                existingItem.quantity++;

            /* Nếu chưa có thì thêm mới */
            } else {
                cart.push({ name: name, price: price, img: img, quantity: 1 });
            }

            /* Lưu localStorage */
            localStorage.setItem("fastfood_cart_data", JSON.stringify(cart));

            /* Cập nhật UI */
            updateCartUI();

            /* Lưu text gốc */
            let originalText = this.innerText;

            /* Đổi text nút */
            this.innerText = "Đã thêm ✓";

            /* Đổi màu nút */
            this.style.backgroundColor = "#4CAF50";

            /* Sau 1 giây trả lại */
            setTimeout(() => {
                this.innerText = originalText;
                this.style.backgroundColor = "#d32f2f";
            }, 1000);
        });
    });

    /* Lấy tất cả nút xóa */
    const removeButtons = document.querySelectorAll(".btn-remove");

    /* Lặp qua từng nút */
    removeButtons.forEach(button => {

        /* Bắt sự kiện click */
        button.addEventListener("click", function(e) {

            /* Ngăn load trang */
            e.preventDefault();

            /* Lấy card */
            let card = this.closest('.product-card');

            /* Nếu không có card */
            if(!card) return;

            /* Lấy tên sản phẩm */
            let name = card.querySelector('h3').innerText;

            /* Tìm vị trí sản phẩm */
            let existingItemIndex = cart.findIndex(item => item.name === name);

            /* Nếu tìm thấy */
            if (existingItemIndex !== -1) {

                /* Giảm số lượng */
                cart[existingItemIndex].quantity--;

                /* Nếu <= 0 thì xóa */
                if (cart[existingItemIndex].quantity <= 0) {
                    cart.splice(existingItemIndex, 1);
                }

                /* Lưu localStorage */
                localStorage.setItem("fastfood_cart_data", JSON.stringify(cart));

                /* Update UI */
                updateCartUI();

                /* Lưu text cũ */
                let originalText = this.innerText;

                /* Đổi text */
                this.innerText = "Đã xóa";

                /* Đổi màu */
                this.style.background = "#ff9800";
                this.style.color = "white";

                /* Trả lại sau 1 giây */
                setTimeout(() => {
                    this.innerText = originalText;
                    this.style.background = "#e0e0e0";
                    this.style.color = "#333";
                }, 1000);

            /* Nếu chưa thêm món */
            } else {
                alert("Bạn chưa thêm món này vào giỏ!");
            }
        });
    });

    /* Nút xóa toàn bộ giỏ */
    const btnClearCart = document.getElementById("btn-clear-cart");

    /* Nếu tồn tại nút */
    if (btnClearCart) {

        /* Click xóa */
        btnClearCart.addEventListener("click", function(e) {

            /* Ngăn load */
            e.preventDefault();

            /* Reset mảng */
            cart = [];

            /* Lưu localStorage */
            localStorage.setItem("fastfood_cart_data", JSON.stringify(cart));

            /* Update giao diện */
            updateCartUI();

            /* Thông báo */
            alert("Đã làm trống giỏ hàng!");
        });
    }

    /* Render trang giỏ hàng */
    function renderCartPage() {

        /* Khung chứa sản phẩm */
        const cartContainer = document.getElementById("cart-items-container");

        /* Tổng tiền */
        const cartTotalPrice = document.getElementById("cart-total-price");

        /* Nếu không tồn tại */
        if (!cartContainer) return;

        /* Xóa HTML cũ */
        cartContainer.innerHTML = "";

        /* Tổng tiền */
        let totalPrice = 0;

        /* Nếu giỏ trống */
        if (cart.length === 0) {

            /* Hiển thị thông báo */
            cartContainer.innerHTML = "<p style='text-align:center; color:gray; padding: 20px;'>Giỏ hàng của bạn đang trống.</p>";

            /* Tổng tiền = 0 */
            if(cartTotalPrice) cartTotalPrice.innerText = "0đ";

            return;
        }

        /* Lặp qua từng sản phẩm */
        cart.forEach((item, index) => {

            /* Tính tổng */
            totalPrice += item.price * item.quantity;

            /* HTML sản phẩm */
            let itemHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #eee; padding: 15px 0;">
                    <img src="${item.img}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px;">
                    <div style="flex: 1; margin-left: 15px; text-align: left;">
                        <h4 style="margin: 0; font-size: 16px; color: #333;">${item.name}</h4>
                        <p style="margin: 5px 0 0 0; color: #d32f2f; font-weight: bold;">${item.price.toLocaleString('vi-VN')}đ</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <span style="font-weight: bold; font-size: 16px;">x${item.quantity}</span>
                        <button onclick="removeFullItem(${index})" style="background: none; border: 1px solid #d32f2f; color: #d32f2f; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">Bỏ món</button>
                    </div>
                </div>
            `;

            /* Thêm HTML */
            cartContainer.innerHTML += itemHTML;
        });

        /* Hiển thị tổng tiền */
        if(cartTotalPrice) cartTotalPrice.innerText = totalPrice.toLocaleString('vi-VN') + "đ";
    }

    /* Cập nhật UI ban đầu */
    updateCartUI();

    /* Nút thanh toán */
    const btnCheckout = document.getElementById("btn-checkout");

    /* Nếu tồn tại */
    if (btnCheckout) {

        /* Bắt sự kiện click */
        btnCheckout.addEventListener("click", function(event) {

            /* Nếu giỏ trống */
            if (cart.length === 0) {

                /* Ngăn chuyển trang */
                event.preventDefault();

                /* Thông báo */
                alert("Giỏ hàng của bạn đang trống! Hãy quay lại trang Thực đơn để chọn món nhé.");

            } else {

                /* Ngăn mặc định */
                event.preventDefault();

                /* Thông báo thành công */
                alert("🎉 Đặt hàng thành công! Tổng đài FastFood sẽ gọi xác nhận trong ít phút nữa.");

                /* Xóa giỏ */
                cart = [];

                /* Lưu localStorage */
                localStorage.setItem("fastfood_cart_data", JSON.stringify(cart));

                /* Update UI */
                updateCartUI();

                /* Chuyển trang */
                window.location.href = "index.html";
            }
        });
    }
});

/* Hàm xóa toàn bộ 1 món */
window.removeFullItem = function(index) {

    /* Lấy dữ liệu giỏ hàng */
    let cart = JSON.parse(localStorage.getItem("fastfood_cart_data")) || [];

    /* Xóa sản phẩm */
    cart.splice(index, 1);

    /* Lưu localStorage */
    localStorage.setItem("fastfood_cart_data", JSON.stringify(cart));

    /* Reload trang */
    window.location.reload();
};