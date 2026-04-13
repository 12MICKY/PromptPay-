# PromptPay QR Web App with Docker

โปรเจกต์นี้เป็นเว็บแอปแบบ static ที่ถูกออกแบบให้รันผ่าน Docker ได้ง่าย

จุดสำคัญของ README นี้คืออธิบายเรื่อง **Docker ว่าทำอะไร, ใช้ทำไม, และใช้กับโปรเจกต์นี้อย่างไร**

แม้ตัวเว็บจะเป็น PromptPay QR Web App แต่เอกสารนี้จะเน้นเรื่องการใช้งานและ deploy ผ่าน Docker เป็นหลัก

## ทดลองใช้งานเว็บ

สามารถเข้าใช้งานจริงได้ที่:

**https://promptpay.thiraphat.work**

ลิงก์นี้เป็นตัวอย่าง deployment จริงของโปรเจกต์นี้บน server ผ่าน Docker และ Cloudflare Tunnel

## อ้างอิงเกี่ยวกับ PromptPay

โปรเจกต์นี้เป็นเว็บแอปสำหรับสร้าง QR ของ PromptPay ดังนั้นคำอธิบายและแนวคิดของระบบอ้างอิงจากข้อมูลของหน่วยงานและผู้ให้บริการที่เกี่ยวข้องกับ PromptPay โดยตรง

สรุปสั้น ๆ จากแหล่งอ้างอิง:

- PromptPay เป็นโครงสร้างพื้นฐานการชำระเงินของประเทศไทยที่ช่วยให้โอนหรือรับเงินได้สะดวก รวดเร็ว และมีค่าธรรมเนียมต่ำลง
- การผูกพร้อมเพย์สามารถอ้างอิงกับข้อมูลอย่างหมายเลขโทรศัพท์มือถือหรือเลขประจำตัวประชาชน
- PromptPay เป็นส่วนหนึ่งของโครงสร้างพื้นฐานการชำระเงินดิจิทัลของไทย และยังถูกต่อยอดไปสู่บริการ QR Payment และการเชื่อมโยงการชำระเงินระหว่างประเทศ

แหล่งอ้างอิงหลัก:

- ธนาคารแห่งประเทศไทย: หน้าแนะนำ PromptPay  
  https://www.bot.or.th/th/financial-innovation/digital-finance/digital-payment/promptpay.html

- สมาคมธนาคารไทย: หน้าบริการพร้อมเพย์  
  https://www.tba.or.th/pso-tb-cert/pso/pso-service/

- ธนาคารแห่งประเทศไทย: หน้า Cross-Border Payment ที่กล่าวถึงการต่อยอดระบบ PromptPay  
  https://www.bot.or.th/th/financial-innovation/digital-finance/digital-payment/cross-border-payment.html

หมายเหตุ:

- README นี้อธิบาย Docker เป็นหลัก
- ส่วนของ PromptPay ที่กล่าวถึงในเอกสารนี้เป็นการอธิบายภาพรวม เพื่อบอกว่าตัวเว็บนี้ถูกนำไปใช้กับระบบลักษณะใด
- หากต้องการใช้งาน PromptPay ในเชิงธุรกิจหรือเชิงกฎหมาย ควรตรวจสอบข้อมูลล่าสุดจากแหล่งทางการโดยตรง

## Docker คืออะไร

Docker คือเครื่องมือสำหรับทำให้แอปของเรารันอยู่ในสภาพแวดล้อมที่ถูกแพ็กไว้เป็นชุดเดียว เรียกว่า `container`

พูดง่าย ๆ คือ:

- เรามีโค้ด
- เรามี runtime ที่ต้องใช้
- เรามี web server ที่ต้องใช้
- เราแพ็กรวมกันเป็น image
- จากนั้นเอา image นั้นไปรันเป็น container ที่ไหนก็ได้

แนวคิดสำคัญคือ:

- เขียนครั้งเดียว
- รันได้เหมือนกันทุกเครื่อง
- ลดปัญหา “เครื่องฉันรันได้ แต่เครื่องอื่นรันไม่ได้”

## ทำไมโปรเจกต์นี้ถึงใช้ Docker

แม้โปรเจกต์นี้จะเป็นเว็บ static ธรรมดา แต่การใช้ Docker มีข้อดีชัดเจน:

### 1. ทำให้ deploy ง่าย

แทนที่จะต้อง:

- ติดตั้ง Nginx เอง
- ตั้งค่า path เอง
- copy ไฟล์เอง
- แก้ config เอง

เราสามารถใช้:

```bash
docker build -t promptpay-qr-app .
docker run -d -p 8082:80 promptpay-qr-app
```

