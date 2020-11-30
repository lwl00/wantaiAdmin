# 创美 e 药积分商城管理端

本项目不作为代码发布，仅为前端代码管理。需要配合后端项目 BonusPoints 进行发布

## 项目 gitlab 分支命名

项目按照需求功能点开发，每个需求对应一个功能分支，功能分支创建必须基于 develop 分支进行创建

```
master  主分支

develop  开发测试分支

release/ 发布版本
release/pre-prod  预发布分支
release/prod      发布分支

feature/ 功能分支
feature/2020积分上线

```

## 安装依赖

```bash
- 下载
git clone http://10.16.17.41/cmyy_develop/pointsWeb.git

- 安装依赖
npm install

- 开发模式运行
npm run dev

- 编译项目
npm run build -- pre  或者  npm run build -- prod 或者 npm run build 开发测试环境，

预部署(正式)环境，部署(正式)环境，不用跨域，api=''

- 打包文件分析
npm run build --report

```

## 上线步骤

> 1、本地打包 npm run build

> 2、将打包的 dist 文件放在后端项目 BonusPoints 中 http://10.16.17.41/cmyy_develop/BonusPoints.git

> 3、提交后端项目 BonusPoints 到 gitlab，服务器会自动重启，更新前端界面

> 4、提交本项目 pointsWeb 到 gitlab，不更新前端界面
