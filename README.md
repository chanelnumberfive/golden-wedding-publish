# golden-wedding-publish
金婚

首先引入
<link rel="stylesheet" href="css/blz-golden-wedding.css">

然后引入html结构
注意data属性必须加data-blz-goldenwedding为初始化金婚模块生成金婚画板，data-index="0"表示这是页面里的第几个金婚动画
<div class="blz-photo">
    <div class="blz-photo-wisher">
    </div>
    <ul class="blz-photo-wall box clear" data-blz-goldenwedding data-index="0"></ul>
</div>
<div class="blz-photo">
    <div class="blz-photo-wisher">
    </div>
    <ul class="blz-photo-wall box clear" data-blz-goldenwedding data-index="1"></ul>
</div>

请在body结尾处引入js文件可用jQuery替代zepto
<script src="js/zepto.js"></script>
<script src="js/blz-golden-wedding.1.js"></script>
