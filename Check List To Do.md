# Khởi tạo project AngularCLI
1. Cài đặt Node.js trên máy
2. Command Prompt: Crl + Alt + 1
npm install -g @angular/cli
3. Mở IntelliJ IDEA Chọn new project => Static Web => AngularCLI
4. Open Terminal (Alt+F12):
npm install @angular/core

==> OK we can run now ^^
Có thể chạy thêm "npm audit fix" nếu cần

# Đổi cổng chạy của AngularCLI
"angular.json":
{
    "projects": {
        "CMS": {
            "architect": {
                "serve": {
                    "options": {
                        "host": "192.168.1.29",
                        "port": 7777
                    }
                }
            }
        }
    }
}

# Tạo trang đăng nhập
Link tham khảo: https://www.devglan.com/spring-security/spring-boot-oauth2-angular

# Implement CSS to makeup @@
Terminal: \
    npm install bootstrap --save-dev \
    npm install jquery --save-dev \
"angular.json"\
    "styles": [
      "./node_modules/bootstrap/dist/css/bootstrap.css",
      "./src/styles.css"
    ],
    "scripts": [
      "./node_modules/jquery/dist/jquery.js",
      "./node_modules/bootstrap/dist/js/bootstrap.js"
    ]

Lưu ý: xs (phones), sm (tablets), md (desktops), and lg (larger desktops)

# sử dụng Cookie
Terminal:\
npm install ngx-cookie-service\
File "app.module.ts"\
@NgModule => providers => CookieService

# "auth.guard.ts"
Khi chưa có session Token thì đá ra cho nó logn

# "error.interceptor.ts"
Khi token expire thì đá nó đi luôn ^^

# Vẽ Menu
https://stackblitz.com/edit/dynamic-nested-sidenav-menu?file=app%2Fapp.module.ts \
Terminal\
npm install @angular/cdk --save \
npm install @angular/material --save \
npm install material-design-icons --save \
npm install web-animations-js --save \
npm install hammerjs --save \
npm install core-js --save \
"angular.json"\
    "styles": [
      "./node_modules/material-design-icons/iconfont/material-icons.css",
      ......
      "./src/styles.css"
    ]


# Work FULL CRUD with 1 Entity
1. Khai báo module/service/component vào file "app.module.ts"
2. Khai báo định tuyến URL vào file "app.routing.ts"

#### Phân trang:
Cài đặt thêm terminal:
npm install ngx-pagination --save\
File "app.module.ts"
@NgModule => imports => NgxPaginationModule


# Multi Language
Cài đặt thêm terminal:
npm install @ngx-translate/core --save \
npm install @ngx-translate/http-loader --save \
File "app.module.ts" \
export function HttpLoaderFactory(http: HttpClient) { \
  return new TranslateHttpLoader(http, './assets/i18n/', '.json'); \
} \
@NgModule => imports => 
TranslateModule.forRoot({
  loader: {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    deps: [HttpClient]
  }
}),
@NgModule => providers => 
{ provide: MatPaginatorIntl, useClass: MultilanguagePanigator },

# Material design multi theme
Sử dụng OverlayContainer để update CSS class cho form tổng
Khai báo các theme ở trong file "customize_theme.scss"

# Demo Dashboard ^^
Cài đặt thêm terminal: \
npm install @swimlane/ngx-charts --save \
npm install ng-animate --save \
npm install -save @covalent/core \
npm install @angular/flex-layout --save \
@NgModule => imports => MatDatepickerModule, FormsModule, FlexLayoutModule,
@NgModule => bootstrap => DashboardComponent

# Image
npm install @material/image-list --save

# Filesaver
npm install ngx-filesaver --save \
@NgModule => imports => FileSaverModule

# Thêm mới component
Thêm mới component với đủ các thành phần bằng terminal: \
ng g c po/s-d-po --module app \
ng g c po/a-e-po --module app \


# Chạy google map
npm install @agm/core --save \
@NgModule => imports => 
AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBApmhcVLWh-c_oYZhTeeiRSFZkpzg6mk4'
    }) \
Get API key: https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en


npm install @google/maps --save \
npm install @types/google__maps --save


# ???
Kiểm soát error exception from response \
Hidden access_token of request (STOMP?)\
reload request when login
