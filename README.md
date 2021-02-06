# duel_node

### mysqlインストール
dnf install @mysql:8.0

systemctl enable mysqld

systemctl start mysqld

### mysqlパスワードポリシー変更
vi /etc/my.cnf.d/mysql-server.cnf

```
[mysqld]内に以下を追記
validate_password.length=4
validate_password.mixed_case_count=0
validate_password.number_count=0
validate_password.policy=0
validate_password.special_char_count=0
```

systemctl restart mysqld.service

### mysql設定
mysql_secure_installation

基本はyesでパスワードは任意
