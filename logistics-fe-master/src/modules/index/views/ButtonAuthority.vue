<template>
    <div>
        <div class="row">
            <Button class="button" type="primary">没有设置权限的按钮</Button>
            <span class="span">没有设置权限的按钮永远可见</span>
        </div>
        <div class="row">
            <Button class="button" type="primary" v-display="{btnFdKey: 'auth_button',menuFdKey: 'button_authority'}">设置了权限的按钮</Button>
            <span class="span">设置了权限的按钮只有在后台授了权才可见</span>
        </div>
        <hr>
        <div class="row" style="padding:12px">
            <h4>框架内置 v-dispaly 指令，需要传入两个参数：</h4>
            <p>btnFdKey : 后台设置的按钮的唯一标识</p>
            <p>menuFdKey : 后台设置的该按钮所在页面对应的菜单的唯一标识</p>
            <p style="color:#666666;">核心代码 : <pre>v-display="{btnFdKey: 'auth_button',menuFdKey: 'button_authority'}"</pre></p>
        </div>
        <div class="row">
            <pre>{{ pre }}</pre>
        </div>
    </div>
</template>

<script>
export default {
    name: 'button_authority',
    data() {
        return {
            pre: `
    <template>
      <div>
        <div class="row">
          <Button class="button" type="primary">没有设置权限的按钮</Button>
          <span class="span">没有设置权限的按钮永远可见</span>
        </div>
        <div class="row">
          <Button class="button" type="primary" v-display="{btnFdKey: 'auth_button',menuFdKey: 'button_authority'}">设置了权限的按钮</Button>
          <span class="span">设置了权限的按钮只有在后台授了权才可见</span>
        </div>
      </div>
    </template>
      `
        };
    }
};
</script>

<style lang="less" scoped>
.row {
    margin: 12px auto;

    .button {
        margin-right: 24px;
    }

    .span {
        color: #cccccc;
    }
}

p {
    color: #999999;
    line-height: 24px;

    h4 {
        color: #999999;
    }
}
</style>
