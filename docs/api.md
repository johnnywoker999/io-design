# TrendTech Mall API 文檔

## 基礎信息

- 基礎URL: `https://api.trendtech.com/v1`
- 所有請求都需要在header中攜帶認證信息：`Authorization: Bearer <token>`
- 響應格式統一為JSON
- 時間格式統一為ISO 8601: `YYYY-MM-DDTHH:mm:ss.sssZ`

## 狀態碼說明

- 200: 請求成功
- 201: 創建成功
- 400: 請求參數錯誤
- 401: 未授權
- 403: 權限不足
- 404: 資源不存在
- 500: 服務器錯誤

## 通用響應格式

```json
{
    "code": 200,
    "message": "操作成功",
    "data": {}
}
```

## API 端點

### 用戶認證

#### 登錄

```
POST /auth/login
```

請求參數：
```json
{
    "email": "string",
    "password": "string"
}
```

響應：
```json
{
    "code": 200,
    "message": "登錄成功",
    "data": {
        "token": "string",
        "user": {
            "id": "string",
            "name": "string",
            "email": "string",
            "avatar": "string",
            "role": "string"
        }
    }
}
```

#### 註冊

```
POST /auth/register
```

請求參數：
```json
{
    "name": "string",
    "email": "string",
    "password": "string",
    "confirmPassword": "string"
}
```

### 商品管理

#### 獲取商品列表

```
GET /products
```

查詢參數：
- `page`: 頁碼（默認1）
- `limit`: 每頁數量（默認20）
- `category`: 商品分類
- `sort`: 排序方式（price_asc/price_desc/created_at_desc）
- `keyword`: 搜索關鍵詞

響應：
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "total": 100,
        "items": [{
            "id": "string",
            "name": "string",
            "description": "string",
            "price": 0,
            "originalPrice": 0,
            "images": ["string"],
            "category": "string",
            "tags": ["string"],
            "stock": 0,
            "status": "on_sale",
            "createdAt": "string"
        }]
    }
}
```

#### 獲取商品詳情

```
GET /products/{id}
```

響應：
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": "string",
        "name": "string",
        "description": "string",
        "price": 0,
        "originalPrice": 0,
        "images": ["string"],
        "category": "string",
        "tags": ["string"],
        "stock": 0,
        "status": "on_sale",
        "specifications": {
            "size": ["string"],
            "color": ["string"]
        },
        "details": "string",
        "createdAt": "string",
        "updatedAt": "string"
    }
}
```

### 購物車

#### 獲取購物車

```
GET /cart
```

響應：
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "items": [{
            "id": "string",
            "productId": "string",
            "name": "string",
            "price": 0,
            "quantity": 0,
            "image": "string",
            "specifications": {
                "size": "string",
                "color": "string"
            }
        }],
        "total": 0
    }
}
```

#### 添加商品到購物車

```
POST /cart/items
```

請求參數：
```json
{
    "productId": "string",
    "quantity": 0,
    "specifications": {
        "size": "string",
        "color": "string"
    }
}
```

### 訂單管理

#### 創建訂單

```
POST /orders
```

請求參數：
```json
{
    "items": [{
        "productId": "string",
        "quantity": 0,
        "specifications": {
            "size": "string",
            "color": "string"
        }
    }],
    "address": {
        "name": "string",
        "phone": "string",
        "province": "string",
        "city": "string",
        "district": "string",
        "detail": "string"
    },
    "paymentMethod": "string"
}
```

#### 獲取訂單列表

```
GET /orders
```

查詢參數：
- `page`: 頁碼
- `limit`: 每頁數量
- `status`: 訂單狀態

響應：
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "total": 0,
        "items": [{
            "id": "string",
            "orderNo": "string",
            "status": "string",
            "total": 0,
            "items": [{
                "productId": "string",
                "name": "string",
                "price": 0,
                "quantity": 0,
                "image": "string",
                "specifications": {
                    "size": "string",
                    "color": "string"
                }
            }],
            "address": {
                "name": "string",
                "phone": "string",
                "province": "string",
                "city": "string",
                "district": "string",
                "detail": "string"
            },
            "paymentMethod": "string",
            "createdAt": "string"
        }]
    }
}
```

### 用戶中心

#### 獲取用戶信息

```
GET /user/profile
```

響應：
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": "string",
        "name": "string",
        "email": "string",
        "phone": "string",
        "avatar": "string",
        "gender": "string",
        "birthday": "string",
        "addresses": [{
            "id": "string",
            "name": "string",
            "phone": "string",
            "province": "string",
            "city": "string",
            "district": "string",
            "detail": "string",
            "isDefault": true
        }]
    }
}
```

#### 更新用戶信息

```
PUT /user/profile
```

請求參數：
```json
{
    "name": "string",
    "phone": "string",
    "gender": "string",
    "birthday": "string"
}
```

### 收藏管理

#### 獲取收藏列表

```
GET /favorites
```

查詢參數：
- `page`: 頁碼
- `limit`: 每頁數量

響應：
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "total": 0,
        "items": [{
            "id": "string",
            "productId": "string",
            "name": "string",
            "price": 0,
            "image": "string",
            "createdAt": "string"
        }]
    }
}
```

#### 添加收藏

```
POST /favorites
```

請求參數：
```json
{
    "productId": "string"
}
```

### 評論管理

#### 獲取商品評論

```
GET /products/{id}/reviews
```

查詢參數：
- `page`: 頁碼
- `limit`: 每頁數量
- `rating`: 評分

響應：
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "total": 0,
        "items": [{
            "id": "string",
            "userId": "string",
            "userName": "string",
            "userAvatar": "string",
            "rating": 0,
            "content": "string",
            "images": ["string"],
            "createdAt": "string"
        }]
    }
}
```

#### 發表評論

```
POST /products/{id}/reviews
```

請求參數：
```json
{
    "rating": 0,
    "content": "string",
    "images": ["string"]
}
```

## 錯誤碼說明

| 錯誤碼 | 說明 |
|--------|------|
| 1001 | 用戶未登錄 |
| 1002 | token已過期 |
| 1003 | token無效 |
| 2001 | 商品不存在 |
| 2002 | 商品已下架 |
| 2003 | 商品庫存不足 |
| 3001 | 購物車為空 |
| 3002 | 購物車商品已失效 |
| 4001 | 訂單創建失敗 |
| 4002 | 支付失敗 |
| 5001 | 用戶信息更新失敗 |

## 注意事項

1. 所有涉及金額的字段單位均為分
2. 圖片URL為完整的HTTP(S)地址
3. 時間戳統一使用ISO 8601格式
4. 分頁接口均支持排序功能，默認按創建時間倒序
5. 文件上傳接口另行提供