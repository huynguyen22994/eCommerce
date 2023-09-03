# eCommerce

## Access Service
- HMAC (Hash-based Message Authentication Code) là một thuật toán mã hóa được sử dụng để xác thực tính toàn vẹn và nguồn gốc của một thông điệp. Xử dụng thuật toán bất đối xứng để lấy primary key và public key dùng để sign và verify token
- Sử dụng refreshToken để cấp lại accessToken cho shop.
- Sử dụng refreshTokenUsed để lưu lại các refreshToken đã hết hạn đồng, track token nghi ngờ là hacker

## Cart Service
- Kỹ thuật khi User checkout một giỏ hàng:
    1. Optimistic Locks (khóa lạc quan): apply Redis