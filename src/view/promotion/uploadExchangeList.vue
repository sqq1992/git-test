<template>
    <div class="vedio">
    <article class="markdown-body" id="preview" data-open-title="Hide Preview" data-closed-title="Show Preview"><div><h1 data-source-line="1" id="批量发放实物礼品"><a class="markdownIt-Anchor" href="#批量发放实物礼品"></a>批量发放实物礼品</h1>
    <h5 data-source-line="2" id="step1"><a class="markdownIt-Anchor" href="#step1"></a>Step1</h5>
    <p data-source-line="3">进入“旺店会员”插件，找到“积分互动-积分商城-兑换记录”页面，点击“批量导出未发放实物礼品兑换记录”</p>
    <pre data-source-line="5"><code class="hljs"><span class="hljs-bullet">1. </span>系统只会导出“礼品类型”为“实物奖品”、“发放状态”为“未发放”，并且会员已确认了收货信息的兑换记录。
    <span class="hljs-bullet">2. </span>若会员还未确认收货信息，则无法导出数据。</code></pre><p data-source-line="8"><img src="../../assets/img/promotion/exchange/1.png"></p>
    <h5 data-source-line="10" id="step2"><a class="markdownIt-Anchor" href="#step2"></a>Step2</h5>
    <p data-source-line="11">下载文件，添加文件的后缀名（.xls）</p>
    <pre data-source-line="13"><code class="hljs"><span class="hljs-bullet">1. </span>京麦工作台会对下载的文件进行处理，去掉文件的后缀名，因此需要商家手工添加。
    <span class="hljs-bullet">2. </span>批量发放实物礼品时系统会对文件后缀名进行校验，请及时将文件修改为.xls文件。</code></pre><p data-source-line="16"><img src="../../assets/img/promotion/exchange/2.png"></p>
    <h5 data-source-line="18" id="step3"><a class="markdownIt-Anchor" href="#step3"></a>Step3</h5>
    <p data-source-line="19">打开文件，查看收货信息。可根据自身情况将兑换数据导入其他第三方erp或打单软件中进行打单发货。
    <img src="../../assets/img/promotion/exchange/3.png"></p>
    <h5 data-source-line="22" id="step4"><a class="markdownIt-Anchor" href="#step4"></a>Step4</h5>
    <p data-source-line="23">发货成功后，请根据订单号依次填写对应的物流单号并保存，之后在“旺店会员”中点击“批量发放实物礼品”按钮，选择填写了物流单号的.xls文件，上传。</p>
    <pre data-source-line="25"><code class="hljs">上传成功后系统会自动根据订单号更新对应兑换记录的物流单号和发放状态。</code></pre><p data-source-line="27"><img src="../../assets/img/promotion/exchange/4.png"></p>
    </div></article>
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
        h1, h2, h3, h4, h5, h6{
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
            line-height: 1.25;
        }
        h5, h6{
            font-size: 1em;
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
        pre{
            padding: 16px;
            overflow: auto;
            font-size: 85%;
            line-height: 1.45;
            background-color: #f6f8fa;
            border-radius: 3px;
            code{
                display: inline;
                max-width: auto;
                padding: 0;
                margin: 0;
                overflow: visible;
                line-height: inherit;
                word-wrap: normal;
                background-color: transparent;
                border: 0;
            }
            &>code{
                padding: 0;
                margin: 0;
                font-size: 100%;
                word-break: normal;
                white-space: pre;
                background: 0 0;
                border: 0;
            }
        }
    }
    .hljs-bullet, .hljs-symbol{
        color: #990073;
    }
</style>
