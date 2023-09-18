# eCommerce

## Access Service
- HMAC (Hash-based Message Authentication Code) là một thuật toán mã hóa được sử dụng để xác thực tính toàn vẹn và nguồn gốc của một thông điệp. Dùng để xác thực tính toàn vẹn dữ liệu được gửi từ Client đến Server
- Xử dụng thuật toán bất đối xứng để lấy primary key và public key dùng để sign và verify acessToken và refreshToken
- Sử dụng refreshToken để cấp lại accessToken cho shop.
- Sử dụng refreshTokenUsed để lưu lại các refreshToken đã hết hạn đồng thời track token nghi ngờ là hacker

![](/images/hmac-2.png)

## Cart Service
- Kỹ thuật khi User checkout một giỏ hàng:
    1. Optimistic Locks (khóa lạc quan): apply Redis
    2. Pesimistic Locks (khoá bi quan): https://github.com/huynguyen22994/Tips/tree/main/OptimisticLocking-PessimisticLocking

![](/images/pessimictic.png)    

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

## Thuật toán Nested set model

Nested Set Model (mô hình cây lồng nhau) là một cách tổ chức dữ liệu cây trong cơ sở dữ liệu quan hệ. Mô hình này sử dụng hai cột để đại diện cho mỗi node trong cây, một cột để lưu trữ giá trị bắt đầu (left) và một cột để lưu trữ giá trị kết thúc (right). Các node con nằm giữa giá trị bắt đầu và kết thúc của node cha.

Nested Set Model thích hợp để sử dụng khi bạn cần lưu trữ và truy vấn dữ liệu theo cấu trúc cây. Nó phù hợp cho các trường hợp sử dụng như danh mục sản phẩm, tổ chức công ty, danh sách bình luận, v.v. Tuy nhiên, việc sử dụng Nested Set Model cũng có nhược điểm là cần phải cập nhật lại các giá trị bắt đầu và kết thúc khi thực hiện các thao tác thay đổi cấu trúc cây.

![](/images/nestedset.gif)
![](/images/nestedset2.gif)
![](/images/nestedset3.png)

Sơ đồ để xóa một node trong Nested

![](/images/delete-nestedsetmodel.png)

## Những kỹ thuật giúp cho Query dữ liệu một các nhanh chóng (Dùng với MongoDB)

- 1. Đánh Index các trường thường xuyên query của collecttion
- 2. Dùng pagination để giới hạn records cho mỗi làn truy vấn
- 3. Dùng kỹ thuật Sharing trong database => kỹ thuật phân tán dữ liệu trên nhiều node
- 4. Cache: lưu trữ dử liệu thông báo truy vấn thường xuyên để giảm truy vấn trên DB
- 5. Xử lý bất đồng bộ hệ thống

## Kiến trúc Push và Pull cho Hệ Thống Notification

- Push là hệ thống sẽ triển khai CronJob để đều đặn một thời gian hệ thống sẽ thực hiện yêu cầu gửi thông bao đến những user có notice.
- Pull là khi một user truy cập vào hệ thống thì sẽ gọi một request từ user đó đến hệ thống notification để yêu cầu thực hiện truy vấn những noti của user đó và trả lại notice cho user đó.

=> 2 các đều có ưu và nhuộc điểm khác nhau. Nhưng một hệ thống tối ưu hiệu suất có thể kết hợp cả 2 cách. Nâng cao hơn dùng Message Queue cho hệ thống Notification

![](/images/push-pull-notice.png)