<template>
    <div class="vedio">
        <article class="markdown-body" id="preview">
            <h1>如何获取视频链接</h1>
            <div>
                <p>1.使用浏览器登录京东商家后台，进入“我的店铺”-“媒体资源管理中心”。
                    <img src="../../assets/img/promotion/video/video_help_1.png">
                </p>
                <p>2.找到想要使用的店铺视频，点击“预览”。
                    <img src="../../assets/img/promotion/video/video_help_2.png">
                </p>
                <p>3.播放视频，在视频播放区域点击鼠标右键，会出现“复制视频地址”，点击复制即可。
                    <img src="../../assets/img/promotion/video/video_help_3.png">
                </p>
            </div>
        </article>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="less" scoped>
    .vedio{
        width: 100%;
        height: 100%;
        background: #fff;
    }
    h1{
        padding-bottom: 30px;
    }
    .markdown-body{
        min-width: 256px;
        max-width: 978px;
        margin: 0 auto;
        padding: 20px;
        font-size: 14px;
        &:before{
            display: table;
            content: "";
        }
        *{
            box-sizing: border-box;
        }
        p{
            margin-top: 0;
            margin-bottom: 16px;
        }
        img{
            max-width: 100%;
            box-sizing: content-box;
            background-color: #fff;
            border-style: none;
        }
    }
</style>