แล้วเว็บก็พร้อมใช้งานทันที

### 2. สภาพแวดล้อมเหมือนกันทุกที่

ไม่ว่าจะรันบน:

- เครื่อง local
- VM
- server จริง
- cloud machine

ผลลัพธ์จะเหมือนกัน เพราะใช้ image เดียวกัน

### 3. แยกตัวแอปออกจากเครื่องหลัก

ตัวเว็บจะไม่ไปปนกับ system package บนเครื่อง เช่น:

- ไม่ต้องติดตั้ง Nginx ลงเครื่องโดยตรง
- ไม่ต้องวางไฟล์เว็บปนกับเว็บอื่น
- ไม่ต้องแก้ environment หลักของเซิร์ฟเวอร์

ทุกอย่างถูกแยกอยู่ใน container

### 4. ง่ายต่อการย้ายเครื่อง

ถ้าจะย้ายแอปนี้ไปอีกเครื่องหนึ่ง:

- copy source code
- build docker image
- run container

จบ

### 5. ง่ายต่อการ restart / update / rollback

เมื่อมีการแก้หน้าเว็บ:

- build image ใหม่
- ลบ container เดิม
- run container ใหม่

ไม่ต้องแกะ config ระบบหลักเยอะ

## Docker ใช้อะไรในโปรเจกต์นี้

ในโปรเจกต์นี้ Docker ถูกใช้เพื่อ:

- แพ็กหน้าเว็บทั้งหมด
- ใช้ Nginx เป็น web server ภายใน container
- serve ไฟล์ `index.html`, `styles.css`, `app.js` และไฟล์ static อื่น ๆ

พูดอีกแบบคือ:

Docker ไม่ได้ใช้สร้าง QR

Docker ใช้เพื่อ:

- เอาเว็บขึ้นรัน
- เสิร์ฟเว็บให้คนเข้าใช้งาน
- ทำให้ deploy ได้ง่ายและเป็นระบบ

## โครงสร้างไฟล์ที่เกี่ยวกับ Docker

```text
.
├── Dockerfile
├── nginx.conf
├── .dockerignore
├── index.html
├── styles.css
├── app.js
├── manifest.json
└── sw.js
```

ไฟล์สำคัญฝั่ง Docker มี 3 ตัว:

### `Dockerfile`

เป็นไฟล์ที่ใช้บอก Docker ว่า:

- จะเริ่มจาก image อะไร
- จะ copy ไฟล์อะไรเข้า image
- จะ expose port อะไร

### `nginx.conf`

เป็น config ของ Nginx ภายใน container

หน้าที่คือ:

- รับ request HTTP
- เสิร์ฟไฟล์เว็บ
- ส่ง `index.html` กลับไปเมื่อเข้าหน้าหลัก

### `.dockerignore`

ใช้บอก Docker ว่าไฟล์ไหนไม่ต้อง copy เข้า image

เช่น:

- `.git`
- `.codex`
- log file

ข้อดีคือ:

- image เล็กลง
- build เร็วขึ้น
- ไม่เอาไฟล์ไม่จำเป็นติดเข้า production

## อธิบาย Dockerfile

ไฟล์:

```dockerfile
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html

EXPOSE 80
```

อธิบายทีละบรรทัด:

### `FROM nginx:1.27-alpine`

เริ่มจาก image ของ Nginx เวอร์ชัน Alpine

เหตุผลที่ใช้:

- เบา
- เร็ว
- เหมาะกับ static site
- ไม่ต้องติดตั้ง web server เอง

### `COPY nginx.conf /etc/nginx/conf.d/default.conf`

เอา config Nginx ของโปรเจกต์นี้เข้าไปแทนค่า default ของ container

เพื่อให้ Nginx เสิร์ฟเว็บในรูปแบบที่เราต้องการ

### `COPY . /usr/share/nginx/html`

copy ไฟล์ทั้งหมดในโปรเจกต์เข้าไปในโฟลเดอร์เว็บของ Nginx

นั่นหมายความว่าไฟล์พวกนี้จะถูกเสิร์ฟออกมา:

- `index.html`
- `styles.css`
- `app.js`
- `manifest.json`
- `sw.js`

### `EXPOSE 80`

บอกว่า container นี้เปิดบริการที่ port `80`

ตัวอย่างเวลา run:

```bash
docker run -p 8082:80 promptpay-qr-app
```

ความหมายคือ:

- ฝั่งเครื่อง host ใช้ port `8082`
- ฝั่งใน container ใช้ port `80`

## อธิบาย nginx.conf

ไฟล์:

