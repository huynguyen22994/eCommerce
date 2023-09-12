# eCommerce

## Access Service
- HMAC (Hash-based Message Authentication Code) là một thuật toán mã hóa được sử dụng để xác thực tính toàn vẹn và nguồn gốc của một thông điệp. Xử dụng thuật toán bất đối xứng để lấy primary key và public key dùng để sign và verify token
- Sử dụng refreshToken để cấp lại accessToken cho shop.
- Sử dụng refreshTokenUsed để lưu lại các refreshToken đã hết hạn đồng, track token nghi ngờ là hacker

## Cart Service
- Kỹ thuật khi User checkout một giỏ hàng:
    1. Optimistic Locks (khóa lạc quan): apply Redis
    2. Pesimistic Locks (khoá bi quan):

## Transaction Redis
Khái niệm Transaction:

    - Là tập hợp các lệnh thực hiện mà kết quả là -> 1 là thành công, 2 là thất bại 
    - Thành công khi tất cả các lệnh đều thành công
    - Thất bại khi chỉ cần 1 lệnh fail là thất bại

Keywords Transaction trong Redis: Watch, Multi, Exec, Discard

- Ví dụ 1: Dùng Multi tạo ra queue để thực hiện danh sách lệnh và thành công

![](/images/multi-redis.png)

- Ví dụ 2: Dùng Multi tạo ra queue để thực hiện danh sách lệnh nhưng thất bại vì có 1 lệnh chạy fail

![](/images/multi-redis-err.png)

- Ví dụ 3: kết hợp với Watch. Dùng watch để nhìn một key và nếu key đó đang trong tiến trình của Multi để thực hiện các lệnh mà có sự thay đổi từ một luồng bên ngoài thì Luồng Multi đó sẽ thất bại

![](/images/watch-redis.png)