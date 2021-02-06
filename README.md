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

### 設定変更
vi config/connections.js

DBのユーザーとパスワードを設定

### node.jsインストール
yum install nodejs npm

npm install -g n

npm install -g forever

n v8.11.4

npm install

npm install bcryptjs

#### 動作確認
node app.js --prod

#### 永続動作
forever start -c "n use 8.11.4 --expose-gc" app.js --prod

### 起動できたがブラウザから表示できない場合
####ポート開放
firewall-cmd --add-port=1337/tcp --zone=public --permanent

firewall-cmd --reload

firewall-cmd --list-all --zone=public