```nginx
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### `listen 80;`

Nginx รอฟัง request ที่ port `80` ภายใน container

### `root /usr/share/nginx/html;`

กำหนดว่าไฟล์เว็บอยู่ที่โฟลเดอร์นี้

### `index index.html;`

เมื่อผู้ใช้เข้า `/` ให้เปิด `index.html`

### `try_files $uri $uri/ /index.html;`

สั่งให้ Nginx ลองหาไฟล์ตาม path ก่อน

ถ้าไม่เจอ ก็ fallback ไป `index.html`

ข้อดี:

- ใช้ได้ดีกับเว็บหน้าเดียว
- ป้องกันปัญหา path แล้ว 404

## อธิบาย .dockerignore

ตัวอย่าง:

```dockerignore
.git
.codex
*.log
*.tmp
```

ไฟล์นี้ช่วยให้ Docker ไม่เอาไฟล์เหล่านี้เข้า build context

ผลลัพธ์คือ:

- build เร็วขึ้น
- image สะอาดขึ้น
- ไม่เอาข้อมูลที่ไม่จำเป็นไปด้วย

## Docker Workflow ของโปรเจกต์นี้

ลำดับการทำงานจริง:

1. เขียนหรือแก้ไฟล์เว็บ
2. build docker image
3. run docker container
4. เปิดผ่าน browser
5. ถ้าจะแก้ใหม่ ให้ build ใหม่แล้ว run ใหม่

## วิธี build Docker image

อยู่ในโฟลเดอร์โปรเจกต์ แล้วรัน:

```bash
docker build -t promptpay-qr-app .
```

คำอธิบาย:

- `docker build`
  คือการสร้าง image

- `-t promptpay-qr-app`
  ตั้งชื่อ image ว่า `promptpay-qr-app`

- `.`
  หมายถึงใช้โฟลเดอร์ปัจจุบันเป็น build context

## วิธีรัน container

```bash
docker run -d --name promptpay-qr-app -p 8082:80 --restart unless-stopped promptpay-qr-app
```

อธิบาย:

- `-d`
  รันแบบ background

- `--name promptpay-qr-app`
  ตั้งชื่อ container

- `-p 8082:80`
  map port จากเครื่อง host ไปยัง container

- `--restart unless-stopped`
  ถ้าเครื่อง reboot container จะกลับมารันเอง

- `promptpay-qr-app`
  ชื่อ image ที่จะเอามารัน

## วิธีเปิดใช้งานเว็บหลังรัน Docker

ถ้ารันบนเครื่องตัวเอง:

```text
http://localhost:8082
```

ถ้ารันบน server:

```text
http://SERVER_IP:8082
```

ตัวอย่าง:

```text
http://10.33.1.34:8082
```

## คำสั่ง Docker ที่ควรรู้

### ดู container ที่กำลังรัน

```bash
docker ps
```

### ดู image ที่มีในเครื่อง

```bash
docker images
```

### หยุด container

```bash
docker stop promptpay-qr-app
```

### เปิด container กลับมา

```bash
docker start promptpay-qr-app
```

### ลบ container

```bash
docker rm -f promptpay-qr-app
```

### ลบ image

```bash
docker rmi promptpay-qr-app
```

## วิธีอัปเดตเว็บหลังแก้โค้ด

ถ้ามีการแก้หน้าเว็บแล้วต้องการ deploy ใหม่:

```bash
docker build -t promptpay-qr-app .
docker rm -f promptpay-qr-app
docker run -d --name promptpay-qr-app -p 8082:80 --restart unless-stopped promptpay-qr-app
```

แนวคิดคือ:

- สร้าง image ใหม่
- ปิดของเก่า
- เปิดของใหม่

## ทำไมไม่ใช้ Python HTTP Server ใน production

ตอนพัฒนา local เราสามารถใช้:

```bash
python3 -m http.server 8000
```

ได้ เพราะมันง่าย

แต่ใน production Docker + Nginx ดีกว่า เพราะ:

- เสถียรกว่า
- เหมาะกับเว็บ static จริง
- จัดการ port และ restart ได้ง่าย
- อยู่ใน container ชัดเจน
- deploy บน server ได้เป็นระบบกว่า

## ตัวอย่างการใช้งานบนเซิร์ฟเวอร์จริง

ในโปรเจกต์นี้มีการนำไปรันบน server จริงแล้วด้วย flow แบบนี้:

1. copy ไฟล์ขึ้นเซิร์ฟเวอร์
2. build image บน server
3. run container ที่ port `8082`
4. เอา Cloudflare Tunnel ชี้เข้ามาที่ `http://10.33.1.34:8082`

ตัวอย่าง command:

```bash
sudo docker build -t promptpay-qr-app .
sudo docker run -d --name promptpay-qr-app -p 8082:80 --restart unless-stopped promptpay-qr-app
```

## ใช้ Docker ร่วมกับ Cloudflare Tunnel อย่างไร

Docker ทำหน้าที่:

- รันเว็บแอปในเครื่องเซิร์ฟเวอร์

Cloudflare Tunnel ทำหน้าที่:

- รับโดเมนจากภายนอก
- ส่ง traffic มายังแอปที่รันอยู่ในเครื่อง

ตัวอย่าง config:

```yml
ingress:
  - hostname: promptpay.thiraphat.work
    service: http://10.33.1.34:8082
  - service: http_status:404
```

ภาพรวมคือ:

```text
User -> promptpay.thiraphat.work -> Cloudflare Tunnel -> Docker Container -> Nginx -> Web App
```

## ข้อดีของการใช้ Docker กับโปรเจกต์นี้

- setup ง่าย
- deploy ซ้ำได้
- แยกจากระบบหลัก
- ใช้งานบน server ได้สะอาด
- ย้ายเครื่องง่าย
- อัปเดตง่าย
- เหมาะกับ static web app มาก

## ข้อควรระวัง

### 1. Docker ต้องมีสิทธิ์ใช้งาน

บางเครื่อง user ปกติอาจไม่มีสิทธิ์เข้าถึง Docker socket

จึงอาจต้องใช้:

```bash
sudo docker ...
```

### 2. พอร์ตอาจชนกับ service อื่น

ก่อน run ควรเช็กว่า port ที่จะใช้ยังว่าง เช่น `8082`

### 3. ถ้าแก้ไฟล์แล้วไม่ rebuild จะไม่เห็นการเปลี่ยนแปลง

เพราะ container ใช้ไฟล์จาก image ที่ build ไปแล้ว

ถ้าแก้โค้ด ต้อง build ใหม่

## สรุปว่า Docker ทำอะไรในโปรเจกต์นี้

Docker ในโปรเจกต์นี้ **ไม่ได้มีไว้สร้าง QR**

Docker มีไว้เพื่อ:

- เอาเว็บทั้งก้อนไปรัน
- เสิร์ฟเว็บผ่าน Nginx
- ทำให้ deploy ง่าย
- ทำให้ย้ายเครื่องง่าย
- ทำให้ production ใช้งานได้เป็นระบบ

ถ้าจะสรุปสั้นที่สุด:

> Docker คือวิธีแพ็กและรันเว็บแอปนี้ให้พร้อมใช้งานบนเครื่องไหนก็ได้ โดยไม่ต้องตั้งค่าเว็บเซิร์ฟเวอร์เองทุกครั้ง

## ถ้าจะอ่านไฟล์เริ่มจากอะไร

ถ้าสนใจฝั่ง Docker ให้เริ่มอ่านตามนี้:

1. `Dockerfile`
2. `nginx.conf`
3. `.dockerignore`
4. วิธี build / run ใน README นี้

ถ้าสนใจฝั่งหน้าเว็บค่อยอ่าน:

1. `index.html`
2. `styles.css`
3. `app.js`

## อ้างอิง

### อ้างอิงด้าน PromptPay

- ธนาคารแห่งประเทศไทย: PromptPay  
  https://www.bot.or.th/th/financial-innovation/digital-finance/digital-payment/promptpay.html

- สมาคมธนาคารไทย: พร้อมเพย์  
  https://www.tba.or.th/pso-tb-cert/pso/pso-service/

- ธนาคารแห่งประเทศไทย: Cross-Border Payment  
  https://www.bot.or.th/th/financial-innovation/digital-finance/digital-payment/cross-border-payment.html

### อ้างอิงด้านเทคนิค

- Docker Overview  
  https://docs.docker.com/get-started/docker-overview/

- Dockerfile reference  
  https://docs.docker.com/reference/dockerfile/

- Docker `build` command  
  https://docs.docker.com/reference/cli/docker/buildx/build/

- Docker `run` command  
  https://docs.docker.com/reference/cli/docker/container/run/

- Nginx official documentation  
  https://nginx.org/en/docs/

- Cloudflare Tunnel documentation  
  https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/

- Cloudflare Tunnel ingress rules  
  https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/configure-tunnels/local-management/configuration-file/

### อ้างอิง library ที่ใช้

- `qrcodejs`  
  https://cdnjs.com/libraries/qrcodejs

- `promptpay-qr` by dtinth  
  https://github.com/dtinth/promptpay-qr
